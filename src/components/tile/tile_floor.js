//不可部署地面
import {MeshBasicMaterial} from "three"
import Tile_Lowland from "./tile_lowland.js"

class Tile_Floor extends Tile_Lowland{
  static topMaterial = new MeshBasicMaterial( {color: "#303030"} ); 
  constructor(params){
    super(params);  
    this.topMaterial = Tile_Floor.topMaterial;
    this.render();
  } 
}

export default Tile_Floor;