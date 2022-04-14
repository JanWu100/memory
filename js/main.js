
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

const win = document.querySelector("#win");
const points = document.querySelector(".points");

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
    fadeInOut(fp,0,0.05,1,20).then(()=>fadeInOut(fp,1,-0.05,0,20,200)).then(()=>{
        clearInterval(float);
    });
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

const startLevel = ()=>{

    shamefulCounter=0;
   
    

    displayPlayerScore();   
    let currentLevel = createLevel();
    circularTimer(introToLevelDuration/1000)
  
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
            let currentCards = document.querySelectorAll(".cardoo");
                currentCards.forEach((card)=>{
                    card.removeEventListener("click", cardClicked);
                })    
                setTimeout(hideCards, introToLevelDuration);
                level = 1;
                playerScore = 0;
                introToLevelDuration = startingDuration;
                
        }
        if (solved === levelSize/2){

            levelTimer.stop();
            displayPlayerScore();
            const advanceLevel = document.querySelector("#advance")
            introToLevelDuration = introToLevelDuration-500;
            level++;
            advanceLevel.innerHTML = `<h3>Level ${level}</h3>`
            setTimeout(()=>{
                fadeInOut(advanceLevel,0,.05,1,20).then(()=> fadeInOut(advanceLevel,1,-.05,0,20,100))
                setTimeout(startLevel, 500);

            },1500)

        }
    };

    const levelWrapper = document.querySelector(".current-level");
    
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
    let currentCards = document.querySelectorAll(".cardoo");
    

    function hideCards() {
        solved = 0;
        cardsDrawn = 0
        displayPlayerScore();

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

    

    setTimeout(hideCards, introToLevelDuration);

   



}


document.querySelector("#start").addEventListener("click",()=>{
    document.querySelector(".welcome-screen").classList.add("hidden");

    countdown(3)
    setTimeout(startLevel,3000)
})







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
    circle.style.opacity = 1;
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