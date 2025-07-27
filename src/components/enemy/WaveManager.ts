import Action from "../game/Action";
import GameManager from "../game/GameManager";
import MapModel from "../game/MapModel";
import Trap from "../game/Trap";
import Enemy from "./Enemy"
import eventBus from "@/components/utilities/EventBus";

//敌人状态管理
class WaveManager{
  public gameManager: GameManager;
  public mapModel: MapModel;

  public actions: Action[][] = [];  
  public enemies: Enemy[] = []; //敌人对象数组
  public traps: Trap[] = []; //地图装置
  public enemiesInMap: number[] = []; //需要在地图上渲染的enemy

  private waveIndex: number = 0;
  public actionIndex: number = -1;  //当前波次的actionIndex
  public gameSecond: number = 0; //当前游戏时间
  public waveSecond: number = 0;     //当前波次时间
  public allWaveFinished: boolean = false;  //全部波次已经结束
  
  constructor(mapModel: MapModel, gameManager: GameManager,){
    this.gameManager = gameManager;
    this.mapModel = mapModel;

    //通过actionData生成action对象 并且和enemy trap绑定
    this.initTraps();
    this.mapModel.SPFA.generatepathMaps(); //生成寻路地图，不过不一次性全部生成其实也行
    this.initActions();
    
  }

  private initTraps(){
    this.mapModel.trapDatas.forEach(trapData => {
      const trap = new Trap(trapData);
      this.traps.push(trap);
    });
    this.mapModel.mapTiles.bindTraps(this.traps);
  }

  public initActions(){
    let enemyId = 0;
    let actionId = 0;
    this.mapModel.actionDatas.forEach(actionDatas => {
      const inner: Action[] = [];
      actionDatas.forEach(actionData => {
        const action = new Action(actionData);
        action.id = actionId++;
        inner.push(action);
        
        switch (action.actionType) {
          
          case "SPAWN":
            const enemy = new Enemy(actionData);
            //这个enemyId就是wave处于整个waves二维数组中的哪个位置，方便使用
            enemy.id = enemyId++;
            enemy.gameManager = this.gameManager;
            enemy.waveManager = this;
            enemy.mapTiles = this.mapModel.mapTiles;
            enemy.SPFA = this.mapModel.SPFA;

            action.enemy = enemy;
            enemy.action = action;
            this.enemies.push(enemy);
            break;
          
          case "ACTIVATE_PREDEFINED":
            action.trap = this.traps.find(trap => actionData.trapData.alias === trap.alias);
            break;
        }
      })

      this.actions.push(inner);
    })

    if(!this.gameManager.isSimulate){
      eventBus.emit("actions_init", this.actions);
    }
  }


  private removeEnemies(){
    const enemiesInMap = this.getEnemiesInMap();
    for(let i = enemiesInMap.length - 1; i >= 0; i--){
      const enemy = enemiesInMap[i];
      if(enemy.isFinished){
        this.enemiesInMap.splice(i, 1);
      }
    }

  }

  public getEnemiesInMap(): Enemy[]{
    const enemies = [];

    for(let i = 0; i< this.enemiesInMap.length; i++){
      const id = this.enemiesInMap[i];
      enemies.push(this.enemies[id]);
    }

    return enemies;
  }

  public currentActions(): Action[]{
    return this.actions[this.waveIndex];
  }


  public getEnemysByWaveIndex(waveIndex: number): Enemy[]{
    const enemys = [];
    const actions = this.actions[waveIndex];
    actions?.forEach(action => {
      if(action.enemy){
        enemys.push(action.enemy);
      }
    })

    return enemys.length > 0 ? enemys : null;
  }

  private currentWaveEnemys(): Enemy[]{
    return this.getEnemysByWaveIndex(this.waveIndex);
  }

  private changeNextWave(){
    this.waveIndex ++;
    this.actionIndex = -1;
    this.waveSecond = 0;
  }

