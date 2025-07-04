import * as THREE from "three"

import GameConfig from "@/components/utilities/GameConfig"
import GameView from "./GameView"

import MapModel from "./MapModel"
import EnemyManager from "@/components/enemy/EnemyManager";
import eventBus from "@/components/utilities/EventBus";

//游戏控制器
class GameManager{
  private isSimulate: boolean = false;
  private simulateData: any;
  private setData: any;       //等待去设置的模拟数据，需要在某帧的gameloop结束后调用
  private gameView: GameView;
  private enemyManager: EnemyManager;
  
  
  public currentSecond: number = 0;    //当前游戏时间
  private deltaTime: number = 1 / GameConfig.FPS; //两次渲染之间间隔的游戏内时间

  public isFinished: boolean = false;
  
  constructor(mapModel: MapModel, isSimulate?: boolean){
    this.isSimulate = isSimulate? isSimulate : false;

    //初始化敌人控制类
    this.enemyManager = new EnemyManager(
      mapModel.enemyWaves,
      this
    );
    
    if(!this.isSimulate){
      this.gameView = new GameView(mapModel.mapTiles);
      this.gameView.setupEnemyManager(
        this.enemyManager
      );

      this.animate();
    }
  }

  public getCoordinate(x:number, y:number): Vec2{
    return {
      x: x * GameConfig.TILE_SIZE,
      y: y * GameConfig.TILE_SIZE,
    }
  }

  //循环执行
  private animate(){
    if(this.isFinished) return; //结束游戏

    requestAnimationFrame(()=>{
      this.animate();
    });

    //游戏循环
    this.gameLoop();

  }

  public gameLoop(){
    if(this.setData){
      console.log(this.setData)
      this.set(this.setData);
      this.setData = null;
    }

    this.update();

    if( !this.isSimulate ){
      this.render();
    }

    this.currentSecond += this.deltaTime * GameConfig.GAME_SPEED / 2;
  }

  private update(){
    this.enemyManager.update(this.currentSecond);
  }

  private render(){
    this.gameView.render(this.deltaTime * GameConfig.GAME_SPEED);
  }

  public setSimulateData(simulateData: any){
    this.simulateData = simulateData;
    eventBus.on("jump_to_enemy_index", (index) => {
      this.setData = this.simulateData.byEnemy[index]
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
    this.isFinished = isFinished;
    this.enemyManager.set(eManagerState)
  }

  public destroy(){
    this.isFinished = true;
    eventBus.remove("jump_to_enemy_index");

    this.gameView?.destroy();
    this.enemyManager?.destroy();

    this.gameView = null;
    this.enemyManager = null;
    this.simulateData = null;
  }
}

export default GameManager;