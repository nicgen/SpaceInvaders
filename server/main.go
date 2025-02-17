// main.go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sort"
	"sync"
	"time"
	"github.com/gorilla/mux"
)

type Score struct {
	Name  string `json:"name"`
	Rank  int    `json:"rank"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

type Scoreboard struct {
	Scores []Score `json:"scores"`
	mu     sync.RWMutex
	file   string
}

func NewScoreboard(filename string) *Scoreboard {
	sb := &Scoreboard{
		file: filename,
	}
	sb.loadScores()
	return sb
}

func (sb *Scoreboard) loadScores() {
	data, err := os.ReadFile(sb.file)
	if err != nil {
		if !os.IsNotExist(err) {
			log.Printf("Error reading scoreboard file: %v", err)
		}
		return
	}

	sb.mu.Lock()
	defer sb.mu.Unlock()

	err = json.Unmarshal(data, &sb.Scores)
	if err != nil {
		log.Printf("Error unmarshaling scoreboard data: %v", err)
	}
}

func (sb *Scoreboard) saveScores() error {
	sb.mu.RLock()
	defer sb.mu.RUnlock()

	data, err := json.MarshalIndent(sb.Scores, "", "  ")
	if err != nil {
		return fmt.Errorf("error marshaling scoreboard data: %v", err)
	}

	err = os.WriteFile(sb.file, data, 0644)
	if err != nil {
		return fmt.Errorf("error writing scoreboard file: %v", err)
	}

	return nil
}

func (sb *Scoreboard) updateRanks() {
	sort.Slice(sb.Scores, func(i, j int) bool {
		return sb.Scores[i].Score > sb.Scores[j].Score
	})

	for i := range sb.Scores {
		sb.Scores[i].Rank = i + 1
	}
}

func (sb *Scoreboard) addScore(score Score) error {
	if len(score.Name) < 3 || len(score.Name) > 8 {
		return fmt.Errorf("name must be between 3 and 8 characters")
	}

	sb.mu.Lock()
	sb.Scores = append(sb.Scores, score)
	sb.updateRanks()
	sb.mu.Unlock()

	return sb.saveScores()
}

func (sb *Scoreboard) getScores() []Score {
	sb.mu.RLock()
	defer sb.mu.RUnlock()

	scores := make([]Score, len(sb.Scores))
	copy(scores, sb.Scores)
	return scores
}

// Handler functions
func (sb *Scoreboard) getScoresHandler(w http.ResponseWriter, r *http.Request) {
	scores := sb.getScores()
	json.NewEncoder(w).Encode(scores)
}

func (sb *Scoreboard) addScoreHandler(w http.ResponseWriter, r *http.Request) {
	var score Score
	if err := json.NewDecoder(r.Body).Decode(&score); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := sb.addScore(score); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// Middleware
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.RequestURI)
		next.ServeHTTP(w, r)
	})
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	sb := NewScoreboard("scoreboard.json")

	// Create new router
	r := mux.NewRouter()

	// Apply global middleware
	r.Use(loggingMiddleware)
	r.Use(corsMiddleware)

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/scores", sb.getScoresHandler).Methods("GET")
	api.HandleFunc("/scores", sb.addScoreHandler).Methods("POST")

	// Start server
	srv := &http.Server{
		Handler:      r,
		Addr:         ":8080",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("Server starting on :8080...")
	log.Fatal(srv.ListenAndServe())
}
