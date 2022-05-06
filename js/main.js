const startingLevelsize = 4;
const bossLevels = [5,10,15,20]
const startingDuration = 3000;
const introDurationDeduction = 200;
const basePoints = 500;
const shapes = ["maze1","maze2","maze3","maze4","maze5","maze6"];
const colors = ["#0C4767","#EB5160","#66A182","#06BCC1","#4CE0B3","#F1AA63"];


let levelSize = startingLevelsize;
let playerName = "Guest";

let deck = [];
let cardsDrawn = 0;
let solved = 0;
let introToLevelDuration = startingDuration;
let level = 1;
let playerScore = 0;
let playerHighestScore = 0;
let levelWhenLost = 1;
let highestLevelReached = 1;
let floatingPointsPosition = 0;
let highscores = [];
let playerLifes = 2;
let timerWidth = window.innerWidth;
let timerHeight = window.innerHeight;
let duration;
let isRegistered = false;

const ranking = [];


const levelWrapper = document.querySelector(".current-level");
const contentWrapper = document.querySelector("#content-wrapper");
const win = document.querySelector("#win");
const gameColor = document.querySelector("#game")
const timerWrapper = document.querySelector("#timer");

window.innerWidth <= 414 ? isMobile = true : isMobile = false

document.querySelector(".level").innerHTML = `Level ${level}`
document.querySelector(".score").innerHTML = `Score: <strong>${playerScore} pts</strong>`
document.querySelector(".highest-score").innerHTML = `Highest: <strong>${playerHighestScore} pts`


document.querySelector("#start").addEventListener("click",startGame)


displayPlayerScore()

function displayPlayerScore() {
    displayLifes() 
    const points = document.querySelector(".points");

    points.innerHTML = `
        <p class="score">Score: <strong>${playerScore} pts</strong></p>
        <p class="score">Highest: <strong>${playerHighestScore} pts</strong></p>
        `
}


function startGame() {
    if (document.querySelector(".input").value){
        isRegistered = true;
        resetLifes();
        document.querySelector("#player-name").innerHTML = document.querySelector(".input").value.split(/[^a-zA-Z0-9]/).join("");
    }
    if (gameColor.classList.contains("boss")){
        inverseColors(1);
    }
    contentWrapper.classList.add("hidden");
    contentWrapper.style.opacity = 0;
    contentWrapper.innerHTML = ``;

    levelSize = startingLevelsize;
    setGrid();
    countdown(3).then(()=>startLevel())
}

