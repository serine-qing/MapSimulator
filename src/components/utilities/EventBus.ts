class EventBus{
  private events: {[ key: string] : Function[] } 
  constructor(){
    this.events = {};
  }
  on(name: string, callback: Function){
    if(this.events[name] === undefined){
      this.events[name] = [];
    }

    this.events[name].push(callback);
    
  }

  emit(name: string, ...args: any[]){
    const callbacks:Function[] = this.events[name];
    if(!callbacks){
      console.log("没有绑定事件:"+name);
      return;
    }
    
    callbacks.forEach(callback => {
      callback.apply(this, args)
    });
  }
}

const eventBus = new EventBus();
export default eventBus;