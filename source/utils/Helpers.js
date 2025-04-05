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
  