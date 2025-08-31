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

  public actionId: number = 0;
  public enemyId: number = 0;
  public maxEnemyCount: number = 0;
  public finishedEnemyCount: number = 0;
  private isFinished: boolean = false;
  private needUpdateSPFA: boolean = false;

  public visualRoutes = [];
  constructor(){
    Global.waveManager = this;
    
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
      route.visualRoutes = this.getPathNodes(route);
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

          if(!node){
            node = {
              distance: 0,
              nextNode: null,
              position,
            }
          }
          
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
    this.maxEnemyCount = this.actions.flat().length;
  }


  public initExtraActions(){
    this.mapModel.extraActionDatas.forEach(extraActionData => {
      const actions = this.createActions(extraActionData.actionDatas);
      actions.forEach(action => action.isExtra = true);
      
      this.extraActions.push({
        key: extraActionData.key,
        isStart: false,
        isFinish: false,
        waveSecond: 0,
        actions
      })

    })

  }

  public createActions(actionDatas: ActionData[]){

    const actions: Action[] = [];

    actionDatas.forEach(actionData => {
      const action = new Action(actionData);
      action.id = this.actionId++;
      actions.push(action);
      
      
    })
  
    return actions;
  }

  private removeEnemies(){
    for(let i = this.enemiesInMap.length - 1; i >= 0; i--){
      const enemy = this.enemiesInMap[i];
      if(enemy.isFinished){
        this.enemiesInMap.splice(i, 1);
        
        if(!enemy.isExtra) this.finishedEnemyCount++;
        
        eventBus.emit("setData", {
          finishedEnemyCount: this.finishedEnemyCount
        });
      }
    }

  }

  public currentActions(): Action[]{
    return this.actions[this.waveIndex];
  }


  public getActionsByWaveIndex(waveIndex: number): Action[]{
    const actions = this.actions[waveIndex];
    return actions;
  }

  private currentWaveActtons(): Action[]{
    return this.getActionsByWaveIndex(this.waveIndex);
  }

  private changeNextWave(){
    this.waveIndex ++;
    this.actionIndex = -1;
    this.waveSecond = 0;
  }

  private checkWaveFinished(){
    const currentActions = this.currentActions();
    if(!currentActions) return;

    const extraStartActs = [];
    this.extraActions.forEach(extra => {
      extra.isStart && extraStartActs.push(...extra.actions)
    })

    const isWaveFinished = ![...currentActions, ...extraStartActs].find(action => {
      //不阻挡波次和没有绑定敌人
      if((action.isStarted && action.dontBlockWave) || action.actionType !== "SPAWN"){
        return false;
      }else{
        return !(action.isStarted && action.enemys[0]?.isFinished);
      }
    })

    //切换到下一波次
    if(isWaveFinished){
      this.changeNextWave();
    }
  }

  //检查是否游戏结束
  private checkFinished(){
    
    if(this.isSpawnFinished()){
      if(this.enemiesInMap.length === 0){
        //波次结束，并且场上无敌人
        this.isFinished = true;
      }else{
        
        this.isFinished = this.enemiesInMap.every(enemy => {
          //敌人结束 或者 敌人已经开始但是是非首要目标
          return enemy.isFinished || (enemy.isStarted && enemy.notCountInTotal)
        })
      }
      
    }
    
    if(this.isFinished){
      Global.gameManager.handleFinish();
    }
  }

  //是否主要波次出怪全部完毕
  private isSpawnFinished(){
    const currentActions = this.currentWaveActtons();
    let spawnFinished = false;
    if(currentActions){
      
      const nextActions = this.getActionsByWaveIndex(this.waveIndex + 1);
      //最后一个波次全部出怪完毕
      spawnFinished = !nextActions && currentActions.every(action => action.isStarted);
    }else{
      spawnFinished = true;
    }

    return spawnFinished;
  }

  public startExtraAction(key: string){
    const extraAction = this.getExtraAction(key);
    if(extraAction){
      extraAction.actions.forEach(action => action.isStarted = false);
      extraAction.isStart = true;
      extraAction.isFinish = false;
      extraAction.waveSecond = 0;
    }
  }

  public getExtraAction(key: string){
    const find = this.extraActions.find(extraAction => extraAction.key === key);
    return find? find : null;
  }

  public handleAction(actions: Action[], waveSecond: number, callback?){

    for (let i=0; i<actions.length; i++){ 

      const action: Action = actions[i];
      const actionData = action.actionData;

      if(!action.isStarted && action.startTime <= waveSecond){
        
        switch (action.actionType) {
          case "SPAWN":
            let enemy;
            if(Global.gameManager.isSimulate){
              if(actionData.enemyData.fbxMesh){
                enemy = new FbxEnemy(actionData);
              }else if(actionData.enemyData.skeletonData){
                enemy = new SpineEnemy(actionData);
              }else{
                enemy = new Enemy(actionData);
              }

              //这个enemyId就是wave处于整个waves二维数组中的哪个位置，方便使用
              enemy.id = this.enemyId++;
              
              action.enemys.push(enemy);
              action.waveManager = this;

              enemy.action = action;
              enemy.isExtra = action.isExtra;
              this.enemies.push(enemy);
            }else{
              enemy = action.enemys[action.applyId];
              
            }

            action.applyId++;

            enemy.start();
            this.enemiesInMap.push(enemy);
            break;
          case "ACTIVATE_PREDEFINED":
          case "TRIGGER_PREDEFINED":
            if(Global.gameManager.isSimulate){
              const trapData = actionData.trapData;
              if(trapData){
                action.trap = Global.trapManager.traps.find(trap => trap.alias === trapData.alias);
              }
            }
            switch (action.actionType) {
              case "ACTIVATE_PREDEFINED":
              if(action.trap){
                action.trap.tile.bindTrap(action.trap);
                action.trap.show();

                if(action.trap.canBlockRoute()){
                  this.needUpdateSPFA = true;
                }

                //模拟data set的时候会手动添加
                if(!Global.gameManager.isSimulate){
                  Global.gameManager.gameView?.trapObjects?.add(action.trap.object);
                }
              }

              break;
            case "TRIGGER_PREDEFINED":
              const regex = /:([^:]+)$/;
              const match = action.key.match(regex);
              if(match){
                const eventName = match[1];
                action.trap.applyEvent(eventName);
              }
              break;
            }
          break;
        }
        action.start();
        
        if(callback) callback();
      }
    }

  }

  public update(delta: number){
    if(this.isFinished) return;

    this.gameSecond = Global.gameManager.gameSecond;
    this.waveSecond += delta;

    const currentActions = this.actions[this.waveIndex];

    currentActions && this.handleAction(currentActions, this.waveSecond, () => {
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

    //在action执行后，enemy更新前调用
    //这样一帧哪怕部署了多个阻挡路线的装置，也只会计算一次寻路，提升性能
    if(this.needUpdateSPFA){
      Global.SPFA.regenerate(true);
      this.generateVisualRoutes();
      this.needUpdateSPFA = false;
    }

    if(this.isFinished) return;
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
      finishedEnemyCount: this.finishedEnemyCount,
      extraActionStates,
      isFinished: this.isFinished
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
      finishedEnemyCount,
      actionStates,
      enemyStates,
      extraActionStates,
      isFinished
    } = state;

    this.enemiesInMap = [...enemiesInMap];
    this.actionIndex = actionIndex;
    this.waveIndex = waveIndex;
    this.gameSecond = gameSecond;
    this.waveSecond = waveSecond;
    this.finishedEnemyCount = finishedEnemyCount;
    this.isFinished = isFinished;
    
    const actions = this.actions.flat();
    for(let i = 0; i< actions.length; i++){
      const aState = actionStates[i];
      const action = actions[i];

      action.set(aState);
    }

    //todo 更节省内存的写法
    for(let i = 0; i< this.enemies.length; i++){
      
      const eState = enemyStates[i];
      const enemy = this.enemies[i];
      if(eState){
        enemy.set(eState);
      }else{
        //没有eState的都是还未开始的敌人
        enemy.isStarted = false;
        enemy.isFinished = false;
        enemy.hide();
      }

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