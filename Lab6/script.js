const gridElement = document.getElementById('gameGrid');
const movesDisplay = document.getElementById('movesDisplay');
const targetDisplay = document.getElementById('targetDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const restartBtn = document.getElementById('restartBtn');
const newGameBtn = document.getElementById('newGameBtn');

let levels = [];
let currentLevelIndex = 0;
let grid = [];
let initialGrid = [];
let history = [];
let moves = 0;
let targetMoves = 0;
let timer = null;
let seconds = 0;
let gameWon = false;

async function fetchLevels() {
    try {
        const response = await fetch('data/levels.json');
        levels = await response.json();
        loadLevel(0);
    } catch (error) {
        console.error("Помилка завантаження рівнів:", error);
        alert("Помилка завантаження даних. Переконайтеся, що гра запущена на сервері (напр., GitHub Pages).");
    }
}

function loadLevel(index) {
    currentLevelIndex = index;
    const levelData = levels[currentLevelIndex];
    
    targetMoves = levelData.target;
    grid = JSON.parse(JSON.stringify(levelData.grid));
    initialGrid = JSON.parse(JSON.stringify(levelData.grid));
    
    resetStats();
    renderGrid();
}

function resetStats() {
    moves = 0;
    history = [];
    seconds = 0;
    gameWon = false;
    updateStatsUI();
    
    clearInterval(timer);
    timer = setInterval(() => {
        if (!gameWon) {
            seconds++;
            updateStatsUI();
        }
    }, 1000);
}

function updateStatsUI() {
    targetDisplay.textContent = `Target: ${targetMoves}`;
    movesDisplay.textContent = `Moves: ${moves}`;
    timeDisplay.textContent = `Time: ${seconds}s`;
}

function renderGrid() {
    gridElement.innerHTML = '';
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (grid[r][c] === 1) cell.classList.add('on');
            
            let clickTimeout;
            
            cell.addEventListener('click', (e) => {
                if (gameWon) return;
                if (e.detail === 1) {
                    clickTimeout = setTimeout(() => {
                        handleMove(r, c);
                    }, 250);
                }
            });

            cell.addEventListener('dblclick', () => {
                if (gameWon) return;
                clearTimeout(clickTimeout);
                undoMove();
            });

            gridElement.appendChild(cell);
        }
    }
}

function handleMove(r, c) {
    history.push(JSON.parse(JSON.stringify(grid)));
    moves++;
    toggleLights(r, c);
    renderGrid();
    updateStatsUI();
    checkWin();
}

function undoMove() {
    if (history.length > 0) {
        grid = history.pop();
        moves--;
        renderGrid();
        updateStatsUI();
    }
}

function toggleLights(r, c) {
    toggleCell(r, c);
    toggleCell(r - 1, c);
    toggleCell(r + 1, c);
    toggleCell(r, c - 1);
    toggleCell(r, c + 1);
}

function toggleCell(r, c) {
    if (r >= 0 && r < 5 && c >= 0 && c < 5) {
        grid[r][c] = grid[r][c] === 1 ? 0 : 1;
    }
}

function checkWin() {
    let allOff = true;
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (grid[r][c] === 1) {
                allOff = false;
                break;
            }
        }
    }
    if (allOff) {
        gameWon = true;
        clearInterval(timer);
        setTimeout(() => alert(`Перемога! Ви вирішили головоломку за ${moves} ходів та ${seconds} секунд.`), 10);
    }
}

restartBtn.addEventListener('click', () => {
    grid = JSON.parse(JSON.stringify(initialGrid));
    resetStats();
    renderGrid();
});

newGameBtn.addEventListener('click', () => {
    let nextIndex = (currentLevelIndex + 1) % levels.length;
    loadLevel(nextIndex);
});

fetchLevels();
