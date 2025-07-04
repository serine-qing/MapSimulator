class EventBus{
  private events: {[ key: string] : Function[] } 
  constructor(){
    this.events = {};
  }
  on(name: string, callback: Function){
    if(!this.events[name]){
      this.events[name] = [];
    }

    this.events[name].push(callback);
    
  }

  remove(name: string, callback?: Function){
    const eventArr = this.events[name];
    if(callback && eventArr){

      for(let i = 0; i< eventArr.length; i++){
        if(eventArr[i] === callback){
          eventArr.splice(i, 1);
          return;
        }
      }
    }else{
      this.events[name] = null;
    }
    
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