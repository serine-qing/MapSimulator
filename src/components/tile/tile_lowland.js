//地面基类
import Tile from "./tile.js"

class Tile_Lowland extends Tile{
  constructor(params){
    super(params);  
    this.height = 0;
    this.z = this.cellChangetoNum(-3/14);
  } 
  render(){
    super.render();
    this.addBorder("#0d0d0d");
  }
}

export default Tile_Lowland;