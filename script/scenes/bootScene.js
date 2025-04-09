export default class Bootscene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("background", "../../images/startbackground.jpg");
    this.load.image("startButton", "../../images/startButton.png");
  }

  create() {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    const width = winWidth / 2;
    const height = winHeight / 2;
    this.add
      .image(width, height, "background")
      .setOrigin(0.5)
      .setDisplaySize(winWidth, winHeight);

    const startButton = this.add
      .image(width, height, "startButton")
      .setOrigin(0.5)
      .setInteractive();

    startButton.on("pointerdown", () => {
      this.scene.start("OverworldScene");
    });
  }
}
