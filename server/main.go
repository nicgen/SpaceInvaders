package main

import (
	"encoding/json"
<<<<<<< Updated upstream
	"golang.org/x/time/rate"
=======
>>>>>>> Stashed changes
	"log"
	"net/http"
	"os"
	"sort"
<<<<<<< Updated upstream
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
=======
	"sync"

	"github.com/gorilla/websocket"
)

// ScoreEntry represents a single score entry
type ScoreEntry struct {
	Name  string `json:"name"`
	Rank  int    `json:"rank"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

// Client represents a connected websocket client
type Client struct {
	conn *websocket.Conn
	hub  *Hub
}

// Hub maintains the set of active clients
type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

// ScoreboardManager handles score data operations
type ScoreboardManager struct {
	scores []ScoreEntry
	mutex  sync.RWMutex
	file   string
	hub    *Hub
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for development
	},
}

// NewHub creates a new hub instance
func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.conn.Close()
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				err := client.conn.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Printf("error: %v", err)
					client.conn.Close()
					delete(h.clients, client)
				}
			}
		}
	}
}

// NewScoreboardManager creates a new scoreboard manager
func NewScoreboardManager(filename string, hub *Hub) *ScoreboardManager {
	sm := &ScoreboardManager{
		file: filename,
		hub:  hub,
	}
	sm.loadScores()
	return sm
}

// loadScores loads existing scores from the JSON file
func (sm *ScoreboardManager) loadScores() error {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()

	if _, err := os.Stat(sm.file); os.IsNotExist(err) {
		file, err := os.Create(sm.file)
		if err != nil {
			return err
		}
		file.Write([]byte("[]"))
		file.Close()
	}

	data, err := os.ReadFile(sm.file)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, &sm.scores)
}

// saveScores saves the current scores to the JSON file
func (sm *ScoreboardManager) saveScores() error {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()

	data, err := json.MarshalIndent(sm.scores, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(sm.file, data, 0644)
}

// AddScore adds a new score and updates rankings
func (sm *ScoreboardManager) AddScore(name string, score int, timeStr string) (float64, error) {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()

	entry := ScoreEntry{
		Name:  name,
		Score: score,
		Time:  timeStr,
	}

	sm.scores = append(sm.scores, entry)

	sort.Slice(sm.scores, func(i, j int) bool {
		return sm.scores[i].Score > sm.scores[j].Score
	})

	for i := range sm.scores {
		sm.scores[i].Rank = i + 1
	}

	if err := sm.saveScores(); err != nil {
		return 0, err
	}

	// Calculate percentile
	percentile := sm.calculatePercentile(score)

	// Broadcast updated scores to all clients
	scores := sm.GetScores(1, 5)
	scoresJSON, err := json.Marshal(scores)
	if err != nil {
		return percentile, err
	}
	sm.hub.broadcast <- scoresJSON

	return percentile, nil
}

func (sm *ScoreboardManager) calculatePercentile(score int) float64 {
	if len(sm.scores) == 0 {
		return 100
	}

	belowCount := 0
	for _, entry := range sm.scores {
		if entry.Score < score {
			belowCount++
		}
	}

	return float64(belowCount) * 100 / float64(len(sm.scores))
}

// GetScores returns paginated scores
func (sm *ScoreboardManager) GetScores(page, pageSize int) []ScoreEntry {
	sm.mutex.RLock()
	defer sm.mutex.RUnlock()

	start := (page - 1) * pageSize
	if start >= len(sm.scores) {
		return []ScoreEntry{}
	}

	end := start + pageSize
	if end > len(sm.scores) {
		end = len(sm.scores)
	}

	return sm.scores[start:end]
}

func handleWebSocket(hub *Hub, sm *ScoreboardManager, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("error upgrading connection: %v", err)
		return
	}

	client := &Client{conn: conn, hub: hub}
	hub.register <- client

	// Send initial scoreboard data
	scores := sm.GetScores(1, 5)
	scoresJSON, err := json.Marshal(scores)
	if err != nil {
		log.Printf("error marshaling scores: %v", err)
		return
	}
	conn.WriteMessage(websocket.TextMessage, scoresJSON)

	// Handle incoming messages (if needed)
	go func() {
		defer func() {
			hub.unregister <- client
		}()
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("error: %v", err)
				}
				break
			}
			log.Printf("received: %s", message)
		}
	}()
}

func main() {
	hub := NewHub()
	go hub.run()

	sm := NewScoreboardManager("scores.json", hub)

	// Handle WebSocket connections
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		handleWebSocket(hub, sm, w, r)
	})

	// Handle HTTP POST for new scores
	http.HandleFunc("/api/scores", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var input struct {
			Name  string `json:"name"`
			Score int    `json:"score"`
			Time  string `json:"time"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		percentile, err := sm.AddScore(input.Name, input.Score, input.Time)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		response := struct {
			Percentile float64 `json:"percentile"`
		}{
			Percentile: percentile,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})

	log.Println("Server starting on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
>>>>>>> Stashed changes
}
