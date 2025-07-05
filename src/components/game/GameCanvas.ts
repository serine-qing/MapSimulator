import * as THREE from "three";

class GameCanvas{
  public wrapper: HTMLDivElement;
  public canvas: HTMLCanvasElement;
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  
  private width: number;
  private height: number;

  constructor(el: HTMLDivElement){
    this.wrapper = el;
    this.canvas = this.wrapper.querySelector("#c") as HTMLCanvasElement;
    this.initCamera();
    this.initRenderer();
    this.animate();
  }

    //初始化相机
  private initCamera(){
    
    // this.camera = new THREE.OrthographicCamera(-5,5,-5,5,0,1000)

    //创建相机
    this.camera = new THREE.PerspectiveCamera(
      20, //视角
      this.wrapper.offsetWidth / this.wrapper.offsetHeight, //宽高比
      1, //近平面
      500 //远平面
    )
    this.camera.position.x = 0;
    this.camera.position.z = 160;
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
    this.renderer.setPixelRatio( window.devicePixelRatio );
    //地图比例是否正确，关键看相机和渲染器的宽高比是否一致
    this.width = this.wrapper.offsetWidth;
    this.height = this.wrapper.offsetHeight;

    this.renderer.setSize(
      this.width,
      this.height
    ); //设置宽高
    
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)

  }
  //循环执行
  private animate(){
    requestAnimationFrame(()=>{
      if( this.width !== this.wrapper.offsetWidth || this.height !== this.wrapper.offsetHeight ){

        this.width = this.wrapper.offsetWidth;
        this.height = this.wrapper.offsetHeight;
        this.resize();

      }
      this.animate();
    });

  }

  public resize(){
    this.renderer.setSize(
      this.width,
      this.height
    ); //设置宽高

    //重设相机宽高比
    this.camera.aspect = this.width / this.height;
    //更新相机投影矩阵
    this.camera.updateProjectionMatrix();
    this.render();
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }
}

//单例模式，无论怎么切换地图，只需要一个canvas存在
export let gameCanvas: GameCanvas;

export const setupCanvas = (el: HTMLDivElement)=> {
  gameCanvas = new GameCanvas(el);
}
