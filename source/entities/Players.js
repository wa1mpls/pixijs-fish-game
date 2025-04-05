//import * as PIXI from 'pixi.js';
import { ASSETS } from '../constants.js';

export class PlayerFish {
  constructor() {
    this.sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.user_fish));
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(1); // scale ban đầu
    this.speed = 3;
    this.target = { x: this.sprite.x, y: this.sprite.y };
    this.hitCount = 0;
  }

  setTarget(x, y) {
    this.target = { x, y };

    // Lật hướng nếu đi ngược
    if (x < this.sprite.x) {
      this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
    } else {
      this.sprite.scale.x = Math.abs(this.sprite.scale.x);
    }
  }

  update(delta) {
    const dx = this.target.x - this.sprite.x;
    const dy = this.target.y - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 1) {
      const angle = Math.atan2(dy, dx);
      this.sprite.x += Math.cos(angle) * this.speed * delta;
      this.sprite.y += Math.sin(angle) * this.speed * delta;
    }
  }

  grow() {
    const currentScale = this.sprite.scale.y;
    this.sprite.scale.set(currentScale * 1.2 * Math.sign(this.sprite.scale.x), currentScale * 1.2);
  }

  shrink() {
    const currentScale = this.sprite.scale.y;
    this.sprite.scale.set(currentScale * 0.5 * Math.sign(this.sprite.scale.x), currentScale * 0.5);
    this.hitCount++;
  }

  isDead() {
    return this.hitCount >= 3;
  }
}
