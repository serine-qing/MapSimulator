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
  mainSkillLvl: number;    //技能等级
  
  object: THREE.Object3D;          //fbxMesh和skeletonMesh
  fbxMesh: THREE.Mesh;

  skeletonData: any;
  skeletonMesh: any;

  textureMat: THREE.MeshBasicMaterial;
  textureMesh: THREE.Mesh;

  constructor(gameManager: GameManager, data: trapData){
    this.gameManager = gameManager;

    this.data = data;
    this.key = data.key;
    this.direction = data.direction;
    this.position = data.position;
    this.mainSkillLvl = data.mainSkillLvl;

  }

  initMesh(){
    this.object = new THREE.Object3D();
    GC_Add(this.object);
    this.skeletonData = this.data.skeletonData;
    this.textureMat = this.data.textureMat;

    const localTile = this.mapTiles.get(this.position);
    const height = localTile.height? localTile.height : 0;

    if( this.data.mesh){

      this.initFbx();
      
      //调整高台装置的高度
      this.object.position.z = localTile.getPixelHeight();    

    }else if(this.skeletonData){

      this.initSpine();
      this.object.position.z = this.gameManager.getPixelSize(height + 1/14) ;
    }else if(this.textureMat){
      this.initTexture()
      this.object.position.z = this.gameManager.getPixelSize(height) + 0.15;
    }

    const coordinate = this.gameManager.getCoordinate(this.position);
    this.object.position.x = coordinate.x;
    this.object.position.y = coordinate.y;

    //初始化技能（目前就是影响一些外观）
    this.initSkill();
  }

  initFbx(){
    this.fbxMesh = this.data.mesh.clone();
    this.object.add(this.fbxMesh);
    //Math.PI 一个PI等于180度 Math.PI 乘以 1234分别对应 下左上右
    
    const directions = {
      "UP": 0,
      "LEFT": 1,
      "DOWN": 2,
      "RIGHT": 3,
    }

    //逆时针
    const eulerY = Math.PI * directions[this.direction] / 2;
    const quatY = new THREE.Quaternion();
    const meshQuat = this.fbxMesh.quaternion;

    quatY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), eulerY);

    //将四元数应用到对象上，通常是将其与对象的quaternion属性相乘。
    meshQuat.multiplyQuaternions(meshQuat, quatY);

  }

  initSpine(){
    this.idleAnimate = this.data.idleAnimate;
    //从数据创建SkeletonMesh并将其附着到场景
    this.skeletonMesh = new spine.threejs.SkeletonMesh(this.skeletonData);
    this.object.add(this.skeletonMesh);
    this.skeletonMesh.position.y = this.gameManager.getPixelSize(-1/9);
    this.skeletonMesh.rotation.x = GameConfig.MAP_ROTATION;

    this.skeletonMesh.state.setAnimation(
      0, 
      this.idleAnimate, 
      false
    );
    
  }

  initTexture(){
    const textureSize = this.gameManager.getPixelSize(1);
    const textureGeo = new THREE.PlaneGeometry( textureSize, textureSize );
    this.textureMesh = new THREE.Mesh(textureGeo, this.textureMat);
    GC_Add(textureGeo);

    this.object.add(this.textureMesh);
    
  }

  initSkill(){
    switch (this.key) {
      //土石结构的壳
      case "trap_032_mound":
        if(this.mainSkillLvl === 1){
          const skin = this.fbxMesh.children[1];
          this.fbxMesh.remove(skin);
          GC_Add(skin);
        }
        break;
    
    }

  }
}

export default Trap;