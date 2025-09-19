import { Mesh, MeshBasicMaterial, Object3D, PlaneGeometry } from "three";
import { Countdown } from "../game/CountdownManager";
import Global from "../utilities/Global";
import { getPixelSize } from "../utilities/utilities";
import DataObject from "./DataObject";
import { isNumber } from "element-plus/es/utils/types.mjs";

const spBarWidth = getPixelSize(5/7);
const spBarGeometry = new PlaneGeometry(spBarWidth, 0.4);
const spBarShadowMaterial = new MeshBasicMaterial({
  color: "#000000",
  transparent: true,
  opacity: 0.4,
  depthTest: false,
  depthWrite: false,
})

const spBarMaterial = new MeshBasicMaterial({
  color: "#909B3B",
  transparent: true,
  opacity: 1,
  depthTest: false,
  depthWrite: false,
})

const spBarUsingMaterial = new MeshBasicMaterial({
  color: "#C3860E",
  transparent: true,
  opacity: 1,
  depthTest: false,
  depthWrite: false,
})


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

//技能数据
interface SkillStates{
  name: string,
  priority: number,
  autoTrigger: boolean,
  spCost: number,
  duration: number,
  maxCount: number,
  showSPBar: boolean,
  spPlusBySecond: boolean,
  eternal: boolean,
  initCooldown: number,
  cooldown: number,

  sp: number,
  spSpeed: number,
  beUsing: boolean,             //是否正在技能释放中
  pause: boolean,
  finished: boolean,
  applyCount: number,
}

interface SkillParam{
  name: string,
  animateTransition?: AnimateTransition,
  endAnimateTransition?: AnimateTransition,
  initCooldown?: number,
  cooldown?: number,
  priority?: number,             //技能cd同时转好时的触发优先级
  autoTrigger?: boolean,            //默认自动触发
  callback?: Function,
  endCallback?: Function,      //技能结束的回调(需要有duration)
  duration?: number,            //技能持续时间（没有就瞬发）
  maxCount?: number,           //最大触发次数
  cooldownStop?: boolean,       //是否有技能阻回条，默认是
  eternal?: boolean,           //永久性技能（结束后不会被删除，占用内存更多）

  initSp?: number,
  spSpeed?: number,
  spPlusBySecond?: boolean,     //sp是否是在整数秒时刻增加
  spCost?: number, 
  showSPBar?: boolean
}

class BattleObject extends DataObject{
  protected spBarShadow: Mesh;
  protected spBar: Mesh;
  protected spBarUsing: Mesh;
  protected skillStates: SkillStates[] = []; //技能数据
  protected animations: any[];

  public canUseSkill: boolean = true;   //当前是否可用技能
  constructor(){
    super();
  }

  public getSkillState(name: string): SkillStates{
    const find = this.skillStates.find(state => state.name === name);
    return find? find : null;
  }

