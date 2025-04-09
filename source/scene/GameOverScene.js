// GameOverScene Logic Placeholder
//import * as PIXI from 'pixi.js';
import { GameScene } from './GameScene.js';
import { app } from '../app.js';

export class GameOverScene {
  constructor(finalScore) {
    this.container = new PIXI.Container();
    this.finalScore = finalScore;

    this.drawGameOverScreen();
  }

  drawGameOverScreen() {
    const width = app.screen.width;
    const height = app.screen.height;

    // Nền mờ
    const overlay = new PIXI.Graphics();
    overlay.beginFill(0x000000, 0.7);
    overlay.drawRect(0, 0, width, height);
    overlay.endFill();
    this.container.addChild(overlay);

    // Text GAME OVER
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 48,
      fill: '#ffffff',
      stroke: '#ff0000',
      strokeThickness: 5,
    });

    const gameOverText = new PIXI.Text('💀 GAME OVER 💀', style);
    gameOverText.anchor.set(0.5);
    gameOverText.x = width / 2;
    gameOverText.y = height / 2 - 50;
    this.container.addChild(gameOverText);

    // Hiển thị điểm
    const scoreText = new PIXI.Text(`Final Score: ${this.finalScore}`, {
      fontSize: 28,
      fill: '#fff',
    });
    scoreText.anchor.set(0.5);
    scoreText.x = width / 2;
    scoreText.y = height / 2 + 10;
    this.container.addChild(scoreText);

    // Nút chơi lại
    const restartText = new PIXI.Text('Click to Restart', {
      fontSize: 20,
      fill: '#aaa',
    });
    restartText.anchor.set(0.5);
    restartText.x = width / 2;
    restartText.y = height / 2 + 60;
    this.container.addChild(restartText);

    // Xử lý click
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.on('pointerdown', () => {
      app.stage.removeChildren(); 
      const game = new GameScene(app);
      game.start();
    });
  }

  show() {
    app.stage.removeChildren(); // clear hết
    app.stage.addChild(this.container);
  }
}
