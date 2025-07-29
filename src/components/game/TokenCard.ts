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
  constructor(data){
    this.initialCnt = data.initialCnt;
    this.hidden = data.hidden;
    this.alias = data.alias;
    this.characterKey = data.characterKey;
    this.level = data.level;
    this.mainSkillLvl = data.mainSkillLvl;

    this.currentCnt = this.initialCnt;
  }
}

export default TokenCard;