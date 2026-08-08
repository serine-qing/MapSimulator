import request from "./request"

const recognizeImage = (image: string) => {
  return request({
    method: "post",
    url: "/ocr/recognize",
    data: { image }
  })
}

export { recognizeImage }