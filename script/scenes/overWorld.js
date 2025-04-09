import Player from "../models/player.js";

export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super("OverworldScene");
  }

  preload() {
    this.load.tilemapTiledJSON("map", "../../assets/maps/startMap..tmj");
    this.load.image("dungeonTiles", "../../assets/maps/Set1.png");

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
      "../../assets/objectSprites/tworchSprite.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );
    this.load.spritesheet(
      "vase",
      "../../assets/objectSprites/VaseShineAnim.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("dungeonTiles", "dungeonTiles");
    this.textures
      .get("dungeonTiles")
      .setFilter(Phaser.Textures.FilterMode.NEAREST);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    const groundLayer = map.createLayer("floorAndWalls", tileset);
    const pillarLayer = map.createLayer("pillars", tileset);
    const upperPillarLayer = map.createLayer("pillarsOver", tileset);
    upperPillarLayer.setDepth(10);
    groundLayer.setCollisionByProperty({ collides: true });
    pillarLayer.setCollisionByProperty({ collides: true });

    const camera = this.cameras.main;
    this.cameras.main.roundPixels = true;
    camera.setZoom(4);

    camera.setBounds(0, 0, mapWidth, mapHeight);

    const spawnPoint = map.findObject(
      "spawnPoints",
      (obj) => obj.name === "playerSpawn",
    );

    this.player = new Player(this, spawnPoint.x, spawnPoint.y, "player");
    this.player.getSprite().setDepth(2);
    camera.startFollow(this.player.getSprite());

    console.log("Player position:", this.player.x, this.player.y);
    console.log("Camera position:", camera.scrollX, camera.scrollY);

    this.physics.add.collider(this.player.getSprite(), groundLayer);
    this.physics.add.collider(this.player.getSprite(), pillarLayer);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.player.getSprite().body.setCollideWorldBounds(true);

    this.potions = this.physics.add.group();
    this.torches = this.physics.add.staticGroup();
    this.torches.setDepth(1);
    this.vasese = this.physics.add.group();
    this.physics.add.collider(this.player.getSprite(), this.vasese);
    this.physics.add.collider(this.vasese, groundLayer);
    this.physics.add.collider(this.vasese, pillarLayer);

    map.getObjectLayer("objects").objects.forEach((obj) => {
      console.log(obj);
      if (obj.type === "item") {
        if (obj.name === "healthPotion") {
          this.potions.create(obj.x, obj.y - obj.height, "healthPotionSprite");
        } else if (obj.name == "manaPotion") {
          this.potions.create(obj.x, obj.y - obj.height, "manaPotionSprite");
        }
      }
    });

    this.anims.create({
      key: "torch-flicker",
      frames: this.anims.generateFrameNumbers("torchSprite", {
        start: 0,
        end: 7,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "vase-shine",
      frames: this.anims.generateFrameNumbers("vase", {
        start: 0,
        end: 15,
      }),
      frameRate: 8,
      repeat: -1,
    });

    map.getObjectLayer("decor").objects.forEach((obj) => {
      if (obj.type === "torch") {
        const torch = this.torches.create(
          obj.x,
          obj.y - obj.height,
          "torchSprite",
        );
        torch.anims.play("torch-flicker", true);
      }
      if (obj.type === "vase") {
        const vase = this.vasese.create(obj.x, obj.y - obj.height, "vase");
        vase.anims.play("vase-shine", true);
        vase.body.setCollideWorldBounds(true);
      }
    });

    this.physics.add.overlap(
      this.player.getSprite(),
      this.potions,
      this.collectPotion,
      null,
      this,
    );
  }

  update() {
    this.player.update();
  }

  collectPotion(player, potion) {
    potion.destroy();
    console.log("Took: " + potion.Name);
  }
}
