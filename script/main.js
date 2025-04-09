import BootScene from "scenes/bootScene.js";
import BattleScene from "scenes/battleScene.js";
import OverworldScene from "scenes/overWorld.js";
import UIScene from "scenes/uiScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, OverworldScene, BattleScene, UIScene],
};

const game = new Phaser.Game(config);
