//红门
import Tile from "./tile.js"

class Tile_Start extends Tile{
  constructor(params){
    super(params);  
    this.width = 1;
    this.height = 1;
    this.z = this.cellChangetoNum(2/7);
    this.render();
  } 
  render(){
    super.render();
    this.addBorder("#e03253");
    this.object.remove(this.cube);
  }
}

export default Tile_Start;