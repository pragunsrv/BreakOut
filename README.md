# Breakout Game - Version 10

This is a version 10 of the Breakout game, which includes enhanced functionality, sound effects, visual effects, and more.

## Features

- **Ball Trail Effect**: The ball leaves a fading trail as it moves.
- **Brick Types and Behaviors**:
  - **Normal**: Standard bricks.
  - **Explosive**: Destroy nearby bricks when hit.
  - **Double Score**: Doubles the points when hit.
  - **Multi-Hit**: Requires multiple hits to break.
  - **Bonus Life**: Provides an extra life.
  - **Speed Ball**: Increases the ball speed.
- **Power-Ups**:
  - **Expand Paddle**: Increases the paddle size.
  - **Extra Life**: Adds an extra life.
  - **Slow Ball**: Slows down the ball.
  - **Speed Ball**: Speeds up the ball.
  - **Multi Ball**: Adds additional balls.
  - **Bonus Life**: Adds an extra life and bonus points.
- **Levels**: Progress through multiple levels with increasing difficulty.
- **Sound Effects**: Sounds for hitting bricks, collecting power-ups, and game over (muted by default).
- **Pause and Resume**: Ability to pause and resume the game.

## How to Play

1. Open the `index.html` file in a web browser.
2. Use the left and right arrow keys to move the paddle.
3. Press the "P" key to pause or resume the game.
4. Break all the bricks to progress to the next level.
5. Collect power-ups to gain advantages.

## Files

- `index.html`: The main HTML file that sets up the game canvas.
- `styles.css`: The CSS file that styles the game canvas and background.
- `script.js`: The JavaScript file that contains the game logic and functionality.
- `sounds/brick_hit.mp3`: Sound for hitting a brick.
- `sounds/paddle_hit.mp3`: Sound for hitting the paddle.
- `sounds/power_up.mp3`: Sound for collecting a power-up.
- `sounds/game_over.mp3`: Sound for game over.

## Setup

1. Clone or download this repository.
2. Ensure all the files (`index.html`, `styles.css`, `script.js`, and sound files) are in the same directory.
3. Open `index.html` in a web browser to start playing the game.

## Version History

### Version 1
- Basic Breakout game setup with paddle, ball, and bricks.

### Version 2
- Added score display.

### Version 3
- Added lives display and game over logic.

### Version 4
- Improved paddle movement and collision detection.

### Version 5
- Added brick colors and improved brick layout.

### Version 6
- Implemented power-ups with various effects.

### Version 7
- Added sound effects for game events.

### Version 8
- Implemented ball trail effect and additional visual enhancements.

### Version 9
- Added level progression and multiple levels.

### Version 10
- Enhanced functionality with more brick types, improved power-up effects, ball trail, and pause/resume feature.

## License

This project is licensed under the MIT License.
