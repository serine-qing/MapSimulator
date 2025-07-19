import Enemy from "../enemy/Enemy";
import Trap from "../game/Trap";

const specialIdle = {
  enemy_1536_ncrmcr: "Idle_b"       //boss领袖
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
  const moveStates = ["Run_Loop","Move_Loop","Run","Move"];

  for(let i=0; i<moveStates.length; i++){
    const stateName = moveStates[i];
    const find = animations.find( (animation: any ) => {
      return animation.name.includes(stateName);
    })
      
    if(find){
      return find.name;
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
      return animation.name.includes(stateName);
    })

    if(find){
      return find.name;
    }
  }

  return;
}

const getTrapIdleAnimation = (key:string, animations: any) => {

  const idleStates = ["Idle","Sleep", "Default"];

  for(let i=0; i<idleStates.length; i++){
    const stateName = idleStates[i];
    const find = animations.find( (animation: any ) => {
      return animation.name.includes(stateName);
    })

    if(find){
      return find.name;
    }
  }

  return;
}

export const getSkelOffset = (enemy:Enemy): Vec2 => {
  const offset = {
    x: 0,
    y: 0
  };

  switch (enemy.key) {
    case "enemy_1321_wdarft":
    case "enemy_1321_wdarft_2":
      offset.y = - 50;
      break;
  }
  return offset;
}

export const getSpineScale = (inst: any): number => {
  // console.log(enemy.name +" : "+ enemy.key)
  const size = spineMap[inst.key]?.size
  return size? size : 0.9;
}

const spineMap = {
  "enemy_1005_yokai":{
    offset: null,
    size: 0.8
  },
  //威龙
  "enemy_1005_yokai_3":{
    offset: null,
    size: 0.65
  },
  "enemy_1112_emppnt":{
    offset: null,
    size: 0.8
  },
  "enemy_1112_emppnt_2":{
    offset: null,
    size: 0.8
  },
  "enemy_1321_wdarft":{
    offset: null,
    size: 1.1
  },
  "enemy_1321_wdarft_2":{
    offset: null,
    size: 1.1
  },
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
  "enemy_1413_mmstck_2" : 0.3
}

export const getAnimationSpeed = (key) => {
  const speed = spineAnimationSpeed[key];
  return speed? speed : 1;
}