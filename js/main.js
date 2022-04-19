
let levelSize = 4;
let playerName = "Guest";
const shapes = ["maze1","maze2","maze3","maze4","maze5","maze6"];
const colors = ["#0C4767","#EB5160","#66A182","#06BCC1","#4CE0B3","#F1AA63"];
// const colorsBoss = ["#0C4767","#0C4767","#0C4767","#0C4767","#0C4767","#0C4767",]
let deck = [];
let cardsDrawn = 0;
let solved = 0;
let startingDuration = 3000;
let introToLevelDuration = startingDuration;
let level = 1;
let playerScore = 0;
let playerHighestScore = 0;
let levelWhenLost = 1;
let highestLevelReached = 1;
let floatingPointsPosition = 0;
let highscores = [];
let basePoints = 500;
let playerLifes = 2;
let introDurationDeduction = 200;
let timerWidth = window.innerWidth;
let timerHeight = window.innerHeight;
let duration;
let isRegistered = false;

const ranking = [];

const countdownSound = new Audio('./files/Counter.mp3')
const cardTurnSound = new Audio("./files/Card-turn.mp3")

const levelWrapper = document.querySelector(".current-level");
const contentWrapper = document.querySelector("#content-wrapper");
const win = document.querySelector("#win");
const gameColor = document.querySelector("#game")
const nav = document.querySelector(".nav");
const timerWrapper = document.querySelector("#timer");
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let isMobile = false;
if (window.innerWidth <= 414) {
    isMobile = true;
}

contentWrapper.innerHTML = `
<section class="welcome-screen">
    <span class="welcome">Welcome to</span>
    <img src="./files/amaze_logo.svg" class="logo"/>


    
        <p class="welcome-message">
        You will get <strong>additional life</strong> if you type in your name.
        </p>
    
    <input type="text" class="input" placeholder="Your Name" maxlength="14">
    <button id="start" class="btn btn__primary">Start game</button>
</section>
`

timerWrapper.innerHTML = `
<svg id="timer-container" height="${timerHeight}" width="${timerWidth}">
    <circle 
    r="${Math.max(timerWidth,timerHeight)}" 
    cx="${timerWidth/2}" 
    cy="${timerHeight/2}"
    fill="transparent"
    stroke="rgba(0, 0, 0, 0.05)"
    stroke-width="${Math.max(timerWidth*2,timerHeight*2)}"
    opacity="0"
    transform="rotate(-90 ${timerWidth/2} ${timerHeight/2})"></circle>
</svg>
`



function countdown(number){
    return new Promise(resolve =>{
        const counter = document.querySelector("#countdown");
        counter.style.opacity = 1;
        counter.innerHTML = number;
        // countdownSound.play()
        
        const countdownInterval = setInterval(() => {
            if (number === 1) {
                clearInterval(countdownInterval);
                counter.innerHTML = ``;
                counter.style.opacity = 0;
                resolve()
            } else {
            number = number-1;
            // countdownSound.play()
            counter.innerHTML = number;
            }; 
        }, 1000);
        
    })

};

function floatingPoints(amount,posX,posY,fpn=1){
    const fp = document.querySelector(`.fp${fpn}`); 
    fp.innerHTML = `${parseInt(amount)}`;
    fp.style.left = (posX)+"px";
    fp.style.top = (posY)+"px";
    fp.style.display = "inherit";
    const float = setInterval(()=>{
        posY = posY - 1;
        fp.style.top = (posY)+"px";
    },10);
    function hideFloatingPoints() {
        return new Promise(resolve =>{
        fp.style.display = "none";
            resolve();

        })
    }
    fadeInOut(fp,0,0.05,1,20)
    .then(()=>fadeInOut(fp,1,-0.05,0,20,200))
    .then(()=>hideFloatingPoints())
    .then(()=>{clearInterval(float);});
};






function createLevel(isBoss = 0) { 
    if (isBoss === 1){

    }
    deck = [];
    shuffle(shapes);
    shuffle(colors);
    if (isBoss === 1){
        for (let i = 0; i < levelSize/2 ; i++){
            deck.push({shape: shapes[i], color: "#EB5160"});
            deck.push({shape: shapes[i], color: "#EB5160"});
        } 
    } else {
        for (let i = 0; i < levelSize/2 ; i++){
            deck.push({shape: shapes[i], color: colors[i]});
            deck.push({shape: shapes[i], color: colors[i]});
        }
    }

    shuffle(deck);
    return deck;
}

