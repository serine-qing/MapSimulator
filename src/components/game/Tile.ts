import {Object3D, BoxGeometry, BoxHelper, Mesh, Material, MeshBasicMaterial, TextureLoader, Vector2} from "three"
import * as THREE from "three"
import { textMaterials } from "./TextureHelper";

class Tile{
  width: number;
  height: number;
  margin: number;
  position: Vec2;
  z: number;      //z轴高度

  tileKey: string;
  heightType: string;

  cube: Mesh;
  object: Object3D;
  border: BoxHelper;

  sideMaterial: Material;
  topMaterial: Material;
  
  constructor(tileData: TileData ,position: Vec2){
    this.width = 1;
    this.height = 1;
    this.margin = 0; //tile之间的间隔
    this.position = {
      x: 0,
      y: 0
    }
    this.z = 0;

    this.position.x = position.x ? position.x : 0;
    this.position.y = position.y ? position.y : 0;

    const {tileKey, heightType} = tileData;
    this.tileKey = tileKey;
    this.heightType = heightType;

    if(tileKey === "tile_start" || tileKey === "tile_end"){
      this.height = 1;
      this.z = this.cellChangetoNum(2/7);
      this.createMesh();
      this.addBorder(tileKey === "tile_end"? "#359dde":"#e03253");
      return;
    }

    if(heightType === "HIGHLAND"){

      this.height = 3/7;
      this.margin = 0.15; //高台有间隔
      this.createMesh();

    }else if(heightType === "LOWLAND"){

      this.height = 0;
      this.z = this.cellChangetoNum(-3/14);
      this.createMesh();
      this.addBorder("#0d0d0d");
    }
    
    // switch (tileKey) {
    //   case "tile_start":

        

    //     break;
    
    //   default:
    //     break;
    // }
  }


  createMesh(){
    const geometry = new BoxGeometry( 
      this.cellChangetoNum(this.width) - this.margin,
      this.cellChangetoNum(this.width) - this.margin,
      this.cellChangetoNum(this.height),
    ); 

    const material = textMaterials[this.tileKey]? textMaterials[this.tileKey] : {};

    const {top : topMaterial, side : sideMaterial, texture} = material;

    this.cube = new Mesh( geometry, [
      sideMaterial, sideMaterial, sideMaterial, sideMaterial, topMaterial, topMaterial
    ]); 

    this.object = new Object3D();
    this.object.position.x = this.cellChangetoNum(this.position.x);
    this.object.position.y = this.cellChangetoNum(this.position.y);
    this.object.position.z = this.z;

    this.object.add(this.cube);

    if(texture){
      const textureSize = this.cellChangetoNum(0.8);
      const textureGeo = new THREE.PlaneGeometry( textureSize, textureSize );
      const textureMat = texture;
      const textureObj = new THREE.Mesh( textureGeo, textureMat );
      textureObj.position.setZ(0.1);
      this.object.add(textureObj)
    }

  }

  //单元格按一定比例转化为实际长宽
  cellChangetoNum (num){
    return num * 7;
  }

  //添加边框
  addBorder(color){
    this.border = new BoxHelper( this.cube, color);
    this.object.add(this.border);
  }
}

export default Tile;