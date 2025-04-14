export function exitButton(app, onClickCallback = null) {
  const width = 70;
  const height = 36;

  const button = new PIXI.Graphics();
  button.beginFill(0xe74c3c);
  button.drawRoundedRect(0, 0, width, height, 6);
  button.endFill();

  button.interactive = true;
  button.eventMode = 'static'; // ✅ Quan trọng trong PixiJS v7+
  button.cursor = 'pointer';

  button.x = app.screen.width - width - 20;
  button.y = 20;

  const label = new PIXI.Text('Exit', {
    fontSize: 14,
    fill: 'white',
    fontWeight: 'bold',
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 2,
  });

  label.anchor.set(0.5);
  label.x = width / 2;
  label.y = height / 2;
  button.addChild(label);

  button.on('pointerover', () => {
    button.tint = 0xd32f2f;
    button.alpha = 0.95;
  });

  button.on('pointerout', () => {
    button.tint = 0xFFFFFF;
    button.alpha = 1;
  });

  // ✅ DEBUG: log path để xác định lỗi propagation Pixi 7
  button.on('pointerdown', (e) => {
    console.log('[ExitButton] PointerDown triggered');
    if (typeof e.composedPath === 'function') {
      const path = e.composedPath();
      console.log('[ExitButton] Composed path:', path);
    }

    if (typeof onClickCallback === 'function') {
      onClickCallback(e); // truyền lại event nếu cần
    }
  });

  return button;
}
