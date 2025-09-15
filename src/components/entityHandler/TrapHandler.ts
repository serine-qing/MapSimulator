import { GC_Add } from "../game/GC";
import Trap from "../game/Trap";
import Global from "../utilities/Global";
import act42side from "./众生行记";
import act44side from "./墟";
import act45side from "./无忧梦呓";
import main15 from "./15章";

const start = (trap: Trap) => {
  act42side.handleTrapStart(trap);
  act44side.handleTrapStart(trap);
  act45side.handleTrapStart(trap);
  main15.handleTrapStart(trap);
}

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
  }
}

const TrapHandler = {
  start, initSkill
}


export default TrapHandler;