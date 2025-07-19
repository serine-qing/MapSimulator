import {RowColToVec2} from "@/components/utilities/utilities"
import RunesHelper from "./RunesHelper";
import MapTiles from "./MapTiles"
import {getEnemiesData} from "@/api/stages"
import AliasHelper from "./AliasHelper";
import spine from "@/assets/script/spine-threejs.js";
import { getAnimation } from "@/components/utilities/SpineHelper"
import GameConfig from "../utilities/GameConfig";
//资源一开始就加载完毕，所以放到这里处理
import assetsManager from "@/components/assetManager/assetsManager"
import * as THREE from "three"
import { unitizeFbx  } from "./FbxHelper";

import { getTrapsKey } from "@/api/assets";
import { GC_Add } from "./GC";
import { parseTalent } from "./TalentHelper";
import SPFA from "./SPFA";
import Trap from "./Trap";

//对地图json进行数据处理
//保证这个类里面都是不会更改的纯数据，因为整个生命周期里面只会调用一次
class MapModel{
  private sourceData: any;
  private runesHelper: RunesHelper;

  public mapTiles: MapTiles; //地图tiles
  public trapDatas: trapData[] = [];
  public traps: Trap[] = []; //地图装置
  public enemyWaves: EnemyWave[][] = [];
  public enemyDatas: EnemyData[] = [];
  public enemyRoutes: EnemyRoute[] = [];


  public SPFA: SPFA;  //寻路对象
  constructor(data: any){
    this.sourceData = data;
    // console.log(this.enemyRoutes)
  }

  //异步数据，需要在实例化的时候手动调用
  public async init(){

    this.getRunes();
    //解析地图
    this.mapTiles = new MapTiles(this.sourceData.mapData);

    //获取trap数据
    await this.getTrapDatas();

    this.initTraps();
    //解析敌人路径
    this.parseEnemyRoutes();

    //解析波次数据
    this.parseEnemyWaves(this.sourceData.waves)

    await this.initEnemyData(this.sourceData.enemyDbRefs);

    //获取敌人spine
    this.getEnemySpines();

    //绑定route和enemydata
    this.enemyWaves.flat().forEach( wave => {
      //route可能为null
      const findRoute: EnemyRoute = this.enemyRoutes.find( route => route.index === wave.routeIndex );
      const findEnemyData = this.enemyDatas.find(e => e.waveKey === wave.key);

      if(findRoute) wave.route = findRoute;
      if(findEnemyData) wave.enemyData = findEnemyData;
    })
    
    this.SPFA = new SPFA(this.mapTiles, this.enemyRoutes);

    this.sourceData = null;
  }

