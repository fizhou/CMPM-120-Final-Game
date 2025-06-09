class Ending extends Phaser.Scene {
    constructor() {
        super("endingScreen");
    }

    create() {
        this.levelCompleteText = this.add.bitmapText(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "rocketSquare",
            "GAME BEAT!"
        ).setOrigin(0.5)
         .setScale(1.2);

        this.time.delayedCall(3000, () => {
            this.scene.start("titleScreen");
        });
    }

    update() {
        
    }
}