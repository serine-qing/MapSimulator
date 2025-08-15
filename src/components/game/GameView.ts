import * as THREE from "three"
import TileManager from "./TileManager"

import Tile from "./Tile"
import GameConfig from "@/components/utilities/GameConfig"

import { gameCanvas } from '@/components/game/GameCanvas';
import Trap from "./Trap"
import { GC_Sweep } from "./GC"
import Global from "../utilities/Global"

class GameView{
  
  public mapContainer: THREE.Object3D;
  public tileObjects = new THREE.Group();
  public trapObjects = new THREE.Group();

  constructor(){

  }

  public init(){
    this.initMap();
    this.initTraps();
    this.initEnemys();
  }

  //初始化地图tiles
  private initMap(){
    this.mapContainer = new THREE.Object3D();
    Global.tileManager.tiles.flat().forEach((tile: Tile)=>{
      tile.initMeshs();
      this.tileObjects.add(tile.object);
    })
    this.mapContainer.add(this.tileObjects);

    this.mapContainer.rotation.x = - GameConfig.MAP_ROTATION;
    this.mapContainer.position.x = - Global.tileManager.width / 2 * GameConfig.TILE_SIZE;
    this.mapContainer.position.y = - Global.tileManager.height / 2 * GameConfig.TILE_SIZE + 7;

    Global.tileManager.initPreviewTextures();
    gameCanvas.scene.add(this.mapContainer);
  }

  private initTraps(){
    Global.trapManager.initMeshs();
    Global.trapManager.traps.forEach(trap => {
      if(trap.visible){
        this.trapObjects.add(trap.object);
        trap.initHeight();
      }

    })
    this.mapContainer.add(this.trapObjects);
  } 

  public initEnemys(){
    const enemies = Global.waveManager.enemies;
    enemies.forEach(enemy => {
      enemy.initMesh();
      if(enemy.object){
        this.mapContainer.add(enemy.object);
      }
      
    })

  }

  public localToWorld(position){
    const tempV = new THREE.Vector3(
      position.x,
      position.y,
      position.z? position.z : 0
    );

    this.mapContainer.localToWorld(
      tempV
    )

    tempV.project(gameCanvas.camera);

    const x = (tempV.x *  .5 + .5) * gameCanvas.canvas.clientWidth;
    const y = (tempV.y * -.5 + .5) * gameCanvas.canvas.clientHeight;

    return {x, y};
  }

  public render(delta: number){
    
    gameCanvas.stats?.begin();
    if(Global.gameManager.isSimulate) return;
    
    gameCanvas.render();

    if(delta){
      this.renderEnemy(delta);
      
      Global.trapManager.traps.forEach(
        trap => {
          if(trap.visible){
            trap.skeletonMesh?.update( delta )
          }
        }
      )
    }


    gameCanvas.stats?.end();

  }

  public renderEnemy(delta: number){
    Global.waveManager.enemies.forEach(
      enemy => enemy.render( delta )
    )
  }

  public destroy(){ 
  
    gameCanvas.scene.remove(this.mapContainer);

    Global.tileManager.tiles.flat().forEach(tile => tile.destroy());
    GC_Sweep();
    
    this.mapContainer = null;
  }
}

export default GameView;