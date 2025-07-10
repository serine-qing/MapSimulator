//垃圾回收

import * as THREE from "three"

let collection = [];

const GC_Add = (object: any) => {
  collection.push(object);
}

const GC_Sweep = () => {
  collection.forEach(obj => {
    obj.traverse(item => {
      item.geometry?.dispose();
      item.material?.dispose();
    })
  })

  collection = [];
}

export {GC_Add, GC_Sweep}