import * as THREE from "three";
import { checkEnemyMotion, getAnimationSpeed } from "@/components/utilities/SpineHelper";
import { GC_Add } from "../game/GC";
import Action from "../game/Action";
import Tile from "../game/Tile";
import eventBus from "../utilities/EventBus";
import Global from "../utilities/Global";
import { getCoordinate, getPixelSize } from "../utilities/utilities";
import BattleObject from "./BattleObject";
import GameConfig from "../utilities/GameConfig";

const ZERO = {
  x: 0,
  y: 0
}

const healthBarWidth = getPixelSize(5/7);
const HealThBarGeometry = new THREE.PlaneGeometry(healthBarWidth, 0.4);
const HealThBarShadowMaterial = new THREE.MeshBasicMaterial({
  color: "#000000",
  transparent: true,
  opacity: 0.4,
  depthTest: false,
  depthWrite: false,
})

const HealThBarMaterial = new THREE.MeshBasicMaterial({
  color: "#d86c42",
  transparent: true,
  opacity: 1,
  depthTest: false,
  depthWrite: false,
})

const BossHealThBarMaterial = new THREE.MeshBasicMaterial({
  color: "#cb2b34",
  transparent: true,
  opacity: 1,
  depthTest: false,
  depthWrite: false,
})

interface AnimateTransition{
  //transAnimation: 是否有过渡动画
  //animationScale: 过渡动画执行速率
  //isWaitTrans: 进行过渡动画时是否停止移动
  //callback：结束过渡动画后的回调函数
  moveAnimate?: string, 
  idleAnimate?: string, 
  transAnimation?: string, 
  startLag?: number,         //transAnimation动画前摇
  endLag?: number,           //transAnimation动画后摇
  animationScale?: number,
  isWaitTrans: boolean, 
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

interface ChangeTileEvent{
  name: string,
  callback: Function
}

interface AddCheckPointParam{
  position?: Vec2 | THREE.Vector2,
  time?: number,
  callback?: Function,
  index?: number,
}

class Enemy extends BattleObject{
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
  level: number;
  levelType: string;
  motion: string;
  name: string;
  description: string;  
  icon: string;            //敌人头像URL
  dontBlockWave: boolean = false;  //是否不拦截波次
  notCountInTotal: boolean;        //是否是非首要目标
  cantFinished: boolean = false;   //敌人是否可进点

  cantWait: boolean = false;        //是否无视wait检查点

  startTime: number;     //该敌人开始时间
  fragmentTime: number;  //分支开始时间

  applyWay: string;      //是否是远程 RANGED:远程 ALL:全部
  nearFly: boolean = false;   //是否近地悬浮

  currentFrameSpeed: number;      //当前帧计算后的最终移速

  attributes: {[key: string]: number} = {};    //属性
  
  hp: number;
  die: boolean = false;
  canReborn: boolean = false;              //hp归零后是否可复活
  reborned: boolean = false;               //是否复活过
  canDie: boolean = true;

  healthBarShadow: THREE.Mesh;
  healthBar: THREE.Mesh;

