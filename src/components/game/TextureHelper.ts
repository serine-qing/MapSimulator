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

const darkYellow = new THREE.MeshBasicMaterial( {color: "#B8860B"} );

//https://discourse.threejs.org/t/fbxloader-loaded-models-with-attached-textures-have-become-darker/9300/4
sea.color.convertSRGBToLinear();
gray.color.convertSRGBToLinear();
deepGray.color.convertSRGBToLinear();
darkGray.color.convertSRGBToLinear();
white.color.convertSRGBToLinear();
dark.color.convertSRGBToLinear();
pureWhite.color.convertSRGBToLinear();
pureBlack.color.convertSRGBToLinear();
darkYellow.color.convertSRGBToLinear();

const tileTextures = {

  //wall、road、floor、forbidden是高台地面默认的材质，很多tile都会用到
  tile_wall:{
    top: white,
    side: darkGray
  },
  tile_road:{
    top: gray,
  },
  tile_floor:{
    top: gray,
  },
  tile_forbidden:{
    top: dark,
    side: deepGray
  },
  
  tile_start:{
    ground: gray,
  },
  tile_end:{
    ground: gray,
  },
  tile_deepsea:{
    top: sea
  },
  tile_deepwater:{
    top: sea
  },
  tile_quicksand:{
    top: darkYellow
  },
  tile_fence:{
    top: gray,
    fenceTop: dark,
    side: white
  },
  tile_hole:{
    top: gray,
    hole: {
      scale: 0.73,
      material: pureBlack
    }
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

tileTextures["tile_fence_bound"] = tileTextures["tile_fence"];

const getClone = (texture: THREE.Texture, index:number):THREE.Texture  => {
  const width = GameConfig.SPRITE_SIZE[0];
  const height = GameConfig.SPRITE_SIZE[1];

  const tileWidth = 1 / width;
  const tileHeight = 1 / height;

  const x = (index % width) * tileWidth;
  const y = (height -1 - Math.floor(index / width)) * tileHeight;
  const clone = texture.clone();
  //不设置needsUpdate 就会变成黑块
  clone.needsUpdate = true;
  clone.repeat.set(tileWidth, tileHeight); 
  clone.offset.set(x, y); 
  return clone;
}

const textureMats = {};
const parseTexture = (textures: {[key: string]: THREE.Texture} ) => {
  const {texture1} = textures;
  texture1.encoding = THREE.sRGBEncoding;
  const keyArr = [
    null, "tile_banned", "tile_banned2", "tile_bigforce", "tile_bigforce2",
    "tile_bnspck_road", "tile_corrosion", "tile_defup", "tile_end" ,"tile_floor", "tile_flystart",
    "tile_gazebo", "tile_grass", "tile_grvtybtn_down", "tile_grvtybtn_up",  "tile_healing", "tile_infection", 
    "tile_ristar_road","tile_ristar_road_forbidden","tile_smog","tile_start", "tile_telin", "tile_telout", "tile_volcano"
  ]

  keyArr.forEach( (key, index) => {
    if(!key) return;

    const texture = getClone(texture1, index);
    textureMats[key] = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true   //矢量图能透明
    })
  })

  //不可部署的源石污染区
  textureMats["tile_toxic"] = textureMats["tile_floor"];

}

const getTile = (key: string, buildableType: string, heightType: string): any => {
  let defaultMat = {};

  //tileTextures里没有key就用默认材质
  if(buildableType === "NONE") {
    if(heightType === "HIGHLAND"){
      //高台不可部署使用tile_forbidden
      defaultMat = tileTextures["tile_forbidden"];
    }else if(heightType === "LOWLAND"){
      //地面不可部署使用tile_road
      defaultMat = tileTextures["tile_road"];
    }
  }else{
    if(heightType === "HIGHLAND"){
      //高台可部署使用tile_wall
      defaultMat = tileTextures["tile_wall"];
    }else if(heightType === "LOWLAND"){
      //地面可部署使用tile_road
      defaultMat = tileTextures["tile_road"];
    }
  }

  const tileTexture = tileTextures[key]? tileTextures[key] : defaultMat;

  return tileTexture;
}


//获取单位size的texture
const getTexture = (name:string) => {
  const textureMat = textureMats[name];
  if(textureMat){
    const textureGeo = new THREE.PlaneGeometry( 1, 1 );
    const textureMesh = new THREE.Mesh( textureGeo, textureMat );
    return textureMesh;
  }else{
    return null;
  }


}

export{parseTexture, getTexture, getTile}