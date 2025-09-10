import { Countdown } from "../game/CountdownManager";
import Global from "../utilities/Global";

interface AnimateTransition{
  //transAnimation: 是否有过渡动画
  //animationScale: 过渡动画执行速率
  //isWaitTrans: 进行过渡动画时是否停止移动
  //callback：结束过渡动画后的回调函数
  moveAnimate?: string, 
  idleAnimate?: string, 
  transAnimation?: string, 
  startLag?: number,         //transAnimation动画前摇
  endLag?: number,           //transAnimation动画后摇
  animationScale?: number,
  isWaitTrans: boolean, 
  callback?: Function
}

interface SPSkillParam{
  name: string,
  initSp: number,
  spSpeed?: number,
  spCost: number, 
  trigger?: string,
  callback: Function,
  maxCount?: number,  
}

interface spSkill{
  name: string,
  spSpeed: number,
  sp: number,
  spCost: number,
  applyCount: number,
  pause: boolean,
}


class DataObject{
  private events: {[key: string]: Function} = {};         //绑定的方法
  public staticData: {[key: string]: any} = {};    //静态数据存储
  public customData: {[key: string]: any} = {};    //数据存储

  public countdown: Countdown;  //倒计时
  public spSkillData: spSkill[] = [];
  constructor(){
    const countdownManager = Global.countdownManager;
    if(countdownManager) this.countdown = countdownManager.getCountdownInst();
  }

  public bindEvent(key: string, func: Function){
    this.events[key] = func;
  }

  public removeEvent(key: string){
    if(this.events[key]){
      delete this.events[key];
    }
  }

  public applyEvent(key: string, args?){
    this.events[key] && this.events[key](args);
  }

  public addSPSkill(param: SPSkillParam){
    const {name, initSp, spCost, spSpeed, trigger, callback, maxCount} = param;

    this.spSkillData.push({
      name,
      spSpeed: spSpeed ? spSpeed : 1,
      sp: initSp,
      spCost: spCost,
      applyCount: 0,
      pause: false
    })
    
    //自动回复sp的技能
    this.countdown.addCountdown({
      name,
      initCountdown: 1,
      countdown: 1,
      callback: (timer) => {
        const index = this.spSkillData.findIndex(data => data.name === name);
        if(index === -1) return;

        const spSkill = this.spSkillData[index];
        spSkill.sp = Math.min(spSkill.sp + spSkill.spSpeed, spSkill.spCost);

        if(spSkill.sp >= spSkill.spCost){
          
          if(callback) callback(timer);
          spSkill.applyCount++;
          spSkill.sp = 0;

          if(spSkill.applyCount >= maxCount){
            this.countdown.stopCountdown(name);
            spSkill.pause = true;
          }
          
        }
        
      }
    });

  }

  public getSPSkill(name: string){
    return this.spSkillData.find(data => data.name === name);
  }

  public stopSPSkill(name: string){
    const spSkill = this.getSPSkill(name);
    spSkill.pause = true;
    this.countdown.stopCountdown(name);
  }

  public startSPSkill(name: string){
    const spSkill = this.getSPSkill(name);
    spSkill.pause = false;
    this.countdown.startCountdown(name);
  }

  //技能从零开始
  public reStartSPSkill(name: string){
    const spSkill = this.getSPSkill(name);
    spSkill.sp = 0;
    spSkill.applyCount = 0;
    spSkill.pause = false;
    this.countdown.startCountdown(name);
  }

  public get(): any{
    const states = {
      customData: {...this.customData},
      spSkillData: this.spSkillData.map(data => {
        return {...data }
      }),
    }

    return states;
  }

  public set(states){
    const { 
      customData,
      spSkillData, 
    } = states;

    this.spSkillData = spSkillData.map(data => {
      return {...data};
    })
    this.customData = {...customData};
  }
}

export default DataObject;