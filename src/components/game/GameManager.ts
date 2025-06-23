import * as THREE from "three"

import GameConfig from "@/components/utilities/GameConfig.ts"
import GameView from "./GameView.ts"

import MapModel from "./MapModel.ts"
import EnemyManager from "@/components/enemy/EnemyManager.ts";
import map1 from "@/assets/gamedata/maps/AD-EX-8.json"


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
  
  private delta: number = 0; //两次渲染之间的间隔时间
  constructor(el){
    this.mapModel = new MapModel(map1);
    this.gameView = new GameView(el, this.mapModel.mapTiles);
    //初始化敌人控制类
    this.enemyManager = new EnemyManager(
      this.mapModel.enemyWaves,
      this.mapModel.wayFindMaps
    );

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