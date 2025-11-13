function calculateWinner() {
    const name1 = document.getElementById('name1').value.trim() || 'Competitor 1';
    const name2 = document.getElementById('name2').value.trim() || 'Competitor 2';
    const side1a = parseFloat(document.getElementById('side1a').value);
    const side1b = parseFloat(document.getElementById('side1b').value);
    const side2a = parseFloat(document.getElementById('side2a').value);
    const side2b = parseFloat(document.getElementById('side2b').value);
    
    if (isNaN(side1a) || isNaN(side1b) || isNaN(side2a) || isNaN(side2b)) {
        alert('Please enter all weights!');
        return;
    }
    
    if (side1a <= 0 || side1b <= 0 || side2a <= 0 || side2b <= 0) {
        alert('All weights must be greater than zero!');
        return;
    }
    
    const total1 = side1a + side1b;
    const diff1 = Math.abs(side1a - side1b);
    const percentDiff1 = (diff1 / total1) * 100;
    
    const total2 = side2a + side2b;
    const diff2 = Math.abs(side2a - side2b);
    const percentDiff2 = (diff2 / total2) * 100;
    
    document.getElementById('result1name').textContent = name1;
    document.getElementById('result1diff').textContent = percentDiff1.toFixed(2) + '%';
    document.getElementById('result1details').innerHTML = 
        `<span class="digit">${side1a}g</span> + <span class="digit">${side1b}g</span> = <span class="digit">${total1}g</span> (<span class="digit">${diff1.toFixed(1)}g</span> difference)`;
    
    document.getElementById('result2name').textContent = name2;
    document.getElementById('result2diff').textContent = percentDiff2.toFixed(2) + '%';
    document.getElementById('result2details').innerHTML = 
        `<span class="digit">${side2a}g</span> + <span class="digit">${side2b}g</span> = <span class="digit">${total2}g</span> (<span class="digit">${diff2.toFixed(1)}g</span> difference)`;
    
    const winnerDiv = document.getElementById('winner');
    if (percentDiff1 < percentDiff2) {
        winnerDiv.textContent = `🏆 ${name1.toUpperCase()} WINS!`;
    } else if (percentDiff2 < percentDiff1) {
        winnerDiv.textContent = `🏆 ${name2.toUpperCase()} WINS!`;
    } else {
        winnerDiv.textContent = `🤝 IT'S A TIE!`;
    }
    
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('results').classList.add('show');
}

function goBack() {
    document.getElementById('results').classList.remove('show');
    document.getElementById('mainPage').style.display = 'block';
    
    // Clear inputs
    document.getElementById('name1').value = '';
    document.getElementById('name2').value = '';
    document.getElementById('side1a').value = '';
    document.getElementById('side1b').value = '';
    document.getElementById('side2a').value = '';
    document.getElementById('side2b').value = '';
}
