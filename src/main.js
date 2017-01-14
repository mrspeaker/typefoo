//import Boot from "./screens/Boot";
import World from "./screens/World";

const Phaser = window.Phaser;
const PIXI = window.PIXI;

const width = 1000;//320;
const height = width * (9 / 16);

const game = new Phaser.Game({
  width, //window.innerWidth * window.devicePixelRatio,
  height, //window.innerHeight * window.devicePixelRatio,
  renderer: Phaser.AUTO
});

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

//game.state.add( "Boot", Boot );
game.state.add("World", World);
game.state.start("World");

export default game;
