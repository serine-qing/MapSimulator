import { MeshBasicMaterial, Vector2 } from "three";
import Enemy from "../enemy/Enemy";
import Tile from "../game/Tile";
import Global from "../utilities/Global";
import type Handler from "./Handler";

class act35side implements Handler{
  private enterGem(enemy: Enemy) {
    enemy.animationStateTransition({
      moveAnimate: "Run",
      isWaitTrans: false
    });
    const speedup = enemy.getTalent("speedup").move_speed;

    enemy.addBuff({
      id: "speedup",
      key: "speedup",
      overlay: false,
      effect: [{
        attrKey: "moveSpeed",
        method: "mul",
        value: 1 + speedup
      }]
    })
  }

  private outOfGem(enemy: Enemy) {
    enemy.animationStateTransition({
      moveAnimate: "Move",
      isWaitTrans: false
    });
    enemy.removeBuff("speedup");
  }

  private addGemEvent(position: Vector2) {
    //进入结晶
    Global.tileManager.addEvent({
      key: "gems",
      type: "in",
      x: position.x,
      y: position.y,
      enemy: ["enemy_10010_sgnja", "enemy_10010_sgnja_2"],
      isMerge: true,
      callback: this.enterGem.bind(this)
    })

    //出结晶
    Global.tileManager.addEvent({
      key: "gems",
      type: "out",
      x: position.x,
      y: position.y,
      enemy: ["enemy_10010_sgnja", "enemy_10010_sgnja_2"],
      callback: this.outOfGem.bind(this)
    })

  }

  private canSpawnGem(tile: Tile): boolean {
    const gemTexture = tile.getDynamicTexture("gem");
    const isSpawned = Global.gameManager.isSimulate? !!gemTexture : gemTexture?.texture?.visible;
    if(
      !isSpawned &&
      tile.tileKey !== "tile_start" &&
      tile.tileKey !== "tile_end" &&
      tile.tileKey !== "tile_telin" &&
      tile.tileKey !== "tile_telout" &&
      tile.tileKey !== "tile_hole" &&
      tile.heightType === "LOWLAND"
    ){
      return true;
    }

    return false;
  }

  private handleSpawnGem(tile: Tile) {
    //获取已经模拟环境添加过的texture mesh
    this.addGemEvent(tile.position);
    this.addGemTexture(tile, 2);
  }

  private addGemTexture(tile: Tile, type: number) {
    const name = type === 1? "gem" : "gemdark";
    tile.addDynamicTexture(name, "gem");
  }

  initTileEvents(tile: Tile) {
    tile.blackboard?.forEach(bb => {
      switch (bb.key) {
        case "gems_type":
          this.addGemEvent(tile.position);
          this.addGemTexture(tile, bb.value);
          break;
      }
    });
  }

  handleTalent(enemy: Enemy, talent: any) {
    switch (enemy.key) {
      case "enemy_10013_sgrob":         //风情区小型车辇
      case "enemy_10013_sgrob_2":
        enemy.addChangeTileEvent({
          name: "spawnGem",
          callback: (outTile: Tile, inTile: Tile) => {
            if(this.canSpawnGem(inTile)){
              this.handleSpawnGem(inTile);
            }
          }
        })
        break;
      case "enemy_10015_sgbird":        //"滑翔的玩具"
      case "enemy_10015_sgbird_2":
        enemy.addChangeTileEvent({
          name: "spawnGem",
          callback: (outTile: Tile, inTile: Tile) => {
            if(this.canSpawnGem(inTile)){
              enemy.hp -= enemy.attributes.maxHp * 0.2;
              this.handleSpawnGem(inTile);
            }
          }
        })
        break;
    }
  }

  handleSkill(enemy: Enemy, skill: any) {
    switch (enemy.key) {
      case "enemy_10012_sgbtle":       //237-1号展柜文物
      case "enemy_10012_sgbtle_2":
        enemy.addChangeTileEvent({
          name: "spawnGem",
          callback: (outTile: Tile, inTile: Tile) => {
            if(this.canSpawnGem(inTile)){
              enemy.removeChangeTileEvent("spawnGem");
              enemy.animationStateTransition({
                idleAnimate: "B_Idle",
                moveAnimate: "B_Move",
                transAnimation: "Skill",
                isWaitTrans: true,
                callback: () => {
                  const speedup = enemy.getTalent("speedup")?.move_speed;
                  enemy.addBuff({
                    id: "speedup",
                    key: "speedup",
                    overlay: false,
                    effect: [{
                      attrKey: "moveSpeed",
                      method: "mul",
                      value: speedup + 1
                    }]
                  })
                  this.handleSpawnGem(inTile);
                }
              })
            }

          }
        })

        break;
    }
  }

  handleDie(enemy: Enemy) {
    switch (enemy.key) {
      case "enemy_10014_sgrich":
      case "enemy_10014_sgrich_2":
        const centerTile = Global.tileManager.getTile(enemy.tilePosition.x, enemy.tilePosition.y);
        const roundTile = enemy.getRoundTile();
        this.canSpawnGem(centerTile) && this.handleSpawnGem(centerTile);
        Object.values(roundTile).forEach(tile => {
          this.canSpawnGem(tile) && this.handleSpawnGem(tile);
        })
        break;

    }
  }
}

export default act35side;
