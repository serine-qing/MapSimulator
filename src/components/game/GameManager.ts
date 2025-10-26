import * as THREE from "three"

import GameConfig from "@/components/utilities/GameConfig"
import GameView from "./GameView"

import MapModel from "./MapModel"
import WaveManager from "@/components/enemy/WaveManager";
import eventBus from "@/components/utilities/EventBus";

import assetsManager from "@/components/assetManager/assetsManager"
import { gameCanvas } from "./GameCanvas";
import TokenCard from "./TokenCard";
import Tile from "./Tile";
import TileManager from "./TileManager";
import Trap from "./Trap";
import SPFA from "./SPFA";
import TrapManager from "./TrapManager";
import { ElMessage } from 'element-plus'
import { Countdown, CountdownManager } from "./CountdownManager";
import BuffManager from "./BuffManager";
import Global from "../utilities/Global";
import GameHandler from "../entityHandler/GameHandler";
import Gractrl from "../entityHandler/Gractrl";
import AnimationFrame from "../utilities/AnimationFrame";
import Enemy from "../enemy/Enemy";
import SpineEnemy from "../enemy/SpineEnemy";
import FbxEnemy from "../enemy/FbxEnemy";
import DataObject from "../enemy/DataObject";

import act45side from "../entityHandler/无忧梦呓";
import SeededRandom from "../utilities/Random";
//游戏控制器
class GameManager extends DataObject{
  public isSimulate: boolean = false;
  private clock: THREE.Clock = new THREE.Clock();

  public mapModel: MapModel;
  public isCampaign: boolean = false;
  public buffManager: BuffManager;
  public SPFA: SPFA;
  public tileManager: TileManager;
  private simulateData: any;
  private isDynamicsSimulate: boolean = false; 
  public maxSecond: number;
  private setData: any;       //等待去设置的模拟数据，需要在某帧的gameloop结束后调用
  public gameView: GameView;
  public waveManager: WaveManager;
  public trapManager: TrapManager;
  public countdownManager: CountdownManager;
  public seededRandom: SeededRandom;

  public gameSpeed: number = GameConfig.GAME_SPEED;
  public pause: boolean = false;

  private updateCountdown: number = 2;  //多少次animate才执行一次update
  private updateInterval = 1 / 30;    //游戏内一帧时间（固定三十分之一秒）
  private delta = 0;                  //view渲染用

  public gameSecond: number = 0;    //当前游戏时间
  public simStep: number;            //模拟数据步长（秒）
  public isFinished: boolean = false;
  public finishedSecond;     //结束时间

  public tokenCards: TokenCard[];
  private activeTokenCard: TokenCard;

  private mouseMoveProcessing: boolean = false;

  public gractrl: Gractrl;  //重力控制

  constructor(){
    super();
    Global.gameManager = this;

    //不需要考虑先后顺序的可以放这里
    this.countdownManager = new CountdownManager();
    this.countdown = this.countdownManager.getCountdownInst();
    this.buffManager = new BuffManager();
    this.gameView = new GameView();
    this.seededRandom = new SeededRandom(Math.random() * 1000000);
  }

  public init(mapModel: MapModel){
    
    AnimationFrame.setPause(false);

    //初始化敌人控制类
    this.mapModel = mapModel;
    this.isCampaign = this.mapModel.sourceData.levelId.includes("campaign");
    this.simStep = this.isCampaign? 5 : GameConfig.SIMULATE_STEP;
    
    GameHandler.beforeGameInit();
    this.SPFA = mapModel.SPFA;
    this.tileManager = mapModel.tileManager;

    this.tokenCards = mapModel.tokenCards.map(data =>{
      const tokenCard = new TokenCard(data);
      return tokenCard;
    });

    this.trapManager = new TrapManager(mapModel.trapDatas);
    this.waveManager = new WaveManager();
    
    if(this.trapManager.traps.find(trap => trap.key === "trap_121_gractrl")){
      this.gractrl = new Gractrl();
    } 

    GameHandler.afterGameInit();

    this.startSimulate();
    
    this.start();
  }

  public start(){
    
    assetsManager.allOnload.then( () => { 

      this.gameView.init();

      this.handleMouseMove();
      this.handleClick();

      this.restart();
      
      eventBus.emit("gameStart")

      AnimationFrame.addAnimationFrame({
        name: "Gameloop",
        order: 0,
        animate: () => this.animate()
      });

    })

  }

  public changePause(pause: boolean){
    this.pause = pause;
  }

  //循环执行
  private animate(){
    
    this.delta = 0;
    this.mouseMoveProcessing = false;

    if(this.gameSpeed <= 1){
      //一倍速2帧执行一次
      if(this.updateCountdown === 1){
        this.resetUpdateCountdown();

        this.update();
        
      }else{
        this.updateCountdown --;
      }
    }else{
      this.resetUpdateCountdown();

      for(let i = 0; i < this.gameSpeed / 2; i++){
        this.update();
      }
      
    }

    this.gameView?.render(this.delta);
    


  }

