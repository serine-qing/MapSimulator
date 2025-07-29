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
import MapTiles from "./MapTiles";
import Trap from "./Trap";
import SPFA from "./SPFA";

//游戏控制器
class GameManager{
  public isSimulate: boolean = false;
  private clock: THREE.Clock = new THREE.Clock();

  public mapModel: MapModel;
  private SPFA: SPFA;
  public tokens: Trap[] = [];      //手动部署的装置
  public mapTiles: MapTiles;
  private simulateData: any;
  private setData: any;       //等待去设置的模拟数据，需要在某帧的gameloop结束后调用
  private gameView: GameView;
  public waveManager: WaveManager;

  public gameSpeed: number = GameConfig.GAME_SPEED;
  public pause: boolean = false;
  
  private delta: number;
  private timeStamp: number = 1 / GameConfig.FPS;
  private singleFrameTime: number = 1 / GameConfig.FPS; //两次渲染之间间隔的游戏内时间

  public gameSecond: number = 0;    //当前游戏时间

  public isFinished: boolean = false;

  private tokenCards: TokenCard[];
  private activeTokenCard: TokenCard;

  constructor(mapModel: MapModel){
    //初始化敌人控制类
    this.mapModel = mapModel;
    this.SPFA = mapModel.SPFA;
    this.mapTiles = mapModel.mapTiles;
    this.tokenCards = mapModel.tokenCards;

    this.waveManager = new WaveManager(
      mapModel,
      this
    );

  }

  public start(){
    
    assetsManager.allOnload.then( () => {
      
      this.restart();
      
      eventBus.emit("gameStart")

      this.gameView = new GameView(this);

      this.handleMouseMove();
      this.handleClick();

      this.animate();

    })

  }

  public getPixelSize(x:number):number {
    return x * GameConfig.TILE_SIZE;
  }

  public getCoordinate(x:number | Vec2 | THREE.Vector2, y?:number): Vec2{
    if(typeof x === "number" && y !== undefined){
      return {
        x: x * GameConfig.TILE_SIZE,
        y: y * GameConfig.TILE_SIZE,
      }
    }else if(typeof x === "object" && y === undefined){
      return {
        x: x.x * GameConfig.TILE_SIZE,
        y: x.y * GameConfig.TILE_SIZE,
      }
    }

  }

  public changeGameSpeed(gameSpeed: number){
    this.gameSpeed = gameSpeed;
  }

  public changePause(pause: boolean){
    this.pause = pause;
  }

  //循环执行
  private animate(){
    this.delta = this.clock.getDelta();
    this.timeStamp += this.delta;

    if(this.timeStamp >= this.singleFrameTime){

      this.timeStamp = (this.timeStamp % this.singleFrameTime);
      //游戏循环
      this.gameLoop();
    }

    requestAnimationFrame(()=>{
      this.animate();
    });


  }

  public gameLoop(){
    let delta = 0;

    if(!this.pause && !this.isFinished){
      
      if(this.setData){
        this.set(this.setData);
      }
      delta = this.singleFrameTime * this.gameSpeed;

      this.update(delta);

      if(!this.isSimulate ) eventBus.emit("second_change", this.gameSecond);
      
      this.gameSecond += delta;
    }

    if(!this.isSimulate) eventBus.emit("update:isFinished", this.isFinished);

    this.render(delta);

  }

  private update(delta: number){
    this.waveManager.update(delta);
  }

  private render(delta: number){
    if(!this.isSimulate ){
      this.gameView.render(delta);
    }
    
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

    //检测与trap的交点
    if(this.tokens.length > 0){
      const tokenObjs = this.tokens.map(token => token.object);
      //这里考虑使用gameView.trapObjects 但是性能低一点
      const tokenIntersects = gameCanvas.raycaster.intersectObjects(tokenObjs, true);
      if (tokenIntersects.length > 0) {
        const firstIntersect = tokenIntersects[0];
        const trap: Trap = firstIntersect.object?.parent?.userData?.trap;

        if(trap) return trap;
      }
    }

    // 检测与tile的交点
    const tileIntersects = gameCanvas.raycaster.intersectObjects(this.gameView.tileObjects.children, true);
    if (tileIntersects.length > 0) {
      const firstIntersect = tileIntersects[0];
      const tile: Tile = firstIntersect.object?.parent?.userData?.tile;
      
      if(tile) return tile;
    }

    return null;
  } 

