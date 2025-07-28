import * as THREE from "three"
import MapTiles from "./MapTiles"

import Tile from "./Tile"
import WaveManager from "../enemy/WaveManager"
import GameConfig from "@/components/utilities/GameConfig"

import { gameCanvas } from '@/components/game/GameCanvas';
import Trap from "./Trap"
import GameManager from "./GameManager"
import { GC_Sweep } from "./GC"

class GameView{
  
  private mapContainer: THREE.Object3D;
  public tileMeshs: THREE.Mesh[] = [];

  private mapTiles: MapTiles;
  private traps: Trap[];
  private gameManager: GameManager;
  private waveManager: WaveManager;

  constructor(gameManager: GameManager){
    this.gameManager = gameManager;
    const { mapModel, waveManager } = gameManager;
    this.mapTiles = mapModel.mapTiles;
    this.waveManager = waveManager;
    this.traps = waveManager.traps;

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
      this.tileMeshs.push(tile.cube);
    })

    this.mapContainer.rotation.x = - GameConfig.MAP_ROTATION;
    this.mapContainer.position.x = - this.mapTiles.width / 2 * GameConfig.TILE_SIZE;
    this.mapContainer.position.y = - this.mapTiles.height / 2 * GameConfig.TILE_SIZE + 7;

    this.mapTiles.initPreviewTextures();
    gameCanvas.scene.add(this.mapContainer);
  }

  private initTraps(){
    this.traps.forEach(trap => {
      trap.initMesh();
      this.mapContainer.add(trap.object);
    })
  } 

  public initEnemys(){
    const enemies = this.waveManager.enemies;
    enemies.forEach(enemy => {
      enemy.initSpine();
      if(enemy.spine){
        this.mapContainer.add(enemy.spine);
      }
      
    })

  }

  public render(delta: number){
    gameCanvas.render();

    this.waveManager.enemies.forEach(
      //TODO不同的敌人动画速率不同
      enemy => enemy.render( delta )
    )

    this.traps.forEach(
      trap => trap.skeletonMesh?.update(delta)
    )
  }

  public destroy(){ 
  
    gameCanvas.scene.remove(this.mapContainer);

    this.mapTiles.tiles.flat().forEach(tile => tile.destroy());
    GC_Sweep();
    
    this.mapContainer = null;
    this.mapTiles = null;
    this.waveManager = null;
  }
}

export default GameView;