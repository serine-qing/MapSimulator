import act42side from "../entityHandler/众生行记";
import act45side from "../entityHandler/无忧梦呓";
import main15 from "./15章";
import Tile from "../game/Tile";

const GameHandler = {
  //初始化全部Actions后执行
  afterGameInit: () => {
    act42side.afterGameInit();
    act45side.afterGameInit();
  },

  beforeGameInit: () => {
    
  },

  handleTileInit: (tile: Tile) => {
    main15.handleTileInit(tile);
  },

  afterGameUpdate: () => {
    main15.afterGameUpdate();
  },
}

export default GameHandler;