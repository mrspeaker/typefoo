const Phaser = window.Phaser;
import Proto from "./Proto";

class Proto1 extends Proto {
  create (game, map) {
    const w = map.width;
    const h = map.height;
    this.letters = Array.from(new Array(h), () => {
      return Array.from(new Array(w), () => {
        return game.rnd.between(65, 65+25);
      });
    });
    this.sprites = this.createSprites(game);
  }

  createSprites (game) {
    const data = this.letters.reduce((str, el) => {
      return str + el.join(",") + "\n";
    }, "");

    game.cache.addTilemap("dynamicMap", null, data, Phaser.Tilemap.CSV);
    const map = game.add.tilemap("dynamicMap", 32, 32);
    map.addTilesetImage("tiles", "tiles", 16, 16);
    const layer = map.createLayer(0);
    layer.cameraOffset.x = 8;
    layer.cameraOffset.y = 8;

    const mask = game.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawCircle(0, 0, 380);
    layer.mask = mask;

    return {
      mask,
      map,
      layer
    };
  }

  move (keyCode, sprite) {

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
      sprite.body.velocity.x += -spd;
      //sprite.position.x = (xt - 1) * 32;
    }
    else if (keyCode === right) {
      sprite.body.velocity.x += spd;
      //sprite.position.x = (xt + 1) * 32;
    }
    else if (keyCode === jump || keyCode === upleft || keyCode === upright) {
      sprite.body.velocity.y += -spd * 3;
      if (keyCode === jump) {}
      else if (keyCode === upleft) {
        sprite.body.velocity.x -= spd * 2;
      }
      else if (keyCode === upright) {
        sprite.body.velocity.x += spd * 2;
      }
    }
  }

  update (game, player) {
    const {sprites} = this;
    const {mask} = sprites;
    mask.position.x = player.position.x + 12;
    mask.position.y = player.position.y + 24;
  }

}

export default new Proto1();
