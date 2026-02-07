import { LevelType } from "@/components/utilities/Enum";

// ==========================================
// 常量定义
// ==========================================

// 抗性表
export const immuneTable = {
  stunImmune: "晕眩抗性",
  silenceImmune: "沉默抗性",
  sleepImmune: "沉睡抗性",
  frozenImmune: "冻结抗性",
  levitateImmune: "浮空抗性",
  disarmedCombatImmune: "战栗抗性",
  fearedImmune: "恐惧抗性",
  palsyImmune: "麻痹抗性",
  attractImmune: "诱导抗性"
};

// Math 扩展函数
export function math_clamp(x: number, min: number, max: number): number {
  return Math.max(Math.min(x, max), min);
}

// Array 扩展函数
export function array_remove<T>(this: T[], item: T): void {
  const index = this.findIndex(i => i === item);
  if (index > -1) {
    this.splice(index, 1);
  }
}

export function array_equal(this: any[], array: any[]): boolean {
  if (this.length !== array.length) return false;

  for (let i = 0; i < this.length; i++) {
    const findIndex = array.findIndex(item => item === this[i]);
    if (findIndex === -1) return false;
  }

  return true;
}

// ==========================================
// 原型挂载 (副作用)
// ==========================================

// 给 Array.prototype 添加扩展方法
Array.prototype.remove = function(item: any) {
  const index = this.findIndex(i => i === item);
  if (index > -1) {
    this.splice(index, 1);
  }
};

Array.prototype.equal = function(array: any[]): boolean {
  if (this.length !== array.length) return false;

  for (let i = 0; i < this.length; i++) {
    const findIndex = array.findIndex(item => item === this[i]);
    if (findIndex === -1) return false;
  }

  return true;
};

// 给 Math 添加 clamp 方法
Math.clamp = function(x: number, min: number, max: number): number {
  return Math.max(Math.min(x, max), min);
};
