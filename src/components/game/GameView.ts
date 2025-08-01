import * as THREE from "three"
import TileManager from "./TileManager"

import Tile from "./Tile"
import WaveManager from "../enemy/WaveManager"
import GameConfig from "@/components/utilities/GameConfig"

import { gameCanvas } from '@/components/game/GameCanvas';
import Trap from "./Trap"
import GameManager from "./GameManager"
import { GC_Sweep } from "./GC"
import TrapManager from "./TrapManager"

class GameView{
  
  public mapContainer: THREE.Object3D;
  public tileObjects = new THREE.Group();
  public trapObjects = new THREE.Group();

  private tileManager: TileManager;
  private gameManager: GameManager;
  private trapManager: TrapManager;
  private waveManager: WaveManager;

  constructor(gameManager: GameManager){
    this.gameManager = gameManager;
    const { mapModel, waveManager, trapManager } = gameManager;
    this.tileManager = mapModel.tileManager;
    this.waveManager = waveManager;
    this.trapManager = trapManager;

    this.mapContainer = new THREE.Object3D();
    
    this.initMap();
    this.initTraps();
    this.initEnemys();
  }

  //初始化地图tiles
  private initMap(){
    this.tileManager.tiles.flat().forEach((tile: Tile)=>{
      tile.gameManager = this.gameManager;
      tile.initMeshs();
      this.tileObjects.add(tile.object);
    })
    this.mapContainer.add(this.tileObjects);

    this.mapContainer.rotation.x = - GameConfig.MAP_ROTATION;
    this.mapContainer.position.x = - this.tileManager.width / 2 * GameConfig.TILE_SIZE;
    this.mapContainer.position.y = - this.tileManager.height / 2 * GameConfig.TILE_SIZE + 7;

    this.tileManager.initPreviewTextures();
    gameCanvas.scene.add(this.mapContainer);
  }

  private initTraps(){
    this.trapManager.initMeshs();
    this.trapManager.traps.forEach(trap => {
      this.trapObjects.add(trap.object);
      trap.initHeight();
    })
    this.mapContainer.add(this.trapObjects);
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
    gameCanvas.stats?.begin();
    if(this.gameManager.isSimulate) return;
    
    gameCanvas.render();

    this.waveManager.enemies.forEach(
      //TODO不同的敌人动画速率不同
      enemy => enemy.render( delta )
    )

    this.trapManager.traps.forEach(
      trap => trap.skeletonMesh?.update(delta)
    )

    gameCanvas.stats?.end();

  }

  public destroy(){ 
  
    gameCanvas.scene.remove(this.mapContainer);

    this.tileManager.tiles.flat().forEach(tile => tile.destroy());
    GC_Sweep();
    
    this.mapContainer = null;
    this.tileManager = null;
    this.waveManager = null;
  }
}

export default GameView;