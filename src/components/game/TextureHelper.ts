import * as THREE from "three"

//编译静态的纹理材料数据

//静态数据
let textMaterials: {[key: string]: any} = {};

const getClone = (texture: THREE.Texture, repeat: Vec2, offset: Vec2):THREE.Texture  => {
  const clone = texture.clone();
  //不设置needsUpdate 就会变成黑块
  clone.needsUpdate = true;
  clone.repeat.set(repeat.x, repeat.y); 
  clone.offset.set(offset.x, offset.y); 
  return clone;
}

const parseTexture = (textures: {[key: string]: THREE.Texture} ) => {
  const {texture1, texture2} = textures;

  const size = 248/1023; 

  const roadMaterial = new THREE.MeshBasicMaterial( {color: "#747474"} );
  //TODO 自己做一个雪碧图，别用方舟自带的。另外texture读取雪碧图坐标轴是从左下到右上
  textMaterials = {
    tile_wall:{
      top: new THREE.MeshBasicMaterial( {color: "#c1c1c1"} ),
      side: new THREE.MeshBasicMaterial( {color: "#7d7d7d"} )
    },
    tile_forbidden:{
      top: new THREE.MeshBasicMaterial( {color: "#191919"} ),
      side: new THREE.MeshBasicMaterial( {color: "#131313"} )
    },
    tile_road:{
      top: roadMaterial,
    },
    tile_floor:{
      top: roadMaterial,
      texture: new THREE.MeshBasicMaterial( {
        map: getClone(texture1, {x:size, y:size}, {x:0, y:1 - size}),
      }),
    }
  }

}

export{parseTexture, textMaterials}