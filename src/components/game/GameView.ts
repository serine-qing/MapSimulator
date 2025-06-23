import * as THREE from "three"
import MapTiles from "./MapTiles.ts"
import tileKeyMapping from "./tileKeyMapping.js"
import Enemy from "../enemy/Enemy.ts"
import GameConfig from "@/components/utilities/GameConfig.ts"
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import spinesAssets from "@/components/assetManager/spinesAssets.js"

class GameView{
  private el: any;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private mapContainer: THREE.Object3D;
  private mapTiles: MapTiles;

  //TODO 需要重做enemy类
  public enemies: Enemy[];
  public enemiesInMap: Enemy[];

  constructor(el, mapTiles){
    this.el = el;
    this.mapTiles = mapTiles;
    this.initCamera();
    this.initRenderer();
    this.initMap();
    
  }
  //初始化相机
  private initCamera(){
    
    // this.camera = new THREE.OrthographicCamera(-5,5,-5,5,0,1000)

    this.camera = new THREE.PerspectiveCamera(
      20, //视角
      window.innerWidth / window.innerHeight, //宽高比
      1, //近平面
      1000 //远平面
    )
    this.camera.position.x = 0;
    this.camera.position.z = 200;
    this.camera.rotation.z = 1;
    this.camera.lookAt(0,0,0); //相机看向原点

  }
  //初始化渲染器和场景
  private initRenderer(){
    //创建场景
    this.scene = new THREE.Scene();
    //创建渲染器
    this.renderer = new THREE.WebGLRenderer({antialias: true,canvas:this.el});
    
    //地图比例是否正确，关键看相机和渲染器的宽高比是否一致
    this.renderer.setSize(window.innerWidth,window.innerHeight); //设置宽高
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    window.addEventListener("resize",() => {
      this.renderer.setSize(window.innerWidth,window.innerHeight); //设置宽高

      //重设相机宽高比
      this.camera.aspect = window.innerWidth/window.innerHeight;
      //更新相机投影矩阵
      this.camera.updateProjectionMatrix();
    })
  }

  //初始化地图tiles
  private initMap(){
    
    this.mapContainer = new THREE.Object3D();

    this.mapTiles.getMatrix().forEach((rowArray, y)=>{
      rowArray.forEach((tile, x)=>{
        let tileClass = tileKeyMapping[tile.tileKey];
        this.mapContainer.add(new tileClass({x,y}).object);
      })
    })

    this.mapContainer.rotation.x = - GameConfig.MAP_ROTATION;
    this.mapContainer.position.x = - 30;
    this.mapContainer.position.y = - 22;
    this.scene.add(this.mapContainer);
  }

  public setupEnemies(enemies: Enemy[], enemiesInMap: Enemy[]){
    this.enemies = enemies;
    this.enemiesInMap = enemiesInMap;
    this.setupEnemiesSpines(enemies);
  }

  //设置敌人spine
  private setupEnemiesSpines(enemies: Enemy[]){
    spinesAssets.loadCompleted.then(()=>{
      enemies.forEach(enemy => {
        enemy.initSpine();
        this.mapContainer.add(enemy.skeletonMesh);
        enemy.skeletonMesh.position.x = 7;
        enemy.skeletonMesh.position.y = 7;
        enemy.skeletonMesh.visible = true;
      })

    })
  }

  public render(delta: number){
    this.renderer.render(this.scene,this.camera);
    for(let i = 0; i< this.enemiesInMap.length; i++){
      this.enemiesInMap[i].skeletonMesh.update(delta);
    }
  }
}

export default GameView;