  private async getTrapDatas(){
    const tokenInsts = this.sourceData.predefines?.tokenInsts;

    if(tokenInsts){
      const trapKeys:Set<string> = new Set();

      tokenInsts.forEach(data => {
        const {direction, position, inst, mainSkillLvl} = data;

        this.trapDatas.push({
          key: inst.characterKey,
          direction: AliasHelper(direction, "predefDirection"),
          position: RowColToVec2(position),
          mainSkillLvl
        });

        trapKeys.add(inst.characterKey);
      })
      
      const res = await getTrapsKey(Array.from(trapKeys));

      const { fbx: fbxs, spine: spines, image: images } = res.data;

      if(fbxs){
        const meshs: { [key:string]: any}  = {};
        assetsManager.loadFbx( fbxs ).then(res => {
          res.forEach((group, index) => {

            let setObj: THREE.Object3D;
            group.traverse(object => {

              //需要添加到场景中的obj
              if(object.name === fbxs[index].fbx){
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

          this.trapDatas.forEach( trapData => {
            trapData.mesh = meshs[trapData.key];
          })

        })
      }
      if(spines){
        const skelDatas: { [key:string]: any} = {};
        const skelNames = [];
        const atlasNames = [];

        spines.forEach(spine => {
          const { skel, atlas } = spine;
          skelNames.push(`trap/spine/${skel}/${skel}.skel`);
          atlasNames.push(`trap/spine/${atlas}/${atlas}.atlas`);
        })

        assetsManager.loadSpines(skelNames, atlasNames).then( () => {

          const spineManager = assetsManager.spineManager;
          for (let i = 0; i< skelNames.length; i++){
            const key = spines[i].skel;
            const skelName = skelNames[i];
            const atlasName = atlasNames[i];
          
            const atlas = spineManager.get(atlasName);
            const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
            const skeletonJson = new spine.SkeletonBinary(atlasLoader);
            skeletonJson.scale = 0.019;

            const skeletonData = skeletonJson.readSkeletonData(
              spineManager.get(skelName)
            );
            
            skelDatas[key] = skeletonData;
          }

          spines.forEach(spine => {
            const skelData = skelDatas[spine.name];

            this.trapDatas.forEach(trapData => {
              
              if(trapData.key === spine.name){
                trapData.skeletonData = skelData;
                const idleAnimate = getAnimation(trapData.key, skelData.animations, "Trap_Idle");
                trapData.idleAnimate = idleAnimate;
              }
            })

          
          })

        })

      }
      if(images){
        const textureReq = [];
        images.forEach(texture => {
          textureReq.push(`${GameConfig.BASE_URL}trap/image/${texture.image}.png`)
        })

        const textureMats = {};
        assetsManager.loadTexture(textureReq).then((res:THREE.Texture[]) => {

          res.forEach((texture, index) => {
            const currentImage = images[index];

            const textureMat = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true
            })
            GC_Add(textureMat);
            textureMats[currentImage.name] = textureMat;

          })

          this.trapDatas.forEach(trapData => {
            trapData.textureMat = textureMats[trapData.key];
          })
        });

      }
    }

  }

  private initTraps(){
    this.trapDatas.forEach(trapData => {
      const trap = new Trap(trapData);
      this.traps.push(trap);
    });

    this.mapTiles.bindTraps(this.traps);
  }

  private getRunes(){
    //"difficultyMask": 1和NORMAL是普通  2和FOUR_STAR是突袭  3和ALL是全部生效
    
    const runesData = [];
    this.sourceData.runes?.forEach( rune => {
      const difficultyMask = rune.difficultyMask;

      if(
        ( this.sourceData.challenge && ( difficultyMask ===  1 || difficultyMask === "NORMAL" ) ) ||
        ( !this.sourceData.challenge && ( difficultyMask ===  2 || difficultyMask === "FOUR_STAR" ) ) 
      ) return;
      runesData.push(rune);
    })
    this.runesHelper = new RunesHelper(runesData);
  }


  //解析波次
  private parseEnemyWaves(waves: any[]){ 

    //waves:大波次(对应关卡检查点) fragments:中波次 actions:小波次
    waves.forEach((wave: any) => {

      //有时候会有空的wave 例如圣徒boss战
      if(wave.fragments.length === 0) return;

      let currentTime = 0;
      
      const innerWaves: EnemyWave[] = [];
      currentTime += wave.preDelay;
      let waveTime = currentTime;
      wave.fragments.forEach((fragment: any) => {
        
        currentTime += fragment.preDelay;
        let fragmentTime = currentTime;
        let lastTime = currentTime;//action波次的最后一只怪出现时间

        fragment.actions.forEach((action: any) =>{
          for(let i=0; i<action.count; i++){
            //检查敌人分组
            const check = this.runesHelper.checkEnemyGroup(action.hiddenGroup);

            if(!check) return;

            let startTime = currentTime + action.preDelay + action.interval*i;
            lastTime = Math.max(lastTime, startTime);
            
            //"actionType": "DISPLAY_ENEMY_INFO"这个显示敌人信息的action
            //虽然不会加入波次里面，但是该算的preDelay还是要算的
            //有SPAWN和数字0两种
            if(action.actionType !== "SPAWN" && action.actionType !== 0) return;

            let eWave: EnemyWave = {
              actionType: action.actionType,
              key: this.runesHelper.checkEnemyChange( action.key ),
              routeIndex : action.routeIndex,
              startTime,
              fragmentTime,
              waveTime,
              hiddenGroup: action.hiddenGroup
            }

            innerWaves.push(eWave);

          }
        })

        currentTime = lastTime;

      })
      
      innerWaves.sort((a, b)=>{
        return a.startTime - b.startTime;
      })

      this.enemyWaves.push(innerWaves);
      currentTime += wave.postDelay;
    });
    
  }

  //解析敌人路径
  private parseEnemyRoutes(){
    let routeIndex = 0;
    this.sourceData.routes.forEach( (sourceRoute: any) =>{

      //某些敌人(例如提示)没有路径route，所以会出现null，做下兼容处理
      //E_NUM不算进敌人路径内，例如"actionType": "DISPLAY_ENEMY_INFO"这个显示敌人信息的action
      if(sourceRoute && sourceRoute.motionMode !== "E_NUM") {

        const route: EnemyRoute = {
          index: routeIndex,
          allowDiagonalMove: sourceRoute.allowDiagonalMove,  //是否允许斜角路径
          startPosition: RowColToVec2(sourceRoute.startPosition),
          motionMode: AliasHelper(sourceRoute.motionMode, "motionMode"),
          spawnOffset: sourceRoute.spawnOffset,
          spawnRandomRange: sourceRoute.spawnRandomRange,
          checkpoints: []
        }
        
        sourceRoute.checkpoints.forEach((cp: any) => {
          const checkpoint: CheckPoint = {
            type: AliasHelper(cp.type, "checkPointType"),
            position: RowColToVec2(cp.position),
            time: cp.time,
            reachOffset: cp.reachOffset,
            randomizeReachOffset: cp.randomizeReachOffset
          }
          route.checkpoints.push(checkpoint);
        })

        let endPosition = RowColToVec2(sourceRoute.endPosition);
        //将结束点作为最终检查点放入检查点数组里面
        route.checkpoints.push({
          type: "MOVE",
          position: endPosition,
          time: 0,
          reachOffset:{x:0, y:0},
          randomizeReachOffset: false
        })

        this.enemyRoutes.push(route);
      }
      routeIndex ++;
    })

  }


  /**
   * 初始化敌人数据
   * @param {*} enemyDatas 数据库中的敌人数据
   * @param {*} enemyDbRefs 地图JSON中的敌人引用
   */
  private async initEnemyData(enemyDbRefs: EnemyRef[]){

    const waves = this.enemyWaves.flat();
    const enemyDataKeys = ["description","levelType","name","applyWay", "rangeRadius","motion"];

    //波次中会出现的敌人对应的enemyDbRef数组
    //使用Set防止重复
    const enemies: Set<EnemyRef>  = new Set();
    //波次中会出现的魔改后的额外敌人
    const extraEnemies: EnemyRef[] = [];

    enemyDbRefs.forEach((enemyRef: EnemyRef) => {
      const prefabKey = enemyRef.overwrittenData?.prefabKey;
      let toAdd: EnemyRef = enemyRef;

      if(waves.find(wave => wave.key === enemyRef.id) !== undefined){

        if(prefabKey?.m_defined){
          toAdd = enemyDbRefs.find(ref => ref.id === prefabKey.m_value);
          extraEnemies.push(enemyRef);
        }

        enemies.add(toAdd)
      }
    })

    const enemyRefReq = Array.from(enemies).filter((enemyRef: EnemyRef) => enemyRef.useDb);
    const res: any = await getEnemiesData( enemyRefReq );
    const enemyDatas = res.data.EnemyDatas;

    enemies.forEach((enemyDbRef: EnemyRef) => {

      let enemyData = enemyDatas.find(enemyData => enemyData.key === enemyDbRef.id);
      if(!enemyData) return;

      const overwrittenData = enemyDbRef.overwrittenData;
      
      if(overwrittenData){
        
        if(!enemyData) {
          enemyData = {};
          this.enemyDatas.push(enemyData);
        }

        enemyDataKeys.forEach(key =>{
          if(overwrittenData[key]?.m_defined){
            enemyData[key] = overwrittenData[key].m_value;
          }
        })

        //覆盖属性
        Object.keys(overwrittenData["attributes"]).forEach(key => {
          const attr = overwrittenData["attributes"][key];
          if(attr.m_defined){
            enemyData["attributes"][key] = attr.m_value;
          }
        })

        //覆盖天赋
        overwrittenData.talentBlackboard?.forEach(talent => {
          const {key , value, valueStr} = talent;
          const find = enemyData.talentBlackboard?.find(t => t.key === key);
          if(find){
            find.value = value === null ? valueStr : value;
          }else{
            if(!enemyData.talentBlackboard) enemyData.talentBlackboard = [];
            enemyData.talentBlackboard.push(talent);
          }
        })
      }
      
      enemyData.waveKey = enemyData.key;
      enemyData.icon = GameConfig.BASE_URL + "enemy_icon/" + enemyData.key + ".png";

      this.runesHelper.checkEnemyAttribute(enemyData["attributes"]);

      enemyData.talents = parseTalent(enemyData.talentBlackboard);
    })
    

    //关卡魔改后的敌人
    extraEnemies.forEach((enemyDbRef: EnemyRef) => {

      const overwrittenData = enemyDbRef?.overwrittenData;
      const extraKey = overwrittenData.prefabKey.m_value;

      const baseEnemy: EnemyData = enemyDatas.find(e => e.key === extraKey);

      const extraEnemy = { ...baseEnemy };

      extraEnemy.attributes = {...baseEnemy.attributes};
      extraEnemy.waveKey = enemyDbRef.id;

      enemyDataKeys.forEach(k => {
        if(overwrittenData[k].m_defined){
          extraEnemy[k] = overwrittenData[k].m_value;
        }
      });

      Object.keys(overwrittenData["attributes"]).forEach(key => {
        const attr = overwrittenData["attributes"][key];
        if(attr.m_defined){
          extraEnemy["attributes"][key] = attr.m_value;
        }
      })

      enemyDatas.push(extraEnemy);

    })


    this.enemyDatas = enemyDatas;
  }

  private async getEnemySpines(){

    const skelNames = [];
    const atlasNames = [];
    this.enemyDatas.forEach(data => {
      const sName = data.key.replace("enemy_", "");
      const skelName = `spine/${sName}/${data.key}.skel`;
      const atlasName = `spine/${sName}/${data.key}.atlas`;
      data.skelUrl = skelName;
      data.atlasUrl = atlasName;

      skelNames.push(skelName);
      atlasNames.push(atlasName);
    });

    //设置敌人spine
    await assetsManager.loadSpines(skelNames, atlasNames);
    const spineManager = assetsManager.spineManager;
    this.enemyDatas.forEach(data => {
      const {key} = data;

      const atlasName = data.atlasUrl;
      const skelName = data.skelUrl;
  
      //使用AssetManager中的name.atlas和name.png加载纹理图集。
      //传递给TextureAtlas的函数用于解析相对路径。
      const atlas = spineManager.get(atlasName);
  
      //创建一个AtlasAttachmentLoader，用于解析区域、网格、边界框和路径附件
      const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
      //创建一个SkeletonJson实例来解析文件
      const skeletonJson = new spine.SkeletonBinary(atlasLoader);
      //设置在解析过程中应用的比例，解析文件，并创建新的骨架。
      skeletonJson.scale = 0.019;
      const skeletonData = skeletonJson.readSkeletonData(
        spineManager.get(skelName)
      );

      const moveAnimate = getAnimation(key, skeletonData.animations, "Move");
      const idleAnimate = getAnimation(key, skeletonData.animations, "Idle");

      data.skeletonData = skeletonData;
      data.moveAnimate = moveAnimate;
      data.idleAnimate = idleAnimate;
    })

  }

}

export default MapModel;