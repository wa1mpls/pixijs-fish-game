import { getRandomFromArray, getRandomFloat } from '../utils/Helpers.js';

export class Movable {
  constructor(sprite, options = {}) {
    this.sprite = sprite;
    this.moveType = getRandomFromArray(['horizontal', 'vertical', 'diagonal']);
    this.speed = getRandomFloat(options.speedMin || 12, options.speedMax || 18);

    const margin = 100; // biên ngoài
    const safeX = window.innerWidth / 2;
    const safeY = window.innerHeight / 2;
    
    if (sprite.x < margin) {
      this.directionX = 1; // đang ở trái → bơi vào trong
    } else if (sprite.x > window.innerWidth - margin) {
      this.directionX = -1; // phải → bơi vào trong
    } else {
      this.directionX = Math.random() < 0.5 ? -1 : 1;
    }
    
    if (sprite.y < margin) {
      this.directionY = 1;
    } else if (sprite.y > window.innerHeight - margin) {
      this.directionY = -1;
    } else {
      this.directionY = Math.random() < 0.5 ? -1 : 1;
    }
    
    // Set initial scale based on direction (only once)
    this.updateSpriteScale();

    this.changeDirectionTimer = 0;
    this.changeDirectionInterval = getRandomFloat(3000, 6000);

    this.isTurningBack = false;
    this.turnBackTimer = 0;
    this.turnBackDuration = 0;
    this.prevDirectionX = this.directionX;
    this.prevDirectionY = this.directionY;

    // Cache window dimensions
    this.updateWindowBounds();
    window.addEventListener('resize', () => this.updateWindowBounds());
  }

  updateSpriteScale() {
    // Lưu scale ban đầu
    const originalScale = Math.abs(this.sprite.scale.x);
    // Cập nhật scale dựa trên hướng di chuyển
    this.sprite.scale.x = originalScale * this.directionX;
  }

  updateWindowBounds() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  update(delta) {
    // Quay đầu
    if (!this.isTurningBack && Math.random() < 0.001) {
      this.prevDirectionX = this.directionX;
      this.prevDirectionY = this.directionY;

      if (['horizontal', 'diagonal'].includes(this.moveType)) {
        this.directionX *= -1;
        this.updateSpriteScale();
      }
      if (['vertical', 'diagonal'].includes(this.moveType)) {
        this.directionY *= -1;
      }

      this.isTurningBack = true;
      this.turnBackTimer = 0;
      this.turnBackDuration = getRandomFloat(1000, 2000);
    }

    // Kết thúc quay đầu
    if (this.isTurningBack) {
      this.turnBackTimer += delta;
      if (this.turnBackTimer >= this.turnBackDuration) {
        if (Math.random() < 0.5) {
          this.directionX = this.prevDirectionX;
          this.directionY = this.prevDirectionY;
          this.updateSpriteScale();
        }
        this.isTurningBack = false;
      }
    }

    // Đổi kiểu di chuyển
    this.changeDirectionTimer += delta;
    if (this.changeDirectionTimer > this.changeDirectionInterval) {
      this.changeDirectionTimer = 0;
      this.changeDirectionInterval = getRandomFloat(3000, 6000);
    
      if (Math.random() < 0.8) {
        this.moveType = getRandomFromArray(['horizontal', 'vertical', 'diagonal']);
        
        if (['horizontal', 'diagonal'].includes(this.moveType)) {
          this.directionX = Math.random() < 0.5 ? -1 : 1;
          this.updateSpriteScale();
        }
    
        if (['vertical', 'diagonal'].includes(this.moveType)) {
          this.directionY = Math.random() < 0.5 ? -1 : 1;
        }
      }
    }

    // Di chuyển
    const moveSpeed = this.speed * (delta / 1.04);
    const diagonalFactor = this.moveType === 'diagonal' ? 0.7 : 1;

    if (this.moveType !== 'vertical') {
      this.sprite.x += moveSpeed * this.directionX * diagonalFactor;
    }
    if (this.moveType !== 'horizontal') {
      this.sprite.y += moveSpeed * this.directionY * diagonalFactor;
    }

    // Chạm viền - optimized boundary checks
    const margin = 20;
    const verticalMargin = 50;
    
    if (this.sprite.x <= margin) {
      this.sprite.x = margin + 1;
      this.directionX = 1;
      this.updateSpriteScale();
    } else if (this.sprite.x >= this.windowWidth - margin) {
      this.sprite.x = this.windowWidth - margin - 1;
      this.directionX = -1;
      this.updateSpriteScale();
    }
    
    if (this.sprite.y <= verticalMargin) {
      this.sprite.y = verticalMargin + 1;
      this.directionY = 1;
    } else if (this.sprite.y >= this.windowHeight - verticalMargin) {
      this.sprite.y = this.windowHeight - verticalMargin - 1;
      this.directionY = -1;
    }
  }
}
