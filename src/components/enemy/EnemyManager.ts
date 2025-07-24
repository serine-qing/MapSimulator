import GameManager from "../game/GameManager";
import MapModel from "../game/MapModel";
import Enemy from "./Enemy"
import eventBus from "@/components/utilities/EventBus";

//敌人状态管理
class EnemyManager{
  public gameManager: GameManager;
  public mapModel: MapModel;

  public enemies: Enemy[][] = []; //敌人对象数组
  public flatEnemies: Enemy[] = []; //一维敌人对象数组，方便读取
  public enemiesInMap: number[] = []; //需要在地图上渲染的enemy ids
  public enemyIndexInWave: number = -1;     //当前波次出到第几个敌人

  private waveIndex: number = 0;
  public gameSecond: number = 0; //当前游戏时间
  public waveSecond: number = 0;     //当前波次时间
  public allWaveFinished: boolean = false;  //全部波次已经结束
  
  constructor(mapModel: MapModel, gameManager: GameManager,){
    this.gameManager = gameManager;
    this.mapModel = mapModel;
    this.initEnemies();
  }

  public initEnemies(){
    let index = 0;
    this.mapModel.enemyWaves.forEach(innerWaves =>{

      const innerEnemies: Enemy[] = [];
      
      innerWaves.forEach(wave => {
        const enemy = new Enemy(wave);
        enemy.id = index++;
        enemy.gameManager = this.gameManager;
        enemy.enemyManager = this;
        enemy.mapTiles = this.mapModel.mapTiles;
        enemy.SPFA = this.mapModel.SPFA;
        innerEnemies.push(enemy);
      })

      this.enemies.push(innerEnemies);
    })
    
    this.flatEnemies = this.enemies.flat();

    if(!this.gameManager.isSimulate){
      eventBus.emit("enemies_init", this.enemies);
    }
    
  }

  private removeEnemies(){
    
    for(let i = this.enemiesInMap.length - 1; i >= 0; i--){
      const id = this.enemiesInMap[i];
      if(this.flatEnemies[id].isFinished){
        this.enemiesInMap.splice(i, 1);
      }
    }

    //该波次最后一个怪进蓝门，就切换到下一波次
    if(this.isWaveFinished()){
      this.changeNextWave();
    }
  }

  private currentWave(): Enemy[]{
    return this.enemies[this.waveIndex];
  }

  private isWaveFinished(): boolean{
    return !this.currentWave().find(wave => !wave.isFinished);
  }

  private changeNextWave(){
    this.waveIndex ++;
    this.enemyIndexInWave = -1;

    this.waveSecond = 0;
  }

  //检查是否游戏结束
  private checkFinished(){
    const nextWave = this.enemies[this.waveIndex + 1];
    const currentWave = this.currentWave();

    let finished = false;
    if(currentWave === undefined){
      finished = true;
    }
    else if(nextWave === undefined){
      
      finished = currentWave.every(enemy => {
        //敌人结束 或者 敌人已经开始但是是非首要目标
        return enemy.isFinished || (enemy.isStarted && enemy.notCountInTotal)
      })

    }

    if(finished){
      this.allWaveFinished = true;
      this.gameManager.isFinished = true;
    }
  }

  private spawnEnemy(){
    const waves = this.currentWave();

    for (let i=0; i<waves.length; i++){ 

      const enemy: Enemy = waves[i];

      if(!enemy.isStarted && enemy.startTime <= this.waveSecond){
        enemy.start();

        this.enemiesInMap.push(enemy.id);
        this.enemyIndexInWave ++;
        eventBus.emit("enemy_index_change", this.enemyIndexInWave, this.waveIndex)
      }
    }

  }

  public getEnemiesInMap(): Enemy[]{
    const enemies = [];

    for(let i = 0; i< this.enemiesInMap.length; i++){
      const id = this.enemiesInMap[i];
      enemies.push(this.flatEnemies[id]);
    }

    return enemies;
  }

  public update(delta: number){
    if(this.allWaveFinished) return;

    this.removeEnemies();
    this.checkFinished();

    if(this.allWaveFinished) return;

    this.getEnemiesInMap().forEach(
      enemy => {
          enemy.update(delta)
      }
    )

    this.spawnEnemy();
    
    this.gameSecond += delta;
    this.waveSecond += delta;

  }

  public get(){
    const enemyStates = [];
    this.flatEnemies.forEach(enemy => {
      enemyStates.push(enemy.get());
    })

    let state = {
      enemyStates,
      enemiesInMap: [...this.enemiesInMap],
      enemyIndexInWave: this.enemyIndexInWave,
      waveIndex: this.waveIndex,
      waveSecond: this.waveSecond,
      allWaveFinished: this.allWaveFinished
    }

    return state;
  }

  public set(state){
    const {
      enemiesInMap, 
      enemyIndexInWave, 
      waveIndex, 
      waveSecond, 
      allWaveFinished, 
      enemyStates
    } = state;

    this.enemiesInMap = [...enemiesInMap];
    this.enemyIndexInWave = enemyIndexInWave;
    this.waveIndex = waveIndex;
    this.waveSecond = waveSecond;
    this.allWaveFinished = allWaveFinished;

    for(let i = 0; i< enemyStates.length; i++){
      const eState = enemyStates[i];
      const enemy = this.flatEnemies[i];

      enemy.set(eState);
    }
    
    eventBus.emit("enemy_index_change", enemyIndexInWave, waveIndex);
  }

  public destroy(){
    this.flatEnemies.forEach(e => e?.destroy());
    this.enemies = null;
    this.flatEnemies = null; 
    this.enemiesInMap = null;
    this.gameManager = null;
    this.mapModel = null;
  }
}

export default EnemyManager;