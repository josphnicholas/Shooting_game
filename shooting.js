let targets = document.querySelectorAll(".target")
let gameScore = document.querySelector("#gameScore")
let score = 0
let start = 0
let intervalId
let difficultyButtons = document.querySelectorAll('.difficulty-btn')
const difficultyContainer = document.querySelector('.difficultyContainer')
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
    timeout = 700
    const active = document.querySelector('.difficulty-btn.active')
    if (!active) return
    const val = active.dataset.value
    if (val === 'easy') timeout = 1000
    else if (val === 'medium') timeout = 700
    else timeout = 400
}

// Call the function initially to set the timeout based on the difficulty
setTimeoutBasedOnDifficulty()

// ensure a default active button exists
if (!document.querySelector('.difficulty-btn.active')) {
    const def = document.querySelector('.difficulty-btn[data-value="medium"]')
    if (def) def.classList.add('active')
}

// wire up difficulty buttons
difficultyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (start === 1) {
            showNotification('Cannot change difficulty during the game', 1200)
            return
        }
        difficultyButtons.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
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
    const selected = !!document.querySelector('.difficulty-btn.active')
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
        // disable difficulty selection while game runs
        difficultyButtons.forEach(d => d.disabled = true)
        if (difficultyContainer) difficultyContainer.classList.add('disabled')
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
                // re-enable difficulty selection
                difficultyButtons.forEach(d => d.disabled = false)
                if (difficultyContainer) difficultyContainer.classList.remove('disabled')
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
    // re-enable difficulty selection when stopped
    difficultyButtons.forEach(d => d.disabled = false)
    if (difficultyContainer) difficultyContainer.classList.remove('disabled')
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