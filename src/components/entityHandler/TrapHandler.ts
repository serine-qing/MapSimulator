import { GC_Add } from "../game/GC";
import Trap from "../game/Trap";
import { Direction } from "../utilities/Enum";
import Global from "../utilities/Global";

const initSkill = (trap: Trap) => {
  switch (trap.key) {
    //土石结构的壳
    case "trap_032_mound":
      if(trap.mainSkillLvl === 1){
        const skin = trap.fbxMesh.children[1];
        trap.fbxMesh.remove(skin);
        GC_Add(skin);
      }
      break;
    //重力控制
    case "trap_121_gractrl":
      const gameBuff = Global.gameBuff;
      gameBuff.addGlobalBuff({
        id: "gractrl",
        applyType: "all",
        key: "gractrl",
        effect: [{
          attrKey: "direction",
          method: null,
          value: Direction.DOWN
        }]
      })

      break;
  }
}

const TrapHandler = {
  initSkill
}


export default TrapHandler;