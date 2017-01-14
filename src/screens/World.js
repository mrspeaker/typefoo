const Phaser = window.Phaser;

const style = { font: "26px helvetica", fill: "#333"};

class World {

  preload ( game ) {
    const { load } = game;
  }

  create ( game ) {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.reset();
    this.bindInput();
  }

  reset () {
    const { game } = this;
    game.stage.backgroundColor = 0x94D7ED;
  }

  bindInput () {
    const { game } = this;
  }

  update (game) {

  }

  render (game) {
  
  }


}

module.exports = World;
