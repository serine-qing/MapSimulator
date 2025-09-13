import Global from "./Global";

class SeededRandom {
  public seed: number;
  private originalSeed: number;
  private a: number;
  private c: number;
  private m: number;
  constructor(seed) {
    Global.seededRandom = this;
    this.seed = seed;
    this.originalSeed = seed;
    //线性同余生成器(LCG)
    this.a = 1664525;
    this.c = 1013904223;
    this.m = Math.pow(2, 32);
  }
  
  // 生成0到1之间的随机数
  next() {
    this.seed = (this.a * this.seed + this.c) % this.m;
    return this.seed / this.m;
  }
  
  // 生成指定范围的随机整数
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  // 生成指定范围的随机浮点数
  nextFloat(min, max) {
    return this.next() * (max - min) + min;
  }
  
  // 重置生成器
  reset() {
    this.seed = this.originalSeed;
  }

  get(){
    const states = {
      seed: this.seed
    };
    return states;
  }

  set(states){
    const { seed } = states;
    this.seed = seed;
  }
}

export default SeededRandom;