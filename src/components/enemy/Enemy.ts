import * as THREE from "three";
import spine from "@/assets/script/spine-threejs.js";

import {EnemyWave, CheckPoint, PathMap, EnemyRoute, PathNode} from "@/components/utilities/Interface"
import GameConfig from "@/components/utilities/GameConfig"
import GameManager from "../game/GameManager";
import { getSkelOffset, getSpineSize, checkEnemyMotion } from "@/components/utilities/SpineHelper"

class Enemy{
  enemyData: EnemyData;  //原始data数据

  id: number;    //EnemyManager中使用的id
  key: string;
  levelType: string;
  motion: string;       
  name: string;
  description: string;  
  actionType: string;      //敌人生成模式
  icon: string;            //敌人头像URL
  notCountInTotal: boolean; //是否是费首要目标

  startTime: number;     //该敌人开始时间
  fragmentTime: number;  //分支开始时间
  waveTime: number;      //大波次开始时间

  rangeRadius: number;   //攻击范围
  moveSpeed: number;
  moveSpeedAddons: {[key: string]: number} = {}; //移速倍率
  atk: number;
  def: number;
  magicResistance: number;
  maxHp: number;
  attackSpeed: number;

  talents: any[];          //天赋
  position: THREE.Vector2;
  acceleration: THREE.Vector2;            //加速度
  inertialVector: THREE.Vector2;          //惯性向量
  velocity: THREE.Vector2;                //当前速度矢量
  faceTo: number = 1;                //1:右, -1:左

  route: EnemyRoute;
  checkpoints: CheckPoint[];
  checkPointIndex: number = 0;   //目前处于哪个检查点

  targetNode: PathNode | null;  //寻路目标点
  
  startSecond: number = 0;      //进入地图的时间点
  currentSecond: number;        //敌人进入地图后运行的当前时间

  gameSecond: number = 0;
  targetWaitingSecond: number = 0;//等待到目标时间

  isStarted: boolean = false;
  isFinished: boolean = false;

  public spawnTime;             //模拟数据中的出生时间

  private visible: boolean = false;
  private skeletonData: any;     //骨架数据
  public skeletonMesh: any;
  public spine: THREE.Object3D;

  private animateState: string = "idle";  //当前处于什么动画状态 idle/move
  private moveAnimate: string;   //skel 移动的动画名
  private idleAnimate: string;   //skel 站立的动画名

  public gameManager: GameManager;
  constructor(wave: EnemyWave){
    this.enemyData = wave.enemyData;
    this.actionType = wave.actionType;
    this.startTime = wave.startTime;
    this.fragmentTime = wave.fragmentTime;
    this.waveTime = wave.waveTime;

    const {
      key, levelType, motion, name, description, rangeRadius, icon, 
      attributes, notCountInTotal, talents
    } = this.enemyData;

    this.key = key;
    this.levelType = levelType;
    this.motion = checkEnemyMotion(this.key, motion);
    this.name = name;
    this.description = description;
    this.rangeRadius = rangeRadius;
    this.notCountInTotal = notCountInTotal;
    this.talents = talents;
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
    this.acceleration = new THREE.Vector2(0, 0);
    this.inertialVector = new THREE.Vector2(0, 0);
    this.velocity = new THREE.Vector2(0, 0);

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
    this.gameSecond = 0;
  }

  public setPosition(x:number, y: number){
    this.position.set(x, y);
    this.setSpinePosition(x, y);
  }

  public setVelocity(velocity: THREE.Vector2){
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
    //TODO 不同角度会导致spine看起来很奇怪，看能不能通过改mesh方向修复它
    //显示相关的数据为异步加载数据，会晚于构造函数调用
    const {skeletonData, moveAnimate, idleAnimate} = this.enemyData;

    this.skeletonData = skeletonData;
    this.moveAnimate = moveAnimate;
    this.idleAnimate = idleAnimate;

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
    this.skeletonMesh.position.z = this.motion === "WALK"? 
      this.gameManager.getPixelSize( 1/7) : this.gameManager.getPixelSize( 10/7);
    this.changeAnimation();
    //初始不可见的
    this.hide();
  }

  public setSpinePosition(x: number, y: number){
    if(!this.spine) return;

    const Vec2 = this.gameManager.getCoordinate(x, y);

    this.spine.position.x = Vec2.x;
    this.spine.position.y = Vec2.y;
  }

  private getPathNode(x: number, y: number){
    const pathMap = this.currentCheckPoint().pathMap?.map;
    let currentNode = pathMap? pathMap[y]? pathMap[y][x] : null : null;
    return currentNode;
  }

