import Enemy from "../enemy/Enemy";
import SpineEnemy from "../enemy/SpineEnemy";
import Trap from "../game/Trap";
import GameConfig from "./GameConfig";

const specialIdle = {
  enemy_1536_ncrmcr: "Idle_b",       //boss领袖
}

const specialMove = {
  enemy_10010_sgnja: "Move",        //"市井盗贼"
  enemy_10010_sgnja_2: "Move", 
  enemy_10072_mpprhd: "Idle",       //侵入式调用
}

export const getAnimation = (key: string, animations: any, state: string) => {
  
  let animation;
  switch (state) {
    case "Move":
      animation = getMoveAnimation(key, animations);
      break;
    case "Idle":
      animation = getIdleAnimation(key, animations);
      break;
    case "Trap_Idle":
      animation = getTrapIdleAnimation(key, animations);
      break;
  }

  return animation;
}

const getMoveAnimation = (key:string, animations: any) => {
  const special = specialMove[key];
  if(special) return special;

  const moveStates = ["Run_Loop","Move_Loop","Run","Move"];

  for(let i=0; i<moveStates.length; i++){
    const stateName = moveStates[i];
    const find = animations.find( (animation: any ) => {
      return animation.name === stateName;
    })
      
    if(find){
      return find.name;
    }

    const fuzzyFind = animations.find( (animation: any ) => {
      return animation.name.includes(stateName);
    })

    if(fuzzyFind){
      return fuzzyFind.name;
    }
  }

  return;
}

const getIdleAnimation = (key:string, animations: any) => {
  const special = specialIdle[key];
  if(special) return special;

  //"Idile"是拼写错误 但是偶尔会出现在模型里面
  const idleStates = ["Idle", "Idile"];

  for(let i=0; i<idleStates.length; i++){
    const stateName = idleStates[i];
    const find = animations.find( (animation: any ) => {
      return animation.name === stateName;
    })

    if(find){
      return find.name;
    }

    const fuzzyFind = animations.find( (animation: any ) => {
      return animation.name.includes(stateName);
    })

    if(fuzzyFind){
      return fuzzyFind.name;
    }
  }

  return;
}

const getTrapIdleAnimation = (key:string, animations: any) => {

  const idleStates = ["Idle","Sleep", "Default"];

  for(let i=0; i<idleStates.length; i++){
    const stateName = idleStates[i];
    const find = animations.find( (animation: any ) => {
      return animation.name === stateName;
    })

    if(find){
      return find.name;
    }

    const fuzzyFind = animations.find( (animation: any ) => {
      return animation.name.includes(stateName);
    })

    if(fuzzyFind){
      return fuzzyFind.name;
    }
  }

  return;
}

export const getSkelOffset = (enemy:SpineEnemy): Vec2 => {
  const offset = {
    x: 0,
    y: 0
  };

  return offset;
}

export const getSpineScale = (inst: any): Vec2 => {
  // console.log(enemy.name +" : "+ enemy.key)
  const size = spineMap[inst.key]
  return size ? size : {
    x: 0.9,
    y: 0.9
  };
}



const spineMap = {
  "enemy_10110_mjcsdw":{    //“破茧之梦”
    x: -0.9,
    y: 0.9
  },
  "enemy_10110_mjcsdw_2":{
    x: -0.9,
    y: 0.9
  },
  "enemy_1005_yokai":{
    x: 0.8,
    y: 0.8
  },
  //威龙
  "enemy_1005_yokai_3":{
    x: 0.65,
    y: 0.65
  },
  "enemy_1112_emppnt":{
    x: 0.8,
    y: 0.8
  },
  "enemy_1112_emppnt_2":{
    x: 0.8,
    y: 0.8
  },
  "enemy_1321_wdarft":{
    x: 1.1,
    y: 1.1
  },
  "enemy_1321_wdarft_2":{
    x: 1.1,
    y: 1.1
  },
  "enemy_10145_xdrock":{      //伊斯贝塔
    x: 0.9,
    y: 0.9
  },
  "enemy_10145_xdrock_2":{      //伊斯贝塔
    x: 0.9,
    y: 0.9
  }
}

export const checkEnemyMotion = (key: string, motion: string) => {
  if(["enemy_10030_vtwand","enemy_10028_vtswd","enemy_10029_vtshld"].includes(key)){
    return "WALK"
  }
  return motion;
}


const spineAnimationSpeed = {
  "enemy_1072_dlancer" : 0.3,
  "enemy_1072_dlancer_2" : 0.3,
  "enemy_1413_mmstck" : 0.3,
  "enemy_1413_mmstck_2" : 0.3,
  "enemy_1309_mhboar": 0.3,
  "enemy_1309_mhboar_2": 0.3
}

export const getAnimationSpeed = (key) => {
  const speed = spineAnimationSpeed[key];
  return speed? speed : 1;
}

const specialZHeight = {
  "enemy_10140_xdbird": GameConfig.TILE_HEIGHT,        //洞栖雪灵看起啦更低，以匹配视觉效果
  "enemy_10140_xdbird_2": GameConfig.TILE_HEIGHT,
}

export const getSpecialZHeight = (key) => {
  const ZHeight = specialZHeight[key];
  return ZHeight? ZHeight : null;
}