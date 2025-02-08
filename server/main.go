package main

import (
	"encoding/json"
	"golang.org/x/time/rate"
	"log"
	"net/http"
	"os"
	"sort"
	"time"
)

type Score struct {
	Name  string    `json:"name"`
	Score int       `json:"score"`
	Date  time.Time `json:"date"`
}

var limiter = rate.NewLimiter(1, 3) // 1 request per second with a burst of 3

type Scores []Score

func (s Scores) Len() int           { return len(s) }
func (s Scores) Less(i, j int) bool { return s[i].Score > s[j].Score }
func (s Scores) Swap(i, j int)      { s[i], s[j] = s[j], s[i] }

func main() {
	// Create a new HTTP handler
	handler := http.NewServeMux()
	handler.HandleFunc("/scores", handleScores) // Register the handleScores function

	server := setupServer(handler)

	// Start the server
	log.Println("Starting server on :8080")
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}
}

func setupServer(handler http.Handler) *http.Server {
	return &http.Server{
		Addr:              "localhost:8080",
		Handler:           handler, // Removed handlers.WithErrorHandling for simplicity
		ReadHeaderTimeout: 10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       120 * time.Second,
		MaxHeaderBytes:    1 << 20,
		// ErrorLog: *log.Logger, // Uncomment and set a logger if needed
	}
}

func handleScores(w http.ResponseWriter, r *http.Request) {
	if !limiter.Allow() {
		http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
		return
	}

	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	switch r.Method {
	case "GET":
		getScores(w)
	case "POST":
		addScore(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getScores(w http.ResponseWriter) {
	scores := loadScores()
	sort.Sort(Scores(scores))
	log.Println("Getting scores")
	//json.NewEncoder(w).Encode(scores)
	// Set the content type to application/json
	w.Header().Set("Content-Type", "application/json")

	// Encode scores to JSON and handle any errors
	if err := json.NewEncoder(w).Encode(scores); err != nil {
		http.Error(w, "Failed to encode scores", http.StatusInternalServerError)
		log.Printf("Error encoding scores: %v", err)
		return
	}
}

func addScore(w http.ResponseWriter, r *http.Request) {
	var newScore Score
	if err := json.NewDecoder(r.Body).Decode(&newScore); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	newScore.Date = time.Now()
	scores := loadScores()
	scores = append(scores, newScore)

	if err := saveScores(scores); err != nil {
		http.Error(w, "Could not save score", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func loadScores() []Score {
	file, err := os.ReadFile("scores.json")
	if err != nil {
		if os.IsNotExist(err) {
			return []Score{} // Return empty slice if file does not exist
		}
		log.Printf("Error reading scores file: %v", err)
		return []Score{}
	}

	var scores []Score
	if err := json.Unmarshal(file, &scores); err != nil {
		log.Printf("Error unmarshalling scores: %v", err)
		return []Score{}
	}
	return scores
}

func saveScores(scores []Score) error {
	data, err := json.MarshalIndent(scores, "", "    ")
	if err != nil {
		return err
	}
	return os.WriteFile("scores.json", data, 0644)
}