function shuffle(arr) {
    for (let i = arr.length -1; i>0; i--) {
        let j = Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]] = [arr[j], arr[i]];
    };
};


nav.innerHTML = `
   
<div class="nav-left">
<span class="level">Level ${level}</span>
<span class="lifes"></span>

<span class="time-to-start hidden">Starting in: <span id="time-to-start">2.00<span>

   
</div>

<div class="nav-right  points">
<p class="score">Score: <strong>${playerScore} pts</strong></p>
<p class="score">Highest: <strong>${playerHighestScore} pts</strong></p>
</div>
`
displayPlayerScore()

function displayPlayerScore() {
const points = document.querySelector(".points");


    points.innerHTML = `
    <p class="score">Score: <strong>${playerScore} pts</strong></p>
    <p class="score">Highest: <strong>${playerHighestScore} pts</strong></p>
    `
    if (isRegistered){
        if (playerLifes===3){
            document.querySelector(".lifes").innerHTML = `
            <svg width="20" height="18" viewBox="0 0 20 18"  fill="#EB5160" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            <svg width="20" height="18" viewBox="0 0 20 18"  fill="#EB5160" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            <svg width="20" height="18" viewBox="0 0 20 18"  fill="#EB5160" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
        </svg>
        `
        } else if (playerLifes===2){
            document.querySelector(".lifes").innerHTML = `
            <svg width="20" height="18" viewBox="0 0 20 18"  fill="#EB5160" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            <svg width="20" height="18" viewBox="0 0 20 18"  fill="#EB5160" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            <svg stroke="#EB5160""
            stroke-width="2" width="20" height="18" viewBox="-1 -1 22 20"  fill="none" stroke-c xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
        `
        } else {
            document.querySelector(".lifes").innerHTML = `
            <svg width="20" height="18" viewBox="0 0 20 18"  fill="#EB5160" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            <svg stroke="#EB5160""
            stroke-width="2" width="20" height="18" viewBox="-1 -1 22 20"  fill="none" stroke-c xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            
            <svg stroke="#EB5160""
            stroke-width="2" width="20" height="18" viewBox="-1 -1 22 20"  fill="none" stroke-c xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
        ` 
        }
    } else {
        if (playerLifes===2){
            document.querySelector(".lifes").innerHTML = `
            <svg width="20" height="18" viewBox="0 0 20 18"  fill="#EB5160" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            <svg width="20" height="18" viewBox="0 0 20 18"  fill="#EB5160" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
        `
        } else {
            document.querySelector(".lifes").innerHTML = `
            <svg width="20" height="18" viewBox="0 0 20 18"  fill="#EB5160" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            <svg stroke="#EB5160""
            stroke-width="2" width="20" height="18" viewBox="-1 -1 22 20"  fill="none" stroke-c xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            

        ` 
        }
    }
        

}

function noMoreLifes() {
    return new Promise(resolve =>{
        if(isRegistered){
            document.querySelector(".lifes").innerHTML = `
            <svg stroke="#EB5160""
            stroke-width="2" width="20" height="18" viewBox="-1 -1 22 20"  fill="none" stroke-c xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            <svg stroke="#EB5160""
            stroke-width="2" width="20" height="18" viewBox="-1 -1 22 20"  fill="none" stroke-c xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            <svg stroke="#EB5160""
            stroke-width="2" width="20" height="18" viewBox="-1 -1 22 20"  fill="none" stroke-c xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
        `  
        } else {
            document.querySelector(".lifes").innerHTML = `
            <svg stroke="#EB5160""
            stroke-width="2" width="20" height="18" viewBox="-1 -1 22 20"  fill="none" stroke-c xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
            <svg stroke="#EB5160""
            stroke-width="2" width="20" height="18" viewBox="-1 -1 22 20"  fill="none" stroke-c xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
            </svg>
        ` 
        }

    resolve();
    })
}




