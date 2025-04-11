export default class SmallEnemyBattle {
  constructor(scene, x, y, sprite) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, sprite);

    this.sprite.setSize(24, 24);
    this.sprite.setOffset(12, 12);

    this.speed = 50;
    this.attackRange = 20;

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("enemy", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repete: -1,
    });
    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("enemy", {
        start: 6,
        end: 13,
      }),
      frameRate: 8,
      repete: -1,
    });
    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("enemy", {
        start: 14,
        end: 19,
      }),
      frameRate: 8,
      repete: 0,
    });
    this.scene.anims.create({
      key: "hurt",
      frames: this.scene.anims.generateFrameNumbers("enemy", {
        start: 26,
        end: 29,
      }),
      frameRate: 5,
      repete: 0,
    });
  }
  update(player, spawn, action) {
    if (action === "attack") {
      this.attackAction(player, spawn);
    } else if (action === "hurt") {
      this.playHurtAnimation(player);
    } else {
      this.playIdleAnimation(player);
    }
  }

  attackAction(player, spawn) {
    const distance = this.getDistance(player.x, player.y);
    const angle = this.getAngle(player.x, player.y);

    this.sprite.body.velocity.x = Math.cos(angle) * this.speed;
    this.sprite.body.velocity.y = Math.sin(angle) * this.speed;

    this.playWalkAnimation(player);

    if (distance < this.attackRange) {
      this.sprite.setVelocity(0, 0);
      this.playAttackAnimation;
      this.sprite.once("animationcomplete", () => {
        this.walkBack(spawn, player);
      });
    }
  }

  walkBack(spawn, player) {
    const distance = this.getDistance(spawn.x, spawn.y);
    const angle = this.getAngle(spawn.x, spawn.y);

    this.sprite.body.velocity.x = Math.cos(angle) * this.speed;
    this.sprite.body.velocity.y = Math.sin(angle) * this.speed;

    this.playWalkAnimation(spawn);

    if (distance < 0) {
      this.sprite.setVelocity(0, 0);
      this.playIdleAnimation(player);
    }
  }

  playAttackAnimation(player) {
    this.sprite.anims.play("attack", true);
    if (player.x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playWalkAnimation(player) {
    this.sprite.anims.play("walk", true);
    if (player.x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playIdleAnimation(player) {
    this.sprite.setVelocity(0, 0);
    this.sprite.anims.play("idle", true);

    if (player.x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playHurtAnimation(player) {
    this.sprite.anims.play("hurt", true);
    if (player.x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  getDistance(x, y) {
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      x,
      y,
    );
    return distance;
  }

  getAngle(x, y) {
    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, x, y);
    return angle;
  }
}
