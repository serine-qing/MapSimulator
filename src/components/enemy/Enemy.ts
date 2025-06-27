import * as THREE from "three";
import spine from "@/assets/script/spine-threejs.js";

import {EnemyWave, CheckPoint, PathMap, EnemyRoute, PathNode} from "@/components/utilities/Interface"
import GameConfig from "@/components/utilities/GameConfig"
import GameManager from "../game/GameManager";
let test= 0;
//TODO  敌人需要图像和数据分离
class Enemy{
  key: string;
  levelType: string;
  motion: string;       //
  name: string;
  description: string;  
  fragmentTime: number;  //分支开始时间

  rangeRadius: number;   //攻击范围
  moveSpeed: number;
  atk: number;
  def: number;
  magicResistance: number;
  maxHp: number;

  position: THREE.Vector2;
  velocity: Vec2;                //当前速度矢量

  route: EnemyRoute;
  checkpoints: CheckPoint[];
  checkPointIndex: number = 0;   //目前处于哪个检查点

  targetNode: PathNode | null;  //寻路目标点
  
  currentSecond: number = 0;
  targetWaitingSecond: number = 0;//等待到目标时间
  exit: boolean = false;

  public skeletonMesh: any;
  private currentAnimate: string;//当前执行动画名
  private moveAnimate: string;   //skel 移动的动画名
  private idleAnimate: string;   //skel 站立的动画名

  public gameManager: GameManager;
  constructor(wave: EnemyWave){
    const enemyData = wave.enemyData;
    this.key = enemyData.key;
    this.levelType = enemyData.levelType;
    this.motion = enemyData.motion;
    this.name = enemyData.name;
    this.description = enemyData.description;
    this.fragmentTime = wave.fragmentTime;

    this.rangeRadius = enemyData.rangeRadius;
    this.moveSpeed = enemyData.attributes.moveSpeed;
    this.atk = enemyData.attributes.atk;
    this.def = enemyData.attributes.def;
    this.magicResistance = enemyData.attributes.magicResistance;
    this.maxHp = enemyData.attributes.maxHp;

    this.route = wave.route;
    this.checkpoints = this.route.checkpoints;

    this.position = new THREE.Vector2();
    this.velocity = {
      x: 0,
      y: 0
    }

    this.targetNode = null;
  }

  public reset(){
    this.setPosition(
      this.route.startPosition.x,
      this.route.startPosition.y
    );
    this.targetWaitingSecond = 0;
    this.targetNode = null;
    this.changeCheckPoint(0)
    // this.action();
  }

  public setPosition(x:number, y: number){
    this.position.set(x, y);
    this.setSkelPosition(x, y);
  }

