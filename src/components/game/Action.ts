import Enemy from "../enemy/Enemy"
import WaveManager from "../enemy/WaveManager"
import Trap from "./Trap"

class Action{
  id: number
  actionType: string      //敌人生成模式
  startTime: number        //该波次开始时间
  dontBlockWave: boolean   //是否不影响下一波次刷新
  blockFragment: boolean   
  enemy: Enemy            //绑定的敌人
  trap: Trap              //绑定的装置
  waveManager: WaveManager;

  isStarted: boolean = false    //是否开始
  actionTime: number;           //实际执行时间
  constructor(data: ActionData){
    const { actionType, startTime, dontBlockWave, blockFragment } = data;

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
      isStarted: this.isStarted
    }

    return state;
  }

  public set(state){
    const { isStarted } = state;
    this.isStarted = isStarted;
  }
}

export default Action;