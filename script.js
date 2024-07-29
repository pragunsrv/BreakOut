const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");

// Ball properties
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// Paddle properties
const paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 6;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const brickColors = ["#0095DD", "#FF5733", "#33FF57", "#FF33A1", "#33A1FF"];
const brickTypes = ["normal", "explosive", "doubleScore", "multiHit", "bonusLife", "speedBall"];
let bricks = [];

// Game variables
let score = 0;
let lives = 3;
const powerUpRadius = 10;
let powerUps = [];
const powerUpTypes = ["expandPaddle", "extraLife", "slowBall", "speedBall", "multiBall", "bonusLife"];
const additionalBalls = [];
const bonusPoints = 50;
const ballTrail = [];
let level = 1;
const maxLevels = 3;
let isPaused = false; // New feature: Pause

// Sound effects
const brickHitSound = new Audio("sounds/brick_hit.mp3");
const paddleHitSound = new Audio("sounds/paddle_hit.mp3");
const powerUpSound = new Audio("sounds/power_up.mp3");
const gameOverSound = new Audio("sounds/game_over.mp3");

// Initialize bricks
function initializeBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            const color = getRandomColor();
            const type = getRandomBrickType();
            bricks[c][r] = { x: 0, y: 0, status: 1, color: color, type: type, hits: type === "multiHit" ? 3 : 1 };
        }
    }
}

initializeBricks();

function getRandomColor() {
    return brickColors[Math.floor(Math.random() * brickColors.length)];
}

function getRandomBrickType() {
    return brickTypes[Math.floor(Math.random() * brickTypes.length)];
}

// Create power-ups
function createPowerUp() {
    const randomColumn = Math.floor(Math.random() * brickColumnCount);
    const randomRow = Math.floor(Math.random() * brickRowCount);
    const brick = bricks[randomColumn][randomRow];
    if (brick.status === 1) {
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        powerUps.push({
            x: brick.x + brickWidth / 2,
            y: brick.y + brickHeight / 2,
            radius: powerUpRadius,
            type: type,
            status: 1
        });
        brick.status = 0;
    }
}

function applyPowerUp(powerUp) {
    powerUpSound.play();
    if (powerUp.type === "expandPaddle") {
        paddleWidth += 20;
    } else if (powerUp.type === "extraLife") {
        lives += 1;
    } else if (powerUp.type === "slowBall") {
        dx *= 0.8;
        dy *= 0.8;
    } else if (powerUp.type === "speedBall") {
        dx *= 1.2;
        dy *= 1.2;
    } else if (powerUp.type === "multiBall") {
        createAdditionalBalls();
    } else if (powerUp.type === "bonusLife") {
        lives += 1;
        score += bonusPoints;
    }
}

// Create additional balls
function createAdditionalBalls() {
    for (let i = 0; i < 2; i++) {
        additionalBalls.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 2,
            dy: -2
        });
    }
}

// Create ball trail effect
function createBallTrail() {
    ballTrail.push({ x: x, y: y, alpha: 1.0 });
    if (ballTrail.length > 10) {
        ballTrail.shift();
    }
}

// Event listeners for paddle movement
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    } else if (e.key === "p" || e.key === "P") {
        isPaused = !isPaused;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Collision detection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    brickHitSound.play();
                    b.hits -= 1;
                    if (b.hits <= 0) {
                        b.status = 0;
                        score += 10;
                        if (b.type === "explosive") {
                            destroyNearbyBricks(c, r);
                        }
                        if (Math.random() < 0.1) {
                            createPowerUp();
                        }
                    }
                }
            }
        }
    }
    for (let i = 0; i < powerUps.length; i++) {
        const powerUp = powerUps[i];
        if (powerUp.status === 1) {
            if (x > powerUp.x - powerUp.radius && x < powerUp.x + powerUp.radius && y > powerUp.y - powerUp.radius && y < powerUp.y + powerUp.radius) {
                applyPowerUp(powerUp);
                powerUp.status = 0;
            }
        }
    }
    for (let i = 0; i < additionalBalls.length; i++) {
        const ball = additionalBalls[i];
        if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ballRadius) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - ballRadius) {
            if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
                ball.dy = -ball.dy;
            } else {
                additionalBalls.splice(i, 1);
                i--;
            }
        }

        ball.x += ball.dx;
        ball.y += ball.dy;
    }
}

function destroyNearbyBricks(c, r) {
    for (let i = c - 1; i <= c + 1; i++) {
        for (let j = r - 1; j <= r + 1; j++) {
            if (i >= 0 && i < brickColumnCount && j >= 0 && j < brickRowCount) {
                const brick = bricks[i][j];
                if (brick.status === 1) {
                    brick.status = 0;
                    score += 10;
                }
            }
        }
    }
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw additional balls
function drawAdditionalBalls() {
    for (let i = 0; i < additionalBalls.length; i++) {
        const ball = additionalBalls[i];
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}

// Draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw bricks with colors
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Draw power-ups
function drawPowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        const powerUp = powerUps[i];
        if (powerUp.status === 1) {
            ctx.beginPath();
            ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2);
            if (powerUp.type === "expandPaddle") {
                ctx.fillStyle = "yellow";
            } else if (powerUp.type === "extraLife") {
                ctx.fillStyle = "green";
            } else if (powerUp.type === "slowBall") {
                ctx.fillStyle = "blue";
            } else if (powerUp.type === "speedBall") {
                ctx.fillStyle = "orange";
            } else if (powerUp.type === "multiBall") {
                ctx.fillStyle = "purple";
            } else if (powerUp.type === "bonusLife") {
                ctx.fillStyle = "pink";
            }
            ctx.fill();
            ctx.closePath();
        }
    }
}

// Draw score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Score: " + score, 8, 20);
}

// Draw lives
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// Draw ball trail
function drawBallTrail() {
    for (let i = 0; i < ballTrail.length; i++) {
        const trail = ballTrail[i];
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 149, 221, ${trail.alpha})`;
        ctx.fill();
        ctx.closePath();
        trail.alpha -= 0.1; // Fade effect
    }
}

// Draw levels
function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Level: " + level, canvas.width / 2 - 30, 20);
}

// Update game state and draw
function draw() {
    if (isPaused) return; // Pause the game
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawAdditionalBalls();
    drawPaddle();
    drawPowerUps();
    drawBallTrail();
    drawScore();
    drawLives();
    drawLevel();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            paddleHitSound.play();
        } else {
            lives--;
            if (!lives) {
                gameOverSound.play();
                alert("Game Over");
                document.location.reload();
            } else {
                resetBall();
                resetPaddle();
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    createBallTrail(); // Add trail effect
    requestAnimationFrame(draw);
}

// Reset ball position and speed
function resetBall() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
}

// Reset paddle position and size
function resetPaddle() {
    paddleWidth = 75;
    paddleX = (canvas.width - paddleWidth) / 2;
}

// Level up
function levelUp() {
    if (level < maxLevels) {
        level++;
        dx *= 1.2;
        dy *= 1.2;
        initializeBricks();
    } else {
        alert("You win! All levels completed!");
        document.location.reload();
    }
}

// Check level completion
function checkLevelCompletion() {
    let bricksLeft = 0;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                bricksLeft++;
            }
        }
    }
    if (bricksLeft === 0) {
        levelUp();
    }
}

// Start the game
draw();
