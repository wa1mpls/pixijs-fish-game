import { ASSETS } from '../constants.js';
import { GameScene } from './GameScene.js';
import { app } from '../app.js';
import { sounds } from '../utils/SoundManager.js';
import { safelyDestroy } from '../utils/Deferred.js';

export class MenuScene {
  constructor(appInstance) {
    this.app = appInstance;
    this.container = new PIXI.Container();
  }

  drawStartScreen() {
    this.container.removeChildren();

    const width = this.app.screen.width;
    const height = this.app.screen.height;

    // Tạo background
    const bg = new PIXI.Sprite(PIXI.Texture.from(ASSETS.start_game_background));
    bg.width = width;
    bg.height = height;
    this.container.addChild(bg);

    // Tạo các nút
    const buttons = [
      { texture: ASSETS.start_button, yOffset: -30, onClick: () => window.startGame() },
      { texture: ASSETS.level_button, yOffset: 60, onClick: () => console.log('Level clicked') },
      { texture: ASSETS.highscore_button, yOffset: 150, onClick: () => console.log('Highscore clicked') },
      { texture: ASSETS.login_button, yOffset: 240, onClick: () => console.log('Login clicked') },
    ];

    buttons.forEach(({ texture, yOffset, onClick }) => {
      const wrapper = new PIXI.Container();
      
      // Tạo shadow container
      const shadowContainer = new PIXI.Container();
      const shadow = new PIXI.Sprite(PIXI.Texture.from(texture));
      shadow.anchor.set(0.5);
      shadow.tint = 0x000000;
      shadow.alpha = 0.4;
      shadowContainer.addChild(shadow);
      shadowContainer.x = 4;
      shadowContainer.y = 4;
      wrapper.addChild(shadowContainer);

      // Tạo button sprite
      const btn = new PIXI.Sprite(PIXI.Texture.from(texture));
      btn.anchor.set(0.5);
      wrapper.addChild(btn);

      // Thiết lập vị trí và tương tác
      wrapper.x = width / 2;
      wrapper.y = height / 2 + yOffset;
      wrapper.interactive = true;
      wrapper.cursor = 'pointer';

      // Thêm hiệu ứng hover
      wrapper.on('pointerover', () => {
        btn.scale.set(1.05);
        shadowContainer.x = 6;
        shadowContainer.y = 6;
        shadow.alpha = 0.5;
      });

      wrapper.on('pointerout', () => {
        btn.scale.set(1);
        shadowContainer.x = 4;
        shadowContainer.y = 4;
        shadow.alpha = 0.4;
      });

      wrapper.on('pointerdown', () => {
        btn.scale.set(0.95);
        shadowContainer.x = 2;
        shadowContainer.y = 2;
        shadow.alpha = 0.3;
        
        sounds.click();
        
        // Thêm timeout để tạo hiệu ứng nhấn
        setTimeout(() => {
          wrapper.interactive = false;
          wrapper.removeAllListeners();
          requestAnimationFrame(onClick);
        }, 100);
      });

      this.container.addChild(wrapper);
    });
  }

  show() {
    // Dừng mọi hoạt động game
    this.app.ticker.stop();
    this.app.stage.eventMode = 'none';
    this.app.stage.removeAllListeners();
    
    // Xóa stage cũ
    while (this.app.stage.children.length > 0) {
      const child = this.app.stage.children[0];
      child.destroy({ children: true });
      this.app.stage.removeChild(child);
    }
    
    // Thiết lập menu
    this.app.stage.eventMode = 'static';
    document.getElementById('ui').style.display = 'none';
    
    // Vẽ lại UI
    this.drawStartScreen();
    this.app.stage.addChild(this.container);

    // Ẩn nút Exit HTML nếu có
    const exitBtn = document.getElementById('exitBtn');
    if (exitBtn) exitBtn.style.display = 'none';
  }

  destroy() {
    // Dừng mọi hoạt động
    this.app.ticker.stop();
    this.app.stage.eventMode = 'none';
    this.app.stage.removeAllListeners();
    
    // Xóa container và các đối tượng con
    if (this.container) {
      this.container.destroy({ children: true });
    }
  }
}
