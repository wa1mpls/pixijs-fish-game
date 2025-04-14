import { ASSETS } from '../constants.js';
import { getRandomFromArray, getRandomFloat, getRandomPosition } from '../utils/Helpers.js';
import { Movable } from './Movable.js';


const BIG_FISH_KEYS = ['big_blue_fish', 'big_red_fish', 'big_organe_fish'];

export class BigFish {
  constructor() {
    const textureKey = getRandomFromArray(BIG_FISH_KEYS);
    this.sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS[textureKey]));
    this.sprite.anchor.set(0.5);
    this.movement = new Movable(this.sprite, { speedMin: 1, speedMax: 2 });


    const { x, y } = getRandomPosition({ width: window.innerWidth, height: window.innerHeight });
    this.sprite.x = x;
    this.sprite.y = y;

    const level = Math.random() < 0.5 ? 3 : 4; // level 3 hoặc 4
    const baseScale = 0.4;
    this.level = level;
    this.size = baseScale * Math.pow(1.2, level * 1.2 - 1); // 1.5 (lv3), 4.0 (lv4)

    this.directionX = Math.random() < 0.5 ? -1 : 1;
    this.directionY = Math.random() < 0.5 ? -1 : 1;

    this.sprite.scale.set(this.size * this.directionX, this.size);

    this.isBig = true;
    this.moveType = getRandomFromArray(['horizontal', 'vertical', 'diagonal']);
    this.speed = getRandomFloat(1, 2);

    this.changeDirectionTimer = 0;
    this.changeDirectionInterval = getRandomFloat(10000, 15000);

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
