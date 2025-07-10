//spine资产管理类
//单例模式
import spine from "@/assets/script/spine-threejs.js";
import GameConfig from '@/components/utilities/GameConfig';
import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import { parseTexture } from "@/components/game/TextureHelper";
//@ts-ignore
import texture1 from "@/assets/texture/tiles1.png"


class AssetsManager{
  public allOnload: Promise<any>;

  public spineManager: any;
  public loadManager: THREE.LoadingManager;
  public textureLoader: THREE.TextureLoader;
  public fbxLoader: FBXLoader;

  constructor(){
    this.spineManager = new spine.threejs.AssetManager( GameConfig.BASE_URL );

    this.loadManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loadManager);

    this.fbxLoader = new FBXLoader();
  }

  loadSpines( skelNames: string[], atlasNames: string[] ){
    //动态批量导入skel和atlas资源
    skelNames.forEach( name => {
      this.spineManager.loadBinary(name);
    })
    atlasNames.forEach( name => {
      this.spineManager.loadTextureAtlas(name);
    })

    const spineOnload = new Promise((resolve , reject) => {
      const loadSpines = ()=>{
        if (this.spineManager.isLoadingComplete()) {
          resolve(0);
        } else requestAnimationFrame(loadSpines);
      }
      requestAnimationFrame(loadSpines);
    });

    this.addPromise(spineOnload);

    return spineOnload;
  }

  loadTexture(){
    const textures: {[key: string]: THREE.Texture} = {};
    textures.texture1 = this.textureLoader.load(texture1);
    const textureOnload = new Promise((resolve , reject)=>{
      this.loadManager.onLoad = () => {
        parseTexture(textures);
        resolve(0);
      };
    })

    this.addPromise(textureOnload);
  }

  loadFbx(fbxs: any[]): Promise<any>{
    const promiseArr: Promise<any>[] = [];

    fbxs.forEach(fbx => {
      const { name, fbx: fbxName} = fbx;
      const promise = new Promise((resolve , reject) => {
        this.fbxLoader.load( `${GameConfig.BASE_URL}trap/fbx/${name}/${fbxName}.fbx`, 
          (object) => {
            resolve(object);
          },
          null,
          (error) => {
            console.log(error);
            reject(error);
          }
        )
      })

      promiseArr.push(promise);
    })
    const fbxOnload = Promise.all(promiseArr);
    this.addPromise(fbxOnload);
    
    return fbxOnload;
  }

  addPromise(promise: Promise<any>){
    this.allOnload = Promise.all([this.allOnload, promise]);
  }
}

const assetsManager = new AssetsManager();
//texture是静态数据，放这里读取就行
assetsManager.loadTexture();


export default assetsManager;