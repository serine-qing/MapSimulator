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
  private el: HTMLDivElement;
  private delta: number = 0; //两次渲染之间的间隔时间
  constructor(el: any, map: any){
    this.el = el;
    this.init(map);
  }

  private async init(map: any){
    this.mapModel = new MapModel(map);

    await this.mapModel.init();

    this.gameView = new GameView(this.el, this.mapModel.mapTiles);

    //初始化敌人控制类
    this.enemyManager = new EnemyManager(
      this.mapModel.enemyWaves
    );
    
    this.gameView.setupEnemyManager(
      this.enemyManager
    );

    await this.gameView.setupEnemyDatas(this.mapModel.enemyDatas);

    this.animate();
  }

  //当前游戏时间(秒)
  private currentSecond(): number {
    return Math.floor( this.frameCount / GameConfig.FPS );
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
    requestAnimationFrame(()=>{
      this.animate();
    });
    //渲染
    this.delta = this.clock.getDelta();
    this.timeStamp += this.delta;
    
    if(this.timeStamp > this.singleFrameTime){
      this.timeStamp = (this.timeStamp % this.singleFrameTime);
      this.frameCount++;
      this.gameLoop();
    }
  }

  private render(){
    // this.currentSecond += 1 / window.FPS; 
    this.gameView.render(this.delta);
  }
}

export default GameManager;