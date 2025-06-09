class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        this.ACCELERATION = 200;
        this.DRAG = 150;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;

        this.hasGravityPower = false;
        this.gravityMode = "Up";
    }

    create() {
        this.map = this.add.tilemap("level-one", 16, 16, 60, 30);
        this.tileset = this.map.addTilesetImage("monochrome_tilemap_packed", "tilemap");

        this.groundLayer = this.map.createLayer("Grounds-n-Platform", this.tileset, 0, 0);
        this.groundLayer.setScale(2.0);

        this.decorLayer = this.map.createLayer("Decoration", this.tileset, 0, this.groundLayer.y);
        this.decorLayer.setScale(2.0);

        this.physics.world.setBounds(
            0,
            this.groundLayer.y,
            this.map.widthInPixels * this.groundLayer.scaleX,
            this.map.heightInPixels * this.groundLayer.scaleY
        );

        this.physics.world.gravity.y = 1200;
        this.JUMP_VELOCITY = -650; 

        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        my.sprite.player = this.physics.add.sprite(125, 14 * 18 * 2, "tilemap_sheet", 0).setScale(2.0);

        this.gravityItem = this.map.createFromObjects("Object", {
            name: "gravity",
            key: "tilemap_sheet",
            frame: 102
        });

        this.gravityItem.forEach(obj => {
            obj.setScale(2.0);
            obj.setOrigin(0.5, 0.5);
            obj.x *= 2;
            obj.y *= 2;
        });

        this.gravityItemGroup = this.physics.add.staticGroup();
        this.gravityItem.forEach(obj => {
            this.gravityItemGroup.add(obj);
        });

        this.physics.add.overlap(my.sprite.player, this.gravityItemGroup, (player, gravityObj) => {
            this.hasGravityPower = true;
            gravityObj.destroy();
        }, null, this);

        this.checkpointItem = this.map.createFromObjects("Object", {
            name: "checkpoint",
            key: "tilemap_sheet",
            frame: 59
        });

        this.checkpointItem.forEach(obj => {
            obj.setScale(2.0);
            obj.setOrigin(0.5, 0.5);
            obj.x *= 2;
            obj.y *= 2;
        });

        this.checkpointItemGroup = this.physics.add.staticGroup();
        this.checkpointItem.forEach(obj => {
            this.checkpointItemGroup.add(obj);
        });

        this.physics.add.overlap(my.sprite.player, this.checkpointItemGroup, () => {
            this.scene.start("platformerScene2");
        }, null, this);

        my.sprite.player.setCollideWorldBounds(true);

        this.physics.add.collider(my.sprite.player, this.groundLayer);

        this.cameras.main.setBounds(
            0,
            this.groundLayer.y,
            this.map.widthInPixels * this.groundLayer.scaleX,
            this.map.heightInPixels * this.groundLayer.scaleY
        );

        this.cameras.main.startFollow(my.sprite.player);

        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R'); // reset
        this.QKey = this.input.keyboard.addKey('Q'); // down
        this.EKey = this.input.keyboard.addKey('E'); // up

        my.vfx = {};
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_04.png', 'smoke_05.png'],
            scale: { start: 0.03, end: 0.1 },
            lifespan: 300,
            alpha: { start: 1, end: 0.1 }
        });
        my.vfx.walking.stop();
    }

    update() {
        if (this.hasGravityPower && Phaser.Input.Keyboard.JustDown(this.QKey)) {
            if (this.gravityMode === "Down") {
                this.gravityMode = "Up";
                this.physics.world.gravity.y = 1000;
                this.JUMP_VELOCITY = -500;
                this.sound.play("stop", {
                    volume: 1 
                });
                my.sprite.player.setFlipY(false);
            }
        }

        if (this.hasGravityPower && Phaser.Input.Keyboard.JustDown(this.EKey)) {
            if (this.gravityMode === "Up") {
                this.gravityMode = "Down";
                this.physics.world.gravity.y = -1000;
                this.JUMP_VELOCITY = 500;
                this.sound.play("start", {
                    volume: 1 
                });
                my.sprite.player.setFlipY(true);
            }
        }

        if (cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlipX(true);
            my.sprite.player.anims.play('walk', true);

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-0, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlipX(false);
            my.sprite.player.anims.play('walk', true);

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-30, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');

            my.vfx.walking.stop();
        }

        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }

        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.sound.play("boing", {
                volume: 1 
            });
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}