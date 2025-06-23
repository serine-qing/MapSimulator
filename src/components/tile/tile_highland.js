//高台基类
import Tile from "./tile.js"

class Tile_Highland extends Tile{
  constructor(params){
    super(params);  
    this.width = 1;
    this.height = 3/7;
    this.margin = 0.15; //高台有间隔
  } 
  render(){
    super.render();
  }
}

export default Tile_Highland;