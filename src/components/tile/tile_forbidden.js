//不可用高台
import {MeshBasicMaterial} from "three"
import Tile_Highland from "./tile_highland.js"

class Tile_Forbidden extends Tile_Highland{
  static sideMaterial = new MeshBasicMaterial( {color: "#131313"} );
  static topMaterial = new MeshBasicMaterial( {color: "#191919"} ); 

  constructor(params){
    super(params);
    //四边材质
    this.sideMaterial = Tile_Forbidden.sideMaterial; 
    //顶部材质
    this.topMaterial = Tile_Forbidden.topMaterial; 

    this.render();
  }
}

export default Tile_Forbidden;