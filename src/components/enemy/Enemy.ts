import * as THREE from "three";

import GameConfig from "@/components/utilities/GameConfig"
import { checkEnemyMotion, getAnimationSpeed } from "@/components/utilities/SpineHelper";
import { GC_Add } from "../game/GC";
import Action from "../game/Action";
import { Countdown } from "../game/CountdownManager";
import Tile from "../game/Tile";
import eventBus from "../utilities/EventBus";
import Global from "../utilities/Global";
import EnemyHandler from "../entityHandler/EnemyHandler";

interface AnimateTransition{
  //transAnimation: 是否有过渡动画
  //animationScale: 过渡动画执行速率
  //isWaitTrans: 进行过渡动画时是否停止移动
  //callback：结束过渡动画后的回调函数
  moveAnimate: string, 
  idleAnimate: string, 
  transAnimation: string, 
  animationScale?: number,
  isWaitTrans?: boolean, 
  callback?: Function
}

interface Watcher{
  function: Function,
  name: string,
}

//碰撞检测
interface DetectionParam{
  enemyKeys?: string[],
  tileKeys?: string[],
  detectionRadius: number,    //检测半径
  duration: number,           //检测间隔
  every: boolean,             //检测到第一个就停下，还是检测所有的
  callback: Function,  
}

class Enemy{
  static shadowMaterial = new THREE.MeshBasicMaterial( { 
    color: "#000000",
    transparent: true, // 启用透明度
    opacity: 0.8 // 设置透明度
  });

  static activeShadowMaterial = new THREE.MeshBasicMaterial( { 
    color: "#FF0000",
    transparent: true, // 启用透明度
    opacity: 0.8 // 设置透明度
  });

  public isEnemy = true;
  enemyData: EnemyData;  //原始data数据

  id: number;    //WaveManager中使用的id
  key: string;
  levelType: string;
  motion: string;       
  name: string;
  description: string;  
  icon: string;            //敌人头像URL
  notCountInTotal: boolean; //是否是非首要目标
  cantFinished: boolean = false;   //敌人是否可进点

  startTime: number;     //该敌人开始时间
  fragmentTime: number;  //分支开始时间

  applyWay: string;      //是否是远程 RANGED:远程 ALL:全部

  currentFrameSpeed: number;      //当前帧计算后的最终移速

  attributes: {[key: string]: number} = {};    //属性
  //属性乘区 每帧计算
  finalAttributes = {
    atk: 1,
    attackSpeed: 1,
    baseAttackTime: 1,
    def: 1,
    hpRecoveryPerSec: 1,
    magicResistance: 1,
    massLevel: 1,
    maxHp: 1,
    moveSpeed: 1,
    rangeRadius: 1,
  };    

  //属性乘区 每帧从gamebuff里面获取
  buffs: Buff[] = [];

  attackSpeed: number;
  attrChanges: {[key: string]: any[]}    //基础属性变化

  talents: any[];          //天赋
  skills: any[];           //技能
  position: THREE.Vector2;
  acceleration: THREE.Vector2;            //加速度
  inertialVector: THREE.Vector2;          //惯性向量
  velocity: THREE.Vector2;                //当前速度矢量
  faceToward: number = 1;                //1:右, -1:左
  halfBodyWidth: number = 0.2;
  obstacleAvoidanceVector: THREE.Vector2;  //避障力向量
  obstacleAvoidanceCalCount: number = 0;  //避障力计算计数（每3帧算一次）
  unitVector: THREE.Vector2;              //给定方向向量

  shadowOffset: Vec2;   //足坐标偏移
  tilePosition: THREE.Vector2;     //中心地块坐标

  hugeEnemy: boolean = false;    //是否是巨型敌人
  unMoveable: boolean = false;   //是否可移动
  public action: Action;
  route: EnemyRoute;
  checkPointIndex: number = 0;   //目前处于哪个检查点
  visualRoutes: any;             //可视化路线

  nextNode: PathNode;  //寻路目标点
  
  currentSecond: number = 0;      //敌人的当前时间

  public countdown: Countdown;  //倒计时
  public watchers: Watcher[] = [];

  isStarted: boolean = false;
  isFinished: boolean = false;
  exitCountDown: number = 0;   //隐藏spine的渐变倒计时

  public exit: boolean = false;

  public shadow: THREE.Mesh;
  public activeShadow: THREE.Mesh;
  public shadowHeight: number = 0.2;
  public attackRangeCircle: THREE.Line;         //攻击范围的圈
  
  //视图层面会修改到的选项
  public options = {
    AttackRangeVisible: null,
    CountDownVisible: null,
    RoutesVisible: null,         //是否可见路线

    attackRangeVisible: false,
    countDownVisible: true,
    routesVisible: false         //是否可见路线
  }


