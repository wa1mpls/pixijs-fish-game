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
  }

  update(delta, currentTime) {
    // Snake mỗi 60s
    if (currentTime - this.timers.snake > 60_000) {
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
    sprite.x = Math.random() * window.innerWidth;
    sprite.y = Math.random() * (window.innerHeight - 200); // không xuống cát

    const obj = { type: 'snake', sprite };
    this.objects.push(obj);
    this.container.addChild(sprite);
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
    sprite.y = window.innerHeight - 40;

    const obj = { type: 'crab', sprite };
    this.objects.push(obj);
    this.container.addChild(sprite);

    // Trốn sau 10s (ẩn đi)
    setTimeout(() => {
      sprite.visible = false;
    }, 10_000);
  }

  getObjects() {
    return this.objects.filter(obj => obj.sprite.visible);
  }
}