  //属性乘区 每帧计算
  finalAttributes = {
    atk: 1,
    attackSpeed: 1,                 //攻击速度
    attackTime: 1,                   //实际攻击间隔
    baseAttackTime: 1,              //基础攻击间隔
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
  
  spawnOffset: THREE.Vector2;             //出生点偏移
  cursorPosition: THREE.Vector2;          //光标坐标
  position: THREE.Vector2;                //实体坐标
  acceleration: THREE.Vector2;            //加速度
  inertialVector: THREE.Vector2;          //惯性向量
  velocity: THREE.Vector2;                //当前速度矢量
  faceToward: number = 1;                //1:右, -1:左
  halfBodyWidth: number = 0.2;
  obstacleAvoidanceVector: THREE.Vector2;  //避障力向量
  obstacleAvoidanceCalCount: number = 0;  //避障力计算计数（每3帧算一次）
  unitVector: THREE.Vector2;              //给定方向向量
  forceMoved: boolean;                    //本帧强制设置过位置

  shadowOffset: Vec2;   //足坐标偏移
  tilePosition: THREE.Vector2;     //中心地块坐标

  dropOffRandomOffset: number;

  isAirborne: boolean = false;   //是否是空降单位（不从红门出）
  hugeEnemy: boolean = false;    //是否是巨型敌人
  unMoveable: boolean = false;   //是否可移动
  waitAnimationTrans: boolean = false; //是否正在等待动画完成
  public action: Action;
  
  route: EnemyRoute;
  checkPointIndex: number = 0;   //目前处于哪个检查点
  visualRoutes: any;             //可视化路线

  passengers: Enemy[] = [];      //装载的敌人数组
  maxPickUpCount: number = 0;    //最大可装载的敌人数量

  nextNode: PathNode;  //寻路目标点
  
  currentSecond: number = 0;      //敌人的当前时间
  
  public watchers: Watcher[] = [];
  private changeTileEvents: ChangeTileEvent[] = []; 

  isStarted: boolean = false;
  isFinished: boolean = false;
  exitCountDown: number = 0;   //隐藏spine的渐变倒计时

  public visible: boolean = false;
  public isDisappear: boolean = false;

  public hasShadow: boolean = true;
  public shadow: THREE.Mesh;
  public activeShadow: THREE.Mesh;
  public shadowHeight: number = 0.2;
  public attackRangeCircle: THREE.Line;         //攻击范围的圈
  private currentAttackRange: number;       //攻击范围的圈的半径
  
  //视图层面会修改到的选项
  public options = {
    AttackRangeVisible: null,
    CountDownVisible: null,
    RoutesVisible: null,         //是否可见路线

    attackRangeVisible: false,
    countDownVisible: true,
    routesVisible: false         //是否可见路线
  }

  public label: any;           //前端container所用label

  protected animateState: string = "idle";  //当前处于什么动画状态 idle/move
  protected currentAnimation: string;       //当前动画状态
  public startAnimate: string;  //入场动画
  public moveAnimate: string;   //移动的动画名
  public idleAnimate: string;   //站立的动画名
  public meshOffset: Vec2;                //模型偏移
  public meshSize: Vec2 = {
    x: 0, y: 0
  };                //模型宽高
  public ZOffset: number = 0;             //模型Z轴位移
  protected animationScale: number = 1.0;  //动画执行速率
  public isExtra: boolean = false;         //是否是额外出怪
  public simulateTrackTime: number = 0;      //动画执行time
  protected transAnimationPlaying: boolean = false;       //是否正在播放转换动画

  public gractrlSpeed: number = 1;       //重力影响的速度倍率
  public mesh: any;
  public meshContainer: THREE.Object3D;

  public carryContainer: THREE.Group;    //用于存放搭载、抓取、绑定物体的容器
  protected carryOffset: THREE.Vector3;  
  public carriedEnemyKey: string;         //搭载、抓取、绑定的enemykey

  public canAttack: boolean = false;
  public attackCountdown: number = 0;           //攻击间隔倒计时

  public initialState;                      //初始状态数据

  public spawnedEnemies: Enemy[] = [];      //（会召唤技能的敌人）召唤的敌人数组
  public spawnIndex: number = 0;            //当前应该spawn的敌人id

  protected unBalanceSpeed: number;         //当前失衡移动速度
  protected unBalanceVector: THREE.Vector2; //失衡移动方向
  protected boundCrashed: boolean = false;  //在本次失衡移动中是否撞过墙

  constructor(param: EnemyParam, enemyData: EnemyData){
    super();
    this.enemyData = enemyData;
    this.startTime = param.startTime;
    this.fragmentTime = param.fragmentTime;
    this.dontBlockWave = param.dontBlockWave;

    const {
      key, level, levelType, motion, name, description, icon, applyWay, unMoveable, hugeEnemy,
      attributes, notCountInTotal, talents, skills, attrChanges, animations, moveAnimate, idleAnimate
    } = this.enemyData;

    this.key = key;
    this.level = level;
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
    
    this.attributes = {...attributes};
    this.hp = attributes.maxHp;
    // this.attributes["attackSpeed"] = attributes.baseAttackTime * 100 / attributes.attackSpeed;
    
    this.route = param.route;

    this.isAirborne = this.route.isAirborne;
    this.visualRoutes = this.route.visualRoutes;
    this.motion = checkEnemyMotion(this.key, motion);
    const spawnOffset = this.route.spawnOffset; 
    this.spawnOffset = new THREE.Vector2(
      spawnOffset.x ? spawnOffset.x : 0,
      spawnOffset.y ? spawnOffset.y : 0
    );

    this.position = new THREE.Vector2();
    this.cursorPosition = new THREE.Vector2();
    this.acceleration = new THREE.Vector2(0, 0);
    this.inertialVector = new THREE.Vector2(0, 0);
    this.velocity = new THREE.Vector2(0, 0);
    this.nextNode = null;

    //敌人阴影往下偏移
    this.shadowOffset  = {
      x: 0,
      y: this.isFly()? 0 : GameConfig.GROUND_ENEMY_YOFFSET
    };

    this.initOptions();

    this.animations = animations;
    this.moveAnimate = moveAnimate;
    this.idleAnimate = idleAnimate;

    //构建three对象
    this.object = new THREE.Object3D();
    this.object.userData.enemy = this;
    GC_Add(this.object);

    this.carryContainer = new THREE.Group();
    this.carryContainer.visible = false;
    this.object.add(this.carryContainer);

    Global.gameHandler.handleEnemyConstructor(this);
  }

  public start(){
    this.reset();

    //初始get和set都要在各种handle之前，否则会干扰
    if(this.isSimulate()){
      this.initialState = this.get();
    }else{
      this.set(this.initialState)
    }
    
    this.handleTalents();
    this.handleSkills();
    this.isStarted = true;
    this.show();
    this.handleStart();
    Global.buffManager.applyAuraBuff(this);

    //入场动画
    if(this.isAirborne && this.startAnimate){
      this.canAttack = false;
      this.canUseSkill = false;
      this.animationStateTransition({
        transAnimation: this.startAnimate,
        isWaitTrans: true,
        callback: () => {
          this.canAttack = true;
          this.canUseSkill = true;
        }
      })
      //清除最开始1帧未切换动画状态
      if(this.mesh) this.mesh.update(0.001);
    }

    //更新tilePositon 防止enemy刚出现那帧就触发tile event导致的bug
    this.updatePositions();

    Global.waveManager.enemiesInMap.push(this);
  }

  public reset(){
    this.setPosition(
      this.route.startPosition.x + (this.route.spawnOffset.x || 0),
      this.route.startPosition.y + (this.route.spawnOffset.y || 0)
    );
    this.isStarted = false;
    this.isFinished = false;
    this.nextNode = null;
    this.animateState = 'idle';
    this.changeAnimation();
    this.changeCheckPoint(0);

  }

  public getIntPosition(): THREE.Vector2{
    const offset = 0.5;
    const x = Math.floor(this.position.x + offset);
    const y = Math.floor(this.position.y + offset);
    return new THREE.Vector2(x, y);
  }

  public setPosition(x:number, y: number){
    this.cursorPosition.set(x, y)
    this.position.set(x + this.spawnOffset.x, y + this.spawnOffset.y); //更新实体坐标

    this.setObjectPosition(
      this.position.x,
      this.position.y
    );
  }

  public setObjectPosition(x: number, y: number){
    if(this.isSimulate() || !this.object) return;

    const Vec2 = getCoordinate(x, y);

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
    const callback = this.currentCheckPoint()?.callback;
    callback && callback(this);
    
    this.changeCheckPoint(this.checkPointIndex + 1);

    if(this.cantWait){
      //跳过wait检查点
      while(this.currentCheckPoint()?.type?.includes("WAIT")){
        this.changeCheckPoint(this.checkPointIndex + 1);
      }
    }

    //抵达终点
    if( this.currentCheckPoint() === undefined){
      this.finishedMap();
    }
  }

  //到达终点，退出地图
  public finishedMap(){
    if( this.cantFinished ) return;
    this.isFinished = true;
    this.countdown.clearCountdown();
    Global.gameHandler.finishedMap(this);
    this.dropOff();
    
    if(!this.isSimulate()){
      this.options.RoutesVisible = false;
      const exitCountdown = this.hp <= 0 ? 2 : 1;
      //敌人退出地图的渐变
      this.disappear(exitCountdown);
    }else{
      this.hide();
    }
  }
  
  //设置搭载、抓起物体的偏移
  public setCarryOffset(offset: THREE.Vector3){
    this.carryOffset = offset;
    this.carryContainer.position.copy(offset);
  }

  public addCarryEnemy(key: string){
    this.carriedEnemyKey = key;
    if(this.isSimulate()) return;

    const mesh = Global.gameView.getEnemyMesh(key);
    this.carryContainer.add(mesh);
    this.carryContainer.visible = true;
  }
  
  public removeCarryEnemy(){
    this.carriedEnemyKey = null;
    if(this.isSimulate()) return;

    this.carryContainer.clear();
    this.carryContainer.visible = false;
    
  }

  public initMesh(){
    this.initShadow();
    this.drawAttackRangeCircle(this.attributes.rangeRadius);
  }

  public getMeshClone(): THREE.Object3D{
    return null;
  }

  private initShadow(){
    if(!this.hasShadow) return;
    const majorAxis = getPixelSize(0.28); //椭圆长轴
    const minorAxis = getPixelSize(0.06); //椭圆短轴

    const path = new THREE.Shape();
    path.absellipse(
      0,0,
      majorAxis, minorAxis,
      0, Math.PI*2, 
      false,
      0
    );

    const geometry = new THREE.ShapeGeometry( path );

    const shadow = new THREE.Mesh( geometry, Enemy.shadowMaterial );
    this.shadow = shadow;
    const activeShadow = new THREE.Mesh( geometry, Enemy.activeShadowMaterial );
    this.activeShadow = activeShadow;
    this.activeShadow.visible = false;

    shadow.position.z = this.shadowHeight;
    activeShadow.position.z = this.shadowHeight;
    
    const shadowOffset = getCoordinate(this.shadowOffset);
    shadow.position.x = shadowOffset.x;
    shadow.position.y = shadowOffset.y;

    activeShadow.position.x = shadowOffset.x;
    activeShadow.position.y = shadowOffset.y;
    this.object.add(shadow)
    this.object.add(activeShadow)
  }

  private initHealthBar(){
    if(!this.object) return;
    const healthBarShadow = new THREE.Mesh(HealThBarGeometry, HealThBarShadowMaterial);
    const healthBar = new THREE.Mesh(
      HealThBarGeometry, 
      this.levelType === "BOSS"? BossHealThBarMaterial : HealThBarMaterial
    );

    healthBarShadow.position.y = getPixelSize(-0.4);
    healthBar.position.y = getPixelSize(-0.4);
    
    healthBarShadow.renderOrder = 99;
    healthBar.renderOrder = 100;

    this.healthBarShadow = healthBarShadow;
    this.healthBar = healthBar;

    this.object.add(healthBarShadow);
    this.object.add(healthBar);
  }

  public setZOffset(ZOffset: number){
    this.ZOffset = ZOffset;
    if(this.object) this.object.position.z = ZOffset;
  }

  private updateAttackRangeCircle(rangeRadius: number){
    if(this.isRanged() && this.currentAttackRange !== rangeRadius){
      this.currentAttackRange = rangeRadius;
      this.object && this.drawAttackRangeCircle(rangeRadius);
    }

  }

  private drawAttackRangeCircle(rangeRadius: number){

    //0.25为地块半径0.5减去干员碰撞半径0.25得出的
    const radius = getPixelSize(rangeRadius - 0.25);
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

    if(this.attackRangeCircle){
      //移除旧的
      this.object.remove(this.attackRangeCircle);
      this.attackRangeCircle.geometry.dispose();
      "type" in this.attackRangeCircle.material && this.attackRangeCircle.material.dispose();
    }

    this.attackRangeCircle = new THREE.Line( geometry, material );

    //显示优先级最高
    this.attackRangeCircle.renderOrder = 100;
    this.attackRangeCircle.position.z = 0;
    this.attackRangeCircle.visible = this.options.AttackRangeVisible;
    this.object.add(this.attackRangeCircle)
  }

  public isRanged(): boolean{
    return this.applyWay === "RANGED" || this.applyWay === "ALL";
  }

  public isFly(): boolean{
    return this.motion === "FLY";
  }

  protected isSimulate(): boolean{
    return Global.gameManager.isSimulate;
  }

  //飞行单位根据是否在高台，修改阴影高度
  updateShadowHeight(){
    if(!this.hasShadow) return;
    if(this.isSimulate() || !this.isFly()) return;
    
    const x = Math.round(this.position.x);
    const y = Math.round(this.position.y);
    const currentTile = Global.tileManager.getTile(x, y);
    let shadowHeight;
    if( currentTile.passableMask === "ALL" ){
      //地面
      shadowHeight = this.shadowHeight;
      
    }else{
      //高台
      shadowHeight = this.shadowHeight + currentTile.getPixelHeight();
    }

    this.shadow.position.z = shadowHeight;
    this.activeShadow.position.z = shadowHeight;

  }

  private getClosePoints(){
    //足坐标：即敌人FootPoint所在位置。大部分情况下位于敌人的实体坐标偏移(0,-0.2)的位置
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
    if(this.unitVector.equals(ZERO)){
      this.obstacleAvoidanceVector = new THREE.Vector2(0, 0);
      return;
    }
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
    this.unitVector = new THREE.Vector2(0, 0);
    this.forceMoved = false;
    if(!this.isDisappear){
      this.updatePositions();
      this.updateAttrs();
      this.updateAttackRange();
      this.updateAttack(delta);
    }
    
    this.updateSkillSP(delta);
    if(!this.isDisappear) this.updateSkillState();
    
    if(this.unBalance){
      //失衡位移状态
      this.unBalanceMove(delta);
    }else{
      this.updateCurrentFrameSpeed();
      this.updateAction(delta);
      this.move(delta);
      this.updateCheckPoint();
      this.updateFaceToward();
    }


    if(this.hasMoved()){
      const prevAnimate = this.animateState;
      this.animateState = "move";

      if(prevAnimate !== this.animateState){
        this.changeAnimation();
      }
    }else{
      this.idle();
    }


    this.updateHP();
    this.updateSPBar();

    const watcherFuncs = this.watchers.map(watcher => watcher.function);
    watcherFuncs.forEach(watcherFunc => watcherFunc());
  }

  private updatePositions(){
    const outPos = this.tilePosition;
    const inPos = new THREE.Vector2(
      Math.floor(this.position.x + 0.5),
      Math.floor(this.position.y + 0.5)
    );

    if(!outPos || outPos.x !== inPos.x || outPos.y !== inPos.y){
      this.tilePosition = inPos;
      Global.tileManager.changeTile(outPos, inPos, this);
      this.changeTile(outPos, inPos);
    }

  }

  private changeTile(outPos: THREE.Vector2, inPos: THREE.Vector2){
    if( this.changeTileEvents.length > 0){
      const outTile = outPos && Global.tileManager.getTile(outPos.x, outPos.y);
      const inTile = inPos && Global.tileManager.getTile(inPos.x, inPos.y);
      this.changeTileEvents.forEach(event => {
        event.callback(outTile, inTile);
      });
    }

  }

  public addChangeTileEvent(event: ChangeTileEvent){
    const find = this.changeTileEvents.find(_event => _event.name === event.name);
    if(!find) this.changeTileEvents.push(event);
  }

  public removeChangeTileEvent(name: string){
    const index = this.changeTileEvents.findIndex(event => event.name === name);
    if(index > -1) this.changeTileEvents.splice(index, 1);
  }

  public setHighlandEnemy(){
    //没有路径，直接忽略它
    //可能是一些放在无路径地面的敌人，或者是bug
    this.unMoveable = true;
    this.notCountInTotal = true;
    this.dontBlockWave = true;
    const tile = Global.tileManager.getTile(this.getIntPosition());
    this.setZOffset( tile.height );
  }

  protected getTargetPostion(): THREE.Vector2{

    const checkPoint: CheckPoint = this.currentCheckPoint();
    let {position, nextNode} = this.nextNode;
    let targetPos = new THREE.Vector2(position.x,position.y);

    //当前地块没有nextnode，意为当前就是该检查点终点
    if(nextNode === null){
      //nextNode为null时，目前为检查点终点，这时候就要考虑偏移(reachOffset)了
      targetPos.x += checkPoint.reachOffset.x;
      targetPos.y += checkPoint.reachOffset.y;
    }

    return targetPos;
  }

  private updateAction(delta: number) {
    //模拟动画时间
    this.currentSecond += delta;

    this.simulateTrackTime += this.deltaTrackTime(delta);

    if(this.countdown.getCountdownTime("checkPoint") > 0) return;
    
    const checkPoint: CheckPoint = this.currentCheckPoint();
    if( !checkPoint ) return;

    const {type, time} = checkPoint;

    switch (type) {
      case "MOVE":  
      case "PATROL_MOVE":  
        if(this.countdown.getCountdownTime("waiting") > 0 || this.waitAnimationTrans) return;
        if(!this.canMove()) return;

        const currentNode = Global.SPFA.getPathNode(
          this.currentCheckPoint().position,
          this.motion,
          this.tilePosition
        );

        this.updateNextNode(currentNode);
        
        if(!this.nextNode){
          this.setHighlandEnemy();
          return;
        }

        const actualSpeed = this.currentFrameSpeed * 0.5;
        if(actualSpeed <= 0) return;

        const targetPos = this.getTargetPostion();

        //检查自身以理论移速移动时，光标坐标是否可在此帧内抵达这个目标，如果是，跳过后面所有步骤
        const simDistanceToTarget = this.cursorPosition.distanceTo(targetPos);
        if(actualSpeed * delta >= simDistanceToTarget){
          this.setPosition(targetPos.x, targetPos.y);
          this.forceMoved = true;
          break;
        }
        //end 

        //给定方向向量
        this.unitVector = new THREE.Vector2(
          targetPos.x - this.cursorPosition.x,
          targetPos.y - this.cursorPosition.y
        ).normalize();
        break;

      case "WAIT_FOR_SECONDS":               //等待一定时间
      case "WAIT_FOR_PLAY_TIME":             //等待至游戏开始后的固定时刻
      case "WAIT_CURRENT_FRAGMENT_TIME":     //等待至分支(FRAGMENT)开始后的固定时刻
      case "WAIT_CURRENT_WAVE_TIME":         //等待至波次(WAVE)开始后的固定时刻
        const waitTime = this.getWaitTime(type, time);
        this.countdown.addCountdown({
          name: "checkPoint",
          initCountdown: waitTime,
          callback: () => {
            this.nextCheckPoint();
            Global.gameHandler.handleEnemyWaitFinish(this, waitTime)
          }
        });
        Global.gameHandler.handleEnemyWait(this, waitTime)
        break;

      case "DISAPPEAR":
        this.disappear(1);
        this.nextCheckPoint();
        this.update(delta);
        break;
      case "APPEAR_AT_POS":
        this.appearAt(checkPoint.position);
        this.nextCheckPoint();
        break;

    }

  }

  private updateNextNode(currentNode: PathNode){
    if(!currentNode) return;
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
        this.changeTowardByNode();
      }else if(this.nextNode === currentNode){
        const arriveDistance = this.route.visitEveryNodeCenter? 0.05 : 0.25;
        //检查点终点
        if(currentNode.nextNode === null) return;

        //若自身光标坐标进入了经过的前一地块的nextNode，但还未到达此地块中心0.25半径范围内，则目标仍然为当前光标坐标所在地块中心
        const distance = this.cursorPosition.distanceTo(currentNode.position as THREE.Vector2);

        if(distance <= arriveDistance){
          this.nextNode = currentNode.nextNode;
          this.changeTowardByNode();
        }

      }
    }else{
      const old = this.nextNode;
      this.nextNode = currentNode.nextNode ? currentNode.nextNode : currentNode;
      if(old !== this.nextNode) this.changeTowardByNode();
    }

  }

