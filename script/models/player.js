export default class Player {
  constructor(scene, x, y, sprite) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, sprite);

    this.cursors = this.input.keyboard.addKeys({
      walkUp: Phaser.Input.Keyboard.KeyCodes.W,
      walkDown: Phaser.Input.Keyboard.KeyCodes.S,
      walkLeft: Phaser.Input.Keyboard.KeyCodes.A,
      walkRight: Phaser.Input.Keyboard.KeyCodes.D,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
      downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    });

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: "walk-Down",
      frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-Left",
      frames: this.scene.anims.generateFrameNumbers("player", { start: 6, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-Right",
      frames: this.scene.anims.generateFrameNumbers("player", { start: 12, end: 17 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-Up",
      frames: this.scene.anims.generateFrameNumbers("player", { start: 18, end: 23 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "idleDown",
      frames: this.scene.anims.generateFrameNumbers("playerIdle", {
        start: 0,
        end: 11,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "idleLeft",
      frames: this.scene.anims.generateFrameNumbers("playerIdle", {
        start: 12,
        end: 23,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "idleDown",
      frames: this.scene.anims.generateFrameNumbers("playerIdle", {
        start: 24,
        end: 35,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "idleUp",
      frames: this.scene.anims.generateFrameNumbers("playerIdle", {
        start: 36,
        end: 39,
      }),
      frameRate: 8,
      repeat: -1,
    });
  }

  update() {
    const speed = 150;
    this.sprite.setVelocity(0);

    if (this.cursors.walkLeft.isDown) {
      this.sprite.setVelocityX(-speed);
      this.sprite.anims.play("walk-Left", true);
    } else if (this.cursors.walkRight.isDown) {
      this.sprite.setVelocityX(speed);
      this.sprite.anims.play("walk-Right", true);
    } else if (this.cursors.walkUp.isDown) {
      this.sprite.setVelocityY(-speed);
      this.sprite.anims.play("walk-Up", true);
    } else if (this.cursors.walkDown.isDown) {
      this.sprite.setVelocityY(speed);
      this.sprite.anims.play("walk-Down", true);
    } else {

      if (this.sprite.body.velocity.x === 0 && this.sprite.body.velocity.y === 0) {
        if ( this.sprite.anims.currentAnim) {
          if (this.sprite.anims.currentAnim.key === 'walk-Down') {
                    this.sprite.anims.play('idleDown', true);
                } else if (this.sprite.anims.currentAnim.key === 'walk-Left') {
                    this.sprite.anims.play('idleLeft', true);
                } else if (this.sprite.anims.currentAnim.key === 'walk-Right') {
                    this.sprite.anims.play('idleRight', true);
                } else if (this.sprite.anims.currentAnim.key === 'walk-Up') {
                    this.sprite.anims.play('idleUp', true);
                })
        }
      }
    }
  }

  getSprite() {
    return this.sprite;
  }
}
