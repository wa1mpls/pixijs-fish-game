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
    // Snake mỗi 10s
    if (currentTime - this.timers.snake > 10_000) {
      this.spawnSnake();
      this.timers.snake = currentTime;
    }

    // Pearl hiện 10s mỗi 15s
    if (currentTime - this.timers.pearl > 15_000) {
      this.spawnPearl();
      this.timers.pearl = currentTime;
    }

    // Crab mỗi 60s
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

    const baseScale = 1.5;
    const speed = Math.random() * 2 + 4 ;

    const snake = {
      type: 'snake',
      sprite,
      directionX: Math.random() < 0.5 ? -1 : 1,
      directionY: Math.random() < 0.5 ? -1 : 1,
      speed,

      isTurningBack: false,
      turnBackTimer: 0,
      turnBackDuration: 0,
      prevDirectionX: 1,
      prevDirectionY: 1,

      changeDirectionTimer: 0,
      changeDirectionInterval: Math.random() * 5000 + 5000,

      update(delta) {
        const cappedDelta = Math.min(delta, 2);

        // Random quay đầu
        if (!this.isTurningBack && Math.random() < 0.01) {
          this.prevDirectionX = this.directionX;
          this.prevDirectionY = this.directionY;

          this.directionX *= -1;
          this.directionY *= -1;
          this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;

          this.isTurningBack = true;
          this.turnBackTimer = 0;
          this.turnBackDuration = Math.random() * 1000 + 1000;
        }

        if (this.isTurningBack) {
          this.turnBackTimer += cappedDelta * 16.67;
          if (this.turnBackTimer >= this.turnBackDuration) {
            if (Math.random() < 0.5) {
              this.directionX = this.prevDirectionX;
              this.directionY = this.prevDirectionY;
              this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;
            }
            this.isTurningBack = false;
          }
        }

        // Đổi hướng chéo/ngang/dọc
        this.changeDirectionTimer += cappedDelta * 16.67;
        if (this.changeDirectionTimer > this.changeDirectionInterval) {
          this.changeDirectionTimer = 0;
          this.changeDirectionInterval = Math.random() * 5000 + 5000;

          const typeRoll = Math.random();
          if (typeRoll < 0.33) {
            this.directionX = Math.random() < 0.5 ? -1 : 1;
            this.directionY = 0;
          } else if (typeRoll < 0.66) {
            this.directionY = Math.random() < 0.5 ? -1 : 1;
            this.directionX = 0;
          } else {
            this.directionX = Math.random() < 0.5 ? -1 : 1;
            this.directionY = Math.random() < 0.5 ? -1 : 1;
          }

          if (this.directionX !== 0) {
            this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;
          }
        }

        // Di chuyển chéo
        this.sprite.x += this.speed * this.directionX * delta;
        this.sprite.y += this.speed * this.directionY * delta;

        if (this.sprite.x < 20 || this.sprite.x > window.innerWidth - 20) {
          this.directionX *= -1;
          this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;
        }

        if (this.sprite.y < 50 || this.sprite.y > window.innerHeight - 50) {
          this.directionY *= -1;
        }
      }
    };

    sprite.scale.set(baseScale * snake.directionX, baseScale);

    this.objects.push(snake);
    this.container.addChild(sprite);

    setTimeout(() => {
      snake.sprite.visible = false;
    }, 15000);
  }

  spawnPearl() {
    const sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.pearl));
    sprite.anchor.set(0.5);
    const pos = getRandomPosition({ width: window.innerWidth, height: window.innerHeight });
    sprite.x = pos.x;
    sprite.y = window.innerHeight - 60;

    const obj = { type: 'pearl', sprite };
    this.objects.push(obj);
    this.container.addChild(sprite);

    setTimeout(() => {
      sprite.visible = false;
    }, 10_000);
  }

  spawnCrab() {
    const sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.crab));
    sprite.anchor.set(0.5);
    sprite.x = Math.random() * window.innerWidth;
    sprite.y = window.innerHeight - 30;

    const direction = Math.random() < 0.5 ? -1 : 1;
    const speed = 9;

    sprite.scale.set(1 * direction, 1);

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
