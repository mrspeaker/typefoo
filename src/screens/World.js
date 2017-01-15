const Phaser = window.Phaser;

import Proto from "../protos/Proto1";

class World {

  preload ( game ) {
    const { load } = game;
    load.image("tiles", "res/dwarf.png");
    load.tilemap("map", "res/collision_test.json", null, Phaser.Tilemap.TILED_JSON);
    load.image("ground_1x1", "res/ground_1x1.png");
    load.image("phaser", "res/phaser-dude.png");

  }

  create ( game ) {
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    const map = this.map = game.add.tilemap("map");
    map.addTilesetImage("ground_1x1");
    const layer = this.layer = map.createLayer("Tile Layer 1");
    layer.resizeWorld();
    map.setCollisionBetween(1, 12);

    const sprite = this.sprite = game.add.sprite(260, 70, "phaser");
    game.physics.enable(sprite);

    //sprite.body.bounce.set(0.6);
    sprite.body.drag = 50;
    sprite.body.tilePadding.set(32);

    game.camera.follow(sprite);
    game.physics.arcade.gravity.y = 200;
    this.cursors = game.input.keyboard.createCursorKeys();

    Proto.create(game, map.width, map.height);


    this.reset();
    this.bindInput();
  }

  reset () {
    const { game } = this;
    game.stage.backgroundColor = 0x0;
  }

  bindInput () {
    const { game, sprite } = this;

    game.input.keyboard.onDownCallback = ({keyCode}) => {
      //console.log(keyCode);
      Proto.move(keyCode, sprite);
    };
  }

  update (game) {
    const {cursors, sprite, layer} = this;
    game.physics.arcade.collide(sprite, layer);

    Proto.update(game, sprite);

    sprite.body.velocity.x *= 0.99;
    //sprite.body.velocity.y = 0;

    const spd = 150;

    if (cursors.up.isDown) {
      sprite.body.velocity.y = -spd;
    }
    else if (cursors.down.isDown) {
      sprite.body.velocity.y = spd;
    }

    if (cursors.left.isDown) {
      sprite.body.velocity.x = -spd;
    }
    else if (cursors.right.isDown) {
      sprite.body.velocity.x = spd;
    }
  }

  render (game) {

  }


}

module.exports = World;
