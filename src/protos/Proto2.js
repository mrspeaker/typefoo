const Phaser = window.Phaser;
import Proto from "./Proto";

class Proto2 extends Proto {
  create (game) {
    const cut = str => str.toUpperCase().split("").map(c => c.charCodeAt(0));
    this.letters = {
      up: { x: 0, y: -1, phrase: "yuyuyuyuyuyuyuyu" },
      left: { x: -1, y: 0, phrase: "fdfdfdfdfdfdfd" },
      right: { x: 1, y: 0, phrase: "jkjkjkjkjkjkjkjk"},
      //leftup: {text: cut("artichoke"), x: -1, y: -1},
      //rightup: {text: cut("hairspray"), x: 1, y: -1},
    };

    Object.values(this.letters).forEach(dir => {
      dir.pointer = 10;
      dir.text = cut(dir.phrase.substring(0, dir.pointer - 1));
    });

    const ls = this.letterSprites = game.add.group();

    Object.values(this.letters).forEach(dir => {
      dir.sprites = game.add.group();
      ls.add(dir.sprites);
      dir.text.map((ch, i) => {
        i += 2;
        const s = game.add.sprite(i * dir.x * 16, i * dir.y * 16, "tiles");
        if (i === 2) {
          s.scale.set(1.5, 1.5);
          s.x -= 4;
        }
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
    //const upleft = letters.leftup.text[0];
    //const upright = letters.rightup.text[0];
    const spd = 50;

    const nextLetter = dirName => {
      const dir = letters[dirName];
      const next = dir.phrase[++dir.pointer % dir.phrase.length];
      dir.text = dir.text.slice(1).concat(next.toUpperCase().charCodeAt(0));
      dir.text.forEach((c, i) => {
        dir.sprites.children[i].frame = c;
      });
    };

    if (keyCode === left) {
      sprite.body.velocity.x += -spd;
      nextLetter("left");
      //sprite.position.x = (xt - 1) * 32;
    }
    else if (keyCode === right) {
      sprite.body.velocity.x += spd;
      nextLetter("right");

      //sprite.position.x = (xt + 1) * 32;
    }
    else if (keyCode === jump) {// || keyCode === upleft || keyCode === upright) {
      sprite.body.velocity.y += -spd * 3;
      if (keyCode === jump) {
        nextLetter("up");
      }
      /*else if (keyCode === upleft) {
        sprite.body.velocity.x -= spd * 2;
      }
      else if (keyCode === upright) {
        sprite.body.velocity.x += spd * 2;
      }*/
    }
  }
  update (game, sprite) {
    this.letterSprites.x = sprite.x + sprite.body.width - 20;
    this.letterSprites.y = sprite.y + sprite.body.halfHeight - 16;
  }
}

export default new Proto2();
