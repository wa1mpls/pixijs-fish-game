// Collision detection Placeholder
import { GameOverScene } from '../scene/GameOverScene.js';

export class CollisionSystem {
  constructor(game, player, stats) {
    this.game = game;
    this.player = player;
    this.stats = stats;

    this.cuaHitCount = new Map(); // theo dõi số lần chạm cua
  }

  update(objects) {
    for (const obj of objects) {
      const sprite = obj.sprite;

      if (!sprite || !sprite.visible) continue;

      if (this.hitTest(this.player.sprite, sprite)) {
        switch (obj.type) {
          case 'big_fish':
            this.handleBigFish(obj);
            break;

          case 'snake':
            this.handleSnake();
            break;

          case 'crab':
            this.handleCrab(obj);
            break;

          case 'pearl':
            this.handlePearl(obj);
            break;

          case 'small_fish':
              this.handleSmallFish(obj);
              break;
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

  handleBigFish(enemy) {
    const now = Date.now();
    const immuneTime = 1500; // 1.5s miễn nhiễm sau khi bị đụng
  
    // ⚠️ Không xử lý nếu enemy đã biến mất
    if (!enemy.sprite.visible) return;
  
    // 👉 Chỉ gây sát thương nếu cá lớn hơn player ít nhất 1 cấp
    if (enemy.level >= this.player.level + 1) {
      if (now - this.player.lastHit >= immuneTime) {
        this.player.hitCount++;
        this.player.lastHit = now;
  
        // 🌟 Hiệu ứng trúng đạn
        this.player.sprite.tint = 0xff4444;
        setTimeout(() => {
          this.player.sprite.tint = 0xFFFFFF;
        }, 200);
  
        console.warn("⚠️ Va chạm cá lớn! hitCount =", this.player.hitCount);
  
        if (this.player.isDead()) {
          console.log("💀 Cá đã chết! hitCount =", this.player.hitCount);
          this.isGameOver = true;
          const over = new GameOverScene(this.stats.score);
          over.show();
        }
      }
    } else {
      // Nếu không mạnh hơn rõ ràng, xử lý như cá nhỏ (bị ăn)
      this.handleSmallFish(enemy);
    }
  }
  

  handleSnake() {
    this.isGameOver = true;
    const over = new GameOverScene(this.stats.score);
    over.show();
  }

  handleCrab(crab) {
    const id = crab.id || crab.sprite._uid || crab.sprite.texture.textureCacheIds[0];
    
    if (!this.cuaHitCount.has(id)) this.cuaHitCount.set(id, 1);
    else this.cuaHitCount.set(id, this.cuaHitCount.get(id) + 1);

    if (this.cuaHitCount.get(id) >= 2) {
      crab.sprite.visible = false;
    }
  }

  handlePearl(pearl) {
    pearl.sprite.visible = false;
    this.player.grow();
  }

  handleSmallFish(fish) {
    if (!fish || !fish.sprite || !fish.sprite.visible) return;

    if (fish.level >= this.player.level) return;

    fish.sprite.visible = false;

    const score = 10 * Math.pow(2, fish.level - 1);
    this.stats.addScore(score);
    this.stats.smallerCount++;

    if (this.stats.smallerCount >= 10) {
      this.player.grow();
      this.stats.smallerCount = 0;
    }
    this.game.container.removeChild(fish.sprite);
    this.game.enemies = this.game.enemies.filter(e => e !== fish);
  }
  
}
  
