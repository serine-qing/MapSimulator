import Enemy from "../enemy/Enemy";
import Global from "../utilities/Global";
import { Countdown } from "./CountdownManager";

class BuffManager{
  countdown: Countdown;
  auras: BuffParam[] = [];        //光环buff，需要对新生成的enemy判断是否添加buff
  constructor(){
    Global.buffManager = this;

    this.countdown = Global.countdownManager.getCountdownInst();
  }

  //单个buff对象挂载到多个敌人上
  //实现比较别扭，但确实这样性能比较高，多个敌人身上的buff只用调用一个计时器
  addBuffs(buffParam: BuffParam){
    const enemies = Global.waveManager.enemiesInMap;
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
        enemy.addBuff(buff);
      }
    })

    //定时器
    if(buffParam.duration){
      this.countdown.addCountdown({
        name: buff.id,
        initCountdown: buffParam.duration,
        callback: () => {
          this.removeBuffs(buff.id)
        }
      })
    }
  }

  //添加光环类buff
  addAura(buffParam: BuffParam){
    this.addBuffs(buffParam);
    this.auras.push(buffParam);
  }

  removeBuffs(id: string){
    Global.waveManager.enemiesInMap.forEach(enemy => {
      enemy.removeBuff(id);
    })
  }

  removeAura(id: string){
    this.removeBuffs(id);
    const findIndex = this.auras.findIndex(aura => aura.id === id);
    if(findIndex > -1) this.auras.splice(findIndex, 1);
  }
  
  applyAuraBuff(enemy: Enemy){
    this.auras.forEach(aura => {
      if(
        ( !aura.enemy && !aura.enemyExclude ) ||
        ( aura.enemy && aura.enemy.includes(enemy.key) ) ||
        ( aura.enemyExclude && !aura.enemyExclude.includes(enemy.key) )
      ){
        const buff: Buff = {
          id: aura.id,
          key: aura.key,
          overlay: aura.overlay ? true : false,
          duration: aura.duration,
          effect: aura.effect
        }
        enemy.addBuff(buff);
      }
    })
  }
  
  public get() {
    const states = {
      aurasState: [...this.auras]
    }

    return states;
  }
  
  public set(states) {
    const {
      aurasState
    } = states;

    this.auras = [...aurasState];
  }
}

export default BuffManager;