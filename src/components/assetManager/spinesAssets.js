
//spine资产管理类
import spine from "@/assets/script/spine-threejs.js";

//Vite 独有的功能 支持使用特殊的import.meta.glob函数从文件系统导入多个模块：
const skels = import.meta.glob("@/assets/spine/*.skel")
const atlases = import.meta.glob("@/assets/spine/*.atlas")

const baseUrl = "/src/assets/spine/";
const spinesAssets = new spine.threejs.AssetManager(baseUrl);
//动态批量导入skel和atlas资源
for (const path in skels) {
  const skelName = path.replace(baseUrl,"");
  spinesAssets.loadBinary(skelName);
}
for (const path in atlases) {
  const atlasName = path.replace(baseUrl,"");
  spinesAssets.loadTextureAtlas(atlasName);
}


spinesAssets.loadCompleted = new Promise((resolve , reject)=>{
  const loadSpines = ()=>{
    if (spinesAssets.isLoadingComplete()) {
      resolve();
    } else requestAnimationFrame(loadSpines);
  }
  requestAnimationFrame(loadSpines);
})

export default spinesAssets;