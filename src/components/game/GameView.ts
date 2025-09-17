import * as THREE from "three"
import TileManager from "./TileManager"

import Tile from "./Tile"
import GameConfig from "@/components/utilities/GameConfig"

import { gameCanvas } from '@/components/game/GameCanvas';
import Trap from "./Trap"
import { GC_Sweep } from "./GC"
import Global from "../utilities/Global"
import { getPixelSize } from "../utilities/utilities";
import { SkeletonMesh } from "@/spine/SkeletonMesh";
import Enemy from "../enemy/Enemy";
import GameHandler from "../entityHandler/GameHandler";

class GameView{
  
  public mapContainer: THREE.Object3D;
  public tileObjects = new THREE.Group();
  public trapObjects = new THREE.Group();
  public enemyObjects = new THREE.Group();
  private tileBgImage: THREE.Mesh;

  public enemyMeshs: {[key: string]: THREE.Object3D} = {};           //每种敌人对应的mesh

  constructor(){
    Global.gameView = this;
  }

  public init(){
    this.initMap();
    this.initTraps();
    this.initEnemys();

    GameHandler.afterGameViewInit();
  }

  //初始化地图tiles
  private initMap(){
    this.mapContainer = new THREE.Object3D();
    
    Global.tileManager.tiles.flat().forEach((tile: Tile)=>{
      tile.initMeshs();
      this.tileObjects.add(tile.object);
    })

    //有背景图片，需要tile添加底部黑色图片，防止缝隙透光
    if( this.tileBgImage ){
      this.mapContainer.add(this.tileBgImage);
      Global.tileManager.flatTiles.forEach(tile => tile.createBottom())
    }

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
        this.enemyObjects.add(enemy.object);
      }
      
    })
    this.mapContainer.add(this.enemyObjects);
  }

  public initEnemyCloneMeshs(){
    Global.waveManager.enemies.forEach(enemy => {
      if(!this.enemyMeshs[enemy.key]){
        this.enemyMeshs[enemy.key] = enemy.getMeshClone();
      }
    })
    
  }

  public getEnemyMesh(key: string){
    return this.enemyMeshs[key];
  }

  public setBgImage(texture: THREE.Texture){
    const materia = new THREE.MeshBasicMaterial({
      map: texture
    });
    const width = getPixelSize(Global.tileManager.width);
    const height = getPixelSize(Global.tileManager.height);

    const geometry = new THREE.PlaneGeometry(width, height);
    this.tileBgImage = new THREE.Mesh(geometry, materia);
    
    this.tileBgImage.position.x = width / 2 - GameConfig.TILE_SIZE / 2;
    this.tileBgImage.position.y = height / 2 - GameConfig.TILE_SIZE / 2 + 0.1;
    this.tileBgImage.position.z = -0.1;

    if( this.mapContainer ){
      this.mapContainer.add(this.tileBgImage);
      Global.tileManager.flatTiles.forEach(tile => tile.createBottom())
    }
  }

  public localToScreen(position){
    const tempV = new THREE.Vector3(
      position.x,
      position.y,
      position.z? position.z : 0
    );

    this.mapContainer.localToWorld(
      tempV
    )

    return this.project(tempV);
  }

  public project(vec){
    vec.project(gameCanvas.camera);

    const x = (vec.x *  .5 + .5) * gameCanvas.canvas.clientWidth;
    const y = (vec.y * -.5 + .5) * gameCanvas.canvas.clientHeight;

    return {x, y};
  }

  public render(delta: number){

    if(Global.gameManager.isSimulate) return;
    
    gameCanvas.render();

    this.renderEnemy(delta);
    
    if(delta){
      Global.trapManager.traps.forEach(
        trap => {
          if(trap.visible){
            trap.skeletonMesh?.update( delta )
          }
        }
      )
    }

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