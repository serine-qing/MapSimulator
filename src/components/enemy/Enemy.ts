import * as THREE from "three";
import spine from "@/assets/script/spine-threejs.js";

import {EnemyWave, CheckPoint, PathMap, EnemyRoute, PathNode} from "@/components/utilities/Interface"
import GameConfig from "@/components/utilities/GameConfig"
import GameManager from "../game/GameManager";
import { getSkelOffset, getSpineSize } from "@/components/utilities/SpineHelper"

class Enemy{
  id: number;    //EnemyManager中使用的id
  key: string;
  levelType: string;
  motion: string;       
  name: string;
  description: string;  
  actionType: string;      //敌人生成模式
  icon: string;            //敌人头像URL

  startTime: number;     //该敌人开始时间
  fragmentTime: number;  //分支开始时间
  waveTime: number;      //大波次开始时间

  rangeRadius: number;   //攻击范围
  moveSpeed: number;
  atk: number;
  def: number;
  magicResistance: number;
  maxHp: number;
  attackSpeed: number;

  position: THREE.Vector2;
  velocity: Vec2;                //当前速度矢量
  faceTo: number = 1;                //1:右, -1:左

  route: EnemyRoute;
  checkpoints: CheckPoint[];
  checkPointIndex: number = 0;   //目前处于哪个检查点

  targetNode: PathNode | null;  //寻路目标点
  
  currentSecond: number = 0;
  targetWaitingSecond: number = 0;//等待到目标时间

  isStarted: boolean = false;
  isFinished: boolean = false;

  private visible: boolean = false;
  private skeletonData: any;     //骨架数据
  public skeletonMesh: any;
  public spine: THREE.Object3D;
  private currentAnimate: string;//当前执行动画名
  private moveAnimate: string;   //skel 移动的动画名
  private idleAnimate: string;   //skel 站立的动画名

  public gameManager: GameManager;
  constructor(wave: EnemyWave){
    const enemyData = wave.enemyData;
    this.actionType = wave.actionType;
    this.startTime = wave.startTime;
    this.fragmentTime = wave.fragmentTime;
    this.waveTime = wave.waveTime;

    const {
      key, levelType, motion, name, description, rangeRadius, icon, attributes, 
      skeletonData, moveAnimate, idleAnimate
    } = enemyData;

    this.key = key;
    this.levelType = levelType;
    this.motion = motion;
    this.name = name;
    this.description = description;
    this.rangeRadius = rangeRadius;
    this.skeletonData = skeletonData;
    this.moveAnimate = moveAnimate;
    this.idleAnimate = idleAnimate;
    this.icon = icon;

    this.moveSpeed = attributes.moveSpeed;
    this.atk = attributes.atk;
    this.def = attributes.def;
    this.magicResistance = attributes.magicResistance;
    this.maxHp = attributes.maxHp;

    this.attackSpeed = attributes.baseAttackTime * 100 / attributes.attackSpeed;
    
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
    this.isStarted = false;
    this.isFinished = false;
    this.targetWaitingSecond = 0;
    this.targetNode = null;
    this.changeCheckPoint(0)
    this.currentSecond = 0;
    this.targetWaitingSecond = 0;
  }

