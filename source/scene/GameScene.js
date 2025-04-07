//import { app } from '../app.js';
import { ASSETS } from '../constants.js';
import { PlayerFish } from '../entities/Players.js';
import { SmallFish } from '../entities/Enemy.js';
import { BigFish } from '../entities/Big_Fish.js';
import { GameStats } from '../utils/GameStats.js';
//import { getRandomPosition } from '../utils/Helpers.js';
import { LevelSystem } from '../systems/LevelSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { SpawnSystem } from '../utils/SpawnSystem.js';
import { getRandomInt } from '../utils/Helpers.js';
import { BubbleEffect } from '../effects/BubbleEffect.js';
//import { createBubbleEmitter } from '../effects/BubbleEmitter.js';

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
    this.effects = []; 
  }

  start() {
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
    const initialCount = getRandomInt(15, 30); // 👈 tạo số random cá khởi đầu
    this.spawnEnemies(initialCount);

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
        
        // Thêm hiệu ứng bong bóng
        this.effects.push(new BubbleEffect(enemy.sprite.x, enemy.sprite.y, this.container));

        //  Thêm emitter mới:
       /* const emitter = createBubbleEmitter(enemy.sprite.x, enemy.sprite.y, this.container);
        if (emitter) {
          this.effects.push(emitter);
        }
        */
      }
    }

    // Giữ số lượng cá liên tục
    if (this.enemies.length < 15) {
      this.spawnEnemies(getRandomInt(1, 3));
    }
    
    this.levelSystem.update();

    const now = Date.now();
    this.spawnSystem.update(delta, now - this.startTime);

    const activeObjects = [
      ...this.enemies, 
      ...this.spawnSystem.getObjects()
    ];
    

    for (const obj of activeObjects) {
      if (typeof obj.update === 'function') {
        obj.update(delta); // Cho phép rắn di chuyển
      }
    }

    this.collisionSystem.update(activeObjects);

    // Thủ công bong bóng
    this.effects.forEach(e => e.update(delta));
    this.effects = this.effects.filter(e => !e.isDone);

    // Emitter bong bóng
    this.effects.forEach(emitter => {
      try {
        emitter.update(delta * (1 / 60)); // chuẩn hóa FPS
      } catch (e) {
        console.warn("Emitter error:", e);
      }
    });
    

    // Giữ lại emitter chưa kết thúc
    //this.effects = this.effects.filter(e => !e._destroyed);
              
    


    if (this.player.isDead()) {
      import('../scene/GameOverScene.js').then(module => {
        const over = new module.GameOverScene(this.stats.score);
        over.show();
      });
    }
  }

  
    spawnEnemies(count) {
      for (let i = 0; i < count; i++) {
        const isBig = Math.random() < 0.3; // 30% là cá bự
        const enemy = isBig ? new BigFish() : new SmallFish();
        enemy.type = isBig ? 'big_fish' : 'small_fish';
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
  
    const randomCount = getRandomInt(15, 30); // 👈 random lại
    this.spawnEnemies(randomCount);
  
    this.player.sprite.x = this.app.screen.width / 2;
    this.player.sprite.y = this.app.screen.height / 2;
  }
  

}
