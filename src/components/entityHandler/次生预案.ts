import Global from "../utilities/Global";
import { getBlackBoardItem } from "../utilities/utilities";

const Handler = {
  afterGameInit: () => {
    const configBlackBoard = Global.mapModel.sourceData.options?.configBlackBoard;
    if(configBlackBoard){
      const bossTriggerTime = getBlackBoardItem("boss_branch_trigger_time", configBlackBoard);
      if(bossTriggerTime){

        Global.gameManager.countdown.addCountdown({
          name: "cishengBossTrigger",
          initCountdown: bossTriggerTime,
          callback: () => {
            Global.waveManager.startExtraAction({
              key: "boss_branch"
            })
          }
        })

        Global.mapModel.addExtraDescription({
          text: "次生预案所有敌人都是巡逻路径，不会进蓝门，为了模拟性能考虑，所有模拟敌人都只完成一次巡逻路径就消失。",
          color: "#3633F3"
        })
        Global.mapModel.addExtraDescription({
          text: `BOSS出现时间:${bossTriggerTime}秒 `,
        })
      }
    }
  },
};

export default Handler;