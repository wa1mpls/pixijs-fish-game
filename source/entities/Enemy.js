//import * as PIXI from 'pixi.js';
import { ASSETS } from '../constants.js';
import { getRandomFloat, getRandomPosition, getRandomFromArray } from '../utils/Helpers.js';
import { Movable } from './Movable.js';


const SMALL_FISH_KEYS = [
  'blue_small_fish',
  'green_yellow_small_fish',
  'orange_small_fish',
  'pink_small_fish',
  'purple_small_fish'
];

export class SmallFish {
  constructor() {
    // Chọn ngẫu nhiên 1 texture cá bé
    const textureKey = getRandomFromArray(SMALL_FISH_KEYS);
    this.sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS[textureKey]));
    this.movement = new Movable(this.sprite, { speedMin: 2, speedMax: 4 });
    this.sprite.anchor.set(0.5);


    // Vị trí ban đầu random
    const { x, y } = getRandomPosition({ width: window.innerWidth, height: window.innerHeight });
    this.sprite.x = x;
    this.sprite.y = y;

    // Cấp độ cá và scale
    const level = Math.random() < 0.5 ? 1 : 2;
    const baseScale = 0.25;
    this.level = level;
    this.size = baseScale * Math.pow(2, level - 1);

    // ↔ Hướng di chuyển
    this.directionX = Math.random() < 0.5 ? -1 : 1;
    this.directionY = Math.random() < 0.5 ? -1 : 1;
    this.sprite.scale.set(this.size * this.directionX, this.size);

    this.isBig = false;

    //  Kiểu di chuyển ban đầu: ngang, dọc hoặc chéo
    this.moveType = getRandomFromArray(['horizontal', 'vertical', 'diagonal']);
    this.speed = getRandomFloat(2, 4);

    //  Đổi hướng kiểu di chuyển sau 10–15s
    this.changeDirectionTimer = 0;
    this.changeDirectionInterval = getRandomFloat(10000, 15000);

    //  Quay đầu tạm thời rồi có thể quay lại
    this.isTurningBack = false;
    this.turnBackTimer = 0;
    this.turnBackDuration = 0;
    this.prevDirectionX = this.directionX;
    this.prevDirectionY = this.directionY;
  }

  update(delta) {
    this.movement.update(delta);
  }
}
