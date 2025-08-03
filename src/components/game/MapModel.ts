import {RowColToVec2} from "@/components/utilities/utilities"
import RunesHelper from "./RunesHelper";
import TileManager from "./TileManager"
import {getEnemiesData} from "@/api/stages"
import AliasHelper from "./AliasHelper";
import spine from "@/assets/script/spine-threejs.js";
import { getAnimation } from "@/components/utilities/SpineHelper"
import GameConfig from "../utilities/GameConfig";
//资源一开始就加载完毕，所以放到这里处理
import assetsManager from "@/components/assetManager/assetsManager"
import * as THREE from "three"
import { unitizeFbx  } from "./FbxHelper";

import { getTrapsKey, getSpinesKey, getTokenCards } from "@/api/assets";
import { GC_Add } from "./GC";
import { parseSkill, parseTalent } from "./SkillHelper";
import SPFA from "./SPFA";
import TokenCard from "./TokenCard";
import { immuneTable } from "../utilities/Interface";

//对地图json进行数据处理
//保证这个类里面都是不会更改的纯数据，因为整个生命周期里面只会调用一次
class MapModel{
  private sourceData: any;
  public runesHelper: RunesHelper;

  public tileManager: TileManager; //地图tiles
  public tokenCards: any[] = [];
  public trapDatas: trapData[] = [];

  public actionDatas: ActionData[][] = [];
  public brancheDatas = [];

  public enemyDatas: EnemyData[] = [];

  public routes: EnemyRoute[] = [];
  public extraRoutes: EnemyRoute[] = [];

  public SPFA: SPFA;  //寻路对象
  constructor(data: any){
    this.sourceData = data;
  }

  //异步数据，需要在实例化的时候手动调用
  public async init(){

    this.getRunes();

    this.tileManager = new TileManager(this.sourceData.mapData);
    this.runesHelper.checkBannedTiles(this.tileManager);
    
    //获取可使用的装置图标
    await this.getTokenCards();
    //获取trap数据
    await this.getTrapDatas();
    
    //解析敌人路径
    this.routes = this.parseEnemyRoutes(this.sourceData.routes);
    this.extraRoutes = this.parseEnemyRoutes(this.sourceData.extraRoutes);

    //解析波次数据
    this.parseWaves(this.sourceData.waves);
    this.parseBranch(this.sourceData.branches);

    await this.initEnemyData(this.sourceData.enemyDbRefs);
    //获取哪些敌人的spine是可用的
    const spineUrls = await this.getEnemySpineUrls();
    //获取敌人spine
    await this.getEnemySpines(spineUrls);

    //绑定route和enemydata 或trap
    this.actionDatas.flat().forEach( wave => {
      //route可能为null
      const findRoute: EnemyRoute = this.routes.find( route => route.index === wave.routeIndex );
      let findEnemyData: EnemyData;
      let findTrap: trapData;
      switch (wave.actionType) {
        case "SPAWN":
          findEnemyData = this.enemyDatas.find(e => e.waveKey === wave.key);
          break;
      
        case "ACTIVATE_PREDEFINED":
          findTrap = this.trapDatas.find(data => data.alias === wave.key);
          break;
      }
      

      if(findRoute) wave.route = findRoute;
      if(findEnemyData) {
        wave.enemyData = findEnemyData
        findEnemyData.count ++;
      }else if(findTrap){
        //wave中的trap是指名道姓的实体
        wave.trapData = findTrap;
      }
    })
    
    this.SPFA = new SPFA(this.tileManager, this.routes);

    this.sourceData = null;

  }

