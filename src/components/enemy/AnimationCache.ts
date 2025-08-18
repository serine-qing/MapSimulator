import Global from "../utilities/Global";
import SpineEnemy from "./SpineEnemy";

interface TrackData{
  spineKey: string,
  animateName: string,
  trackTime: number,
  bonesCache?: any[], 
  slotsCache?: any[],
}

class AnimationCache{
  public trackDatas: {[key: string]: TrackData[]} = {};

  public addTrackData(data: TrackData){
    const {spineKey, animateName, trackTime} = data;
    if(!this.trackDatas[spineKey]){
      this.trackDatas[spineKey] = [];
    }

    const tracks = this.trackDatas[spineKey];
    const find = tracks.find(track => {
      return track.animateName === animateName && Math.abs(track.trackTime - trackTime) <= 0.001;
    })

    if(!find){
      tracks.push({
        spineKey,
        animateName,
        trackTime,
        bonesCache: null,
        slotsCache: null
      })
    }
  }

  public simulateAnimations(){
    Object.keys(this.trackDatas).forEach(key => {
      const enemy = Global.waveManager.enemies.find(enemy => enemy.key === key) as SpineEnemy;
      if(enemy && enemy.skeletonMesh){
        this.simulateEnemyAnimations(enemy, this.trackDatas[key])
      }
    })
  }

  private simulateEnemyAnimations(enemy: SpineEnemy, trackDatas: TrackData[]){
    const skeletonMesh = enemy.skeletonMesh;

    trackDatas.forEach(trackData => {
      skeletonMesh.state.setAnimation(
        0, 
        trackData.animateName, 
        false,
      );
      const track = skeletonMesh.state.getCurrent(0);
      track.trackTime = trackData.trackTime;

      skeletonMesh.update(0);
      
      trackData.bonesCache = this.cacheBones(skeletonMesh.skeleton.bones);
      // trackData.slotsCache = skeletonMesh.skeleton.slots.map(slot => ({
      //   color: slot.color.rgba(), // [r, g, b, a]
      //   darkColor: slot.darkColor ? slot.darkColor.rgba() : null,
      //   attachmentName: slot.attachment?.name || null
      // }))

    })


  }

  private cacheBones(bones) {
    return bones.map(bone => ({
      // 位置
      x: bone.x,
      y: bone.y,
      
      // 旋转（度）
      rotation: bone.rotation,
      
      // 缩放
      scaleX: bone.scaleX,
      scaleY: bone.scaleY,
      
      // 错切（倾斜）
      shearX: bone.shearX,
      shearY: bone.shearY,
      
      // 世界变换属性（非直接矩阵）
      worldX: bone.worldX,       // 世界空间X坐标
      worldY: bone.worldY,       // 世界空间Y坐标
      worldRotation: bone.worldRotation, // 世界空间旋转
      worldScaleX: bone.worldScaleX, // 世界空间X缩放
      worldScaleY: bone.worldScaleY  // 世界空间Y缩放
    }));
  }

  public restoreBone(bones, data) {
    bones.forEach((bone, index) => {
      // 设置基础变换参数
      bone.x = data[index].x;
      bone.y = data[index].y;
      bone.rotation = data[index].rotation;
      bone.scaleX = data[index].scaleX;
      bone.scaleY = data[index].scaleY;
      bone.shearX = data[index].shearX;
      bone.shearY = data[index].shearY;
      
      // 直接设置世界变换（优化关键！）
      bone.worldX = data[index].worldX;
      bone.worldY = data[index].worldY;
      bone.worldRotation = data[index].worldRotation;
      bone.worldScaleX = data[index].worldScaleX;
      bone.worldScaleY = data[index].worldScaleY;
      
      // 标记为已应用（避免重新计算）
      bone.appliedValid = true;
    })

  }

  public restore(enemyKey: string, animateName: string, trackTime: number, skeleton){
    const cache = this.getCache(enemyKey, animateName, trackTime);
    console.log("恢复前:", skeleton.bones[1].worldX, skeleton.bones[1].worldY);
    this.restoreBone(skeleton.bones, cache.bonesCache);
    console.log("恢复后:", skeleton.bones[1].worldX, skeleton.bones[1].worldY);
    

    // 强制更新标记
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform()
  }

  public getCache(enemyKey: string, animateName: string, trackTime: number){
    const trackDatas = this.trackDatas[enemyKey];
    if(trackDatas){
      const find = trackDatas.find(data => 
        data.animateName === animateName &&
        Math.abs(data.trackTime - trackTime) <= 0.001
      )

      return find;
    }

    return null;
  }
}

export default AnimationCache;