import * as THREE from "three"
import GameConfig from "@/components/utilities/GameConfig"
//编译静态的纹理材料数据

interface TileTexture{
  top?: THREE.MeshBasicMaterial,
  side?: THREE.MeshBasicMaterial,
  ground?: THREE.MeshBasicMaterial,
  fenceTop?: THREE.MeshBasicMaterial,
  hole?: any,
  yin?: THREE.MeshBasicMaterial,
  yang?: THREE.MeshBasicMaterial,
  rabbithole?: "in" | "out",
}
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

const skyBlue = new THREE.MeshBasicMaterial( {color: "#87CEEB"} ); //天空蓝

const green = new THREE.MeshBasicMaterial( {color: "#255F25"} );

const transparent = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false   //不设置depthWrite，还是会把其他东西挡住
});

// ============================================================
// act55side 战壕贴图
// canvas 程序化绘制占位，后续可替换成美术导出的正式资源
// 直接作为下面 tileTextures 的 top 材质，tileKey 命中即自动生效
// ============================================================
const TEST_CANVAS_SIZE = 512;

//固定种子随机，保证每次生成的贴图一致
let tSeed = 20261101;
const tRand = () => {
  tSeed = (tSeed * 16807) % 2147483647;
  return (tSeed - 1) / 2147483646;
};

const tRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

