import { loadAssets } from './utils/AssetLoader.js';
import { MenuScene } from './scene/MenuScene.js';
import { GameScene } from './scene/GameScene.js';

// Tạo app Pixi với auto-resize
export const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x1099bb,
  antialias: true
});

document.body.appendChild(app.view);

//  Nhạc nền (tạo trước, play sau)
const backgroundMusic = new Audio('assets/sounds/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.4;

let isMusicPlaying = false;
let isTransitioning = false; // Flag để tránh chuyển scene nhiều lần

// Scene hiện tại
let currentScene = null;

// Chạy game sau khi load xong assets
async function start() {
  try {
    await loadAssets();
    showMenu(); // Chuyển sang MenuScene khi tải assets xong
    
    //  Phát nhạc sau khi game khởi động
    backgroundMusic.play().then(() => {
      isMusicPlaying = true;
    }).catch(() => {
      // Nếu bị chặn, đợi người chơi click bất kỳ đâu (ẩn)
      const enableMusic = () => {
        backgroundMusic.play().then(() => {
          isMusicPlaying = true;
        }).catch(e => {
          console.warn("🎵 Trình duyệt từ chối phát nhạc:", e);
        });
        window.removeEventListener('click', enableMusic);
      };
    
      window.addEventListener('click', enableMusic);
    });

    // Xử lý nút Exit
    setupExitButton();
  } catch (error) {
    console.error('Error starting game:', error);
  }
}

// Hiển thị menu
function showMenu() {
  if (isTransitioning) return;
  isTransitioning = true;

  // Dừng game loop
  app.ticker.stop();
  
  if (currentScene) {
    currentScene.destroy();
  }

  // Clear stage
  while (app.stage.children.length > 0) {
    const child = app.stage.children[0];
    child.destroy({ children: true });
    app.stage.removeChild(child);
  }

  currentScene = new MenuScene(app);
  currentScene.show();

  // Reset game state
  app.ticker.start();
  isTransitioning = false;
}

// Bắt đầu game mới
function startGame() {
  if (isTransitioning) return;
  isTransitioning = true;

  // Dừng game loop
  app.ticker.stop();

  if (currentScene) {
    currentScene.destroy();
  }

  // Clear stage
  while (app.stage.children.length > 0) {
    const child = app.stage.children[0];
    child.destroy({ children: true });
    app.stage.removeChild(child);
  }

  currentScene = new GameScene(app);
  currentScene.start();

  // Reset game state
  app.ticker.start();
  isTransitioning = false;
}

// Quay về menu
function exitToMenu() {
  if (isTransitioning) return;
  
  console.log("Exiting to menu...");
  
  // Dừng game loop và xóa các event listener
  app.ticker.stop();
  app.stage.eventMode = 'none';
  
  // Ẩn UI game
  const ui = document.getElementById('ui');
  if (ui) ui.style.display = 'none';
  
  // Ẩn nút Exit
  const exitBtn = document.getElementById('exitBtn');
  if (exitBtn) exitBtn.style.display = 'none';

  // Chuyển về menu trong next frame để tránh lag
  requestAnimationFrame(() => {
    showMenu();
  });
}

// Thiết lập nút Exit
function setupExitButton() {
  const exitBtn = document.getElementById('exitBtn');
  if (!exitBtn) return;

  // Xóa tất cả event listener cũ
  const newExitBtn = exitBtn.cloneNode(true);
  exitBtn.parentNode.replaceChild(newExitBtn, exitBtn);

  // Thêm event listener mới
  newExitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isTransitioning && confirm('Return to menu?')) {
      exitToMenu();
    }
  });
}

// Gán các hàm vào window để có thể gọi từ các scene khác
window.startGame = startGame;
window.exitToMenu = exitToMenu;

// Xử lý âm nhạc
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleMusicBtn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      backgroundMusic.pause();
      toggleBtn.textContent = 'Play';
    } else {
      backgroundMusic.play().then(() => {
        toggleBtn.textContent = 'Pause';
      }).catch(e => {
        console.warn("🎵 Không thể phát nhạc:", e);
      });
    }
    isMusicPlaying = !isMusicPlaying;
  });
});

window.onload = start;