  private handleMouseMove(){
    // 监听鼠标移动
    gameCanvas.wrapper.addEventListener('mousemove', (event) => {

      this.mapTiles.hiddenPreviewTextures();
      
      const find = this.intersectObjects(event.offsetX, event.offsetY);

      if(find){
        switch (find.constructor) {
          case Trap:
            this.handleTrapFocus(find);
            break;
          case Tile:
            this.handleTileFocus(find);
            break;
        }
      }
    });
  }

  private handleClick(){
    gameCanvas.wrapper.addEventListener("click", (event) => {

      this.tokens.forEach(trap => trap.isSelected = false)

      const find = this.intersectObjects(event.offsetX, event.offsetY);

      if(find){
        switch (find.constructor) {
          case Trap:
            this.handleTrapSelect(find);
            break;
          case Tile:
            this.addTrapToTile(find);
            break;
        }
      }

    })
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
    if(trap){
      gameCanvas.wrapper.style.cursor = "pointer";
    }else{
      gameCanvas.wrapper.style.cursor = "default";
    }
  }

  private handleTrapSelect(trap: Trap){
    trap.isSelected = true;
  }

  public handleRemoveTrap(trap: Trap){
    this.gameView.mapContainer.remove(trap.object);
    trap.tile.removeTrap();

    this.tokens.remove(trap);
    //障碍物需要重新计算寻路
    if(trap.key === "trap_001_crate"){
      this.SPFA.reset();
    }
  }

  private addTrapToTile(tile: Tile){

    if(this.activeTokenCard && tile.previewTexture){
      const trap = new Trap(this.activeTokenCard.trapData);
      trap.iconUrl = this.activeTokenCard.url;
      tile.addTrap(trap);
      trap.initMesh();
      
      this.gameView.mapContainer.add(trap.object)
      
      this.tokens.push(trap);
      //障碍物需要重新计算寻路
      if(trap.key === "trap_001_crate"){
        this.SPFA.reset();
      }
    }

  }

  public handleSelectTokenCard(card: TokenCard){
    this.tokenCards.forEach((tokenCard: TokenCard) => {
      if(tokenCard.characterKey !== card.characterKey){
        tokenCard.selected = false;
      }
    });
    card.selected = !card.selected;

    if(card.selected){
      this.mapTiles.updatePreviewImage(card.texture)
      this.activeTokenCard = card;
    }else{
      this.mapTiles.hiddenPreviewTextures();
      this.activeTokenCard = null;
    }
  }

  public setSimulateData(simulateData: any){
    this.simulateData = simulateData;

    this.waveManager.actions.flat().forEach((action, index) => {
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

  public restart(){
    const data = this.simulateData?.byTime[0];
    this.set(data);
  }

  public get(){
    let state = {
      gameSecond: this.gameSecond,
      isFinished: this.isFinished,
      eManagerState: this.waveManager.get()
    }
    return state;
  }

  public set(state){
    const {gameSecond, isFinished, eManagerState} = state;
    
    this.gameSecond = gameSecond;
    this.waveManager.set(eManagerState)
    this.isFinished = isFinished;

    this.setData = null;
  }

  public addSetData(data){
    //如果游戏已经结束或者正在暂停，那么就直接设置data，
    //如果还未结束，需要在某次循环开头读取data
    this.setData = data;
    const isFinished = this.isFinished;

    if(this.isFinished || this.pause){
      this.set(this.setData);
    }

  }

  public destroy(){
    this.clock.stop();
    this.isFinished = true;
    eventBus.remove("jump_to_enemy_index");
    eventBus.remove("jump_to_time_index");

    this.gameView?.destroy();
    this.waveManager?.destroy();

    this.gameView = null;
    this.waveManager = null;
    this.simulateData = null;
  }
}

export default GameManager;