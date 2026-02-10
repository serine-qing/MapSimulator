// 关卡信息
export interface Stage{
  id: string,
  operation: string,
  name: string,
  description: string,
  episode: string,
  levelId: string,
  hasChallenge: boolean,   //是否有突袭
  challenge?: string,       //突袭条件(有这个key意味着是突袭关)
  sandTable?: any[],       //沙盘推演数据
}