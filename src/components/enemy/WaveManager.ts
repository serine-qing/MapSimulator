import Action from "../game/Action";
import GameManager from "../game/GameManager";
import MapModel from "../game/MapModel";
import TrapManager from "../game/TrapManager";
import Enemy from "./Enemy"
import eventBus from "@/components/utilities/EventBus";
import SpineEnemy from "./SpineEnemy";
import FbxEnemy from "./FbxEnemy";
import Global from "../utilities/Global";
import { Mesh } from "three";

interface Wave{
  advancedWaveTag?: string,
  actions: Action[]
}

interface activeExtraAction{
  time: number,
  startTime: number,            //该波次开始时间
  enemyKey: string,
  actions: Action[],            //需要执行的actions
  currentActionIndex: number    //当前执行到哪个action
}


interface startExtraActionOptions{
  key: string,
  enemyKey?: string,
  fragmentIndex?: number,     //指定执行的fragment
  actionIndex?: number        //指定执行的currentActionIndex，数组只有一个元素
}

interface enemysInRectParam{
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  enemyIncludes?: string[],
  enemyExcludes?: string[]
}

//敌人状态管理
class WaveManager{
  public mapModel: MapModel;

  public waves: Wave[] = [];  
  public extraWaves: {[key: string]: Wave[]} = {};  
  public allActions: Action[];                           //全部action的数组，用于存取数据
  private activeExtraActions: activeExtraAction[] = [];  

  public enemies: Enemy[] = []; //敌人对象数组
  public enemiesInMap: Enemy[] = []; //需要在地图上渲染的enemy
  private removedEnemyIds: number[] = [];

  private waveIndex: number = 0;
  public currentActionIndex: number = 0;  //当前波次的actionIndex
  public gameSecond: number = 0; //当前游戏时间
  public waveSecond: number = 0;     //当前波次时间

  public actionId: number = 0;
  public enemyId: number = 0;

