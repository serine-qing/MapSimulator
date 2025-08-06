const parseTalent = (enemyData: EnemyData):{ [key: string]: any }  => {
  const talentBlackboard = enemyData.talentBlackboard;
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

  const res = Object.keys(talents).map(key => {
    return {
      key,
      value: talents[key]
    }
  });
  
  res.forEach(talent => {
    switch (talent.key) {
      case "rush":
        const value = talent.value;
        if(value.trigger_cnt){
          //兼容两种不同的名字
          value.trig_cnt = value.trigger_cnt;
        }
        if(value.predelay_duration){
          value.predelay = value.predelay_duration;
        }


        if(enemyData.key === "enemy_10117_ymggld" || enemyData.key === "enemy_10117_ymggld_2"){ 
          //风遁忍者天赋上限不对 需要额外处理
          value.trig_cnt = 7 / value.move_speed;
        }
        break;
    }
  })
  return res;
}

const parseSkill = (enemyData: EnemyData) => {
  const res = [];
  const skills = enemyData.skills;
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