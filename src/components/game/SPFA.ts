import {bresenhamLine} from "@/components/utilities/utilities"
import * as THREE from "three"
import Global from "../utilities/Global";

class SPFA{
  public pathMaps: PathMap[] = []; //寻路地图
  public enemyRoutes: EnemyRoute[] = [];
  public extraBlocks: THREE.Vector2[] = [];
  constructor(enemyRoutes: EnemyRoute[], extraBlocks: THREE.Vector2[]){
    this.enemyRoutes = enemyRoutes; 
    this.extraBlocks = extraBlocks;
  }

  //生成寻路地图需要用到的拷贝对象
  private generateTileMapping(): PathNode[][]{
    const mapping = [];
    const y = Global.tileManager.height;
    const x = Global.tileManager.width;

    for(let i=0; i<y;i++){
      mapping[i] = [];
      for(let j=0; j<x; j++){
        mapping[i][j] = null;
      }
    }
    return mapping;
  }

  //生成所有routes的寻路地图
  public generatepathMaps(){
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
          this.generatepathMap(point, motionMode)
        }
      })
      
    })

  }

  private generatepathMap(target: Vec2, motionMode: string): PathMap{
    const findMap = this.generatepathMapsByVec(target, motionMode);
    const pathMap: PathMap = {
      motionMode: motionMode,
      targetPoint:{x: target.x, y: target.y},
      map : findMap
    }
    
    //平整化寻路地图
    this.flatteningFindMap(pathMap);
    this.pathMaps.push(pathMap);

    return pathMap;
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
          motionMode === "WALK" && Global.tileManager.isTilePassable(_x,_y) || 
          motionMode === "FLY" && Global.tileManager.isTileFlyable(_x,_y)
        ){

          if(mapping[_y][_x] === null){
            mapping[_y][_x] = {
              position: {x: _x, y: _y},
              distance: -1,
              nextNode: null,
            }
          }

          //距离权重
          const distanceWeight = this.getDistanceWeight(_x,_y);
        
          //假定离目标的距离
          let assumeDistance = nowTile.distance + distanceWeight;
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

  private getDistanceWeight(x: number, y: number): number{
    const find = this.extraBlocks.find(point => point.x === x && point.y === y);
    if(find) return 1000;

    let distanceWeight: number;
    const tile = Global.tileManager.getTile(x, y);

    switch (tile.tileKey) {
      case "tile_hole":
        distanceWeight = 1000000;
        break;
    
      default:
        distanceWeight = 1;
        break;
    }

    const trapKey = tile.trap?.key;

    // console.log(trapKey)
    switch (trapKey) {
      case "trap_001_crate":
      case "trap_002_emp":
      case "trap_005_sensor":
      case "trap_008_farm":
      case "trap_020_roadblock":
      case "trap_027_stone":
      case "trap_032_mound":
      case "trap_043_dupilr":
      case "trap_044_duruin":
      case "trap_075_bgarmn":
      case "trap_076_bgarms":
      case "trap_077_rmtarmn":
      case "trap_078_rmtarms":
      case "trap_080_garage":
      case "trap_111_wdfarm":
      case "trap_156_dsshell":
      case "trap_163_foolcrate":
      case "trap_405_xbroadblock":
      case "trap_480_roadblockxb":
        
        distanceWeight = 1000;
        break;
    
    }

    return distanceWeight;
  }

  //平整化
  private flatteningFindMap(pathMap){
    const {map, motionMode}  = pathMap;

    map.forEach(row => {
      row.forEach(point => {

        if(point !== null){
          this.flatteningSinglePoint(point, motionMode)
        }

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
        const x = p3[0];
        const y = p3[1];

        if(motionMode === "FLY"){
          return !Global.tileManager.isTileFlyable(x, y);
        }
        else if(motionMode === "WALK"){
          const isBlockedOrHole = this.getDistanceWeight(x, y) >= 1000;
          return !Global.tileManager.isTilePassable(x, y) || isBlockedOrHole;
        }
      })
      if(!blocked){
        point.nextNode = endPoint;
        break;
      }
    }
  }

  //获取某个目标的寻路地图
  public getPathMap(targetPoint: Vec2, motionMode: string) : PathMap | undefined{
    let find = this.pathMaps.find(pathMap => {
      return pathMap.motionMode === motionMode &&
        pathMap.targetPoint.x === targetPoint.x &&
        pathMap.targetPoint.y === targetPoint.y
    })
    //没有的话就临时生成寻路地图
    if(!find){
      find = this.generatepathMap(targetPoint, motionMode);
    }

    return find;
  }

  //motionMode：飞行还是地面 targetPoint：检查点目标点 position：当前光标位置
  public getPathNode(targetPoint: Vec2, motionMode: string, currentPosition: THREE.Vector2 | Vec2): PathNode{
    const x = currentPosition.x;
    const y = currentPosition.y;

    const pathMap = this.getPathMap(targetPoint, motionMode);

    const map = pathMap?.map;
    let currentNode = map? map[y]? map[y][x] : null : null;

    return currentNode;
  }

  //checkBlock:是否检查路线不通
  public regenerate(checkBlock: boolean): boolean{
    const old = this.pathMaps;
    this.pathMaps = [];
    this.generatepathMaps();
    
    if(checkBlock){
      const blocked = this.checkBlocked();
      if(blocked){
        this.pathMaps = old;
      }
      return !blocked;
    }

  }

  //检查路线是否堵住
  private checkBlocked(): boolean{
    return !!this.enemyRoutes.find(route => {
      const { startPosition, motionMode, endPosition } = route;
      const node = this.getPathNode(startPosition, motionMode, endPosition)
      return node.distance >= 1000;
    })
  }

  get(){
    return this.pathMaps;
  }

  set(state){
    this.pathMaps = state;
  }
}

export default SPFA;