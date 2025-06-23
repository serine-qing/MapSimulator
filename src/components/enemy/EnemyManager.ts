import Enemy from "./Enemy.ts"
import * as THREE from "three";
let test = 0;

//敌人状态管理
class EnemyManager{
  private enemyWaves: EnemyWave[];
  // private wayFindMaps: WayFindMap[];
  public enemies: Enemy[] = []; //敌人对象数组
  public enemiesInMap: Enemy[] = []; //需要在地图上渲染的enemies

  private currentSecond = -1; //当前游戏时间（-1为未开始默认值）
  constructor(enemyWaves, wayFindMaps){
    this.enemyWaves = enemyWaves;
    // this.wayFindMaps = wayFindMaps;

    this.initEnemies();

    // console.log(this.enemies)
    // console.log(this.wayFindMaps)
  }

  private initEnemies(){
    this.enemyWaves.forEach(wave =>{
      const enemy = new Enemy(wave);
      this.enemies.push(enemy);
    })
    
  }

  private removeEnemies(){
    for(let i = 0; i<this.enemiesInMap.length; i++){
      if(this.enemiesInMap[i].exit){
        this.enemiesInMap.splice(i, 1);
      }
    }
  }

  private updateEnemyWaitingCounts(){
    this.enemies.forEach(enemy => {
      
      if(enemy.waitingConuts > 0){

        enemy.setWaitingCounts(enemy.waitingConuts - 1);
        
        if(enemy.waitingConuts === 0){
          enemy.nextCheckPoint()
        }
        // console.log(enemy.waitingConuts)
      }
    })
  }

  private spawnEnemy(){
    for (let i=0; i<this.enemyWaves.length; i++){ 
      if(this.currentSecond === this.enemyWaves[i].startTime){

        if(test++  <= 100){
        //重置
        this.enemies[i].reset();
        this.enemiesInMap.push(this.enemies[i]);
        }
        
      }
    }
    // console.log(this.enemiesInMap)
  }

  private action(){
    for(let i=0; i<this.enemiesInMap.length; i++){
      let actionEnemy = this.enemiesInMap[i];
      this.singleEnemyAction(actionEnemy);
    }
    
  }

  private singleEnemyAction(actionEnemy: Enemy){
    const checkPoint: CheckPoint = actionEnemy.currentCheckPoint();
    switch (checkPoint.type) {
      case "MOVE":  
        const pathMap = checkPoint.wayFindMap.map;
        const currentPosition = actionEnemy.position;
        
        if(actionEnemy.targetNode === null){
          //第一次执行move 添加targetNode
          const intX = Math.floor(currentPosition.x + 0.5);
          const intY = Math.floor(currentPosition.y + 0.5);

          actionEnemy.setTargetNode(pathMap[intY][intX].nextNode)
        }

        //防止重复检查点导致targetNode为null
        if(actionEnemy.targetNode){
          //移动单位向量
          const unitVector = new THREE.Vector2(
            actionEnemy.targetNode.position.x - currentPosition.x,
            actionEnemy.targetNode.position.y - currentPosition.y
          ).normalize(); 

          //TODO 倍速移动常量需要设置
          const moveDistancePerFrame = actionEnemy.moveSpeed * 1/30;

          actionEnemy.setDirection(unitVector);

          actionEnemy.setPosition(
            currentPosition.x + unitVector.x * moveDistancePerFrame,
            currentPosition.y + unitVector.y * moveDistancePerFrame
          );

          const distanceToTarget = currentPosition.distanceTo(
            (actionEnemy.targetNode.position) as THREE.Vector2
          )

          //抵达检查点
          if( distanceToTarget <= 0.05 ){
            actionEnemy.targetNode = actionEnemy.targetNode?.nextNode;
            //抵达最后一个node
            if( actionEnemy.targetNode === null || undefined ){
              actionEnemy.nextCheckPoint();
            }
          }

        } else {
          actionEnemy.nextCheckPoint();
        }

        // console.log(actionEnemy.position)
        break;

      case "WAIT_FOR_SECONDS":
        if(!actionEnemy.isWaiting()){
          actionEnemy.setWaitingCounts(checkPoint.time);
        }
        break;
    }
  }


  public update(currentSecond: number){
    this.removeEnemies();
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