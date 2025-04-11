import Player from "../models/playerBattle.js";
import Enemy from "../models/enemyBattle.js";

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

    this.player = new Player(
      this,
      this.playerSpawn.x,
      this.playerSpawn.y,
      "player",
    );

    this.physics.add.collider(this.player.getSprite(), floorLayer);
    this.player.getSprite().body.setCollideWorldBounds(true);

    this.enemy = new Enemy(this, this.enemySpawn.x, this.enemySpawn.y, "enemy");

    this.physics.add.collider(this.enemy.getSprite(), floorLayer);
    this.enemy.getSprite().body.setCollideWorldBounds(true);

    // Skapa en dummy sprite för kameran att följa
    const camera = this.cameras.main;
    this.cameras.main.roundPixels = true;
    camera.setZoom(5);
    camera.centerOn(119, 150);
    // Använd setFollow för att följa dummy

    this.createUI();
  }

  update() {
    const player = this.player.getSprite();
    const enemy = this.enemy.getSprite();

    // Beräkna mitten mellan spelaren och fienden
    const midX = (player.x + enemy.x) / 2;
    const midY = (player.y + enemy.y) / 2;
    this.cameras.main.x = 119;
    this.cameras.main.y = 150;
    // Uppdatera dummy sprite till mitten mellan spelaren och fienden

    this.player.playHurtAnimation(this.enemy.getSprite());
    this.enemy.playHurtAnimation(this.player.getSprite());
    //if (this.turn === "enemy") {
    //console.log("enemy turn");
    //this.enemyTurn();
    //} else if (this.turn === "player") {
    //console.log("player turn");
    //this.playerTurn();
    // }
  }

  createUI() {
    this.playerHealthBar = this.add.graphics();
    this.enemyHealthBar = this.add.graphics();
  }

  playerTurn() {
    this.playerAttack();
  }

  playerAttack() {
    console.log("player attack");
    const enemySprite = this.enemy.getSprite();

    const damage = this.player.getDmg();
    this.player.attackAction(enemySprite);

    this.enemy.takeDamage(damage, this.player);
    this.showFloatingText(enemySprite.x, enemySprite.y, damage);
    this.updateHealthUI();

    if (this.enemy.isDead() === "true") {
      this.endBattle("win");
    } else {
      this.player.walkBack(this.playerSpawn, this.enemy);
      this.turn = "enemy";
    }
  }

  enemyTurn() {
    const playerSprite = this.player.getSprite();

    const damage = this.enemy.getDmg();
    this.enemy.attackAction(this.player);

    this.player.takeDamage(damage, this.enemy);
    this.showFloatingText(playerSprite.x, playerSprite.y, damage);
    this.updateHealthUI();

    if (this.player.isDead() === "true") {
      this.endBattle("lose");
    } else {
      this.enemy.walkBack(this.enemySpawn, this.player);
      this.turn = "player";
    }
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

  updateHealthUI() {
    this.playerHealthBar.clear();
    this.enemyHealthBar.clear();
    this.playerHealthBar.fillStyle(0x00ff00, 1);
    this.enemyHealthBar.fillStyle(0xff0000, 1);

    this.playerHealthBar.fillRect(50, 50, this.player.health, 20);
    this.enemyHealthBar.fillRect(450, 50, this.enemy.health, 20);
  }

  endBattle(result) {
    if (result === "win") {
      this.showFloatingText(this.cameraPoint.x, this.cameraPoint.y, "Win!");
    } else if (result === "lose") {
      this.showFloatingText(this.cameraPoint.x, this.cameraPoint.y, "Lose!");
    }

    this.scene.start("PreviousScene");
  }
}
