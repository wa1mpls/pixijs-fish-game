import { ASSETS } from '../constants.js';
import { GameScene } from './GameScene.js';
import { app } from '../app.js';

export class MenuScene {
  constructor() {
    this.container = new PIXI.Container();

    this.drawStartScreen();
  }

  drawStartScreen() {
    const width = app.screen.width;
    const height = app.screen.height;

    const bg = new PIXI.Sprite(PIXI.Texture.from(ASSETS.star_game_background));
    bg.width = width;
    bg.height = height;
    this.container.addChild(bg);

    const button = new PIXI.Sprite(PIXI.Texture.from(ASSETS.start_button));
    button.anchor.set(0.5);
    button.x = width / 2;
    button.y = height / 2 + 100;
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', () => {
      this.startGame();
    });

    this.container.addChild(button);
  }

  show() {
    document.getElementById('ui').style.display = 'none';
    app.stage.removeChildren();
    app.stage.addChild(this.container);
  }

  startGame() {
    app.stage.removeChildren();
    const game = new GameScene(app);
    game.start();
  }
  
}
