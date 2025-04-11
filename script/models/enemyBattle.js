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
      repeat: 0,
    });
  }
  update() {}

  attackAction(player) {
    const distance = this.getDistance(player.x, player.y);
    const angle = this.getAngle(player.x, player.y);

    this.sprite.body.velocity.x = Math.cos(angle) * this.speed;
    this.sprite.body.velocity.y = Math.sin(angle) * this.speed;

    this.playWalkAnimation(player);

    if (distance < this.attackRange) {
      this.sprite.setVelocity(0, 0);
      this.playAttackAnimation(player);
      this.sprite.once("animationcomplete", () => {});
    }
  }

  takeDamage(damage, player) {
    this.health = -damage;
    this.playHurtAnimation(player);
  }

  isDead() {
    if (this.health <= 0) {
      return "true";
    } else {
      return "false";
    }
  }

  calculateDamage() {
    const isCritical = Math.random() < 0.1;

    if (isCritical) {
      return this.critical;
    } else {
      return Phaser.Math.Between(this.minDmg, this.maxDmg);
    }
  }

  getDmg() {
    const damage = this.calculateDamage();
    return damage;
  }

  walkBack(spawn, player) {
    const distance = this.getDistance(spawn.x, spawn.y);
    const angle = this.getAngle(spawn.x, spawn.y);

    this.sprite.body.velocity.x = Math.cos(angle) * this.speed;
    this.sprite.body.velocity.y = Math.sin(angle) * this.speed;

    this.playWalkAnimation(spawn);

    if (distance < 4) {
      this.sprite.setVelocity(0, 0);
      this.playIdleAnimation(player);
    }
  }

  playAttackAnimation(player) {
    this.sprite.anims.play("attackE", true);
    if (player.x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playWalkAnimation(player) {
    this.sprite.anims.play("walkE", true);
    if (player.x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playIdleAnimation(player) {
    this.sprite.setVelocity(0, 0);
    this.sprite.anims.play("idleE", true);

    if (player.x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playHurtAnimation(player) {
    this.sprite.anims.play("hurtE", true);
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
  getSprite() {
    return this.sprite;
  }
}
