const Phaser = window.Phaser;

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

    this.createMap(game, map.width, map.height);

    //const l2 = map.createLayer("Tile Layer 2");


    this.reset();
    this.bindInput();
  }

  createMap (game, w, h) {

    this.letters = Array.from(new Array(h), () => {
      return Array.from(new Array(w), () => {
        return game.rnd.between(65, 65+25);
      });
    });
    const data = this.letters.reduce((str, el) => {
      return str + el.join(",") + "\n";
    }, "");

    game.cache.addTilemap("dynamicMap", null, data, Phaser.Tilemap.CSV);
    const map = game.add.tilemap("dynamicMap", 32, 32);
    map.addTilesetImage("tiles", "tiles", 16, 16);
    const layer = map.createLayer(0);
    //layer.resizeWorld();
    layer.cameraOffset.x = 8;
    layer.cameraOffset.y = 8;

    const mask = game.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawCircle(0, 0, 280);
    layer.mask = mask;
    this.mask = mask;
  }

  reset () {
    const { game } = this;
    game.stage.backgroundColor = 0x94D7ED;
  }

  bindInput () {
    const { game, sprite } = this;

    game.input.keyboard.onDownCallback = ({keyCode, key}) => {
      //console.log(keyCode);

      // Get letters around...
      const xt = Math.round(sprite.position.x / 32);
      const yt = Math.round(sprite.position.y / 32);


      const left = this.letters[yt][xt - 1];
      const right = this.letters[yt][xt + 1];
      const jump = this.letters[yt - 1][xt];
      const upleft = this.letters[yt - 1][xt - 1];
      const upright = this.letters[yt - 1][xt + 1];

      const spd = 50;

      if (keyCode === left) {
        //sprite.body.velocity.x += -spd;
        sprite.position.x = (xt - 1) * 32;
      }
      else if (keyCode === right) {
        //sprite.body.velocity.x += spd;
        sprite.position.x = (xt + 1) * 32;
      }
      else if (keyCode === jump || keyCode === upleft || keyCode === upright) {
        this.sprite.body.velocity.y += -spd * 3;
        if (keyCode === jump) {}
        else if (keyCode === upleft) {
          this.sprite.body.velocity.x -= spd * 2;
        }
        else if (keyCode === upright) {
          this.sprite.body.velocity.x += spd * 2;
        }
      }

    };
  }

  update (game) {
    const {cursors, sprite, layer, mask} = this;
    game.physics.arcade.collide(sprite, layer);

    mask.position.x = sprite.position.x + 5;
    mask.position.y = sprite.position.y + 24;

    //  Un-comment these to gain full control over the sprite
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
