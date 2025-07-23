import * as THREE from "three";
import spine from "@/assets/script/spine-threejs.js";

import GameConfig from "@/components/utilities/GameConfig"
import GameManager from "../game/GameManager";
import { getSpineScale, checkEnemyMotion, getAnimationSpeed, getSkelOffset } from "@/components/utilities/SpineHelper"
import SPFA from "../game/SPFA";
import { GC_Add } from "../game/GC";
import MapTiles from "../game/MapTiles";

class Enemy{
  enemyData: EnemyData;  //原始data数据
  mapTiles: MapTiles;

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

  applyWay: string;      //是否是远程 RANGED:远程 ALL:全部
  moveSpeedAddons: {[key: string]: number} = {}; //移速倍率
  attributes: {[key: string]: number} = {};    //属性
  attackSpeed: number;
  attrChanges: {[key: string]: any[]}    //属性加成

  skills: any[];          //天赋
  position: THREE.Vector2;
  acceleration: THREE.Vector2;            //加速度
  inertialVector: THREE.Vector2;          //惯性向量
  velocity: THREE.Vector2;                //当前速度矢量
  faceToward: number = 1;                //1:右, -1:左

  shadowOffset: Vec2;   //足坐标偏移

  route: EnemyRoute;
  checkpoints: CheckPoint[];
  checkPointIndex: number = 0;   //目前处于哪个检查点

  SPFA: SPFA;
  targetNode: PathNode;  //寻路目标点
  
  startSecond: number = 0;      //进入地图的时间点
  waveSecond: number = 0;       //波次开始后过了多久（update传进来）

  targetWaitingSecond: number = 0;//等待到目标时间

  isStarted: boolean = false;
  isFinished: boolean = false;
  exitCountDown: number = 0;   //隐藏spine的渐变倒计时

  private rush;

  public spawnTime;             //模拟数据中的出生时间

  public exit: boolean = false;
  private skeletonData: any;     //骨架数据
  public skeletonMesh: any;
  public spine: THREE.Object3D;
  public shadow: THREE.Mesh;
  public shadowHeight: number = 0.2;
  public attackRangeCircle: THREE.Line;         //攻击范围的圈
  
  //视图层面会修改到的选项
  public options = {
    _attackRangeVisible: false,
    _countDownVisible: true
  }

  public skelOffset: Vec2;                //模型偏移
  public skelSize: Vec2;                //模型宽高

  private animateState: string = "idle";  //当前处于什么动画状态 idle/move
  private moveAnimate: string;   //skel 移动的动画名
  private idleAnimate: string;   //skel 站立的动画名
  public simulateTrackTime: number;      //动画执行time

  public gameManager: GameManager;

  
  constructor(wave: EnemyWave){
    this.enemyData = wave.enemyData;
    this.actionType = wave.actionType;
    this.startTime = wave.startTime;
    this.fragmentTime = wave.fragmentTime;
    this.waveTime = wave.waveTime;

    const {
      key, levelType, motion, name, description, icon, applyWay,
      attributes, notCountInTotal, skills, attrChanges
    } = this.enemyData;

    this.key = key;
    this.levelType = levelType;
    this.motion = checkEnemyMotion(this.key, motion);
    this.name = name;
    this.description = description;
    this.applyWay = applyWay;
    this.notCountInTotal = notCountInTotal;
    this.skills = skills;
    this.icon = icon;

    this.attrChanges = attrChanges;
    
    this.attributes = attributes;

    this.attributes["attackSpeed"] = attributes.baseAttackTime * 100 / attributes.attackSpeed;
    
    this.route = wave.route;
    this.checkpoints = [...this.route.checkpoints];

    this.position = new THREE.Vector2();
    this.acceleration = new THREE.Vector2(0, 0);
    this.inertialVector = new THREE.Vector2(0, 0);
    this.velocity = new THREE.Vector2(0, 0);
    this.targetNode = null;

    //敌人阴影往下偏移
    this.shadowOffset  = {
      x: 0,
      y: -0.15
    };

    this.initOptions();
    this.handleSkill();
  }

  public start(){
    this.reset();
    this.isStarted = true;
    this.show();
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
    this.animateState = 'idle';
    this.changeAnimation();
    this.changeCheckPoint(0)
    this.waveSecond = 0;
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
    if(this.spine){
      //敌人退出地图的渐变
      this.gradientHide();
    }else{
      this.hide();
    }
  }

