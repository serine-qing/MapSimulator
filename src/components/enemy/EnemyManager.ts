import GameManager from "../game/GameManager";
import Enemy from "./Enemy"
import eventBus from "@/components/utilities/EventBus";

//敌人状态管理
class EnemyManager{
  public gameManager: GameManager;

  public enemies: Enemy[][] = []; //敌人对象数组
  public flatEnemies: Enemy[] = []; //一维敌人对象数组，方便读取
  public enemiesInMap: Enemy[] = []; //需要在地图上渲染的enemies
  public enemyIndex: number = -1;     //当前出到第几个敌人

  private waveIndex: number = 0;
  private currentSecond: number = -1; //当前游戏时间（-1为未开始默认值）
  private usedSecond:number = 0;     //之前波次已经使用掉的时间
  public allWaveFinished: boolean = false;  //全部波次已经结束
  
  constructor(enemyWaves: EnemyWave[][], gameManager: GameManager){
    this.gameManager = gameManager;
    this.initEnemies(enemyWaves);
  }

  public initEnemies(enemyWaves: EnemyWave[][]){
    enemyWaves.forEach(innerWaves =>{

      const innerEnemies: Enemy[] = [];

      innerWaves.forEach(wave => {
        const enemy = new Enemy(wave);
        enemy.gameManager = this.gameManager;
        innerEnemies.push(enemy);
      })

      this.enemies.push(innerEnemies);
    })

    this.flatEnemies = this.enemies.flat();
    eventBus.emit("enemies_init", this.flatEnemies);
  }

  private removeEnemies(){
    
    for(let i = this.enemiesInMap.length - 1; i >= 0; i--){
      if(this.enemiesInMap[i].isFinished){
        this.enemiesInMap.splice(i, 1);
      }
    }

    //该波次最后一个怪进蓝门，就切换到下一波次
    if(this.isWaveFinished()){
      this.nextWave();
    }
  }

  private currentWave(): Enemy[]{
    return this.enemies[this.waveIndex];
  }

  private isWaveFinished(): boolean{
    return !this.currentWave().find(wave => !wave.isFinished);
  }

  private nextWave(){
    this.waveIndex ++;
    this.usedSecond = this.currentSecond;
    if(this.currentWave() === undefined){
      this.allWaveFinished = true;
      this.gameManager.isFinished = true;
    }
  }

  //以波次计时
  private waveSecond(){
    return this.currentSecond - this.usedSecond;
  }

  private spawnEnemy(){
    const waves = this.currentWave();

    for (let i=0; i<waves.length; i++){ 

      const enemy: Enemy = waves[i];

      if(!enemy.isStarted && enemy.startTime <= this.waveSecond()){

        enemy.reset();
        enemy.isStarted = true;
        //重置
        
        this.enemiesInMap.push(enemy);
        this.enemyIndex ++;
        eventBus.emit("enemy_index_change", this.enemyIndex)
      }
    }

  }

  public update(currentSecond: number){
    if(this.allWaveFinished) return;

    this.currentSecond = currentSecond;
    this.removeEnemies();
    // this.removeEnemies();

    if(this.allWaveFinished) return;

    for(let i = 0; i< this.enemiesInMap.length; i++){
      this.enemiesInMap[i].update(this.waveSecond(), this.usedSecond);
    }

    this.spawnEnemy();
    
  }

  public destroy(){
    this.flatEnemies.forEach(e => e?.destroy());
    this.enemies = null;
    this.flatEnemies = null; 
    this.enemiesInMap = null;
    this.gameManager = null;
  }
}

export default EnemyManager;