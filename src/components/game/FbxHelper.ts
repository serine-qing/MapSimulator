import * as THREE from "three"
import GameConfig from "../utilities/GameConfig";
import Trap from "./Trap";
import { Direction } from "../utilities/Enum";

const specialTrap = {
  trap_011_ore:{
    scaleRate: 0.9,
    z: 0.1
  },
  trap_013_blower:{
    direction: Direction.RIGHT,
    scaleRate: 0.9,
    z: 0.5
  },
  trap_025_prison:{
    direction: Direction.RIGHT,
    scaleRate: 0.9,
  },
  trap_027_stone:{
    direction: Direction.DOWN,
    scaleRate: 0.9,
  },
  trap_032_mound:{
    direction: Direction.LEFT,
    scaleRate: 0.95,
  },
  trap_037_airsup:{
    direction: Direction.DOWN,
    scaleRate: 0.9,
  },
  trap_057_wpnsts:{
    scaleRate: 0.9,
    z: 1.8
  },
  trap_062_magicstart:{
    direction: Direction.RIGHT,
    z: -2.2
  },
  trap_063_magicturn:{
    z: -1.9
  },
  trap_080_garage:{
    scaleRate: 1.18,
  },
  trap_081_turngear:{
    scaleRate: 1.07,
  },
  trap_097_hstone:{ 
    direction: Direction.LEFT,
    scaleRate: 0.9,
    z: -3.1 
  },
  trap_117_ltstat:{
    direction: Direction.RIGHT,
    scaleRate: 1.23
  },
  trap_118_rockfl:{
    direction: Direction.RIGHT,
    scaleRate: 1.2
  },
  trap_124_eradio:{
    direction: Direction.RIGHT,
    scaleRate: 0.95,
    z: 0.7
  },
  trap_125_bonore:{
    direction: Direction.RIGHT,
    scaleRate: 1.25
  },
  trap_126_outset:{
    direction: Direction.RIGHT,
    scaleRate: 1.25
  },
  trap_127_bldore:{
    scaleRate: 1.23
  },
  trap_134_condtr:{
    scaleRate: 1.2,
    direction: Direction.LEFT,
  },
  trap_137_winfire:{
    direction: Direction.RIGHT,
    scaleRate: 1.04,
  },
  trap_139_dhtl:{
    z: -0.2
  },
  trap_140_dhsb:{
    direction: Direction.UP,
    scaleRate: 1.2,
    z: -2.6
  },
  trap_141_sheltr:{
    direction: Direction.LEFT,
  },
  trap_142_barrel:{
    direction: Direction.LEFT,
  },
  trap_147_spblls:{
    direction: Direction.DOWN,
    scaleRate: 1.2,
  },
  trap_148_amblls:{
    direction: Direction.RIGHT,
    z: 0.4
  },
  trap_155_aegiret:{
    direction: Direction.RIGHT,
  },
  trap_156_dsshell:{
    direction: Direction.LEFT,
    scaleRate: 1.1,
  },
  trap_159_lrcore:{
    direction: Direction.DOWN,
    scaleRate: 0.9,
    z: -3.4
  },
  trap_160_lrlgun:{
    direction: Direction.DOWN,
    scaleRate: 1.5,
  },
  trap_171_trpot:{
    direction: Direction.LEFT,
  },
  trap_184_vtarsn:{
    direction: Direction.RIGHT,
  },
  trap_196_cnnon:{
    direction: Direction.LEFT,
    scaleRate: 1.4,
  },
  trap_211_cjgtow:{
    direction: Direction.RIGHT,
    scaleRate: 1.32
  },
  trap_212_cjbtow:{
    direction: Direction.LEFT,
  },
  trap_218_fttree:{
    direction: Direction.LEFT,
    scaleRate: 1.47
  },
  trap_219_fttreant:{
    direction: Direction.LEFT,
    scaleRate: 1.47
  },
  trap_247_crfilm:{
    direction: Direction.RIGHT,
  },

  '1334_ristar':{
    scaleRate: 0.85
  },
}

//目前到trap_027_stone结束
const changeDirection = (object: THREE.Object3D, name: string) => {
  const direction = specialTrap[name]?.direction;

  const eulerY = direction? direction / 2 : 0;

  //逆时针旋转X度
  //使用欧拉角可能导致万向节死锁 https://cloud.tencent.com/developer/article/2135459
  //这个视频解释的很清楚：https://www.bilibili.com/video/BV1Nr4y1j7kn
  
  const meshQuat = object.quaternion;

  const quatY = new THREE.Quaternion();
  quatY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), eulerY * Math.PI); 

  const quatX = new THREE.Quaternion();
  quatX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

  quatX.multiply(quatY);

  if(name === "trap_247_crfilm"){
    //摄影机方向不太对 修复下
    const quatZ = new THREE.Quaternion();
    quatZ.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
    quatX.multiply(quatZ);
  }

  //将四元数应用到对象上，通常是将其与对象的quaternion属性相乘。
  meshQuat.multiplyQuaternions(meshQuat, quatX);


}

const changeScale = (object: THREE.Object3D, name: string) => {
  
  const box:any = new THREE.Box3().setFromObject( object );
  const vec3 = box.getSize( new THREE.Vector3());
  const size = Math.max(vec3.x, vec3.y)

  const scaleRate = specialTrap[name]?.scaleRate || 1 ;
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
  changeDirection(object, name);
  changeScale(object, name)
  changeZ(object, name)

} 

const checkTrapInst = (trap: Trap) => {

}

export { unitizeFbx }