  private updateHP(){
    this.hp = Math.clamp(this.hp, 0, this.attributes.maxHp);

    this.updateHPBar();
    if(this.hp <= 0 ){
      if(this.canReborn){
        this.canDie = false;
        this.reborn();
      }else if(this.canDie){
        this.animationStateTransition({
          transAnimation: "Die",
          isWaitTrans: true
        })
        this.die = true;
        this.handleDie();
        this.finishedMap();
      }
      
    }
  }

  public changeHP(value: number){
    this.hp += value;
  }

  //重生动画结束
  public overRebornDuration(){
    this.canDie = true;
  }

  //复活处理，一般是boss
  private reborn(){
    this.reborned = true;
    Global.gameHandler.handleReborn(this);
  }

  private updateHPBar(){
    if(this.hp < this.attributes.maxHp){
      !this.healthBar && this.initHealthBar();
      if(this.healthBar){
        const hpRate = this.hp / this.attributes.maxHp;
        
        this.healthBar.visible = true;
        this.healthBarShadow.visible = true;
        this.healthBar.scale.x = hpRate;
        this.healthBar.position.x = - healthBarWidth * (1 - hpRate) / 2;
      }
    }else{
      if(this.healthBar){
        this.healthBar.visible = false;
        this.healthBarShadow.visible = false;
      }
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
    return  delta / this.animationScale *
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
    this.finalAttributes.attackTime = this.attributes.baseAttackTime;
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

    this.finalAttributes.attackTime = this.finalAttributes.baseAttackTime * 100 / this.finalAttributes.attackSpeed;
  }

  private updateAttackRange(){
    this.updateAttackRangeCircle(this.getAttr("rangeRadius"));
    
  }

  public getAttr(attrName: string){
    if(attrName === "moveSpeed") {
      return this.finalAttributes[attrName] * this.gractrlSpeed; 
    }
    return this.finalAttributes[attrName];
  }

  public updateAttack(delta: number){
    if(this.attackCountdown > 0){
      this.attackCountdown = Math.max(this.attackCountdown - delta, 0);
    }
    if(!this.canAttack || this.unBalance || this.attackCountdown > 0) return;
    this.attack();
    this.attackCountdown = this.getAttr("attackTime");
  }

  public attack(){
    Global.gameHandler.handleAttack(this);
  }

  public addBuff(buff: Buff){
    this.removeBuff(buff.id);
    this.buffs.push(buff);

    if(buff.duration){
      this.countdown.addCountdown({
        name: buff.id,
        initCountdown: buff.duration,
        callback: () => {
          this.removeBuff(buff.id)
        }
      })
    }
  }

  public removeBuff(id: string){
    const findIndex = this.buffs.findIndex(buff => buff.id === id);
    if(findIndex > -1) {
      this.buffs.splice(findIndex, 1);
    }
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
    Global.gameHandler.handleEnemyStart(this);
  }

  private handleTalents(){
    this.talents?.forEach(talent => {
      Global.gameHandler.handleTalent(this, talent);
    })
  }

  private handleSkills(){
    // if(this.skills.length > 0) console.log(this.skills)
    
    this.skills?.forEach(skill => {
      Global.gameHandler.handleSkill(this, skill);
    });
  }

  private handleDie(){
    Global.gameHandler.handleDie(this);
  }

  public getTalent(key: string){
    const find = this.talents.find(talent => talent.key === key);
    return find? find.value : null;
  }

  public getSkill(key: string){
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
    }else if(tileKeys){
      keyName = tileKeys[0];
      objs = Global.tileManager.flatTiles.filter(tile => tileKeys.includes(tile.tileKey));
    }

    if(keyName){
      this.countdown.addCountdown({
        name: `Detection$${keyName}`,
        initCountdown: 0,
        countdown: duration,
        callback: () => {
          if(this.isDisappear) return;

          if(enemyKeys){
            objs = Global.waveManager.enemiesInMap.filter(enemy => enemyKeys.includes(enemy.key));
          }
          for(let i = 0; i < objs.length; i++){
            const obj = objs[i];
            if(obj.isEnemy && (!obj.isStarted || obj.isFinished)) continue;
            if(obj.isDisappear) continue;

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

  //装载
  public pickUp(enemy: Enemy){
    if(!this.isFullyLoaded()){
      this.passengers.push(enemy);
      enemy.disappear();
      Global.gameHandler.handlePickUp(enemy, this);
    }
  }

  //卸载
  //randomOffset:卸客区域为以自身为中心的randomOffset边长正方形范围
  public dropOff(){
    while(this.passengers.length > 0){
      const enemy = this.passengers.shift();
      let dropPos: Vec2;
      const randomOffset = this.dropOffRandomOffset;
      if(randomOffset){
        const randomX = Global.seededRandom.nextFloat(0, randomOffset);
        const randomY = Global.seededRandom.nextFloat(0, randomOffset);
        dropPos = {
          x: this.position.x + randomX - randomOffset / 2,
          y: this.position.y + randomY - randomOffset / 2
        };
      }else{
        dropPos = this.position;
      }

      enemy.route = this.route;
      //进入蓝门掉落敌人的时候 checkPointIndex已经超过数值上限
      enemy.checkPointIndex = Math.min(this.checkPointIndex, this.route.checkpoints.length - 1);
      enemy.nextNode = this.nextNode;
      enemy.visualRoutes = this.visualRoutes;
      enemy.appearAt(dropPos);
      Global.gameHandler.handleDropOff(enemy, this);

    }
  }

  //是否满载
  public isFullyLoaded(): boolean{
    return this.passengers.length >= this.maxPickUpCount;
  }

  public show(){
    this.visible = true;
    if(!this.isSimulate() && this.object) this.object.visible = true;
  }

  public hide(){  
    this.visible = false;
    if(!this.isSimulate() && this.object) {
      if(!this.isStarted || this.isFinished){
        
        //如果拖动模拟时间条到未开始或结束，就隐藏路线显示
        this.options.RoutesVisible = false;
      }
      this.object.visible = false;
    };
  }

  //渐变退出，用exitCountDown时间控制（不同的子类有不同的实现方法）
  public disappear(countDown?: number){

    this.isDisappear = true;
    
    if(!this.isSimulate()) {
      this.exitCountDown = countDown? countDown : 1;
    }else{
      this.hide();
    }
  }

  public appearAt(position: Vec2){
    
    this.setPosition(
      position.x,
      position.y
    )

    this.exitCountDown = 0;
    this.isDisappear = false;
    this.show();
  } 

  protected updateFaceToward(){}

  //根据速度方向更换spine方向
  private changeTowardBySpeed(){
    if(this.key === "enemy_10072_mpprhd") return; //侵入式调用

    if(this.unitVector.x > 0.1) this.faceToward = 1;
    else if(this.unitVector.x < -0.1) this.faceToward = -1;
  }

  private changeTowardByNode(){
    if(this.key === "enemy_10072_mpprhd") return; //侵入式调用

    let nextNode = this.nextNode;
    let offsetX;
    while(nextNode){
      offsetX = this.tilePosition.x - nextNode.position.x;
      if(offsetX !== 0) break;
      nextNode = nextNode.nextNode;
    }

    if(!offsetX){
      const checkPoints = this.route.checkpoints;
      for(let i = this.checkPointIndex; i < checkPoints.length; i++){
        const current = checkPoints[i];
        if(current.type === "DISAPPEAR") break;
        else if(current.type !== "MOVE" && current.type !== "PATROL_MOVE") continue;
        const targetPos = current.position;
        const reachOffsetX = current.reachOffset.x;
        
        offsetX = this.tilePosition.x - targetPos.x - reachOffsetX;

        if(offsetX !== 0) break;
      }
    }

    if(offsetX){
      this.faceToward = offsetX < 0? 1 : -1;
    }

  }

  public idle(){
    const prevAnimate = this.animateState;
    this.animateState = "idle";

    if(prevAnimate !== this.animateState){
      this.changeAnimation();
    }
  }
  
  //是否具有移动能力
  protected canMove(): boolean{
    //部分0移速的怪也有移动指令，例如GO活动的装备
    if(this.isDisappear || this.unMoveable || this.unBalance || this.attributes.moveSpeed <= 0){
      return false;
    }

    return true;
  }

  //禁止移动
  public unableMove(){
    this.unMoveable = true;
  }

  //允许移动
  public enableMove(){
    this.unMoveable = false;
  }

  protected move(delta: number){
    if(this.forceMoved || !this.canMove()) return;
    if(this.unitVector.equals(ZERO) && this.inertialVector.length() < 0.0001){
      //惯性低于万分之一后已经没有计算价值了
      return;
    }

    if(this.obstacleAvoidanceCalCount === 0){
      //计算避障力
      this.handleObstacleAvoidance();
      this.obstacleAvoidanceCalCount = 2;
    }
    
    const actualSpeed = this.currentFrameSpeed * 0.5;

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
    let steeringFactor = isWalk? 8 : 20;

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

    this.setPosition(
      this.cursorPosition.x + this.velocity.x,
      this.cursorPosition.y + this.velocity.y
    );

    this.changeTowardBySpeed();
    this.updateShadowHeight();
    
    this.velocity.x = 0;
    this.velocity.y = 0; 
  }

  protected hasMoved(): boolean{
    return this.forceMoved || !this.unitVector.equals(ZERO)
  }

  protected updateCheckPoint(){
    if(!this.hasMoved()) return;
    
    const targetPos = this.getTargetPostion();
    const distanceToTarget = this.cursorPosition.distanceTo(targetPos);
    //到达检查点终点
    if( distanceToTarget <= 0.05 &&
      (!this.nextNode.nextNode)
    ){
      this.nextCheckPoint();
    }
  }

  public clearCheckPoint(){
    this.route = {...this.route};
    this.route.checkpoints = [];
    this.checkPointIndex = 0;
  }

  public addWaitCheckPoint(param: AddCheckPointParam){
    const {time, callback, index} = param;

    const checkPoint: CheckPoint = {
      position: null,
      type: "WAIT_FOR_SECONDS",
      time,
      reachOffset: null,
      randomizeReachOffset: false,
      callback
    };

    this.route = {...this.route};
    this.route.checkpoints = [...this.route.checkpoints];

    if(index && index <= this.checkPointIndex){
      this.route.checkpoints.splice(index, 0, checkPoint);
    }else{
      this.route.checkpoints.push(checkPoint);
    }
  }

  public addMoveCheckPoint(param: AddCheckPointParam){
    const {position, callback, index} = param;
    const checkPoint: CheckPoint = {
      position: {x: position.x, y: position.y},
      type: "MOVE",
      time: 0,
      reachOffset: {x: 0, y: 0},
      randomizeReachOffset: false,
      callback
    };

    this.route = {...this.route};
    this.route.checkpoints = [...this.route.checkpoints];

    if(index && index <= this.route.checkpoints.length){
      this.route.checkpoints.splice(index, 0, checkPoint);
    }else{
      this.route.checkpoints.push(checkPoint);
    }
  }

  //动画状态机发生转换
  public animationStateTransition(transition: AnimateTransition){
    //transAnimation: 是否有过渡动画
    //isWaitTrans: 进行过渡动画时是否停止移动
    //callback：结束过渡动画后的回调函数
    const { 
      transAnimation, animationScale, 
      isWaitTrans, callback , startLag, endLag
    } = transition;

    const moveAnimate = transition.moveAnimate ? transition.moveAnimate : this.moveAnimate;
    const idleAnimate = transition.idleAnimate ? transition.idleAnimate : this.idleAnimate;
    const apply = () => {
      this.moveAnimate = moveAnimate;
      this.idleAnimate = idleAnimate;
      this.animationScale = 1;
      this.transAnimationPlaying = false;
      this.changeAnimation();
      if( callback ) callback();

      if(isWaitTrans) this.waitAnimationTrans = false;
    }

    if(transAnimation){
      
      const animationFind = this.animations.find( animation => animation.name === transAnimation);
      if(animationFind){
        //强制执行并清除还没执行的动画和回调，防止动画中插入另一个动画出bug
        this.countdown.triggerCountdown("animationTrans", true);

        if(animationScale) this.animationScale = animationScale;
        const duration = animationFind.duration * this.animationScale;

        if(startLag){
          this.unMoveable = true;
          this.countdown.addCountdown({
            name: "startLag",
            initCountdown: startLag,
            callback:() => {
              this.unMoveable = false;
            }
          })
        }

        if(endLag){
          this.countdown.addCountdown({
            name: "endLag",
            initCountdown: duration - endLag,
            countdown: endLag, 
            maxCount: 2,
            callback:(timer) => {
              if(timer.count === 1){
                this.unMoveable = true;
              }else{
                this.unMoveable = false;
              }
            }
          })
        }

        this.moveAnimate = transAnimation;
        this.idleAnimate = transAnimation;
        if(isWaitTrans) this.waitAnimationTrans = true;

        this.countdown.addCountdown({
          name: "animationTrans",
          initCountdown: duration, 
          callback: apply
        });

        this.transAnimationPlaying = true;
        this.changeAnimation();
        
      }else{
        apply();
      }
      
    }else{
      apply();
    }
  }

  //更改动画
  public changeAnimation(){
    this.simulateTrackTime = 0;
  }

  //直接设置动画
  protected setAnimation(){
  }

  public spawnExtraEnemy(key: string){
    //如果是自主移动到了检查点，召唤的token会跳过此检查点。反之亦然
    let enemy: Enemy;
    if(Global.gameManager.isSimulate){
      const waveManager = Global.waveManager;
      const enemyData = Global.mapModel.getEnemyData(key);
      const enemyParam: EnemyParam = {
        startTime: waveManager.waveSecond,
        fragmentTime: waveManager.waveSecond,
        dontBlockWave: true,
        route: this.route
      }

      enemy = waveManager.newEnemy(enemyParam, enemyData);
      enemy.isExtra = true;
      waveManager.enemies.push(enemy);

      this.spawnedEnemies.push(enemy);

      if(this.key.includes("enemy_10077_mpbarr")){
        //自助出餐终端召唤的修理小助手无视任何等待检查点
        enemy.cantWait = true;
      }
      
    }else{
      enemy = this.spawnedEnemies[this.spawnIndex];
    }

    this.spawnIndex ++;
    enemy.start();

    enemy.setPosition(this.position.x, this.position.y);
    if(
      this.currentCheckPoint().type === "WAIT_FOR_SECONDS" &&
      !this.cursorPosition.equals(this.route.startPosition)  //没移动过，token不会跳过当前wait检查点
    ){
      //只跳过WAIT_FOR_SECONDS
      enemy.changeCheckPoint(this.checkPointIndex + 1);
    }else{
      enemy.changeCheckPoint(this.checkPointIndex);
    }

  }

  private getForce(forceLevel: number){
    if(forceLevel <= -3) return 0;
    else if(forceLevel >= 3) return 5.8;
    else{
      switch (forceLevel) {
        case -2:
          return 1;
        case -1:
          return 2;
        case 0:
          return 4;
        case 1:
          return 4.5;
        case 2:
          return 5.3;
      }
    }
  }

  //推动、失衡移动
  public push(forceLevel: number, direction: THREE.Vector2){
    this.unBalanceSpeed = this.getForce(forceLevel - this.attributes.massLevel);
    if(this.unBalanceSpeed > 0){
      this.unBalance = true;
      this.boundCrashed = false;
      this.unBalanceVector = direction.normalize();
      Global.gameHandler.handleEnemyUnbalanceMove(this);
    }
  }

  protected unBalanceMove(delta: number){
    const deltaSpeed = 4.905 * delta; //4.905为 (摩擦力参数 0.5 * 重力常量g 9.81)
    this.unBalanceSpeed = Math.max(this.unBalanceSpeed - deltaSpeed, 0);
    if(this.unBalanceSpeed <= 0){
      this.unBalance = false;
      this.unBalanceVector = null;
    }else{
      const tileManager = Global.tileManager;
      
      const {x,y} = this.getIntPosition();
      const distance = this.unBalanceSpeed * delta
      const velocity = this.unBalanceVector.clone().multiplyScalar(distance);
      
      if(this.unBalanceVector.x !== 0){
        const prefix = this.unBalanceVector.x > 0 ? 1 : -1;
        const aroundX = x + prefix;
        //判断在x方向上周围的格子是不是不可通过的格子
        if(!tileManager.isTilePassable(aroundX, y)){
          const edgeX = aroundX - (0.5 + 0.1) * prefix;    //0.1为敌人刚体碰撞半径 0.5是tile边界补正
          const offsetX = (edgeX - this.position.x - velocity.x) * prefix;
          if(offsetX < 0){
            velocity.x = velocity.x + offsetX * prefix; 
            if(!this.boundCrashed){
              this.boundCrashed = true;
              Global.gameHandler.handleEnemyBoundCrash(this, tileManager.getTile(aroundX, y));
            }
          }
        }
      }

      if(this.unBalanceVector.y !== 0){
        const prefix = this.unBalanceVector.y > 0 ? 1 : -1;
        const aroundY = y + prefix;
        //判断在y方向上周围的格子是不是不可通过的格子
        if(!tileManager.isTilePassable(x, aroundY)){
          const edgeY = aroundY - (0.5 + 0.1) * prefix;
          const offsetY = (edgeY - this.position.y - velocity.y) * prefix;
          
          if(offsetY < 0){
            velocity.y = velocity.y + offsetY * prefix; 
            if(!this.boundCrashed){
              this.boundCrashed = true;
              Global.gameHandler.handleEnemyBoundCrash(this, tileManager.getTile(x, aroundY));
            }
          }
        }
      }
      
      this.setPosition(
        this.cursorPosition.x + velocity.x,
        this.cursorPosition.y + velocity.y
      )
      
    }
    
  }

  public get(){
    const superStates = super.get();

    const cursorPosition = {
      x: this.cursorPosition.x,
      y: this.cursorPosition.y
    }

    const state = {
      id: this.id,
      cursorPosition,
      acceleration: this.acceleration,
      inertialVector: this.inertialVector,
      checkPointIndex: this.checkPointIndex,
      faceToward: this.faceToward,
      nextNode: this.nextNode,
      isStarted: this.isStarted,
      isFinished: this.isFinished,
      currentSecond: this.currentSecond,
      unMoveable: this.unMoveable,
      waitAnimationTrans: this.waitAnimationTrans,
      idleAnimate: this.idleAnimate,
      moveAnimate: this.moveAnimate,
      animateState: this.animateState,
      currentAnimation: this.currentAnimation,
      animationScale: this.animationScale,
      transAnimationPlaying: this.transAnimationPlaying,
      shadowHeight: this.shadowHeight,
      visible: this.visible,
      nearFly: this.nearFly,
      exitCountDown: this.exitCountDown,
      simulateTrackTime: this.simulateTrackTime,
      obstacleAvoidanceVector: this.obstacleAvoidanceVector, 
      obstacleAvoidanceCalCount: this.obstacleAvoidanceCalCount,
      motion: this.motion,
      route: this.route,
      visualRoutes: this.visualRoutes,
      tilePosition: this.tilePosition,
      ZOffset: this.ZOffset,
      hp: this.hp,
      die: this.die,
      canReborn: this.canReborn,
      canDie: this.canDie,
      reborned: this.reborned,
      isDisappear: this.isDisappear,
      canAttack: this.canAttack,
      attackCountdown: this.attackCountdown,
      currentAttackRange: this.currentAttackRange,
      carriedEnemyKey: this.carriedEnemyKey,
      carryOffset: this.carryOffset,
      spawnIndex: this.spawnIndex,
      unBalanceSpeed: this.unBalanceSpeed,
      unBalanceVector: this.unBalanceVector,
      boundCrashed: this.boundCrashed,
      attributes: {
        moveSpeed: this.attributes.moveSpeed       //目前只存moveSpeed
      },
      passengers: [...this.passengers],
      changeTileEvents: [...this.changeTileEvents],
      watchers: [...this.watchers],
      buffs: [...this.buffs],
      ...superStates
    }

    return state;
  }
  
  public set(state){
    super.set(state);

    const {cursorPosition, 
      acceleration,
      inertialVector,
      checkPointIndex, 
      faceToward,
      nextNode,
      isStarted, 
      isFinished,
      animateState,
      currentAnimation,
      unMoveable,
      waitAnimationTrans,
      idleAnimate,
      moveAnimate,
      animationScale,
      transAnimationPlaying,
      shadowHeight,
      visible,
      nearFly,
      exitCountDown,
      currentSecond,
      simulateTrackTime,
      obstacleAvoidanceVector,
      obstacleAvoidanceCalCount,
      motion,
      route,
      visualRoutes,
      tilePosition,
      ZOffset,
      hp,
      die,
      canReborn,
      canDie,
      reborned,
      isDisappear,
      canAttack,
      attackCountdown,
      currentAttackRange,
      carriedEnemyKey,
      carryOffset,
      spawnIndex,
      unBalanceSpeed,
      unBalanceVector,
      boundCrashed,
      attributes,
      passengers,
      changeTileEvents,
      watchers,
      buffs
    } = state;

    this.setPosition(cursorPosition.x, cursorPosition.y);
    this.acceleration = acceleration;
    this.inertialVector = inertialVector;
    this.checkPointIndex = checkPointIndex;
    this.faceToward = faceToward;
    this.nextNode = nextNode;
    this.isStarted = isStarted;
    this.isFinished = isFinished;
    this.visible = visible;
    this.nearFly = nearFly;
    this.exitCountDown = exitCountDown;
    this.currentSecond = currentSecond;
    this.transAnimationPlaying = transAnimationPlaying;
    this.shadowHeight = shadowHeight;
    this.unMoveable = unMoveable;
    this.waitAnimationTrans = waitAnimationTrans;
    this.idleAnimate = idleAnimate;
    this.moveAnimate = moveAnimate;
    this.animateState = animateState;
    this.currentAnimation = currentAnimation;
    this.animationScale = animationScale;
    this.simulateTrackTime = simulateTrackTime;
    this.obstacleAvoidanceVector = obstacleAvoidanceVector;
    this.obstacleAvoidanceCalCount = obstacleAvoidanceCalCount;
    this.motion = motion;
    this.route = route;
    this.visualRoutes = visualRoutes;
    this.tilePosition = tilePosition;
    this.hp = hp;
    this.die = die;
    this.canReborn = canReborn;
    this.canDie = canDie;
    this.reborned = reborned;
    this.isDisappear = isDisappear;
    this.canAttack = canAttack;
    this.attackCountdown = attackCountdown;
    this.carriedEnemyKey = carriedEnemyKey;
    this.spawnIndex = spawnIndex;
    this.unBalanceSpeed = unBalanceSpeed;
    this.unBalanceVector = unBalanceVector;
    this.boundCrashed = boundCrashed;
    this.attributes.moveSpeed = attributes.moveSpeed;
    this.passengers = [...passengers];
    this.changeTileEvents = [...changeTileEvents],
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

      this.setZOffset(ZOffset);
      if(!this.shadow) console.log(this)
      if(this.hasShadow) this.shadow.position.z = this.shadowHeight;
      this.visible? this.show() : this.hide();
      if(this.tilePosition){
        this.updateFaceToward();
        this.updateShadowHeight();
      }

      this.updateAttackRangeCircle(currentAttackRange);
      this.updateHPBar();

      //恢复抓取、装载的敌人显示
      if(carriedEnemyKey){
        this.addCarryEnemy(carriedEnemyKey);
        carryOffset && this.setCarryOffset(carryOffset);
      }else{
        this.removeCarryEnemy();
      }
    }
    
    Global.gameHandler.handleEnemySet(this, state);
  }

  public destroy(){
    this.route = null;
    this.nextNode = null;
    this.object = null;
  }

}

export default Enemy;