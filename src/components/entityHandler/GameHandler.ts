import act42side from "../entityHandler/众生行记";
import act45side from "../entityHandler/无忧梦呓";
import act1vhalfidle from "../entityHandler/次生预案";
import main15 from "./15章";
import main16 from "./16章";
import Tile from "../game/Tile";

const GameHandler = {
  //初始化全部Actions后执行
  afterGameInit: () => {
    act42side.afterGameInit();
    act45side.afterGameInit();
    act1vhalfidle.afterGameInit();
  },

  beforeGameInit: () => {
    
  },

  handleTileInit: (tile: Tile) => {
    main15.handleTileInit(tile);
  },

  afterGameUpdate: () => {
    main15.afterGameUpdate();
  },

  afterGameViewInit: () => {
    main15.afterGameViewInit();
  },

  afterMoveCamera: () => {
    main16.afterMoveCamera();
  }

}

export default GameHandler;