class TokenCard{
  initialCnt: number;
  hidden: boolean;
  alias: any;
  characterKey: string;
  level: number;

  url: string;
  texture: THREE.Texture;
  currentCnt: number;
  selected: boolean = false;
  constructor(data){
    this.initialCnt = data.initialCnt;
    this.hidden = data.hidden;
    this.alias = data.alias;
    this.characterKey = data.characterKey;
    this.level = data.level;

    this.currentCnt = this.initialCnt;
  }
}

export default TokenCard;