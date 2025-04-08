import { ASSETS } from '../constants.js';

export class PlayerFish {
  constructor() {
    // 👉 Lấy 5 frame từ sprite sheet (texture.json)
    const frames = [];
    for (let i = 0; i < 5; i++) {
      frames.push(PIXI.Texture.from(`user_fish ${i}.png`));
    }

    // 👉 Tạo AnimatedSprite
    this.sprite = new PIXI.AnimatedSprite(frames);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 0.05;
    this.sprite.play(); // Bắt đầu animation

    this.speed = 14;
    this.target = { x: this.sprite.x, y: this.sprite.y };
    this.hitCount = 0;
    this.level = 2;
    this.lastHit = 0;
    this.sprite.scale.set(0.4, 0.4); 
  }

  setTarget(x, y) {
    this.target = { x, y };

    // 👉 Lật sprite khi di chuyển
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

    if (dist < this.speed * delta) {
      this.sprite.x = this.target.x;
      this.sprite.y = this.target.y;
      return;
    }

    const angle = Math.atan2(dy, dx);
    this.sprite.x += Math.cos(angle) * this.speed * delta;
    this.sprite.y += Math.sin(angle) * this.speed * delta;
  }

  grow() {
    const currentScale = this.sprite.scale.y;
    if (this.level < 4) {
      if (this.level === 3){
        this.sprite.scale.set(currentScale * 1.5 * Math.sign(this.sprite.scale.x), currentScale * 1.5);
      }
      else {
        this.sprite.scale.set(currentScale * 2.2 * Math.sign(this.sprite.scale.x), currentScale * 2.2);
      }
      this.level ++;
    }
  }

  isDead() {
    return this.hitCount >= 3;
  }
}
