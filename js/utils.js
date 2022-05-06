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
