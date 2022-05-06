const smallStartCounter = document.querySelector("#time-to-start");

if (!isMobile) {
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
    
}


function circularTimer(duration) {
    return new Promise(resolve=>{
        const circle = document.querySelector("circle");
        let timer = duration;
        timerWidth = window.innerWidth;
        timerHeight = window.innerHeight;   
        smallStartCounter.innerHTML = timer;
        smallStartCounter.parentElement.classList.remove("hidden");
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
                smallStartCounter.parentElement.classList.add("hidden");
                timerWrapper.style.display = "none";

                resolve();
    
                } else {
                    timer = timer -0.01;
                    smallStartCounter.innerHTML = parseFloat(timer).toFixed(1);
                    circle.setAttribute("stroke-dashoffset",
                    perimeter * timer /duration - perimeter);
                } 
        }, 10)
    })
}

function circularTimerMobile(duration) {
    return new Promise(resolve=>{

        let timer = duration;
        smallStartCounter.innerHTML = parseFloat(timer).toFixed(1);
        smallStartCounter.parentElement.classList.remove("hidden");
        const circularTimerInterval = setInterval(()=>{
            if (timer <= 0){
                clearInterval(circularTimerInterval)
                timer = 0;
                smallStartCounter.parentElement.classList.add("hidden");
                resolve();
    
                } else {
                    timer = timer -0.10;
                    smallStartCounter.innerHTML = parseFloat(timer).toFixed(1);
                }  
            
        }, 100)
    }) 
}