function countdown(number){
    return new Promise(resolve =>{
        const counter = document.querySelector("#countdown");
        counter.style.opacity = 1;
        counter.innerHTML = number;
        
        const countdownInterval = setInterval(() => {
            if (number === 1) {
                clearInterval(countdownInterval);
                counter.innerHTML = ``;
                counter.style.opacity = 0;
                resolve()
            } else {
            number = number-1;
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

function shuffle(arr) {
    for (let i = arr.length -1; i>0; i--) {
        let j = Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]] = [arr[j], arr[i]];
    };
};

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