  public setVelocity(velocity: Vec2){
    this.velocity = velocity;
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

  //初始化spine小人
  public initSpine(spineManager){
    const sName = this.key.replace("enemy_", "");
    const atlasName = sName + "/" + this.key + ".atlas";
    const skelName = sName + "/" + this.key + ".skel";

    //使用AssetManager中的name.atlas和name.png加载纹理图集。
    //传递给TextureAtlas的函数用于解析相对路径。
    const atlas = spineManager.get(atlasName);

    //创建一个AtlasAttachmentLoader，用于解析区域、网格、边界框和路径附件
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
    //创建一个SkeletonJson实例来解析文件
    const skeletonJson = new spine.SkeletonBinary(atlasLoader);
    //设置在解析过程中应用的比例，解析文件，并创建新的骨架。
    skeletonJson.scale = 0.019;
    const skeletonData = skeletonJson.readSkeletonData(
      spineManager.get(skelName)
    );
    //从数据创建SkeletonMesh并将其附着到场景
    this.skeletonMesh = new spine.threejs.SkeletonMesh(skeletonData);

    const moveAnimation = skeletonData.animations.find( (animation: any ) => {
      return animation.name.includes("Move");
    })
    const idleAnimation = skeletonData.animations.find( (animation: any ) => {
      return animation.name.includes("Idle");
    })
    this.moveAnimate = moveAnimation ? moveAnimation.name : "Move";
    this.idleAnimate = idleAnimation ? idleAnimation.name : "Idle";

    this.idle();

    this.skeletonMesh.rotation.x = GameConfig.MAP_ROTATION;

    //初始不可见的
    this.skeletonMesh.visible = false;
  }

  public setSkelPosition(x: number, y: number){
    const Vec2 = this.gameManager.getCoordinate(x, y-1/4);
    this.skeletonMesh.position.x = Vec2.x;
    this.skeletonMesh.position.y = Vec2.y;
    this.skeletonMesh.position.z = 0;
  }

  public update(currentSecond: number){

    this.currentSecond = currentSecond;
    if(this.isWaiting()) return;

    const checkPoint: CheckPoint = this.currentCheckPoint();
    const {type, time, reachOffset} = checkPoint;
    
    // if(test++ >50) return;

    switch (type) {
      case "MOVE":  
        const pathMap = checkPoint.pathMap?.map;
        const currentPosition = this.position;

        if(this.targetNode === null){
          //第一次执行move 添加targetNode
          const intX = Math.floor(currentPosition.x + 0.5);
          const intY = Math.floor(currentPosition.y + 0.5);

          let cnode = pathMap? pathMap[intY]? pathMap[intY][intX] : null : null;
          
          if(cnode){
            //如果找不到nextNode，意味着目前就在检查点终点，那么设置目标为当前点cnode
            this.targetNode = cnode.nextNode ? cnode.nextNode : cnode;
          }else{
            throw new Error("未获取到寻路Node");
          }
          
        }

        // //targetNode为null时，目前为检查点终点，这时候就要考虑偏移(reachOffset)了
        // const targetPosition: Vec2 = this.targetNode? this.targetNode.position :;
        // if( this.targetNode === null){

        // }else{
          
        // }
        
        // this.targetPosition.set( targetPosition.x, targetPosition.y );
        let {position, nextNode} = this.targetNode;
        let targetPos = { //深拷贝
          x: position.x,
          y: position.y
        }
        if(nextNode === null){
          //nextNode为null时，目前为检查点终点，这时候就要考虑偏移(reachOffset)了
          targetPos.x += reachOffset.x;
          targetPos.y += reachOffset.y;
        }

        //移动单位向量
        const unitVector = new THREE.Vector2(
          targetPos.x - currentPosition.x,
          targetPos.y - currentPosition.y
        ).normalize(); 

        const moveDistancePerFrame = this.moveSpeed * GameConfig.GAME_SPEED * 1/60;

        const velocity: Vec2 = {
          x: unitVector.x * moveDistancePerFrame,
          y: unitVector.y * moveDistancePerFrame
        } 

        this.setVelocity(velocity);

        const distanceToTarget = currentPosition.distanceTo(
          (targetPos) as THREE.Vector2
        )

        //完成单个寻路点
        if( distanceToTarget <= 0.05 ){
          this.targetNode = this.targetNode?.nextNode;
          //完成最后一个寻路点
          if( this.targetNode === null || undefined ){
            this.nextCheckPoint();
          }
        }

        // console.log(actionEnemy.position)
        break;

      case "WAIT_FOR_SECONDS":               //等待一定时间
      case "WAIT_FOR_PLAY_TIME":             //等待至游戏开始后的固定时刻
      case "WAIT_CURRENT_FRAGMENT_TIME":     //等待至分支(FRAGMENT)开始后的固定时刻
      case "WAIT_CURRENT_WAVE_TIME":         //等待至波次(WAVE)开始后的固定时刻
        switch (type){
          case "WAIT_FOR_SECONDS":
            this.waitingTo( time + this.currentSecond );
            break;
          case "WAIT_FOR_PLAY_TIME":
            this.waitingTo( time );
            break;
          case "WAIT_CURRENT_FRAGMENT_TIME":
            this.waitingTo( time + this.fragmentTime );
            break;
          case "WAIT_CURRENT_WAVE_TIME": 
            this.waitingTo( time + this.currentSecond );
            break;
        }
        this.nextCheckPoint();
        break;
    }

    if(this.velocity.x === 0 && this.velocity.y === 0){
      this.idle();
    }else{
      this.move();
    }

    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  private waitingTo(time: number){
    this.targetWaitingSecond = time;
  }

  private isWaiting(): boolean{
    return this.currentSecond < this.targetWaitingSecond;
  }

  private idle(){
    this.changeAnimation(this.idleAnimate);
  }

  private move(){
    //根据移动方向更换spine方向
    if(this.velocity.x > 0){
      this.skeletonMesh.scale.x = 1;
    }else if(this.velocity.x < 0){
      this.skeletonMesh.scale.x = -1;
    }

    this.setPosition(
      this.position.x + this.velocity.x,
      this.position.y + this.velocity.y
    );
    this.changeAnimation(this.moveAnimate);
  }

  //更改动画
  private changeAnimation(animate: string){

    if(animate !== this.currentAnimate){

      this.currentAnimate = animate;
      this.skeletonMesh.state.setAnimation(
        0, 
        this.currentAnimate, 
        true
      );

    }
  }
}

export default Enemy;