  public addSkill(skillParam: SkillParam){
    const { name, animateTransition, endAnimateTransition, priority, 
      initCooldown, cooldown, autoTrigger, callback, endCallback, eternal, 
      initSp, spSpeed, spCost, spPlusBySecond, duration, showSPBar
    } = skillParam;

    let maxCount = skillParam.maxCount? skillParam.maxCount : Infinity;
    const initCountdown = initCooldown? initCooldown : 0;
    const countdown = cooldown? cooldown : 0;
    
    //没有填cooldown的话 默认最大执行次数为1
    //但是填了spCost的话，基本就是跟SP相关的技能了 需要手动设置maxCount
    if( !spCost && (cooldown === undefined || cooldown === null)) maxCount = 1;

    //技能是否有阻回条，默认是
    const cooldownStop = skillParam.cooldownStop !== undefined ? skillParam.cooldownStop : true;
    let cooldownStopTime = 0;

    if(this.animations && cooldownStop && animateTransition){
      const find = this.animations.find(animation => animation.name === animateTransition.transAnimation);
      cooldownStopTime = ( find.duration || 0 ) * (animateTransition.animationScale || 1);
    }

    //技能转换动画
    let animTrans;
    if(animateTransition){

      animTrans = {
        moveAnimate: animateTransition.moveAnimate,
        idleAnimate: animateTransition.idleAnimate,
        transAnimation: animateTransition.transAnimation,
        startLag: animateTransition.startLag,
        endLag: animateTransition.endLag,
        animationScale: animateTransition.animationScale,
        isWaitTrans: animateTransition.isWaitTrans,
        callback: (...param) => {
          animateTransition.callback && animateTransition.callback(...param);
          this.canUseSkill = true;
        }
      }
    }

    this.skillStates.push({
      name,
      priority: priority ? priority : 0,
      autoTrigger: autoTrigger === false ? false : true,
      spPlusBySecond: spPlusBySecond? true : false,
      spCost: spCost? spCost : 0,
      spSpeed: isNumber(spSpeed)? spSpeed: 1,
      duration: duration? duration : 0,
      showSPBar: showSPBar ? showSPBar: false,
      maxCount,
      eternal,
      initCooldown,
      cooldown,
      //下面是动态数据
      pause: false,
      sp: initSp? initSp : 0,
      beUsing: false,
      finished: false,
      applyCount: 0
    })

    if(spPlusBySecond && spCost){
      this.countdown.addCountdown({
        name: name +"AddSP",
        initCountdown: 1,
        countdown: 1,
        callback: () => {
          const skill = this.getSkillState(name);
          if(skill && skill.spSpeed)
          this.addSPForSkill(name, skill.spSpeed);
        }
      })
    }
    
    //priority越大 技能释放优先级越高
    this.skillStates.sort((a, b) => b.priority - a.priority);

    //释放技能
    this.countdown.addCountdown({
      name,
      initCountdown,
      countdown: countdown + cooldownStopTime + (duration? duration : 0),
      trigger: "manual",
      callback: (...param) => {
        const state = this.getSkillState(name);
        const {duration} = state;

        if(animTrans){
          this.canUseSkill = false;  //正在释放技能动画中
          this.animationStateTransition(animTrans);
        }

        if(callback) callback(...param);

        state.applyCount++;
        state.sp = 0;

        if(duration){
          state.beUsing = true;
          this.countdown.addCountdown({
            name: name + "beUsing",
            initCountdown: duration,
            callback: () => {
              state.beUsing = false;
              //有持续时间的技能，结束转换动画
              endAnimateTransition && this.animationStateTransition(endAnimateTransition);  
              endCallback && endCallback();
              this.checkSkillOver(state);
            }
          })
        }else{
          this.checkSkillOver(state);
        }

      }
    });
    
  }
  
  private checkSkillOver(skill: SkillStates){
    if(skill.applyCount >= skill.maxCount){

      if(skill.eternal)
        skill.finished = true;
      else
        this.removeSkill(skill.name);
    }
  }

  //直接给技能加sp
  public addSPForSkill(name: string, spPlus: number){
    const skill = this.getSkillState(name);
    if(skill){
      const {sp, spCost, beUsing, pause, finished} = skill;
      if(!beUsing && spCost && !pause && !finished){
        skill.sp = Math.min(sp + spPlus, spCost);
      }
    }
  }

  protected updateSkillSP(delta: number){
    this.skillStates.forEach(skill => {
      const {sp, spCost, spSpeed, spPlusBySecond, beUsing, pause, finished} = skill;
      if(!beUsing && spSpeed && spCost && !spPlusBySecond && !pause && !finished){
        skill.sp = Math.min(spSpeed * delta + sp, spCost);
      }
    })
  }

  protected updateSkillState(){
    if( this.skillStates.length > 0 && this.canUseSkill){
      for(let i = 0; i < this.skillStates.length; i++){
        const skill = this.skillStates[i];
        const {name, autoTrigger} = skill;

        if( 
          autoTrigger && 
          this.triggerSkill(name) 
        ) {
          return;
        };
      }
      
    }
  }

  public reStartSkill(name: string){
    const skill = this.getSkillState(name);
    skill.sp = 0;
    skill.finished = false;
  }

  public stopSkill(name: string){
    const skill = this.getSkillState(name);
    if(skill) skill.pause = true;
    this.countdown.stopCountdown(name);
  }

  public startSkill(name: string){
    const skill = this.getSkillState(name);
    if(skill) skill.pause = false;
    this.countdown.startCountdown(name);
  }

  public removeSkill(name: string){
    this.countdown.removeCountdown(name);
    this.countdown.removeCountdown(name +"AddSP");
    
    const findIndex = this.skillStates.findIndex(state => state.name === name);
    if(findIndex > -1){
      this.skillStates.splice(findIndex, 1);
    }else{
      console.error(`${name} 技能删除失败`);
    }
  }
  
