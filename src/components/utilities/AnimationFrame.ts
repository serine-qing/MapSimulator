import * as THREE from "three"

interface updateFuction{
  order: number,               //执行顺序，越小执行越靠前
  animate: Function,
}

const clock: THREE.Clock = new THREE.Clock();
const animateInterval: number = 1 / 60; //两次数据更新之间间隔的时间
let animateTimeStamp: number = 0;
const updateFuctions: updateFuction[] = [];

const animate = () => {
  animateTimeStamp += clock.getDelta();

  if(animateTimeStamp >= animateInterval){

    animateTimeStamp = (animateTimeStamp % animateInterval);

    for(let i = 0; i < updateFuctions.length; i++){
      updateFuctions[i].animate();
      
    }
  }

  requestAnimationFrame(()=>{
    animate();
  });
  
}

animate();

const AnimationFrame = (updateFuction: updateFuction) => {
  updateFuctions.push(updateFuction);
  updateFuctions.sort((a, b) => {
    return a.order - b.order;
  })
}

window["updateFuctions"] = updateFuctions;

export default AnimationFrame;