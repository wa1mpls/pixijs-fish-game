
export function createBubbleEmitter(x, y, container) {
  const texture = PIXI.Texture.from('assets/image/effects/bubble.png');

  const config = {
    alpha: { start: 1, end: 0 },
    scale: { start: 0.4, end: 0.1 },
    speed: { start: 50, end: 20 },
    startRotation: { min: 0, max: 360 },
    lifetime: { min: 0.5, max: 1.2 },
    frequency: 0.1,
    emitterLifetime: 0.4,
    maxParticles: 30,
    pos: { x, y },
    spawnType: 'circle',
    spawnCircle: { x: 0, y: 0, r: 10 }
  };

  const emitter = new Emitter(container, [texture], config);
  emitter.autoUpdate = true;
  return emitter;
}
