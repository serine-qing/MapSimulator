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

  trap: Trap              //绑定的装置
  waveManager: WaveManager;

  isStarted: boolean = false    //是否开始
  actionTime: number;           //实际执行时间
  constructor(data: ActionData){
    const { key, actionType, startTime, dontBlockWave, blockFragment } = data;

    this.actionData = data;
    this.key = key;
    this.actionType = actionType;
    this.startTime = startTime;
    this.dontBlockWave = dontBlockWave;
    this.blockFragment = blockFragment;
  }


  public start(){

    this.isStarted = true;
    
  } 

  public get(){
    const state = {
      isStarted: this.isStarted,
      applyId: this.applyId
    }

    return state;
  }

  public set(state){
    const { isStarted, applyId } = state;
    this.isStarted = isStarted;
    this.applyId = applyId;
  }
}

export default Action;