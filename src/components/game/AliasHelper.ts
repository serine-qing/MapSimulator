//方舟很多key有几个名字，这里集中处理
const AliasMap = {
  checkPointType: {
    0: "MOVE",
    1: "WAIT_FOR_SECONDS",
    2: "WAIT_FOR_PLAY_TIME",
    3: "WAIT_CURRENT_FRAGMENT_TIME",
    4: "WAIT_CURRENT_WAVE_TIME",
    5: "DISAPPEAR",
    6: "APPEAR_AT_POS",
    7: "ALERT",
    8: "PATROL_MOVE",
    9: "WAIT_BOSSRUSH_WAVE"
  },
  motionMode: {
    0: "WALK",
    1: "FLY",
  },
  passableMask: {
    2: "FLY_ONLY",
    3: "ALL",
  },
  heightType:{
    0: "LOWLAND",
    1: "HIGHLAND",
  },
  buildableType:{
    0: "NONE",
    1: "MELEE",
    2: "RANGED",
    3: "ALL",
  },
  predefDirection:{
    0: "UP",
    1: "RIGHT",
    2: "DOWN",
    3: "LEFT",
  },
  actionType:{
    0: "SPAWN",
    6: "ACTIVATE_PREDEFINED"
  },
  levelType:{
    0: "NORMAL",
    1: "ELITE",
    2: "BOSS",
  },
  applyWay:{
    0: "NONE",
    1: "MELEE",
    2: "RANGED",
    3: "ALL",
  }
}
const AliasHelper = (key, type) => {
  if(typeof key === "number"){
    const alias = AliasMap[type][key];
    return alias? alias : key;
  }
  return key;
}

export default AliasHelper;

