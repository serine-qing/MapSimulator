import Global from "../utilities/Global";
import { Countdown } from "./CountdownManager";

class TokenCard{
  initialCnt: number;
  hidden: boolean;
  alias: any;
  characterKey: string;
  level: number;
  mainSkillLvl: number;

  url: string;
  texture: THREE.Texture;
  currentCnt: number;
  selected: boolean = false;

  trapData: trapData;

  cnt: number;      //数量
  cost: number;     //费用
  respawntime: number;   //再部署时间

  countdown: Countdown;

  cardVue: any;   //vue proxy对象

  constructor(data){
    this.initialCnt = data.initialCnt;
    this.hidden = data.hidden;
    this.alias = data.alias;
    this.characterKey = data.characterKey;
    this.level = data.level;
    this.mainSkillLvl = data.mainSkillLvl;

    this.cnt = this.initialCnt;
    this.cost = data.cost;
    this.respawntime = data.respawntime;

    this.url = data.url;
    this.texture = data.texture;
    this.trapData = data.trapData;

    this.currentCnt = this.initialCnt;

    this.countdown = Global.gameManager.countdownManager.getCountdownInst();
  }

  //选择
  handleSelected(){
    if(this.cnt > 0 ){
      const respawnTime = this.countdown.getCountdownTime("respawn");
      if(respawnTime === -1){
        this.selected = !this.selected;
        this.cardVue.selected = this.selected;
      }
    }
  }

  //部署
  handleDeploy(){
    this.selected = false;
    this.cardVue.selected = false;
    this.cnt--;
    if(this.cnt > 0){
      this.countdown.addCountdown({
        name: "respawn", 
        initCountdown: this.respawntime
      })  
    }
  }

  get(){
    return {
      cnt: this.cnt
    }
  }

  set(state){
    this.cnt = state.cnt;
  }
}

export default TokenCard;