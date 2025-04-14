// Collision detection Placeholder
import { GameOverScene } from '../scene/GameOverScene.js';
import { BubbleEffect } from '../effects/BubbleEffect.js';

export class CollisionSystem {
  constructor(game, player, stats, effects, sounds, showLevelUpText) {
    this.game = game;
    this.player = player;
    this.stats = stats;
    this.effects = effects;
    this.sounds = sounds;
    this.showLevelUpText = showLevelUpText;

    this.cuaHitCount = new Map(); // theo dõi số lần chạm cua
  }

  update(activeObjects) {
    if (this.game.isGameOver || !this.game.isInGame) return;
    
    // Check if player is dead first
    if (this.player.isDead() && !this.game.isGameOver) {
      console.log("Player is dead in CollisionSystem - calling gameOver");
      this.game.gameOver();
      return;
    }
    
    // Ne plus faire d'update après game over
    if (this.game.isGameOver) return;
    
    // Continue with collision detection if game is still running
    for (const obj of activeObjects) {
      if (!obj || !obj.sprite || !obj.sprite.visible) continue;
      
      // Kiểm tra collision
      if (this.hitTest(this.player.sprite, obj.sprite)) {
        if (obj.type === 'small_fish' || obj.type === 'big_fish') {
          this.handleFish(obj);
        } else if (obj.type === 'snake') {
          this.handleSnake();
        } else if (obj.type === 'crab') {
          this.handleCrab(obj);
        } else if (obj.type === 'pearl') {
          this.handlePearl(obj);
        }
      }
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

  handleFish(enemy) {
    if (!enemy || !enemy.sprite || !enemy.sprite.visible || enemy.hasBeenEaten || this.game.isGameOver || !this.game.isInGame) return;
  
    const playerLevel = this.player.level;
    const enemyLevel = enemy.level;
  
    const now = Date.now();
    const immuneTime = 1000; // Miễn nhiễm sau khi va chạm cá lớn
  
    if (enemyLevel < playerLevel) {
      //  Player ăn cá
      enemy.hasBeenEaten = true;
  
      this.game.effects.push(new BubbleEffect(enemy.sprite.x, enemy.sprite.y, this.game.container));
  
      if (enemy.isBig) this.sounds.eatBig?.();
      else this.sounds.eatSmall?.(); // Phát âm thanh khi ăn cá nhỏ
      
      const scoreGain = enemy.isBig ? 20 : 10;
      this.stats.addScore(scoreGain);
      this.stats.registerFishEaten();
      
      // Kiểm tra điều kiện lên level game
      if (this.stats.fishEaten >= this.game.levelSystem.requiredFish) {
        this.game.levelSystem.nextLevel();
      }
      
      this.player.fishEatenForGrowth++;
      if (this.player.fishEatenForGrowth >= 10 && this.player.level < 4) {
        this.player.grow();
        this.player.fishEatenForGrowth = 0;
  
        // Hiển thị lên màn hình
        if (this.showLevelUpText && typeof this.showLevelUpText === 'function') {
          this.showLevelUpText(this.player.level);
        }        
      }
  
      enemy.sprite.visible = false;
      this.game.container.removeChild(enemy.sprite);
      this.game.enemies = this.game.enemies.filter(e => e !== enemy);
    }
  
    else if (enemyLevel > playerLevel) {
      //  Gây sát thương
      if (now - this.player.lastHit >= immuneTime) {
        this.player.hitCount++;
        this.player.lastHit = now;
  
        this.player.sprite.tint = 0xff4444;
        setTimeout(() => {
          if (!this.game.isGameOver) {
            this.player.sprite.tint = 0xFFFFFF;
          }
        }, 200);
  
        if (this.player.isDead()) {
          // Chỉ gọi gameOver() mà không set flag
          console.log("Player is dead from handleFish - calling gameOver");
          this.game.gameOver();
          return;
        }
      }
    }
  }

  handleSnake() {
    if (this.game.isGameOver || !this.game.isInGame) return;
  
    // Chỉ gọi gameOver() mà không set flag
    console.log("Snake collision - calling gameOver");
    this.game.gameOver();
  }

  handleCrab(crab) {
    if (this.game.isGameOver || !this.game.isInGame) return;

    const now = Date.now();
    const immuneTime = 1000;

    if (now - this.player.lastHit >= immuneTime) {
      this.player.hitCount++;
      this.player.lastHit = now;

      this.player.sprite.tint = 0xff4444;
      setTimeout(() => {
        if (!this.game.isGameOver) {
          this.player.sprite.tint = 0xFFFFFF;
        }
      }, 200);

      if (this.player.isDead()) {
        // Chỉ gọi gameOver() mà không set flag
        console.log("Player is dead from handleCrab - calling gameOver");
        this.game.gameOver();
        return;
      }
    }
  }

  handlePearl(pearl) {
    if (this.game.isGameOver || !this.game.isInGame) return;

    pearl.sprite.visible = false;
    this.player.grow();
    //sounds.collectPearl(); // 🔊
  }
}
  
