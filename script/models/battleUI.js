export default class battleUI {
  constructor(scene, x, y, actions) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.actions = actions;

    this.create();
  }

  create() {
    let panel = this.scene.add
      .rectangle(0, 0, 63, 60, 0x222222)
      .setStrokeStyle(2, 0xffffff);

    this.container = this.scene.add.container(this.x + 10, this.y);

    let size = 25;
    let padding = 2;
    let offsetX = -size / 2 - padding;
    let offsetY = -size / 2 - padding;

    const labels = ["Attack", "Defend", "Item", "Tom"];
    const callbacks = [
      this.actions.attack,
      this.actions.defend,
      this.actions.item,
      null, // fjärde rutan gör ingenting
    ];

    for (let i = 0; i < 4; i++) {
      let x = offsetX + (i % 2) * (size + padding * 2);
      let y = offsetY + Math.floor(i / 2) * (size + padding * 2);

      let color = i < 3 ? 0x8888ff : 0x888888; // 3 knappar, 1 inaktiv
      let btn = this.scene.add
        .rectangle(x, y, size, size, color)
        .setInteractive();
      let label = this.scene.add
        .text(x, y, labels[i], {
          color: "#ffffff",
          fontSize: "5px",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      if (callbacks[i]) {
        btn.on("pointerdown", callbacks[i]);
      }

      this.container.add(btn);
      this.container.add(label);
    }
    this.container.addAt(panel, 0);

    this.container.setVisible(false);
  }

  show() {
    this.container.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
  }
}
