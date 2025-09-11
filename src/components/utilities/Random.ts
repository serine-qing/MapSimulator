class SeededRandom {
  public seed: number;
  private originalSeed: number;
  private a: number;
  private c: number;
  private m: number;
  constructor(seed) {
    this.seed = seed;
    this.originalSeed = seed;
    // LCG参数（数值经过精心选择）
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
}