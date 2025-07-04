import * as THREE from "three"
import MapTiles from "./MapTiles"
import tileKeyMapping from "./tileKeyMapping"
import Enemy from "../enemy/Enemy"
import EnemyManager from "../enemy/EnemyManager"
import GameConfig from "@/components/utilities/GameConfig"
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

import {gameCanvas} from '@/components/game/GameCanvas';

class GameView{
  
  private mapContainer: THREE.Object3D;
  private mapTiles: MapTiles;
  private enemyManager: EnemyManager;

  constructor(mapTiles: MapTiles){
    
    this.mapTiles = mapTiles;
    this.mapContainer = new THREE.Object3D();
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
    const enemies = this.enemyManager.flatEnemies;

    enemies.forEach(enemy => {
      enemy.initSpine();
      this.mapContainer.add(enemy.spine);
    })

  }



  public render(delta: number){
    gameCanvas.render();

    this.enemyManager.getEnemiesInMap().forEach(
      enemy => enemy.skeletonMesh.update(delta)
    )

  }

  public destroy(){ 
  
    gameCanvas.scene.remove(this.mapContainer);

    this.mapContainer?.traverse(object => {
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
  }
}

export default GameView;