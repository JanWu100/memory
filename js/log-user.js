const logUser = async () => {
    await player.import()
    document.querySelector("#start").innerHTML = `Play again`
    document.querySelector("#player-name").innerHTML = player.name
    document.querySelector("#name-input").placeholder = "Change name"
    document.querySelector(".welcome-message").innerHTML = `Welcome back, <strong>${player.name}</strong>. Your Highest Score is: <strong>${player.highestScore}</strong>.`
}