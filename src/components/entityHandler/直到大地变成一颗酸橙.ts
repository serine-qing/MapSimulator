import Enemy from "../enemy/Enemy";
import RunesHelper from "../game/RunesHelper";
import Tile from "../game/Tile";
import Global from "../utilities/Global";
import { getBlackBoardItem } from "../utilities/utilities";
import type Handler from "./Handler";

class act53side implements Handler{
  private rabbitholeIns: Tile[] = [];
  private rabbitholeOuts: Tile[] = [];

  handleTileInit(tile: Tile) {
    
    if(tile.tileKey.startsWith("tile_rabbithole_in")){
      const num = tile.tileKey.match(/_(\d+)$/)?.[1];
      if(!num) return;

      this.rabbitholeIns.push(tile);
      
      //绑定进入事件：敌人踩到入口时随机传送到出口
      Global.tileManager.addEvent({
        key: `rabbithole_in_${num}`,
        type: "in",
        x: tile.position.x,
        y: tile.position.y,
        callback: (enemy: Enemy) => {
          if(enemy.motion !== "WALK" || enemy.nearFly) return;

          const exits = this.rabbitholeOuts;
          if(exits.length === 0) return;

          const totalWeight = exits.reduce((sum, t) => {
            return sum + (t.blackboard?.find(b => b.key === "prob")?.value || 0);
          }, 0);

          let exitTile: Tile;
          if(totalWeight <= 0){
            exitTile = exits[0];
          }else{
            let rand = Global.seededRandom.next() * totalWeight;
            for(const e of exits){
              rand -= (e.blackboard?.find(b => b.key === "prob")?.value || 0);
              if(rand <= 0){
                exitTile = e;
                break;
              }
            }
            exitTile = exitTile || exits[exits.length - 1];
          }

          enemy.disappear();

          enemy.countdown.addCountdown({
            name: "rabbithole_wait",
            initCountdown: 3,
            callback: () => {
              const index = getBlackBoardItem("action_index", exitTile.blackboard);
              const changeRoute = Global.mapModel.extraRoutes.find(r => r.index === index);
              enemy.route = changeRoute;
              enemy.changeCheckPoint(0);
              enemy.appearAt(exitTile.position);
            }
          });
        }
      });
    }else if(tile.tileKey.startsWith("tile_rabbithole_out")){
      this.rabbitholeOuts.push(tile);
    }
  }

  handleEnemyStart(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10222_agtski":
      case "enemy_10222_agtski_2": //矿工
        enemy.addDetection({
          key: "agtski",
          detectionRadius: 0.5,
          duration: 0.1,
          every: false,
          enemyKeys: ["enemy_10223_agtrac"],
          callback: (find: Enemy) => {
            enemy.animationStateTransition({
              idleAnimate: "Idle_B",
              moveAnimate: "Move_B",
              transAnimation: "Skill_Begin",
              isWaitTrans: true
            });
            find.finishedMap();
            enemy.removeDetection("agtski");
          }
        });
        break;
      case "enemy_10228_agball":
      case "enemy_10228_agball_2": //美食的奴隶
        const defup = enemy.getTalent("defup");
        const moveUp = defup.move_speed;
        if(moveUp){
          enemy.addBuff({
            id: "moveUp",
            key: "moveUp",
            overlay: false,
            effect: [{
              attrKey: "moveSpeed",
              method: "mul",
              value: moveUp
            }]
          })
        }
        break;
      case "enemy_10232_aglina":  //信使3安洁莉娜
        enemy.dontBlockWave = true;
        break;
    }
  }
  

  afterTilesInit() {
    if(this.rabbitholeOuts.length === 0) return;
    Global.mapModel.addExtraDescription({
      text: "出口1可部署，出口2不可部署",
      color: "#d22d2dcc"
    })
    Global.mapModel.addExtraDescription({
      text: "敌人从入口进入后，3秒后从出口地块中按权重随机选择一个地块出现",
      color: "#0000FF"
    })
  }
}

export default act53side;
