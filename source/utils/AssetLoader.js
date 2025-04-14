//import * as PIXI from 'pixi.js';

import { ASSETS } from '../constants.js';

//const PIXI = window.PIXI;

export function loadAssets() {
  return new Promise(async (resolve, reject) => {
    try {
      const loader = PIXI.Assets;
      const loadPromises = [];
      
      // Pre-load all textures
      for (const [key, path] of Object.entries(ASSETS)) {
        loadPromises.push(
          loader.load({ alias: key, src: path })
            .catch(error => {
              console.error(`Failed to load asset ${key} from ${path}:`, error);
              // Return null for failed assets but don't break the loading process
              return null;
            })
        );
      }
      
      // Wait for all assets to load
      await Promise.all(loadPromises);
      
      console.log('✅ Assets loaded');
      resolve();
    } catch (error) {
      console.error('❌ Error loading assets:', error);
      reject(error);
    }
  });
}
  