  private async getTokenCards(){

    const tokenCards = this.sourceData.predefines?.tokenCards;
    if(tokenCards){

      tokenCards.forEach(tokenCard => {
        //障碍物
        if(tokenCard.inst.characterKey === "trap_001_crate"){
          this.tokenCards.push({
            initialCnt: tokenCard.initialCnt,
            hidden: tokenCard.hidden,
            alias: tokenCard.alias,
            characterKey: tokenCard.inst.characterKey,
            level: tokenCard.inst.level,
            mainSkillLvl: tokenCard.mainSkillLvl,
            cost: 5,
            respawntime: 5
          });
        }
      })
      
      const keys = this.tokenCards.map(tokenCard => tokenCard.characterKey);
      const res = await getTokenCards(keys);
      
      const urls = [];
      res.data?.forEach(item => {
        const find = this.tokenCards.find(tokenCard => tokenCard.characterKey === item.name);
        if(find){
          find.url = `${GameConfig.BASE_URL}trap/image/${item.image}.png`;
          urls.push(find.url);
        }
      })

      if(urls.length > 0){
        assetsManager.loadTexture(urls).then((res: THREE.Texture[]) => {
          for(let i = 0; i < this.tokenCards.length; i++){
            this.tokenCards[i].texture = res[i];
          }
        })
      }
    }
    
  }

