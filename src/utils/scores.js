export class ScoreboardManager {
    constructor(apiUrl = 'http://localhost:8080') {
        this.apiUrl = apiUrl;
        this.gameTimer = new GameTimer();
        this.ws = null;
        this.onScoreUpdate = null;
        this.connectWebSocket();
    }

    connectWebSocket() {
        this.ws = new WebSocket(`ws://${this.apiUrl.replace('http://', '')}/ws`);

        this.ws.onmessage = (event) => {
            const scores = JSON.parse(event.data);
            if (this.onScoreUpdate) {
                this.onScoreUpdate(scores);
            }
            this.updateScoreboardDisplay(scores);
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed. Trying to reconnect...');
            setTimeout(() => this.connectWebSocket(), 5000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    async submitScore(name, score) {
        const timeStr = this.gameTimer.getTimeInMinutes();

        try {
            const response = await fetch(`${this.apiUrl}/api/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    score: score,
                    time: timeStr
                })
            });

            const data = await response.json();
            return data.percentile;
        } catch (error) {
            console.error('Error submitting score:', error);
            throw error;
        }
    }

    updateScoreboardDisplay(scores) {
        const container = document.getElementById('scoreboard-container');
        if (!container) return;

        let html = '<table class="scoreboard">';
        html += '<tr><th>Rank</th><th>Name</th><th>Score</th><th>Time</th></tr>';

        scores.forEach(score => {
            html += `
                <tr>
                    <td>${score.rank}</td>
                    <td>${score.name}</td>
                    <td>${score.score}</td>
                    <td>${score.time}</td>
                </tr>
            `;
        });

        html += '</table>';
        container.innerHTML = html;
    }

    // Cleanup method to close WebSocket connection
    cleanup() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Keep the GameTimer class the same as before
export class GameTimer {
    constructor() {
        this.startTime = null;
        this.endTime = null;
    }

    start() {
        this.startTime = performance.now();
        this.endTime = null;
    }

    stop() {
        this.endTime = performance.now();
    }

    getTimeInMinutes() {
        if (!this.startTime || !this.endTime) return "00:00";

        const timeInMs = this.endTime - this.startTime;
        const minutes = Math.floor(timeInMs / (1000 * 60));
        const seconds = Math.floor((timeInMs % (1000 * 60)) / 1000);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}