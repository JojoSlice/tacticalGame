export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene" });
  }

  preload() {
    this.load.image("xpBorder", "../../assets/HUD/xpBarBorder.png");
    this.load.image("xpBar", "../../assets/HUD/xpBar.png");
    this.load.image("xpWindow", "../../assets/HUD/xpWindow.png");
  }

  create() {
    const { width, height } = this.scale;
    const bottom = 850;

    this.xpWindow = this.add.image(width / 2, bottom, "xpWindow");
    this.xpWindow.setOrigin(0.5, 0.5);
    this.xpWindow.setScrollFactor(0);

    this.xpBorder = this.add.image(width / 2, bottom, "xpBorder");
    this.xpBorder.setOrigin(0.5, 0.5);
    this.xpBorder.setScrollFactor(0);

    this.xpBar = this.add.image(width / 2, bottom, "xpBar");
    this.xpBar.setOrigin(0.5, 0.5);
    this.xpBar.setScrollFactor(0);

    this.xpMask = this.make.graphics({ x: 0, y: 0, add: false });
    this.xpBar.mask = new Phaser.Display.Masks.GeometryMask(this, this.xpMask);

    const xpString = "Xp: 0%";
    this.xpText = this.add
      .text(width / 2 - xpString.length * 3, bottom - 6, xpString, {
        fontSize: "12px",
        fill: "#ffffff",
        fontFamily: "monospace",
      })
      .setScrollFactor(0);
  }

  updateXPBar(percent) {
    const width = 240 * Phaser.Math.Clamp(percent / 100, 0, 1);

    this.xpMask.clear();
    this.xpMask.fillStyle(0xffffff);
    this.xpMask.fillRect(this.xpBar.x, this.xpBar.y, width, this.xpBar.height);

    const xpString = `Xp: ${percent}%`;
    this.xpText.setText(xpString);

    const screenWidth = this.scale.width;
    this.xpText.setX(screenWidth / 2 - xpString.length * 3);
  }
}
