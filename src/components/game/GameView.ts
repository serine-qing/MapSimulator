import * as THREE from "three"
import MapTiles from "./MapTiles"
import tileKeyMapping from "./tileKeyMapping"
import Enemy from "../enemy/Enemy"
import EnemyManager from "../enemy/EnemyManager"
import GameConfig from "@/components/utilities/GameConfig"
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import AssetsManager from "@/components/assetManager/spinesAssets"

import {gameCanvas} from '@/components/game/GameCanvas';

class GameView{
  
  private mapContainer: THREE.Object3D;
  private mapTiles: MapTiles;
  private enemyManager: EnemyManager;
  private assetsManager: AssetsManager;
  private enemies: Enemy[] = [];
  private enemiesInMap: Enemy[] = [];

  constructor(mapTiles: MapTiles){
    
    this.mapTiles = mapTiles;
    this.mapContainer = new THREE.Object3D();
    this.assetsManager = new AssetsManager();
    this.initMap();

  }


  //初始化地图tiles
  private initMap(){
    this.mapTiles.getMatrix().forEach((rowArray, y)=>{
      rowArray.forEach((tile, x)=>{
        let tileClass = tileKeyMapping[tile.tileKey];

        //TODO 临时措施，显示效果以后再做
        if(!tileClass){
          if(tile.passableMask === "FLY_ONLY"){
            tileClass = tileKeyMapping["tile_forbidden"];
            
          }else{
            tileClass = tileKeyMapping["tile_road"];
          }
        }
        
        this.mapContainer.add(new tileClass({x,y}).object);
      })
    })

    this.mapContainer.rotation.x = - GameConfig.MAP_ROTATION;
    this.mapContainer.position.x = - 30;
    this.mapContainer.position.y = - 22;
    gameCanvas.scene.add(this.mapContainer);
  }

  public setupEnemyManager(enemyManager: EnemyManager){
    this.enemyManager = enemyManager;
    this.enemies = this.enemyManager.flatEnemies;
    this.enemiesInMap = this.enemyManager.enemiesInMap;

  }

  public async setupEnemyDatas(enemyDatas: EnemyData[]){
    const spineNames: string[] = enemyDatas.map(e => e.key);

    //设置敌人spine
    await this.assetsManager.loadSpines(spineNames);
    this.enemies.forEach(enemy => {
      enemy.initSpine( this.assetsManager.spineManager );
      this.mapContainer.add(enemy.spine);
      enemy.show();
    })
  }

  public render(delta: number){
    gameCanvas.render();
    for(let i = 0; i< this.enemiesInMap.length; i++){
      this.enemiesInMap[i].skeletonMesh.update(delta);
    }
  }

  public destroy(){ 
  
    gameCanvas.scene.remove(this.mapContainer);

    this.mapContainer.traverse(object => {
      if(object.type === "Mesh"){
        const mesh = object as THREE.Mesh;
        
        //Mesh无法调用 dispose()方法。只能将其从场景中移除。必须针对其geometry和material调用 dispose()方法。
        
        // console.log(mesh.geometry)
        if(mesh.material instanceof Array){
          mesh.material.forEach(material => {

            if(material && material.dispose){
              material.dispose()
            }
          })
        }else{
          mesh.material.dispose();
        }
        mesh.geometry.dispose();
      }
    })
    this.mapContainer = null;
    this.mapTiles = null;
    this.enemyManager = null;
    this.assetsManager = null;
    this.enemies = null;
    this.enemiesInMap = null;
  }
}

export default GameView;