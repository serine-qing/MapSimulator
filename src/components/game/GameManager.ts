import * as THREE from "three"

import GameConfig from "@/components/utilities/GameConfig"
import GameView from "./GameView"

import MapModel from "./MapModel"
import EnemyManager from "@/components/enemy/EnemyManager";
import eventBus from "@/components/utilities/EventBus";
import Trap from "./Trap";

import assetsManager from "@/components/assetManager/assetsManager"

//游戏控制器
class GameManager{
  public isSimulate: boolean = false;
  private clock: THREE.Clock = new THREE.Clock();

  private simulateData: any;
  private setData: any;       //等待去设置的模拟数据，需要在某帧的gameloop结束后调用
  private gameView: GameView;
  private enemyManager: EnemyManager;

  public gameSpeed: number = GameConfig.GAME_SPEED;
  public pause: boolean = false;
  
  private delta: number;
  private timeStamp: number = 1 / GameConfig.FPS;
  private singleFrameTime: number = 1 / GameConfig.FPS; //两次渲染之间间隔的游戏内时间

  public currentSecond: number = 0;    //当前游戏时间

  public isFinished: boolean = false;
  
  constructor(mapModel: MapModel, isSimulate?: boolean){
    this.isSimulate = isSimulate? isSimulate : false;
    //初始化敌人控制类
    this.enemyManager = new EnemyManager(
      mapModel,
      this
    );

    mapModel.traps.forEach(trap => {
      trap.gameManager = this;
    })

    if(!this.isSimulate){

      assetsManager.allOnload.then( () => {

        eventBus.emit("gamestart")

        this.gameView = new GameView(
          this,
          mapModel.mapTiles,
          mapModel.traps,
          this.enemyManager
        );

        this.animate();

      })

    }
  }

  public getPixelSize(x:number):number {
    return x * GameConfig.TILE_SIZE;
  }

  public getCoordinate(x:number | Vec2, y?:number): Vec2{
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
    if(this.isFinished) return; //结束游戏

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
    if(this.pause) return; //暂停

    if(this.setData){
      this.set(this.setData);
    }

    this.update();

    if( !this.isSimulate ){
      
      eventBus.emit("second_change", this.currentSecond);
      this.render();
    }

    this.currentSecond += this.singleFrameTime * this.gameSpeed;
  }

  private update(){
    this.enemyManager.update(this.currentSecond);
  }

  private render(){
    this.gameView.render(this.singleFrameTime * this.gameSpeed);
  }

  public setSimulateData(simulateData: any){
    this.simulateData = simulateData;

    this.enemyManager.flatEnemies.forEach((enemy, index) => {
      enemy.spawnTime = parseFloat(simulateData.byEnemy[index].currentSecond.toFixed(1));
    })

    eventBus.on("jump_to_enemy_index", (index) => {
      const setData = this.simulateData.byEnemy[index];
      this.addSetData(setData);
    });

    eventBus.on("jump_to_time_index", (index) => {
      const setData = this.simulateData.byTime[index];
      this.addSetData(setData);
    });
  }

  public get(){
    let state = {
      currentSecond: this.currentSecond,
      isFinished: this.isFinished,
      eManagerState: this.enemyManager.get()
    }
    return state;
  }

  public set(state){
    const {currentSecond, isFinished, eManagerState} = state;
    
    this.currentSecond = currentSecond;
    this.enemyManager.set(eManagerState)
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
    //已经结束的话，还需要额外重新启动游戏
    if(isFinished){
      this.animate();
    }
    //如果暂停，那么设置完数据之后view需要渲染一次
    if(this.pause){
      this.render();
    }

  }

  public destroy(){
    this.isFinished = true;
    eventBus.remove("jump_to_enemy_index");
    eventBus.remove("jump_to_time_index");

    this.gameView?.destroy();
    this.enemyManager?.destroy();

    this.gameView = null;
    this.enemyManager = null;
    this.simulateData = null;
  }
}

export default GameManager;