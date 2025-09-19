import Enemy from "../enemy/Enemy"
import WaveManager from "../enemy/WaveManager"
import Trap from "./Trap"

class Action{
  id: number
  key: string
  actionData: ActionData 
  actionType: string      //敌人生成模式
  startTime: number        //该波次开始时间
  dontBlockWave: boolean   //是否不影响下一波次刷新
  blockFragment: boolean   
  isExtra: boolean = false;       //是否是额外波次
  enemys: Enemy[] = []            //绑定的敌人。额外出怪可能会多次调用，数组length就会大于1
  applyId: number = 0;            //调用id
  prtsSpawn: boolean = false;     //prts抓取的怪

  trap: Trap              //绑定的装置
  waveManager: WaveManager;

  actionTime: number;           //实际执行时间
  constructor(data: ActionData){
    const { key, actionType, startTime, dontBlockWave, blockFragment, prtsSpawn } = data;

    this.actionData = data;
    this.key = key;
    this.actionType = actionType;
    this.startTime = startTime;
    this.dontBlockWave = dontBlockWave;
    this.blockFragment = blockFragment;
    this.prtsSpawn = prtsSpawn;      //15章机制
  }

  public get(){
    const state = {
      applyId: this.applyId
    }

    return state;
  }

  public set(state){
    const { applyId } = state;
    this.applyId = applyId;
  }
}

export default Action;