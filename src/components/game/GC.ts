//垃圾回收

import * as THREE from "three"

let collection = [];

const GC_Add = (object: any) => {
  collection.push(object);
}

const GC_Sweep = () => {
  collection.forEach(obj => {
    if(obj.traverse){

      obj.traverse(item => {
        item.geometry?.dispose();

        if(Array.isArray(item.material)){

          item.material.forEach(mat => {
            mat?.dispose();
          })
        }else{
          item.material?.dispose();
        }
        
      })
    }else if(obj.dispose){
      obj.dispose();
    }else{
      console.error(`${obj.name} 释放资源失败`)
    }

  })

  collection = [];
}

export {GC_Add, GC_Sweep}