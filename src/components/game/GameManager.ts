import * as THREE from "three"

import GameConfig from "@/components/utilities/GameConfig"
import GameView from "./GameView"

import MapModel from "./MapModel"
import WaveManager from "@/components/enemy/WaveManager";
import eventBus from "@/components/utilities/EventBus";

import assetsManager from "@/components/assetManager/assetsManager"

//游戏控制器
class GameManager{
  public isSimulate: boolean = false;
  private clock: THREE.Clock = new THREE.Clock();

  private mapModel: MapModel;
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

  constructor(mapModel: MapModel){
    //初始化敌人控制类
    this.mapModel = mapModel;
    this.waveManager = new WaveManager(
      mapModel,
      this
    );

    this.waveManager.traps.forEach(trap => {
      trap.gameManager = this;
    })


  }

  public start(){
    
    assetsManager.allOnload.then( () => {

      this.restart();
      
      eventBus.emit("gameStart")

      this.gameView = new GameView(
        this,
        this.mapModel.mapTiles,
        this.waveManager.traps,
        this.waveManager
      );


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

  public setSimulateData(simulateData: any){
    this.simulateData = simulateData;

    this.waveManager.actions.flat().forEach((action, index) => {
      action.actionTime = parseFloat(simulateData.byAction[index].gameSecond.toFixed(1));
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
    const data = this.simulateData.byTime[0];
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