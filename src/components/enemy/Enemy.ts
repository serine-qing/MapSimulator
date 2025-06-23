import * as THREE from "three";
import spine from "@/assets/script/spine-threejs.js";
import spinesAssets from "@/components/assetManager/spinesAssets.js"

import {EnemyWave, CheckPoint, WayFindMap, EnemyRoute, WayFindNode} from "@/components/utilities/Interface.ts"

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

  position: number[] = [0, 0];

  route: EnemyRoute;
  checkpoints: CheckPoint[];

  wayFindMap: WayFindMap;  //当前使用的寻路地图  
  checkPointIndex: number = 0;   //目前处于哪个检查点
  waitingConuts: number = 0;    //等待时间计时器

  targetNode: WayFindNode;  //寻路目标点

  exit: boolean = false;
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
    this.position = this.route.startPosition;
    this.waitingConuts = 0;
    this.targetNode = null;
    this.changeCheckPoint(0)
    // this.action();
  }

  public setTargetNode(targetNode: WayFindNode){
    this.targetNode = targetNode;
  }

  public setPosition(x:number, y: number){
    this.position[0] = x;
    this.position[1] = y;
  }

  public changeCheckPoint(index: number){
    this.checkPointIndex = index;
  }

  public nextCheckPoint(){
    this.changeCheckPoint(this.checkPointIndex + 1);
  }

  public updateWaitingCounts(){
    if(this.waitingConuts > 0){
      this.waitingConuts --;
      if(this.waitingConuts === 0){
        //TODO 倒计时结束
      }
    }
  }

  //初始化spine小人
  initSpine(){

    //使用AssetManager中的name.atlas和name.png加载纹理图集。
    //传递给TextureAtlas的函数用于解析相对路径。
    const atlas = spinesAssets.get(this.atlasName);

    //创建一个AtlasAttachmentLoader，用于解析区域、网格、边界框和路径附件
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
    //创建一个SkeletonJson实例来解析文件
    const skeletonJson = new spine.SkeletonBinary(atlasLoader);
    //设置在解析过程中应用的比例，解析文件，并创建新的骨架。
    skeletonJson.scale = 0.019;
    const skeletonData = skeletonJson.readSkeletonData(
        spinesAssets.get(this.skeletonName)
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

    this.skeletonMesh.rotation.x = window.MAP_ROTATION;
    //初始是不可见的
    this.skeletonMesh.visible = false;
  }
  // setPosition(x, y){
  //   //四舍五入的整数坐标
  //   this.vec2.x = Math.round(x);
  //   this.vec2.y = Math.round(y);

  //   this.skeletonMesh.position.x = this.cellChangetoNum(x);
  //   this.skeletonMesh.position.y = this.cellChangetoNum(y-1/4);
  //   this.skeletonMesh.position.z = 0;
  // }
  //单元格按一定比例转化为实际长宽
  cellChangetoNum (num){
    return num * 7;
  }
}

export default Enemy;