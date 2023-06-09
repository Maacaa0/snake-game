const snake = document.getElementById("snake");
const dot = document.querySelector(".dot");
const board = document.querySelector(".board");
const score = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");
const instructionsModal = document.getElementById("instructionsModal");
const instructionsBtn = document.getElementById("instructionsBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const startGame = document.querySelector(".start");

let SPEED = 200;
//default position of snake
snake.style.left = "40px";
snake.style.top = "40px";
let leftVal = parseInt(snake.style.left);
let topVal = parseInt(snake.style.top);
let snakeArr = [];
let movementHistory = []; 
let movementTimeout;
let actualPosition;
let direction = "right";
let boardHeight = board.clientHeight;
let boardWidth = board.clientWidth;
let startInterval; // declare setInterval 
let gameStarted = false; // check if game started
let scorePoints = 0;
document.onkeydown = checkKey;


// CHANGE DIRECTION BASED ON A KEYPRESS
function checkKey(e) {
    e = e || window.event;

    if ((e.keyCode == '38' || e.keyCode == '87') && direction !== "down") {
        // up arrow
        direction = "up";
    }
    else if ((e.keyCode == '40' || e.keyCode == '83') && direction !== "up") {
        // down arrow
        direction = "down"
    }
    else if ((e.keyCode == '37' || e.keyCode == '65') && direction !== "right") {
       // left arrow
       direction = "left"
    }
    else if ((e.keyCode == '39' || e.keyCode == '68') && direction !== "left") {
       // right arrow
       direction = "right"
    }
    return direction
}

//CHECK GAME BORDERS HIT

function checkBorders() {
    if (leftVal >= boardWidth || leftVal < 0) {
        clearTimeout(movementTimeout);
    } else if (topVal >= boardHeight || topVal < 0) {
        clearTimeout(movementTimeout);
    }
}

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
    }

    movementHistory.splice(snakeArr.length);

    if (snakeArr.length > 0) {
        snakeArr.map((snakePart,i) => {
            snakePart.style.left = `${movementHistory[i].left}px`;
            snakePart.style.top = `${movementHistory[i].top}px`;
        })
    }

    if (leftVal === randomLeftRounded && topVal === randomTopRounded) {
        replaceDot();
        createSnakePart();
        scorePoints += 5;
        SPEED -= 5;
    }

    score.innerHTML = scorePoints;
}


//  function start() {
//   startInterval = setInterval(()=> {
//     if (direction === "right") {
//         leftVal += 10;
//     } else if (direction === "down") {
//         topVal += 10;
//     } else if (direction === "left") {
//         leftVal -= 10;
//     } else if (direction === "up") {
//         topVal -= 10;
//     }

//     checkBorders();
//     snakeMovement();

//   }, 2000);
// }


function start() {
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
    snakeArr.push(snakePart)
}

// createSnakePart();
  
    let randomLeft;
    let randomTop;

    let randomLeftRounded;
    let randomTopRounded;

function replaceDot() {
    randomLeft = Math.floor(Math.random() * ((boardWidth - 20) - 0 + 1)) + 0;
    randomTop = Math.floor(Math.random() * ((boardHeight - 20) - 0 + 1)) + 0;

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
    threshold = 100, //required min distance traveled to be considered swipe
    restraint = 200, // maximum distance allowed at the same time in perpendicular direction
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
    if (swipedir =='left')
        direction = 'left';
    else if (swipedir =='right') 
        direction = 'right'
    else if (swipedir == 'up') 
        direction = 'up'
    else if (swipedir =='down') 
        direction = 'down'
})