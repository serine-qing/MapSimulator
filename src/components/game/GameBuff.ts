import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";
import { Countdown } from "./CountdownManager";

class GameBuff{
  public globalBuffs: Buff[] = [];
  countdown: Countdown;
  constructor(){
    this.countdown = Global.countdownManager.getCountdownInst();
  }

  addGlobalBuff(buffParam: BuffParam){
    this.globalBuffs.push({
      id: buffParam.id,
      key: buffParam.key,
      overlay: buffParam.overlay ? true : false,
      effect: buffParam.effect
    });
  }

  getGlobalBuff(id: string){
    const find = this.globalBuffs.find(buff => buff.id === id);
    return find ? find : null;
  }

  //单个buff对象挂载到多个敌人上
  //实现比较别扭，但确实这样性能比较高，多个敌人身上的buff只用调用一个计时器
  addBuff(buffParam: BuffParam){
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
      effect: buffParam.effect
    }

    enemies.forEach(enemy => {
      if(
        ( !buffParam.enemy && !buffParam.enemyExclude ) ||
        ( buffParam.enemy && buffParam.enemy.includes(enemy.key) ) ||
        ( buffParam.enemyExclude && !buffParam.enemyExclude.includes(enemy.key) )
      ){
        this.addEnemyBuff(enemy, buff);
      }
    })

    //定时器
    if(buffParam.duration){
      this.countdown.addCountdown({
        name: buff.id,
        initCountdown: buffParam.duration,
        callback: () => {
          this.removeBuff(buff.id)
        }
      })

    }

  }

  removeBuff(id: string){
    Global.waveManager.enemies.forEach(enemy => {
      this.removeEnemyBuff(enemy, id);
    })
  }

  //buff挂载到指定敌人上，enemy类也会调用此方法
  addEnemyBuff(enemy: Enemy, buff: Buff){
    this.removeEnemyBuff(enemy, buff.id);
    enemy.buffs.push(buff);

    if(buff.duration){
      this.countdown.addCountdown({
        name: buff.id,
        initCountdown: buff.duration,
        callback: () => {
          this.removeEnemyBuff(enemy, buff.id)
        }
      })
      
    }
  }

  removeEnemyBuff(enemy: Enemy, id: string){
    const findIndex = enemy.buffs.findIndex(buff => buff.id === id);
    if(findIndex > -1) {
      enemy.buffs.splice(findIndex, 1);
    }
  }

  update(delta: number){

  }

  
  public get() {
    
  }
  
  public set() {
    
  }
}

export default GameBuff;