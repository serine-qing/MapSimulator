import Enemy from "../enemy/Enemy";

export const getAnimation = (key: string, animations: any, state: string) => {
  let animation;
  switch (state) {
    case "Move":
      animation = getMoveAnimation(key, animations);
      break;
    case "Idle":
      animation = getIdleAnimation(key, animations);
      break;
  }

  return animation;
}

const getMoveAnimation = (key: string, animations: any) => {
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

const getIdleAnimation = (key: string, animations: any) => {
  const idleStates = ["Idle"];

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
  switch (enemy.motion) {
    case "WALK":
      return {
        x:0, 
        y:-1/4
      }
  
    case "FLY":
      return {
        x:0, 
        y:0
      }
  }
}

export const getSpineSize = (inst: any): number => {
  // console.log(enemy.name +" : "+ enemy.key)
  const size = spineMap[inst.key]?.size
  return size? size : 1;
}

const spineMap = {
  "enemy_1005_yokai":{
    offset: null,
    size: 0.8
  },
  "enemy_1005_yokai_3":{
    offset: null,
    size: 0.7
  },
  "enemy_1112_emppnt_2":{
    offset: null,
    size: 0.8
  },
}