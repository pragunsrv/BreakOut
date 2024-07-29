const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");

// Ball properties
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballSpeedIncrement = 0.1; // Increment speed after every few bricks

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
let brickTypes = [];

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        const color = getRandomColor();
        const type = getRandomBrickType();
        bricks[c][r] = { x: 0, y: 0, status: 1, color: color, type: type };
    }
}

function getRandomColor() {
    return brickColors[Math.floor(Math.random() * brickColors.length)];
}

function getRandomBrickType() {
    const types = ["normal", "explosive", "doubleScore"];
    return types[Math.floor(Math.random() * types.length)];
}

// Power-up properties
const powerUpRadius = 10;
let powerUps = [];
const powerUpTypes = ["expandPaddle", "extraLife", "slowBall", "speedBall"];

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
        brick.status = 0; // Remove brick that spawned power-up
    }
}

function applyPowerUp(powerUp) {
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
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score += 10;
                    if (b.type === "explosive") {
                        destroyNearbyBricks(c, r);
                    }
                    if (Math.random() < 0.1) { // 10% chance to spawn a power-up
                        createPowerUp();
                    }
                }
            }
        }
    }
    for (let i = 0; i < powerUps.length; i++) {
        const powerUp = powerUps[i];
        if (powerUp.status === 1) {
            if (x > powerUp.x - powerUp.radius && x < powerUp.x + powerUp.radius &&
                y > powerUp.y - powerUp.radius && y < powerUp.y + powerUp.radius) {
                applyPowerUp(powerUp);
                powerUp.status = 0;
            }
        }
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
            ctx.fillStyle = getPowerUpColor(powerUp.type);
            ctx.fill();
            ctx.closePath();
        }
    }
}

function getPowerUpColor(type) {
    switch (type) {
        case "expandPaddle":
            return "#FFD700";
        case "extraLife":
            return "#FF6347";
        case "slowBall":
            return "#32CD32";
        case "speedBall":
            return "#1E90FF";
        default:
            return "#FFFFFF";
    }
}

// Draw score
let score = 0;
let lives = 3;

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawPowerUps();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
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

// Start the game
draw();
