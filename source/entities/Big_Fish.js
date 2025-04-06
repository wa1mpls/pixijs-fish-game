import { ASSETS } from '../constants.js';
import { getRandomFromArray, getRandomFloat, getRandomPosition } from '../utils/Helpers.js';

const BIG_FISH_KEYS = ['big_blue_fish', 'big_red_fish', 'big_organe_fish'];

export class BigFish {
  constructor() {
    const textureKey = getRandomFromArray(BIG_FISH_KEYS);
    this.sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS[textureKey]));
    this.sprite.anchor.set(0.5);

    const { x, y } = getRandomPosition({ width: window.innerWidth, height: window.innerHeight });
    this.sprite.x = x;
    this.sprite.y = y;

    const level = Math.random() < 0.5 ? 3 : 4; // 50% level 3 hoặc 4
    const baseScale = 0.5;
    this.level = level;
    this.size = baseScale * Math.pow(1.5, level - 1); // 1.5 (lv3), 4.0 (lv4)

    // ✅ Tách hướng ngang và dọc
    this.directionX = Math.random() < 0.5 ? -1 : 1;
    this.directionY = Math.random() < 0.5 ? -1 : 1;

    this.sprite.scale.set(this.size * this.directionX, this.size);

    this.isBig = true;
    this.moveType = getRandomFromArray(['horizontal', 'vertical']);
    this.speed = getRandomFloat(4, 8); // cá lớn chậm hơn

    this.changeDirectionTimer = 0;
    this.changeDirectionInterval = getRandomFloat(10000, 15000); // thời gian cá sẽ đổi hướng di chuyển
  }

  update(delta) {
    this.changeDirectionTimer += delta * 16.67;
    if (this.changeDirectionTimer > this.changeDirectionInterval) {
      this.changeDirectionTimer = 0;
      this.changeDirectionInterval = getRandomFloat(10000, 15000); // thời gian cá sẽ đổi hướng di chuyển
      this.moveType = this.moveType === 'horizontal' ? 'vertical' : 'horizontal';
    }

    if (this.moveType === 'horizontal') {
      this.sprite.x += this.speed * this.directionX * delta;

      if (this.sprite.x < 20 || this.sprite.x > window.innerWidth - 20) {
        this.directionX *= -1;
        this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;
      }
    } else {
      this.sprite.y += this.speed * this.directionY * delta;

      if (this.sprite.y < 50 || this.sprite.y > window.innerHeight - 50) {
        this.directionY *= -1;
        // Không lật scale
      }
    }
  }
}
