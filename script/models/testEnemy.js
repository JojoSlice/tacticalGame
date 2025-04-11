export default class SmallEnemyBattle {
  constructor(scene, x, y, sprite) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, sprite);

    this.sprite.setSize(24, 24);
    this.sprite.setOffset(40, 34);

    this.maxHealth = 80;
    this.health = this.maxHealth;

    this.maxDmg = 10;
    this.minDmg = 3;
    this.critical = 13;

    this.speed = 50;
    this.attackRange = 20;

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: "idleE",
      frames: this.scene.anims.generateFrameNumbers("enemy", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "walkE",
      frames: this.scene.anims.generateFrameNumbers("enemy", {
        start: 9,
        end: 16,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "attackE",
      frames: this.scene.anims.generateFrameNumbers("enemy", {
        start: 17,
        end: 21,
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "hurtE",
      frames: this.scene.anims.generateFrameNumbers("enemy", {
        start: 32,
        end: 35,
      }),
      frameRate: 5,
      repeat: 1,
    });
  }
}
