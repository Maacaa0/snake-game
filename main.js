const snake = document.getElementById("snake");
const dot = document.querySelector(".dot");
const board = document.querySelector(".board");
const score = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");
const instructionsModal = document.getElementById("instructionsModal");
const instructionsBtn = document.getElementById("instructionsBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const startGame = document.querySelector(".start");

//default position of snake
snake.style.left = "40px";
snake.style.top = "40px";
let leftVal = parseInt(snake.style.left);
let topVal = parseInt(snake.style.top);
let snakeArr = [snake]; // arr to store all snake parts
let movementHistory = []; //arr that stores path of snake
let movementTimeout;
let actualPosition;
let direction = "right"; //default direction
let SPEED = 200; // snake speed

//size of game board
let boardHeight = board.clientHeight; 
let boardWidth = board.clientWidth;

let gameStarted = false; // check if game started (prevent starting multiple games)
let scorePoints = 0;


document.addEventListener('keydown', handleKeyPress);

let blocked = true;

function handleKeyPress(e) {
    e = e || window.event;
    const key = e.key;

    if ((key === 'ArrowUp' || key === 'w') && direction !== "down" && !blocked) {
        // up arrow or 'w' key
        direction = "up";
    }
    else if ((key === 'ArrowDown' || key === 's') && direction !== "up" && !blocked) {
        // down arrow or 's' key
        direction = "down";
    }
    else if ((key === 'ArrowLeft' || key === 'a') && direction !== "right" && !blocked) {
        // left arrow or 'a' key
        direction = "left";
    }
    else if ((key === 'ArrowRight' || key === 'd') && direction !== "left" && !blocked) {
        // right arrow or 'd' key
        direction = "right";
    }

    blocked = true;
    return direction;
}

//CHECK GAME BORDERS HIT

function checkBorders() {
    if (leftVal >= boardWidth ||
        leftVal < 0 ||
        topVal >= boardHeight ||
        topVal < 0) {
        gameOver();
    }
}

let actualPositionArr;
let movementHistoryArr;

function snakeMovement() {
    snake.style.left = `${leftVal}px`;
    snake.style.top = `${topVal}px`;

    movementHistory.unshift({
        left: leftVal,
        top: topVal
    });

    actualPosition = {
        left: leftVal,
        top: topVal
    };
    
    // Handle self-crash
    if (movementHistory.slice(1).some(move => move.left === actualPosition.left && move.top === actualPosition.top)) {
        gameOver();
    }

    movementHistory.splice(snakeArr.length);

    for (let i = 0; i < snakeArr.length; i++) {
        snakeArr[i].style.left = `${movementHistory[i].left}px`;
        snakeArr[i].style.top = `${movementHistory[i].top}px`;
    }

    if (leftVal === randomLeftRounded && topVal === randomTopRounded) {
        replaceDot();
        createSnakePart();
        scorePoints += 5;
        if (SPEED > 50) {
            SPEED -= 3;
        }
    }
    
    score.innerHTML = scorePoints;
    blocked = false;
}


function start() {
    clearTimeout(movementTimeout);
    movementTimeout = 
    setTimeout(() => {
        if (direction === "right") {
            leftVal += 10;
        } else if (direction === "down") {
            topVal += 10;
        } else if (direction === "left") {
            leftVal -= 10;
        } else if (direction === "up") {
            topVal -= 10;
        }
        start();
        checkBorders();
        snakeMovement();
      
}, SPEED)
}


const snakeCrash = [
         { transform: "translate(0, 0) rotate(0deg)" },
         { transform: "translate(5px, 5px) rotate(5deg)" },
         { transform: "translate(0, 0) rotate(0deg)" },
         { transform: "translate(-5px, 5px) rotate(-5deg)" },
         { transform: "translate(0, 0) rotate(0deg)" }
];


function gameOver() {
    score.classList.add("gameOverScore");
    clearTimeout(movementTimeout);
    board.animate(snakeCrash, {
        duration: 300,
        iterations: 1,
      })
}


// START GAME ON SPACEBAR PRESS
document.body.onkeyup = function(e) {
    if ((e.key == " " ||
    e.code == "Space" ||      
    e.keyCode == 32) && !gameStarted     
    ) {
        start();
        gameStarted = true;
        instructionsModal.style.display = "none";
    } 
    
}

// RESET GAME
function resetGame() {
   location.reload();
}

resetBtn.addEventListener('click', ()=> {
  resetGame();
})

function createSnakePart() {
    const snakePart = document.createElement("div");
    snakePart.classList.add("snakePart");
    board.appendChild(snakePart);
    snakeArr.push(snakePart);
}

    let randomLeft;
    let randomTop;

    let randomLeftRounded;
    let randomTopRounded;

function replaceDot() {
    randomLeft = Math.floor(Math.random() * ((boardWidth - 10) - 0 + 1)) + 0;
    randomTop = Math.floor(Math.random() * ((boardHeight - 10) - 0 + 1)) + 0;

    randomLeftRounded = Math.round(randomLeft / 10) * 10;
    randomTopRounded = Math.round(randomTop / 10) * 10;
    
    dot.style.left = randomLeftRounded + "px";
    dot.style.top = randomTopRounded + "px";
}


replaceDot()

instructionsBtn.addEventListener('click', () => {
    instructionsModal.classList.toggle('hidden');
})

closeModalBtn.addEventListener('click', () => {
    instructionsModal.classList.add('hidden');
})


document.addEventListener('click', event => {
    const isClickInside = instructionsModal.contains(event.target);
    const btnClick = instructionsBtn.contains(event.target);
      
    if (btnClick) {
      return
  
    } else if (!isClickInside) {
      instructionsModal.classList.add("hidden");
    }
  });

startGame.addEventListener('click', () => {
    if (!gameStarted) {
        start();
        gameStarted = true;
        instructionsModal.style.display = "none";
    }
})




function swipedetect(el, callback){
  
    var swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 50, //required min distance traveled to be considered swipe
    restraint = 500, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 500, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}
  
    board.addEventListener('touchstart', function(e){
        let touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)
  
    board.addEventListener('touchmove', function(e){
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)
  
    board.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
            
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}

var el = document.getElementById('someel')
swipedetect(el, function(swipedir){
    // swipedir contains either "none", "left", "right", "up", or "down"
    if (swipedir =='left' && direction !== "right")
        direction = 'left';
    else if (swipedir =='right' && direction !== "left") 
        direction = 'right'
    else if (swipedir == 'up' && direction !== "down") 
        direction = 'up'
    else if (swipedir =='down' && direction !== "up") 
        direction = 'down'
})