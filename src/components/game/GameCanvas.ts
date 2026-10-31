import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import eventBus from "../utilities/EventBus";
import Global from "../utilities/Global";
import GameConfig from "../utilities/GameConfig";

class GameCanvas{
  public wrapper: HTMLDivElement;
  public canvas: HTMLCanvasElement;
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  private width: number;
  private height: number;
  private debounce: ReturnType<typeof setTimeout>; //防抖

  //鼠标的世界坐标
  public mouse = new THREE.Vector2();
  public raycaster = new THREE.Raycaster();

  constructor(el: HTMLDivElement){
    this.wrapper = el;
    this.canvas = this.wrapper.querySelector("#c") as HTMLCanvasElement;
    this.initCamera();
    this.initRenderer();
    this.animate();
    // const controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

    //初始化相机
  private initCamera(){
    
    // this.camera = new THREE.OrthographicCamera(-5,5,-5,5,0,1000)

    //创建相机
    this.camera = new THREE.PerspectiveCamera(
      20, //视角
      this.wrapper.offsetWidth / this.wrapper.offsetHeight, //宽高比
      0.1, //近平面
      500 //远平面
    )

    this.camera.position.x = 0;
    this.camera.position.z = 180;
    this.camera.rotation.z = 1;
    this.camera.lookAt(0,0,0); //相机看向原点

  }
  //初始化渲染器和场景
  private initRenderer(){
    
    //创建场景
    this.scene = new THREE.Scene();
    //创建渲染器
    this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.canvas});
    //设置设备像素比。避免HiDPI设备上绘图模糊
    //移动端DPR可达3，上限2以控制像素填充、避免掉帧
    this.renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
    this.renderer.setClearColor("#AAAAAA")
    //地图比例是否正确，关键看相机和渲染器的宽高比是否一致
    this.width = this.wrapper.offsetWidth;
    this.height = this.wrapper.offsetHeight;

    this.renderer.setSize(
      this.width,
      this.height
    ); //设置宽高
    
    // new OrbitControls(this.camera, this.renderer.domElement)

  }
  //循环执行
  private animate(){

    requestAnimationFrame(()=>{
      if( this.width !== this.wrapper.offsetWidth || this.height !== this.wrapper.offsetHeight ){

        this.width = this.wrapper.offsetWidth;
        this.height = this.wrapper.offsetHeight;

        //防抖
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          this.resize()
        }, 100);
        
        // console.log(this.renderer.info.memory )
      }
      this.animate();
    });
    

  }

  public resize(){
    if(!Global.gameView) return;
    this.renderer.setSize(
      this.width,
      this.height
    ); //设置宽高
    const aspect = this.width / this.height;
    //重设相机宽高比
    this.camera.aspect = aspect;
    //更新相机投影矩阵
    this.camera.updateProjectionMatrix();
    if(aspect < 1.6 || mapFullscreenMode){
      //当渲染器高度不变时，只改变宽度不会影响3D物体在垂直方向上的视觉尺寸
      //所以调整宽度的时候，宽高比低于一定比例时，需要手动调整mapContainer的scale进行缩放
      //按当前地图的实际宽度铺满画布（留8%边距），而不是旧的 aspect/1.6 一刀切——
      //旧公式不看地图大小，竖屏下地图会缩得过小、四周大片空白
      //全屏看图模式（手机端按钮触发）下也走这套适配：横屏画布同样要铺满，而不是固定scale 1
      //可视世界高度 = 2 * 相机距离 * tan(fov/2)，可视宽度再乘宽高比
      const visibleHeight = 2 * Math.abs(this.camera.position.z) * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
      const visibleWidth = visibleHeight * aspect;
      const mapWidth = (Global.tileManager?.width || 0) * GameConfig.TILE_SIZE;
      //地图投影高度 ≈ 行数 × 格高 × cos(倾斜角)
      const mapHeight = (Global.tileManager?.height || 0) * GameConfig.TILE_SIZE * Math.cos(GameConfig.MAP_ROTATION);
      const fitScale = mapWidth > 0 ? (visibleWidth * 0.92) / mapWidth : aspect / 1.6;
      const fitHeight = mapHeight > 0 ? (visibleHeight * 0.9) / mapHeight : 1;
      //宽、高都取适配值，避免高地图在扁窗格里被裁掉上下；
      //窄窗格下允许放大到1以上，保证地图铺满窗格宽度（按公式算出的缩放必然容得下）
      Global.gameView.setScale( Math.max(0.1, Math.min(fitScale, fitHeight)) );
    }else{
      Global.gameView.setScale(1)
    }
    this.render();
    
    eventBus.emit("resize");
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }
}

//单例模式，无论怎么切换地图，只需要一个canvas存在
export let gameCanvas: GameCanvas;

//全屏看图模式（手机端全屏按钮触发）：
//为true时无视1.6宽高比阈值，任何画布尺寸都走「铺满适配」缩放（而非固定scale 1）。
//PC端恒为false，resize行为与原来完全一致。
let mapFullscreenMode = false;
export const setMapFullscreenMode = (on: boolean) => {
  mapFullscreenMode = on;
};

export const setupCanvas = (el: HTMLDivElement)=> {
  gameCanvas = new GameCanvas(el);
}