  public update(){
    this.checkFinished();
    if(!this.pause && !this.isFinished){
      const delta = this.updateInterval;
      this.delta += delta;
      //动态模拟
      if(!this.isSimulate && this.isDynamicsSimulate){
        
        const find = this.simulateData.byFrame.find(sim => {
          return sim.gameSecond <= this.gameSecond && 
            sim.gameSecond > this.gameSecond - delta;
        })
        if(find){
          this.setData = find;
        }
      }

      if(this.setData){
        this.set(this.setData);
      }
      
      this.gameSecond += delta;
      
      this.countdownManager.update(delta);
      this.waveManager.update(delta);
      this.trapManager.update(delta);

      GameHandler.afterGameUpdate();
      
      if(!this.isSimulate ) eventBus.emit("second_change", this.gameSecond);

    }

    if(!this.isSimulate) eventBus.emit("update:isFinished", this.isFinished);

  }

  private checkFinished(){
    if(this.finishedSecond && this.gameSecond >= this.finishedSecond){
      this.isFinished = true;
    }
  }

  public handleFinish(){
    this.finishedSecond = this.gameSecond + 1;
  }

  private intersectObjects(x: number, y: number): any{
    // 1. 计算标准化设备坐标 (NDC)
    // 在将鼠标的屏幕坐标转换为标准化设备坐标（NDC）时，我们需要将坐标从屏幕坐标系（以像素为单位）
    // 转换到WebGL的NDC坐标系（范围为[-1, 1]）。这个转换过程是通过线性变换完成的。
    // 我们需要转换为NDC坐标系（WebGL，原点在中心，范围[-1,1]）：
    // x:从左到右为-1到1
    // y: 从下到上为-1到1（注意：屏幕坐标的y轴方向与NDC的y轴方向相反）
    gameCanvas.mouse.x = (x / gameCanvas.wrapper.offsetWidth) * 2 - 1;
    gameCanvas.mouse.y = -(y / gameCanvas.wrapper.offsetHeight) * 2 + 1;

    // 2. 更新射线
    gameCanvas.raycaster.setFromCamera(gameCanvas.mouse, gameCanvas.camera);
    const { trapObjects, tileObjects } = this.gameView;

    // const enemyShadows = this.waveManager.enemiesInMap.map(enemy => enemy.shadow);
    // const enemyMeshs = this.waveManager.enemiesInMap.map(enemy => enemy.mesh);
    // //检测与enemy的交点
    // if(enemyMeshs.length > 0){
    //   const tokenIntersects = gameCanvas.raycaster.intersectObjects([...enemyShadows, ...enemyMeshs], true);
    //   if (tokenIntersects.length > 0) {
    //     const firstIntersect = tokenIntersects[0];  
    //     console.log(firstIntersect.object)
    //     const enemy: Enemy = firstIntersect.object?.parent?.userData?.enemy ||
    //       firstIntersect.object?.parent?.parent?.userData?.enemy
        
    //     if(enemy) return enemy;
    //   }
    // }

    //检测与trap的交点
    if(trapObjects.children.length > 0){
      //这里考虑使用gameView.trapObjects 但是性能低一点
      const tokenIntersects = gameCanvas.raycaster.intersectObjects(trapObjects.children, true);
      if (tokenIntersects.length > 0) {
        const firstIntersect = tokenIntersects[0];
        const trap: Trap = firstIntersect.object?.parent?.userData?.trap;
        
        if(trap) return trap;
      }
    }

    //可放置箱子的图才进行检测
    const hasCrate = this.tokenCards.find(card => card.characterKey === "trap_001_crate");
    if(hasCrate){
      // 检测与tile的交点
      const tileIntersects = gameCanvas.raycaster.intersectObjects(tileObjects.children);
      if (tileIntersects.length > 0) {
        const firstIntersect = tileIntersects[0];
        const tile: Tile = firstIntersect.object?.parent?.userData?.tile;
        if(tile) return tile;
      }
    }


    return null;
  } 

  private handleMouseMove(){
    // 监听鼠标移动
    gameCanvas.wrapper.onmousemove = (event) => {
      //控制事件 1帧只能触发一次
      if(this.mouseMoveProcessing) return;

      this.mouseMoveProcessing = true;
      this.tileManager.hiddenPreviewTextures();
      
      const find = this.intersectObjects(event.offsetX, event.offsetY);
      
      if(find){

        switch (find.constructor) {
          case SpineEnemy:
          case FbxEnemy:
            gameCanvas.wrapper.style.cursor = "pointer";
            break;
          case Trap:
            this.handleTrapFocus(find);
            break;
          case Tile:
            this.handleTileFocus(find);
            break;
        }
        
      }
    };
  }

