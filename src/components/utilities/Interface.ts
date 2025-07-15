import Enemy from "@/components/enemy/Enemy"

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
    attributes: any,        //敌人属性
    talentBlackboard: any[], //敌人天赋
    talents: any[],   //解析后的敌人天赋
    description: string,    //
    levelType: string,      //敌人级别 普通/精英/领袖
    name: string,
    icon: string,           //敌人头像URL
    rangeRadius: number,    //攻击范围
    motion: string,         //移动motion
    notCountInTotal: boolean,  //非首要目标
    skelUrl?: string,
    atlasUrl?: string,
    skeletonData: any,      //skel数据
    moveAnimate: string,    //移动时的skel动画名
    idleAnimate: string     //不动时的skel动画名
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
    checkpoints: Array<CheckPoint>,
    startPosition: Vec2,
    motionMode: string,
    spawnOffset: any,
    spawnRandomRange: any,
  }

  interface EnemyWave{
    actionType: string,      //敌人生成模式
    key: string,             //敌人id
    routeIndex: number,
    startTime: number,        //该波次开始时间
    fragmentTime: number,     //分支(FRAGMENT)开始时间
    waveTime: number,         //波次(WAVE)开始时间
    hiddenGroup: string,      //敌人属于哪个分组
    route?: EnemyRoute,  
    enemyData?: EnemyData,
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
    key: string,
    direction: string,
    position: Vec2,
    mainSkillLvl: number,   //技能等级
    idleAnimate?: string,   //idle动画
    mesh?: THREE.Mesh,     //fbx数据有mesh
    skeletonData?: any,     //spine数据有skeletonData
    textureMat?: THREE.MeshBasicMaterial  //texture数据才有
  }
}

export {Stage, Vec2, TileData, EnemyWave, EnemyData, CheckPoint, EnemyRoute, PathNode, PathMap, EnemyRef}