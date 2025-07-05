import {bresenhamLine, RowColToVec2} from "@/components/utilities/utilities"
import RunesHelper from "./RunesHelper";
import MapTiles from "./MapTiles"
import {getEnemiesData} from "@/api/stages"
import AliasHelper from "./AliasHelper";
import AssetsManager from "@/components/assetManager/spinesAssets"
import spine from "@/assets/script/spine-threejs.js";
import { getAnimation } from "@/components/utilities/SpineHelper"
import GameConfig from "../utilities/GameConfig";

//对地图json进行数据处理
class MapModel{
  private sourceData: any;
  private runesHelper: RunesHelper;
  public mapTiles: MapTiles; //地图tiles
  public enemyWaves: EnemyWave[][] = [];
  public enemyDatas: EnemyData[] = [];
  public enemyRoutes: EnemyRoute[] = [];
  public pathMaps: PathMap[] = []; //寻路地图

  private assetsManager: AssetsManager;   //资源一开始就加载完毕，所以放到这里处理
  constructor(data: any){
    this.sourceData = data;
    this.assetsManager = new AssetsManager();
    // console.log(this.enemyRoutes)
  }

  //异步数据，需要在实例化的时候手动调用
  public async init(){
    this.getRunes();
    //解析地图
    this.mapTiles = new MapTiles(this.sourceData.mapData);

    //解析敌人路径
    this.parseEnemyRoutes();

    //解析波次数据
    this.parseEnemyWaves(this.sourceData.waves)

    await this.initEnemyData(this.sourceData.enemyDbRefs);
    //初始化敌人spine
    await this.getEnemySpines();

    //绑定route和enemydata
    this.enemyWaves.flat().forEach( wave => {
      //route可能为null
      const findRoute: EnemyRoute = this.enemyRoutes.find( route => route.index === wave.routeIndex );
      const findEnemyData = this.enemyDatas.find(e => e.key === wave.key);

      if(findRoute) wave.route = findRoute;
      if(findEnemyData) wave.enemyData = findEnemyData;
    })

    //生成寻路地图
    this.generatepathMaps();  
    //平整化寻路地图
    this.flatteningFindMaps();

    this.bindWayFindToCheckPoints();

    this.sourceData = null;
    
  }

  private getRunes(){
    //"difficultyMask": 1和NORMAL是普通  2和FOUR_STAR是突袭  3和ALL是全部生效
    

    const runesData = [];
    this.sourceData.runes?.forEach( rune => {
      const difficultyMask = rune.difficultyMask;

      if(
        ( this.sourceData.challenge && ( difficultyMask ===  1 || difficultyMask === "NORMAL" ) ) ||
        ( !this.sourceData.challenge && ( difficultyMask ===  2 || difficultyMask === "FOUR_STAR" ) ) 
      ) return;
      runesData.push(rune);
    })
    this.runesHelper = new RunesHelper(runesData);
  }


  //解析波次
  private parseEnemyWaves(waves: any[]){ 
    //waves:大波次(对应关卡检查点) fragments:中波次 actions:小波次
    waves.forEach((wave: any) => {
      let currentTime = 0;
      
      const innerWaves: EnemyWave[] = [];
      currentTime += wave.preDelay;
      let waveTime = currentTime;
      wave.fragments.forEach((fragment: any) => {
        
        currentTime += fragment.preDelay;
        let fragmentTime = currentTime;
        let lastTime = currentTime;//action波次的最后一只怪出现时间

        fragment.actions.forEach((action: any) =>{
          for(let i=0; i<action.count; i++){
            //检查敌人分组
            const check = this.runesHelper.checkEnemyGroup(action.hiddenGroup);

            if(!check) return;

            let startTime = currentTime + action.preDelay + action.interval*i;
            lastTime = Math.max(lastTime, startTime);
            
            //"actionType": "DISPLAY_ENEMY_INFO"这个显示敌人信息的action
            //虽然不会加入波次里面，但是该算的preDelay还是要算的
            //有SPAWN和数字0两种
            if(action.actionType !== "SPAWN" && action.actionType !== 0) return;

            let eWave: EnemyWave = {
              actionType: action.actionType,
              key: this.runesHelper.checkEnemyChange( action.key ),
              routeIndex : action.routeIndex,
              startTime,
              fragmentTime,
              waveTime,
              hiddenGroup: action.hiddenGroup
            }

            innerWaves.push(eWave);

          }
        })

        currentTime = lastTime;

      })
      
      innerWaves.sort((a, b)=>{
        return a.startTime - b.startTime;
      })

      this.enemyWaves.push(innerWaves);
      currentTime += wave.postDelay;
    });
    
  }

