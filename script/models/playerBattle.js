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
      repeat: 0,
    });
  }
  update() {}

  walkUp(x, y) {
    const distance = this.getDistance(x, y);
    const angle = this.getAngle(x, y);

    this.sprite.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed,
    );
    this.playWalkAnimation(x);

    console.log(distance);
    if (distance <= this.attackRange) {
      this.sprite.setVelocity(0, 0);
      return true;
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

  takeDamage(damage, x) {
    this.health -= damage;
    this.playHurtAnimation(x);
  }

  isDead() {
    if (this.health <= 0) {
      return "true";
    } else {
      return "false";
    }
  }

  getHealth() {
    return this.health;
  }

  getDmg() {
    const damage = this.calculateDamage();
    return damage;
  }

  walkBack(spawn, x) {
    const distance = this.getDistance(spawn.x, spawn.y);
    const angle = this.getAngle(spawn.x, spawn.y);

    this.sprite.body.velocity.x = Math.cos(angle) * this.speed;
    this.sprite.body.velocity.y = Math.sin(angle) * this.speed;

    this.playWalkAnimation(spawn);

    if (distance < 4) {
      this.sprite.setVelocity(0, 0);
      this.playIdleAnimation(x);
      debugger;
    }
  }

  playAttackAnimation(x) {
    console.log("attack animation");
    this.sprite.anims.play("attack", true);
    if (x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playWalkAnimation(x) {
    this.sprite.anims.play("walk", true);
    if (x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playIdleAnimation(x) {
    this.sprite.setVelocity(0, 0);
    this.sprite.anims.play("idle", true);

    if (x < this.sprite.x) {
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setFlipX(false);
    }
  }

  playHurtAnimation(x) {
    this.sprite.anims.play("hurt", true);
    if (x < this.sprite.x) {
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
