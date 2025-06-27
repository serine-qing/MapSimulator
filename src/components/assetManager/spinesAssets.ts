//spine资产管理类
import spine from "@/assets/script/spine-threejs.js";
import GameConfig from '@/components/utilities/GameConfig';

class AssetsManager{

  public spineManager: any;

  constructor(){
    this.spineManager = new spine.threejs.AssetManager( GameConfig.BASE_URL + "spine/")
  }

  loadSpines( spineNames: string[] ){
    //动态批量导入skel和atlas资源
    spineNames.forEach( name => {
      const sName = name.replace("enemy_", "");
      const skelName =sName + "/" + name + ".skel";
      const atlasName =sName + "/" + name + ".atlas";
      // console.log(skelName)
      this.spineManager.loadBinary(skelName);
      this.spineManager.loadTextureAtlas(atlasName);
    })

    return new Promise((resolve , reject)=>{
      const loadSpines = ()=>{
        if (this.spineManager.isLoadingComplete()) {
          resolve(0);
        } else requestAnimationFrame(loadSpines);
      }
      requestAnimationFrame(loadSpines);
    })
  }
}

export default AssetsManager;