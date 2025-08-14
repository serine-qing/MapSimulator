import Enemy from "@/components/enemy/Enemy"
import Trap from "../game/Trap"

declare global {
  interface Stage{
    operation: string,
    cn_name: string,
    description: string,
    episode: string,
    levelId: string,
    hasChallenge: boolean,   //是否有突袭
    challenge?: string       //突袭条件(有这个key意味着是突袭关)
  }

  interface Vec2{
    x: number,
    y: number
  }
  //地图tile的数据模式
  interface TileData{
    tileKey: string,             //tile的类型
    passableMask: string,        //通行模式："ALL"：都可通行 "FLY_ONLY"：仅飞行
    playerSideMask?: string,
    blackboard?: any,
    buildableType?: string,
    effects?: any,
    heightType?: string
  }

  interface EnemyData{
    key: string,            //敌人id
    waveKey: string,       //敌人在波次数据中的id
    count: number,         //敌人数量
    level: number,         //敌人级别
    attributes: any,        //敌人属性
    talentBlackboard?: any[], //敌人天赋（原始数据）
    talents: any,           //敌人天赋
    skills: any,           //敌人技能
    hugeEnemy: boolean,     //是否是巨型敌人
    unMoveable: boolean,   //是否不可移动
    description: string,    //
    levelType: string,      //敌人级别 普通/精英/领袖
    name: string,
    icon: string,           //敌人头像URL
    applyWay: string,       //是否是远程
    attrChanges: any,       //属性更改
    rangeRadius: number,    //攻击范围
    motion: string,         //移动motion
    notCountInTotal: boolean,  //非首要目标
    skelUrl?: string,
    atlasUrl?: string,
    skeletonData?: any,      //skel数据
    fbxMesh?:any,            //已经实体化的fbxMesh
    skelHeight: number,
    skelWidth: number,
    moveAnimate: string,    //移动时的skel动画名
    idleAnimate: string,     //不动时的skel动画名
    lifePointReduce: number,   //目标生命
    immunes: string[],       //异常抗性
    abilityList: any,        //能力描述
    animations: any[],        //动画状态
  }

  //敌人路径检查点
  interface CheckPoint{
    type: string,
    position: Vec2,
    time: number,
    reachOffset: Vec2,
    randomizeReachOffset: boolean,
    pathMap?: PathMap
  }

  interface EnemyRoute{
    index: number, 
    allowDiagonalMove: boolean,  //是否允许斜角路径
    visitEveryTileCenter: boolean,  //https://www.bilibili.com/opus/900558138389823489
    visitEveryNodeCenter: boolean,
    visitEveryNodeStably: boolean,
    checkpoints: Array<CheckPoint>,
    startPosition: Vec2,
    endPosition: Vec2,
    motionMode: string,
    spawnOffset: any,
    spawnRandomRange: any,
  }

  interface ActionData{
    enemyId?: number,              //id 和敌人index对应
    actionType: string,      //敌人生成模式
    key: string,             //敌人id
    routeIndex: number,
    startTime: number,        //该波次开始时间
    fragmentTime: number,     //分支(FRAGMENT)开始时间
    hiddenGroup: string,      //敌人属于哪个分组
    dontBlockWave: boolean,   //是否不影响下一波次刷新
    blockFragment: boolean,   
    route?: EnemyRoute,  
    enemyData?: EnemyData,
    trapData?: trapData               //波次绑定的装置
  }

  //寻路地图中的单个Node
  interface PathNode{
    position: Vec2,
    distance: number,
    nextNode: PathNode | null
  }

  //寻路地图
  interface PathMap{
    map: PathNode[][],
    motionMode: string, 
    targetPoint: Vec2
  }

  interface EnemyRef{
    id: string,
    level: number,
    overwrittenData: any,
    useDb: boolean
  }

  interface trapData{
    isTokenCard: boolean,   //是否是待部署区装置
    key: string,
    alias: string,          //地图里的装置id
    direction: string,
    position: Vec2,
    mainSkillLvl: number,   //技能等级
    hidden: boolean,        //是否隐藏
    idleAnimate?: string,   //idle动画
    mesh?: THREE.Mesh,     //fbx数据有mesh
    skeletonData?: any,     //spine数据有skeletonData
    textureMat?: THREE.MeshBasicMaterial  //texture数据才有
    extraData?: any[],      //额外数据
    extraWave?: any[],      //额外波次
  }

  interface Effect{
    attrKey: string,
    method: string,               //加法：add / 乘法：mul
    value: number               //具体数值
  }

  interface BuffParam{
    id: string,                         //唯一标识，单个enemy上不可重复
    key: string,                        //buff的key值
    applyType: string,                 //all:全部，类似于光环技能 enemiesInMap：当前地图上激活的敌人
    overlay?: boolean,                  //是否可叠加，默认否
    enemy?: string[],                  //包括哪些敌人
    enemyExclude?: string[],           //不包括哪些敌人
    effect?: Effect[],
    duration?: number,                 //持续时间
  }

  interface Buff{
    id: string,                         //唯一标识，单个enemy上不可重复
    key: string,                        //buff的key值，可重复
    overlay: boolean,                  //是否可叠加
    effect: Effect[],
    duration?: number
  }

  interface Array<T> {
    remove(T);
    equal(T);
  }
}


Array.prototype.remove = function(item){
  const index = this.findIndex(i => i === item);
  if(index > -1){
    this.splice(index, 1)
  }
}

Array.prototype.equal = function(array: any[]): boolean{
  if(this.length !== array.length) return false;
  
  for(let i = 0; i < this.length; i++){
    const findIndex = array.findIndex(item => item === this[i]);
    if( findIndex === -1 ) return false;
  }

  return true;
}


const immuneTable = {
  stunImmune:"晕眩抗性",	
  silenceImmune:"沉默抗性",
  sleepImmune:"沉睡抗性",
  frozenImmune:"冻结抗性",
  levitateImmune:"浮空抗性	",
  disarmedCombatImmune:"战栗抗性	",
  fearedImmune:"恐惧抗性	",
  palsyImmune:"麻痹抗性",
  attractImmune:"诱导抗性"
}

export { immuneTable }
