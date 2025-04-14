// Helper functions Placeholder
export function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
export function getRandomPosition(screen) {
    const padding = 50;
    return {
      x: getRandomInt(padding, screen.width - padding),
      y: getRandomInt(padding + 50, screen.height - padding),
    };
}
  
export function getRandomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getOffScreenPosition(appWidth, appHeight) {
  const edge = Math.floor(Math.random() * 3); // 0 = left, 1 = right, 2 = top

  const y = Math.random() * appHeight;
  const x = Math.random() * appWidth;

  if (edge === 0) return { x: -50, y }; // Left
  if (edge === 1) return { x: appWidth + 50, y }; // Right
  return { x, y: -50 }; // Top
}


  
