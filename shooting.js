let targets = document.querySelectorAll(".target")
let gameScore = document.querySelector("#gameScore")
let score = 0
let start = 0
let intervalId
let difficulty = document.querySelectorAll('input[name="difficulty"]')
let timeout = 700 // default to 'medium' if none selected

let button = document.getElementById("startBtn")
// Start button stays clickable; gameStart() will require a difficulty
const notification = document.getElementById("notification")
let notifTimeout
const gameTimerEl = document.getElementById('gameTimer')
const timerContainer = document.querySelector('.timerContainer')
const gameDuration = 10 // seconds
let countdownIntervalId
let gameEndTimeoutId
const stopButton = document.getElementById('stopBtn')

// Stop button disabled until game running
if (stopButton) stopButton.disabled = true

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

button.addEventListener("click", gameStart)
if (stopButton) stopButton.addEventListener('click', stopGame)

function showNotification(msg, duration = 3000) {
    if (!notification) {
        // fallback to alert if notification element missing
        alert(msg)
        return
    }
    clearTimeout(notifTimeout)
    const msgSpan = notification.querySelector('.notif-message')
    if (msgSpan) msgSpan.textContent = msg
    notification.classList.add('show')
    notifTimeout = setTimeout(() => {
        notification.classList.remove('show')
    }, duration)
}

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
    // Require a difficulty selection before starting
    const selected = Array.from(difficulty).some(d => d.checked)
    if (!selected) {
        showNotification("Please select the difficulty")
        return
    }

    if (start === 0) {
        start = 1
        score = 0
        updateScore(); // Update the score display
        // Disable start while game is running
        button.disabled = true
        // Start countdown display
        if (timerContainer) timerContainer.classList.add('show')
        clearInterval(countdownIntervalId)
        clearTimeout(gameEndTimeoutId)
        let remaining = gameDuration
        updateTimerDisplay(remaining)
        countdownIntervalId = setInterval(() => {
            remaining -= 1
            if (remaining < 0) remaining = 0
            updateTimerDisplay(remaining)
        }, 1000)

        // Enable Stop button while game is running
        if (stopButton) stopButton.disabled = false

        // End the game after `gameDuration` seconds
        gameEndTimeoutId = setTimeout(() => {
                start = 0
                clearInterval(intervalId)
                clearInterval(countdownIntervalId)
                // Re-enable start so user can play again
                button.disabled = false
                if (stopButton) stopButton.disabled = true
                updateTimerDisplay(0)
                if (timerContainer) timerContainer.classList.remove('show')
            }, gameDuration * 1000)
        gameLoop()
    }
}

function stopGame() {
    if (start === 0) return
    start = 0
    clearInterval(intervalId)
    clearInterval(countdownIntervalId)
    clearTimeout(gameEndTimeoutId)
    // Reset UI
    updateTimerDisplay(0)
    if (timerContainer) timerContainer.classList.remove('show')
    button.disabled = false
    if (stopButton) stopButton.disabled = true
}

function updateTimerDisplay(seconds) {
    if (!gameTimerEl) return
    gameTimerEl.textContent = String(seconds)
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