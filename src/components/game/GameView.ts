import * as THREE from "three"
import MapTiles from "./MapTiles"
import tileKeyMapping from "./tileKeyMapping"
import Enemy from "../enemy/Enemy"
import EnemyManager from "../enemy/EnemyManager"
import GameConfig from "@/components/utilities/GameConfig"
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import AssetsManager from "@/components/assetManager/spinesAssets"

class GameView{
  private wrapper: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private mapContainer: THREE.Object3D;
  private mapTiles: MapTiles;
  private enemyManager: EnemyManager;
  private assetsManager: AssetsManager;
  private enemies: Enemy[] = [];
  private enemiesInMap: Enemy[] = [];
  private enemyDatas: EnemyData[] = [];

  constructor(el: HTMLDivElement, mapTiles: MapTiles){
    this.wrapper = el;
    this.canvas = this.wrapper.querySelector("#c") as HTMLCanvasElement;
    this.mapTiles = mapTiles;
    this.mapContainer = new THREE.Object3D();
    this.assetsManager = new AssetsManager();

    this.initCamera();
    this.initRenderer();
    this.initMap();

  }
  //初始化相机
  private initCamera(){
    
    // this.camera = new THREE.OrthographicCamera(-5,5,-5,5,0,1000)

    //创建相机
    this.camera = new THREE.PerspectiveCamera(
      20, //视角
      this.wrapper.offsetWidth / this.wrapper.offsetHeight, //宽高比
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
    this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.canvas});

    //地图比例是否正确，关键看相机和渲染器的宽高比是否一致
    this.renderer.setSize(
      this.wrapper.offsetWidth,
      this.wrapper.offsetHeight
    ); //设置宽高

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    window.addEventListener("resize",() => {
      this.renderer.setSize(
        this.wrapper.offsetWidth,
        this.wrapper.offsetHeight
      ); //设置宽高

      //重设相机宽高比
      this.camera.aspect = this.wrapper.offsetWidth / this.wrapper.offsetHeight;
      //更新相机投影矩阵
      this.camera.updateProjectionMatrix();
    })
  }

  //初始化地图tiles
  private initMap(){
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

  public setupEnemyManager(enemyManager: EnemyManager){
    this.enemyManager = enemyManager;
    this.enemies = this.enemyManager.enemies;
    this.enemiesInMap = this.enemyManager.enemiesInMap;

  }

  public async setupEnemyDatas(enemyDatas: EnemyData[]){
    this.enemyDatas = enemyDatas;
    
    const spineNames: string[] = enemyDatas.map(e => e.key);

    //设置敌人spine
    await this.assetsManager.loadSpines(spineNames);
    this.enemies.forEach(enemy => {
      enemy.initSpine( this.assetsManager.spineManager );
      this.mapContainer.add(enemy.skeletonMesh);
      enemy.skeletonMesh.position.x = 7;
      enemy.skeletonMesh.position.y = 7;
      enemy.skeletonMesh.visible = true;
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