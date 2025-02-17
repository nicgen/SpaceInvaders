package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"os"
	"sort"
	"strings"
	"sync"
	"time"
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
func (sb *Scoreboard) getScoresHandler(w http.ResponseWriter, _ *http.Request) {
	scores := sb.getScores()
	err := json.NewEncoder(w).Encode(scores)
	if err != nil {
		return
	}
}

func (sb *Scoreboard) addScoreHandler(w http.ResponseWriter, r *http.Request) {
	// Check for the secret token in the headers
	if r.Header.Get("Authorization") != os.Getenv("SECRET_TOKEN") {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

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

// LoadEnv loads environment variables from a .env file
func LoadEnv(filename string) error {
	file, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		// Skip empty lines and comments
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		// Split the line into key and value
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])
		err := os.Setenv(key, value)
		if err != nil {
			return err
		} // Set the environment variable
	}

	return scanner.Err()
}

func main() {
	// Load environment variables from .env file
	err := LoadEnv(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	sb := NewScoreboard("scoreboard.json")

	// Create new router
	r := mux.NewRouter()

	// Apply global middleware
	r.Use(loggingMiddleware)
	r.Use(corsMiddleware)
	r.Use(securityHeaders) // Add security headers middleware
	r.Use(rateLimit)       // Add rate limiting middleware

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

// Middleware to set security headers
func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Content-Security-Policy", "default-src 'self'")
		next.ServeHTTP(w, r)
	})
}

// Simple rate limiting middleware
var requestCounts = make(map[string]int)

func rateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr
		requestCounts[ip]++
		if requestCounts[ip] > 100 { // Limit to 100 requests
			http.Error(w, "Too many requests", http.StatusTooManyRequests)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Logging middleware
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request: %s %s", r.Method, r.URL)
		next.ServeHTTP(w, r)
	})
}

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Adjust as needed
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		if r.Method == http.MethodOptions {
			return
		}
		next.ServeHTTP(w, r)
	})
}
