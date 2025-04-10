export default class smallEnemy {
  constructor(scene, x, y, sprite) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, sprite);

    this.sprite.setSize(32, 32);
    this.sprite.setOffset(15, 20);

    this.speed = 60;
    this.detectionRange = 150;

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
      key: "walk-up",
      frames: this.scene.anims.generateFrameNumbers("smallEnemyWalk", {
        start: 0,
        end: 5,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "walk-down",
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

  update(player) {
    this.moveTowardsPlayer(player);
  }

  moveTowardsPlayer(player) {
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      player.x,
      player.y,
    );

    if (distance < this.detectionRange) {
      const angle = Phaser.Math.Angle.Between(
        this.sprite.x,
        this.sprite.y,
        player.x,
        player.y,
      );

      this.sprite.body.velocity.x = Math.cos(angle) * this.speed;
      this.sprite.body.velocity.y = Math.sin(angle) * this.speed;

      this.playMovementAnimation(angle);
    } else {
      this.sprite.setVelocity(0, 0);
      this.playIdleAnimation();
    }
  }

  playMovementAnimation(angle) {
    if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
      this.sprite.anims.play("walk-right", true);
    } else if (angle >= Math.PI / 4 && angle < (3 * Math.PI) / 4) {
      this.sprite.anims.play("walk-up", true);
    } else if (angle >= (-3 * Math.PI) / 4 && angle < -Math.PI / 4) {
      this.sprite.anims.play("walk-down", true);
    } else {
      this.sprite.anims.play("walk-left", true);
    }
  }

  playIdleAnimation() {
    const angle = this.sprite.angle;

    if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
      this.sprite.anims.play("idle-right", true);
    } else if (angle >= Math.PI / 4 && angle < (3 * Math.PI) / 4) {
      this.sprite.anims.play("idle-up", true);
    } else if (angle >= (-3 * Math.PI) / 4 && angle < -Math.PI / 4) {
      this.sprite.anims.play("idle-down", true);
    } else {
      this.sprite.anims.play("idle-left", true);
    }
  }

  getSprite() {
    return this.sprite;
  }
}
