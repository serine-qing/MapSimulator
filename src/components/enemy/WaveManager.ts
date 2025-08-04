import Action from "../game/Action";
import GameManager from "../game/GameManager";
import MapModel from "../game/MapModel";
import Trap from "../game/Trap";
import TrapManager from "../game/TrapManager";
import Enemy from "./Enemy"
import eventBus from "@/components/utilities/EventBus";

//敌人状态管理
class WaveManager{
  public gameManager: GameManager;
  public trapManager: TrapManager;
  public mapModel: MapModel;

  public actions: Action[][] = [];  
  public extraActions: any[] = [];  

  public enemies: Enemy[] = []; //敌人对象数组
  public enemyCount: number = 0;
  public enemiesInMap: Enemy[] = []; //需要在地图上渲染的enemy

  private waveIndex: number = 0;
  public actionIndex: number = -1;  //当前波次的actionIndex
  public gameSecond: number = 0; //当前游戏时间
  public waveSecond: number = 0;     //当前波次时间
  public allWaveFinished: boolean = false;  //全部波次已经结束

  public actionId: number = 0;
  public enemyId: number = 0;
  
  constructor(gameManager: GameManager,){
    this.gameManager = gameManager;
    this.trapManager = gameManager.trapManager;
    this.mapModel = gameManager.mapModel;

    //通过actionData生成action对象 并且和enemy trap绑定
    this.mapModel.SPFA.generatepathMaps(); //生成寻路地图，不过不一次性全部生成其实也行
    this.initActions();
    this.initExtraActions();

    if(!this.gameManager.isSimulate){
      eventBus.emit("actions_init", this.actions);
    }
  }

  public initActions(){

    this.mapModel.actionDatas.forEach(datas => {
      this.actions.push(this.createActions(datas));
    })

  }


  public initExtraActions(){
    this.trapManager.traps.forEach(trap => {
      const extraWave = trap.data.extraWave;
      if(extraWave){
        trap.extraWave = this.createActions(trap.data.extraWave);
      }
    });

  }

  public createActions(actionDatas: ActionData[]){

    const actions: Action[] = [];

    actionDatas.forEach(actionData => {
      const action = new Action(actionData);
      action.id = this.actionId++;
      actions.push(action);
      
      switch (action.actionType) {
        
        case "SPAWN":
          const enemy = new Enemy(actionData, this.gameManager, this);
          enemy.id = this.enemyId++;
          //这个enemyId就是wave处于整个waves二维数组中的哪个位置，方便使用
          action.enemy = enemy;
          action.waveManager = this;

          enemy.action = action;
          this.enemies.push(enemy);
          break;
        
        case "ACTIVATE_PREDEFINED":
          const trapData = actionData.trapData;
          if(trapData){
            action.trap = this.trapManager.traps.find(trap => trap.alias === trapData.alias);
          }
          break;
      }
    })
  
    return actions;
  }

  private removeEnemies(){
    for(let i = this.enemiesInMap.length - 1; i >= 0; i--){
      const enemy = this.enemiesInMap[i];
      if(enemy.isFinished){
        this.enemiesInMap.splice(i, 1);
      }
    }

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

  public addExtraActions(actions: Action[]){
    this.extraActions.push({
      waveSecond: 0,
      actions
    })
  }

  public handleAction(actions: Action[], waveSecond: number, callback?){
    
    for (let i=0; i<actions.length; i++){ 

      const action: Action = actions[i];
      
      if(!action.isStarted && action.startTime <= waveSecond){
        switch (action.actionType) {
          case "SPAWN":
            action.enemy.start();
            this.enemiesInMap.push(action.enemy);
            break;
          case "ACTIVATE_PREDEFINED":
            if(action.trap){
              action.trap.tile.bindTrap(action.trap);
              action.trap.show();
            }

            break;
        }
        action.start();
        
        if(callback) callback();
      }
    }

  }

  public update(delta: number){
    if(this.allWaveFinished) return;
    this.gameSecond = this.gameManager.gameSecond;
    this.waveSecond += delta;

    const currentActions = this.actions[this.waveIndex];

    this.handleAction(currentActions, this.waveSecond, () => {
      //添加成功后的回调
      this.actionIndex ++;
      eventBus.emit("action_index_change", this.actionIndex, this.waveIndex)
    });

    for(let i = 0; i < this.extraActions.length; i++){
      const extra = this.extraActions[i];
      extra.waveSecond += delta;
      this.handleAction(extra.actions, extra.waveSecond);

      const allStarted = extra.actions.every(action => action.isStarted);
      if(allStarted){
        this.extraActions.splice(i, 1);
        i--;
      }
    }

    if(this.allWaveFinished) return;
    this.enemiesInMap.forEach(
      enemy => {
          enemy.update(delta)
      }
    )

    this.removeEnemies();
    this.checkWaveFinished();
    this.checkFinished();
  }

  public get(){
    const actionStates = [];
    const enemyStates = [];

    const extraActionStates = this.extraActions.map(extra => {
      return {...extra};
    });

    this.actions.forEach(innerActions => {
      innerActions.forEach(action => {
        actionStates.push(action.get());
      })
    })

    this.enemies.forEach(enemy => {
      enemyStates.push(enemy.get());
    })

    let state = {
      actionStates,
      enemyStates,
      enemiesInMap: [...this.enemiesInMap],
      actionIndex: this.actionIndex,
      waveIndex: this.waveIndex,
      gameSecond: this.gameSecond,
      waveSecond: this.waveSecond,
      allWaveFinished: this.allWaveFinished,
      extraActionStates
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
      extraActionStates
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

    this.extraActions = extraActionStates.map(extra => {
      return {...extra};
    })
    
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