const parseTalent = (talentBlackboard: any[]):{ [key: string]: any }  => {
  if(!talentBlackboard) return null;
  
  const talents: { [key: string]: any } = {};
  talentBlackboard?.forEach(item  => {

    const { key, value } = item;
    const keyArr = key.toLowerCase().split(".");

    //key1 天赋种类 key2 天赋细分
    const key1 = keyArr[0];
    const key2 = keyArr[keyArr.length - 1];
    if( !talents[ key1 ]){
      talents[ key1 ] = {};
    }
    talents[ key1 ][ key2 ] = value;
    
  })

  return Object.keys(talents).map(key => {
    return {
      key,
      value: talents[key]
    }
  });
}

const parseSkill = (skills) => {
  const res = [];
  
  skills?.forEach(skill => {
    const skillClone = {...skill};
    skillClone.prefabKey = skillClone.prefabKey.toLowerCase();
    const parsedBlackboard:{[key: string]: number|string} = {};
    if(skill.blackboard){
      skill.blackboard.forEach((item: any) => {
        const {key, value, valueStr} = item;
        if(valueStr === null){
          parsedBlackboard[key] = value;
        }else{
          parsedBlackboard[key] = valueStr;
        }
      })

      skillClone.blackboard = parsedBlackboard;
    }
    res.push(skillClone);
  })

  return res;
}

export {parseTalent, parseSkill}