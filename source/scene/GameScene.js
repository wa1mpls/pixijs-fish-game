// Các import giữ nguyên như cũ
import { ASSETS } from '../constants.js';
import { PlayerFish } from '../entities/PlayerFish.js';
import { SmallFish } from '../entities/Enemy.js';
import { BigFish } from '../entities/Big_Fish.js';
import { GameStats } from '../utils/GameStats.js';
import { LevelSystem } from '../systems/LevelSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { SpawnSystem } from '../utils/SpawnSystem.js';
import { getRandomInt } from '../utils/Helpers.js';
//import { BubbleEffect } from '../effects/BubbleEffect.js';
import { exitButton } from '../utils/ExitButton.js';
import { sounds } from '../utils/SoundManager.js';
import { safelyDestroy } from '../utils/Deferred.js';
import { MenuScene } from './MenuScene.js';




export class GameScene {
  constructor(appInstance) {
    this.app = appInstance;
    this.container = new PIXI.Container();
    this.player = null;
    this.enemies = [];
    this.stats = new GameStats(this);
    this.levelSystem = null;
    this.spawnSystem = null;
    this.collisionSystem = null;
    this.startTime = Date.now();
    this.effects = [];
    this.isGameOver = false;
    this.hasStarted = false;
    this.isInGame = false;
    this.isWinning = false;
    this.fireworks = [];
  }

  start() {
    if (this.hasStarted) return;
    this.hasStarted = true;
    this.isInGame = true;

    // 1. Hiển thị lại HUD
    document.getElementById('ui').style.display = 'block';
  
    // 2. STOP và REMOVE ticker cũ để tránh chạy ngầm
    this.app.ticker.stop();
    this.app.ticker.remove(this.update, this);
    this.app.ticker.start();
  
    // 3. Reset tất cả state
    this.container.removeChildren(); 
    this.enemies.forEach(enemy => {
      if (enemy.sprite) {
        enemy.sprite.destroy();
      }
    });
    this.enemies = [];
    this.effects = [];
    this.isGameOver = false;
    this.startTime = Date.now();
  
    // 4. Reset điểm, level, cá ăn
    this.stats.reset();
  
    // 5. Thêm lại nền
    const bg = new PIXI.Sprite(PIXI.Texture.from(ASSETS.background));
    bg.width = this.app.screen.width;
    bg.height = this.app.screen.height;
    this.container.addChild(bg);
  
    // 6. Tạo player mới
    this.player = new PlayerFish();
    this.player.sprite.x = this.app.screen.width / 2;
    this.player.sprite.y = this.app.screen.height / 2;
    this.player.fishEatenForGrowth = 0;
    this.player.hitCount = 0;
    this.player.lastHit = 0;
    this.container.addChild(this.player.sprite);
  
    // 7. Tạo cá kẻ địch ban đầu
    const initialCount = getRandomInt(15, 20);
    this.spawnEnemies(initialCount);
  
    // 8. Hệ thống logic
    this.levelSystem = new LevelSystem(this, this.player, this.stats);
    this.spawnSystem = new SpawnSystem(this.container);
    this.collisionSystem = new CollisionSystem(
      this, this.player, this.stats, this.effects, sounds, this.showLevelUpText.bind(this)
    );
  
    // 9. Điều khiển chuột
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on('mousemove', (e) => {
      const pos = e.global;
      this.player.setTarget(pos.x, pos.y);
    });
  
    // 10. Gắn container mới và bắt đầu loop game
    this.app.stage.addChild(this.container);
    this.app.ticker.add(this.update, this);
  
    // 11. Thêm nút Exit
    const exitBtn = exitButton(this.app, () => {
      if (confirm('Return to menu?')) {
        window.exitToMenu();
      }
    });
    this.container.addChild(exitBtn);
  }
  // Khi người chơi chết hoặc Game Over
  gameOver() {
    // Double check để tránh gọi nhiều lần
    if (this.isGameOver === true) {
      console.log("GameOver already triggered");
      return;
    }

    // Đặt flag ngay lập tức
    this.isGameOver = true;
    this.isInGame = false;
    
    console.log("GameOver being processed...");
    
    // Hide UI first
    const ui = document.getElementById('ui');
    if (ui) ui.style.display = 'none';
    
    // Đợi 1 giây trước khi dừng game để animation được mượt
    setTimeout(() => {
      // Stop update loop
      this.app.ticker.remove(this.update, this);
      
      // Remove event listeners
      this.app.stage.eventMode = 'none';
      this.app.stage.removeAllListeners();
      
      // Dừng chuyển động của các đối tượng
      if (this.player) {
        this.player.speed = 0;
      }
      
      if (this.enemies) {
        this.enemies.forEach(enemy => {
          if (enemy && enemy.movement) {
            enemy.movement.speed = 0;
          }
        });
      }
      
      // Đợi thêm một frame để đảm bảo mọi thứ đã dừng
      requestAnimationFrame(() => {
        // Xóa toàn bộ game objects
        if (this.container) {
          while(this.container.children.length > 0) {
            const child = this.container.children[0];
            this.container.removeChild(child);
            if (child.destroy) {
              child.destroy({ children: true, texture: true });
            }
          }
          this.container.destroy({ children: true });
        }
        
        // Clear arrays
        this.enemies = [];
        this.effects = [];
        this.player = null;
        
        // Clear stage
        while (this.app.stage.children.length > 0) {
          const child = this.app.stage.children[0];
          this.app.stage.removeChild(child);
          if (child.destroy) {
            child.destroy({ children: true });
          }
        }
        
        // Load GameOverScene không kèm score
        import('./GameOverScene.js').then(module => {
          const gameOver = new module.GameOverScene();
          gameOver.show();
        }).catch(error => {
          console.error("Error loading GameOverScene:", error);
          window.location.reload();
        });
        
        // Stop ticker last
        if (this.app.ticker.started) {
          this.app.ticker.stop();
        }
      });
    }, 1000); // Đợi 1 giây
  }

