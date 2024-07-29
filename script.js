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
let paddleWidth = 75; // Made this variable to allow changes
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

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, color: getRandomColor() };
    }
}

function getRandomColor() {
    const colors = ["#0095DD", "#FF5733", "#33FF57", "#FF33A1", "#33A1FF"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Power-up properties
const powerUpRadius = 10;
let powerUp = null;

function createPowerUp() {
    const randomColumn = Math.floor(Math.random() * brickColumnCount);
    const randomRow = Math.floor(Math.random() * brickRowCount);
    const brick = bricks[randomColumn][randomRow];
    if (brick.status === 1) {
        powerUp = {
            x: brick.x + brickWidth / 2,
            y: brick.y + brickHeight / 2,
            status: 1
        };
        brick.status = 0; // Remove brick that spawned power-up
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
                    if (Math.random() < 0.1) { // 10% chance to spawn a power-up
                        createPowerUp();
                    }
                }
            }
        }
    }
    if (powerUp && powerUp.status === 1) {
        if (x > powerUp.x - powerUpRadius && x < powerUp.x + powerUpRadius &&
            y > powerUp.y - powerUpRadius && y < powerUp.y + powerUpRadius) {
            // Example power-up effect: Increase paddle width
            paddleWidth += 20;
            powerUp.status = 0;
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

// Draw power-up
function drawPowerUp() {
    if (powerUp && powerUp.status === 1) {
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, powerUpRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
        ctx.closePath();
    }
}

// Draw score
let score = 0;
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Score: " + score, 8, 20);
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawPowerUp();
    drawScore();
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
            document.location.reload();
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

draw();
