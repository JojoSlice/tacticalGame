export default class PlayerBattle {
  constructor(scene, x, y, sprite) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, sprite);

    this.sprite.setSize(24, 24);
    this.sprite.setOffset(38, 34);

    this.maxHealth = 100;
    this.health = this.maxHealth;

    this.maxDmg = 10;
    this.minDmg = 5;
    this.critical = 15;

    this.speed = 50;
    this.attackRange = 40;

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 9,
        end: 16,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 18,
        end: 23,
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "hurt",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 45,
        end: 48,
      }),
      frameRate: 5,
      repeat: 1,
    });
  }
}
