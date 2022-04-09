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
const shapes = ["maze1","maze2","maze3","maze4,","maze5"];
const colors = ["red","blue","green","yellow","black"];
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






document.querySelector("#start").addEventListener("click",()=>{
    document.querySelector(".welcome-screen").classList.add("hidden");

    const level1 = createLevel();
    

    // console.log(level1)

    level1.forEach(card =>{
        console.log(card);
        const cardoo = document.createElement("div");
        cardoo.classList.add("cardoo");
        cardoo.innerHTML = card.color;

        document.querySelector(".current-level").appendChild(cardoo);
    })


})
