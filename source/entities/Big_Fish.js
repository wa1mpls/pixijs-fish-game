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

    const level = Math.random() < 0.5 ? 3 : 4; // level 3 hoặc 4
    const baseScale = 0.5;
    this.level = level;
    this.size = baseScale * Math.pow(1.5, level - 1); // 1.5 (lv3), 4.0 (lv4)

    this.directionX = Math.random() < 0.5 ? -1 : 1;
    this.directionY = Math.random() < 0.5 ? -1 : 1;

    this.sprite.scale.set(this.size * this.directionX, this.size);

    this.isBig = true;
    this.moveType = getRandomFromArray(['horizontal', 'vertical', 'diagonal']);
    this.speed = getRandomFloat(4, 8);

    this.changeDirectionTimer = 0;
    this.changeDirectionInterval = getRandomFloat(10000, 15000);

    this.isTurningBack = false;
    this.turnBackTimer = 0;
    this.turnBackDuration = 0;
    this.prevDirectionX = this.directionX;
    this.prevDirectionY = this.directionY;
  }

  update(delta) {
    const cappedDelta = Math.min(delta, 2);

    if (!this.isTurningBack && Math.random() < 0.3) {
      this.prevDirectionX = this.directionX;
      this.prevDirectionY = this.directionY;

      this.directionX *= -1;
      this.directionY *= -1;
      this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;

      this.isTurningBack = true;
      this.turnBackTimer = 0;
      this.turnBackDuration = getRandomFloat(1000, 2000);
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

    this.changeDirectionTimer += cappedDelta * 16.67;
    if (this.changeDirectionTimer > this.changeDirectionInterval) {
      this.changeDirectionTimer = 0;
      this.changeDirectionInterval = getRandomFloat(10000, 15000);
      const options = ['horizontal', 'vertical', 'diagonal'];
      this.moveType = getRandomFromArray(options);
    }

    if (this.moveType === 'horizontal') {
      this.sprite.x += this.speed * this.directionX * delta;
    } else if (this.moveType === 'vertical') {
      this.sprite.y += this.speed * this.directionY * delta;
    } else {
      this.sprite.x += this.speed * this.directionX * delta * 0.7;
      this.sprite.y += this.speed * this.directionY * delta * 0.7;
    }

    // Giới hạn biên
    if (this.sprite.x <= 20) {
      this.sprite.x = 21;
      this.directionX *= -1;
      this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;
    } else if (this.sprite.x >= window.innerWidth - 20) {
      this.sprite.x = window.innerWidth - 21;
      this.directionX *= -1;
      this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;
    }

    if (this.sprite.y <= 50) {
      this.sprite.y = 51;
      this.directionY *= -1;
    } else if (this.sprite.y >= window.innerHeight - 50) {
      this.sprite.y = window.innerHeight - 51;
      this.directionY *= -1;
    }
  }
}
