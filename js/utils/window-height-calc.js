const calculateWindowHeight = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
}
calculateWindowHeight();
window.addEventListener('resize', debounce(calculateWindowHeight,100));