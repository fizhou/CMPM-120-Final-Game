class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("tilemap", "monochrome_tilemap_packed.png");
        this.load.tilemapTiledJSON("level-one", "level-one.tmj");

        this.load.spritesheet("tilemap_sheet", "monochrome_tilemap_transparent_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', {
                start: 261,
                end: 264
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: "tilemap_sheet", frame: 260 }],
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: "tilemap_sheet", frame: 264 }],
            frameRate: 1
        });

         this.scene.start("platformerScene");
    }

    update() {
    }
}