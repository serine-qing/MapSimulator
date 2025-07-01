class RunesHelper{
  private runes: any[];
  private enemyGroupEnable: string[] = [];       //额外出现某组敌人
  private enemyGroupDisable: string[] = [];      //移除某组敌人
  private enemyChanges: { [ key:string ] : string } = {};      //移除某组敌人
  private enemyAttributeChanges: { [ key:string ] : number } = {};     //敌人属性提升
  constructor(runes: any){
    this.runes = runes;

    this.runes.forEach(rune => {
      const blackboard = rune.blackboard;
      switch (rune.key) {
      
        case "level_hidden_group_enable":
          this.enemyGroupEnable = [
            ...blackboard.map( i => i.valueStr),
            ...this.enemyGroupEnable
          ]
          break;
        
        case "level_hidden_group_disable":
          this.enemyGroupDisable = [
            ...blackboard.map( i => i.valueStr),
            ...this.enemyGroupEnable
          ]
          break; 

        //敌人更换
        case "level_enemy_replace":
          const changeFrom = blackboard[0].valueStr;
          const changeTo = blackboard[1].valueStr;
          this.enemyChanges[changeFrom] = changeTo;
        
        //敌人属性修改
        case "enemy_attribute_mul":
          blackboard.forEach( item => {
            const { key, value } = item;

            //如果有多次属性提升，就叠乘
            if(this.enemyAttributeChanges[key]){
              this.enemyAttributeChanges[key] *= value;
            }else{
              this.enemyAttributeChanges[key] = value;
            }

          })
          break;
      }

    })

    console.log(this.enemyAttributeChanges);
  }

  public checkEnemyGroup(group: string): boolean{
    return !group || this.enemyGroupEnable.includes(group) && !this.enemyGroupDisable.includes(group);
  }

  public checkEnemyChange(key: string): string{
    const change = this.enemyChanges[key];
    return change? change : key;
  }
}

export default RunesHelper;