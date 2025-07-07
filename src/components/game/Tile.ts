import {Object3D, BoxGeometry, BoxHelper, Mesh, Material, MeshBasicMaterial, TextureLoader, Vector2} from "three"
import * as THREE from "three"
import { textMaterials } from "./TextureHelper";
import { isArray } from "element-plus/es/utils/types.mjs";
import GameConfig from "../utilities/GameConfig";
import AliasHelper from "./AliasHelper";

//单元格按一定比例转化为实际长宽
const cellChangetoNum = (num:number):number => {
  return num * GameConfig.TILE_SIZE;
}

class Tile{
  static boxGeos = [];

  width: number;
  height: number;
  margin: number;
  position: Vec2;
  z: number;      //z轴高度

  tileKey: string;
  heightType: string;

  textureObj: THREE.Mesh;
  cube: Mesh;
  object: Object3D;
  border: BoxHelper;

  sideMaterial: Material;
  topMaterial: Material;
  
  constructor(tileData: TileData ,position: Vec2){
    this.width = 1;
    this.height = 0;
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
    this.heightType = AliasHelper(heightType, "heightType");

    switch (tileKey) {
      case "tile_start":
      case "tile_end":
        this.height = 1;
        this.z = 2/7;
        this.createMesh();
        this.addBorder(tileKey === "tile_end"? "#359dde":"#e03253");
        break;

      case "tile_fence":
      case "tile_fence_bound":
        this.height = 2/7;
        this.z = -3/14;
        this.createMesh();
        break;
    
      default:
        if(this.heightType === "HIGHLAND"){

          this.height = 3/7;
          this.margin = 0.15; //高台有间隔
          this.createMesh();

        }else if(this.heightType === "LOWLAND"){

          this.z = -3/14;
          this.createMesh();
          this.addBorder("#0d0d0d");
        }
        break;
    }
    
  }


  createMesh(){
    const material = textMaterials[this.tileKey]? textMaterials[this.tileKey] : {};
    const {top : topMaterial, side : sideMaterial, texture} = material;

    this.object = new Object3D();
    this.object.position.x = cellChangetoNum(this.position.x);
    this.object.position.y = cellChangetoNum(this.position.y);
    this.object.position.z = cellChangetoNum(this.z);

    switch (this.tileKey) {
      //围栏
      case "tile_fence":
      case "tile_fence_bound":
        const fenceWidth = this.width / 10;
        const sideGeometry = new BoxGeometry( 
          cellChangetoNum(fenceWidth),
          cellChangetoNum(this.width),
          cellChangetoNum(this.height),
        );

        const bottomGeometry = this.getBoxGeo(this.width, 0, 0);

        const fenceTop = material.fenceTop;
        const fenceMaterials = [
          sideMaterial, sideMaterial, sideMaterial, sideMaterial, fenceTop, fenceTop
        ];
        const left = new Mesh( sideGeometry, fenceMaterials); 
        const right = new Mesh( sideGeometry, fenceMaterials); 
        const up = new Mesh( sideGeometry, fenceMaterials); 
        const down = new Mesh( sideGeometry, fenceMaterials); 

        const bottom = new Mesh( bottomGeometry, [
          sideMaterial, sideMaterial, sideMaterial, sideMaterial, topMaterial, topMaterial
        ]); 

        left.position.x = cellChangetoNum(-this.width/2 + fenceWidth / 2);
        right.position.x = cellChangetoNum(this.width/2 - fenceWidth / 2);
        up.position.y = cellChangetoNum(this.width/2 - fenceWidth / 2);
        down.position.y = cellChangetoNum(-this.width/2 + fenceWidth / 2);

        up.rotation.z = Math.PI / 2;
        down.rotation.z = Math.PI / 2;

        this.object.add(left);
        this.object.add(right);
        this.object.add(up);
        this.object.add(down);
        this.object.add(bottom);
        break;
    
      default:
        const geometry = this.getBoxGeo(this.width, this.height, this.margin);

        this.cube = new Mesh( geometry, [
          sideMaterial, sideMaterial, sideMaterial, sideMaterial, topMaterial, topMaterial
        ]); 

        this.object.add(this.cube);

        if(texture){

          const textureSize = cellChangetoNum(0.85);
          const textureGeo = new THREE.PlaneGeometry( textureSize, textureSize );
          const textureMat = texture;
          this.textureObj = new THREE.Mesh( textureGeo, textureMat );
          this.textureObj.position.setZ(cellChangetoNum(this.height/2) + 0.1);
          this.object.add(this.textureObj)
        }

        break;
    }

  }

  //重复的geo直接读取缓存
  getBoxGeo(width:number, height:number, margin:number):BoxGeometry {
    let boxGeo: BoxGeometry;

    boxGeo = Tile.boxGeos.find(item => {
      return item.width === width && 
      item.height === height && 
      item.margin === margin;
    })?.geo

    if(!boxGeo){
      boxGeo = new BoxGeometry( 
        cellChangetoNum(width) - margin,
        cellChangetoNum(width) - margin,
        cellChangetoNum(height),
      );
      Tile.boxGeos.push({
        width, height, margin,
        geo:boxGeo
      })
    }
    return boxGeo;
  }

  //添加边框
  addBorder(color){
    this.border = new BoxHelper( this.cube, color);
    this.object.add(this.border);
  }

  destroy() {
    //释放内存
    
    this.object.children.forEach((mesh:THREE.Mesh) => {
      mesh.geometry.dispose();
      
      if(isArray(mesh.material)){

        mesh.material.forEach(mat => {
          if(mat) mat.dispose();
        })

      }else{
              
        mesh.material.dispose();
      }
    })
    
  }
}

export default Tile;