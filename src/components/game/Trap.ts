import * as THREE from "three";
import GameConfig from "../utilities/GameConfig";
import * as spine  from "@/spine";
import { GC_Add } from "./GC";
import Tile from "./Tile";
import { Countdown } from "./CountdownManager";
import TrapHandler from "../entityHandler/TrapHandler";
import Global from "../utilities/Global";
import { getCoordinate, getPixelSize } from "../utilities/utilities";
import BattleObject from "../enemy/BattleObject";

class Trap extends BattleObject{
  data: trapData;  //原始数据
  isTokenCard: boolean = false;  //是否是待部署区装置
  iconUrl: string; 

  key: string;
  alias: string;            //地图内装置id
  direction: string;
  position: Vec2;
  idleAnimate: string;
  mainSkillLvl: number;    //技能等级
  visible: boolean;         //是否可见
  
  fbxMesh: THREE.Mesh;

  skeletonData: any;
  skeletonMesh: any;

  textureMat: THREE.MeshBasicMaterial;
  textureMesh: THREE.Mesh;

  tile: Tile;   //装置位于的地块

  isSelected: boolean = false;       //是否被鼠标选中

  extraWaveKey: string;

  labelVue: any;   //前台显示数据
  //vue中可供更改的数据
  options = {
    CountDownVisible: true
  }

  constructor(data: trapData){
    super();
    this.data = data;
    this.isTokenCard = data.isTokenCard;
    this.key = data.key;
    this.alias = data.alias;
    this.direction = data.direction;
    this.position = data.position;
    this.mainSkillLvl = data.mainSkillLvl;
    this.visible = !data.hidden;
    this.customData = data.customData;

    this.extraWaveKey = data.extraWaveKey;

    this.initSkill();
  }

  initObject(){
    this.object = new THREE.Object3D();
    const coordinate = getCoordinate(this.position);
    this.object.position.x = coordinate.x;
    this.object.position.y = coordinate.y;

    this.object.visible = this.visible;
    
    this.object.userData.trap = this;
  }

  initMesh(){
    this.initObject();
    GC_Add(this.object);
    this.skeletonData = this.data.skeletonData;
    this.textureMat = this.data.textureMat;

    if( this.data.mesh){

      this.initFbx();

    }else if(this.skeletonData){

      this.initSpine();

    }else if(this.textureMat){
      this.initTexture()

    }

    this.initHeight();

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

  initHeight(){
    const height = this.tile.height? this.tile.height : 0;
    if( this.data.mesh){
      
      //调整高台装置的高度
      this.object.position.z = this.tile.getPixelHeight();    

    }else if(this.skeletonData){

      this.object.position.z = getPixelSize(height + 1/14) ;

    }else if(this.textureMat){
      this.object.position.z = getPixelSize(height) + 0.15;

    }
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
    this.skeletonMesh = new spine.SkeletonMesh(this.skeletonData);
    this.object.add(this.skeletonMesh);
    this.skeletonMesh.position.y = getPixelSize(-1/4);
    this.skeletonMesh.rotation.x = GameConfig.MAP_ROTATION;
    
    this.skeletonMesh.state.setAnimation(
      0, 
      this.idleAnimate, 
      true
    );
    
  }

  initTexture(){
    const textureSize = getPixelSize(1);
    const textureGeo = new THREE.PlaneGeometry( textureSize, textureSize );
    this.textureMesh = new THREE.Mesh(textureGeo, this.textureMat);
    GC_Add(textureGeo);

    this.object.add(this.textureMesh);
    
  }

  initSkill(){
    TrapHandler.initSkill(this);
  }

  //获取skillBlackboard
  getSkillBoard(key: string){
    return this.customData?.skillBlackboard?.find(item => item.key === key)?.value;
  }

  bindTile(tile: Tile){
    this.tile = tile;
    this.position = tile.position;
  }

  canBlockRoute(): boolean{
    let blockRoute = false;
    switch (this.key) {
      case "trap_001_crate":
      case "trap_002_emp":
      case "trap_005_sensor":
      case "trap_008_farm":
      case "trap_020_roadblock":
      case "trap_027_stone":
      case "trap_032_mound":
      case "trap_043_dupilr":
      case "trap_044_duruin":
      case "trap_075_bgarmn":
      case "trap_076_bgarms":
      case "trap_077_rmtarmn":
      case "trap_078_rmtarms":
      case "trap_080_garage":
      case "trap_111_wdfarm":
      case "trap_156_dsshell":
      case "trap_163_foolcrate":
      case "trap_405_xbroadblock":
      case "trap_480_roadblockxb":
      case "trap_270_spawnp":
        blockRoute = true;
        break;
    }
    
    return blockRoute;
  }

  public show(){
    this.visible = true;
    if(this.object){
      this.object.visible = true;
    }

  }

  public hide(){
    this.visible = false;
    if(this.object){
      this.object.visible = false;
    }
    
  }

  public start(){
    TrapHandler.start(this);
  }

  public update(delta: number){
    if(!this.visible) return;
    this.updateSkillSP(delta);
    this.updateSkillState();
    this.updateSPBar();
  }

  public get(){
    const superStates = super.get();

    const state = {
      visible: this.visible,
      ...superStates
    }

    return state;
  }

  public set(state){
    super.set(state);
    
    const { visible } = state;
    visible? this.show() : this.hide();
    this.skeletonMesh?.update( 0.001 );
  }

  public destroy() {
    this.object.children.forEach((mesh: THREE.Mesh) => {
      mesh.geometry?.dispose();
      (mesh.material as THREE.MeshMatcapMaterial)?.dispose();
    })
  }
}

export default Trap;