  update(delta) {
    // Early return if game is over or won
    if (this.isGameOver || !this.isInGame) return;

    // Update player
    if (this.player) {
      this.player.update(delta);
    }

    const now = Date.now();
    
    // Update spawn system
    if (this.spawnSystem) {
      this.spawnSystem.update(delta, now - this.startTime);
    }

    // Collect active objects
    const activeObjects = [];
    if (this.enemies && this.enemies.length > 0) {
      activeObjects.push(...this.enemies);
    }
    if (this.spawnSystem) {
      activeObjects.push(...this.spawnSystem.getObjects());
    }

    // Update active objects
    for (const obj of activeObjects) {
      if (obj && typeof obj.update === 'function') {
        obj.update(delta);
      }
    } 

    // Spawn more enemies if needed
    if (this.enemies && this.enemies.length < 15) {
      this.spawnEnemies(getRandomInt(5, 10));
    }

    // Update game systems
    if (this.levelSystem) {
      this.levelSystem.update();
    }
    
    if (this.collisionSystem) {
      this.collisionSystem.update(activeObjects);
    }
    
    this.updateHearts();

    // Update effects
    if (this.effects) {
      this.effects.forEach(e => {
        if (e && typeof e.update === 'function') {
          e.update(delta);
        }
      });
      this.effects = this.effects.filter(e => !e.isDone);
    }

    // Check for game over
    if (this.player && this.player.isDead() && !this.isGameOver) {
      console.log("Player is dead in update cycle");
      this.gameOver();
    }
  }

  spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
      const isBig = Math.random() < 0.15;
      const enemy = isBig ? new BigFish() : new SmallFish();
      enemy.type = isBig ? 'big_fish' : 'small_fish';

