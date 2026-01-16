// DOM Elements
const targets = document.querySelectorAll(".target")
const gameScore = document.querySelector("#gameScore")
const button = document.getElementById("startBtn")
const stopButton = document.getElementById('stopBtn')
const notification = document.getElementById("notification")
const gameTimerEl = document.getElementById('gameTimer')
const timerContainer = document.querySelector('.timerContainer')
const difficultyButtons = document.querySelectorAll('.difficulty-btn')
const difficultyContainer = document.querySelector('.difficultyContainer')

// Game State
let score = 0
let totalShots = 0
let hits = 0
let misses = 0
let combo = 0
let maxCombo = 0
let reactionTimes = []
let targetAppearTime = 0
let start = 0
let intervalId
let countdownIntervalId
let gameEndTimeoutId
let notifTimeout

// Game Settings
const gameDuration = 30 // seconds
let timeout = 700 // target display duration (medium default)
let targetSize = 80 // pixels

// Stats Elements
let accuracyEl, avgReactionEl, comboEl, missesEl

// Stop button disabled until game running
if (stopButton) stopButton.disabled = true

// Create stats panel on load
createStatsPanel()

// ========================================
// STATS PANEL
// ========================================

function createStatsPanel() {
    let statsContainer = document.querySelector('.stats-container')

    if (!statsContainer) {
        statsContainer = document.createElement('div')
        statsContainer.className = 'stats-container'

        // Insert after h2
        const h2 = document.querySelector('h2')
        h2.parentNode.insertBefore(statsContainer, h2.nextSibling)
    }

    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">Accuracy</div>
            <div class="stat-value" id="accuracy-stat">0%</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Avg Reaction</div>
            <div class="stat-value" id="reaction-stat">0ms</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Max Combo</div>
            <div class="stat-value" id="combo-stat">0</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Misses</div>
            <div class="stat-value" id="misses-stat">0</div>
        </div>
    `

    accuracyEl = document.getElementById('accuracy-stat')
    avgReactionEl = document.getElementById('reaction-stat')
    comboEl = document.getElementById('combo-stat')
    missesEl = document.getElementById('misses-stat')

    // Create combo counter overlay
    let comboContainer = document.querySelector('.combo-container')
    if (!comboContainer) {
        comboContainer = document.createElement('div')
        comboContainer.className = 'combo-container'
        comboContainer.innerHTML = `
            <div class="combo-label">COMBO</div>
            <div class="combo-value" id="combo-display">0</div>
        `
        document.body.appendChild(comboContainer)
    }
}

function setTimeoutBasedOnDifficulty() {
    timeout = 700
    const active = document.querySelector('.difficulty-btn.active')
    if (!active) return
    const val = active.dataset.value
    if (val === 'easy') {
        timeout = 1200
        targetSize = 100
    } else if (val === 'medium') {
        timeout = 800
        targetSize = 80
    } else {
        timeout = 500
        targetSize = 60
    }

    // Update target sizes
    targets.forEach(target => {
        target.style.width = targetSize + 'px'
        target.style.height = targetSize + 'px'
    })
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

// Add frame click handler for miss detection
const shootingFrame = document.getElementById('shootingFrame')
if (shootingFrame) shootingFrame.addEventListener('click', handleFrameClick)

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
    e.stopPropagation() // Prevent frame click

    // Only count a hit if the target is currently popped up (visible)
    if (!e.currentTarget.classList.contains('popup')) return

    // Calculate reaction time
    const reactionTime = Date.now() - targetAppearTime
    reactionTimes.push(reactionTime)

    // Update stats
    hits++
    totalShots++
    score += 10
    combo++

    if (combo > maxCombo) {
        maxCombo = combo
    }

    // Remove target
    e.currentTarget.classList.remove('popup')

    // Update displays
    updateScore()
    updateStats()
    createHitMarker(e.clientX, e.clientY)
    updateComboDisplay()
}

function positionTargetRandomly(target) {
    const shootingFrame = document.getElementById('shootingFrame')
    const frameRect = shootingFrame.getBoundingClientRect()
    const maxX = frameRect.width - targetSize - 20
    const maxY = frameRect.height - targetSize - 20

    const randomX = Math.random() * maxX + 10
    const randomY = Math.random() * maxY + 10

    target.style.left = randomX + 'px'
    target.style.top = randomY + 'px'
    target.style.bottom = 'auto' // Override old positioning
}

function targetPopUp(target) {
    target.classList.remove("popup")
    void target.offsetWidth
    target.classList.add("popup")
    targetAppearTime = Date.now()

    setTimeout(() => {
        if (target.classList.contains('popup')) {
            target.classList.remove("popup")
        }
    }, timeout)
}

// ========================================
// STATS & DISPLAY
// ========================================

function updateScore() {
    gameScore.textContent = "Score = " + score
}

function updateStats() {
    // Accuracy
    const accuracy = totalShots > 0 ? Math.round((hits / totalShots) * 100) : 0
    if (accuracyEl) accuracyEl.textContent = accuracy + '%'

    // Average reaction time
    const avgReaction = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 0
    if (avgReactionEl) avgReactionEl.textContent = avgReaction + 'ms'

    // Max combo
    if (comboEl) comboEl.textContent = maxCombo

    // Misses
    if (missesEl) missesEl.textContent = misses
}

// ========================================
// VISUAL FEEDBACK
// ========================================

function createHitMarker(x, y) {
    const marker = document.createElement('div')
    marker.className = 'hit-marker'
    marker.style.position = 'fixed'
    marker.style.left = (x - 50) + 'px'
    marker.style.top = (y - 50) + 'px'
    document.body.appendChild(marker)

    setTimeout(() => marker.remove(), 600)
}

function createMissMarker(x, y) {
    const marker = document.createElement('div')
    marker.className = 'miss-marker'
    marker.style.position = 'fixed'
    marker.style.left = (x - 40) + 'px'
    marker.style.top = (y - 40) + 'px'
    document.body.appendChild(marker)

    setTimeout(() => marker.remove(), 500)
}

function updateComboDisplay() {
    const comboContainer = document.querySelector('.combo-container')
    const comboDisplay = document.getElementById('combo-display')

    if (!comboContainer || !comboDisplay) return

    if (combo >= 3) {
        comboContainer.classList.add('show')
        comboDisplay.textContent = combo

        // Trigger animation
        comboDisplay.style.animation = 'none'
        setTimeout(() => {
            comboDisplay.style.animation = 'comboGlow 0.5s ease-in-out'
        }, 10)
    } else {
        comboContainer.classList.remove('show')
    }
}

function handleFrameClick(e) {
    if (start === 0) return

    // Check if click was on a target
    if (e.target.classList.contains('target')) return

    // Miss!
    totalShots++
    misses++
    combo = 0 // Reset combo

    createMissMarker(e.clientX, e.clientY)
    updateStats()
    updateComboDisplay()
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

        // Reset game state
        score = 0
        totalShots = 0
        hits = 0
        misses = 0
        combo = 0
        maxCombo = 0
        reactionTimes = []

        updateScore()
        updateStats()

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

        // Start game loop and spawn first target immediately
        spawnTarget()
        gameLoop()
    }
}

function stopGame() {
    if (start === 0) return
    start = 0
    clearInterval(intervalId)
    clearInterval(countdownIntervalId)
    clearTimeout(gameEndTimeoutId)

    // Hide all targets
    targets.forEach(target => target.classList.remove('popup'))

    // Reset UI
    updateTimerDisplay(0)
    if (timerContainer) timerContainer.classList.remove('show')
    button.disabled = false
    if (stopButton) stopButton.disabled = true

    // re-enable difficulty selection when stopped
    difficultyButtons.forEach(d => d.disabled = false)
    if (difficultyContainer) difficultyContainer.classList.remove('disabled')

    // Hide combo display
    const comboContainer = document.querySelector('.combo-container')
    if (comboContainer) comboContainer.classList.remove('show')

    // Show final stats
    showFinalStats()
}

function showFinalStats() {
    const accuracy = totalShots > 0 ? Math.round((hits / totalShots) * 100) : 0
    const avgReaction = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 0

    const message = `Game Over! Score: ${score} | Accuracy: ${accuracy}% | Avg Reaction: ${avgReaction}ms | Max Combo: ${maxCombo}`
    showNotification(message, 5000)
}

function updateTimerDisplay(seconds) {
    if (!gameTimerEl) return
    gameTimerEl.textContent = String(seconds)
}

function spawnTarget() {
    if (start === 0) return

    // Random target selection
    const randomIndex = Math.floor(Math.random() * targets.length)
    const target = targets[randomIndex]

    // Random position within shooting frame
    positionTargetRandomly(target)

    // Show target
    targetPopUp(target)
}

function gameLoop() {
    intervalId = setInterval(() => {
        if (start === 0) {
            clearInterval(intervalId)
        } else {
            spawnTarget()
        }
    }, timeout)
}