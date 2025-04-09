import Player from '../models/player.js';


export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super("OverworldScene");
  }

  preload() {
    this.load.image("tileset", "../../assets/maps/Set1.png");
    this.load.tilemapTiledJSON("map", "../../assets/maps/startMap..tmj");
    this.load.spritesheet(
      "player",
      "../../assets/characterSprites/player/Sword_Walk/Sword_Walk_full.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      },
    );
    this.load.spritesheet(
      "playerIdle",
      "../../assets/characterSprites/player/Sword_Idle/Sword_Idle_full.png",
      { frameHeight: 64, frameWidth: 64 },
    );
    this.load.image(
      "healthPotionSprite",
      "../../assets/objectSprites/Potion 2.png",
    );
    this.load.image(
      "manaPotionSprite",
      "../../assets/objectSprites/Potion 4.png",
    );
    this.load.spritesheet(
      "torchSprite",
      "../../assets/objectSprites/Torch Yellow.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tileset", "tileset");

    const groundLayer = map.createLayer("floorAndWalls", tileset);
    const pillarLayer = map.createLayer("pillars", tileset);
    groundLayer.setCollisionByProperty({ collides: true });
    pillarLayer.setCollisionByProperty({ collides: true });


    const spawnPoint = map.findObject(
      "spawnPoints",
      (obj) => obj.name === "playerSpawn",
    );

    this.player = new Player(this, spawnPoint.x, spawnPoint.y, "player");

    this.physics.add.collider(this.player.getSprite(), groundLayer);
    this.physics.add.collider(this.player.getSprite(), pillarLayer);

    this.potions = this.physics.add.group();
    this.torches = this.physics.add.staticGroup();

    map.getObjectLayer("objects").objects.forEach((obj) => {
      if (obj.itemType === "potion") {
        if (obj.name === "healthPotion") {
          this.healthPotions.create(
            obj.x,
            obj.y - obj.height,
            "healthPotionSprite",
          );
        } else if (obj.name == "manaPotion") {
          this.manaPotions.create(
            obj.x,
            obj.y - obj.height,
            "manaPotionSprite",
          );
        }
      } else if (obj.type === "torch") {
        const torch = this.torches.create(obj.x, obj.y - obj.height, "torchSprite");
        torch.anims.play('torch-flicker'):
      }
    });

    this.physics.add.overlap(
      this.player,
      this.potions,
      this.collectPotion,
      null,
      this,
    );

    this.anims.create({
      key: "torch-flicker",
      frames: this.anims.generateFrameNumbers("torchSprite", {
        start: 0,
        end: 7,
      }),
      frameRate: 6,
      repeat: -1,
    });
  }

  update() {
    this.player.update();
  }

  collectPotion(player, potion) {
    potion.destroy();
    console.log("Took: " + potion.Name);
  }
}
