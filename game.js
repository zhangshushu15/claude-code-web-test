// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const TILE_SIZE = 16;
const COLS = 28;
const ROWS = 31;

// Game state
let gameState = 'ready'; // ready, playing, paused, gameOver, won
let score = 0;
let lives = 3;
let pelletCount = 0;
let powerPelletActive = false;
let powerPelletTimer = 0;

// Maze layout (1 = wall, 0 = empty, 2 = pellet, 3 = power pellet)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,0,0,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Pacman object
const pacman = {
    x: 14.0,
    y: 23.5,
    direction: 0, // 0 = right, 1 = down, 2 = left, 3 = up
    nextDirection: 0,
    speed: 0.15,
    mouthOpen: 0,
    mouthSpeed: 0.3
};

// Ghost object constructor
class Ghost {
    constructor(x, y, color) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = 0;
        this.speed = 0.1;
        this.scatter = true;
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = 0;
    }
}

// Create ghosts
const ghosts = [
    new Ghost(13.5, 14.5, '#FF0000'), // Blinky (red)
    new Ghost(14.5, 14.5, '#FFB8FF'), // Pinky (pink)
    new Ghost(13.5, 15.5, '#00FFFF'), // Inky (cyan)
    new Ghost(14.5, 15.5, '#FFB851')  // Clyde (orange)
];

// Count initial pellets
function countPellets() {
    pelletCount = 0;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 2 || maze[row][col] === 3) {
                pelletCount++;
            }
        }
    }
}

// Initialize game
function init() {
    countPellets();
    updateScore();
    updateLives();
    gameLoop();
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Update lives display
function updateLives() {
    document.getElementById('lives').textContent = lives;
}

// Update message display
function updateMessage(text) {
    document.getElementById('message').textContent = text;
}

// Check if position is valid (not a wall)
function isValidMove(x, y) {
    // Define the collision margin - this represents the radius of Pacman's hitbox
    // Must be close to 0.5 to ensure we check adjacent tiles (from X.5 center, need to reach X+1.0)
    const margin = 0.48; // Close to half a tile to properly check adjacent walls

    // Check all four corners AND the four edge midpoints of Pacman's bounding box
    const points = [
        { x: x - margin, y: y - margin }, // Top-left corner
        { x: x + margin, y: y - margin }, // Top-right corner
        { x: x - margin, y: y + margin }, // Bottom-left corner
        { x: x + margin, y: y + margin }, // Bottom-right corner
        { x: x, y: y - margin },          // Top edge center
        { x: x, y: y + margin },          // Bottom edge center
        { x: x - margin, y: y },          // Left edge center
        { x: x + margin, y: y }           // Right edge center
    ];

    // All points must be in valid (non-wall) tiles
    for (const point of points) {
        const col = Math.floor(point.x);
        const row = Math.floor(point.y);

        // Check bounds
        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) {
            return false;
        }

        // Check if current tile is a wall
        if (maze[row][col] === 1) {
            return false;
        }

        // Also check if we're close to the next tile and it's a wall
        const colFrac = point.x - col;
        const rowFrac = point.y - row;

        // Check adjacent tile in X direction if close to edge
        if (colFrac > 0.5 && col + 1 < COLS && maze[row][col + 1] === 1) {
            return false;
        }

        // Check adjacent tile in Y direction if close to edge
        if (rowFrac > 0.5 && row + 1 < ROWS && maze[row + 1][col] === 1) {
            return false;
        }
    }

    return true;
}

// Move Pacman
function movePacman() {
    // Try to change direction
    const directions = [
        { dx: 1, dy: 0 },   // right
        { dx: 0, dy: 1 },   // down
        { dx: -1, dy: 0 },  // left
        { dx: 0, dy: -1 }   // up
    ];

    const nextDir = directions[pacman.nextDirection];
    const newX = pacman.x + nextDir.dx * pacman.speed;
    const newY = pacman.y + nextDir.dy * pacman.speed;

    if (isValidMove(newX, newY)) {
        pacman.direction = pacman.nextDirection;
    }

    // Move in current direction
    const currentDir = directions[pacman.direction];
    const moveX = pacman.x + currentDir.dx * pacman.speed;
    const moveY = pacman.y + currentDir.dy * pacman.speed;

    if (isValidMove(moveX, moveY)) {
        pacman.x = moveX;
        pacman.y = moveY;

        // Wrap around
        if (pacman.x < 0) pacman.x = COLS - 1;
        if (pacman.x >= COLS) pacman.x = 0;
    }

    // Animate mouth
    pacman.mouthOpen += pacman.mouthSpeed;
}

