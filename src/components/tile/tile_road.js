//普通地面
import {MeshBasicMaterial} from "three"
import Tile_Lowland from "./tile_lowland.js"

class Tile_Road extends Tile_Lowland{
  static topMaterial = new MeshBasicMaterial( {color: "#747474"} ); 
  constructor(params){
    super(params);  
    this.topMaterial = Tile_Road.topMaterial;
    this.render();
  }
}

export default Tile_Road;