  public setPosition(x:number, y: number){
    this.position.set(x, y);
    this.setSpinePosition(x, y);
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
      this.finishedMap();
    }
  }

  //到达终点，退出地图
  public finishedMap(){
    this.isFinished = true;
    this.hide();
  }

  //初始化spine小人
  public initSpine(){
    this.spine = new THREE.Object3D();
    
    //从数据创建SkeletonMesh并将其附着到场景
    this.skeletonMesh = new spine.threejs.SkeletonMesh(this.skeletonData);
    this.spine.add(this.skeletonMesh);

    const offset = getSkelOffset(this);
    const coordinateOffset = this.gameManager.getCoordinate(offset.x, offset.y)
    
    this.skeletonMesh.position.x = coordinateOffset.x;
    this.skeletonMesh.position.y = coordinateOffset.y;

    const spineSize = getSpineSize(this);
    this.spine.scale.set(spineSize,spineSize,1);

    this.idle();

    this.skeletonMesh.rotation.x = GameConfig.MAP_ROTATION;
    this.skeletonMesh.position.z = this.motion === "WALK"? 0 : 10;
    //初始不可见的
    this.hide();
  }

  public setSpinePosition(x: number, y: number){
    if(!this.spine) return;

    const Vec2 = this.gameManager.getCoordinate(x, y);
    
    this.spine.position.x = Vec2.x;
    this.spine.position.y = Vec2.y;
  }

  public update(currentSecond: number, usedSecond: number){
    this.currentSecond = currentSecond;
    if(this.isWaiting()) return;

    const checkPoint: CheckPoint = this.currentCheckPoint();
    const {type, time, reachOffset} = checkPoint;

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
        
        // this.targetPosition.set( targetPosition.x, targetPosition.y );
        let {position, nextNode} = this.targetNode;
        let targetPos = { //深拷贝
          x: position.x,
          y: position.y
        }

        let arrivalDistance = 0.05; //距离下个地块中心多少距离后才会更改方向
        if(nextNode === null){
          //nextNode为null时，目前为检查点终点，这时候就要考虑偏移(reachOffset)了
          targetPos.x += reachOffset.x;
          targetPos.y += reachOffset.y;
        }else{
          //还未到达此地块中心0.25半径范围内时，则目标仍然为当前光标坐标所在地块中心
          arrivalDistance = 0.25;
        }

        //移动单位向量
        const unitVector = new THREE.Vector2(
          targetPos.x - currentPosition.x,
          targetPos.y - currentPosition.y
        ).normalize();

        const moveDistancePerFrame = this.moveSpeed * this.gameManager.gameSpeed * 0.5/GameConfig.FPS;

        const velocity: Vec2 = {
          x: unitVector.x * moveDistancePerFrame,
          y: unitVector.y * moveDistancePerFrame
        } 

        this.setVelocity(velocity);
        this.changeToward();
        this.move();

        const distanceToTarget = currentPosition.distanceTo(
          (targetPos) as THREE.Vector2
        )

        //完成单个寻路点
        if( distanceToTarget <= arrivalDistance ){
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
            this.waitingTo( time + usedSecond);
            break;
          case "WAIT_CURRENT_FRAGMENT_TIME":
            this.waitingTo( time + this.fragmentTime );
            break;
          case "WAIT_CURRENT_WAVE_TIME": 
            this.waitingTo( time );
            break;
        }
        this.nextCheckPoint();
        break;

      case "DISAPPEAR":
        this.hide();
        this.nextCheckPoint();
        this.update(this.currentSecond, usedSecond);
        break;
      case "APPEAR_AT_POS":
        this.setPosition(
          checkPoint.position.x,
          checkPoint.position.y
        )
        this.show();
        this.nextCheckPoint();
        break;

    }

    if(this.velocity.x === 0 && this.velocity.y === 0){
      this.idle();
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

  public show(){
    this.visible = true;
    if(this.spine) this.skeletonMesh.visible = this.visible;
  }

  public hide(){  
    this.visible = false;
    if(this.spine) this.skeletonMesh.visible = this.visible;
  }

  //根据移动方向更换spine方向
  private changeToward(){
    if(this.velocity.x > 0){

      this.faceTo = 1;
    }else if(this.velocity.x < 0){

      this.faceTo = -1;
    }

    if(this.spine) this.skeletonMesh.scale.x = this.faceTo;
  }

  private idle(){
    this.changeAnimation(this.idleAnimate);
  }

  private move(){
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

      if(!this.spine) return;

      this.skeletonMesh.state.setAnimation(
        0, 
        this.currentAnimate, 
        true
      );

    }
  }

  public get(){
    const position = {
      x: this.position.x,
      y: this.position.y
    }
    const state = {
      position,
      checkPointIndex: this.checkPointIndex,
      targetNode: this.targetNode,
      targetWaitingSecond: this.targetWaitingSecond,
      isStarted: this.isStarted,
      isFinished: this.isFinished,
      currentAnimate: this.currentAnimate,
      visible: this.visible,
      faceTo: this.faceTo
    }

    return state;
  }
  
  public set(state){
    const {position, 
      checkPointIndex, 
      targetNode, 
      targetWaitingSecond, 
      isStarted, 
      isFinished, 
      currentAnimate,
      visible,
      faceTo
    } = state;

    this.setPosition(position.x, position.y);
    this.checkPointIndex = checkPointIndex;
    this.targetNode = targetNode;
    this.targetWaitingSecond = targetWaitingSecond;
    this.isStarted = isStarted;
    this.isFinished = isFinished;
    this.faceTo = faceTo;
    if(currentAnimate){
      this.changeAnimation(currentAnimate);
    }

    visible? this.show() : this.hide();
    this.changeToward();
  }

  public destroy(){
    this.route = null;
    this.checkpoints = null;
    this.targetNode = null;
    this.gameManager = null;
    this.skeletonData = null;

    if(this.spine){
      this.spine?.remove(this.skeletonMesh);
      this.spine = null;

      this.skeletonMesh?.dispose();
      this.skeletonMesh = null;
    }

  }

}

export default Enemy;