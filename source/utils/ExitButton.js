export function exitButton(app, onClickCallback) {
  const width = 70;
  const height = 36;

  const exitButton = new PIXI.Graphics();
  exitButton.beginFill(0xe74c3c);
  exitButton.drawRoundedRect(0, 0, width, height, 6);
  exitButton.interactive = true;
  exitButton.buttonMode = true;
  exitButton.endFill();
  exitButton.x = app.screen.width - width - 20;
  exitButton.y = 20;

  const buttonText = new PIXI.Text('Exit', {
    fontSize: 14,
    fill: 'white',
    fontWeight: 'bold',
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 2
  });

  buttonText.anchor.set(0.5);
  buttonText.x = width / 2;
  buttonText.y = height / 2;
  exitButton.addChild(buttonText);

  exitButton.on('pointerover', () => {
    exitButton.tint = 0xd32f2f;
    exitButton.alpha = 0.95;
  });

  exitButton.on('pointerout', () => {
    exitButton.tint = 0xFFFFFF;
    exitButton.alpha = 1;
  });

  exitButton.on('pointerdown', onClickCallback);

  return exitButton;
}