  private handleClick(){
    gameCanvas.wrapper.onclick = (event) => {

      this.trapManager.resetSelected();

      const find = this.intersectObjects(event.offsetX, event.offsetY);

      if(find){
        switch (find.constructor) {
          case SpineEnemy:
          case FbxEnemy:
            this.handleEnemyClick(find);
            break;
          case Trap:
            this.handleTrapSelect(find);
            break;
          case Tile:
            this.addTrapToTile(find);
            break;
        }
      }

    }
  }

  private handleEnemyClick(enemy: Enemy){

  }

  private handleTileFocus(tile: Tile){
    if( this.activeTokenCard ) {
      if(tile.previewTexture && !tile.trap){
        gameCanvas.wrapper.style.cursor = "pointer";
        tile.previewTexture.visible = true;
      }else{
        gameCanvas.wrapper.style.cursor = "default";
      }
    }else{
      gameCanvas.wrapper.style.cursor = "default"
    }
  }


  private handleTrapFocus(trap: Trap){
    if(trap && trap.isTokenCard){
      gameCanvas.wrapper.style.cursor = "pointer";
    }else{
      gameCanvas.wrapper.style.cursor = "default";
    }
  }

  private handleTrapSelect(trap: Trap){
    if(trap.isTokenCard){
      trap.isSelected = true;
    }
  }

  public handleRemoveTrap(trap: Trap){
    this.gameView.trapObjects.remove(trap.object);

    this.trapManager.removeTrap(trap);
    //障碍物需要重新计算寻路
    if(trap.key === "trap_001_crate"){
      this.SPFA.regenerate(false);
      this.reStartSimulate();
    }
  }

  private addTrapToTile(tile: Tile){

    if(this.activeTokenCard && tile.previewTexture){
      const trap = this.trapManager.createTokenTrap(this.activeTokenCard, tile);

      //障碍物需要重新计算寻路
      if(trap.key === "trap_001_crate"){
        const success = this.SPFA.regenerate(true);

        //判断是否封死道路
        if(success){

          this.activeTokenCard.handleDeploy();
          this.activeTokenCard = null;
          
          this.gameView.trapObjects.add(trap.object);
          this.reStartSimulate();
        }else{
          this.trapManager.removeTrap(trap);
          ElMessage({
            message: '禁止封死道路！',
            type: 'warning',
          })
        }
      }
    }

  }

  public handleSelectTokenCard(characterKey: string){

    const card = this.tokenCards.find(tc => tc.characterKey === characterKey);
    card.handleSelected();

    this.tokenCards.forEach((tokenCard: TokenCard) => {
      if(tokenCard.characterKey !== card.characterKey){
        tokenCard.selected = false;
      }
    });

    if(card.selected){
      this.tileManager.updatePreviewImage(card.texture)
      this.activeTokenCard = card;
    }else{
      this.tileManager.hiddenPreviewTextures();
      this.activeTokenCard = null;
    }
  }

  public setSimulateData(simulateData: any){
    this.simulateData = simulateData;

    this.waveManager.allActions.forEach((action, index) => {
      action.actionTime = parseFloat(simulateData.byAction[index]?.gameSecond?.toFixed(1));
    })

    eventBus.on("jump_to_enemy_index", (index) => {
      const setData = this.simulateData.byAction[index];
      this.addSetData(setData);
    });

    eventBus.on("jump_to_time_index", (index) => {
      const setData = this.simulateData.byTime[index];
      this.addSetData(setData);
    });
  }

  public changeGameSpeed(gameSpeed: number){
    this.gameSpeed = gameSpeed;
    this.resetUpdateCountdown();
  }

  private resetUpdateCountdown(){
    this.updateCountdown = 1 / this.gameSpeed * 2;
  }

  public restart(){
    const data = this.simulateData?.byTime[0];
    this.set(data);
  }

  public get(){
    const superStates = super.get();

    let state: {[key: string]: any} = {
      gameSecond: this.gameSecond,
      isFinished: this.isFinished,
      finishedSecond: this.finishedSecond,
      SPFAState: this.SPFA.get(),
      trapState: this.trapManager.get(),
      tileState: this.tileManager.get(),
      eManagerState: this.waveManager.get(),
      buffState: this.buffManager.get(),
      countdownState: this.countdownManager.get(),
      tokenCardState: this.tokenCards.map(tc => tc.get()),
      SeededRandomState: this.seededRandom.get(),
      ...superStates
    }
    if(this.gractrl){
      state.gractrlState = this.gractrl.get();
    }
    return state;
  }