function cardClicked(event) {

    this.classList.add("obrocik");
    // cardTurnSound.play();
    cardsDrawn++;
    setTimeout(()=>{
        this.classList.remove("card-back");
    },200)
    this.classList.remove("clickable")
    this.removeEventListener("click", cardClicked);
    if (cardsDrawn === 1) {
        firstSelectedCard = this.dataset.value;
    }
    if (cardsDrawn === 2) {
        secondSelectedCard = this.dataset.value;
    }
    
    if (cardsDrawn > 1 && firstSelectedCard === secondSelectedCard) {
        solved++;
        cardsDrawn = 0
        floatingPointsPosition++;
        let awardPoints = (basePoints - (25*levelTimer.read()));
        let posX = event.clientX;
        let posY = event.clientY -100;

        if (floatingPointsPosition%2 === 0){
            floatingPoints(awardPoints,posX,posY,1);
        } else if (floatingPointsPosition%3===0){
            floatingPoints(awardPoints,posX,posY,2);
        } else {
            floatingPoints(awardPoints,posX,posY,3);
        }

        playerScore = parseInt(playerScore + awardPoints);
        if (playerScore > playerHighestScore){
            playerHighestScore = playerScore

        }
        displayPlayerScore();


    }
    if (cardsDrawn > 1 && firstSelectedCard !== secondSelectedCard) {
        loseGame();
            
    }
    if (solved === levelSize/2 && level === 4){
        bossChallenge();
    } else if (solved === levelSize/2 && level === 14){
        bossChallenge();
    } else if (solved === levelSize/2 && level === 24){
        bossChallenge();
    } else if (solved === levelSize/2 && level === 34){
        bossChallenge();
    } else if (solved === levelSize/2){

        winLevel();

    }

};



const startLevel = (isBoss)=>{


    contentWrapper.classList.remove("lose-screen");
    contentWrapper.classList.add("hidden");

    document.querySelector("#navbar").classList.remove("hidden");
    document.querySelector(".level").innerHTML = `Level ${level}`;
    floatingPointsPosition=0;

    if( level === 36) {
        introToLevelDuration = startingDuration;
        levelSize = 12;
        levelWrapper.classList.replace("grid-2x5","grid-3x4")
    } else if( level === 26) {
        introToLevelDuration = startingDuration;
        levelSize = 10;
        levelWrapper.classList.replace("grid-2x4","grid-2x5")
    } else if( level === 16) {
        introToLevelDuration = startingDuration;
        levelSize = 8;
        levelWrapper.classList.replace("grid-2x3","grid-2x4")
    } else if( level === 6) {
        introToLevelDuration = startingDuration;
        levelSize = 6;
        levelWrapper.classList.replace("grid-1x4","grid-2x3")
    }

    let currentLevel = createLevel(isBoss);
 
    displayPlayerScore();   

    fadeInOut(timerWrapper, 0,0.1, 1,50).then(()=>fadeInOut(timerWrapper, 1,-0.1, 0,50,introToLevelDuration));
    fadeInOut(levelWrapper, 0,0.1, 1,50);


    
    levelWrapper.innerHTML = "";
    currentLevel.forEach(card =>{
        const cardoo = document.createElement("div");
        cardoo.classList.add("cardoo");

        cardoo.setAttribute("data-value",`${card.shape}`)
        
        cardoo.innerHTML = `
            <div>
            </div>
            <img src="./files/${card.shape}.svg" onload="SVGInject(this)" fill=${card.color}></img>

        
        `;
        levelWrapper.appendChild(cardoo);
    })
   if (isMobile) {
       circularTimerMobile(introToLevelDuration/1000)
       .then(()=>hideCards())
   } else {
       circularTimer(introToLevelDuration/1000)
       .then(()=>hideCards())
   }
    
  

}



document.querySelector("#start").addEventListener("click",()=>{

    if (document.querySelector("input").value){
        isRegistered = true;
        playerLifes = 3;
        document.querySelector("#player-name").innerHTML = document.querySelector("input").value.split(/[^a-zA-Z0-9]/).join("");
    }
    contentWrapper.classList.add("hidden");
            contentWrapper.style.opacity = 0;

    contentWrapper.innerHTML = ``;
    
    countdown(3).then(()=>startLevel())
})

function hideCards() {
    solved = 0;
    cardsDrawn = 0
    displayPlayerScore();
    let currentCards = document.querySelectorAll(".cardoo");



    turnOver()
    .then(()=>clickActive())
    .then(()=>levelTimer.start())
   
    


    
}
function clickActive() {
    return new Promise(resolve =>{
        let currentLevel = document.querySelectorAll(".cardoo");
        for (let card of currentLevel){
        card.classList.add("clickable");
        card.addEventListener("click", cardClicked)
        resolve();
        }
    })
}

