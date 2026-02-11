// ==========================================
// 基础类型定义
// ==========================================


// 二维向量
export interface Vec2 {
  x: number;
  y: number;
}

/**
 * 用x,y表示的某个点
 */
export interface Point{
  x: number
  y: number
}

export type Direction = "up" | "down" | "left" | "right";

// 键值对
export interface KeyValue {
  key: string;
  value: any;
}

// 黑板数据
export interface BlackBoard {
  key: string;
  value: number;
  valueStr: string | null;
}

// 效果定义
export interface Effect {
  attrKey: string;
  method: "add" | "mul";
  value: number;
}

// ==========================================
// 全局扩展声明
// ==========================================

declare global {
  interface Array<T> {
    remove(item: T): void;
    equal(array: any[]): boolean;
  }

  interface Math {
    clamp(x: number, min: number, max: number): number;
  }
}
