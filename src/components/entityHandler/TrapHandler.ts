import { GC_Add } from "../game/GC";
import Trap from "../game/Trap";
import Global from "../utilities/Global";
import act42side from "./众生行记";
import act45side from "./无忧梦呓";

const start = (trap: Trap) => {
  act42side.handleTrapStart(trap);
  act45side.handleTrapStart(trap);
  
  switch (trap.key) {
    //压力舒缓帮手
    case "trap_253_boxnma":
    case "trap_254_boxmac":
      const duration = trap.customData.skillBlackboard.find(data => data.key === "born_duration")?.value;

      trap.countdown.addCountdown({
        name: "waiting",
        initCountdown: duration,
        callback: () => {
          const waveManager =  Global.gameManager.waveManager;
          waveManager.startExtraAction({
            key: trap.extraWaveKey,
          });
          trap.hide();
        }
      })
      break;
  
  }
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