  public maxEnemyCount: number = 0;
  public finishedEnemyCount: number = 0;
  private isFinished: boolean = false;
  private needUpdateSPFA: boolean = false;
  public cameraViewCount: number = 1;         //地图有多少面
  public currentCameraView: number = 0;         //当前在哪一面
  public visualRoutes = [];
  constructor(){
    Global.waveManager = this;
    
    this.mapModel = Global.gameManager.mapModel;

    //通过actionData生成action对象 并且和enemy trap绑定
    Global.SPFA.generatepathMaps(); //生成寻路地图，不过不一次性全部生成其实也行

    this.initActions();
    this.initExtraWave();

    this.allActions = [
      ...this.waves.map(fragment => fragment.actions).flat()
    ];
console.log(this.allActions)
    this.initCameraViews();   //多面地图数据

    Object.values(this.extraWaves).forEach(fragments => {
      fragments.forEach(fragment => {
        this.allActions.push(...fragment.actions)
        
      })
    })

    this.generateVisualRoutes();  //生成模拟显示路线

    if(!Global.gameManager.isSimulate){
      eventBus.emit("actions_init", this.waves);
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
        case "PATROL_MOVE":
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

    this.mapModel.waveDatas.forEach(wave => {
      this.waves.push({
        advancedWaveTag: wave.advancedWaveTag,
        actions: this.createActions(wave.actionDatas)
      });
    })

    let maxEnemyCount = 0;
    this.waves.forEach(fragment => {
      fragment.actions.forEach(action => {
        if(action.actionType === "SPAWN" && !(action?.actionData?.enemyData?.notCountInTotal)){
          maxEnemyCount ++;
        }
      })

    });

    this.maxEnemyCount = maxEnemyCount;
  }


  public initExtraWave(){
    this.mapModel.extraWaves.forEach(extraWaveData => {

      this.extraWaves[extraWaveData.key] = [];
      const extraWave = this.extraWaves[extraWaveData.key];

      extraWaveData.actionDatas.forEach(actionDatas => {
        const wave: Wave = {
          actions: this.createActions(actionDatas)
        }

        wave.actions.forEach(action => action.isExtra = true);

        extraWave.push(wave)
      })
      
    })

  }

  private initCameraViews(){
    this.allActions.forEach(action => {
      if(action.key === "move_camera"){
        this.cameraViewCount ++;
      }
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
        this.removedEnemyIds.push(enemy.id);
        if(!enemy.isExtra && !enemy.notCountInTotal) this.finishedEnemyCount++;
        
        eventBus.emit("setData", {
          finishedEnemyCount: this.finishedEnemyCount
        });
      }
    }

  }

  public getActionsByWaveIndex(waveIndex: number): Action[]{
    return this.waves[waveIndex]?.actions;
  }

  public currentWave(): Wave{
    return this.waves[this.waveIndex];
  }

  public currentActions(): Action[]{
    return this.getActionsByWaveIndex(this.waveIndex);
  }

  private changeNextWave(){
    this.waveIndex ++;
    this.currentActionIndex = 0;
    this.waveSecond = 0;
  }

  private checkWaveFinished(){
    const currentActions = this.currentActions();
    if(!currentActions) return;

    //波次出怪结束
    const waveFinished = this.currentActionIndex >= currentActions.length;
    if(waveFinished){
      const find = this.enemiesInMap.find(enemy => {
        return enemy && 
        !enemy.dontBlockWave && 
        !enemy.reborned   //模拟boss复活释放波次
      })

      //波次出怪结束，并且场上无敌人 就切换到下一波次
      if(!find){
        this.changeNextWave();
      }
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
    const currentActions = this.currentActions();
    let spawnFinished = false;
    if(currentActions){
      
      const nextActions = this.getActionsByWaveIndex(this.waveIndex + 1);
      //最后一个波次全部出怪完毕
      spawnFinished = !nextActions && this.currentActionIndex >= currentActions.length
    }else{
      spawnFinished = true;
    }

    return spawnFinished;
  }

  public startExtraAction(options: startExtraActionOptions){
    const {key, enemyKey, fragmentIndex, actionIndex} = options;
    const wave = this.getExtraWave(key);
    if(!wave) return;

    let actions;
    if(fragmentIndex !== undefined && fragmentIndex !== null){
      const fragment = wave[fragmentIndex];
      actions = fragment.actions;
    }else{
      actions = wave.map(fragment => fragment.actions).flat();
    }

    if(actions && actions.length > 0){

      if(actionIndex){
        actions = [ actions[actionIndex] ]
      }

      this.activeExtraActions.push({
        time: 0,
        startTime: this.waveSecond,
        enemyKey: enemyKey? enemyKey : null,
        actions,
        currentActionIndex: 0,
      })
    }
  }

  public getExtraWave(key: string){
    const extraAction = this.extraWaves[key];
    return extraAction? extraAction : null;
  }

  public handleAction(options: any){
    const isExtra = options.isExtra;
    const actions: Action[] = options.actions;
    const enemyKey: string = options.enemyKey;
    const waveSecond: number = options.waveSecond;
    const startTime: number = options.startTime;
    const currentObj: any = options.currentObj;

    for (let i=0; i<actions.length; i++){ 

      const action: Action = actions[i];
      const actionData = action.actionData;

      if(i >= currentObj.currentActionIndex && action.startTime <= waveSecond){
        
        switch (action.actionType) {
          case "SPAWN":
            let enemy;
            if(Global.gameManager.isSimulate){
              console.log(actionData)
              let enemyData = actionData.enemyData;

              const enemyParam: EnemyParam = {
                startTime: actionData.startTime,
                fragmentTime: actionData.fragmentTime,
                dontBlockWave: actionData.dontBlockWave,
                route: actionData.route
              }

              if(enemyKey){
                //如果额外设置了extra action的enemyKey，就用这个enemy去替换原本的
                const find = this.mapModel.getEnemyData(enemyKey);
                if(find) enemyData = find;
              }

              enemy = this.newEnemy(enemyParam, enemyData);
              
              action.enemys.push(enemy);
              action.waveManager = this;

              enemy.action = action;
              enemy.isExtra = action.isExtra;
              if(action.isExtra){
                //调整波次开始时间
                enemy.fragmentTime = startTime;
                enemy.dontBlockWave = true;
              }
              this.enemies.push(enemy);
            }else{
              enemy = action.enemys[action.applyId];
            }

            action.applyId++;

            const isHandle = Global.gameHandler.handleSpawnEnemy(enemy);
            if(!isHandle){
              enemy.start();
            }
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
                    this.updateSPFA();
                  }

                  //模拟data set的时候会手动添加
                  if(!Global.gameManager.isSimulate){
                    Global.gameManager.gameView?.trapObjects?.add(action.trap.object);
                  }

                  switch (action.trap.key) {
                    case "trap_091_brctrl":
                      //引航者试炼装置激活 清空前面区域，并移动相机
                      //老版本引航者还有MoveCamera的触发事件，为了兼容统一使用ACTIVATE_PREDEFINED
                      this.changeCameraCount(action.trap.id - 1);
                      break;
                  
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
          case "PLAY_OPERA":
            if(action.actionData.key === "move_camera"){
              this.addCameraCount();
            }
            break;
        }

        currentObj.currentActionIndex ++;

        !isExtra && eventBus.emit("action_index_change", this.currentActionIndex - 1, this.waveIndex);

      }
    }

  }

  public newEnemy(enemyParam: EnemyParam, enemyData: EnemyData): Enemy{
    let enemy;
    if(enemyData.fbxMesh){
      enemy = new FbxEnemy(enemyParam, enemyData);
    }else if(enemyData.skeletonData){
      enemy = new SpineEnemy(enemyParam, enemyData);
    }else{
      enemy = new Enemy(enemyParam, enemyData);
    }

    //这个enemyId就是wave处于整个waves二维数组中的哪个位置，方便使用
    enemy.id = this.enemyId++;

    return enemy;
  }

  public updateSPFA(){
    this.needUpdateSPFA = true;
  }

  public update(delta: number){
    if(this.isFinished) return;

    this.gameSecond = Global.gameManager.gameSecond;
    this.waveSecond += delta;

    const currentWave: Wave = this.currentWave();

    currentWave && currentWave.actions.length > 0 && this.handleAction({
      isExtra: false,
      actions: currentWave.actions,
      waveSecond: this.waveSecond,
      currentObj: this
    });

    for(let i = 0; i < this.activeExtraActions.length; i++){
      const activeExtra = this.activeExtraActions[i];
      const { enemyKey, actions } = activeExtra;
      activeExtra.time += delta;

      this.handleAction({
        isExtra: true,
        actions,
        startTime: activeExtra.startTime,
        waveSecond:  activeExtra.time,
        currentObj: activeExtra,
        enemyKey
      });

      if(activeExtra.currentActionIndex > actions.length){
        this.activeExtraActions.splice(i, 1);
        i--;
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

  private changeCameraCount(count: number){
    this.currentCameraView = count;
    Global.gameHandler.afterMoveCamera();
  }

  private addCameraCount(){
    this.currentCameraView ++;
    Global.gameHandler.afterMoveCamera();
  }

  //获取矩形区域内的所有敌人
  public getEnemysInRect(param: enemysInRectParam): Enemy[]{
    const {x1, x2, y1, y2, enemyIncludes, enemyExcludes} = param;
    const minX = Math.min(x1, x2) - 0.5;
    const maxX = Math.max(x1, x2) + 0.5;
    const minY = Math.min(y1, y2) - 0.5;
    const maxY = Math.max(y1, y2) + 0.5;

    return this.enemiesInMap.filter(enemy => {
      return (
        enemy.position.x > minX &&
        enemy.position.x < maxX &&
        enemy.position.y > minY &&
        enemy.position.y < maxY &&
        (!enemyIncludes || enemyIncludes.includes(enemy.key)) &&
        (!enemyExcludes || !enemyExcludes.includes(enemy.key))
      )
    })
  }

  public get(){
    const actionStates = [];
    const enemyStates = [];

    const extraActionStates = this.activeExtraActions.map(extra => {
      return {...extra};
    });

    this.allActions.forEach(action => {
      actionStates.push(action.get());
    });


    this.enemiesInMap.forEach(enemy => {
      enemyStates.push(enemy.get());
    })

    let state = {
      actionStates,
      enemyStates,
      enemiesInMap: [...this.enemiesInMap],
      removedEnemyIds: [...this.removedEnemyIds],
      currentActionIndex: this.currentActionIndex,
      waveIndex: this.waveIndex,
      gameSecond: this.gameSecond,
      waveSecond: this.waveSecond,
      finishedEnemyCount: this.finishedEnemyCount,
      extraActionStates,
      isFinished: this.isFinished,
      currentCameraView: this.currentCameraView
    }

    return state;
  }

  public set(state){
    const {
      enemiesInMap, 
      removedEnemyIds,
      currentActionIndex, 
      waveIndex, 
      gameSecond,
      waveSecond,  
      finishedEnemyCount,
      actionStates,
      enemyStates,
      extraActionStates,
      isFinished,
      currentCameraView
    } = state;

    this.enemiesInMap = [...enemiesInMap];
    this.removedEnemyIds = [...removedEnemyIds];
    this.currentActionIndex = currentActionIndex;
    this.waveIndex = waveIndex;
    this.gameSecond = gameSecond;
    this.waveSecond = waveSecond;
    this.finishedEnemyCount = finishedEnemyCount;
    this.isFinished = isFinished;
    this.currentCameraView = currentCameraView;
    
    for(let i = 0; i < this.allActions.length; i++){
      const aState = actionStates[i];
      const action = this.allActions[i];

      action.set(aState);
    }

    //enemyState数据量庞大，这样能节省内存
    const cacheIds = [];    //缓存有数据的enemyIds
    for(let i = 0; i < this.enemiesInMap.length; i++){
      
      const eState = enemyStates[i];
      const enemy = this.enemiesInMap[i];
      if(eState){
        enemy.set(eState);
        cacheIds.push(eState.id);
      }
    }

    for(let i = 0; i < this.enemies.length; i++){
      const enemy = this.enemies[i];
      if(!cacheIds.includes(enemy.id)){
        if(this.removedEnemyIds.includes(enemy.id)){
          //已经finish的enemy
          enemy.isStarted = true;
          enemy.isFinished = true;
        }else{
          //还未开始的enemy
          enemy.isStarted = false;
          enemy.isFinished = false;
        }
        enemy.hide();
      }
    }

    this.activeExtraActions = extraActionStates.map(extra => {
      return {...extra};
    })

    eventBus.emit("action_index_change", this.currentActionIndex - 1, waveIndex);
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