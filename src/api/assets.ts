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


export { getTrapsKey };