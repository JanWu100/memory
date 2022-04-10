console.log("hello")


// const shapes = ["maze1","maze2","maze3"];
// const colors = ["red","blue","green"];
// const deck = [];

// const createDeck = function() {
//     deck = [];
//     for (let shape of shapes){
//         deck.push({shape: shape, color: colors[colors.length-1]});
//         colors.pop()
//     }

// };
// createDeck();
// console.log(deck)

let currentLevel = 1;
let levelSize = 8;
const shapes = ["maze1","maze2","maze3","maze4","maze5"];
const colors = ["#0C4767","#EB5160","#66A182","#06BCC1","white"];
let deck = [];


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




let cardsDrawn = 0;
let solved = 0;
document.querySelector("#start").addEventListener("click",()=>{
    

    

    document.querySelector(".welcome-screen").classList.add("hidden");

    const level1 = createLevel();
  
    function abc() {
        console.log(solved)
        console.log(this)
        this.classList.add("obrocik");
        cardsDrawn++;
        setTimeout(()=>{
            this.classList.remove("hidden");
        },200)
        
        this.removeEventListener("click", abc);
        if (cardsDrawn === 1) {
            console.log("f  " + this.dataset.value)
            firstSelectedCard = this.dataset.value;
        }
        if (cardsDrawn === 2) {
            console.log("s  " + this.dataset.value)

            secondSelectedCard = this.dataset.value;
        }
        
        if (cardsDrawn > 1) {
            if (firstSelectedCard === secondSelectedCard){
            solved++;
            cardsDrawn = 0
            if (solved === levelSize/2){
                setTimeout(()=>{
                    console.log("you win")
                    document.querySelector(".win").innerHTML = "<h1>You win</h1>"
                }, 1000);
            }

            } else {
                let currentCards = document.querySelectorAll(".cardoo");
                currentCards.forEach((card)=>{
                    card.removeEventListener("click", abc);
                })    
                setTimeout(hideCards, 2000);
            }

        }
    }

    level1.forEach(card =>{
        console.log(card);
        const cardoo = document.createElement("div");
        cardoo.classList.add("cardoo");
        cardoo.setAttribute("data-value",`${card.shape}`)
        
        cardoo.innerHTML = `
            
            <img src="files/${card.shape}.svg" onload="SVGInject(this)" fill=${card.color}></img>
        
        
        `;
        document.querySelector(".current-level").appendChild(cardoo);
    })

    function hideCards() {
        solved = 0;
        cardsDrawn = 0
        let currentCards = document.querySelectorAll(".cardoo");
        currentCards.forEach((card)=>{
            card.classList.add("hidden");
            card.classList.remove("obrocik");
            card.addEventListener("click", abc);
        })
        
    }

    setTimeout(hideCards, 1000);

   


})

