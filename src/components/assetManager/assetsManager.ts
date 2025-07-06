//spine资产管理类
//单例模式
import spine from "@/assets/script/spine-threejs.js";
import GameConfig from '@/components/utilities/GameConfig';
import * as THREE from "three"

import { parseTexture } from "@/components/game/TextureHelper";

import texture1 from "@/assets/texture/tile1.png"
import texture2 from "@/assets/texture/tile2.png"


class AssetsManager{

  public textureOnload: Promise<any>;

  public spineManager: any;
  public loadManager: THREE.LoadingManager;
  public textureLoader: THREE.TextureLoader;

  constructor(){
    this.spineManager = new spine.threejs.AssetManager( GameConfig.BASE_URL + "spine/");

    this.loadManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loadManager);

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

  loadTexture(){
    const textures: {[key: string]: THREE.Texture} = {};
    textures.texture1 = this.textureLoader.load(texture1);
    textures.texture2 = this.textureLoader.load(texture2);

    this.textureOnload = new Promise((resolve , reject)=>{
      this.loadManager.onLoad = () => {
        parseTexture(textures);
        resolve(0);
      };
    })

  }

}

const assetsManager = new AssetsManager();
//texture是静态数据，放这里读取就行
assetsManager.loadTexture();


export default assetsManager;