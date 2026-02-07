import { Effect } from "./Base";

// ==========================================
// Buff
// ==========================================

export interface BuffParam {
  id: string;
  key: string;
  overlay?: boolean;
  enemy?: string[];
  enemyExclude?: string[];
  effect?: Effect[];
  duration?: number;
}

export interface Buff {
  id: string;
  key: string;
  overlay: boolean;
  effect: Effect[];
  duration?: number;
}
