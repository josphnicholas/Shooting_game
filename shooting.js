let targets = document.querySelectorAll(".target")
let gameScore = document.querySelector("#gameScore")
let score = 0
let start = 0
let intervalId
let difficulty = document.querySelectorAll('input[name="difficulty"]')
let timeout = 700 // default to 'medium' if none selected

function setTimeoutBasedOnDifficulty() {
    // default
    timeout = 700
    difficulty.forEach((d) => {
        if (d.checked) {
            if (d.value === "easy") {
                timeout = 1000
            } else if (d.value === "medium") {
                timeout = 700
            } else {
                timeout = 400
            }
        }
    })
}

// Call the function initially to set the timeout based on the difficulty
setTimeoutBasedOnDifficulty()

difficulty.forEach((radio) => {
    radio.addEventListener("change", () => {
        // Update the timeout when the difficulty changes
        setTimeoutBasedOnDifficulty()
    })
})

targets.forEach((element) => {
    element.addEventListener("click", targetShot)
});

let button = document.getElementById("startBtn")
button.addEventListener("click", gameStart)

function targetShot(e) {
    // Only count a hit if the target is currently popped up (visible)
    if (!e.currentTarget.classList.contains('popup')) return
    score++
    updateScore()
}

function targetPopUp(target) {
    target.classList.add("popup")
    setTimeout(() => {
            target.classList.remove("popup")
        }, timeout) // Remove the 'popup' class after the specified duration
}

function updateScore() {
    gameScore.textContent = "Score = " + score
}

function gameStart() {
    if (start === 0) {
        start = 1
        score = 0
        updateScore(); // Update the score display
        setTimeout(() => {
                start = 0
                clearInterval(intervalId)
            }, 10000) // Set the game duration to 10 seconds
        gameLoop()
    }
}

function gameLoop() {
    intervalId = setInterval(() => {
            if (start === 0) {
                clearInterval(intervalId)
            } else {
                let random = Math.floor(Math.random() * 5 + 1)
                let target = document.querySelector("#target" + random)
                targetPopUp(target)
            }
        }, timeout) // Pop up targets based on the specified duration
}