function turnCardsOver(ms,card) {
    return new Promise(resolve =>{
        setTimeout(() => {
            card.classList.add("card-back");      
            card.classList.remove("obrocik");
            // card.classList.add("obrocik2");
           
            
            resolve()
        }, ms);
    })
}
async function turnOver() {
    let currentLevel = document.querySelectorAll(".cardoo")
    
    for (let card of currentLevel){
        if (!card.classList.contains("card-back")){
            await  fadeInOut(card,1,-.2,0,10)
            .then(()=>turnCardsOver(10,card))
            .then(()=>fadeInOut(card,0,2,1,10))
        }
        
    }

}





function winLevel() {


    levelTimer.stop();
    displayPlayerScore();
    
    introToLevelDuration = introToLevelDuration-introDurationDeduction;
    level++;

    contentWrapper.innerHTML = `<h3>Level ${level}</h3>`
    fadeInOut(levelWrapper, 1,-0.1, 0,50,1500);
    setTimeout(()=>{
        fadeInOut(contentWrapper,0,.05,1,20)
        .then(()=>{inverseColors(1)})
        .then(()=> fadeInOut(contentWrapper,1,-.05,0,20,300))
        .then(()=> startLevel())
        // setTimeout(startLevel, 500);

    },1500)
}

function inverseColors(result=0) {
    return new Promise(resolve =>{
        if (result === 0){
            gameColor.classList.replace("game","boss");
        } else {
            gameColor.classList.replace("boss","game");
        }
        resolve();
    })
}
function bossChallenge() {
    levelTimer.stop();
    displayPlayerScore();
    
    introToLevelDuration = 2000;
    level++;

    contentWrapper.innerHTML = `<p class="boss-text">BOSS<br>CHALLENGE!</p>`
    fadeInOut(levelWrapper, 1,-0.1, 0,50,1500);
    setTimeout(()=>{
        fadeInOut(contentWrapper,0,.05,1,20)
        .then(()=>{inverseColors()})
        .then(()=> fadeInOut(contentWrapper,1,-.05,0,20,3000))
        .then(()=> startLevel(1))
        // setTimeout(startLevel, 500);

    },1500)
}

