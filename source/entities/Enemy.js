//import * as PIXI from 'pixi.js';
import { ASSETS } from '../constants.js';
import { getRandomFloat, getRandomPosition, getRandomFromArray } from '../utils/Helpers.js';

const SMALL_FISH_KEYS = [
  'blue_small_fish',
  'green_yellow_small_fish',
  'orange_small_fish',
  'pink_small_fish',
  'purple_small_fish'
];

export class SmallFish {
  constructor() {
    // 🎨 Chọn ngẫu nhiên 1 texture cá bé
    const textureKey = getRandomFromArray(SMALL_FISH_KEYS);
    this.sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS[textureKey]));
    this.sprite.anchor.set(0.5);

    // 📍 Vị trí ban đầu random
    const { x, y } = getRandomPosition({ width: window.innerWidth, height: window.innerHeight });
    this.sprite.x = x;
    this.sprite.y = y;

    // ⚖️ Cấp độ cá và scale
    const level = Math.random() < 0.5 ? 1 : 2;
    const baseScale = 0.5;
    this.level = level;
    this.size = baseScale * Math.pow(2, level - 1);

    // ↔️↕️ Hướng di chuyển
    this.directionX = Math.random() < 0.5 ? -1 : 1;
    this.directionY = Math.random() < 0.5 ? -1 : 1;
    this.sprite.scale.set(this.size * this.directionX, this.size);

    this.isBig = false;

    // 🚶‍♂️ Kiểu di chuyển ban đầu: ngang, dọc hoặc chéo
    this.moveType = getRandomFromArray(['horizontal', 'vertical', 'diagonal']);
    this.speed = getRandomFloat(6, 10);

    // ⏱️ Đổi hướng kiểu di chuyển sau 10–15s
    this.changeDirectionTimer = 0;
    this.changeDirectionInterval = getRandomFloat(10000, 15000);

    // 🔁 Quay đầu tạm thời rồi có thể quay lại
    this.isTurningBack = false;
    this.turnBackTimer = 0;
    this.turnBackDuration = 0;
    this.prevDirectionX = this.directionX;
    this.prevDirectionY = this.directionY;
  }

  update(delta) {
    const cappedDelta = Math.min(delta, 2);

    // 🔄 Xác suất quay đầu ngẫu nhiên
    if (!this.isTurningBack && Math.random() < 0.1) {
      this.prevDirectionX = this.directionX;
      this.prevDirectionY = this.directionY;

      if (this.moveType === 'horizontal' || this.moveType === 'diagonal') {
        this.directionX *= -1;
        this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;
      }
      if (this.moveType === 'vertical' || this.moveType === 'diagonal') {
        this.directionY *= -1;
      }

      this.isTurningBack = true;
      this.turnBackTimer = 0;
      this.turnBackDuration = getRandomFloat(1000, 2000);
    }

    // ⏳ Sau khi quay đầu xong có thể quay lại hướng cũ
    if (this.isTurningBack) {
      this.turnBackTimer += cappedDelta * 16.67;
      if (this.turnBackTimer >= this.turnBackDuration) {
        if (Math.random() < 0.5) {
          if (this.moveType === 'horizontal' || this.moveType === 'diagonal') {
            this.directionX = this.prevDirectionX;
            this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;
          }
          if (this.moveType === 'vertical' || this.moveType === 'diagonal') {
            this.directionY = this.prevDirectionY;
          }
        }
        this.isTurningBack = false;
      }
    }

    // 🔁 Đổi kiểu di chuyển (ngang/dọc/chéo)
    this.changeDirectionTimer += cappedDelta * 16.67;
    if (this.changeDirectionTimer > this.changeDirectionInterval) {
      this.changeDirectionTimer = 0;
      this.changeDirectionInterval = getRandomFloat(10000, 15000);
      this.moveType = getRandomFromArray(['horizontal', 'vertical', 'diagonal']);
    }

    // 🚶‍♂️ Di chuyển + xử lý giới hạn viền màn hình
    if (this.moveType === 'horizontal') {
      this.sprite.x += this.speed * this.directionX * delta;

      if (this.sprite.x <= 20) {
        this.sprite.x = 21;
        this.directionX *= -1;
        this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;
      } else if (this.sprite.x >= window.innerWidth - 20) {
        this.sprite.x = window.innerWidth - 21;
        this.directionX *= -1;
        this.sprite.scale.x = Math.abs(this.sprite.scale.x) * this.directionX;
      }
    }

    else if (this.moveType === 'vertical') {
      this.sprite.y += this.speed * this.directionY * delta;

      if (this.sprite.y <= 50) {
        this.sprite.y = 51;
        this.directionY *= -1;
      } else if (this.sprite.y >= window.innerHeight - 50) {
        this.sprite.y = window.innerHeight - 51;
        this.directionY *= -1;
      }
    }

    else if (this.moveType === 'diagonal') {
      this.sprite.x += this.speed * this.directionX * delta;
      this.sprite.y += this.speed * this.directionY * delta;

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
}
