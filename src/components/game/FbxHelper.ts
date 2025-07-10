import * as THREE from "three"

enum Direction{
  UP,
  RIGHT,
  DOWN,
  LEFT
}

//原始方向
const oldDirection = {
  trap_134_condtr: Direction.LEFT,
  S_yumen_stonewall: Direction.LEFT
}


const changeDirection = (object: THREE.Object3D) => {
  
  const eulerY = oldDirection[object.name] / 2;
  //逆时针旋转X度
  if(eulerY){
    object.rotateY(Math.PI * eulerY);
  }

}


const unitizeFbx = (object: THREE.Object3D) => {
  // console.log(object.name);
  changeDirection(object);
}

export { unitizeFbx }