//画一根圆木（horizontal=true 时水平放置，(cx,cy) 为中心）
const tDrawLog = (ctx: CanvasRenderingContext2D, cx: number, cy: number, length: number, horizontal: boolean) => {
  const th = 28; //圆木直径
  ctx.save();
  ctx.translate(cx, cy);
  if(!horizontal) ctx.rotate(Math.PI / 2);

  //主体：上亮下暗的圆柱感
  const grad = ctx.createLinearGradient(0, -th / 2, 0, th / 2);
  grad.addColorStop(0, "#d9a878");
  grad.addColorStop(0.4, "#a06c3c");
  grad.addColorStop(1, "#5e3a1c");
  ctx.fillStyle = grad;
  tRoundRect(ctx, -length / 2, -th / 2, length, th, th / 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(35, 20, 8, 0.85)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  //顶部高光条
  ctx.fillStyle = "rgba(255, 226, 178, 0.38)";
  tRoundRect(ctx, -length / 2 + 8, -th / 2 + 3, length - 16, 6, 3);
  ctx.fill();

  //木纹
  ctx.strokeStyle = "rgba(70, 40, 16, 0.35)";
  ctx.lineWidth = 1.5;
  for(let i = -1; i <= 1; i++){
    ctx.beginPath();
    ctx.moveTo(-length / 2 + 14, i * 7);
    ctx.bezierCurveTo(-length / 6, i * 7 + 3, length / 6, i * 7 - 3, length / 2 - 14, i * 7);
    ctx.stroke();
  }

  //两端年轮
  for(const side of [-1, 1]){
    const ex = side * (length / 2 - th / 2);
    ctx.beginPath();
    ctx.arc(ex, 0, th / 2 - 3, 0, Math.PI * 2);
    ctx.fillStyle = "#c89058";
    ctx.fill();
    ctx.strokeStyle = "rgba(60, 34, 12, 0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ex, 0, th / 2 - 10, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(90, 52, 20, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();
};

//战壕：青石框 + 圆木压边 + 下沉坑底（俯视）
const drawTrenchTexture = (ctx: CanvasRenderingContext2D) => {
  const S = TEST_CANVAS_SIZE;
  const RIM = 60;   //石框厚度
  const mid = S / 2;

  //坑底基色（上亮下暗）
  const floor = ctx.createLinearGradient(0, 0, 0, S);
  floor.addColorStop(0, "#445565");
  floor.addColorStop(1, "#31404c");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, S, S);

  //坑底石砖缝
  ctx.strokeStyle = "rgba(24, 32, 40, 0.55)";
  ctx.lineWidth = 2;
  const cell = (S - 2 * RIM) / 4;
  for(let i = 0; i <= 4; i++){
    const p = RIM + cell * i;
    ctx.beginPath(); ctx.moveTo(RIM, p); ctx.lineTo(S - RIM, p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p, RIM); ctx.lineTo(p, S - RIM); ctx.stroke();
  }

  //中央凹陷阴影
  const deep = ctx.createRadialGradient(mid, mid, 20, mid, mid, 160);
  deep.addColorStop(0, "rgba(16, 24, 30, 0.9)");
  deep.addColorStop(1, "rgba(16, 24, 30, 0)");
  ctx.fillStyle = deep;
  ctx.fillRect(RIM, RIM, S - 2 * RIM, S - 2 * RIM);

  //坑内抬起的石梁框
  const f = 118, ft = 18;
  ctx.strokeStyle = "#5a7080";
  ctx.lineWidth = ft;
  ctx.strokeRect(mid - f, mid - f, f * 2, f * 2);
  ctx.strokeStyle = "rgba(180, 210, 220, 0.35)";   //上缘高光
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(mid - f - ft / 2 + 2, mid - f - ft / 2 + 2);
  ctx.lineTo(mid + f + ft / 2 - 2, mid - f - ft / 2 + 2);
  ctx.stroke();

  //最深井底
  ctx.fillStyle = "#1e2a33";
  tRoundRect(ctx, mid - 62, mid - 62, 124, 124, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(10, 16, 20, 0.8)";
  ctx.lineWidth = 3;
  ctx.stroke();

  //青石框
  ctx.fillStyle = "#85b4af";
  ctx.fillRect(0, 0, S, RIM);
  ctx.fillRect(0, S - RIM, S, RIM);
  ctx.fillRect(0, 0, RIM, S);
  ctx.fillRect(S - RIM, 0, RIM, S);

  //石块分缝
  ctx.strokeStyle = "rgba(40, 70, 70, 0.65)";
  ctx.lineWidth = 3;
  const blockLen = 73;
  for(let i = 1; i < 7; i++){
    const p = i * blockLen;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, RIM); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p, S - RIM); ctx.lineTo(p, S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(RIM, p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(S - RIM, p); ctx.lineTo(S, p); ctx.stroke();
  }

  //石块明暗斑驳
  for(let i = 0; i < 14; i++){
    const side = Math.floor(tRand() * 4);
    const along = Math.floor(tRand() * 7) * blockLen + 6;
    const depth = tRand() * (RIM - 22);
    let bx = 0, by = 0;
    if(side === 0){ bx = along; by = depth; }
    else if(side === 1){ bx = along; by = S - RIM + depth; }
    else if(side === 2){ bx = depth; by = along; }
    else { bx = S - RIM + depth; by = along; }
    ctx.fillStyle = `rgba(${30 + tRand() * 40}, ${70 + tRand() * 40}, ${70 + tRand() * 30}, 0.25)`;
    ctx.fillRect(bx, by, 16 + tRand() * 22, 12 + tRand() * 14);
  }

  //石框内缘投到坑里的阴影
  const shadow = 34;
  let g = ctx.createLinearGradient(0, RIM, 0, RIM + shadow);
  g.addColorStop(0, "rgba(8, 14, 18, 0.55)"); g.addColorStop(1, "rgba(8, 14, 18, 0)");
  ctx.fillStyle = g; ctx.fillRect(RIM, RIM, S - 2 * RIM, shadow);
  g = ctx.createLinearGradient(0, S - RIM, 0, S - RIM - shadow);
  g.addColorStop(0, "rgba(8, 14, 18, 0.5)"); g.addColorStop(1, "rgba(8, 14, 18, 0)");
  ctx.fillStyle = g; ctx.fillRect(RIM, S - RIM - shadow, S - 2 * RIM, shadow);
  g = ctx.createLinearGradient(RIM, 0, RIM + shadow, 0);
  g.addColorStop(0, "rgba(8, 14, 18, 0.45)"); g.addColorStop(1, "rgba(8, 14, 18, 0)");
  ctx.fillStyle = g; ctx.fillRect(RIM, RIM, shadow, S - 2 * RIM);
  g = ctx.createLinearGradient(S - RIM, 0, S - RIM - shadow, 0);
  g.addColorStop(0, "rgba(8, 14, 18, 0.45)"); g.addColorStop(1, "rgba(8, 14, 18, 0)");
  ctx.fillStyle = g; ctx.fillRect(S - RIM - shadow, RIM, shadow, S - 2 * RIM);

  //石框顶面内侧高光
  ctx.strokeStyle = "rgba(220, 250, 245, 0.4)";
  ctx.lineWidth = 3;
  ctx.strokeRect(RIM * 0.4, RIM * 0.4, S - RIM * 0.8, S - RIM * 0.8);

  //圆木压边：每边两根
  const logLen = 176, off = 100;
  tDrawLog(ctx, mid - off, RIM * 0.5, logLen, true);
  tDrawLog(ctx, mid + off, RIM * 0.5, logLen, true);
  tDrawLog(ctx, mid - off, S - RIM * 0.5, logLen, true);
  tDrawLog(ctx, mid + off, S - RIM * 0.5, logLen, true);
  tDrawLog(ctx, RIM * 0.5, mid - off, logLen, false);
  tDrawLog(ctx, RIM * 0.5, mid + off, logLen, false);
  tDrawLog(ctx, S - RIM * 0.5, mid - off, logLen, false);
  tDrawLog(ctx, S - RIM * 0.5, mid + off, logLen, false);

  //四角金属件 + 橙色铆钉灯
  const corners = [[0, 0], [S, 0], [0, S], [S, S]];
  corners.forEach(([x, y]) => {
    ctx.fillStyle = "#2a2e33";
    tRoundRect(ctx, x - 26, y - 26, 52, 52, 8);
    ctx.fill();
    ctx.fillStyle = "#e86830";
    ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255, 180, 120, 0.7)";
    ctx.beginPath(); ctx.arc(x - 2, y - 2, 3.5, 0, Math.PI * 2); ctx.fill();
  });
};

//由 canvas 生成贴图材质
const createCanvasMat = (draw: (ctx: CanvasRenderingContext2D) => void): THREE.MeshBasicMaterial => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = TEST_CANVAS_SIZE;
  draw(canvas.getContext("2d"));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false
  });
};

