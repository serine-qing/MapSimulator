import * as THREE from "three"
import MapTiles from "./MapTiles"

import Tile from "./Tile"
import EnemyManager from "../enemy/EnemyManager"
import GameConfig from "@/components/utilities/GameConfig"

import {gameCanvas} from '@/components/game/GameCanvas';
import assetsManager from "@/components/assetManager/assetsManager"

class GameView{
  
  private mapContainer: THREE.Object3D;
  private tiles: Tile[] = [];
  private mapTiles: MapTiles;
  private enemyManager: EnemyManager;
  constructor(mapTiles: MapTiles){
    this.mapTiles = mapTiles;
    this.mapContainer = new THREE.Object3D();

    //texture加载完后再初始化map，以防地图读取到未加载的texture
    assetsManager.textureOnload.then(()=>{
      this.initMap();
    })

  }

  //初始化地图tiles
  private initMap(){
    this.mapTiles.getMatrix().forEach((rowArray, y)=>{
      rowArray.forEach((tileData, x)=>{

        const tile = new Tile( tileData, {x, y} );
        this.tiles.push(tile);
        this.mapContainer.add(tile.object);
      })
    })

    //TODO 得动态调整
    this.mapContainer.rotation.x = - GameConfig.MAP_ROTATION;
    this.mapContainer.position.x = - 40;
    this.mapContainer.position.y = - 20;
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
    this.tiles.forEach(tile => tile.destroy());
    
    // this.mapContainer?.traverse(object => {
    //   if(object.type === "Mesh"){
    //     const mesh = object as THREE.Mesh;
    //     //Mesh无法调用 dispose()方法。只能将其从场景中移除。必须针对其geometry和material调用 dispose()方法。
        
    //     // console.log(mesh.geometry)
    //     if(mesh.material instanceof Array){
    //       mesh.material.forEach(material => {

    //         if(material && material.dispose){
    //           material.dispose()
    //         }
    //       })
    //     }else{
    //       mesh.material.dispose();
    //     }
    //     mesh.geometry.dispose();
    //   }
    // })
    
    this.mapContainer = null;
    this.mapTiles = null;
    this.enemyManager = null;
  }
}

export default GameView;