  public set(states){
    super.set(states);
    
    this.trapManager.resetSelected();

    const {
      gameSecond, 
      isFinished, 
      finishedSecond,
      SPFAState, 
      trapState, 
      tileState, 
      eManagerState, 
      buffState,
      countdownState, 
      tokenCardState,
      gractrlState,
      SeededRandomState
    } = states;
    
    this.gameSecond = gameSecond;
    this.trapManager.set(trapState);
    this.tileManager.set(tileState);
    this.SPFA.set(SPFAState);
    this.tokenCards.forEach((tc, index) => {
      tc.set(tokenCardState[index]);
    })

    if(this.gameView.mapContainer){
      const trapObjects = this.gameView.trapObjects;
      while (trapObjects.children.length > 0) {
        let child = trapObjects.children[0];
        trapObjects.remove(child);
      }
      
      this.trapManager.traps.forEach(trap => {
        trapObjects.add(trap.object);
      })
    }
    
    this.waveManager.set(eManagerState);
    this.buffManager.set(buffState),
    this.countdownManager.set(countdownState);
    this.seededRandom.set(SeededRandomState);

    this.isFinished = isFinished;
    this.finishedSecond = finishedSecond;

    this.gractrl?.set(gractrlState);
    

    this.setData = null;
  }

  public addSetData(data){
    //如果游戏已经结束或者正在暂停，那么就直接设置data，
    //如果还未结束，需要在某次循环开头读取data
    this.setData = data;

    if(this.isFinished || this.pause){
      this.set(this.setData);
      this.gameView.renderEnemy(0);   //让敌人spine渲染set的动画时间 
    }

  }

  private simulation(startTime?: number){
    //模拟环境禁用console.log
    const cacheFunc = console.log;
    
    console.log = ()=>{
      return;
    }

    const simData = {
      byAction: [],
      byTime: [],
      byFrame: []
    };
    

    let needUpdateActionNum = 0;
    const fuc = () => {
      needUpdateActionNum ++;
    };
    
    eventBus.on("action_index_change", fuc);
    
    let time = startTime? startTime : 0;
    const cachePause = this.pause;
    this.pause = false;

    //剿灭太长 特殊处理
    const maxTime = this.isCampaign ? 3600 : 1800;


    while( !this.isFinished && this.gameSecond < maxTime ){
      if(this.gameSecond >= time){
        simData.byTime.push(this.get());
        time += this.simStep;
      }
      if(needUpdateActionNum > 0){
        const actionSimData = this.get();
        for(let i = 0; i< needUpdateActionNum; i++){
          simData.byAction.push(actionSimData);
        }
        needUpdateActionNum = 0;
      }
      this.update();
    }

    this.pause = cachePause;
    this.maxSecond = (simData.byTime.length - 1) + (startTime? startTime : 0);

    eventBus.emit("update:maxSecond", this.maxSecond);
    eventBus.remove("action_index_change", fuc);

    console.log = cacheFunc;

    return simData;
  }

  //获取模拟数据
  private startSimulate(){
    
    this.isSimulate = true;
    const simData = this.simulation();
    this.setSimulateData(simData);

    //restart调用了2次，第一次恢复数据 第二次在各种initMesh后恢复图像
    this.restart();

    this.isSimulate = false;
  }

  //重新计算当前时间点之后的模拟数据
  public reStartSimulate(){
    const currentState = this.get();
    const startTime = Math.ceil(this.gameSecond);
    const simData = this.simulation(startTime);

    const prevStatesByTime =  this.simulateData.byTime.slice(0, startTime);

    this.simulateData.byTime = [...prevStatesByTime, ...simData.byTime];

    const replaceLength = simData.byAction.length;
    this.simulateData.byAction.splice(-replaceLength, replaceLength, ...simData.byAction);

    const findIndex = this.simulateData.byFrame.findIndex(simData => {
      return simData.gameSecond >= currentState.gameSecond;
    });

    //游戏时间靠前的操作会重置所有靠后的操作
    if(findIndex > -1){
      this.simulateData.byFrame = this.simulateData.byFrame.slice(0, findIndex);
    }
    
    this.simulateData.byFrame.push(currentState);
    
    this.set(currentState);

    this.isDynamicsSimulate = true;

    this.waveManager.allActions.forEach((action, index) => {
      action.actionTime = parseFloat(this.simulateData.byAction[index]?.gameSecond?.toFixed(1));
    })
  }

  public destroy(){
    AnimationFrame.removeAnimationFrame("Gameloop");
    AnimationFrame.setPause(true);

    this.clock.stop();
    this.isFinished = true;
    eventBus.remove("jump_to_enemy_index");
    eventBus.remove("jump_to_time_index");
    gameCanvas.wrapper.onmousemove = null;
    gameCanvas.wrapper.onclick = null;

    this.gameView?.destroy();
    this.waveManager?.destroy();

    this.gameView = null;
    this.waveManager = null;
    this.simulateData = null;
  }
}

export default GameManager;