  public triggerSkill(name: string, ...param): boolean{
    const state = this.getSkillState(name);

    //没有暂停、不在使用中、没有结束、SP足够
    if(state && !state.beUsing && !state.pause && !state.finished && (!state.spCost || state.sp === state.spCost)){
      return this.countdown.triggerCountdown(name, false, ...param);
    }
    
    return false;
  }

  protected initSPBar(){
    if(!this.object) return;

    if(this.spBar){
      //删除老的
      this.object.remove(this.spBarShadow);
      this.object.remove(this.spBar);
    }

    const spBarShadow = new Mesh(spBarGeometry, spBarShadowMaterial);
    const spBar = new Mesh(spBarGeometry, spBarMaterial);
    const spBarUsing = new Mesh(spBarGeometry, spBarUsingMaterial);

    spBarShadow.position.y = getPixelSize(-0.35);
    spBar.position.y = getPixelSize(-0.35);
    spBarUsing.position.y = getPixelSize(-0.35);
    
    spBarShadow.renderOrder = 99;
    spBar.renderOrder = 100;
    spBarUsing.renderOrder = 101;

    this.spBarShadow = spBarShadow;
    this.spBar = spBar;
    this.spBarUsing = spBarUsing;

    this.spBarUsing.visible = false;

    this.object.add(spBarShadow);
    this.object.add(spBar);
    this.object.add(spBarUsing);
  }

  protected updateSPBar(){
    if(!this.object) return;

    const skill = this.skillStates.find(data => data.showSPBar);

    if(!skill) {
      this.hideSPBar(); 
      return;
    };
    
    if(!this.spBar){
      this.initSPBar();
    }

    if(skill.finished){
      this.hideSPBar();
    }else{
      if(skill.beUsing){
        this.spBar.visible = false;
        this.spBarUsing.visible = true;
        
        const time = this.countdown.getCountdownTime(skill.name + "beUsing");
        const useRate = time / skill.duration;
        
        this.spBarUsing.scale.x = useRate;
        this.spBarUsing.position.x = - spBarWidth * (1 - useRate) / 2;
      }else{
        this.spBarUsing.visible = false;
        this.spBar.visible = true;
        this.spBarShadow.visible = true;

        
        let rate = 0;
        //有spCost就显示当期sp，否则显示countdown
        if( skill.spCost ){
          rate = skill.sp / skill.spCost;
        }else{
          const currentTime = this.countdown.getCountdownTime(skill.name);
          const maxTime = skill.applyCount === 0 ? skill.initCooldown : skill.cooldown;
          if(currentTime && maxTime) rate = 1 - currentTime / maxTime;
        }
        this.spBar.scale.x = rate;
        this.spBar.position.x = - spBarWidth * (1 - rate) / 2;
      }
    }
  }

  protected hideSPBar(){
    if(!this.spBar) return;
    this.spBar.visible = false;
    this.spBarShadow.visible = false;
    this.spBarUsing.visible = false;
  }

  public animationStateTransition(transition: AnimateTransition){}

  public get(): any{
    const superStates = super.get();

    const states = {
      canUseSkill: this.canUseSkill,
      skillStates: [...this.skillStates],
      skillStatesDynamicData: this.skillStates.map(state => {
        return {
          sp: state.sp,
          spSpeed: state.spSpeed,
          beUsing: state.beUsing,
          finished: state.finished,
          applyCount: state.applyCount,
        }
      }),
      ...superStates
    }

    return states;
  }

  public set(states){
    super.set(states);

    const { 
      canUseSkill,
      skillStates,
      skillStatesDynamicData,
    } = states;

    this.canUseSkill = canUseSkill;
    this.skillStates = [...skillStates];

    for(let i = 0; i < this.skillStates.length; i++){
      const state = skillStatesDynamicData[i];
      this.skillStates[i].sp = state.sp;
      this.skillStates[i].spSpeed = state.spSpeed;
      this.skillStates[i].beUsing = state.beUsing;
      this.skillStates[i].finished = state.finished;
      this.skillStates[i].applyCount = state.applyCount;
    }

    this.updateSPBar();
  }
}

export default BattleObject;