function loseGame() {
    if( playerLifes === 1) {
        ranking.push({id: ranking.length+1, name: playerName, score: playerScore, level: level});

        contentWrapper.style.opacity = 0;
        contentWrapper.classList.add("lose-screen");
        levelWhenLost = level;
        if( levelWhenLost > highestLevelReached) {
            highestLevelReached = levelWhenLost;
        }
        contentWrapper.innerHTML = `
        <div class="lost">
        <span="game-over-text">Game over</span>
        <div class="summary-wrapper">
        <p class="score">Finished with score of: <strong>${playerScore} pts</strong> at level: <strong>${levelWhenLost}</strong>.</p>
        <p class="score">Highest score: <strong>${playerHighestScore} pts</strong>.</p>
        <p class="score">Highest level reached: <strong>${highestLevelReached}</strong>.</p>
       

        </div>
        <input type="text" class="input input-two" placeholder="Your Name" maxlength="14">
        <button id="start" class="btn btn__primary">Try again</button>
        <p class="score name-reminder">Maybe type your name after all.</p>
        </div>
        
        
        `
        document.querySelector("#start").addEventListener("click",()=>{
            if (document.querySelector(".input-two").value){
                isRegistered = true;
                playerLifes = 3;
                document.querySelector("#player-name").innerHTML = document.querySelector(".input-two").value.split(/[^a-zA-Z0-9]/).join("");
            }
            if (gameColor.classList.contains("boss")){
                gameColor.classList.remove("boss");
                gameColor.classList.add("game");
            }
            contentWrapper.classList.add("hidden");
            contentWrapper.style.opacity = 0;
            contentWrapper.innerHTML = ``;
            levelSize = 4;
            levelWrapper.classList.remove("grid-1x4");
            levelWrapper.classList.remove("grid-2x3");
            levelWrapper.classList.remove("grid-2x4");
            levelWrapper.classList.remove("grid-2x5");
            levelWrapper.classList.remove("grid-3x4");

            levelWrapper.classList.add("grid-1x4");
            countdown(3).then(()=>startLevel())
        })
        // fadeInOut(levelWrapper, 1,-0.1, 0,50,1500);

        const lifeOne = document.querySelector(".lifes").children[0]
        fadeInOut(lifeOne, 1,-1, 0,10)
        .then(()=>fadeInOut(lifeOne,0,1,1,10,200))
        .then(()=>fadeInOut(lifeOne,1,-1,0,10,200))
        .then(()=>fadeInOut(lifeOne,0,1,1,10,200))
        .then(()=>fadeInOut(lifeOne,1,-1,0,10,200))
        .then(()=>fadeInOut(lifeOne,0,1,1,10,200))
        .then(()=>fadeInOut(lifeOne,1,-1,0,10,200))
        .then(()=>fadeInOut(lifeOne,0,1,1,10,200))
        .then(()=>fadeInOut(lifeOne,1,-1,0,10,200))
        .then(()=>fadeInOut(lifeOne,0,1,1,10,200))
        .then(()=>noMoreLifes())
        .then(()=>fadeInOut(levelWrapper, 1,-0.1, 0,50)) 
        .then(()=>fadeInOut(contentWrapper,0,.05,1,20))
        .then(()=>{contentWrapper.classList.remove("hidden")});

      

        let currentCards = document.querySelectorAll(".cardoo");
        currentCards.forEach((card)=>{
            card.classList.remove("clickable")
            card.removeEventListener("click", cardClicked);
        })    
        level = 1;
        playerScore = 0;
        if(isRegistered){
            playerLifes = 3;
        } else {
        playerLifes = 2;

        }
        introToLevelDuration = startingDuration;





    } else if (playerLifes === 2) {
  


        playerLifes--;
        introToLevelDuration = introToLevelDuration+introDurationDeduction;
        let currentCards = document.querySelectorAll(".cardoo");
        currentCards.forEach((card)=>{
            card.classList.remove("clickable");

            card.removeEventListener("click", cardClicked);
        })    
        const lifeTwo = document.querySelector(".lifes").children[1]
        if (level === 5 || level === 15 || level === 25 || level === 35){
            level--;
            fadeInOut(lifeTwo, 1,-1, 0,10)
            .then(()=>fadeInOut(lifeTwo,0,1,1,10,200))
            .then(()=>fadeInOut(lifeTwo,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeTwo,0,1,1,10,200))
            .then(()=>fadeInOut(lifeTwo,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeTwo,0,1,1,10,200))
            .then(()=>fadeInOut(lifeTwo,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeTwo,0,1,1,10,200))
            .then(()=>bossChallenge())
        } else {
            level--;
            fadeInOut(lifeTwo, 1,-1, 0,10)
            .then(()=>fadeInOut(lifeTwo,0,1,1,10,200))
            .then(()=>fadeInOut(lifeTwo,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeTwo,0,1,1,10,200))
            .then(()=>fadeInOut(lifeTwo,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeTwo,0,1,1,10,200))
            .then(()=>fadeInOut(lifeTwo,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeTwo,0,1,1,10,200))
            .then(()=>winLevel())
        }
 
   


    } else {
        playerLifes--;
        introToLevelDuration = introToLevelDuration+introDurationDeduction;
        let currentCards = document.querySelectorAll(".cardoo");
        currentCards.forEach((card)=>{
            card.classList.remove("clickable");

            card.removeEventListener("click", cardClicked);
        })    
        const lifeThree = document.querySelector(".lifes").children[2]
        if (level === 5 || level === 15 || level === 25 || level === 35){
            level--;
            fadeInOut(lifeThree, 1,-1, 0,10)
            .then(()=>fadeInOut(lifeThree,0,1,1,10,200))
            .then(()=>fadeInOut(lifeThree,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeThree,0,1,1,10,200))
            .then(()=>fadeInOut(lifeThree,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeThree,0,1,1,10,200))
            .then(()=>fadeInOut(lifeThree,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeThree,0,1,1,10,200))
            .then(()=>bossChallenge())
        } else {
            level--;
            fadeInOut(lifeThree, 1,-1, 0,10)
            .then(()=>fadeInOut(lifeThree,0,1,1,10,200))
            .then(()=>fadeInOut(lifeThree,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeThree,0,1,1,10,200))
            .then(()=>fadeInOut(lifeThree,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeThree,0,1,1,10,200))
            .then(()=>fadeInOut(lifeThree,1,-1,0,10,200))
            .then(()=>fadeInOut(lifeThree,0,1,1,10,200))
            .then(()=>winLevel())
        }
    }

}



