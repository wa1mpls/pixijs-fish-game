//import * as PIXI from 'pixi.js';
// import * as PIXI from 'pixi.js'; ← BỎ
//const app = new PIXI.Application({...});

import { loadAssets } from './utils/AssetLoader.js';
import { GameScene } from './scene/GameScene.js';

// Tạo app Pixi
export const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb
});

document.body.appendChild(app.view);

// Load tài nguyên & khởi chạy GameScene
async function start() {
    await loadAssets();
    const game = new GameScene(app);
    game.start();
}

window.onload = start;

// Cập nhật kích thước khi resize
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});
