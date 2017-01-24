const Phaser = window.Phaser;
import Proto from "./Proto";
import EasyStar from "easystarjs";

/*
  Type any three letters (including space)... teleport to that area

  idea is to steer, move to area.
  maybe matrix-y letters everywher you can't type... solid areas don't change letters
  - you can move there.

  lock in letters, like War Games...
  open up areas to move - have to type faster and faster (and accurate)

  some "cursors" that dart accross the screen and if you type as they pass, you move?

*/

class Proto4 extends Proto {
  create (game, map, layer) {
    const w = map.width;
    const h = map.height;
    const solidLayer = map.layers[0];
    const data = solidLayer.data;

    this.keyCodes = [];
    layer.visible = false;

    game.physics.arcade.gravity.y = 0;

    this.letters = Array.from(new Array(h), (_, j) => {
      return Array.from(new Array(w), (_, i) => {
        if (data[j][i].index !== -1) return game.rnd.between(65, 65+25);
        return 32;
      });
    });

    this.grid = this.mapToGrid(map);
    const estar = this.estar = new EasyStar.js();
    estar.setGrid(this.grid);
    estar.setAcceptableTiles([0]);

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

    return {
      map,
      layer
    };
  }

  mapToGrid () {
    const h = this.letters.length;
    const w = this.letters[0].length;

    const grid = [];
    for (let y = 0; y < h; y++) {
      const gridRow = [];
      for (let x = 0; x < w; x++) {
        const index = this.letters[y][x];
        gridRow.push(index === 32 ? 0 : 1);
      }
      grid.push(gridRow);
    }
    return grid;
  }


  move (keyCode, sprite) {

    this.keyCodes = [...this.keyCodes, keyCode].slice(-3);

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

    if (this.keyCodes.length === 3) {
      this.letters.forEach((row, y) => {
        for (let x = 1; x < row.length - 1; x++) {
          if (this.keyCodes[0] === row[x - 1] &&
              this.keyCodes[1] === row[x] &&
              this.keyCodes[2] === row[x + 1]) {

            //this.estar.setGrid(this.grid);
            this.estar.findPath(
              x, y, xt, yt,
              path => {
                if (!path) return;
                this._timer && clearTimeout(this._timer);
                const go = path => {
                  if (!path.length) return;
                  sprite.position.x = path[0].x * 32;
                  sprite.position.y = (path[0].y - 1) * 32;
                  this._timer = setTimeout(() => go(path.slice(1)), 60);
                };
                go(path.reverse());
              });
            this.estar.calculate();

            this.keyCodes = [];
          }
        }
      });
    }
  }

  update (game, player) {
    const {sprites} = this;
    //const {mask} = sprites;
    //mask.position.x = player.position.x + 12;
    //mask.position.y = player.position.y + 24;
  }

}

export default new Proto4();
