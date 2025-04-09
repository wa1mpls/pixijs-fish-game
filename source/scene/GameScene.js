// Các import giữ nguyên như cũ
import { ASSETS } from '../constants.js';
import { PlayerFish } from '../entities/Players.js';
import { SmallFish } from '../entities/Enemy.js';
import { BigFish } from '../entities/Big_Fish.js';
import { GameStats } from '../utils/GameStats.js';
import { LevelSystem } from '../systems/LevelSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { SpawnSystem } from '../utils/SpawnSystem.js';
import { getRandomInt } from '../utils/Helpers.js';
import { BubbleEffect } from '../effects/BubbleEffect.js';
import { exitButton } from '../utils/ExitButton.js';

export class GameScene {
  constructor(appInstance) {
    this.app = appInstance;
    this.container = new PIXI.Container();
    this.player = null;
    this.enemies = [];
    this.stats = new GameStats(this);
    this.levelSystem = null;
    this.spawnSystem = null;
    this.collisionSystem = null;
    this.startTime = Date.now();
    this.effects = [];
    this.isGameOver = false;
  }

  start() {
    document.getElementById('ui').style.display = 'block';
    this.app.stage.addChild(this.container);

    // Background
    const bg = new PIXI.Sprite(PIXI.Texture.from(ASSETS.background));
    bg.width = this.app.screen.width;
    bg.height = this.app.screen.height;
    this.container.addChild(bg);

    // Player
    this.player = new PlayerFish();
    this.player.sprite.x = this.app.screen.width / 2;
    this.player.sprite.y = this.app.screen.height / 2;
    this.container.addChild(this.player.sprite);

    // Enemies khởi đầu
    const initialCount = getRandomInt(15, 20);
    this.spawnEnemies(initialCount);

    // Hệ thống
    this.levelSystem = new LevelSystem(this, this.player, this.stats);
    this.spawnSystem = new SpawnSystem(this.container);
    this.collisionSystem = new CollisionSystem(this, this.player, this.stats);

    // Điều khiển
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on('pointerdown', (e) => {
      const pos = e.global;
      this.player.setTarget(pos.x, pos.y);
    });

    // Game loop
    this.app.ticker.add((delta) => this.update(delta));

    // Exit button
    const exit = exitButton(this.app, () => {
      this.isGameOver = true;
      this.app.stage.removeChildren();
      import('./MenuScene.js').then(module => {
        const startScene = new module.MenuScene(this.app);
        startScene.show();
      });
    });
    this.container.addChild(exit);

    // Mạng
    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      const heart = new PIXI.Sprite(PIXI.Texture.from(ASSETS.heart));
      heart.x = 20 + i * 40;
      heart.y = 160;
      heart.width = 55;
      heart.height = 55;
      this.container.addChild(heart);
      this.hearts.push(heart);
    }
  }

  update(delta) {
    if (this.isGameOver) return;

    this.player.update(delta);

    const now = Date.now();
    this.spawnSystem.update(delta, now - this.startTime);

    const activeObjects = [
      ...this.enemies,
      ...this.spawnSystem.getObjects()
    ];

    for (const obj of activeObjects) {
      if (typeof obj.update === 'function') {
        obj.update(delta);
      }

      // Va chạm với player
      if (obj.type === 'small_fish' || obj.type === 'big_fish') {
        if (this.hitTest(this.player.sprite, obj.sprite)) {
          if (!obj.isBig && obj.level < this.player.level) {
            this.effects.push(new BubbleEffect(obj.sprite.x, obj.sprite.y, this.container));
          }
        }
      }
    }

    // Giữ số lượng cá ổn định
    if (this.enemies.length < 15) {
      this.spawnEnemies(getRandomInt(5, 10));
    }

    this.levelSystem.update();
    this.collisionSystem.update(activeObjects);
    this.updateHearts();

    // Bong bóng
    this.effects.forEach(e => e.update(delta));
    this.effects = this.effects.filter(e => !e.isDone);

    // Game over check
    if (this.player.isDead()) {
      this.isGameOver = true;
      import('../scene/GameOverScene.js').then(module => {
        const over = new module.GameOverScene(this.stats.score);
        over.show();
      });
    }
  }

  spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
      const isBig = Math.random() < 0.15;
      const enemy = isBig ? new BigFish() : new SmallFish();
      enemy.type = isBig ? 'big_fish' : 'small_fish';

      // Spawn từ rìa
      let x, y;
      const side = Math.floor(Math.random() * 3);
      if (side === 0) {
        x = -50;
        y = Math.random() * this.app.screen.height;
      } else if (side === 1) {
        x = this.app.screen.width + 50;
        y = Math.random() * this.app.screen.height;
      } else {
        x = Math.random() * this.app.screen.width;
        y = -50;
      }

      enemy.sprite.x = x;
      enemy.sprite.y = y;

      if (enemy.setDirection) {
        enemy.setDirection(this.player.sprite.x, this.player.sprite.y);
      }

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

    const randomCount = getRandomInt(15, 20);
    this.spawnEnemies(randomCount);

    this.player.sprite.x = this.app.screen.width / 2;
    this.player.sprite.y = this.app.screen.height / 2;
  }

  updateHearts() {
    if (!this.hearts || this.hearts.length === 0) return;

    for (let i = 0; i < 3; i++) {
      this.hearts[i].visible = i < (3 - this.player.hitCount);
    }
  }
}
