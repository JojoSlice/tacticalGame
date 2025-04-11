import Player from "../models/testPlayer.js";
import Enemy from "../models/testEnemy.js";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
    this.player;
    this.enemy;
    this.turn = "player";
  }

  preload() {
    this.load.tilemapTiledJSON("map", "../../assets/maps/sidescroll..tmj");

    this.load.image("tileset", "../../assets/maps/Tilesetv3.png");

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
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("Tilesetv3", "tileset");
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

    this.enemy = new Enemy(this, this.enemySpawn.x, this.enemySpawn.y, "enemy");
    this.enemy.sprite.play("idleE").setFlipX(true);

    this.physics.add.collider(this.enemy.sprite, floorLayer);
    this.enemy.sprite.body.setCollideWorldBounds(true);

    this.playerHealthBar = this.add.graphics();
    this.enemyHealthBar = this.add.graphics();
  }

  update() {
    this.updateHealthUI();
    if (this.turn === "player") {
      this.time.delayedCall(2000, () => this.playerAttack());
    }
  }

  playerAttack() {
    if (this.turn !== "player") return;

    const damage = this.calculateDamage(this.player);
    this.player.sprite.play("attack");

    this.player.sprite.once("animationcomplete", () => {
      this.player.sprite.play("idle");
      this.enemy.health -= damage;
      this.enemy.sprite.play("hurtE");
      this.showFloatingText(this.enemy.sprite.x, this.enemy.sprite.y, damage);
    });

    if (this.enemy.health <= 0) {
      debugger;
    }

    this.turn = "enemy";

    this.time.delayedCall(2000, () => this.enemyAttack());
  }

  enemyAttack() {
    if (this.turn !== "enemy") return;

    const damage = this.calculateDamage(this.enemy);
    this.enemy.sprite.play("attackE");

    this.enemy.sprite.once("animationcomplete", () => {
      this.enemy.sprite.play("idleE");
      this.player.health -= damage;
      this.player.sprite.play("hurt");
      this.showFloatingText(this.player.sprite.x, this.player.sprite.y, damage);
    });

    if (this.player.health <= 0) {
      debugger;
    }

    this.turn = "player";
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

    this.playerHealthBar.fillRect(
      this.player.sprite.x - this.player.health / 2,
      this.player.sprite.y + 40,
      this.player.health,
      5,
    );
    this.enemyHealthBar.fillRect(
      this.enemy.sprite.x - this.enemy.health / 2,
      this.enemy.sprite.y + 40,
      this.enemy.health,
      5,
    );
  }

  showFloatingText(x, y, text) {
    const damageText = this.add.text(x, y - 20, text, {
      font: "18px Arial",
      fill: "#ff0000",
      stroke: "#000",
      strokeThickness: 2,
    });

    this.tweens.add({
      targets: damageText,
      y: y - 30,
      alpha: 0,
      duration: 800,
      ease: "Power1",
      onComplete: () => {
        damageText.destroy();
      },
    });
  }
}
