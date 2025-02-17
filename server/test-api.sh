#!/bin/bash

# Define the base URL and the secret token
BASE_URL="http://localhost:8080/api/scores"
SECRET_TOKEN="666"

# Function to send a POST request to add a score
add_score() {
  local name=$1
  local score=$2

  response=$(curl -s -w "%{http_code}" -o /dev/null -X POST "$BASE_URL" \
    -H "Authorization: $SECRET_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$name\", \"score\": $score, \"time\": \"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\"}")
  echo "Response for $name: $response"
}

# Export the function to be used in parallel
export -f add_score

# Send concurrent requests to add scores
#parallel -j 10 add_score ::: \
#  "Joueur1" 100 \
#  "Joueur2" 200 \
#  "Joueur3" 150 \
#  "Joueur4" 300 \
#  "Joueur5" 250 \
#  "Joueur6" 400 \
#  "Joueur7" 350 \
#  "Joueur8" 500 \
#  "Joueur9" 450 \
#  "Joueur10" 600

# unique test
add_score "TestUser" 100

# Fetch and display the scores
echo "Final Scores:"
curl -s -X GET "$BASE_URL" | jq

# ref #curl -X POST http://localhost:8080/api/scores -H "Content-Type: application/json" -H "Authorization: 666" -d '{"name": "Nic", "score": 999, "time": "2023-10-01T12:01:00Z"}'