
class Countdown{
  timers: any[] = [];

  public addCountdown(name: string, time: number, callback?: Function){
    this.timers.push({
      name, time, callback
    })
  }

  public getCountdownTime(name: string): number{
    const find = this.timers.find(timer => timer.name === name);
    return find? find.time : -1;
  }

  public update(delta: number){
    for(let i = 0; i < this.timers.length; i++){
      const timer = this.timers[i];
      timer.time = Math.max(timer.time - delta, 0);
      if(timer.time === 0){
        this.timers.splice(i, 1);
        i--;

        if(timer.callback){
          timer.callback();
        }
      }
    }
  }

  public get(){
    const state = this.timers.map( timer => {return {...timer} });
    return state;
  }

  public set(state){
    this.timers = state.map( timer => {return {...timer} });
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