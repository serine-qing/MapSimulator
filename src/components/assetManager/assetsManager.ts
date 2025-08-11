//spine资产管理类
//单例模式
import spine from "@/assets/script/spine-threejs.js";
import GameConfig from '@/components/utilities/GameConfig';
import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import { parseTexture } from "@/components/game/TextureHelper";
//@ts-ignore
import texture1 from "@/assets/texture/tiles1.png"
import { GC_Add } from "../game/GC";
import { unitizeFbx } from "../game/FbxHelper";


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

  loadStaticTexture(){
    const textures: {[key: string]: THREE.Texture} = {};
    this.loadTexture([texture1]).then(res => {
      textures.texture1 = res[0];
      parseTexture(textures);
    })

  }

  loadTexture(textures: any[]){
    //储存读取的textures
    const resTextures = [];
    textures.forEach(texture => {
      
      resTextures.push(this.textureLoader.load(texture));
    })
    
    const textureOnload = new Promise((resolve , reject)=>{

      const onLoad = this.loadManager.onLoad;
      this.loadManager.onLoad = () => {
        if(onLoad) onLoad();
        resolve(resTextures);
        this.loadManager.onLoad = null;
      };
    })

    this.addPromise(textureOnload);

    return textureOnload;
  }

  //fbx的地址数组
  loadFbx(fbxs: any[]): Promise<any>{
    const urls = fbxs.map(fbx => fbx.url)
    const promiseArr: Promise<any>[] = [];

    urls.forEach(url => {
      const promise = new Promise((resolve , reject) => {
        this.fbxLoader.load( `${GameConfig.BASE_URL}${url}`, 
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

    const meshs: { [key:string]: any}  = {};

    let returnPromise = new Promise((resolve , reject) => {
      fbxOnload.then(res => {
        res.forEach((group, index) => {
          let setObj: THREE.Object3D;
          group.traverse(object => {

            //需要添加到场景中的obj
            if(object.name === fbxs[index].fbxName){
              setObj = object;
            }
            let { material: oldMat } = object
            if(oldMat){
              object.material =  new THREE.MeshMatcapMaterial({
                color: oldMat.color,
                map: oldMat.map
              });

              oldMat.dispose();

            }
          })
          
          GC_Add(setObj);
          //让fbx对象的大小、方向、高度统一化
          unitizeFbx(setObj, fbxs[index].name);

          meshs[fbxs[index].name] = setObj;
        })

        resolve(meshs)
      })
    });

    this.addPromise(fbxOnload);
    
    return returnPromise;
  }

  addPromise(promise: Promise<any>){
    this.allOnload = Promise.all([this.allOnload, promise]);
  }
}

const assetsManager = new AssetsManager();
//texture是静态数据，放这里读取就行
assetsManager.loadStaticTexture();


export default assetsManager;