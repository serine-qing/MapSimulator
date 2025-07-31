import GameManager from "./GameManager";
import TileManager from "./TileManager";
import Tile from "./Tile";
import TokenCard from "./TokenCard";
import Trap from "./Trap";

class TrapManager{
  trapDatas: trapData[];
  traps: Trap[] = [];
  gameManager: GameManager;
  tileManager: TileManager;

  constructor(trapDatas: trapData[], gameManager: GameManager){
    this.gameManager = gameManager;
    this.trapDatas = trapDatas;
    this.tileManager = gameManager.tileManager;

    trapDatas.forEach(trapData => {
      if(!trapData.isTokenCard && !trapData.hidden){
        const trap = this.createTrap(trapData);
        this.bindTile(trap);
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

  bindTile(trap: Trap){
    if(!trap.tile){
      const tile = this.tileManager.getTile(trap.position);
      tile.addTrap(trap);
    }
  }

  getSelected(): Trap{
    return this.traps.find(trap => trap.isSelected);
  }

  resetSelected(){
    this.traps.forEach(trap => trap.isSelected = false);
  }

  createTrap(trapData: trapData): Trap{
    const trap = new Trap(trapData);
    trap.gameManager = this.gameManager;
    this.traps.push(trap);

    return trap;
  }

  createTokenTrap(tokenCard: TokenCard, tile: Tile): Trap{
    const trap = this.createTrap(tokenCard.trapData);
    tile.addTrap(trap);
    trap.iconUrl = tokenCard.url;
    trap.initMesh();
    return trap;
  }

  removeTrap(trap: Trap){
    trap.tile.removeTrap();
    this.traps.remove(trap);
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

      //todo 难复现的bug
      if(!trap){
        console.log("state",state);
        console.log("traps",this.traps);
      }
      trap.set(tState);


    }
  }
}

export default TrapManager;