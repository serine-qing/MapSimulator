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

export { getStorys, getStageInfo, getEnemiesData };