const startButton = document.querySelector("#start")
const circle = document.querySelector("circle");








const fadeInOut = (element, startingOpacity,changeValue, boundary,interval,timeout=0)=>{
    return new Promise((resolve,reject)=>{
    let opacity = startingOpacity;
  
        setTimeout(()=>{
            const myInterval = setInterval(()=>{
                element.style.opacity = `${opacity}`;
                opacity = opacity + changeValue;
                if ((opacity > boundary && changeValue > 0) || (opacity < boundary && changeValue< 0)) {
                    clearInterval(myInterval);
                    element.style.opacity = boundary;
                    resolve()
                }
             
    
            }, interval);

        },timeout)

        
    });
};






function circularTimer(duration) {
    return new Promise(resolve=>{

        let timer = duration;
        timerWidth = window.innerWidth;
        timerHeight = window.innerHeight;   
        document.querySelector("#time-to-start").innerHTML = timer;
        
        document.querySelector("#time-to-start").parentElement.classList.remove("hidden");
    
        document.querySelector("#timer-container").setAttribute("width", timerWidth);
        document.querySelector("#timer-container").setAttribute("height", timerHeight);
    
        circle.style.opacity = 1;
        circle.setAttribute(`r`, Math.max(timerWidth,timerHeight));
        circle.setAttribute(`cx`, timerWidth/2);
        circle.setAttribute(`cy`, timerHeight/2);
        circle.setAttribute(`stroke-width`, Math.max(timerWidth*2,timerHeight*2));
        circle.setAttribute(`transform`,`rotate(-90 ${timerWidth/2} ${timerHeight/2})`);
        let perimeter = circle.getAttribute("r")*2*Math.PI;
        circle.setAttribute("stroke-dasharray", `${perimeter} ${perimeter}` );
        timerWrapper.style.display = "inherit";
        
    
        const circularTimerInterval = setInterval(()=>{
            if (timer <= 0){
    
                clearInterval(circularTimerInterval)
                timer = duration
                circle.setAttribute("stroke-dashoffset",0)
                circle.style.opacity = 0;
                document.querySelector("#time-to-start").parentElement.classList.add("hidden");
                timerWrapper.style.display = "none";

                resolve();
    
                } else {
                    timer = timer -0.01;
                    document.querySelector("#time-to-start").innerHTML = parseFloat(timer).toFixed(1);
            
                    circle.setAttribute("stroke-dashoffset",
                    perimeter * timer /duration - perimeter);
    
                }
    
            
        }, 10)


    })

  
}

function circularTimerMobile(duration) {
    return new Promise(resolve=>{

        let timer = duration;
        document.querySelector("#time-to-start").innerHTML = parseFloat(timer).toFixed(1);
        
        document.querySelector("#time-to-start").parentElement.classList.remove("hidden");
        const circularTimerInterval = setInterval(()=>{
            if (timer <= 0){
                clearInterval(circularTimerInterval)
                timer = 0;
                document.querySelector("#time-to-start").parentElement.classList.add("hidden");
                resolve();
    
                } else {
                    timer = timer -0.10;
                    document.querySelector("#time-to-start").innerHTML = parseFloat(timer).toFixed(1);
                }  
            
        }, 100)
    }) 
}


const levelTimer = { 
    start() {   
        this.time = 0;        
        this.startLevelTimerInterval = setInterval(()=>{
            if(this.time >= 20){
               this.stop(); 
            } else {
            this.time= this.time +0.01;
            }
        }, 10)     
    },
    stop() {
        clearInterval(this.startLevelTimerInterval)
        this.time = 20;
    },
    read() {
        let num = (this.time).toFixed(2);
        return parseFloat(num);
    }
}

const debounce = (func,delay=1000) => {
    let timeoutID;
    
    return (...args)=>{
        if(timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(()=>{
            func.apply(null, args);
        }, delay)
    };
};

window.addEventListener('resize', debounce(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  },50));