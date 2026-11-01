// Window Management
let activeWindow = null;
let zIndex = 100;
let minimizedWindows = {};
let windowStates = {};

// Initialize windows
document.addEventListener('DOMContentLoaded', function() {
    // Open home window by default
    openWindow('home');
    
    // Initialize minesweeper
    initializeMinesweeper();
    
    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
    
    // Make all windows draggable and resizable
    initializeWindows();
});

function initializeWindows() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        const windowId = window.id.split('-')[0];
        windowStates[windowId] = {
            isMaximized: false,
            isMinimized: false,
            position: { x: 100, y: 100 },
            size: { width: 400, height: 300 }
        };
        
        makeWindowDraggable(window);
        makeWindowResizable(window);
    });
}

function makeWindowDraggable(window) {
    const header = window.querySelector('.window-header');
    header.addEventListener('mousedown', function(e) {
        e.preventDefault();
        
        // Don't drag if window is maximized
        if (window.classList.contains('maximized')) return;
        
        // Bring to front
        bringWindowToFront(window);
        
        // Get initial mouse position
        const startX = e.clientX;
        const startY = e.clientY;
        
        // Get initial window position
        const rect = window.getBoundingClientRect();
        const startLeft = rect.left;
        const startTop = rect.top;
        
        // Move window with mouse
        function moveWindow(e) {
            const newLeft = startLeft + e.clientX - startX;
            const newTop = startTop + e.clientY - startY;
            
            window.style.left = newLeft + 'px';
            window.style.top = newTop + 'px';
            
            // Update window state
            const windowId = window.id.split('-')[0];
            windowStates[windowId].position = { x: newLeft, y: newTop };
        }
        
        // Clean up on mouse up
        function stopMove() {
            document.removeEventListener('mousemove', moveWindow);
            document.removeEventListener('mouseup', stopMove);
        }
        
        document.addEventListener('mousemove', moveWindow);
        document.addEventListener('mouseup', stopMove);
    });
}

function makeWindowResizable(window) {
    const resizeHandle = window.querySelector('.window-resize-handle');
    
    resizeHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        
        // Don't resize if window is maximized
        if (window.classList.contains('maximized')) return;
        
        // Bring to front
        bringWindowToFront(window);
        
        // Get initial mouse position
        const startX = e.clientX;
        const startY = e.clientY;
        
        // Get initial window size
        const startWidth = window.offsetWidth;
        const startHeight = window.offsetHeight;
        
        // Resize window with mouse
        function resizeWindow(e) {
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);
            
            window.style.width = Math.max(300, newWidth) + 'px';
            window.style.height = Math.max(200, newHeight) + 'px';
            
            // Update window state
            const windowId = window.id.split('-')[0];
            windowStates[windowId].size = { 
                width: parseInt(window.style.width), 
                height: parseInt(window.style.height) 
            };
        }
        
        // Clean up on mouse up
        function stopResize() {
            document.removeEventListener('mousemove', resizeWindow);
            document.removeEventListener('mouseup', stopResize);
        }
        
        document.addEventListener('mousemove', resizeWindow);
        document.addEventListener('mouseup', stopResize);
    });
}

function bringWindowToFront(window) {
    window.style.zIndex = ++zIndex;
    const windowId = window.id.split('-')[0];
    activeWindow = windowId;
    updateTaskbar();
}