  public object: THREE.Object3D;

  protected animateState: string = "idle";  //当前处于什么动画状态 idle/move
  protected animations: any[];
  public moveAnimate: string;   //移动的动画名
  public idleAnimate: string;   //站立的动画名
  public meshOffset: Vec2;                //模型偏移
  public meshSize: Vec2;                //模型宽高
  protected ZOffset: number = 0;             //模型Z轴位移
  protected animationScale: number = 1.0;  //动画执行速率
  public isExtra: boolean = false;         //是否是额外出怪
  public simulateTrackTime: number;      //动画执行time
  protected transAnimationPlaying: boolean = false;       //是否正在播放转换动画

  public gractrlSpeed: number = 1;       //重力影响的速度倍率
  
  constructor(action: ActionData){

    this.enemyData = action.enemyData;
    this.startTime = action.startTime;
    this.fragmentTime = action.fragmentTime;

    const {
      key, levelType, motion, name, description, icon, applyWay, unMoveable, hugeEnemy,
      attributes, notCountInTotal, talents, skills, attrChanges, animations, moveAnimate, idleAnimate
    } = this.enemyData;

    this.key = key;
    this.levelType = levelType;

    this.name = name;
    this.description = description;
    this.applyWay = applyWay;
    this.notCountInTotal = notCountInTotal;
    this.hugeEnemy = hugeEnemy;
    this.unMoveable = unMoveable;
    this.talents = talents;
    this.skills = skills;
    this.icon = icon;
    // console.log(talents)
    this.attrChanges = attrChanges;
    
    this.attributes = attributes;

    // this.attributes["attackSpeed"] = attributes.baseAttackTime * 100 / attributes.attackSpeed;
    
    this.route = action.route;
    this.motion = checkEnemyMotion(this.key, motion);
    this.position = new THREE.Vector2();
    this.acceleration = new THREE.Vector2(0, 0);
    this.inertialVector = new THREE.Vector2(0, 0);
    this.velocity = new THREE.Vector2(0, 0);
    this.nextNode = null;

    //敌人阴影往下偏移
    this.shadowOffset  = {
      x: 0,
      y: -0.15
    };

    this.initOptions();

    const countdownManager = Global.countdownManager;
    this.countdown = countdownManager.getCountdownInst();

    this.animations = animations;
    this.moveAnimate = moveAnimate;
    this.idleAnimate = idleAnimate;
  }

  public start(){
    this.reset();
    
    this.handleTalents();
    this.handleSkills();
    this.isStarted = true;
    this.show();
    this.handleStart();
  }

  public reset(){

    this.setPosition(
      this.route.startPosition.x,
      this.route.startPosition.y
    );
    this.isStarted = false;
    this.isFinished = false;
    this.nextNode = null;
    this.animateState = 'idle';
    this.changeAnimation();
    this.changeCheckPoint(0)
  }

  public getIntPosition(): THREE.Vector2{
    const offset = 0.5;
    const x = Math.floor(this.position.x + offset);
    const y = Math.floor(this.position.y + offset);
    return new THREE.Vector2(x, y);
  }

  public setPosition(x:number, y: number){
    this.position.set(x, y);
    this.setObjectPosition(x, y);
  }

  public setObjectPosition(x: number, y: number){
    if(Global.gameManager.isSimulate || !this.object) return;

    const Vec2 = Global.gameManager.getCoordinate(x, y);

    this.object.position.x = Vec2.x;
    this.object.position.y = Vec2.y;

  }

  public setVelocity(velocity: THREE.Vector2){
    this.velocity = velocity;
  }
  
  public setRoute(route: EnemyRoute){
    this.route = route;
  }

  public changeCheckPoint(index: number){
    this.checkPointIndex = index;
  }

  public currentCheckPoint(): CheckPoint{
    return this.route.checkpoints[this.checkPointIndex];
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
    if( this.cantFinished ) return;
    this.isFinished = true;
    this,this.countdown.clearCountdown();
    EnemyHandler.finishedMap(this);
    
    if(!Global.gameManager.isSimulate){
      this.options.RoutesVisible = false;
      //敌人退出地图的渐变
      this.gradientHide();
    }else{
      this.hide();
    }
  }

  public initMesh(){
    this.object = new THREE.Object3D();
    GC_Add(this.object);

    this.initShadow();
    this.initAttackRangeCircle();
  }

