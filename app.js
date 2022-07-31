/*
Requirements

- Initial State:
    - A board that contains the snake + apple
    - A grid layout
    - Start Button
    - Score Counter. Starting at 0
    - Speed of the snake
    - Snake should start moving when game starts
    - Starting position of the snake
- Keep track of high score (bonus)
- Pausing the game (bonus)
- Keep track of when the apple is eaten
- Keep track of growing the snakes body
- Stop game if snake collides with wall or self
- Keep track of the game controls

- Potential Functions:
    - Adds length to the snakes body when an apple eaten
    - Handles the Game controls
        - turning the snake
        - moving body accordingly
    - Random placement of the apple
    - When the game is over
    - Reset the game

    Directions:
    - Add Score COunter To HTML
    - Keep Score & Update Score in JS
    - Update Score IN HTML
    - Display Final Score when Game is Over

    HW:
    - Reset Game function

*/

//GAME PHASES
const PLAYING = "PLAYING"
const GAME_OVER = "GAME_OVER"
const NEW = "NEW"

//DIRECTIONS
const LEFT = "LEFT"
const RIGHT = "RIGHT"
const UP = "UP"
const DOWN = "DOWN"

//NECESSARY VARIABLES
const gameControls = document.getElementById("controls")
const startButton = document.querySelector(".start-game")
const resetButton = document.getElementById("reset")

let gameState = {}
let score = 0

function newBoard() {
    return [
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""]
    ]
}

// function that will setup initial game state
function resetInitialState() {
    gameState.board = newBoard(),
        gameState.apple = [5, 5], // you can make this random
        gameState.snake = {
            body: [
                [10, 5],
                [10, 6],
                [10, 7],
                [10, 8]
            ],
            // direction is going to change by one
            // 1 means its going forward (towards the right on the x axis/down on the y axis)
            // -1 means its going backward (towards the left on the x axis/up on the right axis)
            // 0 means it stays the same
            nextDirection: [0, -1]
        },
        gameState.speed = 300
    gameState.phase = NEW
    gameState.setInterval = null
    gameState.score = 0
}

function moveSnake() {

    const [y, x] = gameState.snake.body[0] //head of the snake i.e [10,5]
    const nextTile = [
        y + gameState.snake.nextDirection[0],
        x + gameState.snake.nextDirection[1]
    ]

    const [nextY, nextX] = nextTile

    // Checking if you hit a wall
    if (nextY > 11 || nextY < 0 || nextX > 11 || nextX < 0) {
        changePhaseTo(GAME_OVER)
        document.getElementById('score').innerHTML = ("Your Final Score: " + gameState.score)
    }
    else if (gameState.board[nextY][nextX] === "snake") {
        changePhaseTo(GAME_OVER)
        document.getElementById('score').innerHTML = ("Your Final Score: " + gameState.score)

    }
    else {
        if (gameState.board[nextY][nextX] === "apple") {

            gameState.score++;
            document.getElementById('score').innerHTML = ("Score: " + gameState.score)

            moveApple()

        }
        else {
            gameState.snake.body.pop()
        }
    }

    gameState.snake.body.unshift(nextTile) // pushing [10,4] to the snake body

    gameState.board = newBoard()
    addSnakeToBoard()
    addAppleToBoard()
    console.log(gameState.board)
}

function clearHTMLboard() {
    // removing the snake from the html board

    const appleElem = document.getElementsByClassName("apple")[0]
    const snakeElems = document.getElementsByClassName("snake")

    appleElem.classList.remove("apple")

    for (let i = 0; i < snakeElems.length; i++) {
        snakeElems[i].classList.remove("snake")
    }
}

function tick() {
    clearHTMLboard()
    moveSnake()
    updateHTMLBoard()
}

function changePhaseTo(newPhase) {
    gameState.phase = newPhase

    if (gameState.phase === PLAYING) {
        gameState.interval = setInterval(tick, gameState.speed)
    }
    else if (gameState.phase === GAME_OVER) {
        clearInterval(gameState.interval)
    }
}

function addAppleToBoard() {
    const [y, x] = gameState.apple
    gameState.board[y][x] = "apple"
}

function addSnakeToBoard() {
    for (let i = 0; i < gameState.snake.body.length; i++) {
        const [y, x] = gameState.snake.body[i]
        gameState.board[y][x] = "snake"
    }
}

function moveApple() {
    // randomize x & y position of apple
    // random number should be from 0 to 11
    //  update gameState.apple

    let y = Math.floor(Math.random() * 12)
    let x = Math.floor(Math.random() * 12)

    gameState.apple = [y, x]

}

function updateHTMLBoard() { // this is your renderState function
    let appleCell = document.querySelector("div[data-coordinates='" + gameState.apple + "']")

    appleCell.classList.add("apple")

    for (let i = 0; i < gameState.snake.body.length; i++) {

        const [y, x] = gameState.snake.body[i]
        let snakeCell = document.querySelector("div[data-coordinates='" + y + ',' + x + "']")

        snakeCell.classList.add("snake")
    }
}

function turnSnake(direction) {
    // write a function that updates nextDirection in the gameState based on the direction passed into the parameter
    if (direction === LEFT) gameState.snake.nextDirection = [0, -1]
    else if (direction === RIGHT) gameState.snake.nextDirection = [0, 1]
    else if (direction === UP) gameState.snake.nextDirection = [-1, 0]
    else if (direction === DOWN) gameState.snake.nextDirection = [1, 0]
}


startButton.addEventListener("click", function () {

    changePhaseTo(PLAYING)

    gameControls.style.display = "grid"
})

resetButton.addEventListener("click", function () {
    
    resetInitialState();
    updateHTMLBoard();

})

gameControls.addEventListener("click", function (event) {
    if (event.target.tagName !== "BUTTON") {
        return
    }

    let direction = event.target.innerText.toUpperCase()
    turnSnake(direction)
})

resetInitialState()
updateHTMLBoard()

