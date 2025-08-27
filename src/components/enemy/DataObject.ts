class DataObject{
  private events: {[key: string]: Function} = {};         //绑定的方法
  public customData: {[key: string]: any} = {};    //数据存储
  constructor(){

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

  public get(): any{
    const states = {
      customData: {...this.customData},
    }

    return states;
  }

  public set(states){
    const { customData } = states;
    this.customData = {...customData};
  }
}

export default DataObject;