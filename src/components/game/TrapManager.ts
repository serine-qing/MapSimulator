import Tile from "./Tile";
import TokenCard from "./TokenCard";
import Trap from "./Trap";
import Global from "../utilities/Global";

class TrapManager{
  trapDatas: trapData[];
  traps: Trap[] = [];

  constructor(trapDatas: trapData[]){
    Global.trapManager = this;

    this.trapDatas = trapDatas;

    trapDatas.forEach(trapData => {
      if(!trapData.isTokenCard){
        const trap = this.createTrap(trapData);

        if(!trap.tile){
          const tile = Global.tileManager.getTile(trap.position);
          trap.bindTile(tile);

          if(!trapData.hidden){
            tile.bindTrap(trap);
          }
        }
      }
    });

  }

  initMeshs(){
    this.traps.forEach(trap => {
      trap.initMesh();
    })
  }

  getTrap(key): Trap{
    return this.traps.find(trap => key === trap.alias);
  }

  getTrapsInRect(x1, x2, y1, y2): Trap[]{
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    return this.traps.filter(trap => {
      return (
        trap.visible &&
        trap.position.x >= minX &&
        trap.position.x <= maxX &&
        trap.position.y >= minY &&
        trap.position.y <= maxY
      )
    })
  }

  getSelected(): Trap{
    return this.traps.find(trap => trap.isSelected);
  }

  resetSelected(){
    this.traps.forEach(trap => trap.isSelected = false);
  }

  createTrap(trapData: trapData): Trap{
    const trap = new Trap(trapData);
    this.traps.push(trap);

    return trap;
  }

  createTokenTrap(tokenCard: TokenCard, tile: Tile): Trap{
    const trap = this.createTrap(tokenCard.trapData);
    trap.bindTile(tile);
    tile.bindTrap(trap);
    trap.iconUrl = tokenCard.url;
    trap.initMesh();
    return trap;
  }

  removeTrap(trap: Trap){
    trap.tile.removeTrap();
    this.traps.remove(trap);
    trap.destroy();
  }

  public update(delta: number) {
    this.traps.forEach(trap => {
      if(trap.visible){
        trap.update(delta);
      }
    })
  }

  get(){
    const state = {
      instance: [...this.traps],
      data: []
    };

    this.traps.forEach(trap => {
      state.data.push(trap.get());
    })

    return state;
  }

  set(state){
    const { instance, data } = state;
    if(!this.traps.equal(instance)){
      this.traps = instance;
    }
    for(let i = 0; i< data.length; i++){
      const tState = data[i];
      const trap = this.traps[i];

      if(!trap){
        console.log("state",state);
        console.log("traps",this.traps);
      }
      trap.set(tState);


    }
  }
}

export default TrapManager;