  //解析敌人路径
  private parseEnemyRoutes(){
    let routeIndex = 0;
    this.sourceData.routes.forEach( (sourceRoute: any) =>{

      //某些敌人(例如提示)没有路径route，所以会出现null，做下兼容处理
      //E_NUM不算进敌人路径内，例如"actionType": "DISPLAY_ENEMY_INFO"这个显示敌人信息的action
      if(sourceRoute && sourceRoute.motionMode !== "E_NUM") {

        const route: EnemyRoute = {
          index: routeIndex,
          allowDiagonalMove: sourceRoute.allowDiagonalMove,  //是否允许斜角路径
          startPosition: RowColToVec2(sourceRoute.startPosition),
          motionMode: AliasHelper(sourceRoute.motionMode, "motionMode"),
          spawnOffset: sourceRoute.spawnOffset,
          spawnRandomRange: sourceRoute.spawnRandomRange,
          checkpoints: []
        }
        
        sourceRoute.checkpoints.forEach((cp: any) => {
          const checkpoint: CheckPoint = {
            type: AliasHelper(cp.type, "checkPointType"),
            position: RowColToVec2(cp.position),
            time: cp.time,
            reachOffset: cp.reachOffset,
            randomizeReachOffset: cp.randomizeReachOffset
          }
          route.checkpoints.push(checkpoint);
        })

        let endPosition = RowColToVec2(sourceRoute.endPosition);
        //将结束点作为最终检查点放入检查点数组里面
        route.checkpoints.push({
          type: "MOVE",
          position: endPosition,
          time: 0,
          reachOffset:{x:0, y:0},
          randomizeReachOffset: false
        })

        this.enemyRoutes.push(route);
      }
      routeIndex ++;
    })

  }


  /**
   * 初始化敌人数据
   * @param {*} enemyDatas 数据库中的敌人数据
   * @param {*} enemyDbRefs 地图JSON中的敌人引用
   */
  private async initEnemyData(enemyDbRefs: EnemyRef[]){

    const waves = this.enemyWaves.flat();
    const enemyRefReq = enemyDbRefs.filter((enemyRef: EnemyRef) => {

      //排除不会在地图中出场的敌人
      const inWave = waves.find(wave => wave.key === enemyRef.id) !== undefined;
      
      return inWave && enemyRef.useDb;
    })
    
    const res: any = await getEnemiesData( enemyRefReq );
    const enemyDatas = res.data.EnemyDatas;
    enemyDbRefs.forEach((enemyDbRef: EnemyRef) => {
      
      let enemyData = enemyDatas.find(enemyData => enemyData.key === enemyDbRef.id);
      if(!enemyData) return;

      const overwriteData = enemyDbRef.overwrittenData;
      
      if(overwriteData){
        
        if(!enemyData) {
          enemyData = {};
          this.enemyDatas.push(enemyData);
        }

        ["description","levelType","name","rangeRadius","motion"].forEach(key =>{
          if(overwriteData[key]?.m_defined){
            enemyData[key] = overwriteData[key].m_value;
          }
        })

        Object.keys(overwriteData["attributes"]).forEach(key => {
          const attr = overwriteData["attributes"][key];
          if(attr.m_defined){
            enemyData["attributes"][key] = attr.m_value;
          }
        })

      }
      
      enemyData.icon = GameConfig.BASE_URL + "enemy_icon/" + enemyData.key + ".png";

      this.runesHelper.checkEnemyAttribute(enemyData["attributes"]);

    })

    this.enemyDatas = enemyDatas;
  }

  private async getEnemySpines(){
    const spineNames: string[] = this.enemyDatas.map(e => e.key);

    //设置敌人spine
    await this.assetsManager.loadSpines(spineNames);
    this.enemyDatas.forEach(data => {
      const {key} = data;
      const spineManager = this.assetsManager.spineManager;

      const sName = key.replace("enemy_", "");
      const atlasName = sName + "/" + key + ".atlas";
      const skelName = sName + "/" + key + ".skel";
  
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
      const moveAnimate = getAnimation(key, skeletonData.animations, "Move");
      const idleAnimate = getAnimation(key, skeletonData.animations, "Idle");

      data.skeletonData = skeletonData;
      data.moveAnimate = moveAnimate;
      data.idleAnimate = idleAnimate;
    })
  }

  //生成寻路地图需要用到的拷贝对象
  private generateTileMapping(): PathNode[][]{
    const mapping = [];
    const y = this.mapTiles.height();
    const x = this.mapTiles.width();

    for(let i=0; i<y;i++){
      mapping[i] = [];
      for(let j=0; j<x; j++){
        mapping[i][j] = null;
      }
    }
    return mapping;
  }



  //生成所有routes的寻路地图
  private generatepathMaps(){
    this.enemyRoutes.forEach(route => {
      const points: Vec2[]= [];
      const motionMode = route.motionMode;

      route.checkpoints.forEach(point =>{
        //移动类检查点
        if(point.type === "MOVE"){
          points.push(point.position);
        }
      })

      points.forEach(point => {

        //如果发现之前创建过一张移动模式一致，目标地块一致的寻路地图，就会直接跳过生成
        const find = this.pathMaps.find(item =>{
          return item.motionMode === motionMode && 
            item.targetPoint.x === point.x && 
            item.targetPoint.y === point.y;
        })
        
        if(find === undefined){ 
          let findMap = this.generatepathMapsByVec(point,motionMode);

          const pathMap: PathMap = {
            motionMode: motionMode,
            targetPoint:{x: point.x, y: point.y},
            map : findMap
          }
          
          this.pathMaps.push(pathMap)
        }
      })
      
    })

  }

