async function floatingPoints(amount,posX,posY,fpn=1){

    const fp = document.querySelector(`.fp${fpn}`); 
    fp.innerHTML = `${parseInt(amount)}`;
    fp.style.left = (posX)+"px";
    fp.style.top = (posY)+"px";
    fp.style.display = "inherit";

    const float = setInterval(()=>{
        posY = posY - 1;
        fp.style.top = (posY)+"px";
    },10);
    
    await fadeInOut(fp,0,0.05,1,20)
    await fadeInOut(fp,1,-0.05,0,20,200)
    fp.style.display = "none"; 
    clearInterval(float)
};