// Enemy/Item spawn Placeholder
//import * as PIXI from 'pixi.js';
import { ASSETS } from '../constants.js';
import { getRandomPosition } from './Helpers.js';

export class SpawnSystem {
  constructor(container) {
    this.container = container;
    this.objects = []; // các đối tượng hiện có
    this.timers = {
      snake: 0,
      pearl: 0,
      crab: 0
    };
    this.spawnCrab(); // ✅ gọi sớm để cua xuất hiện từ đầu
  }

  update(delta, currentTime) {
    // Snake mỗi 60s
    if (currentTime - this.timers.snake > 10_000) {
      this.spawnSnake();
      this.timers.snake = currentTime;
    }

    // Pearl hiện 2s mỗi 60s
    if (currentTime - this.timers.pearl > 60_000) {
      this.spawnPearl();
      this.timers.pearl = currentTime;
    }

    // Crab sinh sau mỗi 60s, trốn sau 10s
    if (currentTime - this.timers.crab > 60_000) {
      this.spawnCrab();
      this.timers.crab = currentTime;
    }
  }

  spawnSnake() {
    const sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.snake));
    sprite.anchor.set(0.5);
  
    const { x, y } = getRandomPosition({ width: window.innerWidth, height: window.innerHeight });
    sprite.x = x;
    sprite.y = y;
  
    let directionX = Math.random() < 0.5 ? -1 : 1;
    let directionY = Math.random() < 0.5 ? -1 : 1;
    const speed = Math.random() * 4 + 6;
    let moveType = Math.random() < 0.5 ? 'horizontal' : 'vertical';
  
    const baseScale = 1.5;
    sprite.scale.set(baseScale * directionX, baseScale);
  
    let changeDirectionTimer = 0;
    let changeDirectionInterval = Math.random() * 5000 + 5000;
  
    const snake = {
      type: 'snake',
      sprite,
      update(delta) {
        changeDirectionTimer += delta * 16.67;
        if (changeDirectionTimer > changeDirectionInterval) {
          changeDirectionTimer = 0;
          changeDirectionInterval = Math.random() * 5000 + 5000;
          moveType = moveType === 'horizontal' ? 'vertical' : 'horizontal';
        }
  
        if (moveType === 'horizontal') {
          sprite.x += speed * directionX * delta;
          if (sprite.x < 20 || sprite.x > window.innerWidth - 20) {
            directionX *= -1;
            sprite.scale.x = Math.abs(sprite.scale.x) * directionX;
          }
        } else {
          sprite.y += speed * directionY * delta;
          if (sprite.y < 50 || sprite.y > window.innerHeight - 50) {
            directionY *= -1;
          }
        }
      }
    };
  
    this.objects.push(snake);
    this.container.addChild(sprite);
  
    // Biến mất sau 20s (nếu bạn cần)
    setTimeout(() => {
      snake.sprite.visible = false;
    }, 30000);
  }
  
  
  
  

  spawnPearl() {
    const sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.pearl));
    sprite.anchor.set(0.5);
    const pos = getRandomPosition({ width: window.innerWidth, height: window.innerHeight });
    sprite.x = pos.x;
    sprite.y = window.innerHeight - 60; // gần đáy

    const obj = { type: 'pearl', sprite };
    this.objects.push(obj);
    this.container.addChild(sprite);

    // Ẩn sau 2s
    setTimeout(() => {
      sprite.visible = false;
    }, 2000);
  }

  spawnCrab() {
    const sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.crab));
    sprite.anchor.set(0.5);
    sprite.x = Math.random() * window.innerWidth;
    sprite.y = window.innerHeight - 30; // nằm sát đáy biển
  
    const direction = Math.random() < 0.5 ? -1 : 1;
    const speed = 9; // gấp 3 lần cá player (player speed = 3)
  
    sprite.scale.set(1 * direction, 1); // mirror theo chiều ngang
  
    const crab = {
      type: 'crab',
      sprite,
      direction,
      speed,
      update(delta) {
        this.sprite.x += this.speed * this.direction * delta;
  
        if (this.sprite.x < 20 || this.sprite.x > window.innerWidth - 20) {
          this.direction *= -1;
          this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.direction;
        }
      }
    };
  
    this.objects.push(crab);
    this.container.addChild(sprite);

  }
  
  

  getObjects() {
    return this.objects.filter(obj => obj.sprite.visible);
  }
}
