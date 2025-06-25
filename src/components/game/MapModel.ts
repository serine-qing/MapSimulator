import enemyDatas from "@/assets/gamedata/test_enemy_database.json"
import {bresenhamLine, RowColToVec2} from "@/components/utilities/utilities"
import MapTiles from "./MapTiles"
import {getEnemiesData} from "@/components/api/stages"

//对地图json进行数据处理
class MapModel{
  public mapTiles: MapTiles; //地图tiles
  public enemyWaves: EnemyWave[] = [];
  public enemyDatas: EnemyData[] = [];
  public enemyRoutes: EnemyRoute[] = [];
  public pathMaps: PathMap[] = []; //寻路地图
  constructor(data: any){
    this.initEnemyData(enemyDatas.enemies, data.enemyDbRefs);

    //解析地图
    this.mapTiles = new MapTiles(data.mapData);
    //解析敌人路径
    this.parseEnemyRoutes(data.routes);
    //解析波次数据
    this.parseEnemyWaves(data.waves);

    //生成寻路地图
    this.generatepathMaps();
    //平整化寻路地图
    this.flatteningFindMaps();

    this.bindWayFindToCheckPoints();

    // console.log(this.enemyRoutes)
  }
  /**
   * 初始化敌人数据
   * @param {*} enemyDatas 数据库中的敌人数据
   * @param {*} enemyDbRefs 地图JSON中的敌人引用
   */
  private initEnemyData(enemyDatas: any[], enemyDbRefs: EnemyRef[]){

    const enemyRefReq = enemyDbRefs.filter((enemyRef: EnemyRef) => {
      return enemyRef.useDb;
    })

    getEnemiesData( enemyRefReq ).then((res: any) => {
      // console.log(enemyDbRefs)
      // console.log(res.data.EnemyDatas)
      const enemyDatas = res.data.EnemyDatas;
      enemyDbRefs.forEach((enemyDbRef: EnemyRef) => {
        if(enemyDbRef.overwrittenData){
          //TODO 这里需要重写属性
        }
      })

      this.enemyDatas = enemyDatas;
    })


    enemyDbRefs.forEach((enemyRef: EnemyRef) => {

      //是否使用数据库内敌人数据
      if(enemyRef.useDb){
        const find = enemyDatas.find( e =>{
          return enemyRef.id === e.Key;
        })
        const sourceData = find.Value[0].enemyData;

        const parsedData: EnemyData= {
          key: find.Key,
          attributes: find.Value[enemyRef.level].enemyData.attributes,  
          description: sourceData.description.m_value,
          levelType:sourceData.levelType.m_value,
          name: sourceData.name.m_value,
          rangeRadius: sourceData.rangeRadius.m_value,  
          motion: sourceData.motion.m_value, 
        }

        Object.keys(parsedData.attributes).forEach(attrName => {
          parsedData.attributes[attrName] = parsedData.attributes[attrName].m_value;
        })

        this.enemyDatas.push(parsedData);
      }
    })
  }

  //解析波次
  private parseEnemyWaves(waves: any[]){ 

    let currentTime = 0;
    //waves:大波次(对应关卡检查点) fragments:中波次 actions:小波次
    waves.forEach((wave: any, waveIndex: number) => {
      currentTime += wave.preDelay;

      wave.fragments.forEach((fragment: any) => {

        currentTime += fragment.preDelay;

        let lastTime = currentTime;//action波次的最后一只怪出现时间

        fragment.actions.forEach((action: any) =>{

          for(let i=0; i<action.count; i++){

            let startTime = currentTime + action.preDelay + action.interval*i;
            lastTime = Math.max(lastTime, startTime);

            let eWave: EnemyWave = {
              actionType: action.actionType,
              key: action.key,
              routeIndex:action.routeIndex,
              route: this.enemyRoutes[action.routeIndex],
              enemyData: this.enemyDatas.find(e => e.key === action.key) || null,
              startTime: startTime,
              waveIndex: waveIndex
            }
            this.enemyWaves.push(eWave);
          }
        })

        currentTime = lastTime;

      })
  
      currentTime += wave.postDelay;
    });

    this.enemyWaves.sort((a, b)=>{
      return a.startTime - b.startTime;
    })

  }

  //解析敌人路径
  private parseEnemyRoutes(sourceRoutes: any[]){
    sourceRoutes.forEach(sourceRoute =>{
      const route: EnemyRoute = {
        allowDiagonalMove: sourceRoute.allowDiagonalMove,  //是否允许斜角路径
        startPosition: RowColToVec2(sourceRoute.startPosition),
        motionMode: sourceRoute.motionMode,
        spawnOffset: sourceRoute.spawnOffset,
        spawnRandomRange: sourceRoute.spawnRandomRange,
        checkpoints: []
      }
      
      sourceRoute.checkpoints.forEach((cp: any) => {
        const checkpoint: CheckPoint = {
          type: cp.type,
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
    const x: number = target.x;
    const y: number = target.y;

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

  //生成所有routes的寻路地图
  private generatepathMaps(){
    this.enemyRoutes.forEach(route => {
      const points: Vec2[]= [];
      const motionMode = route.motionMode;

      //E_NUM不算进敌人路径内，例如"actionType": "DISPLAY_ENEMY_INFO"这个显示敌人信息的action
      if(motionMode !== "E_NUM") {

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

      }
    })

  }
  
  //平整化
  private flatteningFindMaps(){
    this.pathMaps.forEach(findMap => {
      const map = findMap.map;
      const motionMode = findMap.motionMode;

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

      //todo 这块代码用于调试bug
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