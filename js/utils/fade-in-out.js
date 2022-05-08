const fadeInOut = (element, startingOpacity,changeValue, endingOpacity,interval,timeout=0)=>{
    return new Promise((resolve,reject)=>{
    let opacity = startingOpacity;
        setTimeout(()=>{
            const myInterval = setInterval(()=>{
                element.style.opacity = `${opacity}`;
                opacity = opacity + changeValue;
                if ((opacity > endingOpacity && changeValue > 0) || (opacity < endingOpacity && changeValue< 0)) {
                    clearInterval(myInterval);
                    element.style.opacity = endingOpacity;
                    resolve()
                }
            }, interval);
        },timeout)
    });
};