  private async getTrapDatas(){
    const tokenInsts = this.sourceData.predefines?.tokenInsts;
    
    this.runesHelper.checkPredefines(tokenInsts);
    if(tokenInsts){

      const trapKeys:Set<string> = new Set();

      tokenInsts.forEach(data => {
        const {alias, direction, hidden, position, inst, mainSkillLvl} = data;
        let key;

        switch (inst.characterKey) {
          //天桩需要从enemyDbRefs获取种类
          case "trap_146_dhdcr":
            const find = this.sourceData.enemyDbRefs.find(ref => {
              return ref.id.includes("enemy_1398_dhdcr")
            })

            key = find.id;
            break;
          default:
            key = inst.characterKey;
            break;

        }

        this.trapDatas.push({
          isTokenCard: false,
          alias,
          key,
          hidden,
          direction: AliasHelper(direction, "predefDirection"),
          position: RowColToVec2(position),
          mainSkillLvl
        });

        trapKeys.add(key);
      })

      this.tokenCards.forEach(tokenCard => {
        const trapData = {
          isTokenCard: true,
          alias: tokenCard.alias,
          key: tokenCard.characterKey,
          hidden: tokenCard.hidden,
          direction: "UP",
          position: null,
          mainSkillLvl: tokenCard.mainSkillLvl
        };
        this.trapDatas.push(trapData);

        tokenCard.trapData = trapData;
        trapKeys.add(tokenCard.characterKey);
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
  private parseWaves(waves: any[]){ 
    //waves:大波次(对应关卡检查点) fragments:中波次 actions:小波次
    waves.forEach((wave: any) => {

      //有时候会有空的wave 例如圣徒boss战
      if(wave.fragments.length === 0) return;

      let currentTime = wave.preDelay;
      
      const innerWaves = this.parseActions(wave.fragments, currentTime)
      
      this.actionDatas.push(innerWaves);

      //todo postDelay实际上没应用
      currentTime += wave.postDelay;
    });
    
  }

  //额外出怪
  private parseBranch(branches){
    if(branches){
      Object.keys(branches).forEach(key => {
        const fragments = branches[key].phases;
        const innerWaves = this.parseActions(fragments, 0);
        this.brancheDatas.push({
          key, actions: innerWaves
        })
      })

      console.log(this.brancheDatas)
    }

  }

  private parseActions(fragments: any, currentTime: number): ActionData[]{

    const innerWaves: ActionData[] = [];

    fragments.forEach((fragment: any) => { 
        
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
          action.actionType = AliasHelper(action.actionType, "actionType");

          //"actionType": "DISPLAY_ENEMY_INFO"这个显示敌人信息的action
          //虽然不会加入波次里面，但是该算的preDelay还是要算的
          let actionKey;
          switch (action.actionType) {
            case "SPAWN":
              actionKey = this.runesHelper.checkEnemyChange( action.key );
              break;
            case "ACTIVATE_PREDEFINED": //激活装置
              actionKey = action.key;
              break;
          }
          
          if(actionKey){
            let eAction: ActionData = {
              actionType: action.actionType,
              key: actionKey,
              routeIndex : action.routeIndex,
              startTime,
              fragmentTime,
              dontBlockWave: action.dontBlockWave,
              blockFragment: action.blockFragment,
              hiddenGroup: action.hiddenGroup
            }

            innerWaves.push(eAction);
          }
        }
      })

      currentTime = lastTime;

    })

    innerWaves.sort((a, b)=>{
      return a.startTime - b.startTime;
    })

    return innerWaves;
  }

  //解析敌人路径
  private parseEnemyRoutes(source){
    let routeIndex = 0;
    const routes = [];
    source.forEach( (sourceRoute: any) =>{

      //某些敌人(例如提示)没有路径route，所以会出现null，做下兼容处理
      //E_NUM不算进敌人路径内，例如"actionType": "DISPLAY_ENEMY_INFO"这个显示敌人信息的action
      if(sourceRoute && sourceRoute.motionMode !== "E_NUM") {

        const route: EnemyRoute = {
          index: routeIndex,
          allowDiagonalMove: sourceRoute.allowDiagonalMove,  //是否允许斜角路径
          startPosition: RowColToVec2(sourceRoute.startPosition),
          endPosition: RowColToVec2(sourceRoute.endPosition),
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

        routes.push(route);
      }
      routeIndex ++;
    })

    return routes;
  }

  //覆盖数据
  private overwriteData(rawData, overwrittenData){
    Object.keys(rawData).forEach(key => {
      if(key === "name" || key === "description") return;
      if(overwrittenData[key]?.m_defined){
        rawData[key] = overwrittenData[key].m_value;
      }
    })

    //覆盖属性
    Object.keys(overwrittenData["attributes"]).forEach(key => {
      const attr = overwrittenData["attributes"][key];
      if(attr.m_defined){
        rawData["attributes"][key] = attr.m_value;
      }
    })

    
    //覆盖天赋
    overwrittenData.talentBlackboard?.forEach(talent => {
      const {key , value, valueStr} = talent;
      const find = rawData.talentBlackboard?.find(t => t.key === key);
      if(find){
        if(value === null){
          find.valueStr = valueStr;
        }else{
          find.value = value;
        }
      }else{
        if(!rawData.talentBlackboard) rawData.talentBlackboard = [];
        rawData.talentBlackboard.push({...talent});
      }
    })

    //覆盖技能
    overwrittenData.skills?.forEach(skill => {
      const index = rawData.skills.findIndex(findSkill => findSkill.prefabKey === skill.prefabKey);
      if(index > -1){
        rawData.skills[index] = skill;
      }
    })
  }

  /**
   * 初始化敌人数据
   * @param {*} enemyDatas 数据库中的敌人数据
   * @param {*} enemyDbRefs 地图JSON中的敌人引用
   */
  private async initEnemyData(enemyDbRefs: EnemyRef[]){

    const waves = this.actionDatas.flat();

    //波次中会出现的敌人对应的enemyDbRef数组
    //使用Set防止重复
    const enemies: Set<EnemyRef>  = new Set();
    //波次中会出现的魔改后的额外敌人
    const extraEnemies: EnemyRef[] = [];

    enemyDbRefs.forEach((enemyRef: EnemyRef) => {
      const prefabKey = enemyRef.overwrittenData?.prefabKey;
      let toAdd: EnemyRef = enemyRef;

      if(prefabKey?.m_defined){
        toAdd = enemyDbRefs.find(ref => ref.id === prefabKey.m_value);
        extraEnemies.push(enemyRef);
      }

      enemies.add(toAdd)
      
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

        this.overwriteData(enemyData, overwrittenData);
      }
      
      enemyData.waveKey = enemyData.key;
      enemyData.icon = GameConfig.BASE_URL + "enemy_icon/" + enemyData.key + ".png";
      
      enemyData.count = 0;

    })
    

    //关卡魔改后的敌人
    extraEnemies.forEach((enemyDbRef: EnemyRef) => {

      const overwrittenData = enemyDbRef?.overwrittenData;
      const extraKey = overwrittenData.prefabKey.m_value;

      const baseEnemy: EnemyData = enemyDatas.find(e => e.key === extraKey);

      const extraEnemy = { ...baseEnemy };
      const { attributes, talentBlackboard } = baseEnemy;

      //深拷贝
      extraEnemy.attributes = {...attributes};

      if(talentBlackboard){
        extraEnemy.talentBlackboard = [...talentBlackboard];
        talentBlackboard.forEach((talent, index) => {
          extraEnemy.talentBlackboard[index] = {...talent};
        })
      }

      extraEnemy.waveKey = enemyDbRef.id;

      this.overwriteData(extraEnemy, overwrittenData);

      enemyDatas.push(extraEnemy);

    })

    enemyDatas.forEach(enemyData => {
      enemyData.motion = AliasHelper(enemyData.motion, "motionMode");
      enemyData.levelType = AliasHelper(enemyData.levelType, "levelType");
      enemyData.applyWay = AliasHelper(enemyData.applyWay, "applyWay");
      enemyData.talents = parseTalent(enemyData);
      enemyData.skills = parseSkill(enemyData); 

      enemyData.immunes = [];
      //异常抗性
      Object.keys(immuneTable).forEach(immuneKey => {
        if(enemyData.attributes[immuneKey]){
          enemyData.immunes.push(immuneKey);
        }
      })
      
      this.runesHelper.checkEnemyAttribute(enemyData);
    })

    this.enemyDatas = enemyDatas;
  }

  private async getEnemySpineUrls(){
    const sNames = this.enemyDatas.map(data => data.key.replace("enemy_", ""));
    const res = await getSpinesKey(sNames);
    return res.data;
  }

  private async getEnemySpines(spineUrls){

    const urls = [];
    const skelNames = [];
    const atlasNames = [];
    Object.keys(spineUrls).forEach(key => {
      const val = spineUrls[key];
      const { skel, atlas } = val;

      const skelUrl = `spine/${key}/${skel}`;
      const atlasUrl = `spine/${key}/${atlas}`;
      urls.push({
        key, skelUrl, atlasUrl
      })
      skelNames.push(skelUrl);
      atlasNames.push(atlasUrl);
    })

    //设置敌人spine
    await assetsManager.loadSpines(skelNames, atlasNames);
    const spineManager = assetsManager.spineManager;
    this.enemyDatas.forEach(data => {
      const {key} = data;
      const find = urls.find(url => url.key === key.replace("enemy_", ""));
      if(find){

        const {atlasUrl, skelUrl} = find;
        //使用AssetManager中的name.atlas和name.png加载纹理图集。
        //传递给TextureAtlas的函数用于解析相对路径。
        const atlas = spineManager.get(atlasUrl);

        //创建一个AtlasAttachmentLoader，用于解析区域、网格、边界框和路径附件
        const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
        //创建一个SkeletonJson实例来解析文件
        const skeletonJson = new spine.SkeletonBinary(atlasLoader);
        //设置在解析过程中应用的比例，解析文件，并创建新的骨架。
        skeletonJson.scale = 0.019;
        const skeletonData = skeletonJson.readSkeletonData(
          spineManager.get(skelUrl)
        );

        const moveAnimate = getAnimation(key, skeletonData.animations, "Move");
        const idleAnimate = getAnimation(key, skeletonData.animations, "Idle");

        data.skeletonData = skeletonData;
        data.moveAnimate = moveAnimate;
        data.idleAnimate = idleAnimate;
        data.animations = data.skeletonData.animations.map( animation => {
          return {
            duration: animation.duration,
            name: animation.name
          }
        });
      }
    })

  }

}

export default MapModel;