// Move ghosts
function moveGhosts() {
    ghosts.forEach(ghost => {
        const directions = [
            { dx: 1, dy: 0 },   // right
            { dx: 0, dy: 1 },   // down
            { dx: -1, dy: 0 },  // left
            { dx: 0, dy: -1 }   // up
        ];

        // Simple AI: randomly change direction at intersections
        const currentCol = Math.floor(ghost.x);
        const currentRow = Math.floor(ghost.y);

        // Check if at intersection
        const atIntersection = Math.abs(ghost.x - currentCol) < 0.1 &&
                              Math.abs(ghost.y - currentRow) < 0.1;

        if (atIntersection) {
            // Find valid directions
            const validDirs = [];
            directions.forEach((dir, index) => {
                const testX = ghost.x + dir.dx;
                const testY = ghost.y + dir.dy;
                if (isValidMove(testX, testY)) {
                    validDirs.push(index);
                }
            });

            // Choose direction based on mode
            if (powerPelletActive) {
                // Run away from Pacman
                const distances = validDirs.map(dir => {
                    const testDir = directions[dir];
                    const testX = ghost.x + testDir.dx;
                    const testY = ghost.y + testDir.dy;
                    const dist = Math.abs(testX - pacman.x) + Math.abs(testY - pacman.y);
                    return { dir, dist };
                });
                distances.sort((a, b) => b.dist - a.dist);
                if (distances.length > 0) {
                    ghost.direction = distances[0].dir;
                }
            } else {
                // Chase Pacman
                const distances = validDirs.map(dir => {
                    const testDir = directions[dir];
                    const testX = ghost.x + testDir.dx;
                    const testY = ghost.y + testDir.dy;
                    const dist = Math.abs(testX - pacman.x) + Math.abs(testY - pacman.y);
                    return { dir, dist };
                });
                distances.sort((a, b) => a.dist - b.dist);
                if (distances.length > 0) {
                    ghost.direction = distances[0].dir;
                }
            }
        }

        // Move ghost
        const dir = directions[ghost.direction];
        const newX = ghost.x + dir.dx * ghost.speed;
        const newY = ghost.y + dir.dy * ghost.speed;

        if (isValidMove(newX, newY)) {
            ghost.x = newX;
            ghost.y = newY;

            // Wrap around
            if (ghost.x < 0) ghost.x = COLS - 1;
            if (ghost.x >= COLS) ghost.x = 0;
        }
    });
}

// Check collision with pellets
function checkPelletCollision() {
    const col = Math.round(pacman.x);
    const row = Math.round(pacman.y);

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        if (maze[row][col] === 2) {
            maze[row][col] = 0;
            score += 10;
            pelletCount--;
            updateScore();

            if (pelletCount === 0) {
                gameState = 'won';
                updateMessage('YOU WIN! Press SPACE to restart');
            }
        } else if (maze[row][col] === 3) {
            maze[row][col] = 0;
            score += 50;
            pelletCount--;
            powerPelletActive = true;
            powerPelletTimer = 200; // Active for ~6.6 seconds
            updateScore();

            if (pelletCount === 0) {
                gameState = 'won';
                updateMessage('YOU WIN! Press SPACE to restart');
            }
        }
    }
}

// Check collision with ghosts
function checkGhostCollision() {
    ghosts.forEach(ghost => {
        const distance = Math.sqrt(
            Math.pow(ghost.x - pacman.x, 2) +
            Math.pow(ghost.y - pacman.y, 2)
        );

        if (distance < 0.5) {
            if (powerPelletActive) {
                // Eat ghost
                score += 200;
                updateScore();
                ghost.reset();
            } else {
                // Lose a life
                lives--;
                updateLives();

                if (lives <= 0) {
                    gameState = 'gameOver';
                    updateMessage('GAME OVER! Press SPACE to restart');
                } else {
                    resetPositions();
                    updateMessage('Life lost! Press SPACE to continue');
                    gameState = 'ready';
                }
            }
        }
    });
}

// Reset positions
function resetPositions() {
    pacman.x = 14.0;
    pacman.y = 23.5;
    pacman.direction = 0;
    pacman.nextDirection = 0;

    ghosts.forEach(ghost => ghost.reset());
}

