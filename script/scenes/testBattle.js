import Player from "../models/testPlayer.js";
import Enemy from "../models/testEnemy.js";
import UI from "../models/battleUI.js";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
    this.ui;
    this.player;
    this.enemy;
    this.turn = "player";
  }

  init(data) {
    this.mainSceneKey = data.mainSceneKey;
  }

  preload() {
    this.load.tilemapTiledJSON("battlemap", "../../assets/maps/sidescroll.tmj");

    this.load.image("battletileset", "../../assets/maps/Tilesetv3.png");

    this.load.spritesheet(
      "player",
      "../../assets/characterSprites/Tiny RPG Character Asset Pack v1.03 -Free Soldier&Orc/Characters(100x100)/Soldier/Soldier/Soldier.png",
      { frameWidth: 100, frameHeight: 100 },
    );

    this.load.spritesheet(
      "enemy",
      "../../assets/characterSprites/Tiny RPG Character Asset Pack v1.03 -Free Soldier&Orc/Characters(100x100)/Orc/Orc/Orc.png",
      { frameWidth: 100, frameHeight: 100 },
    );
  }

  create() {
    const map = this.make.tilemap({ key: "battlemap" });
    const tileset = map.addTilesetImage("Tilesetv3", "battletileset");
    this.textures
      .get("Tilesetv3")
      .setFilter(Phaser.Textures.FilterMode.NEAREST);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    const backLayer = map.createLayer("wallback", tileset);
    const middleLayer = map.createLayer("wallmiddle", tileset);
    const frontLayer = map.createLayer("wallfront", tileset);
    const floorLayer = map.createLayer("floor", tileset);
    floorLayer.setCollisionByProperty({ collide: true });

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    this.cameraPoint = map.findObject(
      "cameraPoints",
      (obj) => obj.name === "middle",
    );

    this.playerSpawn = map.findObject(
      "spawnPoints",
      (obj) => obj.name === "playerSpawn",
    );
    this.enemySpawn = map.findObject(
      "spawnPoints",
      (obj) => obj.name === "enemySpawn",
    );

    this.cameras.main.startFollow(this.cameraPoint);
    this.cameras.main.setZoom(4);

    this.player = new Player(
      this,
      this.playerSpawn.x,
      this.playerSpawn.y,
      "player",
    );
    this.player.sprite.play("idle");

    this.physics.add.collider(this.player.sprite, floorLayer);
    this.player.sprite.body.setCollideWorldBounds(true);

    this.ui = new UI(this, this.playerSpawn.x, this.playerSpawn.y + 60, {
      attack: () => {
        console.log("Attack valdes");
        this.ui.hide();
        this.playerAttack();
      },
      defend: () => {
        console.log("Defend valdes");
        this.ui.hide();
      },
      item: () => {
        console.log("Item valdes");
        this.ui.hide();
      },
    });

    this.enemy = new Enemy(this, this.enemySpawn.x, this.enemySpawn.y, "enemy");
    this.enemy.sprite.play("idleE").setFlipX(true);

    this.physics.add.collider(this.enemy.sprite, floorLayer);
    this.enemy.sprite.body.setCollideWorldBounds(true);

    this.playerHealthBar = this.add.graphics();
    this.enemyHealthBar = this.add.graphics();

    this.delay = 1500;
    this.waitingForAttack = false;
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  update() {
    this.updateHealthUI();

    if (this.turn === "player" && !this.waitingForAttack) {
      this.waitingForAttack = true;
      this.time.delayedCall(this.delay, () => this.ui.show());
    }
  }

  playerAttack() {
    if (this.turn !== "player") return;

    this.delay = 1500;

    const damage = this.calculateDamage(this.player);
    const isCritical = damage === this.player.critical;

    this.player.sprite.play("attack");

    this.player.sprite.once("animationcomplete", () => {
      this.player.sprite.play("idle");
      this.enemy.health -= damage;
      console.log(this.enemy.health);
      this.enemy.sprite.play("hurtE");

      console.log(this.enemy.health);

      let text = damage.toString();
      if (isCritical) {
        this.delay = 3000;
        text += " CRITICAL";
      }

      this.showFloatingText(
        this.enemy.sprite.x - text.length * 8,
        this.enemy.sprite.y,
        text,
        isCritical,
      );
      if (this.enemy.health <= 0) {
        this.enemy.sprite.play("deathE");
        this.enemy.sprite.once("animationcomplete", () =>
          this.battleEnd("You Win"),
        );
      } else {
        this.turn = "enemy";
        this.time.delayedCall(this.delay, () => this.enemyAttack());
      }
    });
  }

  enemyAttack() {
    if (this.turn !== "enemy") return;

    this.delay = 1500;

    const damage = this.calculateDamage(this.enemy);
    this.enemy.sprite.play("attackE");

    this.enemy.sprite.once("animationcomplete", () => {
      this.enemy.sprite.play("idleE");
      this.player.health -= damage;
      this.player.sprite.play("hurt");
      this.player.sprite.once("animationcomplete", () =>
        this.player.sprite.play("idle"),
      );

      const isCritical = damage === this.enemy.critical;
      let text = damage.toString();

      if (isCritical) {
        this.delay = 3000;
        text += " CRITICAL";
      }

      this.showFloatingText(
        this.player.sprite.x - text.length * 8,
        this.player.sprite.y,
        text,
        isCritical,
      );
      if (this.player.health <= 0) {
        this.player.sprite.play("death");
        this.player.sprite.once("animationcomplete", () =>
          this.battleEnd("You Lose"),
        );
      } else {
        this.turn = "player";
        this.waitingForAttack = false;
      }
    });
  }

  battleEnd(text) {
    this.showFloatingText(
      this.cameraPoint.x - 50,
      this.cameraPoint.y,
      text,
      true,
    );
    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.stop();
        this.scene.resume(this.mainSceneKey);
      });
    });
  }

  calculateDamage(attacker) {
    const isCritical = Math.random() < 0.1;

    if (isCritical) {
      return attacker.critical;
    } else {
      return Phaser.Math.Between(attacker.minDmg, attacker.maxDmg);
    }
  }

  updateHealthUI() {
    this.playerHealthBar.clear();
    this.enemyHealthBar.clear();
    this.playerHealthBar.fillStyle(0x00ff00, 1);
    this.enemyHealthBar.fillStyle(0xff0000, 1);

    const playerHealthPercent = this.player.health / this.player.maxHealth;
    const enemyHealthPercent = this.enemy.health / this.enemy.maxHealth;

    if (this.player.health > 0) {
      this.playerHealthBar.fillRect(
        this.player.sprite.x - this.player.health / 2,
        this.player.sprite.y - 40,
        100 * playerHealthPercent,
        5,
      );
    }
    if (this.enemy.health > 0) {
      this.enemyHealthBar.fillRect(
        this.enemy.sprite.x - this.enemy.health / 2,
        this.enemy.sprite.y - 40,
        100 * enemyHealthPercent,
        5,
      );
    }
  }

  showFloatingText(x, y, text, isCritical = false) {
    const damageText = this.add.text(x, y - 30, text, {
      font: isCritical ? "24px Arial Black" : "18px Arial",
      fill: isCritical ? "#ffd700" : "#ff0000", // guld för critical
      stroke: "#000",
      strokeThickness: 3,
    });

    const tweenConfig = {
      targets: damageText,
      y: y - 30,
      alpha: 0,
      duration: 1500,
      ease: "Power1",
      onComplete: () => {
        damageText.destroy();
      },
    };

    if (isCritical) {
      this.tweens.add({
        ...tweenConfig,
        scale: 1.5,
        yoyo: true,
        repeat: 0,
      });
    } else {
      this.tweens.add(tweenConfig);
    }
  }
}
