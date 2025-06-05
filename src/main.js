// Fiona Zhou & Alyssa Zhang
// Created: 6/3/2025
// Phaser: 3.70.0
//
// CMPM 120 FINAL GAME
//
// 
// Art assets from Kenny Assets "1-Bit Platformer Pack" set:
// https://kenney.nl/assets/1-bit-platformer-pack

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        debug: false,
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Load, Platformer]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);