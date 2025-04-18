import BootScene from "./scenes/bootScene.js";
import BattleScene from "./scenes/testBattle.js";
import OverworldScene from "./scenes/overWorld.js";
import UIScene from "./scenes/uiScene.js";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, OverworldScene, UIScene, BattleScene],
};

const game = new Phaser.Game(config);
