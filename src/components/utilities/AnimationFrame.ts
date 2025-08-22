import * as THREE from "three"

interface updateFuction{
  name: string,
  order: number,               //执行顺序，越小执行越靠前
  interval?: number,            //多少帧执行一次
  intervalCount?: number,      //interval的计数器，内部使用
  animate: Function,
}

const clock: THREE.Clock = new THREE.Clock();
const animateInterval: number = 1 / 60; //两次数据更新之间间隔的时间
let animateTimeStamp: number = 0;
const updateFuctions: updateFuction[] = [];

let pause = false;

const animate = () => {
  animateTimeStamp += clock.getDelta();

  if(animateTimeStamp >= animateInterval){

    animateTimeStamp = (animateTimeStamp % animateInterval);

    if(!pause){

      for(let i = 0; i < updateFuctions.length; i++){
        const updateFuction = updateFuctions[i];
        if(updateFuction.interval){
          if(--updateFuction.intervalCount <= 0){
            updateFuction.intervalCount = updateFuction.interval;
            updateFuction.animate();
          }
        }else{
          updateFuction.animate();
        }

      }
    }

  }

  requestAnimationFrame(()=>{
    animate();
  });
  
}

animate();

const AnimationFrame = {
  addAnimationFrame: (updateFuction: updateFuction) => {
    updateFuction.intervalCount = updateFuction.interval;
    updateFuctions.push(updateFuction);
    updateFuctions.sort((a, b) => {
      return a.order - b.order;
    })
  },

  removeAnimationFrame: (name: string) => {
    const index = updateFuctions.findIndex(uFuction => uFuction.name === name);
    index > -1 && updateFuctions.splice(index, 1);
  },

  setPause: (val: boolean) => {
    pause = val;
  }
}

window["updateFuctions"] = updateFuctions;

export default AnimationFrame;