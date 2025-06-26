import axios from "axios";
import GameConfig from '@/components/utilities/GameConfig';

// defaults为全局的 axios 默认值
// 设置请求头的文件类型
axios.defaults.headers["Content-Type"] = "application/json; charset=utf-8";

//创建axios实例
const service = axios.create({
  baseURL: GameConfig.BASE_URL,
  timeout: 20000,
});

export default service;
