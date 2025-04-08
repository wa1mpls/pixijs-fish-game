//import * as PIXI from 'pixi.js';

import { ASSETS } from '../constants.js';

//const PIXI = window.PIXI;

export function loadAssets() {
    return new Promise(async (resolve) => {
      const loader = PIXI.Assets;
  
      for (const [key, path] of Object.entries(ASSETS)) {
        await loader.load({ alias: key, src: path });
      }
  
      console.log('✅ Assets loaded');
      resolve();
    });
  }
  