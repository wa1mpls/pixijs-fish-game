const preload = (src) => {
    const audio = new Audio(src);
    audio.volume = 0.6;
    return audio;
  };
  
  const playSound = (audio) => {
    const sound = audio.cloneNode();
    sound.volume = audio.volume;
    sound.play().catch(e => {
      // tránh crash nếu browser block
      console.warn('Sound play blocked:', e);
    });
  };
  
  export const sounds = {
    eatSmall: () => playSound(sounds._eatSmall),
    eatBig: () => playSound(sounds._eatBig),
    hitCrab: () => playSound(sounds._hitCrab),
    collectPearl: () => playSound(sounds._collectPearl),
    hitSnake: () => playSound(sounds._hitSnake),
  
    // Preloaded objects
    _eatSmall: preload('assets/sounds/hit_small.mp3'),
    _eatBig: preload('assets/sounds/hi_bigt.mp3'),
    _hitCrab: preload('assets/sounds/hit_crab.mp3'),
    _collectPearl: preload('assets/sounds/collect_pearl.mp3'),
    _hitSnake: preload('assets/sounds/hit_snake.mp3'),
    click: () => playSound(sounds._click),
    _click: preload('assets/sounds/click.mp3'),
  };
