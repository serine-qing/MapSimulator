import Action from "../game/Action";
import GameManager from "../game/GameManager";
import MapModel from "../game/MapModel";
import TrapManager from "../game/TrapManager";
import Enemy from "./Enemy"
import eventBus from "@/components/utilities/EventBus";
import SpineEnemy from "./SpineEnemy";
import FbxEnemy from "./FbxEnemy";
import Global from "../utilities/Global";

//敌人状态管理
class WaveManager{
  public mapModel: MapModel;

  public actions: Action[][] = [];  
  public extraActions: any[] = [];  

  public enemies: Enemy[] = []; //敌人对象数组
  public enemiesInMap: Enemy[] = []; //需要在地图上渲染的enemy

  private waveIndex: number = 0;
  public actionIndex: number = -1;  //当前波次的actionIndex
  public gameSecond: number = 0; //当前游戏时间
  public waveSecond: number = 0;     //当前波次时间
  public allWaveFinished: boolean = false;  //全部波次已经结束

  public actionId: number = 0;
  public enemyId: number = 0;
  public maxEnemyCount: number = 0;
  public finishedEnemyCount: number = 0;

  public visualRoutes = [];
  constructor(){
    this.mapModel = Global.gameManager.mapModel;

    //通过actionData生成action对象 并且和enemy trap绑定
    Global.SPFA.generatepathMaps(); //生成寻路地图，不过不一次性全部生成其实也行
    
    this.initActions();
    this.initExtraActions();
    this.generateVisualRoutes();  //生成模拟显示路线

    if(!Global.gameManager.isSimulate){
      eventBus.emit("actions_init", this.actions);
    }
  }
  
  private generateVisualRoutes(){
    const routes = [...this.mapModel.routes, ...this.mapModel.extraRoutes]; 
    routes.forEach(route => {
      const pathNodes = this.getPathNodes(route);
      this.enemies.forEach(enemy => {
        if(enemy.route === route){
          enemy.visualRoutes = pathNodes;
        }
      });
    })

  }

  private getPathNodes(route: EnemyRoute){
    const pathNodes = [];
    let currentPosition = route.startPosition;
    pathNodes.push({
      type: "start",
      position: currentPosition
    })

    route.checkpoints.forEach(checkpoint => {
      const { position, reachOffset, type, time } = checkpoint;
      switch (type) {
        case "MOVE":
          let node = Global.SPFA.getPathNode(
            position,
            route.motionMode,
            currentPosition
          );

          if(reachOffset && !node.nextNode){
            pathNodes.push({
              type: "checkpoint",
              position: {
                x: node.position.x + reachOffset.x,
                y: node.position.y + reachOffset.y
              }
            });
            currentPosition = node.position;
          }

          while (node = node.nextNode) {
            let nPos = node.position;
            if(reachOffset){
              nPos = {
                x: nPos.x + reachOffset.x,
                y: nPos.y + reachOffset.y,
              }
            }
            pathNodes.push({
              type: node.nextNode ? "move" : "checkpoint",
              position: nPos,
            });
            currentPosition = node.position;
          }

          break;
        case "WAIT_FOR_SECONDS":               //等待一定时间
        case "WAIT_FOR_PLAY_TIME":             //等待至游戏开始后的固定时刻
        case "WAIT_CURRENT_FRAGMENT_TIME":     //等待至分支(FRAGMENT)开始后的固定时刻
        case "WAIT_CURRENT_WAVE_TIME":         //等待至波次(WAVE)开始后的固定时刻
          pathNodes.push({
            type: "wait",
            time: time
          });
          break;
        case "DISAPPEAR":
          pathNodes.push({
            type: "disappear"
          });
          break;
        case "APPEAR_AT_POS":
          pathNodes.push({
            type: "appear",
            position
          });
          currentPosition = position;
          break;
      }
    })

    return pathNodes;
  }

  public initActions(){

    this.mapModel.actionDatas.forEach(datas => {
      this.actions.push(this.createActions(datas));
    })
    this.maxEnemyCount = this.enemyId;
  }


  public initExtraActions(){
    let id = 0;

    Global.trapManager.traps.forEach(trap => {
      const extraWave = trap.data.extraWave;
      if(extraWave){
        const actions = this.createActions(trap.data.extraWave);
        actions.forEach(action => action.enemy.hasBirthAnimation = true);
        
        this.extraActions.push({
          id,
          isStart: false,
          isFinish: false,
          waveSecond: 0,
          actions
        })

        trap.extraWaveId = id;
        id++;
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
          let enemy;
          if(actionData.enemyData.fbxMesh){
            enemy = new FbxEnemy(actionData);
          }else{
            enemy = new SpineEnemy(actionData);
          }
          
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
            action.trap = Global.trapManager.traps.find(trap => trap.alias === trapData.alias);
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
        this.finishedEnemyCount++;
        eventBus.emit("setData", {
          finishedEnemyCount: this.finishedEnemyCount
        });
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
      
      finished = this.enemies.every(enemy => {
        //敌人结束 或者 敌人已经开始但是是非首要目标
        return enemy.isFinished || (enemy.isStarted && enemy.notCountInTotal)
      })

    }

    if(finished){
      this.allWaveFinished = true;
      Global.gameManager.isFinished = true;
    }
  }

  public startExtraAction(id: number){
    const extraAction = this.getExtraAction(id);
    if(extraAction){
      extraAction.isStart = true;
      extraAction.isFinish = false;
      extraAction.waveSecond = 0;
    }
  }

  public getExtraAction(id: number){
    const find = this.extraActions.find(extraAction => extraAction.id === id);
    return find? find : null;
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
              //模拟data set的时候会手动添加
              if(!Global.gameManager.isSimulate){
                Global.gameManager.gameView?.trapObjects?.add(action.trap.object);
              }
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
    this.gameSecond = Global.gameManager.gameSecond;
    this.waveSecond += delta;

    const currentActions = this.actions[this.waveIndex];

    this.handleAction(currentActions, this.waveSecond, () => {
      //添加成功后的回调
      this.actionIndex ++;
      eventBus.emit("action_index_change", this.actionIndex, this.waveIndex)
    });

    for(let i = 0; i < this.extraActions.length; i++){
      const extra = this.extraActions[i];
      if(extra.isStart && !extra.isFinish){
        extra.waveSecond += delta;
        this.handleAction(extra.actions, extra.waveSecond);

        const allStarted = extra.actions.every(action => action.isStarted);
        if(allStarted){
          extra.isFinish = true;
        }
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
      return {
        isStart: extra.isStart,
        isFinish: extra.isFinish,
        waveSecond: extra.waveSecond,
        actionStates: extra.actions.map(action => action.get())
      };
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
      finishedEnemyCount: this.finishedEnemyCount,
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
      finishedEnemyCount,
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
    this.finishedEnemyCount = finishedEnemyCount;

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

    for(let i = 0; i < extraActionStates.length; i++){
      const extraActionState = extraActionStates[i];
      const extraAction = this.extraActions[i];

      extraAction.isStart = extraActionState.isStart;
      extraAction.isFinish = extraActionState.isFinish;
      extraAction.waveSecond = extraActionState.waveSecond;
      extraAction.actions.forEach((action, index) => {
        action.set(extraActionState.actionStates[index])
      });;

    }

    eventBus.emit("action_index_change", actionIndex, waveIndex);
    eventBus.emit("setData", {
      finishedEnemyCount: this.finishedEnemyCount
    });
  }

  public destroy(){
    this.enemies.forEach(e => e?.destroy());
    this.enemies = null;
    this.enemiesInMap = null;
    this.mapModel = null;
  }
}

export default WaveManager;