function openWindow(windowId) {
    // Close start menu if open
    document.getElementById('start-menu').classList.remove('active');
    
    // Hide all pages in the target window
    const windowElement = document.getElementById(windowId + '-window');
    const windowContent = windowElement.querySelector('.window-content');
    const pages = windowContent.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show the correct page
    document.getElementById(windowId + '-page').classList.add('active');
    
    // If window is minimized, restore it
    if (windowElement.classList.contains('minimized')) {
        minimizeWindow(windowId);
        return;
    }
    
    // Show the window
    windowElement.style.display = 'flex';
    windowElement.classList.remove('minimized');
    windowElement.style.zIndex = ++zIndex;
    windowElement.classList.add('active');
    
    // Restore window state if it exists
    if (windowStates[windowId]) {
        if (windowStates[windowId].isMaximized) {
            windowElement.classList.add('maximized');
        } else {
            windowElement.style.left = windowStates[windowId].position.x + 'px';
            windowElement.style.top = windowStates[windowId].position.y + 'px';
            windowElement.style.width = windowStates[windowId].size.width + 'px';
            windowElement.style.height = windowStates[windowId].size.height + 'px';
        }
    } else {
        // Position new windows in a cascading pattern
        const windowCount = Object.keys(windowStates).length;
        windowElement.style.left = (100 + (windowCount * 30)) + 'px';
        windowElement.style.top = (100 + (windowCount * 30)) + 'px';
        
        // Initialize window state
        windowStates[windowId] = {
            isMaximized: false,
            isMinimized: false,
            position: { 
                x: parseInt(windowElement.style.left), 
                y: parseInt(windowElement.style.top) 
            },
            size: { 
                width: parseInt(windowElement.style.width || '400'), 
                height: parseInt(windowElement.style.height || '300') 
            }
        };
    }
    
    // Update active window
    activeWindow = windowId;
    updateTaskbar();
}

function closeWindow(windowId) {
    const windowElement = document.getElementById(windowId + '-window');
    windowElement.style.display = 'none';
    windowElement.classList.remove('active');
    
    // Update window state
    windowStates[windowId].isMinimized = false;
    
    if (activeWindow === windowId) {
        activeWindow = null;
    }
    
    updateTaskbar();
}

function minimizeWindow(windowId) {
    const windowElement = document.getElementById(windowId + '-window');
    
    if (windowElement.classList.contains('minimized')) {
        // Restore window
        windowElement.classList.remove('minimized');
        windowElement.style.display = 'flex';
        windowElement.style.zIndex = ++zIndex;
        windowStates[windowId].isMinimized = false;
    } else {
        // Minimize window
        windowElement.classList.add('minimized');
        windowElement.style.display = 'none';
        windowStates[windowId].isMinimized = true;
    }
    
    updateTaskbar();
}

function toggleMaximize(windowId) {
    const windowElement = document.getElementById(windowId + '-window');
    
    if (windowElement.classList.contains('maximized')) {
        // Restore window
        windowElement.classList.remove('maximized');
        windowElement.style.left = windowStates[windowId].position.x + 'px';
        windowElement.style.top = windowStates[windowId].position.y + 'px';
        windowElement.style.width = windowStates[windowId].size.width + 'px';
        windowElement.style.height = windowStates[windowId].size.height + 'px';
        windowStates[windowId].isMaximized = false;
    } else {
        // Maximize window
        windowStates[windowId].position = { 
            x: parseInt(windowElement.style.left || '100'), 
            y: parseInt(windowElement.style.top || '100') 
        };
        windowStates[windowId].size = { 
            width: windowElement.offsetWidth, 
            height: windowElement.offsetHeight 
        };
        windowElement.classList.add('maximized');
        windowStates[windowId].isMaximized = true;
    }
    
    bringWindowToFront(windowElement);
}

// Taskbar Management
function updateTaskbar() {
    const taskbarWindows = document.getElementById('taskbar-windows');
    taskbarWindows.innerHTML = '';
    
    Object.keys(windowStates).forEach(windowId => {
        const windowElement = document.getElementById(windowId + '-window');
        const windowState = windowStates[windowId];
        
        if (windowElement && windowElement.classList.contains('active') && !windowState.isMinimized) {
            const taskbarWindow = document.createElement('div');
            taskbarWindow.className = 'taskbar-window';
            if (activeWindow === windowId) {
                taskbarWindow.classList.add('active');
            }
            
            taskbarWindow.textContent = windowElement.querySelector('.window-title').textContent;
            taskbarWindow.onclick = function() {
                if (activeWindow === windowId) {
                    minimizeWindow(windowId);
                } else {
                    openWindow(windowId);
                }
            };
            
            taskbarWindows.appendChild(taskbarWindow);
        }
    });
}

// Start Menu Toggle
document.getElementById('start-button').addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('start-menu').classList.toggle('active');
});

// Close start menu when clicking elsewhere
document.addEventListener('click', function() {
    document.getElementById('start-menu').classList.remove('active');
});

