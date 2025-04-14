import { ASSETS } from '../constants.js';

export class PlayerFish {
  constructor() {
    // 👉 Lấy 5 frame từ sprite sheet (texture.json)
    const frames = [];
    for (let i = 0; i <= 4; i++) {
      const texture = PIXI.Texture.from(`user_fish ${i}.png`);
      if (texture) {
        frames.push(texture);
      }
    }

    // 👉 Tạo AnimatedSprite
    this.sprite = new PIXI.AnimatedSprite(frames);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 0.05;
    this.sprite.play();

    this.speed = 14;
    this.target = { x: this.sprite.x, y: this.sprite.y };
    this.hitCount = 0;
    this.level = 2;
    this.lastHit = 0;
    this.sprite.scale.set(0.4, 0.4);
    this.fishEatenForGrowth = 0;
  }

  setTarget(x, y) {
    // Giới hạn trong màn hình
    const margin = 20;
    x = Math.max(margin, Math.min(window.innerWidth - margin, x));
    y = Math.max(margin, Math.min(window.innerHeight - margin, y));
    
    this.target = { x, y };

    // 👉 Lật sprite khi di chuyển sang trái/phải
    if (x < this.sprite.x) {
      this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
    } else if (x > this.sprite.x) {
      this.sprite.scale.x = Math.abs(this.sprite.scale.x);
    }
  }

  update(delta) {
    if (!delta) return;
    
    const dx = this.target.x - this.sprite.x;
    const dy = this.target.y - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 1) return;
    
    const angle = Math.atan2(dy, dx);
    // Nhân speed với delta để đảm bảo chuyển động đồng nhất theo fps
    const moveDistance = Math.min(this.speed * delta, dist);
    const moveX = Math.cos(angle) * moveDistance;
    const moveY = Math.sin(angle) * moveDistance;
    
    this.sprite.x += moveX;
    this.sprite.y += moveY;
    
    const margin = 20;
    this.sprite.x = Math.max(margin, Math.min(window.innerWidth - margin, this.sprite.x));
    this.sprite.y = Math.max(margin, Math.min(window.innerHeight - margin, this.sprite.y));
  }
  
  

  grow() {
    if (this.level >= 4) return;
  
    const direction = Math.sign(this.sprite.scale.x);
    const currentScale = Math.abs(this.sprite.scale.y);
    let factor = 1;
  
    if (this.level === 2) factor = 1.8;
    else if (this.level === 3) factor = 1.4;
  
    this.sprite.scale.set(currentScale * factor, currentScale * factor);
    this.sprite.scale.x *= direction; // giữ hướng không bị đảo
  
    this.level++;
  }
  

  isDead() {
    return this.hitCount >= 3;
  }
}
