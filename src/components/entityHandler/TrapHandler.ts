import { GC_Add } from "../game/GC";
import Trap from "../game/Trap";
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
    case "trap_121_gractrl":
      const gameBuff = Global.gameBuff;
      gameBuff.addBuff({
        key: "gractrl"
      })

      console.log(Global)
      break;
  }
}

const TrapHandler = {
  initSkill
}


export default TrapHandler;