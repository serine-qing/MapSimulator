import request from "./request"

const language = localStorage.currentLang || "CN";

//获取菜单
const getStorys = () => {
  return request.get(`/json/story${language}.json`);
}

//根据levelId获取关卡信息
const getStageInfo = (levelId: string) => {
  return request.get( `/levels/${levelId}.json` );
}

const getEnemiesData = (enemyRefs: EnemyRef[]) => {
  return request({
    method: "post",
    url: "/enemy/data",
    data: {
      language,
      enemyRefs
    }
  })
}

//获取全息作战矩阵runes
const getRecalRunes = (levelId: string) => {
  return request({
    method: "post",
    url: "/recalRune/getData",
    data: {
      levelId
    }
  })
}



export { getStorys, getStageInfo, getEnemiesData, getRecalRunes };