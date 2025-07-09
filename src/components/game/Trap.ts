import * as THREE from "three";
import GameManager from "./GameManager";
import MapTiles from "./MapTiles";
import GameConfig from "../utilities/GameConfig";
import {getSpineSize } from "@/components/utilities/SpineHelper"
import spine from "@/assets/script/spine-threejs.js";

class Trap{
  gameManager: GameManager;
  mapTiles: MapTiles;
  data: trapData;  //原始数据

  key: string;
  direction: string;

  position: Vec2;

  mesh: THREE.Mesh;

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
    this.skeletonData = this.data.skeletonData;
    if( this.data.mesh){

      this.initFbx();
      
    }else if(this.skeletonData){
      this.initSpine();
      
    }

  }

  initFbx(){
    this.mesh = this.data.mesh.clone();
    const coordinate: Vec2 = this.gameManager.getCoordinate(this.position);
    this.mesh.position.x = coordinate.x;
    this.mesh.position.y = coordinate.y;

    const localTile = this.mapTiles.get(this.position);
    const height = localTile.height? localTile.height : 0;
    this.mesh.position.z = this.gameManager.getPixelSize(height) - 1.7;

    //Math.PI 一个PI等于180度 Math.PI 乘以 1234分别对应 下左上右
    this.mesh.rotation.x = Math.PI / 2;
    const directions = {
      "UP": 3,
      "LEFT": 2,
      "DOWN": 1,
      "RIGHT": 4,
    }
    this.mesh.rotation.y = Math.PI * directions[this.direction] / 2;
      
  }

  initSpine(){

    //从数据创建SkeletonMesh并将其附着到场景
    this.skeletonMesh = new spine.threejs.SkeletonMesh(this.skeletonData);
    
    const spineSize = getSpineSize(this);

    const position = this.gameManager.getCoordinate(this.position);
    this.skeletonMesh.position.x = position.x;
    this.skeletonMesh.position.y = position.y;

    const localTile = this.mapTiles.get(this.position);
    const height = localTile.height? localTile.height : 0;
    this.skeletonMesh.position.z = this.gameManager.getPixelSize(height) - 1;

    this.skeletonMesh.position.y -= 0.5;
    this.skeletonMesh.scale.set(spineSize,spineSize,1);

    this.skeletonMesh.rotation.x = GameConfig.MAP_ROTATION;

    const idle = this.skeletonData.animations.find( animation => animation.name.includes("Idle"));
    this.skeletonMesh.state.setAnimation(
      0, 
      idle.name, 
      false
    );
    
  }

}

export default Trap;