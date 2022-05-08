const startingLevelsize = 4;
const bossLevels = [3,6,10,15]
const startingDuration = 2000;
const introDurationDeduction = 200;
const basePoints = 500;


/////////////////////////////////////
let levelSize = startingLevelsize;
let cardsDrawn = 0;
let solved = 0;
let introToLevelDuration = startingDuration;
let level = 1;
let levelWhenLost = 1;
let floatingPointsPosition = 0;

const levelWrapper = document.querySelector(".current-level");
const contentWrapper = document.querySelector("#content-wrapper");
const gameColor = document.querySelector("#game")
const timerWrapper = document.querySelector("#timer");
const playerNameInput = document.querySelector("#name-input")
const startButton = document.querySelector("#start")

window.innerWidth <= 414 ? isMobile = true : isMobile = false



const player = new Player();

if (localStorage.getItem("playerData")) {
    logUser()
}

startButton.addEventListener("click",startGame)
playerNameInput.addEventListener("input", debounce(changeStartButtonText,200))

async function startGame() {
    level = 1;
    introToLevelDuration = startingDuration;
    levelSize = startingLevelsize;
    if (document.querySelector(".input").value){
        player.register()      
    }
    
    inverseColors();
    
    player.reset()
    contentWrapper.style.opacity = 0;
    contentWrapper.innerHTML = ``;

    setGrid();
    await countdown(3)
    startLevel()
}

const startLevel = async ()=>{
    contentWrapper.classList.remove("lose-screen");
    contentWrapper.classList.add("hidden");
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
    displayPlayerScore();   
    await fadeInOut(timerWrapper, 0,0.2, 1,30)
    fadeInOut(levelWrapper, 0,0.1, 1,50);
 
    generateCards()

    if (isMobile) {
       await circularTimerMobile(introToLevelDuration/1000)
       timerWrapper.style.opacity = 0;
       hideCards()
    } else {
       await circularTimer(introToLevelDuration/1000)
       timerWrapper.style.opacity = 0;
       hideCards()
    }
}

const generateCards = () => {
    levelWrapper.innerHTML = "";
    let currentLevel = createLevel();
    currentLevel.forEach(card =>{
        const cardoo = document.createElement("div");
        cardoo.classList.add("cardoo");
        cardoo.setAttribute("data-value",`${card.shape}`)
        cardoo.innerHTML = `
            <div></div>
            <img src="./files/${card.shape}.svg" onload="SVGInject(this)" fill=${card.color}></img>    
        `;
        levelWrapper.appendChild(cardoo);
    })
}

const resetIntroDuration = () => {
    introToLevelDuration = startingDuration;
}

function displayPlayerScore() {
    const points = document.querySelector(".points");
    points.innerHTML = `
        <p class="score">Score: <strong>${player.score} pts</strong></p>
        <p class="score">Highest: <strong>${player.highestScore} pts</strong></p>
        `
}

function createLevel() {
    let deck = [];
    const shapes = ["maze1","maze2","maze3","maze4","maze5","maze6"];
    const colors = ["#0C4767","#EB5160","#66A182","#06BCC1","#4CE0B3","#F1AA63"];
    shuffle(shapes);
    shuffle(colors);
    if (bossLevels.includes(level)){
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

        switch (0) {
            case (floatingPointsPosition%2):
                floatingPoints(awardPoints,posX,posY,1);
            break;
            case (floatingPointsPosition%3):
                floatingPoints(awardPoints,posX,posY,2);
            break;
            default:
                floatingPoints(awardPoints,posX,posY,3);
            break;
        }
       
        player.score = parseInt(player.score + awardPoints);
        player.checkForHighestScore()
        displayPlayerScore();
    }
    if (cardsDrawn > 1 && firstSelectedCard !== secondSelectedCard) {
        loseGame();        
    }
    if (solved === levelSize/2 ) {
        winLevel();
    }
};

async function loseGame() {
    if( player.lifes === 1) {
        levelWhenLost = level;
        player.checkForHighestScore();
        player.export()
        generateLoseScreen()
        makeCardsNotClickable(); 
    
        await player.loseLife()
        await fadeInOut(levelWrapper, 1,-0.1, 0,50)
        await fadeInOut(contentWrapper,0,.05,1,20)  
        contentWrapper.classList.remove("hidden")
        player.reset()
    } else {
        restartLevel()
    }
}

const generateLoseScreen = () => {
    contentWrapper.style.opacity = 0;
    contentWrapper.classList.add("lose-screen");
    const html = ` 
    <div class="lost">
        <span="game-over-text">Game over</span>
        <div class="summary-wrapper">
        <p class="score">Finished with score of: <strong>${player.score} pts</strong> at level: <strong>${levelWhenLost}</strong>.</p>
        <p class="score">Highest score: <strong>${player.highestScore} pts</strong>.</p>
        <p class="score">Highest level reached: <strong>${player.highestLevelReached}</strong>.</p>
        </div>`
    if (!player.isRegistered) {
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
}

const restartLevel = async () => {
    introToLevelDuration = introToLevelDuration+introDurationDeduction;
    makeCardsNotClickable();
    level--;
    await player.loseLife()
    winLevel()
}

async function winLevel() {
    levelTimer.stop();
    displayPlayerScore();
    level++;
    if (bossLevels.includes(level)){
        introToLevelDuration = 2000;
        contentWrapper.innerHTML = `<p class="boss-text">BOSS<br>CHALLENGE!</p>`
    } else {
        if (introToLevelDuration >= 1000) {
            introToLevelDuration = introToLevelDuration-introDurationDeduction;
        }
        contentWrapper.innerHTML = `<h3>Level ${level}</h3>`
    }
    await fadeInOut(levelWrapper, 1,-0.1, 0,50,1500);
    await fadeInOut(contentWrapper,0,.05,1,20)
    await inverseColors()
    await fadeInOut(contentWrapper,1,-.05,0,20,500)
    startLevel() 
}

async function makeCardsNotClickable() {
        let currentCards = document.querySelectorAll(".cardoo");
        currentCards.forEach((card)=>{
        card.classList.remove("clickable")
        card.removeEventListener("click", cardClicked);
        }) 
}

async function hideCards() {
    solved = 0;
    cardsDrawn = 0
    displayPlayerScore();
    await turnAllCardsOver()
    await makeCardsClickable()
    levelTimer.start()
}

async function turnAllCardsOver() {
    let currentLevel = document.querySelectorAll(".cardoo")  
    for (let card of currentLevel){
        if (!card.classList.contains("card-back")){
            await fadeInOut(card,1,-.2,0,10)
            await turnCardOver(10,card)
            fadeInOut(card,0,2,1,10)
        }       
    }
}

async function turnCardOver(ms,card) {
        setTimeout(() => {
            card.classList.add("card-back");      
            card.classList.remove("flip");         
        }, ms);
}

async function makeCardsClickable() {
        let currentLevel = document.querySelectorAll(".cardoo");
        for (let card of currentLevel){
            card.classList.add("clickable");
            card.addEventListener("click", cardClicked)
        }
}