      // Spawn từ rìa
      let x, y;
      const side = Math.floor(Math.random() * 3);
      if (side === 0) {
        x = -50;
        y = Math.random() * this.app.screen.height;
      } else if (side === 1) {
        x = this.app.screen.width + 50;
        y = Math.random() * this.app.screen.height;
      } else {
        x = Math.random() * this.app.screen.width;
        y = -50;
      }

      enemy.sprite.x = x;
      enemy.sprite.y = y;
      enemy.hasBeenEaten = false;


      if (enemy.setDirection) {
        enemy.setDirection(this.player.sprite.x, this.player.sprite.y);
      }

      this.enemies.push(enemy);
      this.container.addChild(enemy.sprite);
    }
  }



  resetSceneForNextLevel() {
    for (const e of this.enemies) {
      this.container.removeChild(e.sprite);
    }
    this.enemies = [];

    const randomCount = getRandomInt(15, 20);
    this.spawnEnemies(randomCount);

    this.player.sprite.x = this.app.screen.width / 2;
    this.player.sprite.y = this.app.screen.height / 2;
  }

  updateHearts() {
    if (this.isGameOver) return; // tránh lỗi HUD loạn
    const livesEl = document.getElementById('lives');
    if (livesEl) {
      // Thay vì hiện số 3, hiện ❤️❤️❤️
      livesEl.textContent = '❤️'.repeat(Math.max(0, 3 - this.player.hitCount));
    }
  }

  showLevelUpText(level) {
    const text = new PIXI.Text(`🆙 Level ${level}`, {
      fontFamily: 'Arial',
      fontSize: 64,
      fill: ['#ffffff', '#ffff88'],
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center',
    });
    text.anchor.set(0.5);
    text.x = this.app.screen.width / 2;
    text.y = this.app.screen.height / 2;
  
    this.container.addChild(text);
  
    // Hiệu ứng mờ dần rồi xóa
    this.app.ticker.addOnce(() => {
      let elapsed = 0;
      const fadeTicker = (delta) => {
        elapsed += delta;
        if (elapsed > 180) { // khoảng 1s
          text.alpha -= 0.05;
          if (text.alpha <= 0) {
            this.container.removeChild(text);
            this.app.ticker.remove(fadeTicker);
          }
        }
      };
      this.app.ticker.add(fadeTicker);
    });
  }

  showNextLevelText(level) {
    const text = new PIXI.Text(`🚩 Stage ${level}`, {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: ['#ffffff', '#99ccff'],
      stroke: '#003366',
      strokeThickness: 4,
      align: 'center',
    });
    text.anchor.set(0.5);
    text.x = this.app.screen.width / 2;
    text.y = 80;
    this.container.addChild(text);
  
    this.app.ticker.addOnce(() => {
      let elapsed = 0;
      const fadeTicker = (delta) => {
        elapsed += delta;
        if (elapsed > 180) {
          text.alpha -= 0.05;
          if (text.alpha <= 0) {
            this.container.removeChild(text);
            this.app.ticker.remove(fadeTicker);
          }
        }
      };
      this.app.ticker.add(fadeTicker);
    });
  }
  
  showWinScreen() {
    if (this.isWinning) return;
    this.isWinning = true;

    // Tạo text YOU WON giống kiểu level up
    const winText = new PIXI.Text('YOU WON!', {
      fontFamily: 'Arial',
      fontSize: 84,
      fill: 0xffd700, // Màu vàng
      align: 'center',
      fontWeight: 'bold',
      stroke: 0x000000,
      strokeThickness: 6,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
    });

    winText.anchor.set(0.5);
    winText.x = window.innerWidth / 2;
    winText.y = window.innerHeight / 2;
    winText.alpha = 0;
    this.container.addChild(winText);

    // Animation cho text
    const fadeIn = () => {
      winText.alpha += 0.1;
      if (winText.alpha < 1) {
        requestAnimationFrame(fadeIn);
      }
    };
    fadeIn();

    // Tạo pháo hoa
    const createFirework = () => {
      const firework = new PIXI.Container();
      firework.x = Math.random() * window.innerWidth;
      firework.y = Math.random() * window.innerHeight;
      this.container.addChild(firework);

      // Tạo các tia pháo hoa
      const particleCount = 30;
      const particles = [];
      const colors = [0xffd700, 0xff0000, 0x00ff00, 0x0000ff, 0xff00ff];

      for (let i = 0; i < particleCount; i++) {
        const particle = new PIXI.Graphics();
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.beginFill(color);
        particle.drawCircle(0, 0, 2);
        particle.endFill();
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 2;
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;
        particle.alpha = 1;
        
        firework.addChild(particle);
        particles.push(particle);
      }

      // Animation cho pháo hoa
      const animate = () => {
        if (firework.alpha <= 0) {
          this.container.removeChild(firework);
          return;
        }

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.01;
          p.vy += 0.1; // Trọng lực
        });

        firework.alpha -= 0.01;
        requestAnimationFrame(animate);
      };
      animate();

      this.fireworks.push(firework);
    };

    // Tạo nhiều pháo hoa
    const launchFireworks = () => {
      createFirework();
      if (this.isWinning) {
        setTimeout(launchFireworks, 500);
      }
    };
    launchFireworks();

    // Chờ 5 giây rồi về menu
    setTimeout(() => {
      // Dừng pháo hoa
      this.isWinning = false;
      // Xóa tất cả pháo hoa
      this.fireworks.forEach(firework => {
        this.container.removeChild(firework);
      });
      this.fireworks = [];
      // Về menu
      window.exitToMenu();
    }, 5000);
  }

  destroy() {
    console.log("GameScene.destroy() called");
    
    try {
      // Dừng game loop
      if (this.app && this.app.ticker) {
        this.app.ticker.remove(this.update, this);
        if (this.app.ticker.started) {
          this.app.ticker.stop();
        }
      }
      
      // Xóa các event listener
      if (this.app && this.app.stage) {
        this.app.stage.eventMode = 'none';
        this.app.stage.removeAllListeners();
      }
      
      // Reset các trạng thái
      this.isGameOver = true;
      this.isInGame = false;
      this.hasStarted = false;
      
      // Dừng chuyển động của các đối tượng
      if (this.player) {
        this.player.speed = 0;
      }
      
      if (this.enemies) {
        this.enemies.forEach(enemy => {
          if (enemy && enemy.movement) {
            enemy.movement.speed = 0;
          }
        });
      }
      
      // Xóa các đối tượng game
      if (this.enemies && this.enemies.length > 0) {
        this.enemies.forEach(enemy => {
          if (enemy && enemy.sprite) {
            if (enemy.sprite.parent) {
              enemy.sprite.parent.removeChild(enemy.sprite);
            }
            enemy.sprite.destroy({ children: true, texture: true });
          }
        });
        this.enemies = [];
      }
      
      if (this.effects && this.effects.length > 0) {
        this.effects.forEach(effect => {
          if (effect && effect.destroy) {
            effect.destroy();
          }
        });
        this.effects = [];
      }
      
      // Xóa player
      if (this.player && this.player.sprite) {
        if (this.player.sprite.parent) {
          this.player.sprite.parent.removeChild(this.player.sprite);
        }
        this.player.sprite.destroy({ children: true, texture: true });
      }
      this.player = null;
      
      // Xóa container và các đối tượng con
      if (this.container) {
        while(this.container.children.length > 0) {
          const child = this.container.children[0];
          this.container.removeChild(child);
          if (child.destroy) {
            child.destroy({ children: true, texture: true });
          }
        }
        this.container.destroy({ children: true });
      }
      
      // Xóa các hệ thống
      this.levelSystem = null;
      this.spawnSystem = null;
      this.collisionSystem = null;
      
      console.log("GameScene destroyed successfully");
    } catch (error) {
      console.error("Error during GameScene.destroy():", error);
    }
  }
  
}
