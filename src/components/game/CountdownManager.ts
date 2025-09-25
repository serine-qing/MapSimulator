import Global from "../utilities/Global";

interface CountdownOpitons{
  name: string,
  initCountdown: number,            //初始倒计时
  countdown?: number,                //后续执行倒计时, 如果是0代表每帧触发
  maxCount?: number,                 //最大执行次数
  callback?: Function,               //每次计时器归零的回调函数
  trigger?: "auto" | "manual",                  //auto：自动触发， manual：手动触发，默认自动
}

interface Timer{
  name: string,
  callback: Function,
  initCountdown: number,
  countdown: number,
  trigger: string,
  maxCount: number,
  time: number,
  count: number,
  pause: boolean,
}

class Countdown{
  timers: Timer[] = [];

  public addCountdown(options: CountdownOpitons){
    const { name, callback, countdown, trigger, maxCount } = options;
    const initCountdown = options.initCountdown ? options.initCountdown : 0;

    this.timers.push({
      name,
      callback,
      initCountdown: initCountdown ? initCountdown : 0,
      countdown,
      trigger: trigger ? trigger : "auto",
      maxCount,
      time: initCountdown,
      count: 0,
      pause: false,
    })
  }

  public removeCountdown(name: string){
    const findIndex = this.timers.findIndex(timer => timer.name === name);
    if(findIndex > -1){
      this.timers.splice(findIndex, 1);
    }
  }

  public getTimer(name: string): Timer{
    const find = this.timers.find(timer => timer.name === name);
    return find? find : null;
  }

  public getCountdownTime(name: string): number{
    const find = this.timers.find(timer => timer.name === name);
    return find? find.time : -1;
  }

  public triggerCountdown(name: string, force: boolean, ...param): boolean{
    const timerIndex = this.timers.findIndex(timer => timer.name === name);
    const timer = this.timers[timerIndex];

    if(timer && (force || !timer.pause && timer.time <= 0)){
      const { countdown, callback, maxCount } = timer;
      timer.count ++;
      if(countdown !== undefined && (!maxCount || timer.count < maxCount)){
        
        if(force){
          timer.time = countdown;
        }else{
          timer.time += countdown;
        }
        
      }else{
        this.timers.splice(timerIndex, 1);
      }

      if(callback){
        callback(timer, ...param);
        return true;
      }
    }

    return false;
  }

  public clearCountdown(){
    this.timers = [];
  }

  public update(delta: number){
    for(let i = 0; i < this.timers.length; i++){
      const timer = this.timers[i];
      if( timer.pause ) continue;

      const { countdown, callback, trigger, maxCount } = timer;

      if( trigger === "manual"){
        timer.time = Math.max(timer.time - delta, 0);
        continue;
      };

      timer.time = timer.time - delta;
      if(timer.time <= 0){

        timer.count ++;

        if(countdown !== undefined  && (!maxCount || timer.count < maxCount)){
          timer.time += countdown;
        }else{
          this.timers.splice(i, 1);
          i--;
        }

        if(callback){
          callback(timer);
        }
      }
    }
  }

  public stopCountdown(name: string){
    const timer = this.getTimer(name);
    if(timer) timer.pause = true;
  }

  public startCountdown(name: string){
    const timer = this.getTimer(name);
    if(timer) timer.pause = false;
  }

  public get(){
    const timerStates = this.timers.map( timer => { 
      return { 
        timer,
        time: timer.time,
        count: timer.count,
        pause: timer.pause,
      } 
    });
    const states = {
      timerStates
    }
    return states;
  }

  public set(states){
    if(!states) {
      this.timers = [];
    }else{
      const { timerStates } = states;

      this.timers = timerStates.map( state => {
        state.timer.time = state.time;
        state.timer.count = state.count;  
        state.timer.pause = state.pause;
        return state.timer;
      });
    }

  }
}

class CountdownManager{
  constructor(){
    Global.countdownManager = this;
  }

  private countdowns: Countdown[] = [];

  public getCountdownInst(){
    const countdown = new Countdown();
    this.countdowns.push(countdown);

    return countdown;
  }

  public update(delta: number){
    this.countdowns.forEach(countdown => {
      countdown.update(delta);
    })
  }

  public get(){
    const state = {
      countdownStates: this.countdowns.map(countdown => countdown.get())
    }

    return state;
  }

  public set(state){

    for(let i = 0; i < this.countdowns.length; i++){
      const countdownState = state.countdownStates[i];
      if(countdownState){
        this.countdowns[i].set(countdownState);
      }else{
        this.countdowns[i].set(null);
      }

    }
  }
}

export { CountdownManager, Countdown};