const startLevel = (isBoss)=>{
    contentWrapper.classList.remove("lose-screen");
    contentWrapper.classList.add("hidden");

    document.querySelector("#navbar").classList.remove("hidden");
    document.querySelector(".level").innerHTML = `Level ${level}`;
    floatingPointsPosition=0;
    
    switch (level-1) {
        case (bossLevels[3]):
        levelSize = startingLevelsize+8;
        resetIntroDuration()
        break;
        case (bossLevels[2]):
        levelSize = startingLevelsize+6;
        resetIntroDuration()
        break;
        case (bossLevels[1]):
        levelSize = startingLevelsize+4;
        resetIntroDuration()
        break;
        case (bossLevels[0]):
        levelSize = startingLevelsize+2;
        resetIntroDuration()
        break;
    }
    setGrid()

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

const resetIntroDuration = () => {
    introToLevelDuration = startingDuration;
}

function createLevel(isBoss = 0) {
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

function cardClicked(event) {
    
    this.classList.add("flip");
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

        switch (true) {
            case (floatingPointsPosition%2 === 0):
                floatingPoints(awardPoints,posX,posY,1);
            break;
            case (floatingPointsPosition%3 === 0):
                floatingPoints(awardPoints,posX,posY,2);
            break;
            default:
                floatingPoints(awardPoints,posX,posY,3);
            break;
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
    if (solved === levelSize/2 
        && (level === bossLevels[0]-1
            || level === bossLevels[1]-1
            || level === bossLevels[2]-1
            || level === bossLevels[3]-1)){
        bossChallenge();
    } else if (solved === levelSize/2){
        winLevel();
    }
};

function loseGame() {
    if( playerLifes === 1) {
        ranking.push({id: ranking.length+1, name: playerName, score: playerScore, level: level});

        contentWrapper.style.opacity = 0;
        contentWrapper.classList.add("lose-screen");
        levelWhenLost = level;
        if( levelWhenLost > highestLevelReached) {
            highestLevelReached = levelWhenLost;
        }
        if (!isRegistered) {

            const html = ` 
            <div class="lost">
                <span="game-over-text">Game over</span>
                <div class="summary-wrapper">
                <p class="score">Finished with score of: <strong>${playerScore} pts</strong> at level: <strong>${levelWhenLost}</strong>.</p>
                <p class="score">Highest score: <strong>${playerHighestScore} pts</strong>.</p>
                <p class="score">Highest level reached: <strong>${highestLevelReached}</strong>.</p>
                </div>`

            contentWrapper.innerHTML = `
            ${html}
                <input type="text" class="input" placeholder="Your Name" maxlength="14">
                <button id="restart" class="btn btn__primary">Try again</button>
                <p class="score name-reminder">Maybe type your name after all.</p>
            </div>
            `
        } else {
            contentWrapper.innerHTML = `
            ${html}
                <input hidden type="text" class="input" placeholder="Your Name" maxlength="14">
                <button id="restart" class="btn btn__primary">Try again</button>
            </div>
            `
        }
 
        document.querySelector("#restart").addEventListener("click",startGame)
     
        loseLife(playerLifes,6)
        .then(()=>displayLifes())
        .then(()=>fadeInOut(levelWrapper, 1,-0.1, 0,50)) 
        .then(()=>fadeInOut(contentWrapper,0,.05,1,20))
        .then(()=>{
            contentWrapper.classList.remove("hidden")
            resetLifes();
        });

        makeCardsNotClickable(); 
        level = 1;
        playerScore = 0;
        introToLevelDuration = startingDuration;

    } else {
        introToLevelDuration = introToLevelDuration+introDurationDeduction;
        makeCardsNotClickable();
           
        if (level === bossLevels[0] || level === bossLevels[1] || level === bossLevels[2] || level === bossLevels[3]){
            level--;
            loseLife(playerLifes, 4).then(()=> bossChallenge())
        } else {
            level--;
            loseLife(playerLifes, 4).then(()=> winLevel())
        }
    }
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
        .then(()=> fadeInOut(contentWrapper,1,-.05,0,20,2000))
        .then(()=> startLevel(1))
    },1500)
}

function winLevel() {
    levelTimer.stop();
    displayPlayerScore();
    if (introToLevelDuration > 1000) {
        introToLevelDuration = introToLevelDuration-introDurationDeduction;
    }
    level++;

    contentWrapper.innerHTML = `<h3>Level ${level}</h3>`
    fadeInOut(levelWrapper, 1,-0.1, 0,50,1500);
    setTimeout(()=>{
        fadeInOut(contentWrapper,0,.05,1,20)
        .then(()=>{inverseColors(1)})
        .then(()=> fadeInOut(contentWrapper,1,-.05,0,20,300))
        .then(()=> startLevel())
    },1500)
}

function makeCardsNotClickable() {
    return new Promise(resolve => {
        let currentCards = document.querySelectorAll(".cardoo");
        currentCards.forEach((card)=>{
        card.classList.remove("clickable")
        card.removeEventListener("click", cardClicked);
        }) 
    resolve()
    })
}

function hideCards() {
    solved = 0;
    cardsDrawn = 0
    displayPlayerScore();
    turnAllCardsOver()
    .then(()=>makeCardsClickable())
    .then(()=>levelTimer.start()) 
}

async function turnAllCardsOver() {
    let currentLevel = document.querySelectorAll(".cardoo")  
    for (let card of currentLevel){
        if (!card.classList.contains("card-back")){
            await fadeInOut(card,1,-.2,0,10)
            .then(()=>turnCardOver(10,card))
            .then(()=>fadeInOut(card,0,2,1,10))
        }       
    }
}

function turnCardOver(ms,card) {
    return new Promise(resolve =>{
        setTimeout(() => {
            card.classList.add("card-back");      
            card.classList.remove("flip");         
            resolve()
        }, ms);
    })
}

function makeCardsClickable() {
    return new Promise(resolve =>{
        let currentLevel = document.querySelectorAll(".cardoo");
        for (let card of currentLevel){
            card.classList.add("clickable");
            card.addEventListener("click", cardClicked)
            resolve();
        }
    })
}





