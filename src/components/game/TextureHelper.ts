import * as THREE from "three"
import GameConfig from "@/components/utilities/GameConfig"
//编译静态的纹理材料数据

//TODO 按照颜色分配变量名
//静态数据
const sea = new THREE.MeshBasicMaterial( {color: "#086e8d"} );
const gray = new THREE.MeshBasicMaterial( {color: "#747474"} ); //淡灰
const deepGray = new THREE.MeshBasicMaterial( {color: "#131313"} ); //深灰2
const darkGray = new THREE.MeshBasicMaterial( {color: "#7d7d7d"} ); //深灰

const white = new THREE.MeshBasicMaterial( {color: "#c1c1c1"} ); //偏白色
const dark = new THREE.MeshBasicMaterial( {color: "#191919"} );  //深黑

const pureWhite = new THREE.MeshBasicMaterial( {color: "#ffffff"} );
const pureBlack = new THREE.MeshBasicMaterial( {color: "#000000"} );

//https://discourse.threejs.org/t/fbxloader-loaded-models-with-attached-textures-have-become-darker/9300/4
sea.color.convertSRGBToLinear();
gray.color.convertSRGBToLinear();
deepGray.color.convertSRGBToLinear();
darkGray.color.convertSRGBToLinear();
white.color.convertSRGBToLinear();
dark.color.convertSRGBToLinear();
pureWhite.color.convertSRGBToLinear();
pureBlack.color.convertSRGBToLinear();

const textMaterials = {
  tile_wall:{
    top: white,
    side: darkGray
  },
  tile_forbidden:{
    top: dark,
    side: deepGray
  },
  tile_road:{
    top: gray,
  },
  tile_deepsea:{
    top: sea
  },
  tile_deepwater:{
    top: sea
  },
  tile_fence:{
    top: gray,
    fenceTop: dark,
    side: white
  },
  tile_hole:{
    top: gray,
    texture: pureBlack
  },
  tile_yinyang_road:{
    top: gray,
    yin: pureBlack,
    yang: pureWhite
  },
  tile_yinyang_wall:{
    top: white,
    side: darkGray,
    yin: pureBlack,
    yang: pureWhite
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
  texture1.encoding = THREE.sRGBEncoding;
  const keyArr = [
    "tile_bigforce","tile_corrosion","tile_defup","tile_gazebo","tile_grass",
    "tile_telout","tile_smog","tile_healing","tile_infection","tile_bigforce2",
    "tile_flystart","tile_floor","tile_volcano",null,"tile_telin"
  ]

  keyArr.forEach( (key, index) => {
    if(!key) return;
    
    textMaterials[key] = {
      top: gray,
      texture: new THREE.MeshBasicMaterial({
        map: getClone(texture1, index)
      })
    };

  })

  // tile_defbreak 腐蚀地面2

}

export{parseTexture, textMaterials}