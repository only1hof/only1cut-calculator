// Leaderboard data stored in localStorage
let leaderboard = JSON.parse(localStorage.getItem('only1cut_leaderboard')) || {};

// Emoji celebration function
function createEmojiCelebration(winner) {
    const emojis = ['🎉', '🎊', '✨', '🌟', '💫', '⭐', '🏆', '👏', '🎈', '🔥'];
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    
    // Create 30 emojis
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'emoji-celebration';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.top = '100%';
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 3000);
        }, i * 50);
    }
    
    // Create confetti
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Shake animation for errors
function shakeElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
}

// Add shake animation to CSS dynamically if not present
if (!document.querySelector('style[data-shake]')) {
    const style = document.createElement('style');
    style.setAttribute('data-shake', 'true');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
}

function calculateWinner() {
    const name1Input = document.getElementById('name1');
    const name2Input = document.getElementById('name2');
    const name1 = name1Input.value.trim().toLowerCase();
    const name2 = name2Input.value.trim().toLowerCase();
    const side1a = parseFloat(document.getElementById('side1a').value);
    const side1b = parseFloat(document.getElementById('side1b').value);
    const side2a = parseFloat(document.getElementById('side2a').value);
    const side2b = parseFloat(document.getElementById('side2b').value);
    
    // Validation with shake animations
    if (!name1 || !name2) {
        if (!name1) shakeElement('name1');
        if (!name2) shakeElement('name2');
        alert('Please enter both player names!');
        return;
    }
    
    if (isNaN(side1a) || isNaN(side1b) || isNaN(side2a) || isNaN(side2b)) {
        if (isNaN(side1a)) shakeElement('side1a');
        if (isNaN(side1b)) shakeElement('side1b');
        if (isNaN(side2a)) shakeElement('side2a');
        if (isNaN(side2b)) shakeElement('side2b');
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
        `${side1a}g + ${side1b}g = ${total1}g (${diff1.toFixed(1)}g difference)`;
    
    document.getElementById('result2name').textContent = name2;
    document.getElementById('result2diff').textContent = percentDiff2.toFixed(2) + '%';
    document.getElementById('result2details').innerHTML = 
        `${side2a}g + ${side2b}g = ${total2}g (${diff2.toFixed(1)}g difference)`;
    
    // Determine winner
    let winner, loser;
    const winnerDiv = document.getElementById('winner');
    
    if (percentDiff1 < percentDiff2) {
        winner = name1;
        loser = name2;
        winnerDiv.textContent = `🏆 ${name1.toUpperCase()} WINS! 🏆`;
    } else if (percentDiff2 < percentDiff1) {
        winner = name2;
        loser = name1;
        winnerDiv.textContent = `🏆 ${name2.toUpperCase()} WINS! 🏆`;
    } else {
        winnerDiv.textContent = `🤝 IT'S A TIE! 🤝`;
        // For ties, show results but don't update leaderboard
        document.getElementById('mainPage').style.display = 'none';
        document.getElementById('resultsPage').style.display = 'flex';
        return;
    }
    
    // Update leaderboard
    updateLeaderboard(winner, loser, {
        winnerScore: percentDiff1 < percentDiff2 ? percentDiff1 : percentDiff2,
        loserScore: percentDiff1 < percentDiff2 ? percentDiff2 : percentDiff1
    });
    
    // Show results page
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('resultsPage').style.display = 'flex';
    
    // Add pulse animation to winner after page is shown
    setTimeout(() => {
        if (winnerDiv) {
            winnerDiv.classList.add('pulse');
        }
    }, 100);
    
    // Trigger celebration after a short delay
    setTimeout(() => {
        createEmojiCelebration(winner);
    }, 500);
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
    // Clear inputs with fade animation
    const inputs = ['name1', 'name2', 'side1a', 'side1b', 'side2a', 'side2b'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.style.transition = 'opacity 0.3s';
            input.style.opacity = '0';
            setTimeout(() => {
                input.value = '';
                input.style.opacity = '1';
            }, 300);
        }
    });
    
    // Remove pulse from winner
    const winnerDiv = document.getElementById('winner');
    if (winnerDiv) {
        winnerDiv.classList.remove('pulse');
    }
    
    // Go back to main page
    setTimeout(() => {
        document.getElementById('resultsPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'flex';
    }, 300);
}

function showLeaderboard() {
    // Hide other pages
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('resultsPage').style.display = 'none';
    
    // Display leaderboard
    const container = document.getElementById('leaderboardContainer');
    
    if (!container) return;
    
    if (Object.keys(leaderboard).length === 0) {
        container.innerHTML = '<div class="no-data">No matches recorded yet 🎯</div>';
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
                <div class="leaderboard-item ${topClass}" style="animation-delay: ${index * 0.1}s">
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
    
    // Show leaderboard page with animation
    document.getElementById('leaderboardPage').style.display = 'flex';
}

function backToCompetition() {

    document.getElementById('name1').value = '';
    document.getElementById('name2').value = '';
    document.getElementById('side1a').value = '';
    document.getElementById('side1b').value = '';
    document.getElementById('side2a').value = '';
    document.getElementById('side2b').value = '';

    // Add exit animation
    const leaderboardPage = document.getElementById('leaderboardPage');
    
    if (!leaderboardPage) return;
    
    leaderboardPage.style.animation = 'slideOutLeft 0.5s ease-out';
    
    setTimeout(() => {
        leaderboardPage.style.display = 'none';
        leaderboardPage.style.animation = '';
        
        // Decide which page to show
        const resultsPage = document.getElementById('resultsPage');
        
        if (resultsPage && resultsPage.style.display === 'flex') {
            resultsPage.style.display = 'flex';
        } else {
            document.getElementById('mainPage').style.display = 'flex';
        }
    }, 500);
}

function resetLeaderboard() {
    if (confirm('Are you sure you want to reset the leaderboard? This cannot be undone! 🗑️')) {
        // Animate out all leaderboard items
        const items = document.querySelectorAll('.leaderboard-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'slideOutLeft 0.5s ease-out';
                item.style.opacity = '0';
            }, index * 50);
        });
        
        setTimeout(() => {
            leaderboard = {};
            localStorage.removeItem('only1cut_leaderboard');
            showLeaderboard();
            
            // Show success emojis
            const successEmojis = ['✅', '🗑️', '✨', '💫'];
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const emoji = document.createElement('div');
                    emoji.className = 'emoji-celebration';
                    emoji.textContent = successEmojis[Math.floor(Math.random() * successEmojis.length)];
                    emoji.style.left = Math.random() * 100 + '%';
                    emoji.style.top = '50%';
                    document.body.appendChild(emoji);
                    
                    setTimeout(() => emoji.remove(), 3000);
                }, i * 100);
            }
        }, items.length * 50 + 500);
    }
}
