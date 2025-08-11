interface Effect{
  key: string,
  method: string,               //加法：add / 乘法：mul
  value: number                 //具体数值
}

interface Buff{
  key: string,
  enemy?: string[],                  //包括哪些敌人
  enemyExclude?: string[],           //不包括哪些敌人
  effect?: Effect[],
  duration?: number,                 //持续时间
}

class GameBuff{
  public buffs: Buff[];
  constructor(){
    
  }

  addBuff(buff: Buff){

  }

  update(delta: number){

  }
}

export default GameBuff;