  public update(gameSecond: number, usedSecond: number){
    if(this.isFinished) return;
    
    this.gameSecond = gameSecond;
    if(!this.startSecond) this.startSecond = gameSecond;

    this.currentSecond = gameSecond - this.startSecond;
    this.handleTalents();
    if(this.isWaiting()) return;

    const checkPoint: CheckPoint = this.currentCheckPoint();
    const {type, time, reachOffset} = checkPoint;
    
    switch (type) {
      case "MOVE":  
        //部分0移速的怪也有移动指令，例如GO活动的装备
        if(this.moveSpeed === 0){
          return;
        }

        const currentPosition = this.position;
        const intX = Math.floor(currentPosition.x + 0.5);
        const intY = Math.floor(currentPosition.y + 0.5);

        const currentNode = this.getPathNode(intX, intY);

        //核心逻辑：目标地块一直是当前光标地块的nextNode，当前为终点目标地块则为光标地块
        //但是如果新地块是上个地块的nextNode，就进入新地块中心0.25半径再切换到新地块的nextNode  
        if(
          //兼容第一次执行的情况
          this.targetNode === null ||
          //是否到达新地块用this.targetNode !== currentNode.nextNode 判断，意思是当前目标node不是光标地块的nextNode
          //到达新地块，并且新地块不是上个地块的nextNode：直接将targetNode切换为新地块的nextNode
          (this.targetNode !== currentNode.nextNode && this.targetNode !== currentNode)
        ){
          //以防万一，如果currentNode没有nextNode就是检查点终点，直接指定
          this.targetNode = currentNode.nextNode ? currentNode.nextNode : currentNode;
        }

        let {position, nextNode} = this.targetNode;
        let targetPos = new THREE.Vector2(position.x,position.y);

        let arrivalDistance = 0.05; //距离下个地块中心多少距离后才会更改方向
        //当前地块没有nextnode，意为当前就是该检查点终点
        if(nextNode === null){
          //nextNode为null时，目前为检查点终点，这时候就要考虑偏移(reachOffset)了
          targetPos.x += reachOffset.x;
          targetPos.y += reachOffset.y;
        }else{
          //若自身光标坐标进入了经过的前一地块的nextNode,
          //但还未到达此地块中心0.25半径范围内，则目标仍然为当前光标坐标所在地块中心
          arrivalDistance = 0.25;
        }

        // const roundX = Math.round(currentPosition.x)
        // const roundY = Math.round(currentPosition.y)

        // //光标距离最近地块中心的长度
        // const distanceToCenter = currentPosition.distanceTo(new THREE.Vector2(roundX, roundY))
        // console.log(distanceToCenter)
        
        //移动单位向量
        const unitVector = new THREE.Vector2(
          targetPos.x - currentPosition.x,
          targetPos.y - currentPosition.y
        ).normalize();

        // const simulateDistance = unitVector
        //   .clone()
        //   .multiplyScalar(this.actualSpeed())
        //   .add(currentPosition)
        //   .distanceTo(targetPos)

        // if(simulateDistance <= arrivalDistance){
        //   console.log("能到达！")
        // }

        //计算本帧位移需额外施加的加速度向量(也可以视为力，质量为1)：
        //加速度 = ClampMagnitude((给定方向 * 理论移速 - 惯性向量) * steeringFactor + 实际避障力, maxSteeringForce)。
        //ClampMagnitude会将向量的大小限制在给定数值内(此算式中将加速度向量的大小限制在maxSteeringForce以内)。
        // steeringFactor/maxSteeringForce为加速度相关的标量(即加速度为移速差的steeringFactor倍+实际避障力，
        // 但最多不大于maxSteeringForce)，根据敌人有所不同，对于地面敌人为8/10，对于飞行敌人为20/100，关卡未开启Steering时为100/100。
        const isWalk = this.motion === "WALK";
        const steeringFactor = isWalk? 8 : 20;
        const maxSteeringForce = isWalk? 10 : 100;
        //加速度
        this.acceleration = unitVector
          .clone()
          .multiplyScalar(this.actualSpeed())
          .addScaledVector(this.inertialVector, -1)
          .multiplyScalar(steeringFactor)
          .clampLength(0, maxSteeringForce)

        //再根据加速度计算本帧的移动速度向量：
        //移动速度向量 = ClampMagnitude(加速度 * 帧间隔 + 惯性向量, 理论移速)。
        //ClampMagnitude函数将移动速度向量的大小限制在了理论移速以下，因此理论移速是敌人自主移动时的移速上限。
        //在得到移动速度向量后，将此向量储存至惯性向量，供下一轮计算使用。
        const moveSpeedVec = this.acceleration
          .clone()
          .multiplyScalar(1 / GameConfig.FPS )
          .add(this.inertialVector)
          .clampLength(0, this.actualSpeed())
        
        this.inertialVector = moveSpeedVec;
        
        //最后用移动速度向量 * 帧间隔即可得到本帧的位移向量。
        const velocity = moveSpeedVec
          .clone()
          .multiplyScalar( 1 / GameConfig.FPS );

        this.setVelocity(velocity);
        this.changeToward();
        this.move();

        const distanceToTarget = currentPosition.distanceTo(targetPos);


        //第二种切换targetNode的逻辑，进入目标点中心一定范围
        if( distanceToTarget <= arrivalDistance ){
          this.targetNode = this.targetNode?.nextNode;
          //完成最后一个寻路点
          if( this.targetNode === null || this.targetNode === undefined ){
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
            this.waitingTo( time + this.gameSecond );
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
        this.update(this.gameSecond, usedSecond);
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

  //移速倍率
  public speedRate(): number{
    let speedRate = 1;
    const values = Object.values(this.moveSpeedAddons);
    if(values.length > 0){
      speedRate = Object.values(this.moveSpeedAddons).reduce((prev, key) => prev * key);
    }
    
    return speedRate;
  }

  //实际移速
  public actualSpeed(): number{
    return this.moveSpeed * this.speedRate() * 0.5;
  }

  private handleTalents(){
    this.talents?.forEach(talent => {
      switch (talent.key) {
        case "rush":
          const rush = talent.value;
          const {move_speed, interval, trig_cnt, predelay} = rush;
          const trigNum = 
          Math.min(
            Math.max(
              Math.round((this.currentSecond - (predelay||0)) /  interval), 
              0
            ), 
            trig_cnt
          );
          this.moveSpeedAddons.rush = trigNum * move_speed + 1;

          break;
      
      }

    })
  }

  private waitingTo(time: number){
    this.targetWaitingSecond = time;
  }

  private isWaiting(): boolean{
    return this.gameSecond < this.targetWaitingSecond;
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

    if(this.velocity.x > 0.001){

      this.faceTo = 1;
    }else if(this.velocity.x < -0.001){

      this.faceTo = -1;
    }

    if(this.spine) this.skeletonMesh.scale.x = this.faceTo;
  }

  private idle(){
    const prevAnimate = this.animateState;
    this.animateState = "idle";

    if(prevAnimate !== this.animateState){
      this.changeAnimation();
    }
  }

  private move(){
    this.setPosition(
      this.position.x + this.velocity.x,
      this.position.y + this.velocity.y
    );

    const prevAnimate = this.animateState;
    this.animateState = "move";

    if(prevAnimate !== this.animateState){
      this.changeAnimation();
    }
    
  }

  //更改动画
  private changeAnimation(){
    if(!this.spine) return;

    const animate = this.animateState === "idle"? this.idleAnimate : this.moveAnimate;
    
    if(animate){
      this.skeletonMesh.state.setAnimation(
        0, 
        animate, 
        true
      );
    }else{
      console.error(`${this.key}动画名获取失败！`)
    }


  }

  public get(){
    const position = {
      x: this.position.x,
      y: this.position.y
    }
    const state = {
      position,
      acceleration: this.acceleration,
      inertialVector: this.inertialVector,
      checkPointIndex: this.checkPointIndex,
      targetNode: this.targetNode,
      targetWaitingSecond: this.targetWaitingSecond,
      isStarted: this.isStarted,
      startSecond: this.startSecond,
      isFinished: this.isFinished,
      animateState: this.animateState,
      visible: this.visible,
      faceTo: this.faceTo
    }

    return state;
  }
  
  public set(state){
    const {position, 
      acceleration,
      inertialVector,
      checkPointIndex, 
      targetNode, 
      targetWaitingSecond, 
      isStarted, 
      isFinished, 
      animateState,
      visible,
      faceTo,
      startSecond,
    } = state;

    this.setPosition(position.x, position.y);
    this.acceleration = acceleration;
    this.inertialVector = inertialVector;
    this.checkPointIndex = checkPointIndex;
    this.targetNode = targetNode;
    this.targetWaitingSecond = targetWaitingSecond;
    this.isStarted = isStarted;
    this.startSecond = startSecond;
    this.isFinished = isFinished;
    this.faceTo = faceTo;
    this.animateState = animateState;
    if(animateState){
      this.changeAnimation();
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