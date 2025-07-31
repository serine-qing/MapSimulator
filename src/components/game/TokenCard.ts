import { Countdown } from "./CountdownManager";
import GameManager from "./GameManager";

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

  gameManager: GameManager;
  countdown: Countdown;

  cardVue: any;   //vue proxy对象

  constructor(data, gameManager: GameManager){
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

    this.gameManager = gameManager;
    this.countdown = gameManager.countdownManager.getCountdownInst();
  }

  //选择
  handleSelected(){
    this.selected = !this.selected;
    this.cardVue.selected = this.selected;
  }

  //部署
  handleDeploy(){
    this.selected = false;
    this.cardVue.selected = false;
    this.countdown.addCountdown("respawn", this.respawntime, () => {
      //todo
    })  
  }
}

export default TokenCard;