  //初始化spine小人
  public initSpine(){
    //TODO 不同角度会导致spine看起来很奇怪，看能不能通过改mesh方向修复它
    //显示相关的数据为异步加载数据，会晚于构造函数调用
    const {skeletonData, moveAnimate, idleAnimate} = this.enemyData;
    if(!skeletonData) return;

    this.skeletonData = skeletonData;

    this.moveAnimate = moveAnimate;
    this.idleAnimate = idleAnimate;

    this.spine = new THREE.Object3D();

    GC_Add(this.spine);
    //从数据创建SkeletonMesh并将其附着到场景
    this.skeletonMesh = new spine.threejs.SkeletonMesh(this.skeletonData, function(parameters) {
      //不再进行深度检测，避免skel骨架和其他物体重叠时导致渲染异常的现象
      //重叠时显示哪个用mesh的renderOrder属性控制
			parameters.depthTest = false;
		}); 

    this.spine.add(this.skeletonMesh);
    
    const offsetY = this.motion === "WALK"? -1/4 : 0;
    const coordinateOffset = this.gameManager.getCoordinate(0, offsetY)
    
    this.skeletonMesh.position.x = coordinateOffset.x;
    this.skeletonMesh.position.y = coordinateOffset.y;

    const spineScale = getSpineScale(this);
    this.spine.scale.set(spineScale,spineScale,1);

    this.idle();

    this.skeletonMesh.rotation.x = GameConfig.MAP_ROTATION;
    this.skeletonMesh.position.z = this.motion === "WALK"? 
      this.gameManager.getPixelSize( 1/7) : this.gameManager.getPixelSize( 10/7);

    this.getSkelSize();
    this.initShadow();
    this.initAttackRangeCircle();

    this.changeAnimation();
    //初始不可见的
    this.hide();
  }

  public setSpinePosition(x: number, y: number){
    if(!this.spine) return;

    const Vec2 = this.gameManager.getCoordinate(x, y);

    this.spine.position.x = Vec2.x;
    this.spine.position.y = Vec2.y;

    this.skeletonMesh.renderOrder = -y;

    //todo
    // this.skeletonMesh.zOffset = 0.1;
  }

  //获取skel的大小，是实时运算出来的
  getSkelSize(){ 
    this.skelOffset = getSkelOffset(this);
    const skelSize = new THREE.Vector2();
    const skelOffset = new THREE.Vector2();

    this.skeletonMesh.skeleton.updateWorldTransform();
    this.changeAnimation();
    this.skeletonMesh.update(1)
    this.skeletonMesh.state.apply(this.skeletonMesh.skeleton);
    this.skeletonMesh.skeleton.getBounds(skelOffset, skelSize, [])

    const offsetX = -(skelOffset.x + skelSize.x / 2);
    const offsetY = -(skelOffset.y + skelSize.y / 2);

    this.skelOffset.y += offsetY * 6;
    this.skelSize = skelSize.multiplyScalar(getSpineScale(this));

    //恢复track的动画帧
    const track = this.skeletonMesh.state.getCurrent(0);
    track.trackTime = 0;

    // console.log(this.name)
    // console.log(`动态边界尺寸: ${this.skelSize.x} x ${this.skelSize.y}`);
    // console.log(`边界偏移量: (${offsetX}, ${offsetY})`);

  }

  initShadow(){
    const majorAxis = this.gameManager.getPixelSize(0.35); //椭圆长轴
    const minorAxis = this.gameManager.getPixelSize(0.08); //椭圆短轴

    const path = new THREE.Shape();
    path.absellipse(
      0,0,
      majorAxis, minorAxis,
      0, Math.PI*2, 
      false,
      0
    );

    const geometry = new THREE.ShapeBufferGeometry( path );
    const material = new THREE.MeshBasicMaterial( { 
      color: "#000000",
      transparent: true, // 启用透明度
      opacity: 0.8 // 设置透明度
    } );
    const shadow = new THREE.Mesh( geometry, material );

    this.shadow = shadow;
    shadow.position.z = this.shadowHeight;
    
    const shadowOffset = this.gameManager.getCoordinate(this.shadowOffset);
    shadow.position.x = shadowOffset.x;
    shadow.position.y = shadowOffset.y;
    this.spine.add(shadow)
  }

