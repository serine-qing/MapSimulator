import request from "./request"

//获取trap资源名
const getTrapsKey = (keys) => {
  return request({
    method: "post",
    url: "/assets/getTrapsKey",
    data: {
      keys
    }
  })
}

//获取可使用的装置图标
const getTokenCards = (keys) => {
  return request({
    method: "post",
    url: "/assets/getTokenCards",
    data: {
      keys
    }
  })
}

//获取敌人skel名
const getSpinesKey = (keys) => {
  return request({
    method: "post",
    url: "/assets/getSpinesKey",
    data: {
      keys
    }
  })
} 

export { getTrapsKey, getTokenCards, getSpinesKey };