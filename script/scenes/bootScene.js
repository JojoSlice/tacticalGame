//Här hanteras bootScene

import Phaser from "phaser";

export default class Bootscene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("background", "../../images/startbackground.jpg");
    this.load.image("startButton", "../../images/startButton.png");
  }

  create() {
    this.add.image(400, 300, "background").setOrigin(0.5);

    const startButton = this.add
      .image(400, 300, "startButton")
      .setOrigin(0.5)
      .setInteractive();

    startButton.on("pointerdown", () => {
      this.scene.start("OverworldScene");
    });

    this.add
      .text(400, 200, "Spel Namn", {
        fontSize: "48px ",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }
}
