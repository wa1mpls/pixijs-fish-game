//import * as PIXI from 'pixi.js';
import { app } from '../app.js';
import { ASSETS } from '../constants.js';
import { PlayerFish } from '../entities/Players.js';
import { SmallFish } from '../entities/Enemy.js';
import { GameStats } from '../utils/GameStats.js';
import { getRandomPosition } from '../utils/Helpers.js';
import { LevelSystem } from '../systems/LevelSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { SpawnSystem } from '../utils/SpawnSystem.js';

export class GameScene {
  constructor(appInstance) {
    this.app = appInstance;
    this.container = new PIXI.Container();
    this.player = null;
    this.enemies = [];
    this.stats = new GameStats();
    this.levelSystem = null;
    this.spawnSystem = null;
    this.collisionSystem = null;
    this.startTime = Date.now();
  }

  start() {
    this.app.stage.addChild(this.container);

    // Background
    const bg = new PIXI.Sprite(PIXI.Texture.from(ASSETS.background));
    bg.width = this.app.screen.width;
    bg.height = this.app.screen.height;
    this.container.addChild(bg);

    // Seaweed & Coral
    this.addDecorations();

    // Player
    this.player = new PlayerFish();
    this.player.sprite.x = this.app.screen.width / 2;
    this.player.sprite.y = this.app.screen.height / 2;
    this.container.addChild(this.player.sprite);

    // Enemies khởi đầu
    this.spawnEnemies(8); // spawn nhiều hơn, để duy trì gameplay

    // Hệ thống phụ
    this.levelSystem = new LevelSystem(this, this.player, this.stats);
    this.spawnSystem = new SpawnSystem(this.container);
    this.collisionSystem = new CollisionSystem(this, this.player, this.stats);

    // Di chuyển theo chuột
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;
    
    this.app.stage.on('pointerdown', (e) => {
      const pos = e.global;
      this.player.setTarget(pos.x, pos.y);
    });
    

    // Game loop
    this.app.ticker.add((delta) => this.update(delta));
  }

  update(delta) {
    this.player.update(delta);

    for (const enemy of this.enemies) {
      enemy.update(delta);

      if (this.hitTest(this.player.sprite, enemy.sprite)) {
        this.container.removeChild(enemy.sprite);
        this.enemies = this.enemies.filter(e => e !== enemy);
        this.stats.addScore(10);
      }
    }

    // Giữ số lượng cá liên tục
    if (this.enemies.length < 8) {
      this.spawnEnemies(2);
    }

    this.levelSystem.update();

    const now = Date.now();
    this.spawnSystem.update(delta, now - this.startTime);

    const activeObjects = this.spawnSystem.getObjects();
    this.collisionSystem.update(activeObjects);

    if (this.player.isDead()) {
      import('../scene/GameOverScene.js').then(module => {
        const over = new module.GameOverScene(this.stats.score);
        over.show();
      });
    }
  }

  spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
      const enemy = new SmallFish();
      const { x, y } = getRandomPosition(this.app.screen);
      enemy.sprite.x = x;
      enemy.sprite.y = y;
      this.enemies.push(enemy);
      this.container.addChild(enemy.sprite);
    }
  }

  hitTest(a, b) {
    const ab = a.getBounds();
    const bb = b.getBounds();
    return ab.x + ab.width > bb.x &&
           ab.x < bb.x + bb.width &&
           ab.y + ab.height > bb.y &&
           ab.y < bb.y + bb.height;
  }

  resetSceneForNextLevel() {
    for (const e of this.enemies) {
      this.container.removeChild(e.sprite);
    }
    this.enemies = [];

    this.spawnEnemies(10);

    this.player.sprite.x = this.app.screen.width / 2;
    this.player.sprite.y = this.app.screen.height / 2;
  }

  addDecorations() {
    for (let i = 0; i < 3; i++) {
      const weed = new PIXI.Sprite(PIXI.Texture.from(ASSETS.seaweed));
      weed.anchor.set(0.5, 1);
      weed.x = 50;
      weed.y = this.app.screen.height - 50 - i * 60;
      this.container.addChild(weed);
    }

    for (let i = 0; i < 3; i++) {
      const coral = new PIXI.Sprite(PIXI.Texture.from(ASSETS.coral));
      coral.anchor.set(0.5, 1);
      coral.x = this.app.screen.width - 50;
      coral.y = this.app.screen.height - 60 - i * 60;
      this.container.addChild(coral);
    }
  }
}
