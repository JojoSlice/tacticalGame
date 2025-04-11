export default class PlayerBattle {
  constructor(scene, x, y, sprite) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, sprite);

    this.sprite.setSize(24, 24);
    this.sprite.setOffset(12, 12);

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
      repete: -1,
    });
    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 6,
        end: 13,
      }),
      frameRate: 8,
      repete: -1,
    });
    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 14,
        end: 19,
      }),
      frameRate: 8,
      repete: 0,
    });
    this.scene.anims.create({
      key: "hurt",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 35,
        end: 38,
      }),
      frameRate: 5,
      repete: 0,
    });
  }
  update(enemy, spawn, action) {
    if (action === "attack") {
      this.attackAction(enemy, spawn);
    } else if (action === "hurt") {
      this.playHurtAnimation(enemy);
    } else {
      this.playIdleAnimation(enemy);
    }
  }

  attackAction(enemy, spawn) {
    const distance = this.getDistance(enemy.x, enemy.y);
    const angle = this.getAngle(enemy.x, enemy.y);

    this.sprite.body.velocity.x = Math.cos(angle) * this.speed;
    this.sprite.body.velocity.y = Math.sin(angle) * this.speed;

    this.playWalkAnimation(enemy);

    if (distance < this.attackRange) {
      this.sprite.setVelocity(0, 0);
      this.playAttackAnimation;
      this.sprite.once("animationcomplete", () => {
        this.walkBack(spawn, enemy);
      });
    }
  }

  walkBack(spawn, enemy) {
    const distance = this.getDistance(spawn.x, spawn.y);
    const angle = this.getAngle(spawn.x, spawn.y);

    this.sprite.body.velocity.x = Math.cos(angle) * this.speed;
    this.sprite.body.velocity.y = Math.sin(angle) * this.speed;

    this.playWalkAnimation(spawn);

    if (distance < 0) {
      this.sprite.setVelocity(0, 0);
      this.playIdleAnimation(enemy);
    }
  }

  playAttackAnimation(enemy) {
    this.sprite.anims.play("attack", true);
    if (enemy.x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playWalkAnimation(enemy) {
    this.sprite.anims.play("walk", true);
    if (enemy.x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playIdleAnimation(enemy) {
    this.sprite.setVelocity(0, 0);
    this.sprite.anims.play("idle", true);

    if (enemy.x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playHurtAnimation(enemy) {
    this.sprite.anims.play("hurt", true);
    if (enemy.x < this.sprite.x) {
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
