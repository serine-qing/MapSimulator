import GameManager from "../game/GameManager";
import Enemy from "./Enemy"
import * as THREE from "three";

//敌人状态管理
class EnemyManager{
  private enemyWaves: EnemyWave[];
  // private pathMaps: PathMap[];
  public enemies: Enemy[] = []; //敌人对象数组
  public enemiesInMap: Enemy[] = []; //需要在地图上渲染的enemies
  private currentSecond = -1; //当前游戏时间（-1为未开始默认值）

  public gameManager: GameManager;
  constructor(enemyWaves: EnemyWave[]){
    this.enemyWaves = enemyWaves;
    // console.log(this.enemyWaves)
  }

  public initEnemies(){
    this.enemyWaves.forEach(wave =>{
      const enemy = new Enemy(wave);
      enemy.gameManager = this.gameManager;
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

  private spawnEnemy(){
    for (let i=0; i<this.enemyWaves.length; i++){ 

      const wave = this.enemyWaves[i];

      if(!wave.isStarted && wave.startTime <= this.currentSecond){

        wave.isStarted = true;
        //重置
        this.enemies[i].reset();
        this.enemiesInMap.push(this.enemies[i]);

      }
    }

  }

  public update(currentSecond: number){
    this.currentSecond = currentSecond;
    this.removeEnemies();

    for(let i = 0; i< this.enemiesInMap.length; i++){
      this.enemiesInMap[i].update(currentSecond);
    }

    this.spawnEnemy();

  }

}

export default EnemyManager;