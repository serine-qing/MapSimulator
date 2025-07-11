import * as THREE from "three";
import GameManager from "./GameManager";
import MapTiles from "./MapTiles";
import GameConfig from "../utilities/GameConfig";
import spine from "@/assets/script/spine-threejs.js";
import { GC_Add } from "./GC";

class Trap{
  gameManager: GameManager;
  mapTiles: MapTiles;
  data: trapData;  //原始数据

  key: string;
  direction: string;
  position: Vec2;
  idleAnimate: string;
  
  object: THREE.Object3D;          //fbxMesh和skeletonMesh
  fbxMesh: THREE.Mesh;
  skeletonData: any;
  skeletonMesh: any;

  constructor(gameManager: GameManager, data: trapData){
    this.gameManager = gameManager;

    this.data = data;
    this.key = data.key;
    this.direction = data.direction;
    this.position = data.position;
  }

  initMesh(){
    this.object = new THREE.Object3D();
    GC_Add(this.object);
    this.skeletonData = this.data.skeletonData;

    const localTile = this.mapTiles.get(this.position);
    const height = localTile.height? localTile.height : 0;

    if( this.data.mesh){

      this.initFbx();

      //微调高台装置的高度
      if(localTile.heightType === "HIGHLAND"){
        this.object.position.z = 0.2;
      }

    }else if(this.skeletonData){

      this.initSpine();
      this.object.position.z = this.gameManager.getPixelSize(height) - 1;
    }

    const coordinate = this.gameManager.getCoordinate(this.position);
    this.object.position.x = coordinate.x;
    this.object.position.y = coordinate.y;

    
  }

  initFbx(){
    this.fbxMesh = this.data.mesh.clone();
    this.object.add(this.fbxMesh);
    //Math.PI 一个PI等于180度 Math.PI 乘以 1234分别对应 下左上右
    this.fbxMesh.rotation.x = Math.PI / 2;
    
    const directions = {
      "UP": 0,
      "LEFT": 1,
      "DOWN": 2,
      "RIGHT": 3,
    }

    //逆时针
    this.fbxMesh.rotation.y += Math.PI * directions[this.direction] / 2;
  }

  initSpine(){
    this.idleAnimate = this.data.idleAnimate;
    //从数据创建SkeletonMesh并将其附着到场景
    this.skeletonMesh = new spine.threejs.SkeletonMesh(this.skeletonData);
    this.object.add(this.skeletonMesh);
    this.skeletonMesh.position.y = this.gameManager.getPixelSize(-1/4);
    this.skeletonMesh.rotation.x = GameConfig.MAP_ROTATION;

    this.skeletonMesh.state.setAnimation(
      0, 
      this.idleAnimate, 
      false
    );
    
  }

}

export default Trap;