  initShadow(){
    const majorAxis = Global.gameManager.getPixelSize(0.35); //椭圆长轴
    const minorAxis = Global.gameManager.getPixelSize(0.08); //椭圆短轴

    const path = new THREE.Shape();
    path.absellipse(
      0,0,
      majorAxis, minorAxis,
      0, Math.PI*2, 
      false,
      0
    );

    const geometry = new THREE.ShapeBufferGeometry( path );


    const shadow = new THREE.Mesh( geometry, Enemy.shadowMaterial );
    this.shadow = shadow;
    const activeShadow = new THREE.Mesh( geometry, Enemy.activeShadowMaterial );
    this.activeShadow = activeShadow;
    this.activeShadow.visible = false;

    shadow.position.z = this.shadowHeight;
    activeShadow.position.z = this.shadowHeight;
    
    const shadowOffset = Global.gameManager.getCoordinate(this.shadowOffset);
    shadow.position.x = shadowOffset.x;
    shadow.position.y = shadowOffset.y;

    activeShadow.position.x = shadowOffset.x;
    activeShadow.position.y = shadowOffset.y;
    this.object.add(shadow)
    this.object.add(activeShadow)
  }

  initAttackRangeCircle(){
    if(this.isRanged()){
      const radius = Global.gameManager.getPixelSize(this.attributes.rangeRadius);
      const curve = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        radius, radius,           // xRadius, yRadius
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
      );

      const points = curve.getPoints( 50 );
      const geometry = new THREE.BufferGeometry().setFromPoints( points );

      // 具有较高`renderOrder`的物体会在较低之后渲染（即后渲染，覆盖先渲染的）。
      // 但是，如果两个物体都在同一个场景中，并且使用同一个渲染调用，那么`renderOrder`是有效的。
      // 然而，如果平面Mesh的材质是透明的（即使是一点点透明），那么它会被归类到透明物体队列中，
      // 而线条即使设置了`renderOrder`也可能因为不透明和透明物体的分开渲染顺序而出现问题。
      // 所以这里需要设置transparent，不然会被具有透明度的tile texture给挡住
      const material = new THREE.LineBasicMaterial( { 
        color: 0xff0000,
        depthTest: false,
        transparent: true
      } );

      this.attackRangeCircle = new THREE.Line( geometry, material );

      //显示优先级最高
      this.attackRangeCircle.renderOrder = 100;
      this.attackRangeCircle.position.z = 0;
      this.attackRangeCircle.visible = false;
      this.object.add(this.attackRangeCircle)
    }

  }

  public isRanged(): boolean{
    return this.applyWay === "RANGED" || this.applyWay === "ALL";
  }

  public isFly(): boolean{
    return this.motion === "FLY";
  }

  //飞行单位根据是否在高台，修改阴影高度
  updateShadowHeight(){
    if(Global.gameManager.isSimulate || !this.isFly()) return;
    
    const x = Math.round(this.position.x);
    const y = Math.round(this.position.y);
    const currentTile = Global.tileManager.getTile(x, y);
    if( currentTile.passableMask === "ALL" ){
      //地面
      this.shadow.position.z = this.shadowHeight
      
    }else{
      //高台
      this.shadow.position.z = this.shadowHeight + currentTile.getPixelHeight();

    }

  }

  private getClosePoints(){
    const footPoint = new THREE.Vector2(
      this.position.x, this.position.y - 0.2
    );
    const left = new THREE.Vector2(
      footPoint.x - 0.2, footPoint.y
    );
    const right = new THREE.Vector2(
      footPoint.x + 0.2, footPoint.y
    );

    return {
      left, middle: footPoint, right
    }
  }

  public getRoundTile(){
    const x = this.tilePosition.x;
    const y = this.tilePosition.y;
    const tileManager = Global.gameManager.tileManager;
    return {
      leftTop: tileManager.getTile(x-1, y+1),
      top: tileManager.getTile(x, y+1),
      rightTop: tileManager.getTile(x+1, y+1),
      left: tileManager.getTile(x-1, y),
      right: tileManager.getTile(x+1, y),
      leftBottom: tileManager.getTile(x-1, y-1),
      bottom: tileManager.getTile(x, y-1),
      rightBottom: tileManager.getTile(x+1, y-1),
    }
  }

  //计算避障力
  public handleObstacleAvoidance(){
    const closePoints = this.getClosePoints();
    const roundTile = this.getRoundTile();

    const avoidances = new THREE.Vector2();
    Object.keys(roundTile).forEach(key => {
      let closePoint: THREE.Vector2;
      const tile: Tile = roundTile[key];
      if(tile && !tile.isPassable()){
        
        switch (key) {
          case "leftTop":
          case "left":
          case "leftBottom":
            closePoint = closePoints.left;
            break;
          case "top":
          case "bottom":
            closePoint = closePoints.middle;
            break;
          case "rightTop":
          case "right":
          case "rightBottom":
            closePoint = closePoints.right;
            break;
        }

        //最近点坐标-中心地块坐标
        const vec1 = closePoint.clone().addScaledVector(this.tilePosition, -1);

        //地块相对坐标:不可通行地块坐标-中心地块坐标
        const vec2 = tile.position.clone().addScaledVector(this.tilePosition, -1);
        const offsetVec = new THREE.Vector2(
          (Math.max(vec1.x * vec2.x, 0) - 0.25) * Math.abs(vec2.x),
          (Math.max(vec1.y * vec2.y, 0) - 0.25) * Math.abs(vec2.y)
        );



        const avoidance = new THREE.Vector2(0, 0);

        switch (key) {
          case "left":
          case "right":
          case "top":
          case "bottom":
            if(offsetVec.x > 0 || offsetVec.y > 0){
              avoidance.x = - offsetVec.x * vec2.x;
              avoidance.y= - offsetVec.y * vec2.y;
            }
            break;
          case "leftTop":
          case "leftBottom":
          case "rightTop":
          case "rightBottom":
            if(offsetVec.x > 0 && offsetVec.y > 0){
              const Average = -(offsetVec.x + offsetVec.y) / 2;
              avoidance.x = Average * vec2.x;
              avoidance.y = Average * vec2.y;
            }
            break;
        }

        avoidances.x = avoidances.x + avoidance.x;
        avoidances.y = avoidances.y + avoidance.y;
      }
    })

    let projection;
    avoidances.normalize();
    
    projection = this.unitVector.clone().multiplyScalar(avoidances.dot(this.unitVector));;

    this.obstacleAvoidanceVector = avoidances.addScaledVector(projection, -1);
  }

  public update(delta: number){
    if(this.isFinished) return;

    this.obstacleAvoidanceCalCount = Math.max(this.obstacleAvoidanceCalCount - 1, 0);

    this.updatePositions();
    this.updateAttrs();
    this.updateAction(delta);

    const watcherFuncs = this.watchers.map(watcher => watcher.function);
    watcherFuncs.forEach(watcherFunc => watcherFunc());
  }

  private updatePositions(){
    const oldPos = this.tilePosition;
    const newPos = new THREE.Vector2(
      Math.floor(this.position.x + 0.5),
      Math.floor(this.position.y + 0.5)
    );

    if(!oldPos || oldPos.x !== newPos.x || oldPos.y !== newPos.y){
      this.tilePosition = newPos;
      Global.tileManager.enterTile(newPos, this);
      if(oldPos) Global.tileManager.outOfTile(oldPos, this);
    }
    

  }

  private updateAction(delta: number) {
    //模拟动画时间
    this.currentSecond += delta;

    this.simulateTrackTime += this.deltaTrackTime(delta);

    if(this.countdown.getCountdownTime("checkPoint") > 0) return;

    const checkPoint: CheckPoint = this.currentCheckPoint();
    if( !checkPoint ) return;

    const {type, time, reachOffset} = checkPoint;
    switch (type) {
      case "MOVE":  
        if(this.countdown.getCountdownTime("waiting") > 0) return;
        if(this.countdown.getCountdownTime("waitAnimationTrans") > 0) return;

        //部分0移速的怪也有移动指令，例如GO活动的装备
        if(this.unMoveable || this.attributes.moveSpeed <= 0){
          return;
        }

        const currentPosition = this.position;

        const currentNode = Global.SPFA.getPathNode(
          this.currentCheckPoint().position,
          this.motion,
          this.tilePosition
        );
  
        if(!currentNode){
          //没有路径，直接忽略它
          //可能是一些放在无路径地面的敌人，或者是bug
          this.unMoveable = true;
          this.motion = "FLY";
          this.notCountInTotal = true;
          this.action.dontBlockWave = true;
            const tile = Global.tileManager.getTile(this.getIntPosition());
            this.ZOffset = tile.height;

          if(this.object){
            this.object.position.z = Global.gameManager.getPixelSize(this.ZOffset);
          }
          return;
        }
        this.updateNextNode(currentNode);

        let {position, nextNode} = this.nextNode;
        let targetPos = new THREE.Vector2(position.x,position.y);

        //当前地块没有nextnode，意为当前就是该检查点终点
        if(nextNode === null){
          //nextNode为null时，目前为检查点终点，这时候就要考虑偏移(reachOffset)了
          targetPos.x += reachOffset.x;
          targetPos.y += reachOffset.y;
        }
        
        // const roundX = Math.round(currentPosition.x)
        // const roundY = Math.round(currentPosition.y)

        // //光标距离最近地块中心的长度
        // const distanceToCenter = currentPosition.distanceTo(new THREE.Vector2(roundX, roundY))
        // console.log(distanceToCenter)

        //给定方向向量
        this.unitVector = new THREE.Vector2(
          targetPos.x - currentPosition.x,
          targetPos.y - currentPosition.y
        ).normalize();

        //计算当前移速
        this.updateCurrentFrameSpeed();
        const actualSpeed = this.currentFrameSpeed * 0.5;
        if(actualSpeed <= 0) return;

        //todo 重复代码
        const simVelocity = this.unitVector.clone().multiplyScalar(actualSpeed * delta);
        const simDistanceToTarget = currentPosition.distanceTo(targetPos);
        if(simVelocity.length() >= simDistanceToTarget){
          this.setPosition(targetPos.x, targetPos.y);
          this.velocity = simVelocity;
          this.nextNode = this.nextNode?.nextNode;

          //完成最后一个寻路点
          if( this.nextNode === null || this.nextNode === undefined ){
            this.nextCheckPoint();
          }
          this.changeFaceToward();
          this.updateShadowHeight();
          break;
        }
        //end 重复代码

        if(this.obstacleAvoidanceCalCount === 0){
          //计算避障力
          this.handleObstacleAvoidance();
          this.obstacleAvoidanceCalCount = 3;
        }

        //实际避障力
        const actualAvoidance = this.obstacleAvoidanceVector
          .clone()
          .multiplyScalar( 
            Math.max(this.inertialVector.length() / actualSpeed, 0.5)
          );

        //计算本帧位移需额外施加的加速度向量(也可以视为力，质量为1)：
        //加速度 = ClampMagnitude((给定方向 * 理论移速 - 惯性向量) * steeringFactor + 实际避障力, maxSteeringForce)。
        //ClampMagnitude会将向量的大小限制在给定数值内(此算式中将加速度向量的大小限制在maxSteeringForce以内)。
        // steeringFactor/maxSteeringForce为加速度相关的标量(即加速度为移速差的steeringFactor倍+实际避障力，
        // 但最多不大于maxSteeringForce)，根据敌人有所不同，对于地面敌人为8/10，对于飞行敌人为20/100，关卡未开启Steering时为100/100。
        const isWalk = this.motion === "WALK";
        const steeringFactor = isWalk? 8 : 20;
        const maxSteeringForce = isWalk? 10 : 100;
        //加速度
        this.acceleration = this.unitVector 
          .clone()
          .multiplyScalar(actualSpeed)
          .addScaledVector(this.inertialVector, -1)
          .multiplyScalar(steeringFactor)
          .add(actualAvoidance)
          .clampLength(0, maxSteeringForce)


        //再根据加速度计算本帧的移动速度向量：
        //移动速度向量 = ClampMagnitude(加速度 * 帧间隔 + 惯性向量, 理论移速)。
        //ClampMagnitude函数将移动速度向量的大小限制在了理论移速以下，因此理论移速是敌人自主移动时的移速上限。
        //在得到移动速度向量后，将此向量储存至惯性向量，供下一轮计算使用。
        const moveSpeedVec = this.acceleration
          .clone()
          .multiplyScalar(delta )
          .add(this.inertialVector)
          .clampLength(0, actualSpeed)
        
        this.inertialVector = moveSpeedVec;


          
        //最后用移动速度向量 * 帧间隔即可得到本帧的位移向量。
        const velocity = moveSpeedVec
          .clone()
          .multiplyScalar( delta);


        // const velocity = this.unitVector.clone().multiplyScalar(actualSpeed * perFrame);

        this.setVelocity(velocity);
        this.move();
          
        const distanceToTarget = currentPosition.distanceTo(targetPos);
        //到达检查点终点
        if( distanceToTarget <= 0.05 &&
          (this.nextNode === null || this.nextNode === undefined)
        ){
          this.nextCheckPoint();
        }

        this.changeFaceToward();
        this.updateShadowHeight();



        // console.log(actionEnemy.position)
        break;

      case "WAIT_FOR_SECONDS":               //等待一定时间
      case "WAIT_FOR_PLAY_TIME":             //等待至游戏开始后的固定时刻
      case "WAIT_CURRENT_FRAGMENT_TIME":     //等待至分支(FRAGMENT)开始后的固定时刻
      case "WAIT_CURRENT_WAVE_TIME":         //等待至波次(WAVE)开始后的固定时刻
        this.countdown.addCountdown({
          name: "checkPoint",
          initCountdown: this.getWaitTime(type, time),
          callback: () => {
            this.nextCheckPoint();
          }
        });
        break;

      case "DISAPPEAR":
        this.gradientHide();
        this.nextCheckPoint();
        this.update(delta);
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

  private updateNextNode(currentNode: PathNode){
    if(this.route.visitEveryTileCenter){
      
    }else if(this.route.visitEveryNodeCenter || this.route.visitEveryNodeStably){
      if(
        //兼容第一次执行的情况
        this.nextNode === null ||
        //当前nextNode既不是当前光标地块，也不是当前光标地块的nextNode，直接切换nextNode
        (this.nextNode !== currentNode.nextNode && this.nextNode !== currentNode)
      ){
        //如果currentNode没有nextNode，就是检查点终点
        this.nextNode = currentNode.nextNode ? currentNode.nextNode : currentNode;
      }else if(this.nextNode === currentNode){
        const arriveDistance = this.route.visitEveryNodeCenter? 0.05 : 0.25;
        //检查点终点
        if(currentNode.nextNode === null) return;

        //若自身光标坐标进入了经过的前一地块的nextNode，但还未到达此地块中心0.25半径范围内，则目标仍然为当前光标坐标所在地块中心
        const distance = this.position.distanceTo(currentNode.position as THREE.Vector2);

        if(distance <= arriveDistance){
          this.nextNode = currentNode.nextNode;
        }

      }
    }else{
      this.nextNode = currentNode.nextNode ? currentNode.nextNode : currentNode;
    }

  }

  private getWaitTime(type: string, time: number): number{
    let countDownTime = 0;
    switch (type){
      case "WAIT_FOR_SECONDS":
        countDownTime = time;
        break;
      case "WAIT_FOR_PLAY_TIME":
        countDownTime = time - Global.waveManager.gameSecond; 
        break;
      case "WAIT_CURRENT_FRAGMENT_TIME":
        countDownTime = time - Global.waveManager.waveSecond + this.fragmentTime;
        break;
      case "WAIT_CURRENT_WAVE_TIME": 
        countDownTime = time - Global.waveManager.waveSecond;
        break;
    }

    return countDownTime;
  }

  protected handleTrackTime(trackTime: number){}

  //视图相关的更新
  public render(delta: number){}

  protected deltaTrackTime(delta: number): number{
    const animationSpeed = getAnimationSpeed(this.key);
    const speedRate = animationSpeed === 1? 1 : this.speedRate();
    //只有更改了animationSpeed的敌人 需要通过当前移速修改动画速率
    return  delta * this.animationScale *
      Math.min(speedRate, 4) * 
      animationSpeed;
  }

  //视图层面的设置
  private initOptions(){

    Object.defineProperty(this.options, 'AttackRangeVisible', {
      get: () => {
        return this.options.attackRangeVisible;
      },
      set: (value) => {
        if(this.attackRangeCircle){
          this.options.attackRangeVisible = value;
          this.attackRangeCircle.visible = value;
        }
      }
    });

    Object.defineProperty(this.options, 'CountDownVisible', {
      get: () => {
        return this.options.countDownVisible;
      },
      set: (value) => {
        this.options.countDownVisible = value;
      }
    });

    Object.defineProperty(this.options, 'RoutesVisible', {
      get: () => {
        return this.options.routesVisible;
      },
      set: (value) => {
        const change = this.options.routesVisible !== value;

        if(change){
          this.options.routesVisible = value;

          //更改阴影颜色
          this.activeShadow.visible = value;
          this.shadow.visible = !value;

          if(this.options.routesVisible){
            eventBus.emit("changeSVGRoute", this.visualRoutes);
          }else{
            eventBus.emit("changeSVGRoute", []);
          }
        }

      }
    });

  }

  private resetFinalAttributes(){
    this.finalAttributes.atk = this.attributes.atk;
    this.finalAttributes.attackSpeed = this.attributes.attackSpeed;
    this.finalAttributes.baseAttackTime = this.attributes.baseAttackTime;
    this.finalAttributes.def = this.attributes.def;
    this.finalAttributes.hpRecoveryPerSec = this.attributes.hpRecoveryPerSec;
    this.finalAttributes.magicResistance = this.attributes.magicResistance;
    this.finalAttributes.massLevel = this.attributes.massLevel;
    this.finalAttributes.maxHp = this.attributes.maxHp;
    this.finalAttributes.moveSpeed = this.attributes.moveSpeed;
    this.finalAttributes.rangeRadius = this.attributes.rangeRadius;
  }

  private updateAttrs(){
    this.resetFinalAttributes();
    const muls = {
      atk: 1, attackSpeed: 1, baseAttackTime: 1, def: 1, hpRecoveryPerSec: 1,
      magicResistance: 1, massLevel: 1, maxHp: 1, moveSpeed: 1, rangeRadius: 1,
    }
    const adds = {
      atk: 0, attackSpeed: 0, baseAttackTime: 0, def: 0, hpRecoveryPerSec: 0,
      magicResistance: 0, massLevel: 0, maxHp: 0, moveSpeed: 0, rangeRadius: 0,
    }

    const applyedKeys = [];
    this.buffs.forEach(buff => {
      if(buff.overlay === false){
        if(applyedKeys.includes(buff.key)) return;
        applyedKeys.push(buff.key);
      }

      buff.effect?.forEach(effect => {
        if(effect.method === "add"){
          adds[effect.attrKey] += effect.value;
        }else if(effect.method === "mul"){
          muls[effect.attrKey] *= effect.value;
        }
      })
    })

    for (let attrKey in muls){
      this.finalAttributes[attrKey] *= muls[attrKey];
    }

    for (let attrKey in adds){
      this.finalAttributes[attrKey] += adds[attrKey];
    }
  }

  public getAttr(attrName: string){
    if(attrName === "moveSpeed") {
      return this.finalAttributes[attrName] * this.gractrlSpeed; 
    }
    return this.finalAttributes[attrName];
  }

  public addBuff(buff: Buff){
    Global.gameBuff.addEnemyBuff(this, buff);
  }

  public removeBuff(id: string){
    Global.gameBuff.removeEnemyBuff(this, id);
  }

  public updateCurrentFrameSpeed(){
    //如果重力影响速度，需要在计算速度之前先读取buffs
    if(Global.gameManager.gractrl){
      this.gractrlSpeed = Global.gameManager.gractrl.getGractrlMoveSpeed(this);
    }
    this.currentFrameSpeed = this.getAttr("moveSpeed");
  }

  //移速倍率
  public speedRate(): number{
    return this.currentFrameSpeed / this.attributes.moveSpeed;
  }


  private handleStart(){
    EnemyHandler.handleStart(this);
  }

  private handleTalents(){
    this.talents?.forEach(talent => {
      EnemyHandler.handleTalent(this, talent);
    })
  }

  private handleSkills(){
    // if(this.skills.length > 0) console.log(this.skills)
    
    this.skills?.forEach(skill => {
      EnemyHandler.handleSkill(this, skill);
    });
  }

  public getTalent(key: string){
    const find = this.talents.find(talent => talent.key === key);
    return find? find.value : null;
  }

  private getSkill(key: string){
    const find = this.skills.find(skill => skill.prefabKey === key);
    return find? find : null;
  }

  public addWatcher(watcher: Watcher){
    this.watchers.push(watcher);
  }

  public removeWatcher(name: string){
    const index = this.watchers.findIndex(watcher => watcher.name === name);
    if(index > -1){
      this.watchers.splice(index, 1);
    }
  }

  //检测物体
  public addDetection(detection: DetectionParam){
    const {enemyKeys, tileKeys, detectionRadius, duration, every, callback} = detection;

    let objs, keyName;
    if(enemyKeys){
      keyName = enemyKeys[0];
      objs = Global.waveManager.enemies.filter(enemy => enemyKeys.includes(enemy.key));
    }else if(tileKeys){
      keyName = tileKeys[0];
      objs = Global.tileManager.flatTiles.filter(tile => tileKeys.includes(tile.tileKey));
    }

    if(objs){
      this.countdown.addCountdown({
        name: `Detection$${keyName}`,
        initCountdown: 0,
        countdown: duration,
        callback: () => {
          for(let i = 0; i < objs.length; i++){
            const obj = objs[i];
            if(obj.isEnemy && (!obj.isStarted || obj.isFinished)) continue;

            const detectPos: THREE.Vector2 = obj.position;
            const distance = this.position.distanceTo(detectPos);
            
            if(distance <= detectionRadius){
              callback(obj);
              if(!every) break;
            }
          }
        }
      })
    }else{
      console.error("detection设置失败!")
    }
  }

  public show(){
    this.exit = false;
    if(!Global.gameManager.isSimulate && this.object) this.object.visible = true;
  }

  public hide(){  
    this.exit = true;
    if(!Global.gameManager.isSimulate && this.object) this.object.visible = false;
  }

  //渐变退出，用exitCountDown时间控制（不同的子类有不同的实现方法）
  private gradientHide(){  
    this.exit = true;
    if(!Global.gameManager.isSimulate) {
      this.exitCountDown = 1;
    }
  }

  public visible(): boolean{
    return this.isStarted && !this.exit;
  }

  //根据速度方向更换spine方向
  protected changeFaceToward(){
    if(this.velocity.x > 0.001) this.faceToward = 1;
    if(this.velocity.x < -0.001) this.faceToward = -1;
  }

  protected idle(){
    const prevAnimate = this.animateState;
    this.animateState = "idle";

    if(prevAnimate !== this.animateState){
      this.changeAnimation();
    }
  }

  protected move(){
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

  //动画状态机发生转换
  public animationStateTransition(transition: AnimateTransition){

    //transAnimation: 是否有过渡动画
    //isWaitTrans: 进行过渡动画时是否停止移动
    //callback：结束过渡动画后的回调函数
    const { moveAnimate, idleAnimate, transAnimation, animationScale, isWaitTrans, callback } = transition;
    const apply = () => {
      this.moveAnimate = moveAnimate;
      this.idleAnimate = idleAnimate;
      this.animationScale = 1;
      this.transAnimationPlaying = false;
      this.changeAnimation();
      if( callback ) callback();
    }

    if(transAnimation){
      
      const animationFind = this.animations.find( animation => animation.name === transAnimation);
      if(animationFind){
        if(animationScale) this.animationScale = animationScale;
        this.moveAnimate = transAnimation;
        this.idleAnimate = transAnimation;
        this.countdown.addCountdown({
          name: isWaitTrans ? "waitAnimationTrans" : "animationTrans",
          initCountdown: animationFind.duration / this.animationScale, 
          callback: apply
        });
          
        this.changeAnimation();
        this.transAnimationPlaying = true;
      }else{
        apply();
      }
      
    }else{
      apply();
    }
  }

  //更改动画
  public changeAnimation(){
    if(!this.transAnimationPlaying){
      this.simulateTrackTime = 0;
    }
  }

  //直接设置动画
  protected setAnimation(){
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
      faceToward: this.faceToward,
      nextNode: this.nextNode,
      isStarted: this.isStarted,
      currentSecond: this.currentSecond,
      isFinished: this.isFinished,
      idleAnimate: this.idleAnimate,
      moveAnimate: this.moveAnimate,
      animateState: this.animateState,
      animationScale: this.animationScale,
      transAnimationPlaying: this.transAnimationPlaying,
      shadowHeight: this.shadowHeight,
      exit: this.exit,
      simulateTrackTime: this.simulateTrackTime,
      obstacleAvoidanceVector: this.obstacleAvoidanceVector, 
      obstacleAvoidanceCalCount: this.obstacleAvoidanceCalCount,
      motion: this.motion,
      route: this.route,
      tilePosition: this.tilePosition,
      watchers: [...this.watchers],
      buffs: [...this.buffs]
    }

    return state;
  }
  
  public set(state){
    const {position, 
      acceleration,
      inertialVector,
      checkPointIndex, 
      faceToward,
      nextNode,
      isStarted, 
      isFinished, 
      animateState,
      idleAnimate,
      moveAnimate,
      animationScale,
      transAnimationPlaying,
      shadowHeight,
      exit,
      currentSecond,
      simulateTrackTime,
      obstacleAvoidanceVector,
      obstacleAvoidanceCalCount,
      motion,
      route,
      tilePosition,
      watchers,
      buffs
    } = state;

    this.setPosition(position.x, position.y);
    this.acceleration = acceleration;
    this.inertialVector = inertialVector;
    this.checkPointIndex = checkPointIndex;
    this.faceToward = faceToward;
    this.nextNode = nextNode;
    this.isStarted = isStarted;
    this.exit = exit;
    this.currentSecond = currentSecond;
    this.isFinished = isFinished;
    this.transAnimationPlaying = transAnimationPlaying;
    this.shadowHeight = shadowHeight;
    this.idleAnimate = idleAnimate;
    this.moveAnimate = moveAnimate;
    this.animateState = animateState;
    this.animationScale = animationScale;
    this.simulateTrackTime = simulateTrackTime;
    this.obstacleAvoidanceVector = obstacleAvoidanceVector;
    this.obstacleAvoidanceCalCount = obstacleAvoidanceCalCount;
    this.motion = motion;
    this.route = route;
    this.tilePosition = tilePosition;
    this.watchers = [...watchers];
    this.buffs = [...buffs];

    if(this.object){
      //恢复当前动画状态

      if(animateState){
        this.setAnimation();
      }

      if(simulateTrackTime){
        this.handleTrackTime(simulateTrackTime);
      }

      this.shadow.position.z = this.shadowHeight;
      this.visible()? this.show() : this.hide();
      this.changeFaceToward();
      this.updateShadowHeight();

      if(!isStarted || isFinished){
        //如果拖动模拟时间条到未开始或结束，就隐藏路线显示
        this.options.RoutesVisible = false;
      }

    }
    
  }

  public destroy(){
    this.route = null;
    this.nextNode = null;
    this.object = null;
  }

}

export default Enemy;