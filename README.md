# Shooting Game - Aim Trainer

A simple shooting game inspired by Aim Lab built with vanilla HTML, CSS, and JavaScript.

<img width="1904" height="945" alt="image" src="https://github.com/user-attachments/assets/0bdfa6ec-8189-4f03-8ca0-91f92f91a6a4" />

## Features

- **Three Difficulty Levels**: Easy, Medium, and Hard with varying target sizes and durations
- **Real-time Stats Tracking**: Accuracy, average reaction time, max combo, and misses
- **Visual Feedback System**: Hit/miss markers and combo counter
- **Cyberpunk Theme**: Neon colors, glassmorphism effects, and smooth animations
- **Responsive Design**: Works on desktop and mobile devices
- **30-Second Timed Sessions**: Quick gameplay sessions with final stats

## How to Play

1. Select your difficulty level (Easy/Medium/Hard)
2. Click "Start Game" to begin
3. Click on targets as they appear
4. Try to maintain a combo streak for bonus points
5. View your final stats when the timer runs out

## Technical Implementation

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Custom properties, animations, flexbox
- **Vanilla JavaScript**: ES6+ features, DOM manipulation

### Key Components

**Game Logic** ([shooting.js](shooting.js))
- Target spawning with random positioning
- Hit detection with bounding box validation
- Stats calculation and real-time updates
- Timeout management using Map data structure
- Visual feedback system

**Styling** ([style.css](style.css))
- CSS custom properties for theming
- Glassmorphism effects
- Keyframe animations
- Responsive breakpoints

**Structure** ([main.html](main.html))
- Semantic HTML5
- Accessible markup
- Stats panel with live updates

## Development Process

### Initial Development
The base game was developed independently, including:
- Core game loop and target spawning
- Basic hit detection
- Score tracking
- UI layout and controls

### AI-Assisted Refinements
The following enhancements were implemented with assistance from Claude Sonnet 3.5 and GitHub Copilot:

**Bug Fixes:**
- Fixed target flickering when same target selected consecutively
- Resolved premature target disappearance using timeout Map
- Improved hit detection for small targets with bounding box check
- Fixed missing notification on auto-game-end

**Feature Enhancements:**
- Added visual feedback system (hit/miss markers, combo display)
- Implemented comprehensive stats tracking
- Enhanced cyberpunk styling with animations
- Optimized layout to fit on one screen without scrolling

**Code Quality:**
- Refactored duplicate code in game end logic
- Removed unused functions
- Added inline documentation
- Improved code organization

### Development Tools
- **Code Editor**: Visual Studio Code
- **AI Assistants**: Claude Sonnet 3.5, GitHub Copilot
- **Browser DevTools**: Chrome DevTools for debugging
- **Version Control**: Git (manual commits)

## Learning Outcomes Demonstrated

**Primary: LO3 - Software Design and Realisation**
- Created interactive software using vanilla JavaScript
- Implemented quality criteria (performance, maintainability, UX)
- Documented development process and technical decisions
- Used modern web development best practices

**Secondary: LO1 & LO2 - User Interaction**
- Implemented visual feedback system for better UX
- Created responsive, accessible interfaces

## Known Limitations

- No persistent high score storage (could add localStorage)
- Limited to 6 targets (could be made configurable)
- No sound effects (could enhance user feedback)

## Future Improvements

- Add difficulty progression system
- Implement leaderboard with localStorage
- Add sound effects and music
- Create additional game modes (moving targets, time attack)
- Add customizable themes

## Acknowledgments

- Base game concept inspired by Aim Lab
- AI assistance provided by Claude Sonnet 3.5 and GitHub Copilot for refinements and bug fixes
- Cyberpunk color palette inspired by modern UI design trends