  initAttackRangeCircle(){
    if(this.isRanged()){
      const radius = this.gameManager.getPixelSize(this.attributes.rangeRadius);
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
      this.spine.add(this.attackRangeCircle)
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
    if(!this.spine || !this.isFly()) return;
    
    const x = Math.round(this.position.x);
    const y = Math.round(this.position.y);
    const currentTile = this.mapTiles.get(x, y);
    if( currentTile.passableMask === "ALL" ){
      //地面
      this.shadow.position.z = this.shadowHeight
      
    }else{
      //高台
      this.shadow.position.z = this.shadowHeight + currentTile.getPixelHeight();

    }

  }

  public update(delta: number, waveSecond: number, usedSecond: number){
    
    if(this.isFinished) return;
    //模拟动画时间
    
    this.waveSecond = waveSecond;
    if(!this.startSecond) this.startSecond = waveSecond;

    this.handleRush();
    if(this.countDown() > 0) return;

    const checkPoint: CheckPoint = this.currentCheckPoint();
    const {type, time, reachOffset} = checkPoint;
    
    switch (type) {
      case "MOVE":  
        //部分0移速的怪也有移动指令，例如GO活动的装备
        if(this.attributes.moveSpeed === 0){
          return;
        }

        const currentPosition = this.position;
        const currentNode = this.SPFA.getPathNode(
          this.currentCheckPoint().position,
          this.route.motionMode,
          currentPosition
        );

        //核心逻辑：目标地块一直是当前光标地块的nextNode，当前为终点目标地块则为光标地块
        //但是如果新地块是上个地块的nextNode，就进入新地块中心0.25半径再切换到新地块的nextNode  
        if(
          //兼容第一次执行的情况
          this.targetNode === null ||
          //是否到达新地块用this.targetNode !== currentNode.nextNode 判断，意思是当前目标node不是光标地块的nextNode
          //到达新地块，并且新地块不是上个地块的nextNode：直接将targetNode切换为新地块的nextNode
          (this.targetNode !== currentNode.nextNode && this.targetNode !== currentNode)
        ){
          
          //如果currentNode没有nextNode，就是检查点终点
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
          .multiplyScalar(steeringFactor * this.gameManager.gameSpeed)
          .clampLength(0, maxSteeringForce * this.gameManager.gameSpeed)

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
          .multiplyScalar( 1 / GameConfig.FPS * this.gameManager.gameSpeed);

        this.setVelocity(velocity);
        this.move();
        this.changeFaceToward();
        this.updateShadowHeight();

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
            this.waitingTo( time + this.waveSecond );
            break;
          case "WAIT_FOR_PLAY_TIME":
            this.waitingTo( time - usedSecond);  //存疑，不过几乎没有用过WAIT_FOR_PLAY_TIME
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
        this.gradientHide();
        this.nextCheckPoint();
        this.update(delta, this.waveSecond, usedSecond);
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

    this.simulateTrackTime += this.deltaTrackTime(delta);
  }

  //视图相关的更新
  public render(delta: number){

    if(this.spine){
      this.handleGradient();

      if(this.isStarted && !this.isFinished){
        this.skeletonMesh.update(
          this.deltaTrackTime(delta)
        )
      }
    }

  }

  private deltaTrackTime(delta: number): number{
    return  delta * 
      Math.min(this.speedRate(), 4) * 
      getAnimationSpeed(this.key);
  }

  //视图层面的设置
  private initOptions(){

    Object.defineProperty(this.options, 'attackRangeVisible', {
      get: () => {
        return this.options._attackRangeVisible;
      },
      set: (value) => {
        if(this.attackRangeCircle){
          this.options._attackRangeVisible = value;
          this.attackRangeCircle.visible = value;
        }
      }
    });

    Object.defineProperty(this.options, 'countDownVisible', {
      get: () => {
        return this.options._countDownVisible;
      },
      set: (value) => {
        this.options._countDownVisible = value;
      }
    });

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
    return this.attributes.moveSpeed * this.speedRate() * 0.5;
  }

  private handleSkill(){
    // console.log(this.skills)
    this.skills?.forEach(skill => {
      switch (skill.key) {
        case "rush":
          const {move_speed, interval, trig_cnt} = skill.value;
          if(move_speed && interval && trig_cnt){
            this.rush = skill.value;
          }
          
          break;
        case "revive":   //萨卡兹魔剑士、恶咒者
        case "sleepwalking": //钵海收割者
          const { unmove_duration } = skill.value;
          if( unmove_duration ){
            this.checkpoints.unshift({
              position: null,
              reachOffset: null,
              randomizeReachOffset: null,
              time: unmove_duration,
              type: "WAIT_FOR_SECONDS"
            })
          }

          break;
      }
    })
  }

  private handleRush(){
    if(this.rush){
      const {move_speed, interval, trig_cnt, predelay} = this.rush;
      const trigNum = 
      Math.min(
        Math.max(
          Math.round((this.currentSecond() - (predelay||0)) /  interval), 
          0
        ), 
        trig_cnt
      );
      this.moveSpeedAddons.rush = trigNum * move_speed + 1;
    }
  }

  //出生后过了多久
  private currentSecond(): number{
    return this.waveSecond - this.startSecond;
  }

  private waitingTo(time: number){
    this.targetWaitingSecond = time;
    
  }

  public countDown(): number{
    return this.targetWaitingSecond - this.waveSecond;
  }

  public show(){
    this.exit = false;
    if(this.spine) this.spine.visible = true;
  }

  public hide(){  
    this.exit = true;
    if(this.spine) this.spine.visible = false;
  }

  //渐变退出
  private gradientHide(){  
    this.exit = true;
    if(this.spine) {
      this.exitCountDown = 1;
    }
  }

  public visible(): boolean{
    return this.isStarted && !this.exit;
  }

  private handleGradient(){
    const color = this.skeletonMesh.skeleton.color;
    if(this.exit){
      //退出渐变处理
      if(this.exitCountDown > 0){
        color.r = 0;
        color.g = 0;
        color.b = 0;
        color.a = this.exitCountDown;
        this.exitCountDown -= 0.1;
        
        this.skeletonMesh.update(0)
      }else{
        this.hide();
        color.r = 1;
        color.g = 1;
        color.b = 1;
        color.a = 1;
      }
    }else{
      color.r = 1;
      color.g = 1;
      color.b = 1;
      color.a = 1;
    }
  }


  //根据速度方向更换spine方向
  private changeFaceToward(){
    if(this.velocity.x > 0.001) this.faceToward = 1;
    if(this.velocity.x < -0.001) this.faceToward = -1;
    

    if(this.spine) this.skeletonMesh.scale.x = this.faceToward;
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
    this.simulateTrackTime = 0;
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
      faceToward: this.faceToward,
      targetNode: this.targetNode,
      targetWaitingSecond: this.targetWaitingSecond,
      isStarted: this.isStarted,
      startSecond: this.startSecond,
      waveSecond: this.waveSecond,
      isFinished: this.isFinished,
      animateState: this.animateState,
      shadowHeight: this.shadowHeight,
      exit: this.exit,
      simulateTrackTime: this.simulateTrackTime
    }

    return state;
  }
  
  public set(state){
    const {position, 
      acceleration,
      inertialVector,
      checkPointIndex, 
      faceToward,
      targetNode, 
      targetWaitingSecond, 
      isStarted, 
      isFinished, 
      animateState,
      shadowHeight,
      exit,
      startSecond,
      waveSecond,
      simulateTrackTime
    } = state;

    this.setPosition(position.x, position.y);
    this.acceleration = acceleration;
    this.inertialVector = inertialVector;
    this.checkPointIndex = checkPointIndex;
    this.faceToward = faceToward;
    this.targetNode = targetNode;
    this.targetWaitingSecond = targetWaitingSecond;
    this.isStarted = isStarted;
    this.exit = exit;
    this.startSecond = startSecond;
    this.waveSecond = waveSecond;
    this.isFinished = isFinished;
    this.shadowHeight = shadowHeight;
    this.animateState = animateState;
    this.simulateTrackTime = simulateTrackTime;
    
    if(this.spine){
      //恢复当前动画状态
      if(animateState){
        this.changeAnimation();
      }
      
      //恢复当前动画帧
      if(simulateTrackTime && this.skeletonMesh){
        const track = this.skeletonMesh.state.getCurrent(0);
        track.trackTime = simulateTrackTime;
      }

      this.shadow.position.z = this.shadowHeight;
      this.visible()? this.show() : this.hide();
      this.changeFaceToward();
      this.updateShadowHeight();
    }

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
    }

  }

}

export default Enemy;