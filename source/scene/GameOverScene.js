// GameOverScene.js
import { GameScene } from './GameScene.js';
import { MenuScene } from './MenuScene.js';
import { app } from '../app.js';
import { safelyDestroy } from '../utils/Deferred.js';
import { ASSETS } from '../constants.js';

export class GameOverScene {
  constructor() {
    console.log("GameOverScene constructed");
    this.container = new PIXI.Container();
    this.drawGameOverScreen();
  }

  drawGameOverScreen() {
    const width = app.screen.width;
    const height = app.screen.height;

    console.log("Drawing game over screen");

    const background = PIXI.Sprite.from('assets/image/background/over/game_over_background.png');
    background.width = width;
    background.height = height;
    this.container.addChild(background);

    //  Nút Restart
    const restartBtn = new PIXI.Sprite(PIXI.Texture.from('assets/image/background/over/restart button.png'));
    restartBtn.anchor.set(0.5);
    restartBtn.x = width / 2;
    restartBtn.y = height / 2 + 120;
    restartBtn.eventMode = 'static';
    restartBtn.cursor = 'pointer';

    const handleRestart = () => {
      console.log("Restart clicked");
      // Xóa event listeners
      restartBtn.off('pointerdown', handleRestart);
      restartBtn.eventMode = 'none';
      app.stage.eventMode = 'none';
      app.stage.removeAllListeners();

      // Dừng hoàn toàn game loop
      app.ticker.stop();

      requestAnimationFrame(() => {
        // Xóa scene hiện tại
        if (this.container) {
          this.container.destroy({ children: true });
        }
        app.stage.removeChildren();

        // Bắt đầu game mới
        console.log("Starting new game");
        const game = new GameScene(app);
        game.start();
      });
    };

    restartBtn.on('pointerdown', handleRestart);
    this.container.addChild(restartBtn);

    //  Nút Exit
    const exitText = new PIXI.Text('Exit', {
      fontSize: 26,
      fill: '#ffffff',
      stroke: '#ff0000',
      strokeThickness: 3,
    });
    exitText.anchor.set(0.5);
    exitText.x = width / 2;
    exitText.y = height / 2 + 180;
    exitText.eventMode = 'static';
    exitText.cursor = 'pointer';

    const handleExit = () => {
      console.log("Exit clicked");
      // Xóa event listeners
      exitText.off('pointerdown', handleExit);
      exitText.eventMode = 'none';
      app.stage.eventMode = 'none';
      app.stage.removeAllListeners();

      // Dừng hoàn toàn game loop
      app.ticker.stop();

      requestAnimationFrame(() => {
        // Xóa scene hiện tại
        if (this.container) {
          this.container.destroy({ children: true });
        }
        app.stage.removeChildren();

        // Quay về menu
        console.log("Exiting to menu");
        window.exitToMenu();
      });
    };

    exitText.on('pointerdown', handleExit);
    this.container.addChild(exitText);
  }

  show() {
    console.log("GameOverScene.show() called");
    // Dừng mọi hoạt động game
    app.ticker.stop();
    app.stage.eventMode = 'none';
    app.stage.removeAllListeners();
    
    // Xóa stage cũ
    while (app.stage.children.length > 0) {
      const child = app.stage.children[0];
      child.destroy({ children: true });
      app.stage.removeChild(child);
    }

    // Thiết lập scene mới
    document.getElementById('ui').style.display = 'none';
    app.stage.eventMode = 'static';
    app.stage.addChild(this.container);
    
    // Khởi động ticker lại
    app.ticker.start();
    
    console.log("GameOverScene displayed");
  }

  destroy() {
    console.log("GameOverScene.destroy() called");
    // Dừng mọi hoạt động
    app.ticker.stop();
    app.stage.eventMode = 'none';
    app.stage.removeAllListeners();
    
    // Xóa container và các đối tượng con
    if (this.container) {
      this.container.destroy({ children: true });
    }
  }
}
