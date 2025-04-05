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
    const textureKey = getRandomFromArray(SMALL_FISH_KEYS);
    this.sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS[textureKey]));
    this.sprite.anchor.set(0.5);

    const { x, y } = getRandomPosition({ width: window.innerWidth, height: window.innerHeight });
    this.sprite.x = x;
    this.sprite.y = y;

    // Kích thước cá: ngẫu nhiên trong khoảng (0.5 đến 1.8)
    this.size = getRandomFloat(0.5, 1.8);
    this.sprite.scale.set(this.size, this.size);

    // Xác định nếu là cá lớn hơn người chơi (scale > 1.2)
    this.isBig = this.size > 1.2;

    // Di chuyển theo chiều ngang hoặc dọc
    this.moveType = getRandomFromArray(['horizontal', 'vertical']);
    this.direction = Math.random() < 0.5 ? -1 : 1;
    this.speed = getRandomFloat(0.5, 1.5);
  }

  update(delta) {
    if (this.moveType === 'horizontal') {
      this.sprite.x += this.speed * this.direction * delta;

      if (this.sprite.x < 20 || this.sprite.x > window.innerWidth - 20) {
        this.direction *= -1;
        this.sprite.scale.x *= -1; // lật cá
      }
    } else {
      this.sprite.y += this.speed * this.direction * delta;

      if (this.sprite.y < 50 || this.sprite.y > window.innerHeight - 50) {
        this.direction *= -1;
        this.sprite.scale.y *= -1; // lật cá theo chiều dọc nếu muốn
      }
    }
  }
}