import Enemy from "./Enemy.ts"
import * as THREE from "three";
let test = 0;

//敌人状态管理
class EnemyManager{
  private enemyWaves: EnemyWave[];
  // private wayFindMaps: WayFindMap[];
  private enemys: Enemy[] = []; //敌人对象数组
  private enemysInMap: Enemy[] = []; //需要在地图上渲染的enemys

  private currentSecond = -1; //当前游戏时间（-1为未开始默认值）
  constructor(enemyWaves, wayFindMaps){
    this.enemyWaves = enemyWaves;
    // this.wayFindMaps = wayFindMaps;

    this.initEnemies();

    // console.log(this.enemyWaves)
    // console.log(this.wayFindMaps)
    console.log(this.enemys)
  }

  private initEnemies(){
    this.enemyWaves.forEach(wave =>{
      const enemy = new Enemy(wave);
      this.enemys.push(enemy);
    })
    
  }

  private removeEnemys(){

  }

  private updateEnemyWaitingCounts(){
    this.enemys.forEach(enemy => {
      enemy.updateWaitingCounts();
    })
  }

  private spawnEnemy(){
    for (let i=0; i<this.enemyWaves.length; i++){ 
      if(this.currentSecond === this.enemyWaves[i].startTime){
        //重置
        this.enemys[i].reset();
        this.enemysInMap.push(this.enemys[i]);

      }
    }
    // console.log(this.enemysInMap)
  }

  private action(){
    for(let i=0; i<this.enemysInMap.length; i++){
      let actionEnemy = this.enemysInMap[i];
      this.singleEnemyAction(actionEnemy);
    }
    
  }

  private singleEnemyAction(actionEnemy: Enemy){
    const checkPoint: CheckPoint = actionEnemy.currentCheckPoint();
    switch (checkPoint.type) {
      case "MOVE":
        if(test++ < 10){
          
          const pathMap = checkPoint.wayFindMap.map;
          const currentPosition = actionEnemy.position;
          
          if(actionEnemy.targetNode === null){
            //第一次执行move 添加targetNode
            actionEnemy.setTargetNode(pathMap[currentPosition.y][currentPosition.x].nextNode)
          }

          //单位向量
          const unitVector = new THREE.Vector2(
            actionEnemy.targetNode.position.x - currentPosition.x,
            actionEnemy.targetNode.position.y - currentPosition.y
          ).normalize(); 

          //TODO 倍速移动常量需要设置
          const moveDistancePerFrame = actionEnemy.moveSpeed * 1/30;

          actionEnemy.setPosition(
            currentPosition.x + unitVector.x * moveDistancePerFrame,
            currentPosition.y + unitVector.y * moveDistancePerFrame
          );

          const distanceToTarget = currentPosition.distanceTo(
            (actionEnemy.targetNode.position) as THREE.Vector2
          )

          //抵达检查点
          if( distanceToTarget <= 0.05 ){
            actionEnemy.targetNode = actionEnemy.targetNode.nextNode;
            //抵达最后一个node
            if( actionEnemy.targetNode === null ){
              actionEnemy.nextCheckPoint();
              //抵达终点
              if( !actionEnemy.currentCheckPoint ){
                actionEnemy.exitMap();
              }
            }

          }
        }
        break;
    }
  }


  public update(currentSecond: number){
    this.removeEnemys();
    this.action();

    //游戏整数时间发生变动
    if(currentSecond > this.currentSecond){
      this.currentSecond = currentSecond;
      this.updateEnemyWaitingCounts();
      this.spawnEnemy();
    }
    
  }

}

export default EnemyManager;