  //给定目标地块生成寻路地图
  /**
   *
   * @param {*} x X轴坐标（方向朝右）
   * @param {*} y Y轴坐标（方向朝上）
   * @param {*} motionMode 行动方式 "WALK"地面 "FLY"飞行
   * @return {*} mapping
   * @memberof mapParser
   */
  private generatepathMapsByVec(target: Vec2, motionMode: string): PathNode[][]{
    const mapping: PathNode[][] = this.generateTileMapping();
    const {x, y}= target;

    const node: PathNode = {
      position: {x, y},
      distance: 0,
      nextNode: null
    };
    mapping[y][x] = node;

    const queue: PathNode[] = [];
    queue.push(mapping[y][x]);

    //nowTile是当前中心地块
    for(let nowTile: PathNode | undefined; nowTile = queue.shift();){

      //按上右下左的顺序扫描这个地块周围4个地块
      let nowPostion = nowTile.position;
      let scanList = [
        [nowPostion.x,nowPostion.y + 1],
        [nowPostion.x + 1,nowPostion.y],
        [nowPostion.x,nowPostion.y - 1],
        [nowPostion.x - 1,nowPostion.y]
      ]

      for(let i=0;i<scanList.length;i++){
        let _x = scanList[i][0];
        let _y = scanList[i][1];

        //扫描地板是可通行地板
        if(
          motionMode === "WALK" && this.mapTiles.isTilePassable(_x,_y) || 
          motionMode === "FLY" && this.mapTiles.isTileFlyable(_x,_y)
        ){

          if(mapping[_y][_x] === null){
            mapping[_y][_x] = {
              position: {x: _x, y: _y},
              distance: -1,
              nextNode: null,
            }
          }

          //假定离目标的距离
          let assumeDistance = nowTile.distance + 1;
          let nowScan = mapping[_y][_x];

          //如果此时的距离小于被记录的距离，或者还没有记录距离
          //那么将这个假设的距离记录，将中心地块设置为被扫描地块的nextNode，将被扫描的地块添加到队列尾
          if(nowScan.distance === -1 || assumeDistance < nowScan.distance){
            nowScan.distance = assumeDistance;
            nowScan.nextNode = nowTile;
            queue.push(nowScan)
          }
        }
      }
    }

    return mapping;
  }

  //平整化
  private flatteningFindMaps(){
    this.pathMaps.forEach(findMap => {
      const {map, motionMode}  = findMap;

      map.forEach(row => {
        row.forEach(point => {

          if(point !== null){
            this.flatteningSinglePoint(point, motionMode)
          }

        })
      })
    })
  }

  //单点平整化
  private flatteningSinglePoint(point: PathNode, motionMode: string){
    const stack: PathNode[] = [];
    let currentNode = point.nextNode;
    let p1 = point.position;  //开始点坐标
    let p2;  //结束点坐标
    let endPoint: PathNode | undefined; //结束点
    let points; //开始点与结束点之间经过Bresenham直线算法生成的点

    while(currentNode){
      stack.push(currentNode);
      currentNode = currentNode.nextNode;
    }

    while(endPoint = stack.pop()){
      p2 = endPoint.position;
      points = bresenhamLine(p1.x,p1.y,p2.x,p2.y);

      // if(p1[0] === 1 && p1[1] === 5  && p2[0] === 6  && p2[1] === 1){
      //   console.log(points)
      // }

      //blocked 是否找到无法通行的格子
      let blocked = points.find(p3 => {
        if(motionMode === "FLY"){
          return !this.mapTiles.isTileFlyable(p3[0],p3[1]);
        }
        else if(motionMode === "WALK"){
          return !this.mapTiles.isTilePassable(p3[0],p3[1]);
        }
      })
      if(!blocked){
        point.nextNode = endPoint;
        break;
      }
    }
  }

  //获取某个目标的寻路地图
  private getPathMap(targetPoint: Vec2, motionMode: string) : PathMap | undefined{
    return this.pathMaps.find(pathMap => {
      return pathMap.motionMode === motionMode &&
        pathMap.targetPoint.x === targetPoint.x &&
        pathMap.targetPoint.y === targetPoint.y
    })
  }

  //给移动检查点绑定寻路地图
  private bindWayFindToCheckPoints(){
    this.enemyRoutes.forEach(route => {
      const motionMode = route.motionMode;
      route.checkpoints.forEach(checkPoint => {

        if(checkPoint.type === "MOVE"){

          const pathMap: PathMap | undefined = this.getPathMap(checkPoint.position, motionMode)
          checkPoint.pathMap = pathMap;
        }

      })
    })
  }
}

export default MapModel;