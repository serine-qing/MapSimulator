import * as THREE from "three";
import spine from "@/assets/script/spine-threejs.js";
import spinesAssets from "@/components/assetManager/spinesAssets.js"

import {EnemyWave, CheckPoint, WayFindMap, EnemyRoute, WayFindNode} from "@/components/utilities/Interface.ts"
import GameConfig from "@/components/utilities/GameConfig.ts"

//TODO  敌人需要图像和数据分离
class Enemy{
  key: string;
  levelType: string;
  motion: string;       //行动的骨骼动画名
  name: string;
  description: string;  
  rangeRadius: number;   //攻击范围

  moveSpeed: number;
  atk: number;
  def: number;
  magicResistance: number;
  maxHp: number;

  position: THREE.Vector2;

  route: EnemyRoute;
  checkpoints: CheckPoint[];
  checkPointIndex: number = 0;   //目前处于哪个检查点

  wayFindMap: WayFindMap;  //当前使用的寻路地图  
  targetNode: WayFindNode;  //寻路目标点

  waitingConuts: number = 0;    //等待时间计时器
  exit: boolean = false;

  public skeletonMesh: any;
  constructor(wave: EnemyWave){
    const enemyData = wave.enemyData;
    this.key = enemyData.key;
    this.levelType = enemyData.levelType;
    this.motion = enemyData.motion;
    this.name = enemyData.name;
    this.description = enemyData.description;
    this.rangeRadius = enemyData.rangeRadius;

    this.moveSpeed = enemyData.attributes.moveSpeed;
    this.atk = enemyData.attributes.atk;
    this.def = enemyData.attributes.def;
    this.magicResistance = enemyData.attributes.magicResistance;
    this.maxHp = enemyData.attributes.maxHp;

    this.route = wave.route;
    this.checkpoints = this.route.checkpoints;
  }

  public reset(){
    this.position = new THREE.Vector2();
    this.setPosition(
      this.route.startPosition.x,
      this.route.startPosition.y
    );
    this.waitingConuts = 0;
    this.targetNode = null;
    this.changeCheckPoint(0)
    // this.action();
  }

  public setTargetNode(targetNode: WayFindNode){
    this.targetNode = targetNode;
  }

  public setPosition(x:number, y: number){
    this.position.set(x, y);
    this.setSkelPosition(x, y);
  }

  public setDirection(unitVector: THREE.Vector2){
    //根据移动方向更换spine方向
    if(unitVector.x > 0){
      this.skeletonMesh.scale.x = 1;
    }else{
      this.skeletonMesh.scale.x = -1;
    }
  }
  

  public changeCheckPoint(index: number){
    this.checkPointIndex = index;
  }

  public currentCheckPoint(): CheckPoint{
    return this.checkpoints[this.checkPointIndex];
  }

  public nextCheckPoint(){
    this.changeCheckPoint(this.checkPointIndex + 1);
    //抵达终点
    if( this.currentCheckPoint() === undefined){
      this.exitMap();
    }
  }

  //到达终点，退出地图
  public exitMap(){
    this.exit = true;
    this.skeletonMesh.visible = false;
  }

  public setWaitingCounts(count: number){
    this.waitingConuts = count;
  }

  public isWaiting(): boolean{
    return this.waitingConuts > 0;
  }

  //单元格按一定比例转化为实际长宽
  cellChangetoNum (num){
    return num * 7;
  }

  //初始化spine小人
  public initSpine(){
    const atlasName = this.key + ".atlas";
    const skelName = this.key + ".skel";

    //使用AssetManager中的name.atlas和name.png加载纹理图集。
    //传递给TextureAtlas的函数用于解析相对路径。
    const atlas = spinesAssets.get(atlasName);

    //创建一个AtlasAttachmentLoader，用于解析区域、网格、边界框和路径附件
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
    //创建一个SkeletonJson实例来解析文件
    const skeletonJson = new spine.SkeletonBinary(atlasLoader);
    //设置在解析过程中应用的比例，解析文件，并创建新的骨架。
    skeletonJson.scale = 0.019;
    const skeletonData = skeletonJson.readSkeletonData(
        spinesAssets.get(skelName)
    );
    //从数据创建SkeletonMesh并将其附着到场景
    this.skeletonMesh = new spine.threejs.SkeletonMesh(skeletonData);
    let moveAnimation = skeletonData.animations.find(animation => {
      return animation.name.includes("Move");
    })
    this.skeletonMesh.state.setAnimation(
      0, 
      moveAnimation ? moveAnimation.name : "Move", 
      true
    );

    this.skeletonMesh.rotation.x = GameConfig.MAP_ROTATION;

    //初始不可见的
    this.skeletonMesh.visible = false;
  }


  public setSkelPosition(x: number, y: number){
    this.skeletonMesh.position.x = this.cellChangetoNum(x);
    this.skeletonMesh.position.y = this.cellChangetoNum(y-1/4);
    this.skeletonMesh.position.z = 0;
  }

}

export default Enemy;