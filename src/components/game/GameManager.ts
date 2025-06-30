import * as THREE from "three"

import GameConfig from "@/components/utilities/GameConfig"
import GameView from "./GameView"

import MapModel from "./MapModel"
import EnemyManager from "@/components/enemy/EnemyManager";

//游戏控制器
class GameManager{
  private gameView: GameView;
  private mapModel: MapModel;
  private enemyManager: EnemyManager;
  
  private frameCount: number = 0;    //当前帧

  //每秒帧率设置
  private clock: THREE.Clock = new THREE.Clock(); //计时器
  private singleFrameTime: number = 1 / GameConfig.FPS;
  private timeStamp: number = 0;
  private deltaTime: number = 0; //两次渲染之间间隔的游戏内时间

  public isFinished: boolean = false;

  constructor(map: any){
    this.init(map);
  }

  private async init(map: any){
    this.mapModel = new MapModel(map);

    await this.mapModel.init();

    this.gameView = new GameView(this.mapModel.mapTiles);

    //初始化敌人控制类
    this.enemyManager = new EnemyManager(
      this.mapModel.enemyWaves,
      this
    );
    
    this.gameView.setupEnemyManager(
      this.enemyManager
    );

    await this.gameView.setupEnemyDatas(this.mapModel.enemyDatas);

    this.animate();
  }

  public getCoordinate(x:number, y:number): Vec2{
    return {
      x: x * GameConfig.TILE_SIZE,
      y: y * GameConfig.TILE_SIZE,
    }
  }

  //当前游戏时间(秒)
  private currentSecond(): number {
    return this.frameCount / GameConfig.FPS * GameConfig.GAME_SPEED;
  }


  private gameLoop(){
    // this.handleInput();
    this.update();
    this.render();
  }

  private update(){
    this.enemyManager.update(this.currentSecond());
  }

  //循环执行
  private animate(){
    if(this.isFinished) return; //结束游戏

    requestAnimationFrame(()=>{
      this.animate();
    });
    //渲染
    const _delta = this.clock.getDelta();
    this.timeStamp += _delta;
    
    if(this.timeStamp > this.singleFrameTime){
      this.timeStamp = (this.timeStamp % this.singleFrameTime);

      const t1 = this.currentSecond();
      this.frameCount++;
      const t2 = this.currentSecond();
      this.deltaTime = t2 - t1;
      
      this.gameLoop();
    }
  }

  private render(){
    this.gameView.render(this.deltaTime);
  }

  public destroy(){
    this.isFinished = true;
    this.gameView.destroy();
    this.enemyManager.destroy();

    this.mapModel = null;
    this.gameView = null;
    this.enemyManager = null;
  }
}

export default GameManager;