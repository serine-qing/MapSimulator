import request from "./request"

//获取菜单
const getStorys = () => {
  return request.get("/json/storys.json");
}

//根据levelId获取关卡信息
const getStageInfo = (levelId: string) => {
  return request.get( "/levels/" + levelId + ".json" );
}

const getEnemiesData = (enemyRefs: EnemyRef[]) => {
  return request({
    method: "post",
    url: "/enemy/data",
    data: {
      enemyRefs
    }
  })
}

//获取全息作战矩阵runes
const getMatrixRunes = (levelId: string) => {
  return request.get(`/json/CombatMatrix/${levelId}.json`);
}

export { getStorys, getStageInfo, getEnemiesData, getMatrixRunes };