const testTrenchMat = createCanvasMat(drawTrenchTexture);  //战壕（下沉坑体）

const tileTextures: {[key: string]: TileTexture} = {
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
  tile_green:{
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
  tile_balloon:{
    top: skyBlue,
    side: white
  },
  tile_balloon_fbd:{
    top: dark,
    side: deepGray
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
  tile_act48side:{
    top: new THREE.MeshBasicMaterial( {color: "#456865"} ),
    side: new THREE.MeshBasicMaterial( {color: "#79765C"} )
  },
  //照我以火的草(不可部署地面)
  tile_reedf:{
    top: green,
  },
  //照我以火的草(地面)
  tile_reed:{
    top: green,
  },
  //照我以火的草(高台)
  tile_reedw:{
    top: green,
    side: darkGray
  },
  //兔子洞入口
  tile_rabbithole_in:{
    top: new THREE.MeshBasicMaterial({ color: "#2a1e14" }),
  },
  //兔子洞出口
  tile_rabbithole_out:{
    top: new THREE.MeshBasicMaterial({ color: "#1a2e1a" }),
  },
  //act55side：战壕（下沉坑体）
  tile_trench:{
    top: testTrenchMat,
    side: new THREE.MeshBasicMaterial({ color: "#232f38" }),
  },
}

//不需要的材质设置为透明，防止射线检测出错
Object.values(tileTextures).forEach(data => {
  if(!data.top) data.top = transparent;
  if(!data.side) data.side = transparent;
})

tileTextures["tile_passable_wall"] = tileTextures["tile_wall"];
tileTextures["tile_fence_bound"] = tileTextures["tile_fence"];

const getClone = (texture: THREE.Texture, index:number, width: number, height: number):THREE.Texture  => {
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

textureMats["moonlight_shadow"] = new THREE.MeshBasicMaterial({
  color: "#000000",
  transparent: true
});

const textureLoader = new THREE.TextureLoader();

//添加单个图片纹理
const addSingleTexture = (key: string, url: string): Promise<void> => {
  return new Promise((resolve) => {
    textureLoader.load(url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      textureMats[key] = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      });
      resolve();
    });
  });
}

const parseTexture = (textures: {[key: string]: THREE.Texture} ) => {
  const {texture1, sprite_sui} = textures;
  texture1.colorSpace = THREE.SRGBColorSpace;
  const keyArr = [
    "gem", "gemdark","juntan",null, "tile_banned", "tile_banned2", "tile_bigforce", "tile_bigforce2",
    "tile_bnspck_road", "tile_corrosion", "tile_defup", "tile_end" ,"tile_floor", "tile_flystart",
    "tile_gazebo", "tile_grass", "tile_grvtybtn_down", "tile_grvtybtn_up",  "tile_healing", "tile_infection",
    "tile_ristar_road","tile_ristar_road_forbidden", "tile_sleep_wall", "tile_smog","tile_stairs","tile_stairs_2",
    "tile_start", "tile_telin", "tile_telout", "tile_volcano"
  ]

  keyArr.forEach( (key, index) => {
    if(!key) return;

    const texture = getClone(texture1, index, GameConfig.SPRITE_SIZE[0], GameConfig.SPRITE_SIZE[1]);
    textureMats[key] = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,   //矢量图能透明
      depthWrite: false    //关闭depthWrite，这样无论如何都遮挡不到敌人模型了
    })
  })

  //不可部署的源石污染区
  textureMats["tile_toxic"] = textureMats["tile_floor"];
  textureMats["tile_sleep_road"] = textureMats["tile_sleep_wall"];

  parseSpriteSui(sprite_sui);
}

const parseSpriteSui = (textureSui: THREE.Texture) => {
  textureSui.colorSpace = THREE.SRGBColorSpace;
  const keyArr = [
    "Fortune", "Food", "Camp", "Highland", "Anchor", "Trigger", "Empty"
  ]

  keyArr.forEach( (key, index) => {
    if(!key) return;

    const texture = getClone(textureSui, index, 7, 1);
    textureMats[key] = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,   //矢量图能透明
      depthWrite: false    //关闭depthWrite，这样无论如何都遮挡不到敌人模型了
    })
  })
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

  // 兔子洞地块带数字后缀（如 tile_rabbithole_in_1），需要去掉后缀查找基础材质
  let tileTexture = tileTextures[key];
  if(!tileTexture && key.startsWith("tile_rabbithole")){
    tileTexture = tileTextures[key.replace(/_\d+$/, "")];
  }
  tileTexture = tileTexture ?? defaultMat;

  return tileTexture;
}


//获取单位size的texture
const getTexture = (name:string) => {
  const textureMat = textureMats[name];
  if(textureMat){
    const textureGeo = new THREE.PlaneGeometry( 1, 1 );
    const textureMesh = new THREE.Mesh( textureGeo, textureMat );
    textureMesh.renderOrder = -1;
    return textureMesh;
  }else{
    return null;
  }


}

export{parseTexture, getTexture, getTile, addSingleTexture}
