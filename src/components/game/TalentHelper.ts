const parseTalent = (talentBlackboard: any[]):{ [key: string]: any }  => {
  if(!talentBlackboard) return null;
  
  const talent: { [key: string]: any } = {};
  talentBlackboard?.forEach(item  => {

    const { key, value } = item;
    const keyArr = key.toLowerCase().split(".");

    //key1 天赋种类 key2 天赋细分
    const key1 = keyArr[0];
    const key2 = keyArr[keyArr.length - 1];
    if( !talent[ key1 ]){
      talent[ key1 ] = {};
    }
    talent[ key1 ][ key2 ] = value;
    
  })

  return talent;
}

export {parseTalent}