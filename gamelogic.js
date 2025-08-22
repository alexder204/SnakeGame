const boxes = 20;
let snake = [];
snake[0] = { x: 10, y: 10 };

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let direction = "RIGHT";
let foods = [];

let foodIcon = new Image();
foodIcon.src = "banana.png";

let score = 0;

document.getElementById('restart').addEventListener('click', resetSnake);

document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Snake drawing
function drawSnake() {
    ctx.fillStyle = "lime";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * boxes, snake[i].y * boxes, boxes, boxes);
    }
}

// Draw all foods
function drawFoods() {
    for (let i = 0; i < foods.length; i++) {
        ctx.drawImage(foodIcon, foods[i].x * boxes, foods[i].y * boxes, boxes, boxes);
    }
}

// Random integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Spawn a new food block
function spawnFood() {
    let newFood = {
        x: getRandomInt(canvas.width / boxes),
        y: getRandomInt(canvas.height / boxes)
    };
    foods.push(newFood);
}

// Collision
function checkCollision() {
    let head = snake[0];
    if (head.x < 0 || head.x >= canvas.width / boxes ||
        head.y < 0 || head.y >= canvas.height / boxes) {
        resetSnake();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetSnake();
        }
    }
}

// Reset snake
function resetSnake() {
    snake = [];
    snake[0] = { x: 10, y: 10 };
    direction = "RIGHT";
    score = 0;
    updateScoreDisplay();
}

// Check if snake eats any food
function checkFood() {
    let head = snake[0];
    for (let i = 0; i < foods.length; i++) {
        if (head.x === foods[i].x && head.y === foods[i].y) {
            addSegmentOpposite();       
            foods.splice(i, 1);         
            score++;                    
            updateScoreDisplay();      
            break;                      
        }
    }
}

// Update Score
function updateScoreDisplay() {
    document.getElementById("score").textContent = "Score: " + score;
}

// Grow snake
function addSegmentOpposite() {
    let tail = snake[snake.length - 1];
    snake.push({ x: tail.x, y: tail.y });
}

// Main game loop
function update() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= 1;
    if (direction === "RIGHT") headX += 1;
    if (direction === "UP") headY -= 1;
    if (direction === "DOWN") headY += 1;

    snake.unshift({ x: headX, y: headY });

    checkFood();

    let ateFood = foods.some(f => f.x === headX && f.y === headY);
    if (!ateFood) {
        snake.pop();
    }

    checkCollision();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFoods();
}

spawnFood();                 
setInterval(spawnFood, 5000); 
setInterval(update, 200);     