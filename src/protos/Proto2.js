const Phaser = window.Phaser;
import Proto from "./Proto";

class Proto2 extends Proto {
  create (game) {
    const cut = str => str.toUpperCase().split("").map(c => c.charCodeAt(0));
    this.letters = {
      up: {text: cut("testing"), x: 0, y: -1.5},
      left: {text: cut("isworking"), x: -1, y: 0},
      right: {text: cut("definitely"), x: 1, y: 0},
      leftup: {text: cut("artichoke"), x: -1, y: -1},
      rightup: {text: cut("hairspray"), x: 1, y: -1},
    };

    const ls = this.letterSprites = game.add.group();

    Object.values(this.letters).forEach(dir => {
      dir.sprites = game.add.group();
      ls.add(dir.sprites);
      dir.text.map((ch, i) => {
        i+=2;
        const s = game.add.sprite(i * dir.x * 16, i * dir.y * 16, "tiles");
        dir.sprites.add(s);
        s.frame = ch;
      });
    });

    ls.x = 100;
  }
  move (keyCode, sprite, game) {
    const {letters} = this;
    const left = letters.left.text[0];
    const right = letters.right.text[0];
    const jump = letters.up.text[0];
    const upleft = letters.leftup.text[0];
    const upright = letters.rightup.text[0];

    const spd = 50;

    if (keyCode === left) {
      sprite.body.velocity.x += -spd;
      letters.left.text = letters.left.text.slice(1).concat(game.rnd.between(65, 65+25));
      letters.left.text.forEach((c, i) => {
        letters.left.sprites.children[i].frame = c;
      });
      //sprite.position.x = (xt - 1) * 32;
    }
    else if (keyCode === right) {
      sprite.body.velocity.x += spd;
      letters.right.text = letters.right.text.slice(1).concat(game.rnd.between(65, 65+25));
      letters.right.text.forEach((c, i) => {
        letters.right.sprites.children[i].frame = c;
      });

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
  update (game, sprite) {
    this.letterSprites.x = sprite.x + sprite.body.width - 20;
    this.letterSprites.y = sprite.y + sprite.body.halfHeight - 16;
  }
}

export default new Proto2();
