
let levelSize = 4;
const shapes = ["maze1","maze2","maze3","maze4","maze5"];
const colors = ["#0C4767","#EB5160","#66A182","#06BCC1","blue"];
let deck = [];
let cardsDrawn = 0;
let solved = 0;
let startingDuration = 3000;
let introToLevelDuration = startingDuration;
let level = 1;
let playerScore = 0;
let shamefulCounter = 0;
let highscores = [];
let basePoints = 500;
let playerLives = 2;
let introDurationDeduction = 100;
let timerWidth = window.innerWidth;
let timerHeight = window.innerHeight;
const levelWrapper = document.querySelector(".current-level");
const contentWrapper = document.querySelector("#content-wrapper");
const win = document.querySelector("#win");
const points = document.querySelector(".points");
const timerWrapper = document.querySelector("#timer");


contentWrapper.innerHTML = `
<section class="welcome-screen">
    <span class="welcome-message">Welcome to</span>
    <img src="files/amaze_Logo.svg" class="logo"/>


    
        <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim ducimus
        accusamus placeat nesciunt ipsa modi maxime omnis odio, laudantium
        voluptates, reprehenderit optio aliquam ut iusto voluptate officiis in
        ipsum ad.
        </p>
    
    <input type="text" class="input" placeholder="Your Name">
    <button id="start" class="btn">Start game</button>
</section>
`

timerWrapper.innerHTML = `
<svg id="timer-container" height="${timerHeight}" width="${timerWidth}">
    <circle 
    r="${Math.max(timerWidth,timerHeight)}" 
    cx="${timerWidth/2}" 
    cy="${timerHeight/2}"
    fill="transparent"
    stroke="rgb(242, 221, 181)"
    stroke-width="${Math.max(timerWidth*2,timerHeight*2)}"
    opacity="0"
    transform="rotate(-90 ${timerWidth/2} ${timerHeight/2})"></circle>
</svg>
`



function countdown(number){
    const counter = document.querySelector("#countdown");
    counter.style.opacity = 1;
    counter.innerHTML = number;
    const countdownInterval = setInterval(() => {
        if (number === 1) {
            clearInterval(countdownInterval);
            counter.innerHTML = ``;
            counter.style.opacity = 0;
        } else {
        number = number-1;
        counter.innerHTML = number;
        }; 
    }, 1000);
};

function floatingPoints(amount,posX,posY,fpn=1){
    const fp = document.querySelector(`.fp${fpn}`); 
    fp.innerHTML = `${parseInt(amount)}`;
    fp.style.left = (posX)+"px";
    fp.style.top = (posY)+"px";
    const float = setInterval(()=>{
        posY = posY - 1;
        fp.style.top = (posY)+"px";
    },10);
    fadeInOut(fp,0,0.05,1,20)
    .then(()=>fadeInOut(fp,1,-0.05,0,20,200))
    .then(()=>{clearInterval(float);});
};






