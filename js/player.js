class Player {
  constructor() {
    this.reset();
  }
  isRegistered = false;
  lifes = 2;
  displayedLifes = [];
  name;
  score = 0;
  highestScore = 0;
  highestLevelReached = 1;

  reset = () => {
    this.score = 0;
    this.isRegistered ? (this.lifes = 3) : (this.lifes = 2);
    this.displayedLifes = [];
    for (let i = 0; i < this.lifes; i++) {
      this.displayedLifes.push(1);
    }
    this.renderLifes();
  };

  register = () => {
    this.name = document
      .querySelector(".input")
      .value.trim()
      .split(/[^a-zA-Z0-9]/)
      .join("");
    document.querySelector("#player-name").innerHTML = this.name;
    this.isRegistered = true;
    this.reset();
  };
  
  renderLifes = async () => {
    let lifesToRender = [];

    for (let life of this.displayedLifes) {
      if (life === 1) {
        lifesToRender.push(lifeFull);
      } else {
        lifesToRender.push(lifeEmpty);
      }
    }
    const lifesRender = lifesToRender.join("");
    document.querySelector(".lifes").innerHTML = lifesRender;
  };

  loseLife = async () => {
    const currentLife = this.displayedLifes.lastIndexOf(1);
    this.lifes--;
    if (currentLife === -1) {
      return;
    } else {
      const life = document.querySelector(".lifes").children[currentLife];
      for (let i = 0; i < 4; i++) {
        await fadeInOut(life, 1, -1, 0, 10, 200).then(() =>
          fadeInOut(life, 0, 1, 1, 10, 200)
        );
      }
      this.displayedLifes[currentLife] = 0;
    }
    this.renderLifes();
  };
  checkForHighestScore = () => {
    if (this.score > this.highestScore) {
      this.highestScore = this.score;
    }
    if (levelWhenLost >= this.highestLevelReached) {
        this.highestLevelReached = levelWhenLost;
    }
    
  };
  import = async () => {
      this.name = localStorage.getItem("name")
      this.isRegistered = localStorage.getItem("isRegistered")
      this.highestScore = localStorage.getItem("highestScore")
  }
  export = () => {
    localStorage.setItem("name", this.name)
    localStorage.setItem("isRegistered", this.isRegistered)
    localStorage.setItem("highestScore", this.highestScore)

  }
}

const lifeFull = `
<svg width="20" height="18" viewBox="0 0 20 18"  fill="#EB5160" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
</svg>
`;
const lifeEmpty = `
<svg stroke="#EB5160""
    stroke-width="2" width="20" height="18" viewBox="-1 -1 22 20"  fill="none" stroke-c xmlns="http://www.w3.org/2000/svg">
    <path d="M19.9997 5.23392C19.9997 2.34811 17.6519 0 14.7668 0C13.7607 0.00108949 12.7762 0.291791 11.9309 0.837378C11.0856 1.38297 10.4152 2.16037 9.99983 3.07672C9.58472 2.1604 8.91455 1.38298 8.0694 0.837384C7.22425 0.291783 6.23988 0.00107523 5.23392 0C2.3471 0 0 2.34811 0 5.23392C0.00144708 5.99347 0.167778 6.74364 0.487502 7.43262C0.807226 8.1216 1.27272 8.73295 1.85182 9.22443L9.83418 17.1536C9.88157 17.2008 9.94574 17.2273 10.0126 17.2273C10.0795 17.2273 10.1437 17.2008 10.1911 17.1536L18.4701 8.92847C18.9559 8.44383 19.3411 7.86792 19.6036 7.23388C19.8662 6.59984 20.0007 5.92016 19.9997 5.23392Z"/>
</svg>
`;