  private checkWaveFinished(){
    const isWaveFinished = !this.currentActions().find(action => {
      //不阻挡波次和没有绑定敌人
      if((action.isStarted && action.dontBlockWave) || !action.enemy){
        return false;
      }else{
        return !action.enemy.isFinished;
      }
    })

    //切换到下一波次
    if(isWaveFinished){
      this.changeNextWave();
    }
  }

  //检查是否游戏结束
  private checkFinished(){
    const nextEnemys = this.getEnemysByWaveIndex(this.waveIndex + 1);
    const currentEnemys = this.currentWaveEnemys();

    let finished = false;
    if(currentEnemys === null){
      finished = true;
    }
    else if(nextEnemys === null){
      
      finished = currentEnemys.every(enemy => {
        //敌人结束 或者 敌人已经开始但是是非首要目标
        return enemy.isFinished || (enemy.isStarted && enemy.notCountInTotal)
      })

    }

    if(finished){
      this.allWaveFinished = true;
      this.gameManager.isFinished = true;
    }
  }

  private handleAction(){
    const currentActions = this.actions[this.waveIndex];
    for (let i=0; i<currentActions.length; i++){ 

      const action: Action = currentActions[i];
      
      if(!action.isStarted && action.startTime <= this.waveSecond){
        action.start();
        
        if(action.enemy){
          this.enemiesInMap.push(action.enemy.id);
        }

        this.actionIndex ++;
        eventBus.emit("action_index_change", this.actionIndex, this.waveIndex)
      }
    }

  }


  public update(delta: number){
    if(this.allWaveFinished) return;

    this.removeEnemies();
    this.checkWaveFinished();
    this.checkFinished();

    if(this.allWaveFinished) return;

    this.getEnemiesInMap().forEach(
      enemy => {
          enemy.update(delta)
      }
    )

    this.handleAction();
    
    this.gameSecond += delta;
    this.waveSecond += delta;

  }

  public get(){
    const actionStates = [];
    const enemyStates = [];
    const trapStates = [];

    this.actions.forEach(innerActions => {
      innerActions.forEach(action => {
        actionStates.push(action.get());
      })
    })

    this.enemies.forEach(enemy => {
      enemyStates.push(enemy.get());
    })

    this.traps.forEach(trap => {
      trapStates.push(trap.get());
    })

    let state = {
      actionStates,
      enemyStates,
      trapStates,
      enemiesInMap: [...this.enemiesInMap],
      actionIndex: this.actionIndex,
      waveIndex: this.waveIndex,
      gameSecond: this.gameSecond,
      waveSecond: this.waveSecond,
      allWaveFinished: this.allWaveFinished
    }

    return state;
  }

  public set(state){
    const {
      enemiesInMap, 
      actionIndex, 
      waveIndex, 
      gameSecond,
      waveSecond, 
      allWaveFinished, 
      actionStates,
      enemyStates,
      trapStates,
    } = state;

    this.enemiesInMap = [...enemiesInMap];
    this.actionIndex = actionIndex;
    this.waveIndex = waveIndex;
    this.gameSecond = gameSecond;
    this.waveSecond = waveSecond;
    this.allWaveFinished = allWaveFinished;

    const actions = this.actions.flat();
    for(let i = 0; i< actions.length; i++){
      const aState = actionStates[i];
      const action = actions[i];

      action.set(aState);
    }

    for(let i = 0; i< enemyStates.length; i++){
      const eState = enemyStates[i];
      const enemy = this.enemies[i];

      enemy.set(eState);
    }

    for(let i = 0; i< trapStates.length; i++){
      const tState = trapStates[i];
      const trap = this.traps[i];

      trap.set(tState);
    }
    
    eventBus.emit("action_index_change", actionIndex, waveIndex);
  }

  public destroy(){
    this.enemies.forEach(e => e?.destroy());
    this.enemies = null;
    this.enemiesInMap = null;
    this.gameManager = null;
    this.mapModel = null;
  }
}

export default WaveManager;