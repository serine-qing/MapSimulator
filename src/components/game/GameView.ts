import * as THREE from "three"
import MapTiles from "./MapTiles"

import Tile from "./Tile"
import EnemyManager from "../enemy/EnemyManager"
import GameConfig from "@/components/utilities/GameConfig"

import {gameCanvas} from '@/components/game/GameCanvas';
import Trap from "./Trap"
import GameManager from "./GameManager"
import { GC_Sweep } from "./GC"

class GameView{
  
  private mapContainer: THREE.Object3D;

  private mapTiles: MapTiles;
  private traps: Trap[];
  private gameManager: GameManager;
  private enemyManager: EnemyManager;

  constructor(gameManager: GameManager, mapTiles: MapTiles, traps: Trap[], enemyManager: EnemyManager){
    this.gameManager = gameManager;
    this.mapTiles = mapTiles;
    this.traps = traps;
    this.enemyManager = enemyManager;

    this.mapContainer = new THREE.Object3D();
    
    this.initMap();
    this.initTraps();
    this.initEnemys();
  }

  //初始化地图tiles
  private initMap(){
    this.mapTiles.tiles.flat().forEach((tile: Tile)=>{
      tile.gameManager = this.gameManager;
      tile.initMeshs();
      this.mapContainer.add(tile.object);
    })

    this.mapContainer.rotation.x = - GameConfig.MAP_ROTATION;
    this.mapContainer.position.x = - this.mapTiles.width / 2 * GameConfig.TILE_SIZE;
    this.mapContainer.position.y = - this.mapTiles.height / 2 * GameConfig.TILE_SIZE + 7;
    gameCanvas.scene.add(this.mapContainer);
  }

  private initTraps(){
    this.traps.forEach(trap => {
      trap.initMesh();
      this.mapContainer.add(trap.object);
    })
  } 

  public initEnemys(){
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

    this.traps.forEach(
      trap => trap.skeletonMesh?.update(delta)
    )
  }

  public destroy(){ 
  
    gameCanvas.scene.remove(this.mapContainer);

    this.mapTiles.tiles.flat().forEach(tile => tile.destroy());
    GC_Sweep();
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