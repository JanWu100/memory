
let levelSize = 8;
const shapes = ["maze1","maze2","maze3","maze4","maze5"];
const colors = ["#0C4767","#EB5160","#66A182","#06BCC1","white"];

let deck = [];
let cardsDrawn = 0;
let solved = 0;
let introToLevelDuration = 3000;
let level = 1;

const win = document.querySelector("#win")

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
    }
}








const startLevel = ()=>{

    

    

    document.querySelector(".welcome-screen").classList.add("hidden");
    
    let currentLevel = createLevel();
    timer.start();
  
    function abc() {
        // console.log(solved)
        // console.log(this)
        // flip(this,100,-20).then(()=> flip(this,1,20))
        // console.log(this)
        this.classList.add("obrocik");
        this.classList.remove("fade-in");
        cardsDrawn++;
        setTimeout(()=>{
            this.classList.remove("hidden");
        },200)
        
        this.removeEventListener("click", abc);
        if (cardsDrawn === 1) {
            firstSelectedCard = this.dataset.value;
        }
        if (cardsDrawn === 2) {
            secondSelectedCard = this.dataset.value;
        }
        
        if (cardsDrawn > 1 && firstSelectedCard === secondSelectedCard) {
            solved++;
            cardsDrawn = 0

        }
        if (cardsDrawn > 1 && firstSelectedCard !== secondSelectedCard) {
            let currentCards = document.querySelectorAll(".cardoo");
                currentCards.forEach((card)=>{
                    card.removeEventListener("click", abc);
                })    
                setTimeout(hideCards, introToLevelDuration);
                level = 1;
        }
        if (solved === levelSize/2){
            // setTimeout(()=>{
            //     win.innerHTML = `
                
            //     <h1>You win</h1>
            //     <button id="start2">Start game</button>
            //     `
            //     win.classList.add("win");
            //     document.querySelector("#start2").addEventListener("click",startLevel)
            // }, 1000);
            const advanceLevel = document.querySelector("#advance")
            introToLevelDuration = introToLevelDuration-100;
            level++;
            advanceLevel.innerHTML = `<h3>Level ${level}</h3>`
            setTimeout(()=>{
                advance(advanceLevel,0,.05,1,20).then(()=> advance(advanceLevel,1,-.05,0,30))
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
            
            <img src="files/${card.shape}.svg" onload="SVGInject(this)" fill=${card.color} width="70%" height="70%"></img>
        
        
        `;
        levelWrapper.appendChild(cardoo);
    })
    let currentCards = document.querySelectorAll(".cardoo");
    currentCards.forEach(card =>{
        card.classList.add("fade-in");
    })

    function hideCards() {
        solved = 0;
        cardsDrawn = 0
        
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
            currentCards.forEach((card)=>{
                card.classList.add("hidden");
                
                card.classList.remove("obrocik");
                card.classList.remove("fade-in");
                card.addEventListener("click", abc);
            })
        }, 50);
 
        
    }

    

    setTimeout(hideCards, introToLevelDuration);

   
    win.innerHTML = ``;
    win.classList.remove("win");


}


document.querySelector("#start").addEventListener("click",startLevel)





// const tescik = document.querySelector(".tescik")
// const flip = (element, startingWidth,changeValue)=>{
//     return new Promise((resolve,reject)=>{
//     let elementWidth = startingWidth;

//         const myInterval = setInterval(()=>{
//             element.style.width = `${elementWidth}%`;
//             elementWidth = elementWidth + changeValue;
//             if (elementWidth > 100 + changeValue) {
//                 elementWidth = 100;
//                 clearInterval(myInterval);
//                 resolve()
//             }
//             if (elementWidth < 0 + changeValue) {

//                 clearInterval(myInterval);
//                 resolve()
//             }

//         }, 40);
        
//     });
// };





// tescik.addEventListener("click", function(){
//     flip(this,100,-5).then(()=> flip(this,1,5))
// })




const startButton = document.querySelector("#start")
const circle = document.querySelector("circle");

const perimeter = circle.getAttribute("r")*2*Math.PI;
circle.setAttribute("stroke-dasharray", perimeter);
let duration;






function getPoints(){
    const dynamicPoints = document.createElement("h3");
        dynamicPoints.classList.add("dynamic-points");

        
        
        dynamicPoints.innerHTML = `
            
            300
        
        
        `;
        document.querySelector(".container").appendChild(dynamicPoints);


}

const advance = (element, startingOpacity,changeValue, boundary,interval)=>{
    return new Promise((resolve,reject)=>{
    let opacity = startingOpacity;


        const myInterval = setInterval(()=>{
            element.style.opacity = `${opacity}`;
            opacity = opacity + changeValue;
            if ((opacity > boundary && changeValue > 0) || (opacity < boundary && changeValue< 0)) {
                clearInterval(myInterval);
                element.style.opacity = boundary;
                resolve()
            }
         

        }, interval);
        
    });
};



// tescik.addEventListener("click", function(){
//     flip(this,100,-5).then(()=> flip(this,1,5))
// })





class Timer {
    constructor(duration, startButton, callbacks) {
        this.duration = duration;
        this.startButton = startButton;
        this.initialDuration = duration;
        if (callbacks) {
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onComplete = callbacks.onComplete;
        }

        // this.startButton.addEventListener("click", this.start)

    }
    start = () => {
        if(this.onStart){
            this.onStart(this.timeRemaining);
        }
        this.tick();
        this.interval = setInterval(this.tick, 10);
    }
    stop = () => {
        clearInterval(this.interval)
        this.timeRemaining = this.initialDuration;
        
    };
    tick = () =>{
        
        if (this.timeRemaining <= 0){

            this.stop();
            
            if(this.onComplete){
                this.onComplete(this.timeRemaining);
            }
        } else {
            this.timeRemaining = this.timeRemaining -0.01;
            if(this.onTick){
                this.onTick(this.timeRemaining);
            }
        }
    }
    get timeRemaining() {
        return this.duration
    }
    set timeRemaining(time) {
        this.duration = time.toFixed(2);
    }
}




const timer = new Timer(introToLevelDuration/1000,startButton, {
    onStart(totalDuration) {
        circle.style.opacity = 1;
        duration = totalDuration;

    },

    onTick(timeRemaining) {
        circle.setAttribute("stroke-dashoffset",
        perimeter * timeRemaining /duration - perimeter);
        
        

    },
    onComplete(totalDuration) {
        
        circle.setAttribute("stroke-dashoffset",0)
        circle.style.opacity = 0;
    }


})