function createLevel() { 
    deck = [];
    shuffle(shapes);
    shuffle(colors);
        for (let i = 0; i < levelSize/2 ; i++){
            deck.push({shape: shapes[i], color: colors[i]});
            deck.push({shape: shapes[i], color: colors[i]});
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



function displayPlayerScore() {
    points.innerHTML = `
    <div>
        <h2>Level ${level}</h2>
    </div>
    <div>
        <h4>Player points: <span class="player-score">${playerScore}</span></h4>
        <p>player lives: ${playerLives}</p>
    </div>`
}



// const trans = {
//     position: -140, 
//     moveX(){
//         // document.querySelector("#transition").style.left = `${this.position}%`; 

//         this.position+=4;
//         console.log(this.position) 

//     },
//     start() {
        
//         setInterval(this.moveX, 1000);
//         // if (this.position > 140 ){
//         //     this.reset();
//         //     console.log("more")
//         // } else {
//         //     console.log("less")
//         // }
//     },
//     reset(){
//         this.position = -140
//         clearInterval(transitionInterval)
//     }
// }

function cardClicked(event) {

    this.classList.add("obrocik");
    cardsDrawn++;
    setTimeout(()=>{
        this.classList.remove("card-back");
    },200)
    
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
        shamefulCounter++;
        let awardPoints = (basePoints - (25*levelTimer.read()));
        let posX = event.clientX -20;
        let posY = event.clientY -100;

        if (shamefulCounter%2 === 0){
            floatingPoints(awardPoints,posX,posY,1);
        } else {
            floatingPoints(awardPoints,posX,posY,2);
        }
        playerScore = parseInt(playerScore + awardPoints);
        displayPlayerScore();


    }
    if (cardsDrawn > 1 && firstSelectedCard !== secondSelectedCard) {
        loseGame();
            
    }
    if (solved === levelSize/2){

        winLevel();

    }
};


const startLevel = ()=>{
    shamefulCounter=0;
    let currentLevel = createLevel();
    displayPlayerScore();   

    circularTimer(introToLevelDuration/1000)
    fadeInOut(timerWrapper, 0,0.1, 1,50).then(()=>fadeInOut(timerWrapper, 1,-0.1, 0,50,introToLevelDuration));
    fadeInOut(levelWrapper, 0,0.1, 1,50);


    
    levelWrapper.innerHTML = "";
    currentLevel.forEach(card =>{
        const cardoo = document.createElement("div");
        cardoo.classList.add("cardoo");

        cardoo.setAttribute("data-value",`${card.shape}`)
        
        cardoo.innerHTML = `
            <div class="testowe">
            </div>
            <img src="files/${card.shape}.svg" onload="SVGInject(this)" fill=${card.color}></img>

        
        `;
        levelWrapper.appendChild(cardoo);
    })

    setTimeout(hideCards, introToLevelDuration);

}


document.querySelector("#start").addEventListener("click",()=>{
    contentWrapper.classList.add("hidden");
    contentWrapper.innerHTML = ``;

    countdown(3)
    setTimeout(startLevel,3000)
})

function hideCards() {
    solved = 0;
    cardsDrawn = 0
    displayPlayerScore();
    let currentCards = document.querySelectorAll(".cardoo");


    // trans.start();
    const myInterval = setInterval(transition, 6);
        let elementPosition = -140;
        function transition() {
            if (elementPosition < 140){
            document.querySelector("#transition").style.left = `${elementPosition}%`;
            return elementPosition+=4;

            } else {
            elementPosition = -140;
            clearInterval(myInterval);
            }
        }
    setTimeout(()=>{
        levelTimer.start()

        currentCards.forEach((card)=>{
            card.classList.add("card-back");
            
            card.classList.remove("obrocik");
            card.addEventListener("click", cardClicked);
        })
    }, 50);

    
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
        .then(()=> fadeInOut(contentWrapper,1,-.05,0,20,300))
        .then(()=> startLevel())
        // setTimeout(startLevel, 500);

    },1500)
}

function loseGame() {
    if( playerLives === 1) {
        let currentCards = document.querySelectorAll(".cardoo");
        currentCards.forEach((card)=>{
            card.removeEventListener("click", cardClicked);
        })    
        // setTimeout(hideCards, introToLevelDuration);
        level = 1;
        playerScore = 0;
        playerLives = 2;
        introToLevelDuration = startingDuration;
        countdown(3)
        setTimeout(startLevel,3000)
    } else {
        playerLives--;
        let currentCards = document.querySelectorAll(".cardoo");
        currentCards.forEach((card)=>{
            card.removeEventListener("click", cardClicked);
        })    
        setTimeout(hideCards, introToLevelDuration);


    }

}



const startButton = document.querySelector("#start")
const circle = document.querySelector("circle");

const perimeter = circle.getAttribute("r")*2*Math.PI;
circle.setAttribute("stroke-dasharray", perimeter);
let duration;







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
    let timer = duration;
    timerWidth = window.innerWidth;
    timerHeight = window.innerHeight;   
    document.querySelector("#timer-container").setAttribute("width", timerWidth);
    document.querySelector("#timer-container").setAttribute("height", timerHeight);

    circle.style.opacity = 1;
    circle.setAttribute(`r`, Math.max(timerWidth,timerHeight));
    circle.setAttribute(`cx`, timerWidth/2);
    circle.setAttribute(`cy`, timerHeight/2);
    circle.setAttribute(`stroke-width`, Math.max(timerWidth*2,timerHeight*2));
    circle.setAttribute(`transform`,`rotate(-90 ${timerWidth/2} ${timerHeight/2})`);


    const circularTimerInterval = setInterval(()=>{
        timer = timer -0.01;
        circle.setAttribute("stroke-dashoffset",
        perimeter * timer /duration - perimeter);
        if (timer <= 0){

            clearInterval(circularTimerInterval)
            timer = duration
            circle.setAttribute("stroke-dashoffset",0)
            circle.style.opacity = 0;
            }
    }, 10)
  
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