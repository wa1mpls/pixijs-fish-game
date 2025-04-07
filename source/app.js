import { loadAssets } from './utils/AssetLoader.js';
import { GameScene } from './scene/GameScene.js';

// Tạo app Pixi với auto-resize
export const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x1099bb,
  antialias: true
});

document.body.appendChild(app.view);

// 🎵 Nhạc nền (tạo trước, play sau)
const backgroundMusic = new Audio('assets/sounds/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.4;

let isMusicPlaying = false;

// ✅ Chạy game sau khi load xong assets
async function start() {
  await loadAssets();
  const game = new GameScene(app);
  game.start();

  // ✅ Phát nhạc sau khi game khởi động
  backgroundMusic.play().then(() => {
    isMusicPlaying = true;
  }).catch(e => {
    console.warn("🎵 Không thể phát nhạc tự động:", e);
  });
}

window.onload = start;

// ✅ Nút toggle âm nhạc
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
