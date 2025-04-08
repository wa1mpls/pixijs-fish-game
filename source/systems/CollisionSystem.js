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
            case 'same_size_fish':
              this.handleEdibleFish(obj);
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
    this.player.shrink();
    this.player.hitCount++;
    if (this.player.isDead()) {
      const over = new GameOverScene(this.stats.score);
      over.show();
    }
  }

  handleSnake() {
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

  handleEdibleFish(fish) {
    if (!fish.sprite.visible) return; 
  
    fish.sprite.visible = false;
    this.stats.fishEaten++;
  
    if (fish.type === 'same_size_fish') {
      this.stats.sameSizeCount++;
    } else if (fish.type === 'small_fish') {
      this.stats.smallerCount++;
    }
  
    if (this.stats.sameSizeCount >= 5 || this.stats.smallerCount >= 10) {
      this.player.grow();
      this.stats.sameSizeCount = 0;
      this.stats.smallerCount = 0;
    }
  
  }
  
  
}
