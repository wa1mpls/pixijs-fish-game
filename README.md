#  Fish Game
![image](https://github.com/user-attachments/assets/18f09357-7819-4439-9344-6507fe4b94ec)

A simple fish-eating game built with **PixiJS**, where players control a small fish to eat other fish and grow bigger over time.

##  How to Play

1. **Movement**:
   - Use your mouse to control the fish
   - Click anywhere on the screen to move the fish to that position

2. **Objectives**:
   - Eat smaller fish to gain points and grow in size
   - Avoid larger fish or you'll lose a life
   - Try to achieve the highest score possible

3. **Game Mechanics**:
   - The player starts at level 2
   - Can grow up to level 4
   - You have 3 lives (hearts)
   - Game over when all lives are lost

##  Technologies Used

- **Game Engine**: PixiJS v7
- **Language**: JavaScript
- **Assets**: Sprite sheets and JSON animation data

##  Features

- Smooth fish animations
- Leveling and size-scaling system
- Drop shadow effects on menu UI
- Sound effects integrated
- Real-time score and progress tracking
- Smart collision detection

##  How to Run the Game

1. Clone the repository to your local machine
2. Open the `index.html` file using a web server (e.g. Live Server in VS Code)
3. Enjoy the game in your browser!

##  Assets Used

The game uses the following assets:
- Sprite sheets for the player fish (`user_fish 1.png` to `user_fish 5.png`)
- Backgrounds for the menu and gameplay
- AI fish sprites
- UI elements (buttons, heart icons, score display)

##  Code Structure

```
source/
├── entities/
│   ├── PlayerFish.js    # Logic for the player's fish
│   └── ...              # Other game entities
├── scenes/
│   ├── GameScene.js     # Main game scene
│   └── MenuScene.js     # Menu scene
├── utils/
│   └── ...              # Utility functions
└── constants.js         # Game constants and settings
```

##  Notes

- Optimized for modern browsers
- Recommended: Chrome or Edge for best performance
- Make sure your sound is on for full game experience

##  Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request to help improve the game.
