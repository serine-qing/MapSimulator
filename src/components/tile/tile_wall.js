//普通可部署高台
import {MeshBasicMaterial} from "three"
import Tile_Highland from "./tile_highland.js"

class Tile_Wall extends Tile_Highland{
  static sideMaterial = new MeshBasicMaterial( {color: "#7d7d7d"} );
  static topMaterial = new MeshBasicMaterial( {color: "#c1c1c1"} ); 

  constructor(params){
    super(params);
    //四边材质
    this.sideMaterial = Tile_Wall.sideMaterial; 
    //顶部材质
    this.topMaterial = Tile_Wall.topMaterial; 

    this.render();
  }
}

export default Tile_Wall;