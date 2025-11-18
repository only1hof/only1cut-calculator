// Leaderboard data stored in localStorage
let leaderboard = JSON.parse(localStorage.getItem('only1cut_leaderboard')) || {};

function calculateWinner() {
    const name1 = document.getElementById('name1').value.trim().toLowerCase();;
    const name2 = document.getElementById('name2').value.trim().toLowerCase();;
    const side1a = parseFloat(document.getElementById('side1a').value);
    const side1b = parseFloat(document.getElementById('side1b').value);
    const side2a = parseFloat(document.getElementById('side2a').value);
    const side2b = parseFloat(document.getElementById('side2b').value);
    
    // Validation
    if (!name1 || !name2) {
        alert('Please enter both player names!');
        return;
    }
    
    if (isNaN(side1a) || isNaN(side1b) || isNaN(side2a) || isNaN(side2b)) {
        alert('Please enter all weights!');
        return;
    }
    
    if (side1a <= 0 || side1b <= 0 || side2a <= 0 || side2b <= 0) {
        alert('All weights must be greater than zero!');
        return;
    }
    
    // Calculate percentages
    const total1 = side1a + side1b;
    const diff1 = Math.abs(side1a - side1b);
    const percentDiff1 = (diff1 / total1) * 100;
    
    const total2 = side2a + side2b;
    const diff2 = Math.abs(side2a - side2b);
    const percentDiff2 = (diff2 / total2) * 100;
    
    // Display results
    document.getElementById('result1name').textContent = name1;
    document.getElementById('result1diff').textContent = percentDiff1.toFixed(2) + '%';
    document.getElementById('result1details').innerHTML = 
        `<span class="digit">${side1a}g</span> + <span class="digit">${side1b}g</span> = <span class="digit">${total1}g</span> (<span class="digit">${diff1.toFixed(1)}g</span> difference)`;
    
    document.getElementById('result2name').textContent = name2;
    document.getElementById('result2diff').textContent = percentDiff2.toFixed(2) + '%';
    document.getElementById('result2details').innerHTML = 
        `<span class="digit">${side2a}g</span> + <span class="digit">${side2b}g</span> = <span class="digit">${total2}g</span> (<span class="digit">${diff2.toFixed(1)}g</span> difference)`;
    
    // Determine winner
    let winner, loser;
    const winnerDiv = document.getElementById('winner');
    
    if (percentDiff1 < percentDiff2) {
        winner = name1;
        loser = name2;
        winnerDiv.textContent = `🏆 ${name1.toUpperCase()} WINS!`;
    } else if (percentDiff2 < percentDiff1) {
        winner = name2;
        loser = name1;
        winnerDiv.textContent = `🏆 ${name2.toUpperCase()} WINS!`;
    } else {
        winnerDiv.textContent = `🤝 IT'S A TIE!`;
        // For ties, don't update leaderboard
        document.getElementById('mainPage').style.display = 'none';
        document.getElementById('results').classList.add('show');
        return;
    }
    
    // Update leaderboard
    updateLeaderboard(winner, loser, {
        winnerScore: percentDiff1 < percentDiff2 ? percentDiff1 : percentDiff2,
        loserScore: percentDiff1 < percentDiff2 ? percentDiff2 : percentDiff1
    });
    
    // Show results page
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('results').classList.add('show');
}

function updateLeaderboard(winner, loser, scores) {
    // Initialize players if they don't exist
    if (!leaderboard[winner]) {
        leaderboard[winner] = { wins: 0, losses: 0, totalMatches: 0, bestScore: Infinity };
    }
    if (!leaderboard[loser]) {
        leaderboard[loser] = { wins: 0, losses: 0, totalMatches: 0, bestScore: Infinity };
    }
    
    // Update winner stats
    leaderboard[winner].wins++;
    leaderboard[winner].totalMatches++;
    if (scores.winnerScore < leaderboard[winner].bestScore) {
        leaderboard[winner].bestScore = scores.winnerScore;
    }
    
    // Update loser stats
    leaderboard[loser].losses++;
    leaderboard[loser].totalMatches++;
    if (scores.loserScore < leaderboard[loser].bestScore) {
        leaderboard[loser].bestScore = scores.loserScore;
    }
    
    // Save to localStorage
    localStorage.setItem('only1cut_leaderboard', JSON.stringify(leaderboard));
}

function nextMatch() {
    // Clear inputs
    document.getElementById('name1').value = '';
    document.getElementById('name2').value = '';
    document.getElementById('side1a').value = '';
    document.getElementById('side1b').value = '';
    document.getElementById('side2a').value = '';
    document.getElementById('side2b').value = '';
    
    // Go back to main page
    document.getElementById('results').classList.remove('show');
    document.getElementById('mainPage').style.display = 'block';
}

function showLeaderboard() {
    // Hide other pages
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('results').classList.remove('show');
    
    // Display leaderboard
    const container = document.getElementById('leaderboardContainer');
    
    if (Object.keys(leaderboard).length === 0) {
        container.innerHTML = '<div class="no-data">No matches recorded yet</div>';
    } else {
        // Sort players by: 1) wins (descending), 2) best score (ascending - lower is better)
        const sortedPlayers = Object.entries(leaderboard).sort((a, b) => {
            // First compare wins
            if (b[1].wins !== a[1].wins) {
                return b[1].wins - a[1].wins;
            }
            // Then compare best scores (lower percentage is better)
            return a[1].bestScore - b[1].bestScore;
        });
        
        let html = '';
        sortedPlayers.forEach(([name, stats], index) => {
            const rank = index + 1;
            const topClass = rank <= 3 ? `top-3 rank-${rank}` : '';
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
            
            html += `
                <div class="leaderboard-item ${topClass}">
                    ${medal ? `<span class="medal">${medal}</span>` : ''}
                    <div class="leaderboard-rank">#${rank}</div>
                    <div class="leaderboard-info">
                        <div class="leaderboard-name">${name}</div>
                        <div class="leaderboard-stats">
                            ${stats.totalMatches} matches | Best: ${stats.bestScore.toFixed(2)}%
                        </div>
                    </div>
                    <div class="leaderboard-record">
                        <div class="leaderboard-wins">${stats.wins}W</div>
                        <div class="leaderboard-losses">${stats.losses}L</div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // Show leaderboard page
    document.getElementById('leaderboardPage').classList.add('show');
}

function backToCompetition() {
    document.getElementById('leaderboardPage').classList.remove('show');
    
    // Decide which page to show
    if (document.getElementById('results').classList.contains('show')) {
        document.getElementById('results').classList.add('show');
    } else {
        document.getElementById('mainPage').style.display = 'block';
    }
}

function resetLeaderboard() {
    if (confirm('Are you sure you want to reset the leaderboard? This cannot be undone!')) {
        leaderboard = {};
        localStorage.removeItem('only1cut_leaderboard');
        showLeaderboard(); // Refresh the display
        alert('Leaderboard has been reset!');
    }
}
