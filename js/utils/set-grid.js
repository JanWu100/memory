function setGrid() {
    levelWrapper.classList.remove("grid-1x4","grid-2x3","grid-2x4","grid-2x5","grid-3x4");
    let appropriateGrid;
    switch (levelSize) {
        case (4):
            appropriateGrid = "grid-1x4"
        break;
        case (6):
            appropriateGrid = "grid-2x3"
        break;
        case (8):
            appropriateGrid = "grid-2x4"
        break;
        case (10):
            appropriateGrid = "grid-2x5"
        break;
        case (12):
            appropriateGrid = "grid-3x4"
        break;
    }
    levelWrapper.classList.add(`${appropriateGrid}`);
}