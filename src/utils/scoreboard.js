export class ScoreManager {
    constructor(apiUrl = 'http://localhost:8080', authToken) {
        this.apiUrl = apiUrl;
        this.authToken = authToken;
        this.currentScore = 0;
        this.gameTime = 0;
        this.playerName = '';
        this.scoresPerPage = 5;
        this.currentPage = 1;
        this.scores = [];
    }

    // Update current game score
    updateScore(points) {
        this.currentScore += points;
        return this.currentScore;
    }

    // Update game time
    updateTime(time) {
        this.gameTime = time;
    }

    // Get current score
    getCurrentScore() {
        return this.currentScore;
    }

    // Fetch all scores from API
    async fetchScores() {
        try {
            const response = await fetch(`${this.apiUrl}/api/scores`);
            if (!response.ok) {
                throw new Error('Failed to fetch scores');
            }
            this.scores = await response.json();
            return this.scores;
        } catch (error) {
            console.error('Error fetching scores:', error);
            return [];
        }
    }

    // Get scores for current page
    getScoresForPage(page) {
        const startIndex = (page - 1) * this.scoresPerPage;
        return this.scores.slice(startIndex, startIndex + this.scoresPerPage);
    }

    // Get total number of pages
    getTotalPages() {
        return Math.ceil(this.scores.length / this.scoresPerPage);
    }

    // Get the highest score (first in the sorted list)
    getHighScore() {
        return this.scores.length > 0 ? this.scores[0] : null;
    }

    // Submit score to the API
    async submitScore() {
        if (!this.authToken) {
            throw new Error('Authorization token not set');
        }

        if (!this.playerName || !this.isValidName(this.playerName)) {
            throw new Error('Invalid player name');
        }

        const scoreData = {
            name: this.playerName,
            score: this.currentScore,
            time: this.gameTime
        };

        try {
            const response = await fetch(`${this.apiUrl}/api/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.authToken
                },
                body: JSON.stringify(scoreData)
            });

            if (response.status === 401) {
                throw new Error('Unauthorized: Invalid token');
            }

            if (!response.ok) {
                throw new Error('Failed to submit score');
            }

            // Refresh scores after submission
            await this.fetchScores();
            return await response.json();
        } catch (error) {
            console.error('Error submitting score:', error);
            throw error;
        }
    }

    // Set authorization token
    setAuthToken(token) {
        this.authToken = token;
    }

    isValidName(name) {
        return name.length >= 3 && name.length <= 8;
    }
}

export class ScoreboardDisplay {
    constructor(containerId, scoreManager) {
        this.container = document.getElementById(containerId);
        this.scoreManager = scoreManager;
        this.createScoreboard();
    }

    createScoreboard() {
        // Create scoreboard elements
        this.scoreboard = document.createElement('div');
        this.scoreboard.className = 'scoreboard';

        // Create high score display
        this.highScoreDisplay = document.createElement('div');
        this.highScoreDisplay.className = 'high-score';

        // Create scores table
        this.scoresTable = document.createElement('table');
        this.scoresTable.className = 'scores-table';

        // Create pagination
        this.pagination = document.createElement('div');
        this.pagination.className = 'pagination';

        // Assemble scoreboard
        this.scoreboard.appendChild(this.highScoreDisplay);
        this.scoreboard.appendChild(this.scoresTable);
        this.scoreboard.appendChild(this.pagination);
        this.container.appendChild(this.scoreboard);

        // this.addStyles();
    }

    async updateDisplay() {
        // Fetch latest scores
        await this.scoreManager.fetchScores();

        // Update high score
        const highScore = this.scoreManager.getHighScore();
        this.highScoreDisplay.innerHTML = highScore ?
            `🏆 High Score: ${highScore.score} - ${highScore.name}` :
            'No scores yet';

        // Get current page scores
        const scores = this.scoreManager.getScoresForPage(this.scoreManager.currentPage);

        // Update table
        this.scoresTable.innerHTML = `
            <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Time</th>
            </tr>
            ${scores.map(score => `
                <tr>
                    <td>${score.rank}</td>
                    <td>${score.name}</td>
                    <td>${score.score}</td>
                    <td>${score.time}</td>
                </tr>
            `).join('')}
        `;

        // Update pagination
        this.updatePagination();
    }

    updatePagination() {
        const totalPages = this.scoreManager.getTotalPages();
        const currentPage = this.scoreManager.currentPage;

        this.pagination.innerHTML = `
            <button 
                ${currentPage === 1 ? 'disabled' : ''}
                onclick="this.scoreManager.currentPage = ${currentPage - 1}; this.updateDisplay();">
                Previous
            </button>
            <span>Page ${currentPage} of ${totalPages}</span>
            <button 
                ${currentPage === totalPages ? 'disabled' : ''}
                onclick="this.scoreManager.currentPage = ${currentPage + 1}; this.updateDisplay();">
                Next
            </button>
        `;
    }
}