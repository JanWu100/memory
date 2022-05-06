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