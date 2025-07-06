

const tiles = {
  //有了
  "tile_bigforce": {
    "tileKey": "tile_bigforce",
    "name": "特种战术点",
    "description": "置于其中的我方单位在推动或拉动敌方单位时力度增大",
    "isFunctional": true
  },

  //有了
  "tile_corrosion": {
    "tileKey": "tile_corrosion",
    "name": "腐蚀地面",
    "description": "置于其中的干员防御力减半",
    "isFunctional": true
  },

  //跟多索雷斯不一样，这是不能进入的水地形，仅视觉效果
  //用单色地图表示吧
  "tile_deepwater": {
    "tileKey": "tile_deepwater",
    "name": "深水区",
    "description": "代表离岸较远的水地形",
    "isFunctional": false
  },

  //有了
  "tile_defup": {
    "tileKey": "tile_defup",
    "name": "防御符文",
    "description": "置于其中的干员获得额外的防御力",
    "isFunctional": true
  },

  //有了
  "tile_end": {
    "tileKey": "tile_end",
    "name": "保护目标",
    "description": "蓝色目标点，敌方进入后会减少此目标点的耐久",
    "isFunctional": true
  },

  //自己设计
  "tile_fence": {
    "tileKey": "tile_fence",
    "name": "围栏",
    "description": "可放置近战单位，不可以通行",
    "isFunctional": false
  },

  //同围栏
  "tile_fence_bound": {
    "tileKey": "tile_fence_bound",
    "name": "围墙",
    "description": "可放置近战单位，敌方无法进入",
    "isFunctional": true
  },

  //有了
  "tile_floor": {
    "tileKey": "tile_floor",
    "name": "不可放置位",
    "description": "不可放置单位，可以通行",
    "isFunctional": false
  },

  //没有
  "tile_flystart": {
    "tileKey": "tile_flystart",
    "name": "空袭侵入点",
    "description": "敌方飞行单位会从此处进入战场",
    "isFunctional": true
  },

  //有了
  "tile_forbidden": {
    "tileKey": "tile_forbidden",
    "name": "禁入区",
    "description": "不可放置单位，不可通行",
    "isFunctional": false
  },

  //有了
  "tile_gazebo": {
    "tileKey": "tile_gazebo",
    "name": "防空符文",
    "description": "置于其中的干员攻击速度略微下降，但在攻击空中单位时攻击力大幅度提升",
    "isFunctional": true
  },

  //有了
  "tile_grass": {
    "tileKey": "tile_grass",
    "name": "草丛",
    "description": "置于其中的干员不会成为敌军远程攻击的目标",
    "isFunctional": true
  },

  //有了
  "tile_healing": {
    "tileKey": "tile_healing",
    "name": "医疗符文",
    "description": "置于其中的干员会持续恢复生命",
    "isFunctional": true
  },

  //自己抠图
  "tile_hole": {
    "tileKey": "tile_hole",
    "name": "地穴",
    "description": "危险的凹陷地形或地面破洞，经过的敌人会摔落至底部直接死亡",
    "isFunctional": true
  },

  //有了
  "tile_infection": {
    "tileKey": "tile_infection",
    "name": "活性源石",
    "description": "部署的友军和经过的敌军获得攻击力和攻击速度提升的效果，但会持续失去生命",
    "isFunctional": true
  },

  //自己抠图
  "tile_rcm_crate": {
    "tileKey": "tile_rcm_crate",
    "name": "推荐障碍放置点",
    "description": "PRTS推荐的障碍物放置点",
    "isFunctional": true
  },

  //不要了
  "tile_rcm_operator": {
    "tileKey": "tile_rcm_operator",
    "name": "推荐干员放置点",
    "description": "PRTS推荐的战术放置点",
    "isFunctional": true
  },

  //有了
  "tile_road": {
    "tileKey": "tile_road",
    "name": "平地",
    "description": "可以放置近战单位，可以通行",
    "isFunctional": false
  },
  "tile_shallowwater": {
    "tileKey": "tile_shallowwater",
    "name": "浅水区",
    "description": "代表岸边的水地形",
    "isFunctional": false
  },

  //有了
  "tile_start": {
    "tileKey": "tile_start",
    "name": "侵入点",
    "description": "敌方会从此进入战场",
    "isFunctional": true
  },
  //有了
  "tile_telin": {
    "tileKey": "tile_telin",
    "name": "通道入口",
    "description": "敌方会从此进入通道，从通道出口出现",
    "isFunctional": true
  },
  //有了
  "tile_telout": {
    "tileKey": "tile_telout",
    "name": "通道出口",
    "description": "进入通道的敌方单位会从此处再度出现",
    "isFunctional": true
  },
  //有了
  "tile_volcano": {
    "tileKey": "tile_volcano",
    "name": "热泵通道",
    "description": "每隔一段时间便会喷出高温气体，对其上的任何单位造成无视防御和法抗的伤害",
    "isFunctional": true
  },
  //有了
  "tile_volspread": {
    "tileKey": "tile_volspread",
    "name": "岩浆喷射处",
    "description": "每隔一段时间会喷出岩浆，对周围8格内的我方单位造成大量伤害且可以融化障碍物",
    "isFunctional": true
  },
  //有了
  "tile_wall": {
    "tileKey": "tile_wall",
    "name": "高台",
    "description": "可以放置远程单位，不可通行",
    "isFunctional": false
  },
  //有了
  "tile_defbreak": {
    "tileKey": "tile_defbreak",
    "name": "腐蚀地面",
    "description": "置于其中的干员防御力减半",
    "isFunctional": true
  },
  //有了
  "tile_smog": {
    "tileKey": "tile_smog",
    "name": "排气格栅",
    "description": "置于其中的干员不会成为敌军远程攻击的目标",
    "isFunctional": true
  },
  //没有
  "tile_yinyang_road": {
    "tileKey": "tile_yinyang_road",
    "name": "晦明之印",
    "description": "置于其中的干员获得与其相同的明晦属性",
    "isFunctional": true
  },
  //没有
  "tile_yinyang_wall": {
    "tileKey": "tile_yinyang_wall",
    "name": "晦明之印",
    "description": "置于其中的干员获得与其相同的明晦属性",
    "isFunctional": true
  },
  //没有
  "tile_yinyang_switch": {
    "tileKey": "tile_yinyang_switch",
    "name": "朝暮之印",
    "description": "经过的敌军明晦属性变化",
    "isFunctional": true
  },
  
  //联机模式的，暂时用不上
  "tile_poison": {
    "tileKey": "tile_poison",
    "name": "瓦斯喷射器",
    "description": "置于其中的干员会持续损失生命",
    "isFunctional": true
  },

  //用单色地图表示吧
  "tile_deepsea": {
    "tileKey": "tile_deepsea",
    "name": "深水区",
    "description": "敌方在其中攻击和移动速度降低，并持续损失生命",
    "isFunctional": true
  },

  //冰面用的较少，最后考虑
  "tile_icestr": {
    "tileKey": "tile_icestr",
    "name": "冰面",
    "description": "置于其中的干员和经过的敌军周期性获得“寒冷”，摩擦系数降低",
    "isFunctional": false
  },

  "tile_icetur_lb": {
    "tileKey": "tile_icetur_lb",
    "name": "转角冰面",
    "description": "置于其中的干员和经过的敌军周期性获得“寒冷”，摩擦系数降低，改变敌人位移方向",
    "isFunctional": false
  },
  "tile_icetur_lt": {
    "tileKey": "tile_icetur_lt",
    "name": "转角冰面",
    "description": "置于其中的干员和经过的敌军周期性获得“寒冷”，摩擦系数降低，改变敌人位移方向",
    "isFunctional": false
  },
  "tile_icetur_rb": {
    "tileKey": "tile_icetur_rb",
    "name": "转角冰面",
    "description": "置于其中的干员和经过的敌军周期性获得“寒冷”，摩擦系数降低，改变敌人位移方向",
    "isFunctional": false
  },
  "tile_icetur_rt": {
    "tileKey": "tile_icetur_rt",
    "name": "转角冰面",
    "description": "置于其中的干员和经过的敌军周期性获得“寒冷”，摩擦系数降低，改变敌人位移方向",
    "isFunctional": false
  },

  //没有
  "tile_magic_circle": {
    "tileKey": "tile_magic_circle",
    "name": "激活的“谐振器”",
    "description": "部署我方单位时，发出新的<@ba.kw>重整束流</>",
    "isFunctional": false
  },
  "tile_magic_circle_h": {
    "tileKey": "tile_magic_circle_h",
    "name": "激活的“谐振器”",
    "description": "部署我方单位时，发出新的<@ba.kw>重整束流</>",
    "isFunctional": false
  },

  //都没有，自己抠图吧
  "tile_reed": {
    "tileKey": "tile_reed",
    "name": "芦苇丛",
    "description": "置于其中的干员获得\"迷彩\"",
    "isFunctional": true
  },
  "tile_reedf": {
    "tileKey": "tile_reedf",
    "name": "芦苇丛",
    "description": "不可放置单位的芦苇丛",
    "isFunctional": true
  },
  "tile_reedw": {
    "tileKey": "tile_reedw",
    "name": "芦苇丛",
    "description": "置于其中的干员获得\"迷彩\"",
    "isFunctional": true
  },
  "tile_mire": {
    "tileKey": "tile_mire",
    "name": "沼泽地段",
    "description": "置于其中的干员攻击速度逐渐降低，经过的敌人攻击速度和移动速度逐渐降低",
    "isFunctional": true
  },

  //没有
  "tile_passable_wall": {
    "tileKey": "tile_passable_wall",
    "name": "玉门天灾工事",
    "description": "置于其中的单位对地面单位造成的伤害提升，受到来自地面单位的伤害降低",
    "isFunctional": true
  },
  "tile_stairs": {
    "tileKey": "tile_stairs",
    "name": "云梯",
    "description": "敌方会从此上下玉门天灾工事",
    "isFunctional": true
  },

  //生息演算，先不管
  "tile_water": {
    "tileKey": "tile_water",
    "name": "清澈水域",
    "description": "可使用<蟹蟹抽水泵>采集<清水>",
    "isFunctional": true
  },

  //没有
  "tile_grvtybtn": {
    "tileKey": "tile_grvtybtn",
    "name": "重力感应机关",
    "description": "可被阻挡数1及以上的干员或者重量等级3及以上的敌方踩动，改变重力方向",
    "isFunctional": true
  },
  //没有
  "tile_woodrd": {
    "tileKey": "tile_woodrd",
    "name": "临时步道",
    "description": "铺设木板时可放置和通行，易被破坏变为<地穴>，放置我方单位时步道不会受到伤害",
    "isFunctional": true
  },

  "tile_green": {
    "tileKey": "tile_green",
    "name": "中转点",
    "description": "由此进入的敌方会在后续波次从<中转点>再次进入战场",
    "isFunctional": true
  },

  //没有，炎魔活动的
  "tile_volcano_strife": {
    "tileKey": "tile_volcano_strife",
    "name": "熔岩裂隙",
    "description": "每隔一段时间对周围的我方单位造成法术伤害，有干员置于此处时会向前方喷出使目标受到法术伤害增加的熔岩",
    "isFunctional": true
  },

  //生息演算的
  "tile_puddle": {
    "tileKey": "tile_puddle",
    "name": "池沼",
    "description": "<荒季>时会干涸露出地面",
    "isFunctional": true
  },
  "tile_steam": {
    "tileKey": "tile_steam",
    "name": "隐焰",
    "description": "<盛季>和<荒季>时每隔一段时间对其上的任何单位造成无视防御和法术抗性的伤害",
    "isFunctional": true
  },

  //没有
  "tile_merope": {
    "tileKey": "tile_merope",
    "name": "接驳地块",
    "description": "干员不可直接部署，需要周围有其他干员传递稳固铁链",
    "isFunctional": true
  },
  "tile_rarope": {
    "tileKey": "tile_rarope",
    "name": "接驳地块",
    "description": "干员不可直接部署，需要周围有其他干员传递稳固铁链",
    "isFunctional": true
  },

  //合作模式的
  "tile_end_cooperate": {
    "tileKey": "tile_end_cooperate",
    "name": "保护目标",
    "description": "敌方进入蓝色目标点后减少你的关卡生命值；进入绿色目标点后减少协作者的关卡生命值",
    "isFunctional": true
  },

  //没有
  "tile_toxicwall": {
    "tileKey": "tile_toxicwall",
    "name": "源石污染区",
    "description": "使位于其上的单位持续受到真实伤害并且技力回复速度大幅度降低",
    "isFunctional": false
  },
  "tile_toxichill": {
    "tileKey": "tile_toxichill",
    "name": "源石污染区",
    "description": "使位于其上的单位持续受到真实伤害并且技力回复速度大幅度降低",
    "isFunctional": false
  },
  "tile_toxicroad": {
    "tileKey": "tile_toxicroad",
    "name": "源石污染区",
    "description": "使位于其上的单位持续受到真实伤害并且技力回复速度大幅度降低",
    "isFunctional": false
  },
  "tile_toxic": {
    "tileKey": "tile_toxic",
    "name": "源石污染区",
    "description": "使位于其上的单位持续受到真实伤害并且技力回复速度大幅度降低",
    "isFunctional": false
  },

  //没有
  "tile_cnvfuse": {
    "tileKey": "tile_cnvfuse",
    "name": "引线地块",
    "description": "烟花引线燃烧的路径，可部署",
    "isFunctional": false
  },
  "tile_cnvfuse_fbd": {
    "tileKey": "tile_cnvfuse_fbd",
    "name": "引线地块",
    "description": "烟花引线燃烧的路径，不可部署",
    "isFunctional": false
  },

  //自走棋模式的 不需要
  "tile_acshop": {
    "tileKey": "tile_acshop",
    "name": "驳船区",
    "description": "可购买干员和道具出现的区域",
    "isFunctional": false
  },
  "tile_achand": {
    "tileKey": "tile_achand",
    "name": "手牌区",
    "description": "待部署区域，置于其中的干员不会加入战斗",
    "isFunctional": false
  },

  //没有
  "tile_quicksand": {
    "tileKey": "tile_quicksand",
    "name": "盐漠",
    "description": "经过的敌人移动速度降低，停留一段时间后会摔落至远处直接被击倒",
    "isFunctional": true
  },
  //就当普通地面，不用管
  "tile_sandrope": {
    "tileKey": "tile_sandrope",
    "name": "悬索桥起点",
    "description": "悬索桥起点",
    "isFunctional": false
  },
  "tile_sandrope_2": {
    "tileKey": "tile_sandrope_2",
    "name": "悬索桥起点",
    "description": "悬索桥起点，不可部署",
    "isFunctional": false
  },

  //没有
  "tile_ftplant_road": {
    "tileKey": "tile_ftplant_road",
    "name": "草毯",
    "description": "可以生长<树丛>，置于其上的单位持续受到法术伤害",
    "isFunctional": true
  },
  "tile_ftplant_roadf": {
    "tileKey": "tile_ftplant_roadf",
    "name": "草毯",
    "description": "可以生长<树丛>，置于其上的单位持续受到法术伤害",
    "isFunctional": true
  },
  "tile_ftplant_wall": {
    "tileKey": "tile_ftplant_wall",
    "name": "草毯",
    "description": "可以生长<树丛>，置于其上的单位持续受到法术伤害",
    "isFunctional": true
  },

  //挽歌燃烧殆尽的假红门
  "tile_ftstart": {
    "tileKey": "tile_ftstart",
    "name": "侵入点",
    "description": "敌方会从此进入战场",
    "isFunctional": true
  },

  //找不到，没用
  "tile_act6fun_start": {
    "tileKey": "tile_act6fun_start",
    "name": "进攻点",
    "description": "我方战士会从此进入战场",
    "isFunctional": true
  },
  "tile_act6fun_end": {
    "tileKey": "tile_act6fun_end",
    "name": "攻略目标",
    "description": "蓝色目标点，进入后获得本次行动胜利",
    "isFunctional": true
  },

  //没有
  "tile_mpprts_enemy_born": {
    "tileKey": "tile_mpprts_enemy_born",
    "name": "未授权重构界面",
    "description": "<侵入式调用>将从这里部署敌人",
    "isFunctional": true
  },

  //没有
  "tile_sleep_road": {
    "tileKey": "tile_sleep_road",
    "name": "入梦砖",
    "description": "置于其中的干员会立刻被拖入美梦中",
    "isFunctional": true
  },
  "tile_sleep_wall": {
    "tileKey": "tile_sleep_wall",
    "name": "入梦砖",
    "description": "置于其中的干员会立刻被拖入美梦中",
    "isFunctional": true
  }
}
