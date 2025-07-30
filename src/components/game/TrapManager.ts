import GameManager from "./GameManager";
import Tile from "./Tile";
import TokenCard from "./TokenCard";
import Trap from "./Trap";

class TrapManager{
  trapDatas: trapData[];
  traps: Trap[] = [];
  gameManager: GameManager;

  constructor(trapDatas: trapData[], gameManager: GameManager){
    this.gameManager = gameManager;
    this.trapDatas = trapDatas;
    trapDatas.forEach(trapData => {
      if(!trapData.isTokenCard){
        const trap = new Trap(trapData);
        trap.gameManager = gameManager;
        this.traps.push(trap);
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

  getSelected(): Trap{
    return this.traps.find(trap => trap.isSelected);
  }

  resetSelected(){
    this.traps.forEach(trap => trap.isSelected = false);
  }

  createTrap(tokenCard: TokenCard, tile: Tile): Trap{
    const trap = new Trap(tokenCard.trapData);
    trap.iconUrl = tokenCard.url;
    trap.gameManager = this.gameManager;
    tile.addTrap(trap);
    trap.initMesh();
    this.traps.push(trap);

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