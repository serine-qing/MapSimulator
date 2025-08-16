
interface CountdownOpitons{
  name: string,
  initCountdown: number,            //初始倒计时
  countdown?: number,                //后续执行倒计时
  maxCount?: number,                 //最大执行次数
  callback?: Function,               //每次计时器归零的回调函数
  trigger?: string,                  //auto：自动触发， manual：手动触发，默认自动
}

class Countdown{
  timers: any[] = [];

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
      count: 0
    })
  }

  public getCountdownTime(name: string): number{
    const find = this.timers.find(timer => timer.name === name);
    return find? find.time : -1;
  }

  public triggerCountdown(name: string){
    const timerIndex = this.timers.findIndex(timer => timer.name === name);
    const timer = this.timers[timerIndex];

    if(timer && timer.time <= 0){
      const { countdown, callback, maxCount } = timer;
      timer.count ++;
      if(countdown && (!maxCount || timer.count < maxCount)){
        timer.time += countdown;
      }else{
        this.timers.splice(timerIndex, 1);
      }

      if(callback){
        callback(timer);
      }
    }
  }

  public clearCountdown(){
    this.timers = [];
  }

  public update(delta: number){
    for(let i = 0; i < this.timers.length; i++){
      const timer = this.timers[i];
      const { countdown, callback, trigger, maxCount } = timer;

      if( trigger === "manual"){
        timer.time = Math.max(timer.time - delta, 0);
        continue;
      };

      timer.time = timer.time - delta;
      if(timer.time <= 0){

        timer.count ++;

        if(countdown && (!maxCount || timer.count < maxCount)){
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

  public get(){
    const states = this.timers.map( timer => { 
      return { 
        timer,
        time: timer.time,
        count: timer.count
      } 
    });
    return states;
  }

  public set(states){
    this.timers = states.map( state => {
      state.timer.time = state.time;
      state.timer.count = state.count;  
      return state.timer;
    });
  }
}

class CountdownManager{
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
    for(let i = 0; i < state.countdownStates.length; i++){
      this.countdowns[i].set(state.countdownStates[i]);
    }
  }
}

export { CountdownManager, Countdown};