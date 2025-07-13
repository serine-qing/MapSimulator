import * as THREE from "three"
import GameConfig from "../utilities/GameConfig";

enum Direction{
  UP,
  RIGHT,
  DOWN,
  LEFT
}


const specialTrap = {
  trap_011_ore:{
    z: 0.1
  },
  trap_013_blower:{
    direction: Direction.RIGHT,
    z: 0.5
  },
  trap_025_prison:{
    direction: Direction.RIGHT
  },
  trap_027_stone:{
    direction: Direction.DOWN,
  },
  trap_097_hstone:{ 
    direction: Direction.LEFT,
  },
  trap_134_condtr:{
    direction: Direction.LEFT,
  }
}

//目前到trap_027_stone结束
const changeDirection = (object: THREE.Object3D, name: string) => {
  
  const eulerY = specialTrap[name]?.direction / 2;
  //逆时针旋转X度
  if(eulerY){
    //使用欧拉角可能导致万向节死锁 https://cloud.tencent.com/developer/article/2135459、
    
    const meshQuat = object.quaternion;

    const quatY = new THREE.Quaternion();
    quatY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), eulerY * Math.PI); 

    const quatX = new THREE.Quaternion();
    quatX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

    quatX.multiply(quatY);
    //将四元数应用到对象上，通常是将其与对象的quaternion属性相乘。
    meshQuat.multiplyQuaternions(meshQuat, quatX);
  }

}

const changeScale = (object: THREE.Object3D, name: string) => {
  
  const box:any = new THREE.Box3().setFromObject( object );
  const vec3 = box.getSize( new THREE.Vector3());
  const size = Math.max(vec3.x, vec3.y)

  const scaleRate = 0.9;
  const scale = GameConfig.TILE_SIZE / size * scaleRate;

  object.scale.set(
    object.scale.x * scale, 
    object.scale.y * scale, 
    object.scale.z * scale
  );

}

const changeZ = (object: THREE.Object3D, name: string) => {
  const z = specialTrap[name]?.z;
  if(z){
    object.position.z += z;
  }
}

const unitizeFbx = (object: THREE.Object3D, name: string) => {
  console.log(name)
  changeDirection(object, name);
  changeScale(object, name)
  changeZ(object, name)
} 

export { unitizeFbx }