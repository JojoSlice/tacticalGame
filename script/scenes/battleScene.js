class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
    this.player;
    this.enemy;
    this.turn = "player"; // Turordning: spelaren börjar
  }

  preload() {
    this.load.image("view", "../../assets/sideView/testSideView.png");

    this.load.spritesheet(
      "player",
      "../../assets/characterSprites/Tiny RPG Character Asset Pack v1.03 -Free Soldier&Orc/Characters(100x100)/Soldier/Soldier with shadows/Soldier.png",
      { frameWidth: 100, frameHeight: 100 },
    );

    this.load.spritesheet(
      "enemy",
      "../../assets/characterSprites/Tiny RPG Character Asset Pack v1.03 -Free Soldier&Orc/Characters(100x100)/Orc/Orc with shadows/Orc.png",
      { frameWidth: 100, frameHeight: 100 },
    );
  }

  create() {
    this.add.image(0, 0, "view").setOrigin(0, 0);

    this.player = this.createPlayer(100, 300);
    this.enemy = this.createEnemy(600, 300);

    this.createUI();

    this.input.on("pointerdown", this.handlePlayerTurn, this);
  }

  update() {
    if (this.turn === "enemy") {
      this.enemyTurn();
    }
  }

  createPlayer(x, y) {
    let playerSprite = this.physics.add.sprite(x, y, "player");
    playerSprite.setCollideWorldBounds(true);
    return playerSprite;
  }

  createEnemy() {
    let enemySprite = this.physics.add.sprite(x, y, "enemy");
    enemySprite.setCollideWorldBounds(true);
    return enemySprite;
  }

  createUI() {
    this.playerHealthBar = this.add.graphics();
    this.enemyHealthBar = this.add.graphics();
  }

  handlePlayerTurn(pointer) {
    if (this.turn !== "player") return;

    this.playerAttack();
    this.turn = "enemy";
  }

  playerAttack() {
    let damage = 10;
    this.enemyHealth -= damage;
    this.updateHealthUI();

    this.anims.play("attack");

    if (this.enemyHealth <= 0) {
      this.endBattle("win");
    } else {
      this.turn = "enemy";
    }
  }

  enemyTurn() {
    let damage = 10;
    this.playerHealth -= damage;
    this.updateHealthUI();

    this.enemy.anims.play("attack");

    if (this.playerHealth <= 0) {
      this.endBattle("lose");
    } else {
      this.turn = "player";
    }
  }

  updateHealthUI() {
    this.playerHealthBar.clear();
    this.enemyHealthBar.clear();
    this.playerHealthBar.fillStyle(0x00ff00, 1);
    this.enemyHealthBar.fillStyle(0xff0000, 1);

    this.playerHealthBar.fillRect(50, 50, this.playerHealth, 20);
    this.enemyHealthBar.fillRect(450, 50, this.enemyHealth, 20);
  }

  endBattle(result) {
    if (result === "win") {
      console.log("You won the battle!");
    } else if (result === "lose") {
      console.log("You lost the battle!");
    }

    // Återgå till den tidigare scenen, eller visa en battle-over-skärm
    this.scene.start("PreviousScene");
  }
}
