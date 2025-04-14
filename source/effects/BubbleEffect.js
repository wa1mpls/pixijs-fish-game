// Thủ công không dùng thư viện pixi particle
import { ASSETS } from '../constants.js';

export class BubbleEffect {
  constructor(x, y, container) {
    this.sprite = new PIXI.Sprite(PIXI.Texture.from(ASSETS.bubble));
    this.sprite.anchor.set(0.5);
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.alpha = 1;
    this.speedY = 1.5;
    this.fadeSpeed = 0.02;

    container.addChild(this.sprite);
    this.container = container;
    this.isDone = false;
  }

  update(delta) {
    this.sprite.y -= this.speedY * delta;
    this.sprite.alpha -= this.fadeSpeed * delta;

    if (this.sprite.alpha <= 0) {
      this.container.removeChild(this.sprite);
      this.isDone = true;
    }
  }
}
