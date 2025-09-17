import { Object3D } from "three";
import { Countdown } from "../game/CountdownManager";
import Global from "../utilities/Global";

class DataObject{
  protected events: {[key: string]: Function} = {};         //绑定的方法
  public staticData: {[key: string]: any} = {};    //静态数据存储
  public customData: {[key: string]: any} = {};    //数据存储
  public deepCopyData: {[key: string]: any} = {};    //深拷贝数据存储
  public countdown: Countdown;  //倒计时
  public object: Object3D;          //fbxMesh和skeletonMesh

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

  public get(): any{
    const deepCopyDataStates = {};
    Object.keys(this.deepCopyData).forEach(key => {

      const value = this.deepCopyData[key];

      if(Array.isArray(value)){
        deepCopyDataStates[key] = [...value];
      }else{
        deepCopyDataStates[key] = {...value};
      }
    })

    const states = {
      customData: {...this.customData},
      deepCopyData: deepCopyDataStates,
    }

    return states;
  }

  public set(states){
    const { 
      customData,
      deepCopyData,
    } = states;

    this.customData = {...customData};

    const deepCopyDataStates = {};
    Object.keys(deepCopyData).forEach(key => {

      const value = deepCopyData[key];

      if(Array.isArray(value)){
        deepCopyDataStates[key] = [...value];
      }else{
        deepCopyDataStates[key] = {...value};
      }
    })

    this.deepCopyData = deepCopyDataStates;

  }
}

export default DataObject;