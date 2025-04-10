//Hantera smalEnemy här
export default class smallEnemy {
  constructor(scene, x, y, sprite) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, sprite);

    this.sprite.setSize(32, 32);
    this.sprite.setOffset(15, 20);

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: "idle-down",
      frames: this.scene.anims.generateFrameNumbers("smallEnemy", {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "idle-up",
      frames: this.scene.anims.generateFrameNumbers("smallEnemy", {
        start: 4,
        end: 7,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "idle-left",
      frames: this.scene.anims.generateFrameNumbers("smallEnemy", {
        start: 8,
        end: 11,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "idle-right",
      frames: this.scene.anims.generateFrameNumbers("smallEnemy", {
        start: 12,
        end: 15,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "walk-down",
      frames: this.scene.anims.generateFrameNumbers("smallEnemyWalk", {
        start: 0,
        end: 5,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "walk-up",
      frames: this.scene.anims.generateFrameNumbers("smallEnemyWalk", {
        start: 6,
        end: 11,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "walk-left",
      frames: this.scene.anims.generateFrameNumbers("smallEnemyWalk", {
        start: 12,
        end: 17,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "walk-right",
      frames: this.scene.anims.generateFrameNumbers("smallEnemyWalk", {
        start: 18,
        end: 23,
      }),
      frameRate: 6,
      repeat: -1,
    });
  }

  update() {
    const speed = 70;
  }

  getSprite() {
    return this.sprite;
  }
}
