// Enemy/Item spawn Placeholder
//import * as PIXI from 'pixi.js';
import { ASSETS } from '../constants.js';
import { getRandomPosition } from './Helpers.js';
import { Movable } from '../entities/Movable.js'; 


export class SpawnSystem {
  constructor(container) {
    this.container = container;
    this.objects = []; // các đối tượng hiện có
    this.timers = {
      snake: 0,
      pearl: 0,
  //    crab: 0
    };
    this.spawnCrab(); //  gọi sớm để cua xuất hiện từ đầu
    this.crab = null;  // crab duy nhất

  }

  update(delta, currentTime) {
    // Snake mỗi 10s
    if (currentTime - this.timers.snake > 20_000) {
      this.spawnSnake();
      this.timers.snake = currentTime;
    }

    // Pearl hiện 10s mỗi 15s
    if (currentTime - this.timers.pearl > 15_000) {
      this.spawnPearl();
      this.timers.pearl = currentTime;
    }

  }
    spawnSnake() {
      const sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.snake));
      sprite.anchor.set(0.5);
    
      // Spawn từ rìa
      let x, y;
      const side = Math.floor(Math.random() * 3);
      if (side === 0) {
        x = -50;
        y = Math.random() * window.innerHeight;
      } else if (side === 1) {
        x = window.innerWidth + 50;
        y = Math.random() * window.innerHeight;
      } else {
        x = Math.random() * window.innerWidth;
        y = -50;
      }
    
      sprite.x = x;
      sprite.y = y;
    
      const snake = {
        type: 'snake',
        sprite,
        movement: new Movable(sprite, { speedMin: 1.5, speedMax: 3 }),
        update(delta) {
          this.movement.update(delta);
        }
      };
    
      sprite.scale.set(1 * snake.movement.directionX, 1);
    
      this.objects.push(snake);
      this.container.addChild(sprite);
    
      // Tự biến mất sau 15 giây
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
    if (this.crab) return; // Nếu đã có cua thì không tạo thêm
  
    const sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.crab));
    sprite.anchor.set(0.5);
    sprite.x = Math.random() * window.innerWidth;
    sprite.y = window.innerHeight - 30;
  
    let direction = Math.random() < 0.5 ? -1 : 1;
    const speed = 3;
  
    sprite.scale.set(1 * direction, 1);
  
    this.crab = {
      type: 'crab',
      sprite,
      update(delta) {
        sprite.x += speed * direction * delta;
        if (sprite.x < 20 || sprite.x > window.innerWidth - 20) {
          direction *= -1;
          sprite.scale.x = Math.abs(sprite.scale.x) * direction;
        }
      }
    };
  
    this.objects.push(this.crab);
    this.container.addChild(sprite);
  }
  getObjects() {
    return this.objects.filter(obj => obj.sprite.visible);
  }
  
  
}
