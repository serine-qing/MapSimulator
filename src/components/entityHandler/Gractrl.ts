import { Vector2 } from "three";
import Enemy from "../enemy/Enemy";
import { Direction } from "../utilities/Enum";
import Global from "../utilities/Global";

class Gractrl{
  direction: Direction = Direction.DOWN;
  //行星碎屑额外路径
  routes = [];
  upTriggerNum: number = 0;
  downTriggerNum: number = 0;

  constructor(){
    this.initGractrlRoutes();
    this.bindGrvtybtn();
    this.changeGractrl(Direction.DOWN);
  }

  //初始化行星碎屑路径
  private initGractrlRoutes(){
    Global.waveManager.enemies.forEach(enemy => {
      
      if(enemy.key === "enemy_1334_ristar"){
        const y1 = enemy.route.startPosition.y;
        const y2 = enemy.route.endPosition.y;
        //竖直的球的话y1 > y2
        if(y1 !== y2){
          const upRoute = { ...enemy.route };
          upRoute.checkpoints = [{
            type: "MOVE",
            position: enemy.route.startPosition,
            time: 0,
            reachOffset: {
                "x": 0,
                "y": 0
            },
            randomizeReachOffset: false
          }];

          const downRoute = { ...enemy.route };
          downRoute.checkpoints = [{
            type: "MOVE",
            position: enemy.route.endPosition,
            time: 0,
            reachOffset: {
                "x": 0,
                "y": 0
            },
            randomizeReachOffset: false
          }];

          this.routes.push({
            id: enemy.id,
            up: upRoute,
            down: downRoute
          })
        }else{
          enemy.route.checkpoints = [];
        }

      }
    })
  }

  private bindGrvtybtn(){
    const tileManager = Global.tileManager;
    tileManager.flatTiles.forEach(tile => {
      switch (tile.tileKey) {
        //重力调控地块
        case "tile_grvtybtn_up":
        case "tile_grvtybtn_down":
          tileManager.addEvent({
            key: "gractrl",
            type: "in",
            x: tile.position.x,
            y: tile.position.y,
            callback: (enemy) => {

              if(enemy.attributes.massLevel >= 3){

                if(tile.tileKey === "tile_grvtybtn_up"){
                  this.upTriggerNum += 1;
                }else{
                  this.downTriggerNum += 1;
                }

                this.handleChangeGractrl();
              }
            }
          })

          tileManager.addEvent({
            key: "gractrl",
            type: "out",
            x: tile.position.x,
            y: tile.position.y,
            callback: (enemy) => {
              if(enemy.attributes.massLevel >= 3){

                if(tile.tileKey === "tile_grvtybtn_up"){
                  this.upTriggerNum -= 1;
                }else{
                  this.downTriggerNum -= 1;
                }
                
                this.handleChangeGractrl();
              }
            }
          })
          break;
      }
    })
  }

  private handleChangeGractrl(){
    if(
      this.upTriggerNum > 0 && 
      this.downTriggerNum === 0 && 
      this.direction === Direction.DOWN
    ){

      this.changeGractrl(Direction.UP);

    }else if(
      this.upTriggerNum === 0 && 
      this.downTriggerNum > 0 && 
      this.direction === Direction.UP
    ){

      this.changeGractrl(Direction.DOWN);

    }
  }

  private changeGractrl(direction: Direction){
    this.direction = direction;
    
    Global.waveManager.enemies.forEach(enemy => {
      
      if(enemy.key === "enemy_1334_ristar"){
        const baseMoveSpeed = enemy.attributes.moveSpeed;
        const find = this.routes.find(item => item.id === enemy.id);
        if(find){
          enemy.inertialVector = new Vector2(0, 0); //清理下惯性
          enemy.setRoute(direction === Direction.UP ? find.up : find.down);
          enemy.changeCheckPoint(0);
          enemy.countdown.addCountdown({
            name: "rush",
            initCountdown: 0,
            countdown: 0.1,
            maxCount: 23,
            callback: (timer) => {
              enemy.addBuff({
                id: "rush",
                key: "rush",
                overlay: false,
                effect: [{
                  attrKey: "moveSpeed",
                  method: "add",
                  value: -(baseMoveSpeed * 1.28 * (1 - (timer.count - 1) / 22) )
                }]
              })
            }
          })
        }
      }
    })
  }

  public getGractrlMoveSpeed(enemy: Enemy){
    let speedMultipy = 1;

    if(
      enemy.key === "enemy_1543_cstlrs" || 
      enemy.key === "enemy_1334_ristar" || 
      Math.abs(enemy.unitVector.y) < 0.45
    ) return speedMultipy;
    
    const massLevel = enemy.getAttr("massLevel");
    let reverse;
    
    if(
      (enemy.unitVector.y > 0 && this.direction === Direction.UP) ||
      (enemy.unitVector.y < 0 && this.direction === Direction.DOWN)
    ){
      reverse = false;
    }else{
      reverse = true;
    }

    if(massLevel === 0){
      speedMultipy = reverse? 0.9 : 1.08;
    }else if(massLevel === 1){
      speedMultipy = reverse? 0.66 : 1.2;
    }else if(massLevel === 2){
      speedMultipy = reverse? 0.6 : 1.32;
    }else if(massLevel === 3){
      speedMultipy = reverse? 0.36 : 2.4;
    }else if(massLevel >= 4){
      speedMultipy = reverse? 0.3 : 2.64;
    }

    return speedMultipy;
  }

  get(){
    return {
      direction: this.direction,
      upTriggerNum: this.upTriggerNum,
      downTriggerNum: this.downTriggerNum,
    }
  }

  set(state){
    this.direction = state.direction;
    this.upTriggerNum = state.upTriggerNum;
    this.downTriggerNum = state.downTriggerNum;
  }
}

export default Gractrl;