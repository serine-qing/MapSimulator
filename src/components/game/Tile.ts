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

  tileData: any;

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
  defaultMat: any;    //默认材质
  constructor(tileData: TileData ,position: Vec2){
    this.tileData = tileData;
    this.width = 1;
    this.height = 0;
    this.margin = 0; //tile之间的间隔
    this.position = {
      x: 0,
      y: 0
    }
    this.z = 0;

    this.defaultMat = {};

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
        break;

      case "tile_fence":
      case "tile_fence_bound":
        this.height = 0;
        this.z = -3/14;
        break;
      case "tile_passable_wall":
        this.defaultMat =  textMaterials["tile_wall"];
        this.height = 3/7;
        this.margin = 0.15; //高台有间隔
        break;
      default:
        if(this.heightType === "HIGHLAND"){

          this.defaultMat =  textMaterials["tile_wall"];
          this.height = 3/7;
          this.margin = 0.15; //高台有间隔

        }else if(this.heightType === "LOWLAND"){
          this.height = 0;
          this.defaultMat =  textMaterials["tile_road"];
          this.z = -3/14;
          
        }
        break;
    }

    this.createMesh();
    this.addBorder();
  }


  createMesh(){
    const material = textMaterials[this.tileKey]? textMaterials[this.tileKey] : this.defaultMat;
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
          cellChangetoNum(2/7),
        );

        const fenceTop = material.fenceTop;
        const fenceMaterials = [
          sideMaterial, sideMaterial, sideMaterial, sideMaterial, fenceTop, fenceTop
        ];
        const left = new Mesh( sideGeometry, fenceMaterials); 
        const right = new Mesh( sideGeometry, fenceMaterials); 
        const up = new Mesh( sideGeometry, fenceMaterials); 
        const down = new Mesh( sideGeometry, fenceMaterials); 

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
        break;
        
      case "tile_yinyang_road":
      case "tile_yinyang_wall":
        const geometry = new THREE.CircleGeometry( cellChangetoNum(this.width / 8),64);

        const {yin, yang}  = material;
        const dynamic = this.tileData?.blackboard?.find(arr => arr.key === "dynamic");

        const huimingMat = dynamic?.value === 0? yin : yang;
        const huiming = new THREE.Mesh( geometry, huimingMat );

        huiming.position.z = cellChangetoNum(this.height/2) + 0.1;
        this.object.add(huiming);
        break;
      default:
        break;
    }

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
  addBorder(){
    let borderColor;
    switch (this.tileKey) {
      case "tile_start":
      case "tile_end":
        borderColor = this.tileKey === "tile_end"? "#359dde":"#e03253";
        break;
      case "tile_passable_wall":
        break;
      default:
        if(this.heightType === "LOWLAND"){

          borderColor = "#0d0d0d";
        }
        break;
    }

    if(borderColor){
      this.border = new BoxHelper( this.cube, borderColor);
      this.object.add(this.border);
    }

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