// Prevent start menu from closing when clicking on it
document.getElementById('start-menu').addEventListener('click', function(e) {
    e.stopPropagation();
});

// Clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    document.getElementById('clock').textContent = `${hours}:${minutes} ${ampm}`;
}

// BSOD
function showBSOD() {
    document.getElementById('bsod').classList.add('active');
    setTimeout(() => {
        document.getElementById('bsod').classList.remove('active');
    }, 5000);
}

// Minesweeper Game
let minesweeperBoard = [];
let mineCount = 10;
let revealedCount = 0;
let gameOver = false;

function initializeMinesweeper() {
    resetMinesweeper();
}

function resetMinesweeper() {
    const boardElement = document.getElementById('minesweeper-board');
    boardElement.innerHTML = '';
    minesweeperBoard = [];
    revealedCount = 0;
    gameOver = false;
    
    // Create empty board
    for (let row = 0; row < 10; row++) {
        minesweeperBoard[row] = [];
        for (let col = 0; col < 10; col++) {
            minesweeperBoard[row][col] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            };
            
            const cell = document.createElement('div');
            cell.className = 'minesweeper-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            cell.addEventListener('click', function() {
                if (!gameOver && !minesweeperBoard[row][col].isFlagged) {
                    revealCell(row, col);
                }
            });
            
            cell.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                if (!gameOver && !minesweeperBoard[row][col].isRevealed) {
                    toggleFlag(row, col);
                }
            });
            
            boardElement.appendChild(cell);
        }
    }
    
    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        
        if (!minesweeperBoard[row][col].isMine) {
            minesweeperBoard[row][col].isMine = true;
            minesPlaced++;
            
            // Update neighbor counts
            for (let r = Math.max(0, row - 1); r <= Math.min(9, row + 1); r++) {
                for (let c = Math.max(0, col - 1); c <= Math.min(9, col + 1); c++) {
                    if (!(r === row && c === col)) {
                        minesweeperBoard[r][c].neighborMines++;
                    }
                }
            }
        }
    }
    
    document.getElementById('mine-count').textContent = mineCount;
}

function revealCell(row, col) {
    if (minesweeperBoard[row][col].isRevealed || minesweeperBoard[row][col].isFlagged) {
        return;
    }
    
    const cell = document.querySelector(`.minesweeper-cell[data-row="${row}"][data-col="${col}"]`);
    minesweeperBoard[row][col].isRevealed = true;
    cell.classList.add('revealed');
    
    if (minesweeperBoard[row][col].isMine) {
        // Game over
        cell.classList.add('mine');
        cell.textContent = '💣';
        gameOver = true;
        revealAllMines();
        setTimeout(() => alert('Game Over! You hit a mine.'), 100);
        return;
    }
    
    revealedCount++;
    
    if (minesweeperBoard[row][col].neighborMines > 0) {
        cell.textContent = minesweeperBoard[row][col].neighborMines;
    } else {
        // Reveal adjacent cells recursively
        for (let r = Math.max(0, row - 1); r <= Math.min(9, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(9, col + 1); c++) {
                if (!(r === row && c === col)) {
                    revealCell(r, c);
                }
            }
        }
    }
    
    // Check for win
    if (revealedCount === (100 - mineCount)) {
        gameOver = true;
        setTimeout(() => alert('Congratulations! You won!'), 100);
    }
}

function toggleFlag(row, col) {
    const cell = document.querySelector(`.minesweeper-cell[data-row="${row}"][data-col="${col}"]`);
    
    if (minesweeperBoard[row][col].isFlagged) {
        minesweeperBoard[row][col].isFlagged = false;
        cell.classList.remove('flagged');
        cell.textContent = '';
    } else {
        minesweeperBoard[row][col].isFlagged = true;
        cell.classList.add('flagged');
        cell.textContent = '🚩';
    }
}

function revealAllMines() {
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            if (minesweeperBoard[row][col].isMine) {
                const cell = document.querySelector(`.minesweeper-cell[data-row="${row}"][data-col="${col}"]`);
                cell.classList.add('mine');
                cell.textContent = '💣';
            }
        }
    }
}

// Snake Game (placeholder function)
function openSnakeGame() {
    alert('Snake game would open here! This is a placeholder for the game functionality.');
}