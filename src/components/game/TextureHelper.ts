import * as THREE from "three"
import GameConfig from "@/components/utilities/GameConfig"
//编译静态的纹理材料数据

//TODO 按照颜色分配变量名
//静态数据
const seaMaterial = new THREE.MeshBasicMaterial( {color: "#086e8d"} );
const roadMaterial = new THREE.MeshBasicMaterial( {color: "#747474"} ); //淡灰

const whiteMaterial = new THREE.MeshBasicMaterial( {color: "#c1c1c1"} ); //偏白色
const darkMaterial = new THREE.MeshBasicMaterial( {color: "#191919"} );  //深黑

const textMaterials = {
  tile_wall:{
    top: whiteMaterial,
    side: new THREE.MeshBasicMaterial( {color: "#7d7d7d"} )
  },
  tile_forbidden:{
    top: darkMaterial,
    side: new THREE.MeshBasicMaterial( {color: "#131313"} )
  },
  tile_road:{
    top: roadMaterial,
  },
  tile_deepsea:{
    top: seaMaterial
  },
  tile_deepwater:{
    top: seaMaterial
  },
  tile_fence:{
    top: roadMaterial,
    fenceTop: darkMaterial,
    side: whiteMaterial
  },
  tile_hole:{
    top: roadMaterial,
    texture: new THREE.MeshBasicMaterial( {color: "#000000"} )
  },
}
textMaterials["tile_fence_bound"] = textMaterials["tile_fence"];

const getClone = (texture: THREE.Texture, index:number):THREE.Texture  => {
  const width = GameConfig.SPRITE_SIZE[0];
  const height = GameConfig.SPRITE_SIZE[1];

  const tileWidth = 1 / width;
  const tileHeight = 1 / height;

  const x = (index % width) * tileWidth;
  const y = Math.floor(index / width) * tileHeight;
  const clone = texture.clone();
  //不设置needsUpdate 就会变成黑块
  clone.needsUpdate = true;
  clone.repeat.set(tileWidth, tileHeight); 
  clone.offset.set(x, y); 
  return clone;
}

const parseTexture = (textures: {[key: string]: THREE.Texture} ) => {
  const {texture1, texture2} = textures;
  
  const keyArr = [
    "tile_bigforce","tile_corrosion","tile_defup","tile_gazebo","tile_grass",
    "tile_telout","tile_smog","tile_healing","tile_infection","tile_bigforce2",
    "tile_flystart","tile_floor","tile_volcano",null,"tile_telin"
  ]

  keyArr.forEach( (key, index) => {
    if(!key) return;
    
    textMaterials[key] = {
      top: roadMaterial,
      texture: new THREE.MeshBasicMaterial({
        map: getClone(texture1, index)
      })
    };

  })

}

export{parseTexture, textMaterials}