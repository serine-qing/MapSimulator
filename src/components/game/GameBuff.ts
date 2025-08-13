import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";

class GameBuff{
  public buffs:Buff[] = [];
  constructor(){
    
  }

  addGlobalBuff(buffParam: BuffParam){
    this.buffs.push({
      id: buffParam.id,
      key: buffParam.key,
      overlay: buffParam.overlay ? true : false,
      effect: buffParam.effect,
      countdown: buffParam.duration
    });
  }

  addEnemyBuff(buffParam: BuffParam){
    let enemies: Enemy[];
    switch ( buffParam.applyType ) {
      case "all":
        enemies = Global.waveManager.enemies;
        break;
      case "enemiesInMap":
        enemies = Global.waveManager.enemiesInMap;
        break;
    }
    const buff: Buff = {
      id: buffParam.id,
      key: buffParam.key,
      overlay: buffParam.overlay ? true : false,
      effect: buffParam.effect,
      countdown: buffParam.duration
    }

    enemies.forEach(enemy => {
      if(
        ( !buffParam.enemy && !buffParam.enemyExclude ) ||
        ( buffParam.enemy && buffParam.enemy.includes(enemy.key) ) ||
        ( buffParam.enemyExclude && !buffParam.enemyExclude.includes(enemy.key) )
      ){
        enemy.addBuff(buff)
      }

    })
  }

  removeEnemyBuff(id: string){
    Global.waveManager.enemies.forEach(enemy => {
      enemy.removeBuff(id);
    })
  }

  update(delta: number){

  }

  
  public get() {
    
  }
  
  public set() {
    
  }
}

export default GameBuff;