import Enemy from "../enemy/Enemy";
import Tile from "../game/Tile";
import Global from "../utilities/Global";

const enterGem = (enemy: Enemy) => {
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

const outOfGem = (enemy: Enemy) => {
  enemy.animationStateTransition({
    moveAnimate: "Move",
    isWaitTrans: false
  });
  enemy.removeBuff("speedup");
}

const Handler = {
  initTileEvents: (tile: Tile) => {
    tile.blackboard?.forEach(bb => {
      switch (bb.key) {
        case "gems_type":
          //进入结晶
          Global.tileManager.addEvent({
            key: "gems",
            type: "in",
            x: tile.position.x,
            y: tile.position.y,
            enemy: ["enemy_10010_sgnja", "enemy_10010_sgnja_2"],
            isMerge: true,
            callback: enterGem
          })

          //出结晶
          Global.tileManager.addEvent({
            key: "gems",
            type: "out",
            x: tile.position.x,
            y: tile.position.y,
            enemy: ["enemy_10010_sgnja", "enemy_10010_sgnja_2"],
            callback: outOfGem
          })
          break;
      }
    });
  },

  handleTalent: (enemy: Enemy, talent: any) => {
  },

  handleSkill: (enemy: Enemy, skill: any) => {

  }
};

export default Handler;