// Reset game
function resetGame() {
    // Reset maze
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const original = [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
                [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
                [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
                [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
                [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
                [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
                [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
                [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
                [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
                [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
                [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
                [1,1,1,1,1,1,2,1,1,0,1,1,1,0,0,1,1,1,0,1,1,2,1,1,1,1,1,1],
                [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
                [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
                [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
                [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
                [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
                [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
                [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
                [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
                [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
                [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
                [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
                [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
                [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
                [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
                [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
                [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
                [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ];
            maze[row][col] = original[row][col];
        }
    }

    score = 0;
    lives = 3;
    powerPelletActive = false;
    powerPelletTimer = 0;

    resetPositions();
    countPellets();
    updateScore();
    updateLives();
    updateMessage('Press SPACE to Start');

    gameState = 'ready';
}

// Draw maze
function drawMaze() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            if (maze[row][col] === 1) {
                // Wall
                ctx.fillStyle = '#2121ff';
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = '#0000aa';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (maze[row][col] === 2) {
                // Pellet
                ctx.fillStyle = '#ffb897';
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (maze[row][col] === 3) {
                // Power pellet
                ctx.fillStyle = '#ffb897';
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Draw Pacman
function drawPacman() {
    const x = pacman.x * TILE_SIZE + TILE_SIZE / 2;
    const y = pacman.y * TILE_SIZE + TILE_SIZE / 2;
    const radius = TILE_SIZE / 2 - 2;

    // Calculate mouth angle
    const mouthAngle = Math.abs(Math.sin(pacman.mouthOpen)) * 0.4;

    ctx.fillStyle = '#ffff00';
    ctx.beginPath();

    // Direction determines rotation
    const rotation = pacman.direction * Math.PI / 2;

    ctx.arc(
        x, y, radius,
        rotation + mouthAngle,
        rotation + (Math.PI * 2) - mouthAngle
    );
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
}

// Draw ghosts
function drawGhosts() {
    ghosts.forEach(ghost => {
        const x = ghost.x * TILE_SIZE + TILE_SIZE / 2;
        const y = ghost.y * TILE_SIZE + TILE_SIZE / 2;
        const radius = TILE_SIZE / 2 - 2;

        // Change color if power pellet is active
        ctx.fillStyle = powerPelletActive ? '#0000ff' : ghost.color;

        // Draw ghost body (circle top + wavy bottom)
        ctx.beginPath();
        ctx.arc(x, y - 2, radius, Math.PI, 0);
        ctx.lineTo(x + radius, y + radius);
        ctx.lineTo(x + radius - 3, y + radius - 3);
        ctx.lineTo(x + radius - 6, y + radius);
        ctx.lineTo(x - radius + 6, y + radius);
        ctx.lineTo(x - radius + 3, y + radius - 3);
        ctx.lineTo(x - radius, y + radius);
        ctx.closePath();
        ctx.fill();

        // Draw eyes
        if (!powerPelletActive) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(x - 4, y - 4, 4, 6);
            ctx.fillRect(x + 1, y - 4, 4, 6);
            ctx.fillStyle = '#000';
            ctx.fillRect(x - 3, y - 2, 2, 3);
            ctx.fillRect(x + 2, y - 2, 2, 3);
        }
    });
}

// Update game state
function update() {
    if (gameState !== 'playing') return;

    movePacman();
    moveGhosts();
    checkPelletCollision();
    checkGhostCollision();

    // Update power pellet timer
    if (powerPelletActive) {
        powerPelletTimer--;
        if (powerPelletTimer <= 0) {
            powerPelletActive = false;
        }
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMaze();
    drawPacman();
    drawGhosts();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (gameState === 'ready') {
            gameState = 'playing';
            updateMessage('');
        } else if (gameState === 'gameOver' || gameState === 'won') {
            resetGame();
        }
    }

    if (gameState === 'playing') {
        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                pacman.nextDirection = 0;
                break;
            case 'ArrowDown':
                e.preventDefault();
                pacman.nextDirection = 1;
                break;
            case 'ArrowLeft':
                e.preventDefault();
                pacman.nextDirection = 2;
                break;
            case 'ArrowUp':
                e.preventDefault();
                pacman.nextDirection = 3;
                break;
        }
    }
});

// Start the game
init();
