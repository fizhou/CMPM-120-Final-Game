class Title extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    init() {
        this.ACCELERATION = 200;
        this.DRAG = 300;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;

        this.hasGravityPower = false;
        this.gravityMode = "Up";
    }

    create() {
        this.map = this.add.tilemap("lobby", 16, 16, 60, 30);
        this.tileset = this.map.addTilesetImage("monochrome_tilemap_packed", "tilemap");

        this.groundLayer = this.map.createLayer("Lobby", this.tileset, 0, 0);
        this.groundLayer.setScale(2.0);
        
        this.detailLayer = this.map.createLayer("Lobbydeco", this.tileset, 0, 0);
        this.detailLayer.setScale(2.0);

        const centerX = this.cameras.main.centerX;

        my.text.title = this.add.bitmapText(centerX, 100, "rocketSquare", "Gravitator").setOrigin(0.5).setScale(1.2);
        my.text.desc1 = this.add.bitmapText(centerX, 135, "rocketSquare", "E to activate artifact").setOrigin(0.5).setScale(0.8);
        my.text.desc2 = this.add.bitmapText(centerX, 160, "rocketSquare", "Q to deactivate artifact").setOrigin(0.5).setScale(0.8);
        my.text.desc2 = this.add.bitmapText(centerX, 185, "rocketSquare", "R to restart").setOrigin(0.5).setScale(0.8);
        my.text.desc2 = this.add.bitmapText(centerX, 215, "rocketSquare", "< > ^ to move").setOrigin(0.5).setScale(0.8);
        my.text.desc3 = this.add.bitmapText(centerX, 245, "rocketSquare", "Press P to play").setOrigin(0.5).setScale(0.7);

        this.physics.world.setBounds(
            0,
            this.groundLayer.y,
            this.map.widthInPixels * this.groundLayer.scaleX,
            this.map.heightInPixels * this.groundLayer.scaleY
        );

        this.physics.world.gravity.y = 500;
        this.JUMP_VELOCITY = -250; 

        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        my.sprite.player = this.physics.add.sprite(50 * 2, 14 * 18 * 2, "tilemap_sheet", 0).setScale(2.0);

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
            this.sound.play("blip", {
                volume: 1 
            });
            this.add.particles(0, 0, 'kenny-particles', {
                frame: 'star_06.png',
                x: gravityObj.x,
                y: gravityObj.y,
                duration: 20,
                scale: { start: 0.1, end: 0 }
            });
            gravityObj.destroy();
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

        this.levelCompleteText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'LEVEL COMPLETE!', {
            fontSize: '48px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setVisible(false);


        cursors = this.input.keyboard.createCursorKeys();

        this.PKey = this.input.keyboard.addKey('P'); // play
        this.QKey = this.input.keyboard.addKey('Q'); // down
        this.EKey = this.input.keyboard.addKey('E'); // up

        my.vfx = {};
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_04.png', 'smoke_05.png'],
            scale: { start: 0.02, end: 0.05 },
            lifespan: 300,
            alpha: { start: 1, end: 0.1 }
        });
        my.vfx.walking.stop();
    }

    update() {
        if (this.hasGravityPower && Phaser.Input.Keyboard.JustDown(this.QKey)) {
            if (this.gravityMode === "Down") {
                this.gravityMode = "Up";
                this.physics.world.gravity.y = 500;
                this.JUMP_VELOCITY = -250;
                this.sound.play("stop", {
                    volume: 1 
                });
                my.sprite.player.setFlipY(false);
            }
        }

        if (this.hasGravityPower && Phaser.Input.Keyboard.JustDown(this.EKey)) {
            if (this.gravityMode === "Up") {
                this.gravityMode = "Down";
                this.physics.world.gravity.y = -500;
                this.JUMP_VELOCITY = 250;
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

        if(Phaser.Input.Keyboard.JustDown(this.PKey)) {
            this.scene.start("platformerScene")
        }
    }
}