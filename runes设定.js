const runes = {
  //额外出现某组敌人
  "level_hidden_group_enable": [
    {
      "operation": "TB-1突袭",
      "challenge": "额外出现4个泥岩巨像",
      "levelId": "activities/act10mini/level_act10mini_01.json"
    },
    {
      "operation": "TC-8突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，额外出现敌人：法术大师A1×2{1st}，危险术师囚犯×2{14th}",
      "levelId": "activities/act11mini/level_act11mini_08.json"
    },
    {
      "operation": "AW-1突袭",
      "challenge": "出现伦蒂尼姆城防副炮",
      "levelId": "activities/act12mini/level_act12mini_01.json"
    },
    {
      "operation": "AW-2突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act12mini/level_act12mini_02.json"
    },
    {
      "operation": "AW-8突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act12mini/level_act12mini_08.json"
    },
    {
      "operation": "FA-8突袭",
      "challenge": "敌方单位的攻击力、生命值提升至105%，额外出现4个敌人：爆破攻坚手、萨卡兹百夫长、萨卡兹穿刺手组长*2",
      "levelId": "activities/act13d0/level_act13d0_08.json"
    },
    {
      "operation": "NL-S-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值额外提升至110%，额外出现无胄盟第三小队组长×1（左上，8th）、无胄盟清扫小队组长×1（左下，29th）",
      "levelId": "activities/act13side/level_act13side_sub-1-1.json"
    },
    {
      "operation": "NL-S-4突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都额外提升至110%，血骑士额外召唤凝血之刃×9",
      "levelId": "activities/act13side/level_act13side_sub-1-4.json"
    },
    {
      "operation": "DC-2突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act14mini/level_act14mini_02.json"
    },
    {
      "operation": "BI-EX-5突袭",
      "challenge": "敌方单位的防御力和生命值提升至110%，额外出现11个冰原御法者，冰原御法者的生命值额外提升至150%（与前乘算）",
      "levelId": "activities/act14side/level_act14side_ex05.json"
    },
    {
      "operation": "MB-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  额外出现1个传奇重犯，2个术师囚犯被替换为危险术师囚犯",
      "levelId": "activities/act15d0/level_act15d0_ex08.json"
    },
    {
      "operation": "MB-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  额外出现1个传奇重犯，2个术师囚犯被替换为危险术师囚犯",
      "levelId": "activities/act15d0/level_act15d0_ex08.json"
    },
    {
      "operation": "FD-7突袭",
      "challenge": "<城市霓虹>的数量与位置改变",
      "levelId": "activities/act15mini/level_act15mini_07.json"
    },
    {
      "operation": "FD-7突袭",
      "challenge": "<城市霓虹>的数量与位置改变",
      "levelId": "activities/act15mini/level_act15mini_07.json"
    },
    {
      "operation": "IW-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，额外出现<堂皇>*2",
      "levelId": "activities/act15side/level_act15side_ex07.json"
    },
    {
      "operation": "TG-8突袭",
      "challenge": "“越长尘”出现得更多，并获得隐匿",
      "levelId": "activities/act16mini/level_act16mini_08.json"
    },
    {
      "operation": "GA-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至115%，额外出现：寻路者阵地撕裂者×1{43th}，寻路者突击手×11[2,3,4变4,4,6,6}",
      "levelId": "activities/act16side/level_act16side_ex07.json"
    },
    {
      "operation": "KR-2突袭",
      "challenge": "部分暴徒变为幽灵",
      "levelId": "activities/act17mini/level_act17mini_02.json"
    },
    {
      "operation": "KR-2突袭",
      "challenge": "部分暴徒变为幽灵",
      "levelId": "activities/act17mini/level_act17mini_02.json"
    },
    {
      "operation": "KR-5突袭",
      "challenge": "2个城防自走炮初始位置发生改变",
      "levelId": "activities/act17mini/level_act17mini_05.json"
    },
    {
      "operation": "KR-5突袭",
      "challenge": "2个城防自走炮初始位置发生改变",
      "levelId": "activities/act17mini/level_act17mini_05.json"
    },
    {
      "operation": "KR-6突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act17mini/level_act17mini_06.json"
    },
    {
      "operation": "SN-EX-4突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，额外出现的敌人如下： 富营养的喷溅者*4{开局左下红门刷出并前往左边四个溟痕罚站120秒，与普通难度右侧四个喷溅者完全对称}",
      "levelId": "activities/act17side/level_act17side_ex04.json"
    },
    {
      "operation": "WD-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至105%，生命值提升至110%，额外出现以下敌人：战术猎犬×4、战术猎犬pro×8、反装甲步兵×8，所有追加的敌人的属性和本关卡中出现过的同类型敌人相同",
      "levelId": "activities/act18d0/level_act18d0_ex03.json"
    },
    {
      "operation": "SE-2突袭",
      "challenge": "出现额外的深池逐火战士",
      "levelId": "activities/act18mini/level_act18mini_02.json"
    },
    {
      "operation": "SE-5突袭",
      "challenge": "战场中出现<活性源石风暴>",
      "levelId": "activities/act18mini/level_act18mini_05.json"
    },
    {
      "operation": "SE-S-1",
      "levelId": "activities/act18mini/level_act18mini_sub-1-1.json"
    },
    {
      "operation": "LE-EX-4突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act18side/level_act18side_ex04.json"
    },
    {
      "operation": "DV-EX-8突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act19side/level_act19side_ex08.json"
    },
    {
      "operation": "FIN-TS",
      "levelId": "activities/act1lock/level_act1lock_c-01.json"
    },
    {
      "operation": "FIN-TS",
      "levelId": "activities/act1lock/level_act1lock_c-01.json"
    },
    {
      "operation": "FIN-TS",
      "levelId": "activities/act1lock/level_act1lock_c-01.json"
    },
    {
      "operation": "FIN-TS",
      "levelId": "activities/act1lock/level_act1lock_c-01.json"
    },
    {
      "operation": "IC-EX-1突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_ex01.json"
    },
    {
      "operation": "IC-EX-3突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_ex03.json"
    },
    {
      "operation": "IC-S-1突袭",
      "challenge": "酒类协会会员的能力持续时间大幅提升，且出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_sub-1-1.json"
    },
    {
      "operation": "IS-EX-1突袭",
      "challenge": "叙拉古平民数量减少",
      "levelId": "activities/act21side/level_act21side_ex01.json"
    },
    {
      "operation": "IS-EX-2突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act21side/level_act21side_ex02.json"
    },
    {
      "operation": "IS-EX-8突袭",
      "challenge": "叙拉古平民数量减少",
      "levelId": "activities/act21side/level_act21side_ex08.json"
    },
    {
      "operation": "IS-S-1突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act21side/level_act21side_sub-1-1.json"
    },
    {
      "operation": "IS-S-4突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act21side/level_act21side_sub-1-4.json"
    },
    {
      "operation": "CF-EX-1突袭",
      "challenge": "威胁村庄的可能，情况危急。\n附加条件：\n出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex01.json"
    },
    {
      "operation": "CF-EX-1突袭",
      "challenge": "威胁村庄的可能，情况危急。\n附加条件：\n出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex01.json"
    },
    {
      "operation": "CF-EX-2突袭",
      "challenge": "突然涌出大量暴躁的野兽，亟待处置。\n附加条件：\n炽焰源石虫的生命值大幅提升，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex02.json"
    },
    {
      "operation": "CF-EX-2突袭",
      "challenge": "突然涌出大量暴躁的野兽，亟待处置。\n附加条件：\n炽焰源石虫的生命值大幅提升，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex02.json"
    },
    {
      "operation": "CF-EX-5突袭",
      "challenge": "的肆虐已构成极大威胁，必须及时处理。\n附加条件：\n我方单位阻挡数-1，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex05.json"
    },
    {
      "operation": "CF-EX-7突袭",
      "challenge": "点，照耀前路的英雄才能通过此考验。\n附加条件：战场中的8个位置无法部署我方单位，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex07.json"
    },
    {
      "operation": "CF-EX-7突袭",
      "challenge": "点，照耀前路的英雄才能通过此考验。\n附加条件：战场中的8个位置无法部署我方单位，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex07.json"
    },
    {
      "operation": "CW-EX-3突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act25side/level_act25side_ex03.json"
    },
    {
      "operation": "SL-EX-4突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act27side/level_act27side_ex04.json"
    },
    {
      "operation": "SL-S-4突袭",
      "challenge": "替换部分敌人",
      "levelId": "activities/act27side/level_act27side_sub-1-4.json"
    },
    {
      "operation": "SL-S-4突袭",
      "challenge": "替换部分敌人",
      "levelId": "activities/act27side/level_act27side_sub-1-4.json"
    },
    {
      "operation": "CV-EX-3突袭",
      "challenge": "出现额外<废热喷口>",
      "levelId": "activities/act28side/level_act28side_ex03.json"
    },
    {
      "operation": "RS-EX-5突袭",
      "challenge": "场上初始出现额外敌人",
      "levelId": "activities/act30side/level_act30side_ex05.json"
    },
    {
      "operation": "RS-EX-5突袭",
      "challenge": "场上初始出现额外敌人",
      "levelId": "activities/act30side/level_act30side_ex05.json"
    },
    {
      "operation": "RS-EX-6突袭",
      "challenge": "“沉眠高山驮兽”初始位置改变",
      "levelId": "activities/act30side/level_act30side_ex06.json"
    },
    {
      "operation": "RS-EX-6突袭",
      "challenge": "“沉眠高山驮兽”初始位置改变",
      "levelId": "activities/act30side/level_act30side_ex06.json"
    },
    {
      "operation": "HS-EX-5突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act31side/level_act31side_ex05.json"
    },
    {
      "operation": "HS-S-3突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act31side/level_act31side_sub-1-3.json"
    },
    {
      "operation": "CR-EX-3突袭",
      "challenge": "出现额外的无畏掷弹兵",
      "levelId": "activities/act32side/level_act32side_ex03.json"
    },
    {
      "operation": "CR-EX-3突袭",
      "challenge": "出现额外的无畏掷弹兵",
      "levelId": "activities/act32side/level_act32side_ex03.json"
    },
    {
      "operation": "CR-EX-5突袭",
      "challenge": "出现额外的无畏掷弹兵",
      "levelId": "activities/act32side/level_act32side_ex05.json"
    },
    {
      "operation": "CR-EX-8突袭",
      "challenge": "出现额外的精英敌人",
      "levelId": "activities/act32side/level_act32side_ex08.json"
    },
    {
      "operation": "BB-EX-1突袭",
      "challenge": "出现额外的萨卡兹刀术师",
      "levelId": "activities/act33side/level_act33side_ex01.json"
    },
    {
      "operation": "BB-EX-3突袭",
      "challenge": "出现额外的流浪佣兵“编织者”",
      "levelId": "activities/act33side/level_act33side_ex03.json"
    },
    {
      "operation": "BB-S-1突袭",
      "challenge": "出现额外的流浪佣兵“编织者”，流浪佣兵“编织者”的生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_sub-1-1.json"
    },
    {
      "operation": "BB-S-3突袭",
      "challenge": "巫术弩炮的等级提升",
      "levelId": "activities/act33side/level_act33side_sub-1-3.json"
    },
    {
      "operation": "BB-S-3突袭",
      "challenge": "巫术弩炮的等级提升",
      "levelId": "activities/act33side/level_act33side_sub-1-3.json"
    },
    {
      "operation": "BP-EX-1突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act34side/level_act34side_ex01.json"
    },
    {
      "operation": "BP-EX-3突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "activities/act34side/level_act34side_ex03.json"
    },
    {
      "operation": "BP-EX-3突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "activities/act34side/level_act34side_ex03.json"
    },
    {
      "operation": "BP-EX-4突袭",
      "challenge": "初始出现额外的敌人",
      "levelId": "activities/act34side/level_act34side_ex04.json"
    },
    {
      "operation": "BP-EX-5突袭",
      "challenge": "初始存在的赘生甲壳数量减少",
      "levelId": "activities/act34side/level_act34side_ex05.json"
    },
    {
      "operation": "AS-EX-4突袭",
      "challenge": "初始出现额外的“弹跳独轮车”",
      "levelId": "activities/act35side/level_act35side_ex04.json"
    },
    {
      "operation": "AS-EX-5突袭",
      "challenge": "出现额外的工蚁组长",
      "levelId": "activities/act35side/level_act35side_ex05.json"
    },
    {
      "operation": "AS-EX-5突袭",
      "challenge": "出现额外的工蚁组长",
      "levelId": "activities/act35side/level_act35side_ex05.json"
    },
    {
      "operation": "AS-S-2突袭",
      "challenge": "初始大型破碎器皿的行动路线有所不同，场上有2个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-2.json"
    },
    {
      "operation": "AS-S-2突袭",
      "challenge": "初始大型破碎器皿的行动路线有所不同，场上有2个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-2.json"
    },
    {
      "operation": "DT-EX-2突袭",
      "challenge": "出现额外的<暴走食人花>",
      "levelId": "activities/act36side/level_act36side_ex02.json"
    },
    {
      "operation": "DT-EX-5突袭",
      "challenge": "初始场上的<硕果虫>不再出现",
      "levelId": "activities/act36side/level_act36side_ex05.json"
    },
    {
      "operation": "GO-EX-5突袭",
      "challenge": "场上部分军工厂指令平台消失",
      "levelId": "activities/act37side/level_act37side_ex05.json"
    },
    {
      "operation": "GO-EX-7突袭",
      "challenge": "场上出现额外的大容量物资运输艇，部分大容量物资运输艇初始位置改变",
      "levelId": "activities/act37side/level_act37side_ex07.json"
    },
    {
      "operation": "GO-EX-7突袭",
      "challenge": "场上出现额外的大容量物资运输艇，部分大容量物资运输艇初始位置改变",
      "levelId": "activities/act37side/level_act37side_ex07.json"
    },
    {
      "operation": "PV-EX-5突袭",
      "challenge": "初始场上出现<“美食速递”>",
      "levelId": "activities/act38side/level_act38side_ex05.json"
    },
    {
      "operation": "PV-EX-7突袭",
      "challenge": "初始场上的<专业竞演者>路线改变",
      "levelId": "activities/act38side/level_act38side_ex07.json"
    },
    {
      "operation": "PV-EX-7突袭",
      "challenge": "初始场上的<专业竞演者>路线改变",
      "levelId": "activities/act38side/level_act38side_ex07.json"
    },
    {
      "operation": "PV-S-1突袭",
      "challenge": "所有<“美食速递”>替换为<“醉后狂欢”>，且我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_sub-1-1.json"
    },
    {
      "operation": "PV-S-1突袭",
      "challenge": "所有<“美食速递”>替换为<“醉后狂欢”>，且我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_sub-1-1.json"
    },
    {
      "operation": "PV-S-4突袭",
      "challenge": "场上出现额外的<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-4.json"
    },
    {
      "operation": "PV-S-5突袭",
      "challenge": "场上出现额外的<热烈舞团领舞者>，且所有<专业竞演者>替换为<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-5.json"
    },
    {
      "operation": "PV-S-5突袭",
      "challenge": "场上出现额外的<热烈舞团领舞者>，且所有<专业竞演者>替换为<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-5.json"
    },
    {
      "operation": "EP-EX-4突袭",
      "challenge": "场上额外出现2个恐怖厨子",
      "levelId": "activities/act39side/level_act39side_ex04.json"
    },
    {
      "operation": "OR-EX-1突袭",
      "challenge": "场上出现额外的“饱食”",
      "levelId": "activities/act40side/level_act40side_ex01.json"
    },
    {
      "operation": "OR-EX-2突袭",
      "challenge": "场上出现额外的飘香",
      "levelId": "activities/act40side/level_act40side_ex02.json"
    },
    {
      "operation": "OR-EX-5突袭",
      "challenge": "出现额外的“里子”",
      "levelId": "activities/act40side/level_act40side_ex05.json"
    },
    {
      "operation": "OR-EX-6突袭",
      "challenge": "出现额外的招财",
      "levelId": "activities/act40side/level_act40side_ex06.json"
    },
    {
      "operation": "OR-EX-7突袭",
      "challenge": "<火灶>和<废弃火灶>位置改变，部分敌人类型改变",
      "levelId": "activities/act40side/level_act40side_ex07.json"
    },
    {
      "operation": "OR-EX-7突袭",
      "challenge": "<火灶>和<废弃火灶>位置改变，部分敌人类型改变",
      "levelId": "activities/act40side/level_act40side_ex07.json"
    },
    {
      "operation": "MT-S-1突袭",
      "challenge": "出现额外敌人且部分<冰淇淋机>初始阵营改变",
      "levelId": "activities/act42side/level_act42side_sub-1-1.json"
    },
    {
      "operation": "MT-S-1突袭",
      "challenge": "出现额外敌人且部分<冰淇淋机>初始阵营改变",
      "levelId": "activities/act42side/level_act42side_sub-1-1.json"
    },
    {
      "operation": "MT-S-2突袭",
      "challenge": "出现额外敌人且<荒原窃盗者精英>获得隐匿",
      "levelId": "activities/act42side/level_act42side_sub-1-2.json"
    },
    {
      "operation": "MT-S-3突袭",
      "challenge": "出现额外敌人且<资深圣堂保育员>生命值提升",
      "levelId": "activities/act42side/level_act42side_sub-1-3.json"
    },
    {
      "operation": "MT-S-4突袭",
      "challenge": "<腐败萃聚使徒>位置和路线变化",
      "levelId": "activities/act42side/level_act42side_sub-1-4.json"
    },
    {
      "operation": "MT-S-4突袭",
      "challenge": "<腐败萃聚使徒>位置和路线变化",
      "levelId": "activities/act42side/level_act42side_sub-1-4.json"
    },
    {
      "operation": "MT-S-5突袭",
      "challenge": "<“圣徒”>额外进行一次<寻根圣事>",
      "levelId": "activities/act42side/level_act42side_sub-1-5.json"
    },
    {
      "operation": "AD-EX-3突袭",
      "challenge": "出现额外的顺从内心的设计师",
      "levelId": "activities/act43side/level_act43side_ex03.json"
    },
    {
      "operation": "AD-EX-4突袭",
      "challenge": "出现额外的沉浸艺术的群演，且沉浸艺术的群演获得隐匿",
      "levelId": "activities/act43side/level_act43side_ex04.json"
    },
    {
      "operation": "VI-1突袭",
      "challenge": "游击队盾卫数量减少，额外出现一名提亚卡乌冠军；敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act8mini/level_act8mini_01.json"
    },
    {
      "operation": "VI-2突袭",
      "challenge": "额外出现一名战争幽灵；敌方单位的攻击力提升至105%，生命值提升至110%",
      "levelId": "activities/act8mini/level_act8mini_02.json"
    },
    {
      "operation": "PS-3突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%，额外出现以下敌人：高阶术师×4（左下，7th、14th、24th、29th），宿主拾荒者×1（左上，10th），宿主流浪者×1（左上，31st）",
      "levelId": "activities/act9mini/level_act9mini_03.json"
    },
    {
      "operation": "PS-5突袭",
      "challenge": "{中间两个红门上下和地图最左上角左下角}开局额外出现4名<反装甲步兵组长>，敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "activities/act9mini/level_act9mini_05.json"
    },
    {
      "operation": "15-13突袭",
      "challenge": "我方单位的攻击力降低",
      "levelId": "obt/main/level_main_15-12.json"
    },
    {
      "operation": "15-13突袭",
      "challenge": "我方单位的攻击力降低",
      "levelId": "obt/main/level_main_15-12.json"
    },
    {
      "operation": "15-17突袭",
      "challenge": "敌人的攻击力大幅提升",
      "levelId": "obt/main/level_main_15-15.json"
    }
  ],
  //移除某组敌人
  "level_hidden_group_disable": [
    {
      "operation": "IS-EX-1突袭",
      "challenge": "叙拉古平民数量减少",
      "levelId": "activities/act21side/level_act21side_ex01.json"
    },
    {
      "operation": "CF-EX-7突袭",
      "challenge": "点，照耀前路的英雄才能通过此考验。\n附加条件：战场中的8个位置无法部署我方单位，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex07.json"
    },
    {
      "operation": "GO-EX-5突袭",
      "challenge": "场上部分军工厂指令平台消失",
      "levelId": "activities/act37side/level_act37side_ex05.json"
    },
    {
      "operation": "MT-S-5突袭",
      "challenge": "<“圣徒”>额外进行一次<寻根圣事>",
      "levelId": "activities/act42side/level_act42side_sub-1-5.json"
    }
  ],
  //敌人更换
  "level_enemy_replace": [
    {
      "operation": "BW-3突袭",
      "challenge": "萨卡兹魔剑组长变为萨卡兹积怨者",
      "levelId": "activities/act13mini/level_act13mini_03.json"
    },
    {
      "operation": "TG-7突袭",
      "challenge": "凶豕兽变得更加狂暴",
      "levelId": "activities/act16mini/level_act16mini_07.json"
    },
    {
      "operation": "KR-1突袭",
      "challenge": "破阵者替换为破阵者组长",
      "levelId": "activities/act17mini/level_act17mini_01.json"
    },
    {
      "operation": "SE-4突袭",
      "challenge": "孽罪奇美拉替换为渎罪奇美拉",
      "levelId": "activities/act18mini/level_act18mini_04.json"
    },
    {
      "operation": "LE-EX-3突袭",
      "challenge": "黑水源石虫和黑水源石虫·α变为高能源石虫",
      "levelId": "activities/act18side/level_act18side_ex03.json"
    },
    {
      "operation": "LE-EX-3突袭",
      "challenge": "黑水源石虫和黑水源石虫·α变为高能源石虫",
      "levelId": "activities/act18side/level_act18side_ex03.json"
    },
    {
      "operation": "GO-EX-1突袭",
      "challenge": "所有敌人出场时携带未装配刀片",
      "levelId": "activities/act37side/level_act37side_ex01.json"
    },
    {
      "operation": "GO-EX-1突袭",
      "challenge": "所有敌人出场时携带未装配刀片",
      "levelId": "activities/act37side/level_act37side_ex01.json"
    },
    {
      "operation": "GO-EX-6突袭",
      "challenge": "“护目镜”帮派打手出场时携带冲击式施术单元",
      "levelId": "activities/act37side/level_act37side_ex06.json"
    },
    {
      "operation": "PV-EX-6突袭",
      "challenge": "<烟花发射器>引线火苗变弱",
      "levelId": "activities/act38side/level_act38side_ex06.json"
    },
    {
      "operation": "PV-S-2突袭",
      "challenge": "所有<巡游爵士乐手>替换为<“美食速递”>",
      "levelId": "activities/act38side/level_act38side_sub-1-2.json"
    },
    {
      "operation": "PV-S-5突袭",
      "challenge": "场上出现额外的<热烈舞团领舞者>，且所有<专业竞演者>替换为<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-5.json"
    },
    {
      "operation": "OR-S-1突袭",
      "challenge": "“废食”召唤技能冷却时间减少",
      "levelId": "activities/act40side/level_act40side_sub-1-1.json"
    },
    {
      "operation": "AD-EX-8突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "activities/act43side/level_act43side_ex08.json"
    },
    {
      "operation": "15-5突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-04.json"
    },
    {
      "operation": "15-12突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-11.json"
    },
    {
      "operation": "15-15突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-14.json"
    }
  ],
  //ban格子
  "global_forbid_location": [
    {
      "operation": "TB-2突袭",
      "challenge": "敌方单位的生命值提升至150%，战场中的 (5,4)、(5,5)、(5,6)、(3,5)、(3,6)、(3,7)、(3,3)7个位置无法部署我方单位{上红门为(4,3)，下红门为(0,5)}",
      "levelId": "activities/act10mini/level_act10mini_02.json"
    },
    {
      "operation": "TB-4突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，粉碎攻坚组长的生命值额外提升至200%，战场中的(5,6)1个位置无法部署我方单位{最上方高台}",
      "levelId": "activities/act10mini/level_act10mini_04.json"
    },
    {
      "operation": "TB-6突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110%，战场中(2,6)、(2,7)、(2,10)、(1,6)、(1,7)、(1,8)、(3,6)、(3,7)8个位置无法部署我方单位{最右下角八个格子}",
      "levelId": "activities/act10mini/level_act10mini_06.json"
    },
    {
      "operation": "TW-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，无法部署单位的4个位置：(4,5)，(4,6)，(3,5)，(3,6)",
      "levelId": "activities/act11d0/level_act11d0_ex01.json"
    },
    {
      "operation": "TW-S-1突袭",
      "challenge": "使用固定干员进行作战，初始COST-10，可部署上限-2",
      "levelId": "activities/act11d0/level_act11d0_sub-1-1.json"
    },
    {
      "operation": "TW-S-2突袭",
      "challenge": "使用固定干员进行作战",
      "levelId": "activities/act11d0/level_act11d0_sub-1-2.json"
    },
    {
      "operation": "RI-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110% 无法部署的7个位置(Y,X)如下 (2,3)、(3,3)、(4,4)、(4,7)、(5,7)、(6,7)、(6,6)",
      "levelId": "activities/act12d0/level_act12d0_ex08.json"
    },
    {
      "operation": "DH-EX-3突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，“风筝”的技力消耗降低至75%，场上坐标为(1,6)(3,9)(4,9)的3个位置{正下方河道入口和最右侧俩个高台}无法部署",
      "levelId": "activities/act12side/level_act12side_ex03.json"
    },
    {
      "operation": "DH-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至120%，防御力提升至120%，生命值提升至120%，场上坐标为 (5,9)(5,10)(6,11)(1,11)(2,9)(2,10)的6个位置{蓝门上下两行各两个地板和最右侧两个高台}无法部署",
      "levelId": "activities/act12side/level_act12side_ex07.json"
    },
    {
      "operation": "MN-EX-8突袭",
      "challenge": "医疗符文及上下共六个位置无法部署我方单位  敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act13d5/level_act13d5_ex08.json"
    },
    {
      "operation": "NL-EX-3突袭",
      "challenge": "敌方单位的防御力、生命值提升至105%，战场中(3,5)(5,5)(2,6)(3,7)(4,3)(3,3)6个位置无法部署我方单位{蓝门为(4,5)，上下两格为(5,5)(3,5)}",
      "levelId": "activities/act13side/level_act13side_ex03.json"
    },
    {
      "operation": "BI-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%。战场中(4,5)(4,6)(4,7)(4,8)(3,5)(3,6)(3,7)(3,8)8个位置无法部署我方单位{蓝门为(6,5)，蓝门下两格为(4,5)}",
      "levelId": "activities/act14side/level_act14side_ex07.json"
    },
    {
      "operation": "MB-EX-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  战场中的4个位置无法部署我方单位，分别是左上方两个地面及一个高台还有传送门出口",
      "levelId": "activities/act15d0/level_act15d0_ex05.json"
    },
    {
      "operation": "BH-2突袭",
      "challenge": "场上正中间3个地面无法部署我方单位  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d5/level_act15d5_02.json"
    },
    {
      "operation": "IW-EX-5突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至120%，战场中(1,9)、(2,9)、(3,9)、(1,10)、(2,10)、(3,10)、(4,10)、(5,10)的8个位置无法部署我方单位{最右下两列}",
      "levelId": "activities/act15side/level_act15side_ex05.json"
    },
    {
      "operation": "WR-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，战场中的9个位置无法部署我方单位{(3,4)、(5,3)、(5,4)、(5,7)、(5,8)、(3,7)、(2,7)、(2,10)、(4,10)}",
      "levelId": "activities/act16d5/level_act16d5_ex07.json"
    },
    {
      "operation": "TG-2突袭",
      "challenge": "战场中的7个位置无法部署我方单位",
      "levelId": "activities/act16mini/level_act16mini_02.json"
    },
    {
      "operation": "GA-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，场上 (2,9)、(3,9)、(4,9)3个位置禁止部署干员{最右边三个高台}",
      "levelId": "activities/act16side/level_act16side_ex02.json"
    },
    {
      "operation": "OD-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，场上有5个位置无法部署{(4,8)(5,8)(4,11)(5,11)(1,8)}",
      "levelId": "activities/act17d0/level_act17d0_ex08.json"
    },
    {
      "operation": "SN-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至120%，生命值提升至110%，战场中(6,9)，(5,10)，(6,10)，(4,3)，(5,6)，(4,6)，(4,7)7个位置不可部署{最右上角三格地面和中间高台的正左一格地面和中间高台右上角三格地面}",
      "levelId": "activities/act17side/level_act17side_ex06.json"
    },
    {
      "operation": "WD-EX-8突袭",
      "challenge": "敌方单位的生命值提升至110%， (2,3)、(2,4)、(2,5)、(2,6)、(2,7)、(2,8)、(2,9)7个位置无法部署{蓝门上那行中间七格}",
      "levelId": "activities/act18d0/level_act18d0_ex08.json"
    },
    {
      "operation": "SV-EX-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%。战场上坐标为： (5,4)、(4,4)、(6,3)、(4,3)、(3,8)、(1,8)、(3,7)、(2,7)的8个位置{左装置上、下、右、右下四格和右装置上、下、左、左上四格}无法部署我方单位",
      "levelId": "activities/act18d3/level_act18d3_ex04.json"
    },
    {
      "operation": "LE-EX-8突袭",
      "challenge": "战场中的8个位置无法部署我方单位",
      "levelId": "activities/act18side/level_act18side_ex08.json"
    },
    {
      "operation": "IC-EX-4突袭",
      "challenge": "场上有4个位置无法部署",
      "levelId": "activities/act20side/level_act20side_ex04.json"
    },
    {
      "operation": "IC-EX-8突袭",
      "challenge": "场上有9个位置无法部署",
      "levelId": "activities/act20side/level_act20side_ex08.json"
    },
    {
      "operation": "IC-S-2突袭",
      "challenge": "场上有4个位置无法部署",
      "levelId": "activities/act20side/level_act20side_sub-1-2.json"
    },
    {
      "operation": "IS-EX-6突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act21side/level_act21side_ex06.json"
    },
    {
      "operation": "WB-EX-3突袭",
      "challenge": "场上四个位置不可部署",
      "levelId": "activities/act23side/level_act23side_ex03.json"
    },
    {
      "operation": "WB-EX-4突袭",
      "challenge": "场上六个位置不可部署",
      "levelId": "activities/act23side/level_act23side_ex04.json"
    },
    {
      "operation": "CF-EX-6突袭",
      "challenge": "点的强者才能通过此考验。\n附加条件：\n迅猛锋羽兽生命值与攻击力提升，战场中的15个位置无法部署我方单位",
      "levelId": "activities/act24side/level_act24side_ex06.json"
    },
    {
      "operation": "CF-EX-7突袭",
      "challenge": "点，照耀前路的英雄才能通过此考验。\n附加条件：战场中的8个位置无法部署我方单位，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex07.json"
    },
    {
      "operation": "CW-EX-2突袭",
      "challenge": "场上3个位置不可部署",
      "levelId": "activities/act25side/level_act25side_ex02.json"
    },
    {
      "operation": "CW-S-2-B",
      "levelId": "activities/act25side/level_act25side_sub-1-2-b.json"
    },
    {
      "operation": "HE-EX-3突袭",
      "challenge": "场上八个位置不可部署",
      "levelId": "activities/act26side/level_act26side_ex03.json"
    },
    {
      "operation": "HE-EX-5突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act26side/level_act26side_ex05.json"
    },
    {
      "operation": "SL-EX-2突袭",
      "challenge": "场上四个位置不可部署",
      "levelId": "activities/act27side/level_act27side_ex02.json"
    },
    {
      "operation": "ZT-EX-1突袭",
      "challenge": "场上一个位置不可部署",
      "levelId": "activities/act29side/level_act29side_ex01.json"
    },
    {
      "operation": "RS-EX-7突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act30side/level_act30side_ex07.json"
    },
    {
      "operation": "CR-3",
      "levelId": "activities/act32side/level_act32side_03.json"
    },
    {
      "operation": "CR-EX-1突袭",
      "challenge": "场上5个位置不可部署",
      "levelId": "activities/act32side/level_act32side_ex01.json"
    },
    {
      "operation": "BB-EX-6突袭",
      "challenge": "场上有8个位置无法部署",
      "levelId": "activities/act33side/level_act33side_ex06.json"
    },
    {
      "operation": "BB-S-2突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-2.json"
    },
    {
      "operation": "BB-S-4突袭",
      "challenge": "场上有5个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-4.json"
    },
    {
      "operation": "BP-EX-7突袭",
      "challenge": "场上有1个位置无法部署",
      "levelId": "activities/act34side/level_act34side_ex07.json"
    },
    {
      "operation": "AS-S-2突袭",
      "challenge": "初始大型破碎器皿的行动路线有所不同，场上有2个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-2.json"
    },
    {
      "operation": "AS-S-3突袭",
      "challenge": "“弹跳独轮车”获得<隐匿>，场上有1个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-3.json"
    },
    {
      "operation": "PV-EX-2突袭",
      "challenge": "场上有3个位置无法部署",
      "levelId": "activities/act38side/level_act38side_ex02.json"
    },
    {
      "operation": "EP-EX-7突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act39side/level_act39side_ex07.json"
    },
    {
      "operation": "OR-EX-4突袭",
      "challenge": "战场有3个位置无法部署",
      "levelId": "activities/act40side/level_act40side_ex04.json"
    },
    {
      "operation": "EA-EX-2突袭",
      "challenge": "场上有3个位置无法部署",
      "levelId": "activities/act41side/level_act41side_ex02.json"
    },
    {
      "operation": "EA-EX-7突袭",
      "challenge": "场上有5个位置无法部署",
      "levelId": "activities/act41side/level_act41side_ex07.json"
    },
    {
      "operation": "MT-EX-4突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act42side/level_act42side_ex04.json"
    },
    {
      "operation": "AD-EX-7突袭",
      "challenge": "场上有1个位置无法部署，且意识自由的假人移动速度提升",
      "levelId": "activities/act43side/level_act43side_ex07.json"
    },
    {
      "operation": "CB-EX7突袭",
      "challenge": "战场中的6个位置(右下6高台)无法部署我方单位  敌方单位生命值提升至120%，攻击力和防御力都提升至110%",
      "levelId": "activities/act5d0/level_act5d0_ex07.json"
    },
    {
      "operation": "AF-5突袭",
      "challenge": "敌方单位的生命值、攻击力都提升至120%，防御力提升至110%，场上(3,4)无法部署单位{唯一的地面}",
      "levelId": "activities/act6d5/level_act6d5_05.json"
    },
    {
      "operation": "AF-8突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至105%，场上(5,8)，(4,8)，(3,8)，(5,7)，(4,7)，(3,7)，(5,9)，(4,9)，(3,9)9个地块无法部署单位{最右边九个格子}",
      "levelId": "activities/act6d5/level_act6d5_08.json"
    },
    {
      "operation": "SA-3突袭",
      "challenge": "所有敌人生命值提升至120%、攻击力提升至115%、防御力提升至110%，战场中(4,2)，(4,3)，(4,4)，(5,4)4个位置无法部署单位{左上三格地火和源石地板}",
      "levelId": "activities/act7d5/level_act7d5_03.json"
    },
    {
      "operation": "H6-4",
      "levelId": "obt/hard/level_hard_06-04.json"
    },
    {
      "operation": "6-11突袭",
      "challenge": "战场中7个位置无法部署单位(左红门下两列) 敌方数值不变",
      "levelId": "obt/main/level_main_06-10.json"
    },
    {
      "operation": "7-18突袭",
      "challenge": "战场中的6个位置无法部署我方单位(三列高台上下六格)  敌方单位生命值提升至120%、攻击力提升至110%",
      "levelId": "obt/main/level_main_07-16.json"
    },
    {
      "operation": "R8-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%、战场中(2,6)、(2,9)、(5,9)3个位置{右下角三个高台}无法部署我方单位",
      "levelId": "obt/main/level_main_08-01.json"
    },
    {
      "operation": "15-9突袭",
      "challenge": "战场中有4个位置无法部署我方单位",
      "levelId": "obt/main/level_main_15-08.json"
    }
  ],
  //地图装置修改
  "level_predefines_enable": [
    {
      "operation": "TW-EX-6突袭",
      "challenge": "敌方单位的防御力提升至120%，<巫术巨像>与<泥岩小队践行者组长>的生命值提升至200%，初始额外增加两座“留声机”被敌方占领",
      "levelId": "activities/act11d0/level_act11d0_ex06.json"
    },
    {
      "operation": "TW-S-1突袭",
      "challenge": "使用固定干员进行作战，初始COST-10，可部署上限-2",
      "levelId": "activities/act11d0/level_act11d0_sub-1-1.json"
    },
    {
      "operation": "TW-S-2突袭",
      "challenge": "使用固定干员进行作战",
      "levelId": "activities/act11d0/level_act11d0_sub-1-2.json"
    },
    {
      "operation": "TC-3突袭",
      "challenge": "敌方单位的攻击力，防御力和生命值都提升至110%，移除位于(6,10)的可移动战术机库，启用位于(5,3)的可移动战术机库{左红门为(7,2)}",
      "levelId": "activities/act11mini/level_act11mini_03.json"
    },
    {
      "operation": "MN-EX-5突袭",
      "challenge": "初始有两座“留声机”被敌人占领  敌方单位的攻击力、生命值提升至110%",
      "levelId": "activities/act13d5/level_act13d5_ex05.json"
    },
    {
      "operation": "MB-EX-1突袭",
      "challenge": "禁锢装置方向改变  敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act15d0/level_act15d0_ex01.json"
    },
    {
      "operation": "MB-EX-3突袭",
      "challenge": "场上的禁锢装置数量减少  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d0/level_act15d0_ex03.json"
    },
    {
      "operation": "WR-EX-6突袭",
      "challenge": "敌方单位的生命值提升至110%，我方近战单位的攻击速度降低至50%，防御力提升至150%，在(3,7)(5,5)(3,3)放置障碍物",
      "levelId": "activities/act16d5/level_act16d5_ex06.json"
    },
    {
      "operation": "GA-EX-3突袭",
      "challenge": "场上所有<“冰淇淋机”> 初始被敌方占领，敌方单位的生命值提升至110%",
      "levelId": "activities/act16side/level_act16side_ex03.json"
    },
    {
      "operation": "OD-EX-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，开场销毁位于(3,6)和(5,5)的<土石结构>",
      "levelId": "activities/act17d0/level_act17d0_ex05.json"
    },
    {
      "operation": "WD-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110% 移除位于(4,8)的可移动战术机库，启用位于(3,1){蓝门那行最左边那格}的可移动战术机库",
      "levelId": "activities/act18d0/level_act18d0_ex01.json"
    },
    {
      "operation": "WD-EX-6突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，移除位于(2,4)的可移动战术机库，启用位于(3,10){中间蓝门右边那格}的可移动战术机库",
      "levelId": "activities/act18d0/level_act18d0_ex06.json"
    },
    {
      "operation": "SV-EX-8突袭",
      "challenge": "敌方单位的防御力提升至115%，生命值提升至125%，移除位于(4,2)和(4,10)的应急救治设施{左右两个}",
      "levelId": "activities/act18d3/level_act18d3_ex08.json"
    },
    {
      "operation": "DV-EX-2突袭",
      "challenge": "出现额外<R系列动力装甲>",
      "levelId": "activities/act19side/level_act19side_ex02.json"
    },
    {
      "operation": "DV-EX-3突袭",
      "challenge": "<R系列动力装甲>位置变化",
      "levelId": "activities/act19side/level_act19side_ex03.json"
    },
    {
      "operation": "WB-EX-2突袭",
      "challenge": "出现额外<城防路障>",
      "levelId": "activities/act23side/level_act23side_ex02.json"
    },
    {
      "operation": "HE-EX-4突袭",
      "challenge": "额外出现两个<塌落的墙垣>",
      "levelId": "activities/act26side/level_act26side_ex04.json"
    },
    {
      "operation": "HE-EX-7突袭",
      "challenge": "额外出现一个<塌落的墙垣>",
      "levelId": "activities/act26side/level_act26side_ex07.json"
    },
    {
      "operation": "CV-EX-1突袭",
      "challenge": "<废热喷口>受击回复技力效率降低",
      "levelId": "activities/act28side/level_act28side_ex01.json"
    },
    {
      "operation": "CV-EX-4突袭",
      "challenge": "<废热喷口>受击回复技力效率降低且初始技力减少",
      "levelId": "activities/act28side/level_act28side_ex04.json"
    },
    {
      "operation": "CV-EX-5突袭",
      "challenge": "出现额外<废热喷口>",
      "levelId": "activities/act28side/level_act28side_ex05.json"
    },
    {
      "operation": "CV-EX-7突袭",
      "challenge": "出现额外<废热喷口>",
      "levelId": "activities/act28side/level_act28side_ex07.json"
    },
    {
      "operation": "ZT-EX-3突袭",
      "challenge": "<调谐节点>获得单向防御护盾",
      "levelId": "activities/act29side/level_act29side_ex03.json"
    },
    {
      "operation": "ZT-EX-5突袭",
      "challenge": "<调谐节点>获得单向防御护盾",
      "levelId": "activities/act29side/level_act29side_ex05.json"
    },
    {
      "operation": "ZT-S-4突袭",
      "challenge": "<调谐节点>技力消耗增加",
      "levelId": "activities/act29side/level_act29side_sub-1-4.json"
    },
    {
      "operation": "HS-EX-1突袭",
      "challenge": "场上的<泵站>朝向改变",
      "levelId": "activities/act31side/level_act31side_ex01.json"
    },
    {
      "operation": "CR-EX-2突袭",
      "challenge": "出现额外的源石爆炸物，上方封阻物不再加固",
      "levelId": "activities/act32side/level_act32side_ex02.json"
    },
    {
      "operation": "DT-EX-6突袭",
      "challenge": "敌人的生命值和攻击力大幅提升，开饭需要的食材大幅提升",
      "levelId": "activities/act36side/level_act36side_ex06.json"
    },
    {
      "operation": "DT-EX-6突袭",
      "challenge": "敌人的生命值和攻击力大幅提升，开饭需要的食材大幅提升",
      "levelId": "activities/act36side/level_act36side_ex06.json"
    },
    {
      "operation": "DT-EX-7突袭",
      "challenge": "出现道路障碍物",
      "levelId": "activities/act36side/level_act36side_ex07.json"
    },
    {
      "operation": "EA-EX-1突袭",
      "challenge": "初始场上的<空壳>不再出现",
      "levelId": "activities/act41side/level_act41side_ex01.json"
    },
    {
      "operation": "EA-EX-4突袭",
      "challenge": "地形和敌人等有所不同",
      "levelId": "activities/act41side/level_act41side_ex04.json"
    },
    {
      "operation": "EA-EX-5突袭",
      "challenge": "战场上额外出现4个<盾与墙>",
      "levelId": "activities/act41side/level_act41side_ex05.json"
    },
    {
      "operation": "EA-EX-6突袭",
      "challenge": "<盾与墙>初始位置改变",
      "levelId": "activities/act41side/level_act41side_ex06.json"
    },
    {
      "operation": "EA-EX-8突袭",
      "challenge": "战场上额外出现2个<盾与墙>",
      "levelId": "activities/act41side/level_act41side_ex08.json"
    },
    {
      "operation": "MT-EX-3突袭",
      "challenge": "<圣堂射手扮演者>不再出现",
      "levelId": "activities/act42side/level_act42side_ex03.json"
    },
    {
      "operation": "AD-EX-5突袭",
      "challenge": "战场上额外出现<打光道具>",
      "levelId": "activities/act43side/level_act43side_ex05.json"
    },
    {
      "operation": "PL-5突袭",
      "challenge": "移除战场中的4个<土石结构>{左边一个和右边三个}和2个<盾卫>{左和右}",
      "levelId": "activities/act7mini/level_act7mini_05.json"
    },
    {
      "operation": "VI-1突袭",
      "challenge": "游击队盾卫数量减少，额外出现一名提亚卡乌冠军；敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act8mini/level_act8mini_01.json"
    }
  ],
  //地图tile修改
  "map_tile_blackb_add": [
    {
      "operation": "SE-1突袭",
      "challenge": "<源石污染区>所在地块改变",
      "levelId": "activities/act18mini/level_act18mini_01.json"
    },
    {
      "operation": "SE-1突袭",
      "challenge": "<源石污染区>所在地块改变",
      "levelId": "activities/act18mini/level_act18mini_01.json"
    },
    {
      "operation": "SE-3突袭",
      "challenge": "场上3处芦苇丛初始被点燃",
      "levelId": "activities/act18mini/level_act18mini_03.json"
    },
    {
      "operation": "FC-EX-4突袭",
      "challenge": "场上额外1处芦苇丛初始被点燃",
      "levelId": "activities/act22side/level_act22side_ex04.json"
    },
    {
      "operation": "FC-EX-8突袭",
      "challenge": "场上6处芦苇丛初始被点燃",
      "levelId": "activities/act22side/level_act22side_ex08.json"
    }
  ],
  //敌人属性修改
  "enemy_attribute_mul": [
    {
      "operation": "TB-2突袭",
      "challenge": "敌方单位的生命值提升至150%，战场中的 (5,4)、(5,5)、(5,6)、(3,5)、(3,6)、(3,7)、(3,3)7个位置无法部署我方单位{上红门为(4,3)，下红门为(0,5)}",
      "levelId": "activities/act10mini/level_act10mini_02.json"
    },
    {
      "operation": "TB-4突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，粉碎攻坚组长的生命值额外提升至200%，战场中的(5,6)1个位置无法部署我方单位{最上方高台}",
      "levelId": "activities/act10mini/level_act10mini_04.json"
    },
    {
      "operation": "TB-4突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，粉碎攻坚组长的生命值额外提升至200%，战场中的(5,6)1个位置无法部署我方单位{最上方高台}",
      "levelId": "activities/act10mini/level_act10mini_04.json"
    },
    {
      "operation": "TB-5突袭",
      "challenge": "萨卡兹魔剑士获得隐匿，敌方单位的攻击力、防御力和生命值都提升至110%",
      "levelId": "activities/act10mini/level_act10mini_05.json"
    },
    {
      "operation": "TB-6突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110%，战场中(2,6)、(2,7)、(2,10)、(1,6)、(1,7)、(1,8)、(3,6)、(3,7)8个位置无法部署我方单位{最右下角八个格子}",
      "levelId": "activities/act10mini/level_act10mini_06.json"
    },
    {
      "operation": "TB-7突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至125%，移动速度降低至50%",
      "levelId": "activities/act10mini/level_act10mini_07.json"
    },
    {
      "operation": "TB-8突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至105%，莱塔尼亚轻语者的技能释放期间，每1秒扣除<“留声机”>3点技力（原1点）",
      "levelId": "activities/act10mini/level_act10mini_08.json"
    },
    {
      "operation": "TW-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，无法部署单位的4个位置：(4,5)，(4,6)，(3,5)，(3,6)",
      "levelId": "activities/act11d0/level_act11d0_ex01.json"
    },
    {
      "operation": "TW-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至110%，所有我方单位的阻挡数上限减少1",
      "levelId": "activities/act11d0/level_act11d0_ex03.json"
    },
    {
      "operation": "TW-EX-4突袭",
      "challenge": "我方单位攻击力降低至60%",
      "levelId": "activities/act11d0/level_act11d0_ex04.json"
    },
    {
      "operation": "TW-EX-5突袭",
      "challenge": "敌方单位的防御力提升至120%，生命值提升至120%，莱塔尼亚吟唱者的攻击范围提升至120%，争夺“留声机”效果提升至200%",
      "levelId": "activities/act11d0/level_act11d0_ex05.json"
    },
    {
      "operation": "TW-EX-6突袭",
      "challenge": "敌方单位的防御力提升至120%，<巫术巨像>与<泥岩小队践行者组长>的生命值提升至200%，初始额外增加两座“留声机”被敌方占领",
      "levelId": "activities/act11d0/level_act11d0_ex06.json"
    },
    {
      "operation": "TW-EX-6突袭",
      "challenge": "敌方单位的防御力提升至120%，<巫术巨像>与<泥岩小队践行者组长>的生命值提升至200%，初始额外增加两座“留声机”被敌方占领",
      "levelId": "activities/act11d0/level_act11d0_ex06.json"
    },
    {
      "operation": "TW-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，可携带干员数量不超过10",
      "levelId": "activities/act11d0/level_act11d0_ex08.json"
    },
    {
      "operation": "TC-1突袭",
      "challenge": "敌方单位的攻击力和防御力提升至110%，生命值提升至150%",
      "levelId": "activities/act11mini/level_act11mini_01.json"
    },
    {
      "operation": "TC-2突袭",
      "challenge": "我方单位的阻挡数减1，敌方单位的生命值和攻击力提升至110%",
      "levelId": "activities/act11mini/level_act11mini_02.json"
    },
    {
      "operation": "TC-3突袭",
      "challenge": "敌方单位的攻击力，防御力和生命值都提升至110%，移除位于(6,10)的可移动战术机库，启用位于(5,3)的可移动战术机库{左红门为(7,2)}",
      "levelId": "activities/act11mini/level_act11mini_03.json"
    },
    {
      "operation": "TC-4突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，青金，莫妮克和青金，罗伊的攻击速度提升至150%",
      "levelId": "activities/act11mini/level_act11mini_04.json"
    },
    {
      "operation": "TC-4突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，青金，莫妮克和青金，罗伊的攻击速度提升至150%",
      "levelId": "activities/act11mini/level_act11mini_04.json"
    },
    {
      "operation": "TC-5突袭",
      "challenge": "敌方单位的生命值和攻击力提升至110%，移动速度提升至150%",
      "levelId": "activities/act11mini/level_act11mini_05.json"
    },
    {
      "operation": "TC-6突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，我方单位的最大生命值降低至65%",
      "levelId": "activities/act11mini/level_act11mini_06.json"
    },
    {
      "operation": "TC-7突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至150%",
      "levelId": "activities/act11mini/level_act11mini_07.json"
    },
    {
      "operation": "TC-8突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，额外出现敌人：法术大师A1×2{1st}，危险术师囚犯×2{14th}",
      "levelId": "activities/act11mini/level_act11mini_08.json"
    },
    {
      "operation": "RI-9",
      "levelId": "activities/act12d0/level_act12d0_09.json"
    },
    {
      "operation": "RI-EX-1突袭",
      "challenge": "提亚卡乌好战者获得<隐匿>效果  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex01.json"
    },
    {
      "operation": "RI-EX-2突袭",
      "challenge": "敌方单位的防御力、生命值都提升至110% 提亚卡乌神投手攻击速度下降至33%但攻击力提升至200%",
      "levelId": "activities/act12d0/level_act12d0_ex02.json"
    },
    {
      "operation": "RI-EX-2突袭",
      "challenge": "敌方单位的防御力、生命值都提升至110% 提亚卡乌神投手攻击速度下降至33%但攻击力提升至200%",
      "levelId": "activities/act12d0/level_act12d0_ex02.json"
    },
    {
      "operation": "RI-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至105% 我方最大生命值下降至50%",
      "levelId": "activities/act12d0/level_act12d0_ex03.json"
    },
    {
      "operation": "RI-EX-4突袭",
      "challenge": "敌方单位的防御力、生命值都提升至120%，法术抗性增加20",
      "levelId": "activities/act12d0/level_act12d0_ex04.json"
    },
    {
      "operation": "RI-EX-5突袭",
      "challenge": "可部署干员数量减少2  敌方单位的攻击力、生命值都提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex05.json"
    },
    {
      "operation": "RI-EX-6突袭",
      "challenge": "可部署的<罗德岛临时雇员>人数减少6,，且敌人的特殊能力不会失效  敌方单位的生命值提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex06.json"
    },
    {
      "operation": "RI-EX-7突袭",
      "challenge": "禁止部署重装干员  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex07.json"
    },
    {
      "operation": "RI-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110% 无法部署的7个位置(Y,X)如下 (2,3)、(3,3)、(4,4)、(4,7)、(5,7)、(6,7)、(6,6)",
      "levelId": "activities/act12d0/level_act12d0_ex08.json"
    },
    {
      "operation": "AW-1突袭",
      "challenge": "出现伦蒂尼姆城防副炮",
      "levelId": "activities/act12mini/level_act12mini_01.json"
    },
    {
      "operation": "AW-2突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act12mini/level_act12mini_02.json"
    },
    {
      "operation": "AW-3突袭",
      "challenge": "烛骑士薇薇安娜的攻击力提升",
      "levelId": "activities/act12mini/level_act12mini_03.json"
    },
    {
      "operation": "AW-3突袭",
      "challenge": "烛骑士薇薇安娜的攻击力提升",
      "levelId": "activities/act12mini/level_act12mini_03.json"
    },
    {
      "operation": "AW-4突袭",
      "challenge": "敌方单位的生命值提升",
      "levelId": "activities/act12mini/level_act12mini_04.json"
    },
    {
      "operation": "AW-5突袭",
      "challenge": "我方单位的阻挡数减少",
      "levelId": "activities/act12mini/level_act12mini_05.json"
    },
    {
      "operation": "AW-6突袭",
      "challenge": "激活动力装甲所需的实验产物减少",
      "levelId": "activities/act12mini/level_act12mini_06.json"
    },
    {
      "operation": "AW-7突袭",
      "challenge": "我方单位的生命值降低",
      "levelId": "activities/act12mini/level_act12mini_07.json"
    },
    {
      "operation": "AW-8突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act12mini/level_act12mini_08.json"
    },
    {
      "operation": "DH-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，控潮术师和领潮员攻击范围扩大至130%。",
      "levelId": "activities/act12side/level_act12side_ex01.json"
    },
    {
      "operation": "DH-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，水手长和水手长重艇的攻击力和最大生命值额外提升至130%。",
      "levelId": "activities/act12side/level_act12side_ex02.json"
    },
    {
      "operation": "DH-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，水手长和水手长重艇的攻击力和最大生命值额外提升至130%。",
      "levelId": "activities/act12side/level_act12side_ex02.json"
    },
    {
      "operation": "DH-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，水手长和水手长重艇的攻击力和最大生命值额外提升至130%。",
      "levelId": "activities/act12side/level_act12side_ex02.json"
    },
    {
      "operation": "DH-EX-3突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，“风筝”的技力消耗降低至75%，场上坐标为(1,6)(3,9)(4,9)的3个位置{正下方河道入口和最右侧俩个高台}无法部署",
      "levelId": "activities/act12side/level_act12side_ex03.json"
    },
    {
      "operation": "DH-EX-4突袭",
      "challenge": "重装干员部署费用提升至4倍，敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act12side/level_act12side_ex04.json"
    },
    {
      "operation": "DH-EX-5突袭",
      "challenge": "敌方单位的攻击力提升至120%，防御力提升至120%，生命值提升至120%，无人爆破重艇的爆炸伤害提升至200%",
      "levelId": "activities/act12side/level_act12side_ex05.json"
    },
    {
      "operation": "DH-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至110%，生命值提升至110%，涨潮时，我方每秒受到的侵蚀损伤提升40点",
      "levelId": "activities/act12side/level_act12side_ex06.json"
    },
    {
      "operation": "DH-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至120%，防御力提升至120%，生命值提升至120%，场上坐标为 (5,9)(5,10)(6,11)(1,11)(2,9)(2,10)的6个位置{蓝门上下两行各两个地板和最右侧两个高台}无法部署",
      "levelId": "activities/act12side/level_act12side_ex07.json"
    },
    {
      "operation": "DH-EX-8突袭",
      "challenge": "我方单位的生命值上限减半，敌方单位的防御力提升至110%，生命值提升至115%",
      "levelId": "activities/act12side/level_act12side_ex08.json"
    },
    {
      "operation": "DH-S-1突袭",
      "challenge": "我方单位的阻挡数-1。敌方单位的攻击力提升、防御力和生命值都提升至135%（跟普通模式的属性提升不累积）。",
      "levelId": "activities/act12side/level_act12side_sub-1-1.json"
    },
    {
      "operation": "DH-S-1突袭",
      "challenge": "我方单位的阻挡数-1。敌方单位的攻击力提升、防御力和生命值都提升至135%（跟普通模式的属性提升不累积）。",
      "levelId": "activities/act12side/level_act12side_sub-1-1.json"
    },
    {
      "operation": "DH-S-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至130%。无人爆破重艇的生命流失速度数值降低2%，爆炸伤害提升至150%（跟普通模式的属性提升不累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-2.json"
    },
    {
      "operation": "DH-S-3突袭",
      "challenge": "不可使用特制水上平台。敌方单位的攻击力、防御力和生命值都提升至110%。",
      "levelId": "activities/act12side/level_act12side_sub-1-3.json"
    },
    {
      "operation": "DH-S-3突袭",
      "challenge": "不可使用特制水上平台。敌方单位的攻击力、防御力和生命值都提升至110%。",
      "levelId": "activities/act12side/level_act12side_sub-1-3.json"
    },
    {
      "operation": "DH-S-4突袭",
      "challenge": "敌方单位的攻击力和生命值额外提升至110%。水手长的生命值额外再提升至130%，水蚀状态下每秒额外受到的真实伤害降至0。（跟普通模式的属性提升累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-4.json"
    },
    {
      "operation": "DH-S-4突袭",
      "challenge": "敌方单位的攻击力和生命值额外提升至110%。水手长的生命值额外再提升至130%，水蚀状态下每秒额外受到的真实伤害降至0。（跟普通模式的属性提升累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-4.json"
    },
    {
      "operation": "DH-S-4突袭",
      "challenge": "敌方单位的攻击力和生命值额外提升至110%。水手长的生命值额外再提升至130%，水蚀状态下每秒额外受到的真实伤害降至0。（跟普通模式的属性提升累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-4.json"
    },
    {
      "operation": "FA-1突袭",
      "challenge": "敌方单位的攻击力和生命值提升至115%，防御力提升至110%，毒性雾霾伤害提升至每0.5秒15点",
      "levelId": "activities/act13d0/level_act13d0_01.json"
    },
    {
      "operation": "FA-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，术师组长获得隐匿效果",
      "levelId": "activities/act13d0/level_act13d0_02.json"
    },
    {
      "operation": "FA-3突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，可部署干员数量减少1",
      "levelId": "activities/act13d0/level_act13d0_03.json"
    },
    {
      "operation": "FA-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至170%，生命值提升至115%",
      "levelId": "activities/act13d0/level_act13d0_04.json"
    },
    {
      "operation": "FA-5突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，不再有罗德岛临时雇员可用",
      "levelId": "activities/act13d0/level_act13d0_05.json"
    },
    {
      "operation": "FA-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至150%",
      "levelId": "activities/act13d0/level_act13d0_06.json"
    },
    {
      "operation": "FA-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，幽灵与幽灵组长的最大生命值额外提升至130%",
      "levelId": "activities/act13d0/level_act13d0_07.json"
    },
    {
      "operation": "FA-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，幽灵与幽灵组长的最大生命值额外提升至130%",
      "levelId": "activities/act13d0/level_act13d0_07.json"
    },
    {
      "operation": "FA-8突袭",
      "challenge": "敌方单位的攻击力、生命值提升至105%，额外出现4个敌人：爆破攻坚手、萨卡兹百夫长、萨卡兹穿刺手组长*2",
      "levelId": "activities/act13d0/level_act13d0_08.json"
    },
    {
      "operation": "MN-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力提升至110%，生命值提升至130%",
      "levelId": "activities/act13d5/level_act13d5_ex01.json"
    },
    {
      "operation": "MN-EX-3突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110% 敌方单位的移动速度提升至150%",
      "levelId": "activities/act13d5/level_act13d5_ex03.json"
    },
    {
      "operation": "MN-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110% 沸血骑士团精锐的生命值提升至170%",
      "levelId": "activities/act13d5/level_act13d5_ex04.json"
    },
    {
      "operation": "MN-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110% 沸血骑士团精锐的生命值提升至170%",
      "levelId": "activities/act13d5/level_act13d5_ex04.json"
    },
    {
      "operation": "MN-EX-6突袭",
      "challenge": "敌方单位的移动速度提升至130%，法术抗性增加30",
      "levelId": "activities/act13d5/level_act13d5_ex06.json"
    },
    {
      "operation": "MN-EX-7突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110% 威龙的攻击范围提升至150%",
      "levelId": "activities/act13d5/level_act13d5_ex07.json"
    },
    {
      "operation": "MN-EX-8突袭",
      "challenge": "医疗符文及上下共六个位置无法部署我方单位  敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act13d5/level_act13d5_ex08.json"
    },
    {
      "operation": "BW-1突袭",
      "challenge": "敌人重量大幅度提升",
      "levelId": "activities/act13mini/level_act13mini_01.json"
    },
    {
      "operation": "BW-2突袭",
      "challenge": "重装和特种干员部署费用变为2倍",
      "levelId": "activities/act13mini/level_act13mini_02.json"
    },
    {
      "operation": "BW-3突袭",
      "challenge": "萨卡兹魔剑组长变为萨卡兹积怨者",
      "levelId": "activities/act13mini/level_act13mini_03.json"
    },
    {
      "operation": "BW-4突袭",
      "challenge": "欺凌者获得隐匿",
      "levelId": "activities/act13mini/level_act13mini_04.json"
    },
    {
      "operation": "BW-5突袭",
      "challenge": "复仇者攻击力大幅提升",
      "levelId": "activities/act13mini/level_act13mini_05.json"
    },
    {
      "operation": "BW-5突袭",
      "challenge": "复仇者攻击力大幅提升",
      "levelId": "activities/act13mini/level_act13mini_05.json"
    },
    {
      "operation": "BW-6突袭",
      "challenge": "认真的“阿咬”生命值大幅提升",
      "levelId": "activities/act13mini/level_act13mini_06.json"
    },
    {
      "operation": "BW-6突袭",
      "challenge": "认真的“阿咬”生命值大幅提升",
      "levelId": "activities/act13mini/level_act13mini_06.json"
    },
    {
      "operation": "BW-7突袭",
      "challenge": "冰爆源石虫的特殊能力不会失效",
      "levelId": "activities/act13mini/level_act13mini_07.json"
    },
    {
      "operation": "BW-8突袭",
      "challenge": "<弩炮台>造成的伤害提高",
      "levelId": "activities/act13mini/level_act13mini_08.json"
    },
    {
      "operation": "NL-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，我方单位的生命值降低至70%",
      "levelId": "activities/act13side/level_act13side_ex01.json"
    },
    {
      "operation": "NL-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、提升至110%，无胄盟刺客组长攻击力累积速度增加至200%",
      "levelId": "activities/act13side/level_act13side_ex02.json"
    },
    {
      "operation": "NL-EX-3突袭",
      "challenge": "敌方单位的防御力、生命值提升至105%，战场中(3,5)(5,5)(2,6)(3,7)(4,3)(3,3)6个位置无法部署我方单位{蓝门为(4,5)，上下两格为(5,5)(3,5)}",
      "levelId": "activities/act13side/level_act13side_ex03.json"
    },
    {
      "operation": "NL-EX-5突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%，骑士之徽的数量减少2个（剩1个），部署费用自然回复所需时间提升至154%（1秒回0.66费）",
      "levelId": "activities/act13side/level_act13side_ex05.json"
    },
    {
      "operation": "NL-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至135%，生命值提升至105%",
      "levelId": "activities/act13side/level_act13side_ex06.json"
    },
    {
      "operation": "NL-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至105%，防御力、生命值提升至110%，工蚁和工蚁组长的生命值提升至200%",
      "levelId": "activities/act13side/level_act13side_ex07.json"
    },
    {
      "operation": "NL-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至105%，防御力、生命值提升至110%，工蚁和工蚁组长的生命值提升至200%",
      "levelId": "activities/act13side/level_act13side_ex07.json"
    },
    {
      "operation": "NL-EX-8突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，凝血之刃的攻击力和生命值额外提升至130%",
      "levelId": "activities/act13side/level_act13side_ex08.json"
    },
    {
      "operation": "NL-EX-8突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，凝血之刃的攻击力和生命值额外提升至130%",
      "levelId": "activities/act13side/level_act13side_ex08.json"
    },
    {
      "operation": "NL-S-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值额外提升至110%，额外出现无胄盟第三小队组长×1（左上，8th）、无胄盟清扫小队组长×1（左下，29th）",
      "levelId": "activities/act13side/level_act13side_sub-1-1.json"
    },
    {
      "operation": "NL-S-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值额外提升至110%，额外出现无胄盟第三小队组长×1（左上，8th）、无胄盟清扫小队组长×1（左下，29th）",
      "levelId": "activities/act13side/level_act13side_sub-1-1.json"
    },
    {
      "operation": "NL-S-2突袭",
      "challenge": "所有敌方单位的攻击力、防御力、生命值都提升至120%，骑士之徽的数量减少1个（没了）",
      "levelId": "activities/act13side/level_act13side_sub-1-2.json"
    },
    {
      "operation": "NL-S-2突袭",
      "challenge": "所有敌方单位的攻击力、防御力、生命值都提升至120%，骑士之徽的数量减少1个（没了）",
      "levelId": "activities/act13side/level_act13side_sub-1-2.json"
    },
    {
      "operation": "NL-S-2突袭",
      "challenge": "所有敌方单位的攻击力、防御力、生命值都提升至120%，骑士之徽的数量减少1个（没了）",
      "levelId": "activities/act13side/level_act13side_sub-1-2.json"
    },
    {
      "operation": "NL-S-3突袭",
      "challenge": "敌方单位的攻击力提升、防御力、生命值都提升至110%，散华骑士团成员的生命值额外提升至200%，技能冷却时间降低至75%。散华骑士团成员包括：散华骑士团学徒、散华骑士团精锐、烛骑士薇薇安娜",
      "levelId": "activities/act13side/level_act13side_sub-1-3.json"
    },
    {
      "operation": "NL-S-3突袭",
      "challenge": "敌方单位的攻击力提升、防御力、生命值都提升至110%，散华骑士团成员的生命值额外提升至200%，技能冷却时间降低至75%。散华骑士团成员包括：散华骑士团学徒、散华骑士团精锐、烛骑士薇薇安娜",
      "levelId": "activities/act13side/level_act13side_sub-1-3.json"
    },
    {
      "operation": "NL-S-4突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都额外提升至110%，血骑士额外召唤凝血之刃×9",
      "levelId": "activities/act13side/level_act13side_sub-1-4.json"
    },
    {
      "operation": "NL-S-5突袭",
      "challenge": "敌方单位的生命值提升至105%，莫妮克、罗伊、无胄盟第三小队组长、无胄盟清扫小队组长的攻击速度提升至130%",
      "levelId": "activities/act13side/level_act13side_sub-1-5.json"
    },
    {
      "operation": "NL-S-5突袭",
      "challenge": "敌方单位的生命值提升至105%，莫妮克、罗伊、无胄盟第三小队组长、无胄盟清扫小队组长的攻击速度提升至130%",
      "levelId": "activities/act13side/level_act13side_sub-1-5.json"
    },
    {
      "operation": "DC-1突袭",
      "challenge": "敌人单位的生命值大幅度提升",
      "levelId": "activities/act14mini/level_act14mini_01.json"
    },
    {
      "operation": "DC-2突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act14mini/level_act14mini_02.json"
    },
    {
      "operation": "DC-3突袭",
      "challenge": "<深水区>中的敌人不再流失生命",
      "levelId": "activities/act14mini/level_act14mini_03.json"
    },
    {
      "operation": "DC-4突袭",
      "challenge": "<射手>获得隐匿效果",
      "levelId": "activities/act14mini/level_act14mini_04.json"
    },
    {
      "operation": "DC-5突袭",
      "challenge": "<萨卡兹宿主百夫长>的攻击力提升",
      "levelId": "activities/act14mini/level_act14mini_05.json"
    },
    {
      "operation": "DC-5突袭",
      "challenge": "<萨卡兹宿主百夫长>的攻击力提升",
      "levelId": "activities/act14mini/level_act14mini_05.json"
    },
    {
      "operation": "DC-6突袭",
      "challenge": "<萨卡兹子裔补给车>对重生造物的攻击力加成效果提升",
      "levelId": "activities/act14mini/level_act14mini_06.json"
    },
    {
      "operation": "DC-7突袭",
      "challenge": "<帝国前锋精锐>的攻击力和生命值提升",
      "levelId": "activities/act14mini/level_act14mini_07.json"
    },
    {
      "operation": "DC-7突袭",
      "challenge": "<帝国前锋精锐>的攻击力和生命值提升",
      "levelId": "activities/act14mini/level_act14mini_07.json"
    },
    {
      "operation": "DC-8突袭",
      "challenge": "<“皇帝的利刃”>释放【国度】所需损失生命值降低",
      "levelId": "activities/act14mini/level_act14mini_08.json"
    },
    {
      "operation": "DC-S-2",
      "levelId": "activities/act14mini/level_act14mini_sub-2-1.json"
    },
    {
      "operation": "BI-EX-1突袭",
      "challenge": "冰原猎人队长的攻击力提升至130%，攻击速度降低至85%",
      "levelId": "activities/act14side/level_act14side_ex01.json"
    },
    {
      "operation": "BI-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，冰原御法者死亡时的范围爆炸伤害提升至250%",
      "levelId": "activities/act14side/level_act14side_ex02.json"
    },
    {
      "operation": "BI-EX-3突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至105%，攻击速度提升至150%",
      "levelId": "activities/act14side/level_act14side_ex03.json"
    },
    {
      "operation": "BI-EX-4突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，冰原术师队长的生命值提升至180%，重量提升2个等级，获得冻结免疫",
      "levelId": "activities/act14side/level_act14side_ex04.json"
    },
    {
      "operation": "BI-EX-4突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，冰原术师队长的生命值提升至180%，重量提升2个等级，获得冻结免疫",
      "levelId": "activities/act14side/level_act14side_ex04.json"
    },
    {
      "operation": "BI-EX-5突袭",
      "challenge": "敌方单位的防御力和生命值提升至110%，额外出现11个冰原御法者，冰原御法者的生命值额外提升至150%（与前乘算）",
      "levelId": "activities/act14side/level_act14side_ex05.json"
    },
    {
      "operation": "BI-EX-5突袭",
      "challenge": "敌方单位的防御力和生命值提升至110%，额外出现11个冰原御法者，冰原御法者的生命值额外提升至150%（与前乘算）",
      "levelId": "activities/act14side/level_act14side_ex05.json"
    },
    {
      "operation": "BI-EX-6突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，部署费用的自然回复速度降低50%",
      "levelId": "activities/act14side/level_act14side_ex06.json"
    },
    {
      "operation": "BI-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%。战场中(4,5)(4,6)(4,7)(4,8)(3,5)(3,6)(3,7)(3,8)8个位置无法部署我方单位{蓝门为(6,5)，蓝门下两格为(4,5)}",
      "levelId": "activities/act14side/level_act14side_ex07.json"
    },
    {
      "operation": "BI-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至110%。锏的技能【速杀】的移动距离和造成的伤害都提升至150%，冷却时间缩短至50%",
      "levelId": "activities/act14side/level_act14side_ex08.json"
    },
    {
      "operation": "MB-EX-1突袭",
      "challenge": "禁锢装置方向改变  敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act15d0/level_act15d0_ex01.json"
    },
    {
      "operation": "MB-EX-2突袭",
      "challenge": "神射手囚犯获得<隐匿>效果  敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act15d0/level_act15d0_ex02.json"
    },
    {
      "operation": "MB-EX-3突袭",
      "challenge": "场上的禁锢装置数量减少  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d0/level_act15d0_ex03.json"
    },
    {
      "operation": "MB-EX-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  巨汉囚犯的攻击速度提升至150%",
      "levelId": "activities/act15d0/level_act15d0_ex04.json"
    },
    {
      "operation": "MB-EX-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  巨汉囚犯的攻击速度提升至150%",
      "levelId": "activities/act15d0/level_act15d0_ex04.json"
    },
    {
      "operation": "MB-EX-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  战场中的4个位置无法部署我方单位，分别是左上方两个地面及一个高台还有传送门出口",
      "levelId": "activities/act15d0/level_act15d0_ex05.json"
    },
    {
      "operation": "MB-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  我方单位的最大生命值降低至30%",
      "levelId": "activities/act15d0/level_act15d0_ex06.json"
    },
    {
      "operation": "MB-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  我方单位的防御力降低至60%",
      "levelId": "activities/act15d0/level_act15d0_ex07.json"
    },
    {
      "operation": "MB-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  额外出现1个传奇重犯，2个术师囚犯被替换为危险术师囚犯",
      "levelId": "activities/act15d0/level_act15d0_ex08.json"
    },
    {
      "operation": "BH-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  酸液源石虫的射程提升至150%",
      "levelId": "activities/act15d5/level_act15d5_01.json"
    },
    {
      "operation": "BH-2突袭",
      "challenge": "场上正中间3个地面无法部署我方单位  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d5/level_act15d5_02.json"
    },
    {
      "operation": "BH-3突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  敌方单位的移动速度提升至140%",
      "levelId": "activities/act15d5/level_act15d5_03.json"
    },
    {
      "operation": "BH-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  弑君者的重量提升4个等级  碎骨的生命值额外提升至200%",
      "levelId": "activities/act15d5/level_act15d5_04.json"
    },
    {
      "operation": "BH-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  弑君者的重量提升4个等级  碎骨的生命值额外提升至200%",
      "levelId": "activities/act15d5/level_act15d5_04.json"
    },
    {
      "operation": "BH-5突袭",
      "challenge": "特战术师获得隐匿效果  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d5/level_act15d5_05.json"
    },
    {
      "operation": "BH-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  法术抗性增加40",
      "levelId": "activities/act15d5/level_act15d5_06.json"
    },
    {
      "operation": "BH-7突袭",
      "challenge": "冬灵血巫和冬灵血巫大师的移动速度提升  敌方单位的攻击力提升至110%，生命值提升至110%  冬灵血巫和冬灵血巫大师的移动速度提升至140%",
      "levelId": "activities/act15d5/level_act15d5_07.json"
    },
    {
      "operation": "BH-7突袭",
      "challenge": "冬灵血巫和冬灵血巫大师的移动速度提升  敌方单位的攻击力提升至110%，生命值提升至110%  冬灵血巫和冬灵血巫大师的移动速度提升至140%",
      "levelId": "activities/act15d5/level_act15d5_07.json"
    },
    {
      "operation": "BH-8突袭",
      "challenge": "可部署单位上限减少2(8-2=6)  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d5/level_act15d5_08.json"
    },
    {
      "operation": "FD-1突袭",
      "challenge": "部署费用回复速度降低",
      "levelId": "activities/act15mini/level_act15mini_01.json"
    },
    {
      "operation": "FD-2突袭",
      "challenge": "<帝国炮火先兆者>的最大生命值提升",
      "levelId": "activities/act15mini/level_act15mini_02.json"
    },
    {
      "operation": "FD-2突袭",
      "challenge": "<帝国炮火先兆者>的最大生命值提升",
      "levelId": "activities/act15mini/level_act15mini_02.json"
    },
    {
      "operation": "FD-3突袭",
      "challenge": "敌人攻击速度提升",
      "levelId": "activities/act15mini/level_act15mini_03.json"
    },
    {
      "operation": "FD-4突袭",
      "challenge": "可部署单位上限减少2",
      "levelId": "activities/act15mini/level_act15mini_04.json"
    },
    {
      "operation": "FD-5突袭",
      "challenge": "<冰原狂战士>的攻击力与防御力提升",
      "levelId": "activities/act15mini/level_act15mini_05.json"
    },
    {
      "operation": "FD-5突袭",
      "challenge": "<冰原狂战士>的攻击力与防御力提升",
      "levelId": "activities/act15mini/level_act15mini_05.json"
    },
    {
      "operation": "FD-6突袭",
      "challenge": "我方单位再部署时间增加",
      "levelId": "activities/act15mini/level_act15mini_06.json"
    },
    {
      "operation": "FD-7突袭",
      "challenge": "<城市霓虹>的数量与位置改变",
      "levelId": "activities/act15mini/level_act15mini_07.json"
    },
    {
      "operation": "FD-8突袭",
      "challenge": "<殉道者安多恩>【光赐于苦】的闪避效果提升",
      "levelId": "activities/act15mini/level_act15mini_08.json"
    },
    {
      "operation": "FD-S-2",
      "levelId": "activities/act15mini/level_act15mini_sub-2-1.json"
    },
    {
      "operation": "IW-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至110%，<磨砻>死亡后生成的木制瑞印额外增加2个",
      "levelId": "activities/act15side/level_act15side_ex01.json"
    },
    {
      "operation": "IW-EX-2突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，生命值提升至150%（不包括器伥的本体）",
      "levelId": "activities/act15side/level_act15side_ex02.json"
    },
    {
      "operation": "IW-EX-3突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110% 所有器伥本体的生命值提升至200%（即击倒它们需要2倍的相应攻击次数）",
      "levelId": "activities/act15side/level_act15side_ex03.json"
    },
    {
      "operation": "IW-EX-3突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110% 所有器伥本体的生命值提升至200%（即击倒它们需要2倍的相应攻击次数）",
      "levelId": "activities/act15side/level_act15side_ex03.json"
    },
    {
      "operation": "IW-EX-4突袭",
      "challenge": "所有我方单位的最大生命值降低至70%",
      "levelId": "activities/act15side/level_act15side_ex04.json"
    },
    {
      "operation": "IW-EX-5突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至120%，战场中(1,9)、(2,9)、(3,9)、(1,10)、(2,10)、(3,10)、(4,10)、(5,10)的8个位置无法部署我方单位{最右下两列}",
      "levelId": "activities/act15side/level_act15side_ex05.json"
    },
    {
      "operation": "IW-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至105%，防御力提升至105%，近卫与术士的部署费用提升至3倍",
      "levelId": "activities/act15side/level_act15side_ex06.json"
    },
    {
      "operation": "IW-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，额外出现<堂皇>*2",
      "levelId": "activities/act15side/level_act15side_ex07.json"
    },
    {
      "operation": "IW-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至120%，磷火的生命值提升至150%（即击倒磷火需要15次伤害）",
      "levelId": "activities/act15side/level_act15side_ex08.json"
    },
    {
      "operation": "IW-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至120%，磷火的生命值提升至150%（即击倒磷火需要15次伤害）",
      "levelId": "activities/act15side/level_act15side_ex08.json"
    },
    {
      "operation": "WR-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，我方远程干员的生命值降低至60%",
      "levelId": "activities/act16d5/level_act16d5_ex01.json"
    },
    {
      "operation": "WR-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，复杂的“妒”的技能冷却时间缩短至25%",
      "levelId": "activities/act16d5/level_act16d5_ex02.json"
    },
    {
      "operation": "WR-EX-3突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，恍惚的“得意”的移动速度提升至200%",
      "levelId": "activities/act16d5/level_act16d5_ex03.json"
    },
    {
      "operation": "WR-EX-3突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，恍惚的“得意”的移动速度提升至200%",
      "levelId": "activities/act16d5/level_act16d5_ex03.json"
    },
    {
      "operation": "WR-EX-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，恍惚的“得意”的生命值额外提升至200%",
      "levelId": "activities/act16d5/level_act16d5_ex04.json"
    },
    {
      "operation": "WR-EX-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，恍惚的“得意”的生命值额外提升至200%",
      "levelId": "activities/act16d5/level_act16d5_ex04.json"
    },
    {
      "operation": "WR-EX-5突袭",
      "challenge": "敌方单位的攻击力、生命值提升至105%，我方干员阻挡数-2",
      "levelId": "activities/act16d5/level_act16d5_ex05.json"
    },
    {
      "operation": "WR-EX-6突袭",
      "challenge": "敌方单位的生命值提升至110%，我方近战单位的攻击速度降低至50%，防御力提升至150%，在(3,7)(5,5)(3,3)放置障碍物",
      "levelId": "activities/act16d5/level_act16d5_ex06.json"
    },
    {
      "operation": "WR-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，战场中的9个位置无法部署我方单位{(3,4)、(5,3)、(5,4)、(5,7)、(5,8)、(3,7)、(2,7)、(2,10)、(4,10)}",
      "levelId": "activities/act16d5/level_act16d5_ex07.json"
    },
    {
      "operation": "WR-EX-8突袭",
      "challenge": "敌方单位的防御力提升至110%，生命值提升至110%，我方单位的攻击力在攻击同属性单位时降低至30%",
      "levelId": "activities/act16d5/level_act16d5_ex08.json"
    },
    {
      "operation": "TG-1突袭",
      "challenge": "禁止部署术师干员",
      "levelId": "activities/act16mini/level_act16mini_01.json"
    },
    {
      "operation": "TG-2突袭",
      "challenge": "战场中的7个位置无法部署我方单位",
      "levelId": "activities/act16mini/level_act16mini_02.json"
    },
    {
      "operation": "TG-3突袭",
      "challenge": "训练用钳兽与训练用残暴钳兽攻击力大幅提升",
      "levelId": "activities/act16mini/level_act16mini_03.json"
    },
    {
      "operation": "TG-4突袭",
      "challenge": "我方所有单位的防御力减半",
      "levelId": "activities/act16mini/level_act16mini_04.json"
    },
    {
      "operation": "TG-5突袭",
      "challenge": "我方所有单位的攻击力降低",
      "levelId": "activities/act16mini/level_act16mini_05.json"
    },
    {
      "operation": "TG-6突袭",
      "challenge": "“得意”死亡后爆炸伤害大幅提升",
      "levelId": "activities/act16mini/level_act16mini_06.json"
    },
    {
      "operation": "TG-7突袭",
      "challenge": "凶豕兽变得更加狂暴",
      "levelId": "activities/act16mini/level_act16mini_07.json"
    },
    {
      "operation": "TG-8突袭",
      "challenge": "“越长尘”出现得更多，并获得隐匿",
      "levelId": "activities/act16mini/level_act16mini_08.json"
    },
    {
      "operation": "GA-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，寻路者精锐狙击手拥有弹药时造成的伤害额外提升至150%",
      "levelId": "activities/act16side/level_act16side_ex01.json"
    },
    {
      "operation": "GA-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，场上 (2,9)、(3,9)、(4,9)3个位置禁止部署干员{最右边三个高台}",
      "levelId": "activities/act16side/level_act16side_ex02.json"
    },
    {
      "operation": "GA-EX-3突袭",
      "challenge": "场上所有<“冰淇淋机”> 初始被敌方占领，敌方单位的生命值提升至110%",
      "levelId": "activities/act16side/level_act16side_ex03.json"
    },
    {
      "operation": "GA-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至115%，<“冰淇淋机”>的生命值提升至400%",
      "levelId": "activities/act16side/level_act16side_ex04.json"
    },
    {
      "operation": "GA-EX-5突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，精致糖果车爆炸后造成的法术溅射伤害额外增加350",
      "levelId": "activities/act16side/level_act16side_ex05.json"
    },
    {
      "operation": "GA-EX-6突袭",
      "challenge": "队伍里只能编入最多8个干员，敌方单位的攻击力和生命值都提升至110%",
      "levelId": "activities/act16side/level_act16side_ex06.json"
    },
    {
      "operation": "GA-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至115%，额外出现：寻路者阵地撕裂者×1{43th}，寻路者突击手×11[2,3,4变4,4,6,6}",
      "levelId": "activities/act16side/level_act16side_ex07.json"
    },
    {
      "operation": "GA-EX-8突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，敌方单位处于地面效果“光赐予苦”范围内时，受到的物理和法术伤害变为减少至35%",
      "levelId": "activities/act16side/level_act16side_ex08.json"
    },
    {
      "operation": "OD-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，<畸变体傀儡>被击败时分裂的<畸变赘生物>数量增加1个",
      "levelId": "activities/act17d0/level_act17d0_ex01.json"
    },
    {
      "operation": "OD-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，<土石结构>的生命值降低至80%",
      "levelId": "activities/act17d0/level_act17d0_ex02.json"
    },
    {
      "operation": "OD-EX-3突袭",
      "challenge": "<“红标”精英渗透者>的移动速度提升至150%",
      "levelId": "activities/act17d0/level_act17d0_ex03.json"
    },
    {
      "operation": "OD-EX-3突袭",
      "challenge": "<“红标”精英渗透者>的移动速度提升至150%",
      "levelId": "activities/act17d0/level_act17d0_ex03.json"
    },
    {
      "operation": "OD-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至110%，我方单位的攻击力降低至60%",
      "levelId": "activities/act17d0/level_act17d0_ex04.json"
    },
    {
      "operation": "OD-EX-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，开场销毁位于(3,6)和(5,5)的<土石结构>",
      "levelId": "activities/act17d0/level_act17d0_ex05.json"
    },
    {
      "operation": "OD-EX-6突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，<源石畸变体α>获得隐匿效果",
      "levelId": "activities/act17d0/level_act17d0_ex06.json"
    },
    {
      "operation": "OD-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，<全息幻影MK2>的攻击力额外提升至150%，生命值额外提升至200%",
      "levelId": "activities/act17d0/level_act17d0_ex07.json"
    },
    {
      "operation": "OD-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，<全息幻影MK2>的攻击力额外提升至150%，生命值额外提升至200%",
      "levelId": "activities/act17d0/level_act17d0_ex07.json"
    },
    {
      "operation": "OD-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，场上有5个位置无法部署{(4,8)(5,8)(4,11)(5,11)(1,8)}",
      "levelId": "activities/act17d0/level_act17d0_ex08.json"
    },
    {
      "operation": "KR-1突袭",
      "challenge": "破阵者替换为破阵者组长",
      "levelId": "activities/act17mini/level_act17mini_01.json"
    },
    {
      "operation": "KR-2突袭",
      "challenge": "部分暴徒变为幽灵",
      "levelId": "activities/act17mini/level_act17mini_02.json"
    },
    {
      "operation": "KR-3突袭",
      "challenge": "家族士兵和叙拉古平民死亡时积累更多的血债账款",
      "levelId": "activities/act17mini/level_act17mini_03.json"
    },
    {
      "operation": "KR-4突袭",
      "challenge": "码头水手长在“水蚀”下不再额外流失生命",
      "levelId": "activities/act17mini/level_act17mini_04.json"
    },
    {
      "operation": "KR-5突袭",
      "challenge": "2个城防自走炮初始位置发生改变",
      "levelId": "activities/act17mini/level_act17mini_05.json"
    },
    {
      "operation": "KR-6突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act17mini/level_act17mini_06.json"
    },
    {
      "operation": "KR-7突袭",
      "challenge": "萨卡兹子裔改装补给车天赋效果变为2倍",
      "levelId": "activities/act17mini/level_act17mini_07.json"
    },
    {
      "operation": "KR-8突袭",
      "challenge": "“风筝”的生命值和攻击力大幅增加",
      "levelId": "activities/act17mini/level_act17mini_08.json"
    },
    {
      "operation": "SN-EX-1突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，生命值提升至120%，移动速度提升至150%",
      "levelId": "activities/act17side/level_act17side_ex01.json"
    },
    {
      "operation": "SN-EX-2突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，每3秒回复1点部署费用",
      "levelId": "activities/act17side/level_act17side_ex02.json"
    },
    {
      "operation": "SN-EX-3突袭",
      "challenge": "敌方单位的生命值提升至130%，障碍物的再部署时间额外增加100秒",
      "levelId": "activities/act17side/level_act17side_ex03.json"
    },
    {
      "operation": "SN-EX-4突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，额外出现的敌人如下： 富营养的喷溅者*4{开局左下红门刷出并前往左边四个溟痕罚站120秒，与普通难度右侧四个喷溅者完全对称}",
      "levelId": "activities/act17side/level_act17side_ex04.json"
    },
    {
      "operation": "SN-EX-5突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，生命值提升至150%",
      "levelId": "activities/act17side/level_act17side_ex05.json"
    },
    {
      "operation": "SN-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至120%，生命值提升至110%，战场中(6,9)，(5,10)，(6,10)，(4,3)，(5,6)，(4,6)，(4,7)7个位置不可部署{最右上角三格地面和中间高台的正左一格地面和中间高台右上角三格地面}",
      "levelId": "activities/act17side/level_act17side_ex06.json"
    },
    {
      "operation": "SN-EX-7突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，富营养的喷溅者获得隐匿",
      "levelId": "activities/act17side/level_act17side_ex07.json"
    },
    {
      "operation": "SN-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至120%，“屠谕者,大群意志”的攻击力、防御力、生命值额外再提升至120%",
      "levelId": "activities/act17side/level_act17side_ex08.json"
    },
    {
      "operation": "SN-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至120%，“屠谕者,大群意志”的攻击力、防御力、生命值额外再提升至120%",
      "levelId": "activities/act17side/level_act17side_ex08.json"
    },
    {
      "operation": "SN-S-1-A",
      "levelId": "activities/act17side/level_act17side_sub-1-1-a.json"
    },
    {
      "operation": "SN-S-1-B",
      "levelId": "activities/act17side/level_act17side_sub-1-1-b.json"
    },
    {
      "operation": "SN-S-2-A",
      "levelId": "activities/act17side/level_act17side_sub-1-2-a.json"
    },
    {
      "operation": "SN-S-2-B",
      "levelId": "activities/act17side/level_act17side_sub-1-2-b.json"
    },
    {
      "operation": "SN-S-3-A",
      "levelId": "activities/act17side/level_act17side_sub-1-3-a.json"
    },
    {
      "operation": "SN-S-3-B",
      "levelId": "activities/act17side/level_act17side_sub-1-3-b.json"
    },
    {
      "operation": "WD-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110% 移除位于(4,8)的可移动战术机库，启用位于(3,1){蓝门那行最左边那格}的可移动战术机库",
      "levelId": "activities/act18d0/level_act18d0_ex01.json"
    },
    {
      "operation": "WD-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，铁砧B型的生命值额外提升至200%",
      "levelId": "activities/act18d0/level_act18d0_ex02.json"
    },
    {
      "operation": "WD-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，铁砧B型的生命值额外提升至200%",
      "levelId": "activities/act18d0/level_act18d0_ex02.json"
    },
    {
      "operation": "WD-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至105%，生命值提升至110%，额外出现以下敌人：战术猎犬×4、战术猎犬pro×8、反装甲步兵×8，所有追加的敌人的属性和本关卡中出现过的同类型敌人相同",
      "levelId": "activities/act18d0/level_act18d0_ex03.json"
    },
    {
      "operation": "WD-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至120%，生命值提升至115%，破片、破片U型、铁砧、铁砧B型的自动撤退时间增加至300%。",
      "levelId": "activities/act18d0/level_act18d0_ex04.json"
    },
    {
      "operation": "WD-EX-5突袭",
      "challenge": "敌方单位的攻击力和生命值提升至110%，防御力提升至105%，可部署单位上限减少1。",
      "levelId": "activities/act18d0/level_act18d0_ex05.json"
    },
    {
      "operation": "WD-EX-6突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，移除位于(2,4)的可移动战术机库，启用位于(3,10){中间蓝门右边那格}的可移动战术机库",
      "levelId": "activities/act18d0/level_act18d0_ex06.json"
    },
    {
      "operation": "WD-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，破片U型的攻击力额外提升至150%，攻击范围提升至150%",
      "levelId": "activities/act18d0/level_act18d0_ex07.json"
    },
    {
      "operation": "WD-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，破片U型的攻击力额外提升至150%，攻击范围提升至150%",
      "levelId": "activities/act18d0/level_act18d0_ex07.json"
    },
    {
      "operation": "WD-EX-8突袭",
      "challenge": "敌方单位的生命值提升至110%， (2,3)、(2,4)、(2,5)、(2,6)、(2,7)、(2,8)、(2,9)7个位置无法部署{蓝门上那行中间七格}",
      "levelId": "activities/act18d0/level_act18d0_ex08.json"
    },
    {
      "operation": "SV-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至130%，生命值提升至130%。",
      "levelId": "activities/act18d3/level_act18d3_ex01.json"
    },
    {
      "operation": "SV-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，部署费用的自然回复速度降低至50%。",
      "levelId": "activities/act18d3/level_act18d3_ex02.json"
    },
    {
      "operation": "SV-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，我方单位的最大生命值降低至70%。",
      "levelId": "activities/act18d3/level_act18d3_ex03.json"
    },
    {
      "operation": "SV-EX-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%。战场上坐标为： (5,4)、(4,4)、(6,3)、(4,3)、(3,8)、(1,8)、(3,7)、(2,7)的8个位置{左装置上、下、右、右下四格和右装置上、下、左、左上四格}无法部署我方单位",
      "levelId": "activities/act18d3/level_act18d3_ex04.json"
    },
    {
      "operation": "SV-EX-5突袭",
      "challenge": "敌方单位的生命值提升至110%，富营养的收割者的攻击力提升至150%，造成的范围神经损伤效果提升至2倍。",
      "levelId": "activities/act18d3/level_act18d3_ex05.json"
    },
    {
      "operation": "SV-EX-5突袭",
      "challenge": "敌方单位的生命值提升至110%，富营养的收割者的攻击力提升至150%，造成的范围神经损伤效果提升至2倍。",
      "levelId": "activities/act18d3/level_act18d3_ex05.json"
    },
    {
      "operation": "SV-EX-6突袭",
      "challenge": "敌方单位的防御力提升至110%，生命值提升至120%，富营养的收割者的防御力额外提升至180%，生命值额外提升至200%。",
      "levelId": "activities/act18d3/level_act18d3_ex06.json"
    },
    {
      "operation": "SV-EX-6突袭",
      "challenge": "敌方单位的防御力提升至110%，生命值提升至120%，富营养的收割者的防御力额外提升至180%，生命值额外提升至200%。",
      "levelId": "activities/act18d3/level_act18d3_ex06.json"
    },
    {
      "operation": "SV-EX-7突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，首言者的生命值额外提升至150%，攻击范围提升至150%",
      "levelId": "activities/act18d3/level_act18d3_ex07.json"
    },
    {
      "operation": "SV-EX-7突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，首言者的生命值额外提升至150%，攻击范围提升至150%",
      "levelId": "activities/act18d3/level_act18d3_ex07.json"
    },
    {
      "operation": "SV-EX-8突袭",
      "challenge": "敌方单位的防御力提升至115%，生命值提升至125%，移除位于(4,2)和(4,10)的应急救治设施{左右两个}",
      "levelId": "activities/act18d3/level_act18d3_ex08.json"
    },
    {
      "operation": "SE-1突袭",
      "challenge": "<源石污染区>所在地块改变",
      "levelId": "activities/act18mini/level_act18mini_01.json"
    },
    {
      "operation": "SE-2突袭",
      "challenge": "出现额外的深池逐火战士",
      "levelId": "activities/act18mini/level_act18mini_02.json"
    },
    {
      "operation": "SE-3突袭",
      "challenge": "场上3处芦苇丛初始被点燃",
      "levelId": "activities/act18mini/level_act18mini_03.json"
    },
    {
      "operation": "SE-4突袭",
      "challenge": "孽罪奇美拉替换为渎罪奇美拉",
      "levelId": "activities/act18mini/level_act18mini_04.json"
    },
    {
      "operation": "SE-5突袭",
      "challenge": "战场中出现<活性源石风暴>",
      "levelId": "activities/act18mini/level_act18mini_05.json"
    },
    {
      "operation": "SE-6突袭",
      "challenge": "可使用障碍物数量减少2",
      "levelId": "activities/act18mini/level_act18mini_06.json"
    },
    {
      "operation": "SE-7突袭",
      "challenge": "所有萨卡兹骸骨卫士获得隐匿效果",
      "levelId": "activities/act18mini/level_act18mini_07.json"
    },
    {
      "operation": "SE-8突袭",
      "challenge": "所有萨卡兹骸骨卫士被击倒时，额外留下2个血珀",
      "levelId": "activities/act18mini/level_act18mini_08.json"
    },
    {
      "operation": "SE-S-1",
      "levelId": "activities/act18mini/level_act18mini_sub-1-1.json"
    },
    {
      "operation": "LE-EX-1突袭",
      "challenge": "禁止使用近卫和重装干员",
      "levelId": "activities/act18side/level_act18side_ex01.json"
    },
    {
      "operation": "LE-EX-2突袭",
      "challenge": "我方单位的攻击力降低",
      "levelId": "activities/act18side/level_act18side_ex02.json"
    },
    {
      "operation": "LE-EX-3突袭",
      "challenge": "黑水源石虫和黑水源石虫·α变为高能源石虫",
      "levelId": "activities/act18side/level_act18side_ex03.json"
    },
    {
      "operation": "LE-EX-4突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act18side/level_act18side_ex04.json"
    },
    {
      "operation": "LE-EX-5突袭",
      "challenge": "敌方单位的攻击速度提升",
      "levelId": "activities/act18side/level_act18side_ex05.json"
    },
    {
      "operation": "LE-EX-6突袭",
      "challenge": "队伍里只能编入最多7名干员",
      "levelId": "activities/act18side/level_act18side_ex06.json"
    },
    {
      "operation": "LE-EX-7突袭",
      "challenge": "敌方单位的生命值提升",
      "levelId": "activities/act18side/level_act18side_ex07.json"
    },
    {
      "operation": "LE-EX-8突袭",
      "challenge": "战场中的8个位置无法部署我方单位",
      "levelId": "activities/act18side/level_act18side_ex08.json"
    },
    {
      "operation": "DV-EX-1突袭",
      "challenge": "我方单位的生命值上限减少",
      "levelId": "activities/act19side/level_act19side_ex01.json"
    },
    {
      "operation": "DV-EX-2突袭",
      "challenge": "出现额外<R系列动力装甲>",
      "levelId": "activities/act19side/level_act19side_ex02.json"
    },
    {
      "operation": "DV-EX-3突袭",
      "challenge": "<R系列动力装甲>位置变化",
      "levelId": "activities/act19side/level_act19side_ex03.json"
    },
    {
      "operation": "DV-EX-4突袭",
      "challenge": "近卫和重装干员的部署费用提升至2倍",
      "levelId": "activities/act19side/level_act19side_ex04.json"
    },
    {
      "operation": "DV-EX-5突袭",
      "challenge": "敌方单位生命值大幅提升",
      "levelId": "activities/act19side/level_act19side_ex05.json"
    },
    {
      "operation": "DV-EX-6突袭",
      "challenge": "我方单位的防御力大幅下降",
      "levelId": "activities/act19side/level_act19side_ex06.json"
    },
    {
      "operation": "DV-EX-7突袭",
      "challenge": "多萝西获得隐匿",
      "levelId": "activities/act19side/level_act19side_ex07.json"
    },
    {
      "operation": "DV-EX-8突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act19side/level_act19side_ex08.json"
    },
    {
      "operation": "DV-S-1",
      "levelId": "activities/act19side/level_act19side_sub-1-1.json"
    },
    {
      "operation": "DV-S-2",
      "levelId": "activities/act19side/level_act19side_sub-1-2.json"
    },
    {
      "operation": "VEC-12",
      "levelId": "activities/act1break/level_act1break_12.json"
    },
    {
      "operation": "VEC-A",
      "levelId": "activities/act1break/level_act1break_13.json"
    },
    {
      "operation": "VEC-C",
      "levelId": "activities/act1break/level_act1break_15.json"
    },
    {
      "operation": "VEC-D",
      "levelId": "activities/act1break/level_act1break_16.json"
    },
    {
      "operation": "IC-EX-1突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_ex01.json"
    },
    {
      "operation": "IC-EX-2突袭",
      "challenge": "敌方单位的生命值大幅提升",
      "levelId": "activities/act20side/level_act20side_ex02.json"
    },
    {
      "operation": "IC-EX-3突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_ex03.json"
    },
    {
      "operation": "IC-EX-4突袭",
      "challenge": "场上有4个位置无法部署",
      "levelId": "activities/act20side/level_act20side_ex04.json"
    },
    {
      "operation": "IC-EX-5突袭",
      "challenge": "工蚁组长的生命值大幅提升",
      "levelId": "activities/act20side/level_act20side_ex05.json"
    },
    {
      "operation": "IC-EX-5突袭",
      "challenge": "工蚁组长的生命值大幅提升",
      "levelId": "activities/act20side/level_act20side_ex05.json"
    },
    {
      "operation": "IC-EX-6突袭",
      "challenge": "敌方单位的移动速度大幅提升",
      "levelId": "activities/act20side/level_act20side_ex06.json"
    },
    {
      "operation": "IC-EX-7突袭",
      "challenge": "烈酒级醒酒助手的能力持续时间大幅提升",
      "levelId": "activities/act20side/level_act20side_ex07.json"
    },
    {
      "operation": "IC-EX-8突袭",
      "challenge": "场上有9个位置无法部署",
      "levelId": "activities/act20side/level_act20side_ex08.json"
    },
    {
      "operation": "IC-S-1突袭",
      "challenge": "酒类协会会员的能力持续时间大幅提升，且出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_sub-1-1.json"
    },
    {
      "operation": "IC-S-1突袭",
      "challenge": "酒类协会会员的能力持续时间大幅提升，且出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_sub-1-1.json"
    },
    {
      "operation": "IC-S-2突袭",
      "challenge": "场上有4个位置无法部署",
      "levelId": "activities/act20side/level_act20side_sub-1-2.json"
    },
    {
      "operation": "IC-S-2突袭",
      "challenge": "场上有4个位置无法部署",
      "levelId": "activities/act20side/level_act20side_sub-1-2.json"
    },
    {
      "operation": "IC-S-3突袭",
      "challenge": "竞赛级沙滩车和烈酒级醒酒助手获得隐匿效果",
      "levelId": "activities/act20side/level_act20side_sub-1-3.json"
    },
    {
      "operation": "IC-S-4突袭",
      "challenge": "“物欲拮抗者”进入第二形态时受到的晕眩时间大幅降低",
      "levelId": "activities/act20side/level_act20side_sub-1-4.json"
    },
    {
      "operation": "IC-S-4突袭",
      "challenge": "“物欲拮抗者”进入第二形态时受到的晕眩时间大幅降低",
      "levelId": "activities/act20side/level_act20side_sub-1-4.json"
    },
    {
      "operation": "IS-EX-1突袭",
      "challenge": "叙拉古平民数量减少",
      "levelId": "activities/act21side/level_act21side_ex01.json"
    },
    {
      "operation": "IS-EX-2突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act21side/level_act21side_ex02.json"
    },
    {
      "operation": "IS-EX-3突袭",
      "challenge": "近卫，重装，特种干员阻挡数-1",
      "levelId": "activities/act21side/level_act21side_ex03.json"
    },
    {
      "operation": "IS-EX-4突袭",
      "challenge": "家族豪华轿车的攻击力大幅提升",
      "levelId": "activities/act21side/level_act21side_ex04.json"
    },
    {
      "operation": "IS-EX-4突袭",
      "challenge": "家族豪华轿车的攻击力大幅提升",
      "levelId": "activities/act21side/level_act21side_ex04.json"
    },
    {
      "operation": "IS-EX-5突袭",
      "challenge": "家族精英弩手，家族精英术师攻击范围大幅提升",
      "levelId": "activities/act21side/level_act21side_ex05.json"
    },
    {
      "operation": "IS-EX-6突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act21side/level_act21side_ex06.json"
    },
    {
      "operation": "IS-EX-7突袭",
      "challenge": "我方干员与召唤物再部署时间延长100%",
      "levelId": "activities/act21side/level_act21side_ex07.json"
    },
    {
      "operation": "IS-EX-8突袭",
      "challenge": "叙拉古平民数量减少",
      "levelId": "activities/act21side/level_act21side_ex08.json"
    },
    {
      "operation": "IS-S-1突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act21side/level_act21side_sub-1-1.json"
    },
    {
      "operation": "IS-S-1突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act21side/level_act21side_sub-1-1.json"
    },
    {
      "operation": "IS-S-2突袭",
      "challenge": "家族铁腕角头光环内被击倒的敌人使“血债帐款”额外增加",
      "levelId": "activities/act21side/level_act21side_sub-1-2.json"
    },
    {
      "operation": "IS-S-3突袭",
      "challenge": "家族暗影灭迹者攻击范围大幅增加",
      "levelId": "activities/act21side/level_act21side_sub-1-3.json"
    },
    {
      "operation": "IS-S-3突袭",
      "challenge": "家族暗影灭迹者攻击范围大幅增加",
      "levelId": "activities/act21side/level_act21side_sub-1-3.json"
    },
    {
      "operation": "IS-S-4突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act21side/level_act21side_sub-1-4.json"
    },
    {
      "operation": "IS-S-4突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act21side/level_act21side_sub-1-4.json"
    },
    {
      "operation": "IS-S-5突袭",
      "challenge": "“狼之主”进入第二形态后，攻击力大幅提升",
      "levelId": "activities/act21side/level_act21side_sub-1-5.json"
    },
    {
      "operation": "FC-EX-1突袭",
      "challenge": "敌方单位生命值大幅提升",
      "levelId": "activities/act22side/level_act22side_ex01.json"
    },
    {
      "operation": "FC-EX-2突袭",
      "challenge": "深池弩炮队长攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex02.json"
    },
    {
      "operation": "FC-EX-2突袭",
      "challenge": "深池弩炮队长攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex02.json"
    },
    {
      "operation": "FC-EX-3突袭",
      "challenge": "深池逐火精锐战士攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex03.json"
    },
    {
      "operation": "FC-EX-3突袭",
      "challenge": "深池逐火精锐战士攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex03.json"
    },
    {
      "operation": "FC-EX-4突袭",
      "challenge": "场上额外1处芦苇丛初始被点燃",
      "levelId": "activities/act22side/level_act22side_ex04.json"
    },
    {
      "operation": "FC-EX-5突袭",
      "challenge": "燃烧的芦苇丛造成的法术伤害与灼燃损伤提升",
      "levelId": "activities/act22side/level_act22side_ex05.json"
    },
    {
      "operation": "FC-EX-6突袭",
      "challenge": "深池逐火精锐护卫攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex06.json"
    },
    {
      "operation": "FC-EX-6突袭",
      "challenge": "深池逐火精锐护卫攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex06.json"
    },
    {
      "operation": "FC-EX-7突袭",
      "challenge": "深池逐火精锐护卫和“校官”获得隐匿",
      "levelId": "activities/act22side/level_act22side_ex07.json"
    },
    {
      "operation": "FC-EX-8突袭",
      "challenge": "场上6处芦苇丛初始被点燃",
      "levelId": "activities/act22side/level_act22side_ex08.json"
    },
    {
      "operation": "WB-EX-1突袭",
      "challenge": "山海众头目和山海众秘使攻击力提升",
      "levelId": "activities/act23side/level_act23side_ex01.json"
    },
    {
      "operation": "WB-EX-1突袭",
      "challenge": "山海众头目和山海众秘使攻击力提升",
      "levelId": "activities/act23side/level_act23side_ex01.json"
    },
    {
      "operation": "WB-EX-2突袭",
      "challenge": "出现额外<城防路障>",
      "levelId": "activities/act23side/level_act23side_ex02.json"
    },
    {
      "operation": "WB-EX-3突袭",
      "challenge": "场上四个位置不可部署",
      "levelId": "activities/act23side/level_act23side_ex03.json"
    },
    {
      "operation": "WB-EX-4突袭",
      "challenge": "场上六个位置不可部署",
      "levelId": "activities/act23side/level_act23side_ex04.json"
    },
    {
      "operation": "WB-EX-5突袭",
      "challenge": "敌方单位攻击速度提升",
      "levelId": "activities/act23side/level_act23side_ex05.json"
    },
    {
      "operation": "WB-EX-6突袭",
      "challenge": "“碎壁”和山海众连阵者防御力大幅提升",
      "levelId": "activities/act23side/level_act23side_ex06.json"
    },
    {
      "operation": "WB-EX-6突袭",
      "challenge": "“碎壁”和山海众连阵者防御力大幅提升",
      "levelId": "activities/act23side/level_act23side_ex06.json"
    },
    {
      "operation": "WB-EX-7突袭",
      "challenge": "“越长尘”生命值提升",
      "levelId": "activities/act23side/level_act23side_ex07.json"
    },
    {
      "operation": "WB-EX-7突袭",
      "challenge": "“越长尘”生命值提升",
      "levelId": "activities/act23side/level_act23side_ex07.json"
    },
    {
      "operation": "WB-EX-8突袭",
      "challenge": "我方单位阻挡数-1，妄境生命值提升",
      "levelId": "activities/act23side/level_act23side_ex08.json"
    },
    {
      "operation": "WB-EX-8突袭",
      "challenge": "我方单位阻挡数-1，妄境生命值提升",
      "levelId": "activities/act23side/level_act23side_ex08.json"
    },
    {
      "operation": "CF-EX-1突袭",
      "challenge": "威胁村庄的可能，情况危急。\n附加条件：\n出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex01.json"
    },
    {
      "operation": "CF-EX-2突袭",
      "challenge": "突然涌出大量暴躁的野兽，亟待处置。\n附加条件：\n炽焰源石虫的生命值大幅提升，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex02.json"
    },
    {
      "operation": "CF-EX-2突袭",
      "challenge": "突然涌出大量暴躁的野兽，亟待处置。\n附加条件：\n炽焰源石虫的生命值大幅提升，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex02.json"
    },
    {
      "operation": "CF-EX-3突袭",
      "challenge": "冠兽与刚甲爪兽的异常活动。\n附加条件：\n刚甲爪兽和坚岩冠兽受到来自非弱点部位的伤害进一步降低",
      "levelId": "activities/act24side/level_act24side_ex03.json"
    },
    {
      "operation": "CF-EX-4突袭",
      "challenge": "羽兽出没，眩光手雷适合应对此类状况。\n附加条件：\n敌人攻击速度降低，但生命值与攻击力大幅提升\n<热泵通道>每隔一段时间便会对其上的我军和敌军造成大量伤害",
      "levelId": "activities/act24side/level_act24side_ex04.json"
    },
    {
      "operation": "CF-EX-5突袭",
      "challenge": "的肆虐已构成极大威胁，必须及时处理。\n附加条件：\n我方单位阻挡数-1，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex05.json"
    },
    {
      "operation": "CF-EX-6突袭",
      "challenge": "点的强者才能通过此考验。\n附加条件：\n迅猛锋羽兽生命值与攻击力提升，战场中的15个位置无法部署我方单位",
      "levelId": "activities/act24side/level_act24side_ex06.json"
    },
    {
      "operation": "CF-EX-6突袭",
      "challenge": "点的强者才能通过此考验。\n附加条件：\n迅猛锋羽兽生命值与攻击力提升，战场中的15个位置无法部署我方单位",
      "levelId": "activities/act24side/level_act24side_ex06.json"
    },
    {
      "operation": "CF-EX-7突袭",
      "challenge": "点，照耀前路的英雄才能通过此考验。\n附加条件：战场中的8个位置无法部署我方单位，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex07.json"
    },
    {
      "operation": "CF-EX-8突袭",
      "challenge": "大地的火光会令天空恐惧。\n附加条件：火龙的生命值与攻击力提升，作战道具的再部署时间大幅增加",
      "levelId": "activities/act24side/level_act24side_ex08.json"
    },
    {
      "operation": "CF-EX-8突袭",
      "challenge": "大地的火光会令天空恐惧。\n附加条件：火龙的生命值与攻击力提升，作战道具的再部署时间大幅增加",
      "levelId": "activities/act24side/level_act24side_ex08.json"
    },
    {
      "operation": "CW-EX-1突袭",
      "challenge": "敌方生命值大幅提升",
      "levelId": "activities/act25side/level_act25side_ex01.json"
    },
    {
      "operation": "CW-EX-1突袭",
      "challenge": "敌方生命值大幅提升",
      "levelId": "activities/act25side/level_act25side_ex01.json"
    },
    {
      "operation": "CW-EX-2突袭",
      "challenge": "场上3个位置不可部署",
      "levelId": "activities/act25side/level_act25side_ex02.json"
    },
    {
      "operation": "CW-EX-3突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act25side/level_act25side_ex03.json"
    },
    {
      "operation": "CW-EX-4突袭",
      "challenge": "可放置人数-2",
      "levelId": "activities/act25side/level_act25side_ex04.json"
    },
    {
      "operation": "CW-EX-5突袭",
      "challenge": "我方单位阻挡数-1",
      "levelId": "activities/act25side/level_act25side_ex05.json"
    },
    {
      "operation": "CW-EX-6突袭",
      "challenge": "“十字路口\"试作型攻击力大幅提升",
      "levelId": "activities/act25side/level_act25side_ex06.json"
    },
    {
      "operation": "CW-EX-6突袭",
      "challenge": "“十字路口\"试作型攻击力大幅提升",
      "levelId": "activities/act25side/level_act25side_ex06.json"
    },
    {
      "operation": "CW-EX-7突袭",
      "challenge": "我方单位的攻击力与最大生命值大幅减少",
      "levelId": "activities/act25side/level_act25side_ex07.json"
    },
    {
      "operation": "CW-EX-8突袭",
      "challenge": "重装与近卫干员部署费用提升至3倍",
      "levelId": "activities/act25side/level_act25side_ex08.json"
    },
    {
      "operation": "CW-S-1-A",
      "levelId": "activities/act25side/level_act25side_sub-1-1-a.json"
    },
    {
      "operation": "CW-S-1-B",
      "levelId": "activities/act25side/level_act25side_sub-1-1-b.json"
    },
    {
      "operation": "CW-S-2-A",
      "levelId": "activities/act25side/level_act25side_sub-1-2-a.json"
    },
    {
      "operation": "CW-S-2-B",
      "levelId": "activities/act25side/level_act25side_sub-1-2-b.json"
    },
    {
      "operation": "CW-S-3-A",
      "levelId": "activities/act25side/level_act25side_sub-1-3-a.json"
    },
    {
      "operation": "CW-S-3-B",
      "levelId": "activities/act25side/level_act25side_sub-1-3-b.json"
    },
    {
      "operation": "CW-S-4突袭",
      "challenge": "星环周围8格我方单位攻速大幅减少，每个星环给克丽斯腾提供的减伤增加",
      "levelId": "activities/act25side/level_act25side_sub-1-4.json"
    },
    {
      "operation": "CW-S-4突袭",
      "challenge": "星环周围8格我方单位攻速大幅减少，每个星环给克丽斯腾提供的减伤增加",
      "levelId": "activities/act25side/level_act25side_sub-1-4.json"
    },
    {
      "operation": "HE-EX-1突袭",
      "challenge": "敌人生命值大幅提升",
      "levelId": "activities/act26side/level_act26side_ex01.json"
    },
    {
      "operation": "HE-EX-2突袭",
      "challenge": "禁止部署重装和辅助干员",
      "levelId": "activities/act26side/level_act26side_ex02.json"
    },
    {
      "operation": "HE-EX-3突袭",
      "challenge": "场上八个位置不可部署",
      "levelId": "activities/act26side/level_act26side_ex03.json"
    },
    {
      "operation": "HE-EX-4突袭",
      "challenge": "额外出现两个<塌落的墙垣>",
      "levelId": "activities/act26side/level_act26side_ex04.json"
    },
    {
      "operation": "HE-EX-5突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act26side/level_act26side_ex05.json"
    },
    {
      "operation": "HE-EX-6突袭",
      "challenge": "荒原窃盗者精英获得<隐匿>",
      "levelId": "activities/act26side/level_act26side_ex06.json"
    },
    {
      "operation": "HE-EX-7突袭",
      "challenge": "额外出现一个<塌落的墙垣>",
      "levelId": "activities/act26side/level_act26side_ex07.json"
    },
    {
      "operation": "HE-EX-8突袭",
      "challenge": "落石对我方单位伤害大幅提升",
      "levelId": "activities/act26side/level_act26side_ex08.json"
    },
    {
      "operation": "SL-EX-1突袭",
      "challenge": "敌人生命值提升",
      "levelId": "activities/act27side/level_act27side_ex01.json"
    },
    {
      "operation": "SL-EX-2突袭",
      "challenge": "场上四个位置不可部署",
      "levelId": "activities/act27side/level_act27side_ex02.json"
    },
    {
      "operation": "SL-EX-3突袭",
      "challenge": "<水汽汽水瓶>的部署费用大幅增加",
      "levelId": "activities/act27side/level_act27side_ex03.json"
    },
    {
      "operation": "SL-EX-4突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act27side/level_act27side_ex04.json"
    },
    {
      "operation": "SL-EX-5突袭",
      "challenge": "风情街“满天飞空员”移动速度大幅提升",
      "levelId": "activities/act27side/level_act27side_ex05.json"
    },
    {
      "operation": "SL-EX-5突袭",
      "challenge": "风情街“满天飞空员”移动速度大幅提升",
      "levelId": "activities/act27side/level_act27side_ex05.json"
    },
    {
      "operation": "SL-EX-6突袭",
      "challenge": "城市“龙卷风行者”造成的伤害大幅提升",
      "levelId": "activities/act27side/level_act27side_ex06.json"
    },
    {
      "operation": "SL-EX-6突袭",
      "challenge": "城市“龙卷风行者”造成的伤害大幅提升",
      "levelId": "activities/act27side/level_act27side_ex06.json"
    },
    {
      "operation": "SL-EX-7突袭",
      "challenge": "风情街“超新星术师”的攻击速度大幅提升",
      "levelId": "activities/act27side/level_act27side_ex07.json"
    },
    {
      "operation": "SL-EX-8突袭",
      "challenge": "多利，“羊之主”在漂浮阶段时技能释放频率增加",
      "levelId": "activities/act27side/level_act27side_ex08.json"
    },
    {
      "operation": "SL-MO-1",
      "levelId": "activities/act27side/level_act27side_mo01.json"
    },
    {
      "operation": "SL-S-1突袭",
      "challenge": "城市“龙卷风行者”造成的伤害大幅提升",
      "levelId": "activities/act27side/level_act27side_sub-1-1.json"
    },
    {
      "operation": "SL-S-1突袭",
      "challenge": "城市“龙卷风行者”造成的伤害大幅提升",
      "levelId": "activities/act27side/level_act27side_sub-1-1.json"
    },
    {
      "operation": "SL-S-2突袭",
      "challenge": "<水汽汽水瓶>的生命值大幅提升",
      "levelId": "activities/act27side/level_act27side_sub-1-2.json"
    },
    {
      "operation": "SL-S-2突袭",
      "challenge": "<水汽汽水瓶>的生命值大幅提升",
      "levelId": "activities/act27side/level_act27side_sub-1-2.json"
    },
    {
      "operation": "SL-S-3突袭",
      "challenge": "敌人移动速度提升",
      "levelId": "activities/act27side/level_act27side_sub-1-3.json"
    },
    {
      "operation": "SL-S-3突袭",
      "challenge": "敌人移动速度提升",
      "levelId": "activities/act27side/level_act27side_sub-1-3.json"
    },
    {
      "operation": "SL-S-3突袭",
      "challenge": "敌人移动速度提升",
      "levelId": "activities/act27side/level_act27side_sub-1-3.json"
    },
    {
      "operation": "SL-S-4突袭",
      "challenge": "替换部分敌人",
      "levelId": "activities/act27side/level_act27side_sub-1-4.json"
    },
    {
      "operation": "SL-S-4突袭",
      "challenge": "替换部分敌人",
      "levelId": "activities/act27side/level_act27side_sub-1-4.json"
    },
    {
      "operation": "SL-S-5突袭",
      "challenge": "多利，“羊之主”在漂浮阶段时的绒毛护盾值提升",
      "levelId": "activities/act27side/level_act27side_sub-1-5.json"
    },
    {
      "operation": "SL-S-5突袭",
      "challenge": "多利，“羊之主”在漂浮阶段时的绒毛护盾值提升",
      "levelId": "activities/act27side/level_act27side_sub-1-5.json"
    },
    {
      "operation": "CV-EX-1突袭",
      "challenge": "<废热喷口>受击回复技力效率降低",
      "levelId": "activities/act28side/level_act28side_ex01.json"
    },
    {
      "operation": "CV-EX-2突袭",
      "challenge": "<废热喷口>释放间隔大幅增加",
      "levelId": "activities/act28side/level_act28side_ex02.json"
    },
    {
      "operation": "CV-EX-3突袭",
      "challenge": "出现额外<废热喷口>",
      "levelId": "activities/act28side/level_act28side_ex03.json"
    },
    {
      "operation": "CV-EX-4突袭",
      "challenge": "<废热喷口>受击回复技力效率降低且初始技力减少",
      "levelId": "activities/act28side/level_act28side_ex04.json"
    },
    {
      "operation": "CV-EX-5突袭",
      "challenge": "出现额外<废热喷口>",
      "levelId": "activities/act28side/level_act28side_ex05.json"
    },
    {
      "operation": "CV-EX-6突袭",
      "challenge": "辐能源石虫·α死亡后使场上敌人获得更多能量",
      "levelId": "activities/act28side/level_act28side_ex06.json"
    },
    {
      "operation": "CV-EX-7突袭",
      "challenge": "出现额外<废热喷口>",
      "levelId": "activities/act28side/level_act28side_ex07.json"
    },
    {
      "operation": "CV-EX-8突袭",
      "challenge": "“桥夹”克里夫技能释放频率增加",
      "levelId": "activities/act28side/level_act28side_ex08.json"
    },
    {
      "operation": "ZT-EX-1突袭",
      "challenge": "场上一个位置不可部署",
      "levelId": "activities/act29side/level_act29side_ex01.json"
    },
    {
      "operation": "ZT-EX-2突袭",
      "challenge": "<湮灭之相>再部署时间延长",
      "levelId": "activities/act29side/level_act29side_ex02.json"
    },
    {
      "operation": "ZT-EX-3突袭",
      "challenge": "<调谐节点>获得单向防御护盾",
      "levelId": "activities/act29side/level_act29side_ex03.json"
    },
    {
      "operation": "ZT-EX-4突袭",
      "challenge": "所有敌人攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex04.json"
    },
    {
      "operation": "ZT-EX-5突袭",
      "challenge": "<调谐节点>获得单向防御护盾",
      "levelId": "activities/act29side/level_act29side_ex05.json"
    },
    {
      "operation": "ZT-EX-6突袭",
      "challenge": "巫王乐团小号手生命值和攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex06.json"
    },
    {
      "operation": "ZT-EX-6突袭",
      "challenge": "巫王乐团小号手生命值和攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex06.json"
    },
    {
      "operation": "ZT-EX-7突袭",
      "challenge": "巫王乐团指挥家攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex07.json"
    },
    {
      "operation": "ZT-EX-7突袭",
      "challenge": "巫王乐团指挥家攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex07.json"
    },
    {
      "operation": "ZT-EX-8突袭",
      "challenge": "赫尔昏佐伦，“巫王”释放【慵钝惩戒】技能的频率增加，击破“慵钝之印”所需伤害次数增加",
      "levelId": "activities/act29side/level_act29side_ex08.json"
    },
    {
      "operation": "ZT-EX-8突袭",
      "challenge": "赫尔昏佐伦，“巫王”释放【慵钝惩戒】技能的频率增加，击破“慵钝之印”所需伤害次数增加",
      "levelId": "activities/act29side/level_act29side_ex08.json"
    },
    {
      "operation": "ZT-EX-8突袭",
      "challenge": "赫尔昏佐伦，“巫王”释放【慵钝惩戒】技能的频率增加，击破“慵钝之印”所需伤害次数增加",
      "levelId": "activities/act29side/level_act29side_ex08.json"
    },
    {
      "operation": "ZT-S-1突袭",
      "challenge": "禁止部署特种干员",
      "levelId": "activities/act29side/level_act29side_sub-1-1.json"
    },
    {
      "operation": "ZT-S-1突袭",
      "challenge": "禁止部署特种干员",
      "levelId": "activities/act29side/level_act29side_sub-1-1.json"
    },
    {
      "operation": "ZT-S-2突袭",
      "challenge": "激昂变奏下，巫王乐团管乐家移动速度获得额外提升",
      "levelId": "activities/act29side/level_act29side_sub-1-2.json"
    },
    {
      "operation": "ZT-S-2突袭",
      "challenge": "激昂变奏下，巫王乐团管乐家移动速度获得额外提升",
      "levelId": "activities/act29side/level_act29side_sub-1-2.json"
    },
    {
      "operation": "ZT-S-3突袭",
      "challenge": "巫王乐团大提琴家生命值大幅提升，且在沉郁变奏下，护盾反弹的伤害大幅度提升",
      "levelId": "activities/act29side/level_act29side_sub-1-3.json"
    },
    {
      "operation": "ZT-S-3突袭",
      "challenge": "巫王乐团大提琴家生命值大幅提升，且在沉郁变奏下，护盾反弹的伤害大幅度提升",
      "levelId": "activities/act29side/level_act29side_sub-1-3.json"
    },
    {
      "operation": "ZT-S-4突袭",
      "challenge": "<调谐节点>技力消耗增加",
      "levelId": "activities/act29side/level_act29side_sub-1-4.json"
    },
    {
      "operation": "ZT-S-4突袭",
      "challenge": "<调谐节点>技力消耗增加",
      "levelId": "activities/act29side/level_act29side_sub-1-4.json"
    },
    {
      "operation": "ZT-S-5突袭",
      "challenge": "赫尔昏佐伦，“巫王”第一形态下瞬移间隔大幅度缩短",
      "levelId": "activities/act29side/level_act29side_sub-1-5.json"
    },
    {
      "operation": "RS-EX-1突袭",
      "challenge": "敌人移动速度大幅提升",
      "levelId": "activities/act30side/level_act30side_ex01.json"
    },
    {
      "operation": "RS-EX-1突袭",
      "challenge": "敌人移动速度大幅提升",
      "levelId": "activities/act30side/level_act30side_ex01.json"
    },
    {
      "operation": "RS-EX-2突袭",
      "challenge": "近卫、重装、特种干员阻挡数-1",
      "levelId": "activities/act30side/level_act30side_ex02.json"
    },
    {
      "operation": "RS-EX-3突袭",
      "challenge": "“访问团持盾长”最大特性层数提升",
      "levelId": "activities/act30side/level_act30side_ex03.json"
    },
    {
      "operation": "RS-EX-4突袭",
      "challenge": "先锋、近卫、重装部署费用提升至2倍",
      "levelId": "activities/act30side/level_act30side_ex04.json"
    },
    {
      "operation": "RS-EX-5突袭",
      "challenge": "场上初始出现额外敌人",
      "levelId": "activities/act30side/level_act30side_ex05.json"
    },
    {
      "operation": "RS-EX-6突袭",
      "challenge": "“沉眠高山驮兽”初始位置改变",
      "levelId": "activities/act30side/level_act30side_ex06.json"
    },
    {
      "operation": "RS-EX-7突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act30side/level_act30side_ex07.json"
    },
    {
      "operation": "RS-EX-8突袭",
      "challenge": "<点火石>费用增加至20",
      "levelId": "activities/act30side/level_act30side_ex08.json"
    },
    {
      "operation": "HS-EX-1突袭",
      "challenge": "场上的<泵站>朝向改变",
      "levelId": "activities/act31side/level_act31side_ex01.json"
    },
    {
      "operation": "HS-EX-2突袭",
      "challenge": "硬毫田鼷生命值大幅提升",
      "levelId": "activities/act31side/level_act31side_ex02.json"
    },
    {
      "operation": "HS-EX-2突袭",
      "challenge": "硬毫田鼷生命值大幅提升",
      "levelId": "activities/act31side/level_act31side_ex02.json"
    },
    {
      "operation": "HS-EX-3突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_ex03.json"
    },
    {
      "operation": "HS-EX-4突袭",
      "challenge": "勿玷位于受病害污染的田地上时，造成的法术伤害提升",
      "levelId": "activities/act31side/level_act31side_ex04.json"
    },
    {
      "operation": "HS-EX-5突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act31side/level_act31side_ex05.json"
    },
    {
      "operation": "HS-EX-6突袭",
      "challenge": "不再持有<泵站>",
      "levelId": "activities/act31side/level_act31side_ex06.json"
    },
    {
      "operation": "HS-EX-7突袭",
      "challenge": "除秽与厌肮被击倒时造成的病害污染大幅提升",
      "levelId": "activities/act31side/level_act31side_ex07.json"
    },
    {
      "operation": "HS-EX-8突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_ex08.json"
    },
    {
      "operation": "HS-S-1突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_sub-1-1.json"
    },
    {
      "operation": "HS-S-1突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_sub-1-1.json"
    },
    {
      "operation": "HS-S-2突袭",
      "challenge": "持有的<阻流阀>数量减少",
      "levelId": "activities/act31side/level_act31side_sub-1-2.json"
    },
    {
      "operation": "HS-S-2突袭",
      "challenge": "持有的<阻流阀>数量减少",
      "levelId": "activities/act31side/level_act31side_sub-1-2.json"
    },
    {
      "operation": "HS-S-3突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act31side/level_act31side_sub-1-3.json"
    },
    {
      "operation": "HS-S-3突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act31side/level_act31side_sub-1-3.json"
    },
    {
      "operation": "HS-S-4突袭",
      "challenge": "“祟”释放如梭所需的病害程度阈值大幅降低",
      "levelId": "activities/act31side/level_act31side_sub-1-4.json"
    },
    {
      "operation": "HS-S-4突袭",
      "challenge": "“祟”释放如梭所需的病害程度阈值大幅降低",
      "levelId": "activities/act31side/level_act31side_sub-1-4.json"
    },
    {
      "operation": "CR-EX-1突袭",
      "challenge": "场上5个位置不可部署",
      "levelId": "activities/act32side/level_act32side_ex01.json"
    },
    {
      "operation": "CR-EX-2突袭",
      "challenge": "出现额外的源石爆炸物，上方封阻物不再加固",
      "levelId": "activities/act32side/level_act32side_ex02.json"
    },
    {
      "operation": "CR-EX-3突袭",
      "challenge": "出现额外的无畏掷弹兵",
      "levelId": "activities/act32side/level_act32side_ex03.json"
    },
    {
      "operation": "CR-EX-4突袭",
      "challenge": "初始部署费用增加但不再回复费用",
      "levelId": "activities/act32side/level_act32side_ex04.json"
    },
    {
      "operation": "CR-EX-5突袭",
      "challenge": "出现额外的无畏掷弹兵",
      "levelId": "activities/act32side/level_act32side_ex05.json"
    },
    {
      "operation": "CR-EX-6突袭",
      "challenge": "近卫和特种的部署费用翻倍",
      "levelId": "activities/act32side/level_act32side_ex06.json"
    },
    {
      "operation": "CR-EX-7突袭",
      "challenge": "\"马特奥的近卫\"未被阻挡时，受到的物理和法术伤害额外降低",
      "levelId": "activities/act32side/level_act32side_ex07.json"
    },
    {
      "operation": "CR-EX-8突袭",
      "challenge": "出现额外的精英敌人",
      "levelId": "activities/act32side/level_act32side_ex08.json"
    },
    {
      "operation": "BB-EX-1突袭",
      "challenge": "出现额外的萨卡兹刀术师",
      "levelId": "activities/act33side/level_act33side_ex01.json"
    },
    {
      "operation": "BB-EX-2突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "activities/act33side/level_act33side_ex02.json"
    },
    {
      "operation": "BB-EX-2突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "activities/act33side/level_act33side_ex02.json"
    },
    {
      "operation": "BB-EX-3突袭",
      "challenge": "出现额外的流浪佣兵“编织者”",
      "levelId": "activities/act33side/level_act33side_ex03.json"
    },
    {
      "operation": "BB-EX-4突袭",
      "challenge": "赏金猎人“大骑士”的攻击力，生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_ex04.json"
    },
    {
      "operation": "BB-EX-4突袭",
      "challenge": "赏金猎人“大骑士”的攻击力，生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_ex04.json"
    },
    {
      "operation": "BB-EX-5突袭",
      "challenge": "可同时部署人数降至6",
      "levelId": "activities/act33side/level_act33side_ex05.json"
    },
    {
      "operation": "BB-EX-6突袭",
      "challenge": "场上有8个位置无法部署",
      "levelId": "activities/act33side/level_act33side_ex06.json"
    },
    {
      "operation": "BB-EX-7突袭",
      "challenge": "自由佣兵“主音吉他”的攻击力，生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_ex07.json"
    },
    {
      "operation": "BB-EX-7突袭",
      "challenge": "自由佣兵“主音吉他”的攻击力，生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_ex07.json"
    },
    {
      "operation": "BB-EX-8突袭",
      "challenge": "障碍物部署消耗的费用大幅提升",
      "levelId": "activities/act33side/level_act33side_ex08.json"
    },
    {
      "operation": "BB-S-1突袭",
      "challenge": "出现额外的流浪佣兵“编织者”，流浪佣兵“编织者”的生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_sub-1-1.json"
    },
    {
      "operation": "BB-S-1突袭",
      "challenge": "出现额外的流浪佣兵“编织者”，流浪佣兵“编织者”的生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_sub-1-1.json"
    },
    {
      "operation": "BB-S-2突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-2.json"
    },
    {
      "operation": "BB-S-2突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-2.json"
    },
    {
      "operation": "BB-S-2突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-2.json"
    },
    {
      "operation": "BB-S-3突袭",
      "challenge": "巫术弩炮的等级提升",
      "levelId": "activities/act33side/level_act33side_sub-1-3.json"
    },
    {
      "operation": "BB-S-4突袭",
      "challenge": "场上有5个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-4.json"
    },
    {
      "operation": "BB-S-4突袭",
      "challenge": "场上有5个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-4.json"
    },
    {
      "operation": "BP-EX-1突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act34side/level_act34side_ex01.json"
    },
    {
      "operation": "BP-EX-2突袭",
      "challenge": "异光体饲育者的攻击速度、移动速度、生命值提升",
      "levelId": "activities/act34side/level_act34side_ex02.json"
    },
    {
      "operation": "BP-EX-2突袭",
      "challenge": "异光体饲育者的攻击速度、移动速度、生命值提升",
      "levelId": "activities/act34side/level_act34side_ex02.json"
    },
    {
      "operation": "BP-EX-3突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "activities/act34side/level_act34side_ex03.json"
    },
    {
      "operation": "BP-EX-4突袭",
      "challenge": "初始出现额外的敌人",
      "levelId": "activities/act34side/level_act34side_ex04.json"
    },
    {
      "operation": "BP-EX-5突袭",
      "challenge": "初始存在的赘生甲壳数量减少",
      "levelId": "activities/act34side/level_act34side_ex05.json"
    },
    {
      "operation": "BP-EX-6突袭",
      "challenge": "“受诅者”的攻击力、生命值提升",
      "levelId": "activities/act34side/level_act34side_ex06.json"
    },
    {
      "operation": "BP-EX-6突袭",
      "challenge": "“受诅者”的攻击力、生命值提升",
      "levelId": "activities/act34side/level_act34side_ex06.json"
    },
    {
      "operation": "BP-EX-7突袭",
      "challenge": "场上有1个位置无法部署",
      "levelId": "activities/act34side/level_act34side_ex07.json"
    },
    {
      "operation": "BP-EX-8突袭",
      "challenge": "玛利图斯，“海嗣”释放【引导演化】提供的神经损伤能力大幅提升、释放【人性之囚】的频率增加",
      "levelId": "activities/act34side/level_act34side_ex08.json"
    },
    {
      "operation": "AS-EX-1突袭",
      "challenge": "持有的障碍物数量大幅减少",
      "levelId": "activities/act35side/level_act35side_ex01.json"
    },
    {
      "operation": "AS-EX-2突袭",
      "challenge": "净化结晶的效率大幅降低",
      "levelId": "activities/act35side/level_act35side_ex02.json"
    },
    {
      "operation": "AS-EX-2突袭",
      "challenge": "净化结晶的效率大幅降低",
      "levelId": "activities/act35side/level_act35side_ex02.json"
    },
    {
      "operation": "AS-EX-3突袭",
      "challenge": "“弹跳独轮车”的攻击速度大幅增加",
      "levelId": "activities/act35side/level_act35side_ex03.json"
    },
    {
      "operation": "AS-EX-4突袭",
      "challenge": "初始出现额外的“弹跳独轮车”",
      "levelId": "activities/act35side/level_act35side_ex04.json"
    },
    {
      "operation": "AS-EX-5突袭",
      "challenge": "出现额外的工蚁组长",
      "levelId": "activities/act35side/level_act35side_ex05.json"
    },
    {
      "operation": "AS-EX-6突袭",
      "challenge": "风情区大型车辇获得<隐匿>",
      "levelId": "activities/act35side/level_act35side_ex06.json"
    },
    {
      "operation": "AS-EX-7突袭",
      "challenge": "净化结晶的效率大幅降低",
      "levelId": "activities/act35side/level_act35side_ex07.json"
    },
    {
      "operation": "AS-EX-7突袭",
      "challenge": "净化结晶的效率大幅降低",
      "levelId": "activities/act35side/level_act35side_ex07.json"
    },
    {
      "operation": "AS-EX-8突袭",
      "challenge": "禁止部署特种干员",
      "levelId": "activities/act35side/level_act35side_ex08.json"
    },
    {
      "operation": "AS-S-1突袭",
      "challenge": "结晶为米奥，热烈的考验者提供的增益效果大幅增强，大型破碎器皿损失的生命值减少",
      "levelId": "activities/act35side/level_act35side_sub-1-1.json"
    },
    {
      "operation": "AS-S-1突袭",
      "challenge": "结晶为米奥，热烈的考验者提供的增益效果大幅增强，大型破碎器皿损失的生命值减少",
      "levelId": "activities/act35side/level_act35side_sub-1-1.json"
    },
    {
      "operation": "AS-S-2突袭",
      "challenge": "初始大型破碎器皿的行动路线有所不同，场上有2个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-2.json"
    },
    {
      "operation": "AS-S-3突袭",
      "challenge": "“弹跳独轮车”获得<隐匿>，场上有1个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-3.json"
    },
    {
      "operation": "AS-S-4突袭",
      "challenge": "部署在结晶上的单位攻击速度进一步降低",
      "levelId": "activities/act35side/level_act35side_sub-1-4.json"
    },
    {
      "operation": "DT-EX-1突袭",
      "challenge": "饿肚子流失更多生命，且敌人生命值大幅提升",
      "levelId": "activities/act36side/level_act36side_ex01.json"
    },
    {
      "operation": "DT-EX-2突袭",
      "challenge": "出现额外的<暴走食人花>",
      "levelId": "activities/act36side/level_act36side_ex02.json"
    },
    {
      "operation": "DT-EX-3突袭",
      "challenge": "<简饲源石虫>与<精饲源石虫>隐匿",
      "levelId": "activities/act36side/level_act36side_ex03.json"
    },
    {
      "operation": "DT-EX-4突袭",
      "challenge": "饿肚子流失更多生命",
      "levelId": "activities/act36side/level_act36side_ex04.json"
    },
    {
      "operation": "DT-EX-5突袭",
      "challenge": "初始场上的<硕果虫>不再出现",
      "levelId": "activities/act36side/level_act36side_ex05.json"
    },
    {
      "operation": "DT-EX-6突袭",
      "challenge": "敌人的生命值和攻击力大幅提升，开饭需要的食材大幅提升",
      "levelId": "activities/act36side/level_act36side_ex06.json"
    },
    {
      "operation": "DT-EX-7突袭",
      "challenge": "出现道路障碍物",
      "levelId": "activities/act36side/level_act36side_ex07.json"
    },
    {
      "operation": "DT-EX-8突袭",
      "challenge": "<“三头犬”>狂暴状态下攻击力、移动速度大幅提升",
      "levelId": "activities/act36side/level_act36side_ex08.json"
    },
    {
      "operation": "GO-EX-1突袭",
      "challenge": "所有敌人出场时携带未装配刀片",
      "levelId": "activities/act37side/level_act37side_ex01.json"
    },
    {
      "operation": "GO-EX-2突袭",
      "challenge": "“街区自治队”队长攻击力提升，且获得<隐匿>",
      "levelId": "activities/act37side/level_act37side_ex02.json"
    },
    {
      "operation": "GO-EX-2突袭",
      "challenge": "“街区自治队”队长攻击力提升，且获得<隐匿>",
      "levelId": "activities/act37side/level_act37side_ex02.json"
    },
    {
      "operation": "GO-EX-3突袭",
      "challenge": "“街区自治队”队长攻击力提升",
      "levelId": "activities/act37side/level_act37side_ex03.json"
    },
    {
      "operation": "GO-EX-3突袭",
      "challenge": "“街区自治队”队长攻击力提升",
      "levelId": "activities/act37side/level_act37side_ex03.json"
    },
    {
      "operation": "GO-EX-3突袭",
      "challenge": "“街区自治队”队长攻击力提升",
      "levelId": "activities/act37side/level_act37side_ex03.json"
    },
    {
      "operation": "GO-EX-4突袭",
      "challenge": "“铣痕”团伙精锐佣兵和大容量物资运输艇最大生命值提升",
      "levelId": "activities/act37side/level_act37side_ex04.json"
    },
    {
      "operation": "GO-EX-4突袭",
      "challenge": "“铣痕”团伙精锐佣兵和大容量物资运输艇最大生命值提升",
      "levelId": "activities/act37side/level_act37side_ex04.json"
    },
    {
      "operation": "GO-EX-4突袭",
      "challenge": "“铣痕”团伙精锐佣兵和大容量物资运输艇最大生命值提升",
      "levelId": "activities/act37side/level_act37side_ex04.json"
    },
    {
      "operation": "GO-EX-5突袭",
      "challenge": "场上部分军工厂指令平台消失",
      "levelId": "activities/act37side/level_act37side_ex05.json"
    },
    {
      "operation": "GO-EX-6突袭",
      "challenge": "“护目镜”帮派打手出场时携带冲击式施术单元",
      "levelId": "activities/act37side/level_act37side_ex06.json"
    },
    {
      "operation": "GO-EX-7突袭",
      "challenge": "场上出现额外的大容量物资运输艇，部分大容量物资运输艇初始位置改变",
      "levelId": "activities/act37side/level_act37side_ex07.json"
    },
    {
      "operation": "GO-EX-8突袭",
      "challenge": "阿利斯泰尔，帝国余晖的攻击范围扩大至全场",
      "levelId": "activities/act37side/level_act37side_ex08.json"
    },
    {
      "operation": "PV-EX-1突袭",
      "challenge": "<烟花发射器>生命值大幅度降低",
      "levelId": "activities/act38side/level_act38side_ex01.json"
    },
    {
      "operation": "PV-EX-2突袭",
      "challenge": "场上有3个位置无法部署",
      "levelId": "activities/act38side/level_act38side_ex02.json"
    },
    {
      "operation": "PV-EX-3突袭",
      "challenge": "<巡游零食车>攻击力大幅度提升",
      "levelId": "activities/act38side/level_act38side_ex03.json"
    },
    {
      "operation": "PV-EX-3突袭",
      "challenge": "<巡游零食车>攻击力大幅度提升",
      "levelId": "activities/act38side/level_act38side_ex03.json"
    },
    {
      "operation": "PV-EX-4突袭",
      "challenge": "我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_ex04.json"
    },
    {
      "operation": "PV-EX-5突袭",
      "challenge": "初始场上出现<“美食速递”>",
      "levelId": "activities/act38side/level_act38side_ex05.json"
    },
    {
      "operation": "PV-EX-6突袭",
      "challenge": "<烟花发射器>引线火苗变弱",
      "levelId": "activities/act38side/level_act38side_ex06.json"
    },
    {
      "operation": "PV-EX-7突袭",
      "challenge": "初始场上的<专业竞演者>路线改变",
      "levelId": "activities/act38side/level_act38side_ex07.json"
    },
    {
      "operation": "PV-EX-8突袭",
      "challenge": "我方单位再部署时间延长",
      "levelId": "activities/act38side/level_act38side_ex08.json"
    },
    {
      "operation": "PV-S-1突袭",
      "challenge": "所有<“美食速递”>替换为<“醉后狂欢”>，且我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_sub-1-1.json"
    },
    {
      "operation": "PV-S-2突袭",
      "challenge": "所有<巡游爵士乐手>替换为<“美食速递”>",
      "levelId": "activities/act38side/level_act38side_sub-1-2.json"
    },
    {
      "operation": "PV-S-2突袭",
      "challenge": "所有<巡游爵士乐手>替换为<“美食速递”>",
      "levelId": "activities/act38side/level_act38side_sub-1-2.json"
    },
    {
      "operation": "PV-S-3突袭",
      "challenge": "<烟花发射器>引线燃烧速度降低",
      "levelId": "activities/act38side/level_act38side_sub-1-3.json"
    },
    {
      "operation": "PV-S-3突袭",
      "challenge": "<烟花发射器>引线燃烧速度降低",
      "levelId": "activities/act38side/level_act38side_sub-1-3.json"
    },
    {
      "operation": "PV-S-3突袭",
      "challenge": "<烟花发射器>引线燃烧速度降低",
      "levelId": "activities/act38side/level_act38side_sub-1-3.json"
    },
    {
      "operation": "PV-S-4突袭",
      "challenge": "场上出现额外的<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-4.json"
    },
    {
      "operation": "PV-S-5突袭",
      "challenge": "场上出现额外的<热烈舞团领舞者>，且所有<专业竞演者>替换为<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-5.json"
    },
    {
      "operation": "PV-S-5突袭",
      "challenge": "场上出现额外的<热烈舞团领舞者>，且所有<专业竞演者>替换为<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-5.json"
    },
    {
      "operation": "EP-EX-1突袭",
      "challenge": "历险水手获得隐匿",
      "levelId": "activities/act39side/level_act39side_ex01.json"
    },
    {
      "operation": "EP-EX-2突袭",
      "challenge": "盐坨子炮攻击力大幅提升",
      "levelId": "activities/act39side/level_act39side_ex02.json"
    },
    {
      "operation": "EP-EX-3突袭",
      "challenge": "所有敌人生命值大幅提升",
      "levelId": "activities/act39side/level_act39side_ex03.json"
    },
    {
      "operation": "EP-EX-4突袭",
      "challenge": "场上额外出现2个恐怖厨子",
      "levelId": "activities/act39side/level_act39side_ex04.json"
    },
    {
      "operation": "EP-EX-5突袭",
      "challenge": "恐怖厨子减少物理与法术伤害的比例提升",
      "levelId": "activities/act39side/level_act39side_ex05.json"
    },
    {
      "operation": "EP-EX-6突袭",
      "challenge": "禁止部署重装和特种干员",
      "levelId": "activities/act39side/level_act39side_ex06.json"
    },
    {
      "operation": "EP-EX-7突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act39side/level_act39side_ex07.json"
    },
    {
      "operation": "EP-EX-8突袭",
      "challenge": "美声水手长召唤历险水手的间隔缩短",
      "levelId": "activities/act39side/level_act39side_ex08.json"
    },
    {
      "operation": "OR-EX-1突袭",
      "challenge": "场上出现额外的“饱食”",
      "levelId": "activities/act40side/level_act40side_ex01.json"
    },
    {
      "operation": "OR-EX-2突袭",
      "challenge": "场上出现额外的飘香",
      "levelId": "activities/act40side/level_act40side_ex02.json"
    },
    {
      "operation": "OR-EX-3突袭",
      "challenge": "可部署的箱子数量大幅减少",
      "levelId": "activities/act40side/level_act40side_ex03.json"
    },
    {
      "operation": "OR-EX-4突袭",
      "challenge": "战场有3个位置无法部署",
      "levelId": "activities/act40side/level_act40side_ex04.json"
    },
    {
      "operation": "OR-EX-5突袭",
      "challenge": "出现额外的“里子”",
      "levelId": "activities/act40side/level_act40side_ex05.json"
    },
    {
      "operation": "OR-EX-6突袭",
      "challenge": "出现额外的招财",
      "levelId": "activities/act40side/level_act40side_ex06.json"
    },
    {
      "operation": "OR-EX-7突袭",
      "challenge": "<火灶>和<废弃火灶>位置改变，部分敌人类型改变",
      "levelId": "activities/act40side/level_act40side_ex07.json"
    },
    {
      "operation": "OR-EX-8突袭",
      "challenge": "<火灶>所需技力增加",
      "levelId": "activities/act40side/level_act40side_ex08.json"
    },
    {
      "operation": "OR-S-1突袭",
      "challenge": "“废食”召唤技能冷却时间减少",
      "levelId": "activities/act40side/level_act40side_sub-1-1.json"
    },
    {
      "operation": "OR-S-1突袭",
      "challenge": "“废食”召唤技能冷却时间减少",
      "levelId": "activities/act40side/level_act40side_sub-1-1.json"
    },
    {
      "operation": "OR-S-2突袭",
      "challenge": "辅助、特种干员部署费用提升至3倍",
      "levelId": "activities/act40side/level_act40side_sub-1-2.json"
    },
    {
      "operation": "OR-S-2突袭",
      "challenge": "辅助、特种干员部署费用提升至3倍",
      "levelId": "activities/act40side/level_act40side_sub-1-2.json"
    },
    {
      "operation": "OR-S-3突袭",
      "challenge": "“饮露餐风”造成的伤害提升",
      "levelId": "activities/act40side/level_act40side_sub-1-3.json"
    },
    {
      "operation": "OR-S-3突袭",
      "challenge": "“饮露餐风”造成的伤害提升",
      "levelId": "activities/act40side/level_act40side_sub-1-3.json"
    },
    {
      "operation": "OR-S-4突袭",
      "challenge": "无谓生命值提升",
      "levelId": "activities/act40side/level_act40side_sub-1-4.json"
    },
    {
      "operation": "OR-S-4突袭",
      "challenge": "无谓生命值提升",
      "levelId": "activities/act40side/level_act40side_sub-1-4.json"
    },
    {
      "operation": "OR-S-4突袭",
      "challenge": "无谓生命值提升",
      "levelId": "activities/act40side/level_act40side_sub-1-4.json"
    },
    {
      "operation": "EA-EX-1突袭",
      "challenge": "初始场上的<空壳>不再出现",
      "levelId": "activities/act41side/level_act41side_ex01.json"
    },
    {
      "operation": "EA-EX-2突袭",
      "challenge": "场上有3个位置无法部署",
      "levelId": "activities/act41side/level_act41side_ex02.json"
    },
    {
      "operation": "EA-EX-3突袭",
      "challenge": "指路草获得<隐匿>",
      "levelId": "activities/act41side/level_act41side_ex03.json"
    },
    {
      "operation": "EA-EX-4突袭",
      "challenge": "地形和敌人等有所不同",
      "levelId": "activities/act41side/level_act41side_ex04.json"
    },
    {
      "operation": "EA-EX-5突袭",
      "challenge": "战场上额外出现4个<盾与墙>",
      "levelId": "activities/act41side/level_act41side_ex05.json"
    },
    {
      "operation": "EA-EX-6突袭",
      "challenge": "<盾与墙>初始位置改变",
      "levelId": "activities/act41side/level_act41side_ex06.json"
    },
    {
      "operation": "EA-EX-7突袭",
      "challenge": "场上有5个位置无法部署",
      "levelId": "activities/act41side/level_act41side_ex07.json"
    },
    {
      "operation": "EA-EX-8突袭",
      "challenge": "战场上额外出现2个<盾与墙>",
      "levelId": "activities/act41side/level_act41side_ex08.json"
    },
    {
      "operation": "MT-EX-1突袭",
      "challenge": "法术抗性提升",
      "levelId": "activities/act42side/level_act42side_ex01.json"
    },
    {
      "operation": "MT-EX-2突袭",
      "challenge": "<“萨科塔昂首”>生命值提升",
      "levelId": "activities/act42side/level_act42side_ex02.json"
    },
    {
      "operation": "MT-EX-2突袭",
      "challenge": "<“萨科塔昂首”>生命值提升",
      "levelId": "activities/act42side/level_act42side_ex02.json"
    },
    {
      "operation": "MT-EX-3突袭",
      "challenge": "<圣堂射手扮演者>不再出现",
      "levelId": "activities/act42side/level_act42side_ex03.json"
    },
    {
      "operation": "MT-EX-4突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act42side/level_act42side_ex04.json"
    },
    {
      "operation": "MT-EX-5突袭",
      "challenge": "<圣徒祈祷像>和<“牧首”>提供屏障的速率提升",
      "levelId": "activities/act42side/level_act42side_ex05.json"
    },
    {
      "operation": "MT-EX-6突袭",
      "challenge": "<资深圣堂布道员>技能持续时间提升",
      "levelId": "activities/act42side/level_act42side_ex06.json"
    },
    {
      "operation": "MT-EX-7突袭",
      "challenge": "可同时部署干员单位数-2",
      "levelId": "activities/act42side/level_act42side_ex07.json"
    },
    {
      "operation": "MT-EX-8突袭",
      "challenge": "术师、医疗干员部署费用变为2倍",
      "levelId": "activities/act42side/level_act42side_ex08.json"
    },
    {
      "operation": "MT-S-1突袭",
      "challenge": "出现额外敌人且部分<冰淇淋机>初始阵营改变",
      "levelId": "activities/act42side/level_act42side_sub-1-1.json"
    },
    {
      "operation": "MT-S-1突袭",
      "challenge": "出现额外敌人且部分<冰淇淋机>初始阵营改变",
      "levelId": "activities/act42side/level_act42side_sub-1-1.json"
    },
    {
      "operation": "MT-S-2突袭",
      "challenge": "出现额外敌人且<荒原窃盗者精英>获得隐匿",
      "levelId": "activities/act42side/level_act42side_sub-1-2.json"
    },
    {
      "operation": "MT-S-2突袭",
      "challenge": "出现额外敌人且<荒原窃盗者精英>获得隐匿",
      "levelId": "activities/act42side/level_act42side_sub-1-2.json"
    },
    {
      "operation": "MT-S-3突袭",
      "challenge": "出现额外敌人且<资深圣堂保育员>生命值提升",
      "levelId": "activities/act42side/level_act42side_sub-1-3.json"
    },
    {
      "operation": "MT-S-3突袭",
      "challenge": "出现额外敌人且<资深圣堂保育员>生命值提升",
      "levelId": "activities/act42side/level_act42side_sub-1-3.json"
    },
    {
      "operation": "MT-S-3突袭",
      "challenge": "出现额外敌人且<资深圣堂保育员>生命值提升",
      "levelId": "activities/act42side/level_act42side_sub-1-3.json"
    },
    {
      "operation": "MT-S-4突袭",
      "challenge": "<腐败萃聚使徒>位置和路线变化",
      "levelId": "activities/act42side/level_act42side_sub-1-4.json"
    },
    {
      "operation": "MT-S-4突袭",
      "challenge": "<腐败萃聚使徒>位置和路线变化",
      "levelId": "activities/act42side/level_act42side_sub-1-4.json"
    },
    {
      "operation": "MT-S-5突袭",
      "challenge": "<“圣徒”>额外进行一次<寻根圣事>",
      "levelId": "activities/act42side/level_act42side_sub-1-5.json"
    },
    {
      "operation": "MT-S-5突袭",
      "challenge": "<“圣徒”>额外进行一次<寻根圣事>",
      "levelId": "activities/act42side/level_act42side_sub-1-5.json"
    },
    {
      "operation": "AD-EX-1突袭",
      "challenge": "部署费用的回复速度降低",
      "levelId": "activities/act43side/level_act43side_ex01.json"
    },
    {
      "operation": "AD-EX-2突袭",
      "challenge": "特种干员的部署费用提升至1.5倍",
      "levelId": "activities/act43side/level_act43side_ex02.json"
    },
    {
      "operation": "AD-EX-3突袭",
      "challenge": "出现额外的顺从内心的设计师",
      "levelId": "activities/act43side/level_act43side_ex03.json"
    },
    {
      "operation": "AD-EX-4突袭",
      "challenge": "出现额外的沉浸艺术的群演，且沉浸艺术的群演获得隐匿",
      "levelId": "activities/act43side/level_act43side_ex04.json"
    },
    {
      "operation": "AD-EX-5突袭",
      "challenge": "战场上额外出现<打光道具>",
      "levelId": "activities/act43side/level_act43side_ex05.json"
    },
    {
      "operation": "AD-EX-6突袭",
      "challenge": "<打光道具>的生命值提升",
      "levelId": "activities/act43side/level_act43side_ex06.json"
    },
    {
      "operation": "AD-EX-7突袭",
      "challenge": "场上有1个位置无法部署，且意识自由的假人移动速度提升",
      "levelId": "activities/act43side/level_act43side_ex07.json"
    },
    {
      "operation": "AD-EX-7突袭",
      "challenge": "场上有1个位置无法部署，且意识自由的假人移动速度提升",
      "levelId": "activities/act43side/level_act43side_ex07.json"
    },
    {
      "operation": "AD-EX-8突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "activities/act43side/level_act43side_ex08.json"
    },
    {
      "operation": "CB-EX1突袭",
      "challenge": "敌方单位生命值提升至110%  神射手攻击力提升至150%",
      "levelId": "activities/act5d0/level_act5d0_ex01.json"
    },
    {
      "operation": "CB-EX1突袭",
      "challenge": "敌方单位生命值提升至110%  神射手攻击力提升至150%",
      "levelId": "activities/act5d0/level_act5d0_ex01.json"
    },
    {
      "operation": "CB-EX2突袭",
      "challenge": "敌方单位生命值提升至120%  近战敌人生命值提升至120%，攻击力提升至200%，防御力提升至110%  (注:近战敌人同时享受敌方单位BUFF，关系为乘算)",
      "levelId": "activities/act5d0/level_act5d0_ex02.json"
    },
    {
      "operation": "CB-EX2突袭",
      "challenge": "敌方单位生命值提升至120%  近战敌人生命值提升至120%，攻击力提升至200%，防御力提升至110%  (注:近战敌人同时享受敌方单位BUFF，关系为乘算)",
      "levelId": "activities/act5d0/level_act5d0_ex02.json"
    },
    {
      "operation": "CB-EX4突袭",
      "challenge": "敌方单位生命值提升至120%，攻击力和防御力都提升至110%  神射手生命值提升至166.7%，攻击范围提升至110%  (注:神射手同时享受敌方单位BUFF，关系为乘算)",
      "levelId": "activities/act5d0/level_act5d0_ex04.json"
    },
    {
      "operation": "CB-EX4突袭",
      "challenge": "敌方单位生命值提升至120%，攻击力和防御力都提升至110%  神射手生命值提升至166.7%，攻击范围提升至110%  (注:神射手同时享受敌方单位BUFF，关系为乘算)",
      "levelId": "activities/act5d0/level_act5d0_ex04.json"
    },
    {
      "operation": "CB-EX7突袭",
      "challenge": "战场中的6个位置(右下6高台)无法部署我方单位  敌方单位生命值提升至120%，攻击力和防御力都提升至110%",
      "levelId": "activities/act5d0/level_act5d0_ex07.json"
    },
    {
      "operation": "CB-EX8突袭",
      "challenge": "指挥终端的SP消耗量提高至180  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "activities/act5d0/level_act5d0_ex08.json"
    },
    {
      "operation": "AF-1突袭",
      "challenge": "我方所有远程干员的部署费用增至3倍，敌方单位的生命值、防御力都提升至110%，攻击力提升至120%",
      "levelId": "activities/act6d5/level_act6d5_01.json"
    },
    {
      "operation": "AF-2突袭",
      "challenge": "敌方单位的生命值提升至120%，攻击力提升至160%，防御力提升至110%",
      "levelId": "activities/act6d5/level_act6d5_02.json"
    },
    {
      "operation": "AF-3突袭",
      "challenge": "敌方单位的生命值、攻击力都提升至110%，酸液源石虫的攻击降低50%,但攻击速度提升至200%",
      "levelId": "activities/act6d5/level_act6d5_03.json"
    },
    {
      "operation": "AF-3突袭",
      "challenge": "敌方单位的生命值、攻击力都提升至110%，酸液源石虫的攻击降低50%,但攻击速度提升至200%",
      "levelId": "activities/act6d5/level_act6d5_03.json"
    },
    {
      "operation": "AF-4突袭",
      "challenge": "敌方单位的生命值、防御力都提升至110%，大鲍勃的生命值提升至200% (同时享受敌方单位BUFF，乘算)",
      "levelId": "activities/act6d5/level_act6d5_04.json"
    },
    {
      "operation": "AF-4突袭",
      "challenge": "敌方单位的生命值、防御力都提升至110%，大鲍勃的生命值提升至200% (同时享受敌方单位BUFF，乘算)",
      "levelId": "activities/act6d5/level_act6d5_04.json"
    },
    {
      "operation": "AF-5突袭",
      "challenge": "敌方单位的生命值、攻击力都提升至120%，防御力提升至110%，场上(3,4)无法部署单位{唯一的地面}",
      "levelId": "activities/act6d5/level_act6d5_05.json"
    },
    {
      "operation": "AF-6突袭",
      "challenge": "敌方单位的生命值提升至110%，阻挡数减少的持续时间提升至2倍",
      "levelId": "activities/act6d5/level_act6d5_06.json"
    },
    {
      "operation": "AF-7突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110%，粉碎攻坚组长的生命值提升至137% (同时享受敌方单位BUFF，乘算)",
      "levelId": "activities/act6d5/level_act6d5_07.json"
    },
    {
      "operation": "AF-7突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110%，粉碎攻坚组长的生命值提升至137% (同时享受敌方单位BUFF，乘算)",
      "levelId": "activities/act6d5/level_act6d5_07.json"
    },
    {
      "operation": "AF-8突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至105%，场上(5,8)，(4,8)，(3,8)，(5,7)，(4,7)，(3,7)，(5,9)，(4,9)，(3,9)9个地块无法部署单位{最右边九个格子}",
      "levelId": "activities/act6d5/level_act6d5_08.json"
    },
    {
      "operation": "SA-1突袭",
      "challenge": "所有敌人生命值提升至115%、攻击力提升至110%、防御力提升至150%",
      "levelId": "activities/act7d5/level_act7d5_01.json"
    },
    {
      "operation": "SA-2突袭",
      "challenge": "所有敌人生命值、防御力都提升至110%，所有远程敌人的攻击范围扩大至150%",
      "levelId": "activities/act7d5/level_act7d5_02.json"
    },
    {
      "operation": "SA-3突袭",
      "challenge": "所有敌人生命值提升至120%、攻击力提升至115%、防御力提升至110%，战场中(4,2)，(4,3)，(4,4)，(5,4)4个位置无法部署单位{左上三格地火和源石地板}",
      "levelId": "activities/act7d5/level_act7d5_03.json"
    },
    {
      "operation": "SA-4突袭",
      "challenge": "<特战术师>获得隐匿效果，所有敌人生命值、攻击力、防御力都提升至105%",
      "levelId": "activities/act7d5/level_act7d5_04.json"
    },
    {
      "operation": "SA-5突袭",
      "challenge": "所有敌人生命值提升至110%、防御力提升至120%，狂暴宿主士兵与狂暴宿主组长的移动速度提升至110%、攻击力提升至115%",
      "levelId": "activities/act7d5/level_act7d5_05.json"
    },
    {
      "operation": "SA-5突袭",
      "challenge": "所有敌人生命值提升至110%、防御力提升至120%，狂暴宿主士兵与狂暴宿主组长的移动速度提升至110%、攻击力提升至115%",
      "levelId": "activities/act7d5/level_act7d5_05.json"
    },
    {
      "operation": "SA-6突袭",
      "challenge": "最多可编入10名干员进行作战，所有敌人生命值、攻击力都提升至110%",
      "levelId": "activities/act7d5/level_act7d5_06.json"
    },
    {
      "operation": "PL-1突袭",
      "challenge": "敌方单位的生命值，攻击力和防御力都提升至110%。隐形弩手的攻击力额外提升至140%，攻击范围提升至120%。",
      "levelId": "activities/act7mini/level_act7mini_01.json"
    },
    {
      "operation": "PL-1突袭",
      "challenge": "敌方单位的生命值，攻击力和防御力都提升至110%。隐形弩手的攻击力额外提升至140%，攻击范围提升至120%。",
      "levelId": "activities/act7mini/level_act7mini_01.json"
    },
    {
      "operation": "PL-2突袭",
      "challenge": "禁止部署重装和狙击干员。敌方单位的生命值，攻击力和防御力都提升至110%。",
      "levelId": "activities/act7mini/level_act7mini_02.json"
    },
    {
      "operation": "PL-3突袭",
      "challenge": "敌方单位的生命值提升至110%。乌萨斯突袭弩手的攻击力提升至170%；空降组长的生命值额外提升至200%，防御力提升至250%。",
      "levelId": "activities/act7mini/level_act7mini_03.json"
    },
    {
      "operation": "PL-3突袭",
      "challenge": "敌方单位的生命值提升至110%。乌萨斯突袭弩手的攻击力提升至170%；空降组长的生命值额外提升至200%，防御力提升至250%。",
      "levelId": "activities/act7mini/level_act7mini_03.json"
    },
    {
      "operation": "PL-3突袭",
      "challenge": "敌方单位的生命值提升至110%。乌萨斯突袭弩手的攻击力提升至170%；空降组长的生命值额外提升至200%，防御力提升至250%。",
      "levelId": "activities/act7mini/level_act7mini_03.json"
    },
    {
      "operation": "PL-4突袭",
      "challenge": "我方单位阻挡数-2。敌方单位的生命值，攻击力和防御力都提升至110%。",
      "levelId": "activities/act7mini/level_act7mini_04.json"
    },
    {
      "operation": "PL-5突袭",
      "challenge": "移除战场中的4个<土石结构>{左边一个和右边三个}和2个<盾卫>{左和右}",
      "levelId": "activities/act7mini/level_act7mini_05.json"
    },
    {
      "operation": "VI-1突袭",
      "challenge": "游击队盾卫数量减少，额外出现一名提亚卡乌冠军；敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act8mini/level_act8mini_01.json"
    },
    {
      "operation": "VI-2突袭",
      "challenge": "额外出现一名战争幽灵；敌方单位的攻击力提升至105%，生命值提升至110%",
      "levelId": "activities/act8mini/level_act8mini_02.json"
    },
    {
      "operation": "VI-3突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110% 畸变体傀儡、变异岩蛛、变异岩蛛α的攻击力额外提升至150%，生命值额外提升至200%",
      "levelId": "activities/act8mini/level_act8mini_03.json"
    },
    {
      "operation": "VI-3突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110% 畸变体傀儡、变异岩蛛、变异岩蛛α的攻击力额外提升至150%，生命值额外提升至200%",
      "levelId": "activities/act8mini/level_act8mini_03.json"
    },
    {
      "operation": "VI-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110% 我方干员技力自然回复速度降低至25%",
      "levelId": "activities/act8mini/level_act8mini_04.json"
    },
    {
      "operation": "VI-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至105%，生命值提升至110% 浮士德的特殊狙击伤害提升至120%，冷却时间（含初始冷却）降低至75%",
      "levelId": "activities/act8mini/level_act8mini_05.json"
    },
    {
      "operation": "VI-6突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110%，所有近卫干员和术师干员的攻击力降低至60%",
      "levelId": "activities/act8mini/level_act8mini_06.json"
    },
    {
      "operation": "VI-7突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110%，所有我方单位的再部署时间提升至175%",
      "levelId": "activities/act8mini/level_act8mini_07.json"
    },
    {
      "operation": "DM-EX-1突袭",
      "challenge": "敌方单位生命值和攻击力都提升至115%、防御力提升至105% 敌方远程单位射程提升至150%",
      "levelId": "activities/act9d0/level_act9d0_ex01.json"
    },
    {
      "operation": "DM-EX-2突袭",
      "challenge": "萨卡兹百夫长与爆破攻坚手获得隐匿效果、敌方单位生命值和攻击力都提升至115%",
      "levelId": "activities/act9d0/level_act9d0_ex02.json"
    },
    {
      "operation": "DM-EX-3突袭",
      "challenge": "敌方单位生命值和攻击力都提升至110%、萨卡兹穿刺手的冲锋伤害提升至120%",
      "levelId": "activities/act9d0/level_act9d0_ex03.json"
    },
    {
      "operation": "DM-EX-4突袭",
      "challenge": "敌方单位生命值和防御力都提升至110%、攻击力提升至120%、我方生命值上限降低50%",
      "levelId": "activities/act9d0/level_act9d0_ex04.json"
    },
    {
      "operation": "DM-EX-5突袭",
      "challenge": "禁止部署特种与狙击干员、敌方单位生命值和攻击力都提升至110%",
      "levelId": "activities/act9d0/level_act9d0_ex05.json"
    },
    {
      "operation": "DM-EX-6突袭",
      "challenge": "敌方单位攻击力提升至105%、防御力提升至110%、萨卡兹哨兵组长的移动速度提升至120%",
      "levelId": "activities/act9d0/level_act9d0_ex06.json"
    },
    {
      "operation": "DM-EX-6突袭",
      "challenge": "敌方单位攻击力提升至105%、防御力提升至110%、萨卡兹哨兵组长的移动速度提升至120%",
      "levelId": "activities/act9d0/level_act9d0_ex06.json"
    },
    {
      "operation": "PS-1突袭",
      "challenge": "敌方单位的生命值提升至180%",
      "levelId": "activities/act9mini/level_act9mini_01.json"
    },
    {
      "operation": "PS-2突袭",
      "challenge": "禁止部署近卫干员，敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "activities/act9mini/level_act9mini_02.json"
    },
    {
      "operation": "PS-3突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%，额外出现以下敌人：高阶术师×4（左下，7th、14th、24th、29th），宿主拾荒者×1（左上，10th），宿主流浪者×1（左上，31st）",
      "levelId": "activities/act9mini/level_act9mini_03.json"
    },
    {
      "operation": "PS-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，我方单位的生命值降低至70%",
      "levelId": "activities/act9mini/level_act9mini_04.json"
    },
    {
      "operation": "PS-5突袭",
      "challenge": "{中间两个红门上下和地图最左上角左下角}开局额外出现4名<反装甲步兵组长>，敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "activities/act9mini/level_act9mini_05.json"
    },
    {
      "operation": "PS-6突袭",
      "challenge": "<游击队迫击炮兵组长>和<“锈铜”奥尔默·英格拉>获得隐匿效果，敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "activities/act9mini/level_act9mini_06.json"
    },
    {
      "operation": "H10-1",
      "levelId": "obt/hard/level_hard_10-01.json"
    },
    {
      "operation": "H10-2",
      "levelId": "obt/hard/level_hard_10-02.json"
    },
    {
      "operation": "H10-3",
      "levelId": "obt/hard/level_hard_10-03.json"
    },
    {
      "operation": "H10-3",
      "levelId": "obt/hard/level_hard_10-03.json"
    },
    {
      "operation": "H11-1",
      "levelId": "obt/hard/level_hard_11-01.json"
    },
    {
      "operation": "H11-2",
      "levelId": "obt/hard/level_hard_11-02.json"
    },
    {
      "operation": "H11-3",
      "levelId": "obt/hard/level_hard_11-03.json"
    },
    {
      "operation": "H11-4",
      "levelId": "obt/hard/level_hard_11-04.json"
    },
    {
      "operation": "H12-1",
      "levelId": "obt/hard/level_hard_12-01.json"
    },
    {
      "operation": "H12-2",
      "levelId": "obt/hard/level_hard_12-02.json"
    },
    {
      "operation": "H12-3",
      "levelId": "obt/hard/level_hard_12-03.json"
    },
    {
      "operation": "H12-4",
      "levelId": "obt/hard/level_hard_12-04.json"
    },
    {
      "operation": "H13-1",
      "levelId": "obt/hard/level_hard_13-01.json"
    },
    {
      "operation": "H13-2",
      "levelId": "obt/hard/level_hard_13-02.json"
    },
    {
      "operation": "H13-3",
      "levelId": "obt/hard/level_hard_13-03.json"
    },
    {
      "operation": "H13-4",
      "levelId": "obt/hard/level_hard_13-04.json"
    },
    {
      "operation": "H14-1",
      "levelId": "obt/hard/level_hard_14-01.json"
    },
    {
      "operation": "H14-2",
      "levelId": "obt/hard/level_hard_14-02.json"
    },
    {
      "operation": "H14-3",
      "levelId": "obt/hard/level_hard_14-03.json"
    },
    {
      "operation": "H14-4",
      "levelId": "obt/hard/level_hard_14-04.json"
    },
    {
      "operation": "H15-1",
      "levelId": "obt/hard/level_hard_15-01.json"
    },
    {
      "operation": "H15-2",
      "levelId": "obt/hard/level_hard_15-02.json"
    },
    {
      "operation": "H15-3",
      "levelId": "obt/hard/level_hard_15-03.json"
    },
    {
      "operation": "H15-4",
      "levelId": "obt/hard/level_hard_15-04.json"
    },
    {
      "operation": "6-1突袭",
      "challenge": "可部署单位上限减少2  敌方单位生命值、攻击力都提升至120%，防御力提升至105%",
      "levelId": "obt/main/level_main_06-01.json"
    },
    {
      "operation": "6-2突袭",
      "challenge": "敌方单位生命值、攻击力都提升至110%  防御力提升至105%，攻击速度提升至170%",
      "levelId": "obt/main/level_main_06-02.json"
    },
    {
      "operation": "6-3突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方狂暴宿主士兵攻击力提升至181%",
      "levelId": "obt/main/level_main_06-03.json"
    },
    {
      "operation": "6-3突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方狂暴宿主士兵攻击力提升至181%",
      "levelId": "obt/main/level_main_06-03.json"
    },
    {
      "operation": "6-4突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方狂暴宿主投掷手的生命值提升至181%",
      "levelId": "obt/main/level_main_06-04.json"
    },
    {
      "operation": "6-4突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方狂暴宿主投掷手的生命值提升至181%",
      "levelId": "obt/main/level_main_06-04.json"
    },
    {
      "operation": "6-8突袭",
      "challenge": "敌方单位生命值提升至120%  移动速度提升至150%",
      "levelId": "obt/main/level_main_06-07.json"
    },
    {
      "operation": "6-9突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方雪怪小队和霜牙对被【冻结】单位的攻击力再提升至166.7%",
      "levelId": "obt/main/level_main_06-08.json"
    },
    {
      "operation": "6-10突袭",
      "challenge": "敌方单位生命值提升至110%  敌方雪怪小队凿冰人的生命值提升至150%，攻击速度提升至300%",
      "levelId": "obt/main/level_main_06-09.json"
    },
    {
      "operation": "6-10突袭",
      "challenge": "敌方单位生命值提升至110%  敌方雪怪小队凿冰人的生命值提升至150%，攻击速度提升至300%",
      "levelId": "obt/main/level_main_06-09.json"
    },
    {
      "operation": "6-12突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方源石冰晶的技能冷却减少50%",
      "levelId": "obt/main/level_main_06-11.json"
    },
    {
      "operation": "6-14突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方虚幻无人机的移动速度提升至150%",
      "levelId": "obt/main/level_main_06-12.json"
    },
    {
      "operation": "6-14突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方虚幻无人机的移动速度提升至150%",
      "levelId": "obt/main/level_main_06-12.json"
    },
    {
      "operation": "6-15突袭",
      "challenge": "敌方单位的攻击力提升至110%  敌方虚幻无人机的射程减少至90%,但生命值、防御力都提升至200%",
      "levelId": "obt/main/level_main_06-13.json"
    },
    {
      "operation": "6-15突袭",
      "challenge": "敌方单位的攻击力提升至110%  敌方虚幻无人机的射程减少至90%,但生命值、防御力都提升至200%",
      "levelId": "obt/main/level_main_06-13.json"
    },
    {
      "operation": "7-2突袭",
      "challenge": "敌方单位攻击力提升至115%  宿主流浪者与宿主士兵组长生命值都提升至200%",
      "levelId": "obt/main/level_main_07-01.json"
    },
    {
      "operation": "7-2突袭",
      "challenge": "敌方单位攻击力提升至115%  宿主流浪者与宿主士兵组长生命值都提升至200%",
      "levelId": "obt/main/level_main_07-01.json"
    },
    {
      "operation": "7-3突袭",
      "challenge": "敌方单位生命值提升至110%，防御力提升至120%  我方单位防御力减半",
      "levelId": "obt/main/level_main_07-02.json"
    },
    {
      "operation": "7-4突袭",
      "challenge": "敌方单位生命值和攻击力都提升至110%  所有敌人移动速度提升至150%",
      "levelId": "obt/main/level_main_07-03.json"
    },
    {
      "operation": "7-5突袭",
      "challenge": "远程单位部署费用提升至2倍  敌方单位生命值提升至105%、攻击力提升至115%",
      "levelId": "obt/main/level_main_07-04.json"
    },
    {
      "operation": "7-6突袭",
      "challenge": "敌方单位生命值提升至170%、防御力提升至110%",
      "levelId": "obt/main/level_main_07-05.json"
    },
    {
      "operation": "7-9突袭",
      "challenge": "敌方单位生命值和攻击力都提升至110%  游击队传令兵生命值提升至150%",
      "levelId": "obt/main/level_main_07-07.json"
    },
    {
      "operation": "7-9突袭",
      "challenge": "敌方单位生命值和攻击力都提升至110%  游击队传令兵生命值提升至150%",
      "levelId": "obt/main/level_main_07-07.json"
    },
    {
      "operation": "7-10突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  雇佣军萨卡兹战士攻击速度提升至200%",
      "levelId": "obt/main/level_main_07-08.json"
    },
    {
      "operation": "7-10突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  雇佣军萨卡兹战士攻击速度提升至200%",
      "levelId": "obt/main/level_main_07-08.json"
    },
    {
      "operation": "7-11突袭",
      "challenge": "敌人移动速度-60%  敌方单位生命值和攻击力都提升至180%",
      "levelId": "obt/main/level_main_07-09.json"
    },
    {
      "operation": "7-12突袭",
      "challenge": "敌方单位生命值提升至120%  攻击力提升至110%、防御力提升至150% ",
      "levelId": "obt/main/level_main_07-10.json"
    },
    {
      "operation": "7-13突袭",
      "challenge": "禁止部署狙击与近卫干员  敌方单位生命值和攻击力都提升至110%",
      "levelId": "obt/main/level_main_07-11.json"
    },
    {
      "operation": "7-14突袭",
      "challenge": "敌方单位攻击力提升至150%",
      "levelId": "obt/main/level_main_07-12.json"
    },
    {
      "operation": "7-15突袭",
      "challenge": "敌方单位攻击力提升至120%  游击队盾卫生命值减少至33%，但防御力提升至1950，法术抗性提升至90",
      "levelId": "obt/main/level_main_07-13.json"
    },
    {
      "operation": "7-15突袭",
      "challenge": "敌方单位攻击力提升至120%  游击队盾卫生命值减少至33%，但防御力提升至1950，法术抗性提升至90",
      "levelId": "obt/main/level_main_07-13.json"
    },
    {
      "operation": "7-16突袭",
      "challenge": "最多可携带干员数降至7  敌方单位生命值提升至120%、攻击力提升至110%",
      "levelId": "obt/main/level_main_07-14.json"
    },
    {
      "operation": "7-17突袭",
      "challenge": "禁止部署近卫与术师干员  敌方单位生命值提升至105%、攻击力提升至110%",
      "levelId": "obt/main/level_main_07-15.json"
    },
    {
      "operation": "7-18突袭",
      "challenge": "战场中的6个位置无法部署我方单位(三列高台上下六格)  敌方单位生命值提升至120%、攻击力提升至110%",
      "levelId": "obt/main/level_main_07-16.json"
    },
    {
      "operation": "R8-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%、战场中(2,6)、(2,9)、(5,9)3个位置{右下角三个高台}无法部署我方单位",
      "levelId": "obt/main/level_main_08-01.json"
    },
    {
      "operation": "R8-2突袭",
      "challenge": "我方单位阻挡数-1、敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "obt/main/level_main_08-02.json"
    },
    {
      "operation": "R8-3突袭",
      "challenge": "远程单位部署费用提升至2倍  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "obt/main/level_main_08-03.json"
    },
    {
      "operation": "R8-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  敌方单位的攻击速度提升至200%",
      "levelId": "obt/main/level_main_08-04.json"
    },
    {
      "operation": "R8-5突袭",
      "challenge": "敌方单位的生命值提升至110%  乌萨斯突击者的攻击力、防御力提升至150%  其他敌方单位的攻击力、防御力提升至110%",
      "levelId": "obt/main/level_main_08-05.json"
    },
    {
      "operation": "R8-5突袭",
      "challenge": "敌方单位的生命值提升至110%  乌萨斯突击者的攻击力、防御力提升至150%  其他敌方单位的攻击力、防御力提升至110%",
      "levelId": "obt/main/level_main_08-05.json"
    },
    {
      "operation": "R8-6突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  乌萨斯着铠术师的攻击范围提升至150%",
      "levelId": "obt/main/level_main_08-06.json"
    },
    {
      "operation": "R8-7突袭",
      "challenge": "敌方单位的攻击力、防御力提升至110%  帝国火炮先兆者的生命值提升至200%  其他敌方单位的生命值提升至110%",
      "levelId": "obt/main/level_main_08-07.json"
    },
    {
      "operation": "R8-7突袭",
      "challenge": "敌方单位的攻击力、防御力提升至110%  帝国火炮先兆者的生命值提升至200%  其他敌方单位的生命值提升至110%",
      "levelId": "obt/main/level_main_08-07.json"
    },
    {
      "operation": "R8-8突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  我方单位的攻击力降低至65%",
      "levelId": "obt/main/level_main_08-08.json"
    },
    {
      "operation": "M8-6突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  狂暴宿主士兵、狂暴宿主组长、狂暴宿主掷骨手的攻击速度提升至130%",
      "levelId": "obt/main/level_main_08-09.json"
    },
    {
      "operation": "M8-6突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  狂暴宿主士兵、狂暴宿主组长、狂暴宿主掷骨手的攻击速度提升至130%",
      "levelId": "obt/main/level_main_08-09.json"
    },
    {
      "operation": "R8-9突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  路障的生命值提升至200%",
      "levelId": "obt/main/level_main_08-10.json"
    },
    {
      "operation": "R8-10突袭",
      "challenge": "可部署单位上限减少3  敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "obt/main/level_main_08-11.json"
    },
    {
      "operation": "M8-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  萨卡兹宿主百夫长的吸血效果提升至200%",
      "levelId": "obt/main/level_main_08-12.json"
    },
    {
      "operation": "R8-11突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  帝国前锋精锐、帝国前锋百战精锐的攻击力、生命值额外提升至140%",
      "levelId": "obt/main/level_main_08-13.json"
    },
    {
      "operation": "R8-11突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  帝国前锋精锐、帝国前锋百战精锐的攻击力、生命值额外提升至140%",
      "levelId": "obt/main/level_main_08-13.json"
    },
    {
      "operation": "M8-8突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  梅菲斯特，“歌者”的毒性粉尘伤害提升至200%",
      "levelId": "obt/main/level_main_08-14.json"
    },
    {
      "operation": "JT8-2突袭",
      "challenge": "塔露拉立即进入狂暴状态  敌方单位的攻击力、生命值提升至110%",
      "levelId": "obt/main/level_main_08-16.json"
    },
    {
      "operation": "JT8-3突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  能量聚合体造成的法术伤害提升400",
      "levelId": "obt/main/level_main_08-17.json"
    },
    {
      "operation": "15-3突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-02.json"
    },
    {
      "operation": "15-3突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-02.json"
    },
    {
      "operation": "15-4突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-03.json"
    },
    {
      "operation": "15-4突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-03.json"
    },
    {
      "operation": "15-5突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-04.json"
    },
    {
      "operation": "15-6突袭",
      "challenge": "内测版自助出餐终端召唤技能冷却时间减少",
      "levelId": "obt/main/level_main_15-05.json"
    },
    {
      "operation": "15-7突袭",
      "challenge": "内测版自助出餐终端召唤技能冷却时间减少",
      "levelId": "obt/main/level_main_15-06.json"
    },
    {
      "operation": "15-8突袭",
      "challenge": "稳定态萨卡兹术师结晶的防御力大幅提升",
      "levelId": "obt/main/level_main_15-07.json"
    },
    {
      "operation": "15-8突袭",
      "challenge": "稳定态萨卡兹术师结晶的防御力大幅提升",
      "levelId": "obt/main/level_main_15-07.json"
    },
    {
      "operation": "15-9突袭",
      "challenge": "战场中有4个位置无法部署我方单位",
      "levelId": "obt/main/level_main_15-08.json"
    },
    {
      "operation": "15-10突袭",
      "challenge": "敌人的防御力大幅提升",
      "levelId": "obt/main/level_main_15-09.json"
    },
    {
      "operation": "15-10突袭",
      "challenge": "敌人的防御力大幅提升",
      "levelId": "obt/main/level_main_15-09.json"
    },
    {
      "operation": "15-11突袭",
      "challenge": "部署费用的回复速度降低",
      "levelId": "obt/main/level_main_15-10.json"
    },
    {
      "operation": "15-12突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-11.json"
    },
    {
      "operation": "15-13突袭",
      "challenge": "我方单位的攻击力降低",
      "levelId": "obt/main/level_main_15-12.json"
    },
    {
      "operation": "15-14突袭",
      "challenge": "部分地块会长出源石晶簇造成范围伤害",
      "levelId": "obt/main/level_main_15-13.json"
    },
    {
      "operation": "15-15突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-14.json"
    },
    {
      "operation": "15-17突袭",
      "challenge": "敌人的攻击力大幅提升",
      "levelId": "obt/main/level_main_15-15.json"
    },
    {
      "operation": "15-17突袭",
      "challenge": "敌人的攻击力大幅提升",
      "levelId": "obt/main/level_main_15-15.json"
    },
    {
      "operation": "15-18突袭",
      "challenge": "我方单位的防御力降低",
      "levelId": "obt/main/level_main_15-16.json"
    },
    {
      "operation": "15-20突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-18.json"
    },
    {
      "operation": "15-20突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-18.json"
    }
  ],
  //敌人属性修改
  "ebuff_attribute": [
    {
      "operation": "GT-HX-1突袭",
      "challenge": "我方所有远程单位的部署费用增加至3倍  敌方单位的攻击力提升至110%",
      "levelId": "activities/a001/level_a001_ex04.json"
    },
    {
      "operation": "GT-HX-2突袭",
      "challenge": "敌方单位的攻击速度提升至200%",
      "levelId": "activities/a001/level_a001_ex05.json"
    },
    {
      "operation": "GT-HX-3突袭",
      "challenge": "障碍物的部署费用增加至15  敌方单位数值不变",
      "levelId": "activities/a001/level_a001_ex06.json"
    },
    {
      "operation": "TW-EX-2突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，所有敌人的移动速度提升至150%",
      "levelId": "activities/act11d0/level_act11d0_ex02.json"
    },
    {
      "operation": "TW-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至120%，生命值提升至120%，我方干员防御力降低至30%",
      "levelId": "activities/act11d0/level_act11d0_ex07.json"
    },
    {
      "operation": "MN-EX-2突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110% 敌方源石冰晶的技能冷却减少50%",
      "levelId": "activities/act13d5/level_act13d5_ex02.json"
    },
    {
      "operation": "MN-EX-5突袭",
      "challenge": "初始有两座“留声机”被敌人占领  敌方单位的攻击力、生命值提升至110%",
      "levelId": "activities/act13d5/level_act13d5_ex05.json"
    },
    {
      "operation": "NL-S-4突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都额外提升至110%，血骑士额外召唤凝血之刃×9",
      "levelId": "activities/act13side/level_act13side_sub-1-4.json"
    },
    {
      "operation": "LK-DP-B",
      "levelId": "activities/act1lock/level_act1lock_b-02.json"
    },
    {
      "operation": "OF-EX1突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110%  敌方远程单位攻击范围提升至200%",
      "levelId": "activities/act3d0/level_act3d0_ex01.json"
    },
    {
      "operation": "OF-EX2突袭",
      "challenge": "敌方单位生命值、攻击力都提升至110%，防御力提升至150%",
      "levelId": "activities/act3d0/level_act3d0_ex02.json"
    },
    {
      "operation": "OF-EX3突袭",
      "challenge": "敌方单位生命值提升至120%，攻击力提升至110%  攻击速度提升至200%",
      "levelId": "activities/act3d0/level_act3d0_ex03.json"
    },
    {
      "operation": "OF-EX4突袭",
      "challenge": "医疗职业干员的部署费用提升至三倍  敌方单位生命值、攻击力、防御力都提升至110%",
      "levelId": "activities/act3d0/level_act3d0_ex04.json"
    },
    {
      "operation": "OF-EX5突袭",
      "challenge": "部署费用的自然回复速度降低三分之二  敌方单位生命值提升至110%",
      "levelId": "activities/act3d0/level_act3d0_ex05.json"
    },
    {
      "operation": "OF-EX6突袭",
      "challenge": "障碍物的可部署数量减少至6个  敌方单位生命值提升至120%，攻击力和防御力都提升至110%",
      "levelId": "activities/act3d0/level_act3d0_ex06.json"
    },
    {
      "operation": "CB-EX3突袭",
      "challenge": "允许编入干员下降至5名  敌方单位的生命值提升至115%，攻击力和防御力都提升至105%",
      "levelId": "activities/act5d0/level_act5d0_ex03.json"
    },
    {
      "operation": "CB-EX5突袭",
      "challenge": "术师干员部署费用增加至3倍  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "activities/act5d0/level_act5d0_ex05.json"
    },
    {
      "operation": "CB-EX6突袭",
      "challenge": "近卫与先锋干员阻挡数-1  敌方单位的生命值和攻击力都提升至105%",
      "levelId": "activities/act5d0/level_act5d0_ex06.json"
    },
    {
      "operation": "0-1突袭",
      "challenge": "部署费用不自然回复",
      "levelId": "obt/main/level_main_00-01.json"
    },
    {
      "operation": "0-2突袭",
      "challenge": "我方所有单位攻击力减半",
      "levelId": "obt/main/level_main_00-02.json"
    },
    {
      "operation": "0-3突袭",
      "challenge": "敌方单位的生命值提升至200%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_00-03.json"
    },
    {
      "operation": "0-4突袭",
      "challenge": "禁止使用狙击干员  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-04.json"
    },
    {
      "operation": "0-5突袭",
      "challenge": "敌方单位的生命值和防御力都提升至120%，攻击力提升至200%",
      "levelId": "obt/main/level_main_00-05.json"
    },
    {
      "operation": "0-6突袭",
      "challenge": "部署费用的自然回复速度降至一半  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-06.json"
    },
    {
      "operation": "0-7突袭",
      "challenge": "术师职业干员的部署费用增至3倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-07.json"
    },
    {
      "operation": "0-8突袭",
      "challenge": "我方所有单位的最大生命值减半  敌方单位的生命值、攻击力、防御力都提升至120% ",
      "levelId": "obt/main/level_main_00-08.json"
    },
    {
      "operation": "0-9突袭",
      "challenge": "禁止使用重装干员  敌方单位的生命值提升至130%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_00-09.json"
    },
    {
      "operation": "0-10突袭",
      "challenge": "我方所有单位的防御力减半  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-10.json"
    },
    {
      "operation": "0-11突袭",
      "challenge": "我方所有近战干员的部署费用增至3倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-11.json"
    },
    {
      "operation": "1-1突袭",
      "challenge": "同时可布置干员数降至4  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-01.json"
    },
    {
      "operation": "1-2",
      "levelId": "obt/main/level_main_01-02.json"
    },
    {
      "operation": "1-3突袭",
      "challenge": "敌方单位的生命值提升至180%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_01-03.json"
    },
    {
      "operation": "1-4突袭",
      "challenge": "我方所有远程单位的部署费用增至3倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-04.json"
    },
    {
      "operation": "1-5突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至120%  移动速度提升至200%",
      "levelId": "obt/main/level_main_01-05.json"
    },
    {
      "operation": "1-6突袭",
      "challenge": "可使用的障碍物数量降至1  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-06.json"
    },
    {
      "operation": "1-7突袭",
      "challenge": "部署费用的自然回复速度减半  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-07.json"
    },
    {
      "operation": "1-8突袭",
      "challenge": "敌方单位的生命值提升至150%，攻击力和防御力都提升至120%  敌方头目的能力冷却降低至35%",
      "levelId": "obt/main/level_main_01-08.json"
    },
    {
      "operation": "1-9突袭",
      "challenge": "禁止使用重装干员  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-09.json"
    },
    {
      "operation": "1-10突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至120%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_01-10.json"
    },
    {
      "operation": "1-11",
      "levelId": "obt/main/level_main_01-11.json"
    },
    {
      "operation": "1-12突袭",
      "challenge": "医疗职业干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-12.json"
    },
    {
      "operation": "2-1突袭",
      "challenge": "禁止使用术师干员  敌方单位的生命值提升至130%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_02-01.json"
    },
    {
      "operation": "2-2突袭",
      "challenge": "禁止使用辅助干员  敌方单位的生命值和防御力都提升至120%，攻击力提升至110%",
      "levelId": "obt/main/level_main_02-02.json"
    },
    {
      "operation": "2-3突袭",
      "challenge": "障碍物和我方近战单位的部署费用加倍  敌方单位的生命值提升至120%，防御力提升至110%",
      "levelId": "obt/main/level_main_02-03.json"
    },
    {
      "operation": "2-4突袭",
      "challenge": "敌方单位的生命值提升至200%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_02-04.json"
    },
    {
      "operation": "2-5突袭",
      "challenge": "近卫和狙击职业干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_02-05.json"
    },
    {
      "operation": "2-6突袭",
      "challenge": "禁止使用术师干员  敌方单位的生命值提升至130%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_02-06.json"
    },
    {
      "operation": "2-7突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至120%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_02-07.json"
    },
    {
      "operation": "2-8突袭",
      "challenge": "敌方单位的生命值和防御力都提升至120%，攻击力提升至110%  重量增加二个等级",
      "levelId": "obt/main/level_main_02-08.json"
    },
    {
      "operation": "2-9突袭",
      "challenge": "敌方单位的生命值提升至200%，攻击力提升至120%，防御力提升至110%",
      "levelId": "obt/main/level_main_02-09.json"
    },
    {
      "operation": "2-10突袭",
      "challenge": "术师职业干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_02-10.json"
    },
    {
      "operation": "3-1突袭",
      "challenge": "我方所有远程干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_03-01.json"
    },
    {
      "operation": "3-2突袭",
      "challenge": "部署费用的自然回复速度降低三分之一  敌方单位的生命值和防御力都提升至120%，攻击力提升至110%",
      "levelId": "obt/main/level_main_03-02.json"
    },
    {
      "operation": "3-3突袭",
      "challenge": "敌方单位的重量增加一个等级  敌方单位的生命值提升至120%，攻击力和防御力都提升至110%",
      "levelId": "obt/main/level_main_03-03.json"
    },
    {
      "operation": "3-4突袭",
      "challenge": "部署费用的自然回复速度降低三分之一  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_03-04.json"
    },
    {
      "operation": "3-5突袭",
      "challenge": "医疗及重装职业干员的攻击力减半  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_03-05.json"
    },
    {
      "operation": "3-6突袭",
      "challenge": "无法使用侦测器  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_03-06.json"
    },
    {
      "operation": "3-7突袭",
      "challenge": "可使用障碍物数量减少2  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_03-07.json"
    },
    {
      "operation": "3-8突袭",
      "challenge": "敌方单位的生命值提升至180%，攻击力提升至110%",
      "levelId": "obt/main/level_main_03-08.json"
    },
    {
      "operation": "4-1突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_04-01.json"
    },
    {
      "operation": "4-2突袭",
      "challenge": "我方所有单位的防御力减半  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_04-02.json"
    },
    {
      "operation": "4-3突袭",
      "challenge": "敌方单位的生命值和防御力都提升至110%  攻击力提升至140%",
      "levelId": "obt/main/level_main_04-03.json"
    },
    {
      "operation": "4-4突袭",
      "challenge": "敌方单位的移动速度提升至200%",
      "levelId": "obt/main/level_main_04-04.json"
    },
    {
      "operation": "4-5突袭",
      "challenge": "我方所有近战单位的生命值减半  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_04-05.json"
    },
    {
      "operation": "4-6突袭",
      "challenge": "可部署单位上限减少3  敌方单位的生命值提升至125%，攻击力和防御力都提升至110%",
      "levelId": "obt/main/level_main_04-06.json"
    },
    {
      "operation": "4-7突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都升至110%  源石生物的死亡爆炸伤害额外提升80%",
      "levelId": "obt/main/level_main_04-07.json"
    },
    {
      "operation": "4-8突袭",
      "challenge": "我方所有单位的再部署时间加倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_04-08.json"
    },
    {
      "operation": "4-9突袭",
      "challenge": "敌方单位的生命值和攻击力都提升至110%  防御力提升至150%",
      "levelId": "obt/main/level_main_04-09.json"
    },
    {
      "operation": "4-10突袭",
      "challenge": "敌方单位的生命值提升至125%，攻击力提升至115%，防御力提升至110%",
      "levelId": "obt/main/level_main_04-10.json"
    },
    {
      "operation": "5-1突袭",
      "challenge": "我方所有近战单位的攻击力减半  敌方单位的生命值和攻击力都提升至105%",
      "levelId": "obt/main/level_main_05-01.json"
    },
    {
      "operation": "5-2突袭",
      "challenge": "敌方单位的攻击速度提升至200%",
      "levelId": "obt/main/level_main_05-02.json"
    },
    {
      "operation": "5-3突袭",
      "challenge": "敌方单位的生命值提升至120%、攻击力提升至110%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_05-03.json"
    },
    {
      "operation": "5-4突袭",
      "challenge": "敌方单位的生命值和攻击力都提升至105%  移动速度提升至150%",
      "levelId": "obt/main/level_main_05-04.json"
    },
    {
      "operation": "5-5突袭",
      "challenge": "我方所有单位的再部署时间加倍  敌方单位的生命值提升至125%",
      "levelId": "obt/main/level_main_05-05.json"
    },
    {
      "operation": "5-6突袭",
      "challenge": "干扰装置的部署费用加倍  敌方单位的攻击力提升至120%",
      "levelId": "obt/main/level_main_05-06.json"
    },
    {
      "operation": "5-7突袭",
      "challenge": "禁止使用狙击和术师干员 敌方单位数值不变",
      "levelId": "obt/main/level_main_05-07.json"
    },
    {
      "operation": "5-8突袭",
      "challenge": "敌方单位的生命值提升至120%，防御力提升至150%",
      "levelId": "obt/main/level_main_05-08.json"
    },
    {
      "operation": "5-9突袭",
      "challenge": "敌方单位的生命值提升至150%，攻击力和防御力都提升至110%",
      "levelId": "obt/main/level_main_05-09.json"
    },
    {
      "operation": "5-10突袭",
      "challenge": "敌方单位的生命值提升至150%，攻击力提升至110%  敌方领袖梅菲斯特的生命值提升至300%，防御力提升至250%",
      "levelId": "obt/main/level_main_05-10.json"
    },
    {
      "operation": "5-10突袭",
      "challenge": "敌方单位的生命值提升至150%，攻击力提升至110%  敌方领袖梅菲斯特的生命值提升至300%，防御力提升至250%",
      "levelId": "obt/main/level_main_05-10.json"
    },
    {
      "operation": "6-5突袭",
      "challenge": "敌方狂暴单位不再自然损失生命 敌方单位数值不变",
      "levelId": "obt/main/level_main_06-05.json"
    },
    {
      "operation": "6-11突袭",
      "challenge": "战场中7个位置无法部署单位(左红门下两列) 敌方数值不变",
      "levelId": "obt/main/level_main_06-10.json"
    },
    {
      "operation": "6-16突袭",
      "challenge": "禁止使用医疗干员  敌方单位的生命值提升至115%",
      "levelId": "obt/main/level_main_06-14.json"
    },
    {
      "operation": "S5-7",
      "levelId": "obt/main/level_sub_05-4-1.json"
    }
  ],
  //敌人属性提升
  "enemy_attribute_add": [
    {
      "operation": "RI-EX-4突袭",
      "challenge": "敌方单位的防御力、生命值都提升至120%，法术抗性增加20",
      "levelId": "activities/act12d0/level_act12d0_ex04.json"
    },
    {
      "operation": "MN-EX-6突袭",
      "challenge": "敌方单位的移动速度提升至130%，法术抗性增加30",
      "levelId": "activities/act13d5/level_act13d5_ex06.json"
    },
    {
      "operation": "BI-EX-3突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至105%，攻击速度提升至150%",
      "levelId": "activities/act14side/level_act14side_ex03.json"
    },
    {
      "operation": "BH-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  法术抗性增加40",
      "levelId": "activities/act15d5/level_act15d5_06.json"
    },
    {
      "operation": "TG-3突袭",
      "challenge": "训练用钳兽与训练用残暴钳兽攻击力大幅提升",
      "levelId": "activities/act16mini/level_act16mini_03.json"
    },
    {
      "operation": "TG-3突袭",
      "challenge": "训练用钳兽与训练用残暴钳兽攻击力大幅提升",
      "levelId": "activities/act16mini/level_act16mini_03.json"
    },
    {
      "operation": "LE-EX-5突袭",
      "challenge": "敌方单位的攻击速度提升",
      "levelId": "activities/act18side/level_act18side_ex05.json"
    },
    {
      "operation": "IS-S-5突袭",
      "challenge": "“狼之主”进入第二形态后，攻击力大幅提升",
      "levelId": "activities/act21side/level_act21side_sub-1-5.json"
    },
    {
      "operation": "SL-EX-7突袭",
      "challenge": "风情街“超新星术师”的攻击速度大幅提升",
      "levelId": "activities/act27side/level_act27side_ex07.json"
    },
    {
      "operation": "SL-S-1突袭",
      "challenge": "城市“龙卷风行者”造成的伤害大幅提升",
      "levelId": "activities/act27side/level_act27side_sub-1-1.json"
    },
    {
      "operation": "BP-EX-2突袭",
      "challenge": "异光体饲育者的攻击速度、移动速度、生命值提升",
      "levelId": "activities/act34side/level_act34side_ex02.json"
    },
    {
      "operation": "AS-EX-3突袭",
      "challenge": "“弹跳独轮车”的攻击速度大幅增加",
      "levelId": "activities/act35side/level_act35side_ex03.json"
    },
    {
      "operation": "OR-S-3突袭",
      "challenge": "“饮露餐风”造成的伤害提升",
      "levelId": "activities/act40side/level_act40side_sub-1-3.json"
    },
    {
      "operation": "MT-EX-1突袭",
      "challenge": "法术抗性提升",
      "levelId": "activities/act42side/level_act42side_ex01.json"
    }
  ],

  "cbuff_excluded": [
    {
      "operation": "GT-1",
      "levelId": "activities/a001/level_a001_01.json"
    },
    {
      "operation": "GT-3",
      "levelId": "activities/a001/level_a001_03.json"
    },
    {
      "operation": "OF-1",
      "levelId": "activities/act3d0/level_act3d0_01.json"
    },
    {
      "operation": "OF-1",
      "levelId": "activities/act3d0/level_act3d0_01.json"
    },
    {
      "operation": "OF-6",
      "levelId": "activities/act3d0/level_act3d0_06.json"
    },
    {
      "operation": "CB-3",
      "levelId": "activities/act5d0/level_act5d0_03.json"
    },
    {
      "operation": "CB-3",
      "levelId": "activities/act5d0/level_act5d0_03.json"
    },
    {
      "operation": "0-4突袭",
      "challenge": "禁止使用狙击干员  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-04.json"
    },
    {
      "operation": "0-9突袭",
      "challenge": "禁止使用重装干员  敌方单位的生命值提升至130%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_00-09.json"
    },
    {
      "operation": "1-9突袭",
      "challenge": "禁止使用重装干员  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-09.json"
    },
    {
      "operation": "2-1突袭",
      "challenge": "禁止使用术师干员  敌方单位的生命值提升至130%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_02-01.json"
    },
    {
      "operation": "2-2突袭",
      "challenge": "禁止使用辅助干员  敌方单位的生命值和防御力都提升至120%，攻击力提升至110%",
      "levelId": "obt/main/level_main_02-02.json"
    },
    {
      "operation": "2-6突袭",
      "challenge": "禁止使用术师干员  敌方单位的生命值提升至130%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_02-06.json"
    },
    {
      "operation": "3-6突袭",
      "challenge": "无法使用侦测器  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_03-06.json"
    },
    {
      "operation": "5-7突袭",
      "challenge": "禁止使用狙击和术师干员 敌方单位数值不变",
      "levelId": "obt/main/level_main_05-07.json"
    }
  ],
  //关卡生命值
  "gbuff_lifepoint": [
    {
      "operation": "GT-HX-1突袭",
      "challenge": "我方所有远程单位的部署费用增加至3倍  敌方单位的攻击力提升至110%",
      "levelId": "activities/a001/level_a001_ex04.json"
    },
    {
      "operation": "GT-HX-2突袭",
      "challenge": "敌方单位的攻击速度提升至200%",
      "levelId": "activities/a001/level_a001_ex05.json"
    },
    {
      "operation": "GT-HX-3突袭",
      "challenge": "障碍物的部署费用增加至15  敌方单位数值不变",
      "levelId": "activities/a001/level_a001_ex06.json"
    },
    {
      "operation": "TW-EX-2突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，所有敌人的移动速度提升至150%",
      "levelId": "activities/act11d0/level_act11d0_ex02.json"
    },
    {
      "operation": "MN-EX-5突袭",
      "challenge": "初始有两座“留声机”被敌人占领  敌方单位的攻击力、生命值提升至110%",
      "levelId": "activities/act13d5/level_act13d5_ex05.json"
    },
    {
      "operation": "NL-S-4突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都额外提升至110%，血骑士额外召唤凝血之刃×9",
      "levelId": "activities/act13side/level_act13side_sub-1-4.json"
    },
    {
      "operation": "LK-DP-B",
      "levelId": "activities/act1lock/level_act1lock_b-02.json"
    },
    {
      "operation": "OF-EX1突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110%  敌方远程单位攻击范围提升至200%",
      "levelId": "activities/act3d0/level_act3d0_ex01.json"
    },
    {
      "operation": "OF-EX2突袭",
      "challenge": "敌方单位生命值、攻击力都提升至110%，防御力提升至150%",
      "levelId": "activities/act3d0/level_act3d0_ex02.json"
    },
    {
      "operation": "OF-EX3突袭",
      "challenge": "敌方单位生命值提升至120%，攻击力提升至110%  攻击速度提升至200%",
      "levelId": "activities/act3d0/level_act3d0_ex03.json"
    },
    {
      "operation": "OF-EX4突袭",
      "challenge": "医疗职业干员的部署费用提升至三倍  敌方单位生命值、攻击力、防御力都提升至110%",
      "levelId": "activities/act3d0/level_act3d0_ex04.json"
    },
    {
      "operation": "OF-EX5突袭",
      "challenge": "部署费用的自然回复速度降低三分之二  敌方单位生命值提升至110%",
      "levelId": "activities/act3d0/level_act3d0_ex05.json"
    },
    {
      "operation": "OF-EX6突袭",
      "challenge": "障碍物的可部署数量减少至6个  敌方单位生命值提升至120%，攻击力和防御力都提升至110%",
      "levelId": "activities/act3d0/level_act3d0_ex06.json"
    },
    {
      "operation": "CB-EX1突袭",
      "challenge": "敌方单位生命值提升至110%  神射手攻击力提升至150%",
      "levelId": "activities/act5d0/level_act5d0_ex01.json"
    },
    {
      "operation": "CB-EX2突袭",
      "challenge": "敌方单位生命值提升至120%  近战敌人生命值提升至120%，攻击力提升至200%，防御力提升至110%  (注:近战敌人同时享受敌方单位BUFF，关系为乘算)",
      "levelId": "activities/act5d0/level_act5d0_ex02.json"
    },
    {
      "operation": "CB-EX3突袭",
      "challenge": "允许编入干员下降至5名  敌方单位的生命值提升至115%，攻击力和防御力都提升至105%",
      "levelId": "activities/act5d0/level_act5d0_ex03.json"
    },
    {
      "operation": "CB-EX4突袭",
      "challenge": "敌方单位生命值提升至120%，攻击力和防御力都提升至110%  神射手生命值提升至166.7%，攻击范围提升至110%  (注:神射手同时享受敌方单位BUFF，关系为乘算)",
      "levelId": "activities/act5d0/level_act5d0_ex04.json"
    },
    {
      "operation": "CB-EX5突袭",
      "challenge": "术师干员部署费用增加至3倍  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "activities/act5d0/level_act5d0_ex05.json"
    },
    {
      "operation": "CB-EX6突袭",
      "challenge": "近卫与先锋干员阻挡数-1  敌方单位的生命值和攻击力都提升至105%",
      "levelId": "activities/act5d0/level_act5d0_ex06.json"
    },
    {
      "operation": "CB-EX7突袭",
      "challenge": "战场中的6个位置(右下6高台)无法部署我方单位  敌方单位生命值提升至120%，攻击力和防御力都提升至110%",
      "levelId": "activities/act5d0/level_act5d0_ex07.json"
    },
    {
      "operation": "CB-EX8突袭",
      "challenge": "指挥终端的SP消耗量提高至180  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "activities/act5d0/level_act5d0_ex08.json"
    },
    {
      "operation": "SA-1突袭",
      "challenge": "所有敌人生命值提升至115%、攻击力提升至110%、防御力提升至150%",
      "levelId": "activities/act7d5/level_act7d5_01.json"
    },
    {
      "operation": "SA-4突袭",
      "challenge": "<特战术师>获得隐匿效果，所有敌人生命值、攻击力、防御力都提升至105%",
      "levelId": "activities/act7d5/level_act7d5_04.json"
    },
    {
      "operation": "H5-2",
      "levelId": "obt/hard/level_hard_05-02.json"
    },
    {
      "operation": "H5-3",
      "levelId": "obt/hard/level_hard_05-03.json"
    },
    {
      "operation": "H5-4",
      "levelId": "obt/hard/level_hard_05-04.json"
    },
    {
      "operation": "H6-1",
      "levelId": "obt/hard/level_hard_06-01.json"
    },
    {
      "operation": "0-1突袭",
      "challenge": "部署费用不自然回复",
      "levelId": "obt/main/level_main_00-01.json"
    },
    {
      "operation": "0-2突袭",
      "challenge": "我方所有单位攻击力减半",
      "levelId": "obt/main/level_main_00-02.json"
    },
    {
      "operation": "0-3突袭",
      "challenge": "敌方单位的生命值提升至200%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_00-03.json"
    },
    {
      "operation": "0-4突袭",
      "challenge": "禁止使用狙击干员  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-04.json"
    },
    {
      "operation": "0-5突袭",
      "challenge": "敌方单位的生命值和防御力都提升至120%，攻击力提升至200%",
      "levelId": "obt/main/level_main_00-05.json"
    },
    {
      "operation": "0-6突袭",
      "challenge": "部署费用的自然回复速度降至一半  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-06.json"
    },
    {
      "operation": "0-7突袭",
      "challenge": "术师职业干员的部署费用增至3倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-07.json"
    },
    {
      "operation": "0-8突袭",
      "challenge": "我方所有单位的最大生命值减半  敌方单位的生命值、攻击力、防御力都提升至120% ",
      "levelId": "obt/main/level_main_00-08.json"
    },
    {
      "operation": "0-9突袭",
      "challenge": "禁止使用重装干员  敌方单位的生命值提升至130%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_00-09.json"
    },
    {
      "operation": "0-10突袭",
      "challenge": "我方所有单位的防御力减半  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-10.json"
    },
    {
      "operation": "0-11突袭",
      "challenge": "我方所有近战干员的部署费用增至3倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-11.json"
    },
    {
      "operation": "1-1突袭",
      "challenge": "同时可布置干员数降至4  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-01.json"
    },
    {
      "operation": "1-2",
      "levelId": "obt/main/level_main_01-02.json"
    },
    {
      "operation": "1-3突袭",
      "challenge": "敌方单位的生命值提升至180%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_01-03.json"
    },
    {
      "operation": "1-4突袭",
      "challenge": "我方所有远程单位的部署费用增至3倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-04.json"
    },
    {
      "operation": "1-5突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至120%  移动速度提升至200%",
      "levelId": "obt/main/level_main_01-05.json"
    },
    {
      "operation": "1-6突袭",
      "challenge": "可使用的障碍物数量降至1  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-06.json"
    },
    {
      "operation": "1-7突袭",
      "challenge": "部署费用的自然回复速度减半  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-07.json"
    },
    {
      "operation": "1-8突袭",
      "challenge": "敌方单位的生命值提升至150%，攻击力和防御力都提升至120%  敌方头目的能力冷却降低至35%",
      "levelId": "obt/main/level_main_01-08.json"
    },
    {
      "operation": "1-9突袭",
      "challenge": "禁止使用重装干员  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-09.json"
    },
    {
      "operation": "1-10突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至120%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_01-10.json"
    },
    {
      "operation": "1-11",
      "levelId": "obt/main/level_main_01-11.json"
    },
    {
      "operation": "1-12突袭",
      "challenge": "医疗职业干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-12.json"
    },
    {
      "operation": "2-1突袭",
      "challenge": "禁止使用术师干员  敌方单位的生命值提升至130%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_02-01.json"
    },
    {
      "operation": "2-2突袭",
      "challenge": "禁止使用辅助干员  敌方单位的生命值和防御力都提升至120%，攻击力提升至110%",
      "levelId": "obt/main/level_main_02-02.json"
    },
    {
      "operation": "2-3突袭",
      "challenge": "障碍物和我方近战单位的部署费用加倍  敌方单位的生命值提升至120%，防御力提升至110%",
      "levelId": "obt/main/level_main_02-03.json"
    },
    {
      "operation": "2-4突袭",
      "challenge": "敌方单位的生命值提升至200%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_02-04.json"
    },
    {
      "operation": "2-5突袭",
      "challenge": "近卫和狙击职业干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_02-05.json"
    },
    {
      "operation": "2-6突袭",
      "challenge": "禁止使用术师干员  敌方单位的生命值提升至130%，攻击力和防御力都提升至120%",
      "levelId": "obt/main/level_main_02-06.json"
    },
    {
      "operation": "2-7突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至120%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_02-07.json"
    },
    {
      "operation": "2-8突袭",
      "challenge": "敌方单位的生命值和防御力都提升至120%，攻击力提升至110%  重量增加二个等级",
      "levelId": "obt/main/level_main_02-08.json"
    },
    {
      "operation": "2-9突袭",
      "challenge": "敌方单位的生命值提升至200%，攻击力提升至120%，防御力提升至110%",
      "levelId": "obt/main/level_main_02-09.json"
    },
    {
      "operation": "2-10突袭",
      "challenge": "术师职业干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_02-10.json"
    },
    {
      "operation": "3-1突袭",
      "challenge": "我方所有远程干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_03-01.json"
    },
    {
      "operation": "3-2突袭",
      "challenge": "部署费用的自然回复速度降低三分之一  敌方单位的生命值和防御力都提升至120%，攻击力提升至110%",
      "levelId": "obt/main/level_main_03-02.json"
    },
    {
      "operation": "3-3突袭",
      "challenge": "敌方单位的重量增加一个等级  敌方单位的生命值提升至120%，攻击力和防御力都提升至110%",
      "levelId": "obt/main/level_main_03-03.json"
    },
    {
      "operation": "3-4突袭",
      "challenge": "部署费用的自然回复速度降低三分之一  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_03-04.json"
    },
    {
      "operation": "3-5突袭",
      "challenge": "医疗及重装职业干员的攻击力减半  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_03-05.json"
    },
    {
      "operation": "3-6突袭",
      "challenge": "无法使用侦测器  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_03-06.json"
    },
    {
      "operation": "3-7突袭",
      "challenge": "可使用障碍物数量减少2  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_03-07.json"
    },
    {
      "operation": "3-8突袭",
      "challenge": "敌方单位的生命值提升至180%，攻击力提升至110%",
      "levelId": "obt/main/level_main_03-08.json"
    },
    {
      "operation": "4-1突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_04-01.json"
    },
    {
      "operation": "4-2突袭",
      "challenge": "我方所有单位的防御力减半  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_04-02.json"
    },
    {
      "operation": "4-3突袭",
      "challenge": "敌方单位的生命值和防御力都提升至110%  攻击力提升至140%",
      "levelId": "obt/main/level_main_04-03.json"
    },
    {
      "operation": "4-4突袭",
      "challenge": "敌方单位的移动速度提升至200%",
      "levelId": "obt/main/level_main_04-04.json"
    },
    {
      "operation": "4-5突袭",
      "challenge": "我方所有近战单位的生命值减半  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_04-05.json"
    },
    {
      "operation": "4-6突袭",
      "challenge": "可部署单位上限减少3  敌方单位的生命值提升至125%，攻击力和防御力都提升至110%",
      "levelId": "obt/main/level_main_04-06.json"
    },
    {
      "operation": "4-7突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都升至110%  源石生物的死亡爆炸伤害额外提升80%",
      "levelId": "obt/main/level_main_04-07.json"
    },
    {
      "operation": "4-8突袭",
      "challenge": "我方所有单位的再部署时间加倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_04-08.json"
    },
    {
      "operation": "4-9突袭",
      "challenge": "敌方单位的生命值和攻击力都提升至110%  防御力提升至150%",
      "levelId": "obt/main/level_main_04-09.json"
    },
    {
      "operation": "4-10突袭",
      "challenge": "敌方单位的生命值提升至125%，攻击力提升至115%，防御力提升至110%",
      "levelId": "obt/main/level_main_04-10.json"
    },
    {
      "operation": "5-1突袭",
      "challenge": "我方所有近战单位的攻击力减半  敌方单位的生命值和攻击力都提升至105%",
      "levelId": "obt/main/level_main_05-01.json"
    },
    {
      "operation": "5-2突袭",
      "challenge": "敌方单位的攻击速度提升至200%",
      "levelId": "obt/main/level_main_05-02.json"
    },
    {
      "operation": "5-3突袭",
      "challenge": "敌方单位的生命值提升至120%、攻击力提升至110%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_05-03.json"
    },
    {
      "operation": "5-4突袭",
      "challenge": "敌方单位的生命值和攻击力都提升至105%  移动速度提升至150%",
      "levelId": "obt/main/level_main_05-04.json"
    },
    {
      "operation": "5-5突袭",
      "challenge": "我方所有单位的再部署时间加倍  敌方单位的生命值提升至125%",
      "levelId": "obt/main/level_main_05-05.json"
    },
    {
      "operation": "5-6突袭",
      "challenge": "干扰装置的部署费用加倍  敌方单位的攻击力提升至120%",
      "levelId": "obt/main/level_main_05-06.json"
    },
    {
      "operation": "5-7突袭",
      "challenge": "禁止使用狙击和术师干员 敌方单位数值不变",
      "levelId": "obt/main/level_main_05-07.json"
    },
    {
      "operation": "5-8突袭",
      "challenge": "敌方单位的生命值提升至120%，防御力提升至150%",
      "levelId": "obt/main/level_main_05-08.json"
    },
    {
      "operation": "5-9突袭",
      "challenge": "敌方单位的生命值提升至150%，攻击力和防御力都提升至110%",
      "levelId": "obt/main/level_main_05-09.json"
    },
    {
      "operation": "5-10突袭",
      "challenge": "敌方单位的生命值提升至150%，攻击力提升至110%  敌方领袖梅菲斯特的生命值提升至300%，防御力提升至250%",
      "levelId": "obt/main/level_main_05-10.json"
    },
    {
      "operation": "6-5突袭",
      "challenge": "敌方狂暴单位不再自然损失生命 敌方单位数值不变",
      "levelId": "obt/main/level_main_06-05.json"
    },
    {
      "operation": "6-11突袭",
      "challenge": "战场中7个位置无法部署单位(左红门下两列) 敌方数值不变",
      "levelId": "obt/main/level_main_06-10.json"
    },
    {
      "operation": "6-16突袭",
      "challenge": "禁止使用医疗干员  敌方单位的生命值提升至115%",
      "levelId": "obt/main/level_main_06-14.json"
    },
    {
      "operation": "R8-2突袭",
      "challenge": "我方单位阻挡数-1、敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "obt/main/level_main_08-02.json"
    },
    {
      "operation": "R8-3突袭",
      "challenge": "远程单位部署费用提升至2倍  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "obt/main/level_main_08-03.json"
    },
    {
      "operation": "R8-7突袭",
      "challenge": "敌方单位的攻击力、防御力提升至110%  帝国火炮先兆者的生命值提升至200%  其他敌方单位的生命值提升至110%",
      "levelId": "obt/main/level_main_08-07.json"
    },
    {
      "operation": "R8-10突袭",
      "challenge": "可部署单位上限减少3  敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "obt/main/level_main_08-11.json"
    },
    {
      "operation": "S5-7",
      "levelId": "obt/main/level_sub_05-4-1.json"
    }
  ],
  //干员/装置等部署费用提升
  "cbuff_char_cost": [
    {
      "operation": "GT-HX-1突袭",
      "challenge": "我方所有远程单位的部署费用增加至3倍  敌方单位的攻击力提升至110%",
      "levelId": "activities/a001/level_a001_ex04.json"
    },
    {
      "operation": "GT-HX-3突袭",
      "challenge": "障碍物的部署费用增加至15  敌方单位数值不变",
      "levelId": "activities/a001/level_a001_ex06.json"
    },
    {
      "operation": "OF-EX4突袭",
      "challenge": "医疗职业干员的部署费用提升至三倍  敌方单位生命值、攻击力、防御力都提升至110%",
      "levelId": "activities/act3d0/level_act3d0_ex04.json"
    },
    {
      "operation": "0-7突袭",
      "challenge": "术师职业干员的部署费用增至3倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-07.json"
    },
    {
      "operation": "0-11突袭",
      "challenge": "我方所有近战干员的部署费用增至3倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-11.json"
    },
    {
      "operation": "1-4突袭",
      "challenge": "我方所有远程单位的部署费用增至3倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-04.json"
    },
    {
      "operation": "1-12突袭",
      "challenge": "医疗职业干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-12.json"
    },
    {
      "operation": "2-3突袭",
      "challenge": "障碍物和我方近战单位的部署费用加倍  敌方单位的生命值提升至120%，防御力提升至110%",
      "levelId": "obt/main/level_main_02-03.json"
    },
    {
      "operation": "2-5突袭",
      "challenge": "近卫和狙击职业干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_02-05.json"
    },
    {
      "operation": "2-9突袭",
      "challenge": "敌方单位的生命值提升至200%，攻击力提升至120%，防御力提升至110%",
      "levelId": "obt/main/level_main_02-09.json"
    },
    {
      "operation": "2-10突袭",
      "challenge": "术师职业干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_02-10.json"
    },
    {
      "operation": "3-1突袭",
      "challenge": "我方所有远程干员的部署费用加倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_03-01.json"
    },
    {
      "operation": "5-6突袭",
      "challenge": "干扰装置的部署费用加倍  敌方单位的攻击力提升至120%",
      "levelId": "obt/main/level_main_05-06.json"
    },
    {
      "operation": "S5-7",
      "levelId": "obt/main/level_sub_05-4-1.json"
    }
  ],
  //关卡生命值
  "global_lifepoint": [
    {
      "operation": "TB-1突袭",
      "challenge": "额外出现4个泥岩巨像",
      "levelId": "activities/act10mini/level_act10mini_01.json"
    },
    {
      "operation": "TB-2突袭",
      "challenge": "敌方单位的生命值提升至150%，战场中的 (5,4)、(5,5)、(5,6)、(3,5)、(3,6)、(3,7)、(3,3)7个位置无法部署我方单位{上红门为(4,3)，下红门为(0,5)}",
      "levelId": "activities/act10mini/level_act10mini_02.json"
    },
    {
      "operation": "TB-3突袭",
      "challenge": "所有我方单位的攻击力降低至60%",
      "levelId": "activities/act10mini/level_act10mini_03.json"
    },
    {
      "operation": "TB-4突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，粉碎攻坚组长的生命值额外提升至200%，战场中的(5,6)1个位置无法部署我方单位{最上方高台}",
      "levelId": "activities/act10mini/level_act10mini_04.json"
    },
    {
      "operation": "TB-5突袭",
      "challenge": "萨卡兹魔剑士获得隐匿，敌方单位的攻击力、防御力和生命值都提升至110%",
      "levelId": "activities/act10mini/level_act10mini_05.json"
    },
    {
      "operation": "TB-6突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110%，战场中(2,6)、(2,7)、(2,10)、(1,6)、(1,7)、(1,8)、(3,6)、(3,7)8个位置无法部署我方单位{最右下角八个格子}",
      "levelId": "activities/act10mini/level_act10mini_06.json"
    },
    {
      "operation": "TB-7突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至125%，移动速度降低至50%",
      "levelId": "activities/act10mini/level_act10mini_07.json"
    },
    {
      "operation": "TB-8突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至105%，莱塔尼亚轻语者的技能释放期间，每1秒扣除<“留声机”>3点技力（原1点）",
      "levelId": "activities/act10mini/level_act10mini_08.json"
    },
    {
      "operation": "TW-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，无法部署单位的4个位置：(4,5)，(4,6)，(3,5)，(3,6)",
      "levelId": "activities/act11d0/level_act11d0_ex01.json"
    },
    {
      "operation": "TW-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至110%，所有我方单位的阻挡数上限减少1",
      "levelId": "activities/act11d0/level_act11d0_ex03.json"
    },
    {
      "operation": "TW-EX-4突袭",
      "challenge": "我方单位攻击力降低至60%",
      "levelId": "activities/act11d0/level_act11d0_ex04.json"
    },
    {
      "operation": "TW-EX-5突袭",
      "challenge": "敌方单位的防御力提升至120%，生命值提升至120%，莱塔尼亚吟唱者的攻击范围提升至120%，争夺“留声机”效果提升至200%",
      "levelId": "activities/act11d0/level_act11d0_ex05.json"
    },
    {
      "operation": "TW-EX-6突袭",
      "challenge": "敌方单位的防御力提升至120%，<巫术巨像>与<泥岩小队践行者组长>的生命值提升至200%，初始额外增加两座“留声机”被敌方占领",
      "levelId": "activities/act11d0/level_act11d0_ex06.json"
    },
    {
      "operation": "TW-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至120%，生命值提升至120%，我方干员防御力降低至30%",
      "levelId": "activities/act11d0/level_act11d0_ex07.json"
    },
    {
      "operation": "TW-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，可携带干员数量不超过10",
      "levelId": "activities/act11d0/level_act11d0_ex08.json"
    },
    {
      "operation": "TW-S-1突袭",
      "challenge": "使用固定干员进行作战，初始COST-10，可部署上限-2",
      "levelId": "activities/act11d0/level_act11d0_sub-1-1.json"
    },
    {
      "operation": "TW-S-2突袭",
      "challenge": "使用固定干员进行作战",
      "levelId": "activities/act11d0/level_act11d0_sub-1-2.json"
    },
    {
      "operation": "TC-1突袭",
      "challenge": "敌方单位的攻击力和防御力提升至110%，生命值提升至150%",
      "levelId": "activities/act11mini/level_act11mini_01.json"
    },
    {
      "operation": "TC-2突袭",
      "challenge": "我方单位的阻挡数减1，敌方单位的生命值和攻击力提升至110%",
      "levelId": "activities/act11mini/level_act11mini_02.json"
    },
    {
      "operation": "TC-3突袭",
      "challenge": "敌方单位的攻击力，防御力和生命值都提升至110%，移除位于(6,10)的可移动战术机库，启用位于(5,3)的可移动战术机库{左红门为(7,2)}",
      "levelId": "activities/act11mini/level_act11mini_03.json"
    },
    {
      "operation": "TC-4突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，青金，莫妮克和青金，罗伊的攻击速度提升至150%",
      "levelId": "activities/act11mini/level_act11mini_04.json"
    },
    {
      "operation": "TC-5突袭",
      "challenge": "敌方单位的生命值和攻击力提升至110%，移动速度提升至150%",
      "levelId": "activities/act11mini/level_act11mini_05.json"
    },
    {
      "operation": "TC-6突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，我方单位的最大生命值降低至65%",
      "levelId": "activities/act11mini/level_act11mini_06.json"
    },
    {
      "operation": "TC-7突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至150%",
      "levelId": "activities/act11mini/level_act11mini_07.json"
    },
    {
      "operation": "TC-8突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，额外出现敌人：法术大师A1×2{1st}，危险术师囚犯×2{14th}",
      "levelId": "activities/act11mini/level_act11mini_08.json"
    },
    {
      "operation": "RI-EX-1突袭",
      "challenge": "提亚卡乌好战者获得<隐匿>效果  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex01.json"
    },
    {
      "operation": "RI-EX-2突袭",
      "challenge": "敌方单位的防御力、生命值都提升至110% 提亚卡乌神投手攻击速度下降至33%但攻击力提升至200%",
      "levelId": "activities/act12d0/level_act12d0_ex02.json"
    },
    {
      "operation": "RI-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至105% 我方最大生命值下降至50%",
      "levelId": "activities/act12d0/level_act12d0_ex03.json"
    },
    {
      "operation": "RI-EX-4突袭",
      "challenge": "敌方单位的防御力、生命值都提升至120%，法术抗性增加20",
      "levelId": "activities/act12d0/level_act12d0_ex04.json"
    },
    {
      "operation": "RI-EX-5突袭",
      "challenge": "可部署干员数量减少2  敌方单位的攻击力、生命值都提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex05.json"
    },
    {
      "operation": "RI-EX-6突袭",
      "challenge": "可部署的<罗德岛临时雇员>人数减少6,，且敌人的特殊能力不会失效  敌方单位的生命值提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex06.json"
    },
    {
      "operation": "RI-EX-7突袭",
      "challenge": "禁止部署重装干员  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex07.json"
    },
    {
      "operation": "RI-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110% 无法部署的7个位置(Y,X)如下 (2,3)、(3,3)、(4,4)、(4,7)、(5,7)、(6,7)、(6,6)",
      "levelId": "activities/act12d0/level_act12d0_ex08.json"
    },
    {
      "operation": "AW-1突袭",
      "challenge": "出现伦蒂尼姆城防副炮",
      "levelId": "activities/act12mini/level_act12mini_01.json"
    },
    {
      "operation": "AW-2突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act12mini/level_act12mini_02.json"
    },
    {
      "operation": "AW-3突袭",
      "challenge": "烛骑士薇薇安娜的攻击力提升",
      "levelId": "activities/act12mini/level_act12mini_03.json"
    },
    {
      "operation": "AW-4突袭",
      "challenge": "敌方单位的生命值提升",
      "levelId": "activities/act12mini/level_act12mini_04.json"
    },
    {
      "operation": "AW-5突袭",
      "challenge": "我方单位的阻挡数减少",
      "levelId": "activities/act12mini/level_act12mini_05.json"
    },
    {
      "operation": "AW-6突袭",
      "challenge": "激活动力装甲所需的实验产物减少",
      "levelId": "activities/act12mini/level_act12mini_06.json"
    },
    {
      "operation": "AW-7突袭",
      "challenge": "我方单位的生命值降低",
      "levelId": "activities/act12mini/level_act12mini_07.json"
    },
    {
      "operation": "AW-8突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act12mini/level_act12mini_08.json"
    },
    {
      "operation": "DH-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，控潮术师和领潮员攻击范围扩大至130%。",
      "levelId": "activities/act12side/level_act12side_ex01.json"
    },
    {
      "operation": "DH-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，水手长和水手长重艇的攻击力和最大生命值额外提升至130%。",
      "levelId": "activities/act12side/level_act12side_ex02.json"
    },
    {
      "operation": "DH-EX-3突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，“风筝”的技力消耗降低至75%，场上坐标为(1,6)(3,9)(4,9)的3个位置{正下方河道入口和最右侧俩个高台}无法部署",
      "levelId": "activities/act12side/level_act12side_ex03.json"
    },
    {
      "operation": "DH-EX-4突袭",
      "challenge": "重装干员部署费用提升至4倍，敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act12side/level_act12side_ex04.json"
    },
    {
      "operation": "DH-EX-5突袭",
      "challenge": "敌方单位的攻击力提升至120%，防御力提升至120%，生命值提升至120%，无人爆破重艇的爆炸伤害提升至200%",
      "levelId": "activities/act12side/level_act12side_ex05.json"
    },
    {
      "operation": "DH-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至110%，生命值提升至110%，涨潮时，我方每秒受到的侵蚀损伤提升40点",
      "levelId": "activities/act12side/level_act12side_ex06.json"
    },
    {
      "operation": "DH-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至120%，防御力提升至120%，生命值提升至120%，场上坐标为 (5,9)(5,10)(6,11)(1,11)(2,9)(2,10)的6个位置{蓝门上下两行各两个地板和最右侧两个高台}无法部署",
      "levelId": "activities/act12side/level_act12side_ex07.json"
    },
    {
      "operation": "DH-EX-8突袭",
      "challenge": "我方单位的生命值上限减半，敌方单位的防御力提升至110%，生命值提升至115%",
      "levelId": "activities/act12side/level_act12side_ex08.json"
    },
    {
      "operation": "DH-S-1突袭",
      "challenge": "我方单位的阻挡数-1。敌方单位的攻击力提升、防御力和生命值都提升至135%（跟普通模式的属性提升不累积）。",
      "levelId": "activities/act12side/level_act12side_sub-1-1.json"
    },
    {
      "operation": "DH-S-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至130%。无人爆破重艇的生命流失速度数值降低2%，爆炸伤害提升至150%（跟普通模式的属性提升不累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-2.json"
    },
    {
      "operation": "DH-S-3突袭",
      "challenge": "不可使用特制水上平台。敌方单位的攻击力、防御力和生命值都提升至110%。",
      "levelId": "activities/act12side/level_act12side_sub-1-3.json"
    },
    {
      "operation": "DH-S-4突袭",
      "challenge": "敌方单位的攻击力和生命值额外提升至110%。水手长的生命值额外再提升至130%，水蚀状态下每秒额外受到的真实伤害降至0。（跟普通模式的属性提升累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-4.json"
    },
    {
      "operation": "FA-1突袭",
      "challenge": "敌方单位的攻击力和生命值提升至115%，防御力提升至110%，毒性雾霾伤害提升至每0.5秒15点",
      "levelId": "activities/act13d0/level_act13d0_01.json"
    },
    {
      "operation": "FA-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，术师组长获得隐匿效果",
      "levelId": "activities/act13d0/level_act13d0_02.json"
    },
    {
      "operation": "FA-3突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，可部署干员数量减少1",
      "levelId": "activities/act13d0/level_act13d0_03.json"
    },
    {
      "operation": "FA-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至170%，生命值提升至115%",
      "levelId": "activities/act13d0/level_act13d0_04.json"
    },
    {
      "operation": "FA-5突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，不再有罗德岛临时雇员可用",
      "levelId": "activities/act13d0/level_act13d0_05.json"
    },
    {
      "operation": "FA-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至150%",
      "levelId": "activities/act13d0/level_act13d0_06.json"
    },
    {
      "operation": "FA-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，幽灵与幽灵组长的最大生命值额外提升至130%",
      "levelId": "activities/act13d0/level_act13d0_07.json"
    },
    {
      "operation": "FA-8突袭",
      "challenge": "敌方单位的攻击力、生命值提升至105%，额外出现4个敌人：爆破攻坚手、萨卡兹百夫长、萨卡兹穿刺手组长*2",
      "levelId": "activities/act13d0/level_act13d0_08.json"
    },
    {
      "operation": "MN-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力提升至110%，生命值提升至130%",
      "levelId": "activities/act13d5/level_act13d5_ex01.json"
    },
    {
      "operation": "MN-EX-2突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110% 敌方源石冰晶的技能冷却减少50%",
      "levelId": "activities/act13d5/level_act13d5_ex02.json"
    },
    {
      "operation": "MN-EX-3突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110% 敌方单位的移动速度提升至150%",
      "levelId": "activities/act13d5/level_act13d5_ex03.json"
    },
    {
      "operation": "MN-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110% 沸血骑士团精锐的生命值提升至170%",
      "levelId": "activities/act13d5/level_act13d5_ex04.json"
    },
    {
      "operation": "MN-EX-6突袭",
      "challenge": "敌方单位的移动速度提升至130%，法术抗性增加30",
      "levelId": "activities/act13d5/level_act13d5_ex06.json"
    },
    {
      "operation": "MN-EX-7突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110% 威龙的攻击范围提升至150%",
      "levelId": "activities/act13d5/level_act13d5_ex07.json"
    },
    {
      "operation": "MN-EX-8突袭",
      "challenge": "医疗符文及上下共六个位置无法部署我方单位  敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act13d5/level_act13d5_ex08.json"
    },
    {
      "operation": "BW-1突袭",
      "challenge": "敌人重量大幅度提升",
      "levelId": "activities/act13mini/level_act13mini_01.json"
    },
    {
      "operation": "BW-2突袭",
      "challenge": "重装和特种干员部署费用变为2倍",
      "levelId": "activities/act13mini/level_act13mini_02.json"
    },
    {
      "operation": "BW-3突袭",
      "challenge": "萨卡兹魔剑组长变为萨卡兹积怨者",
      "levelId": "activities/act13mini/level_act13mini_03.json"
    },
    {
      "operation": "BW-4突袭",
      "challenge": "欺凌者获得隐匿",
      "levelId": "activities/act13mini/level_act13mini_04.json"
    },
    {
      "operation": "BW-5突袭",
      "challenge": "复仇者攻击力大幅提升",
      "levelId": "activities/act13mini/level_act13mini_05.json"
    },
    {
      "operation": "BW-6突袭",
      "challenge": "认真的“阿咬”生命值大幅提升",
      "levelId": "activities/act13mini/level_act13mini_06.json"
    },
    {
      "operation": "BW-7突袭",
      "challenge": "冰爆源石虫的特殊能力不会失效",
      "levelId": "activities/act13mini/level_act13mini_07.json"
    },
    {
      "operation": "BW-8突袭",
      "challenge": "<弩炮台>造成的伤害提高",
      "levelId": "activities/act13mini/level_act13mini_08.json"
    },
    {
      "operation": "NL-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，我方单位的生命值降低至70%",
      "levelId": "activities/act13side/level_act13side_ex01.json"
    },
    {
      "operation": "NL-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、提升至110%，无胄盟刺客组长攻击力累积速度增加至200%",
      "levelId": "activities/act13side/level_act13side_ex02.json"
    },
    {
      "operation": "NL-EX-3突袭",
      "challenge": "敌方单位的防御力、生命值提升至105%，战场中(3,5)(5,5)(2,6)(3,7)(4,3)(3,3)6个位置无法部署我方单位{蓝门为(4,5)，上下两格为(5,5)(3,5)}",
      "levelId": "activities/act13side/level_act13side_ex03.json"
    },
    {
      "operation": "NL-EX-4突袭",
      "challenge": "近卫和重装干员部署费用增加至3倍",
      "levelId": "activities/act13side/level_act13side_ex04.json"
    },
    {
      "operation": "NL-EX-5突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%，骑士之徽的数量减少2个（剩1个），部署费用自然回复所需时间提升至154%（1秒回0.66费）",
      "levelId": "activities/act13side/level_act13side_ex05.json"
    },
    {
      "operation": "NL-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至135%，生命值提升至105%",
      "levelId": "activities/act13side/level_act13side_ex06.json"
    },
    {
      "operation": "NL-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至105%，防御力、生命值提升至110%，工蚁和工蚁组长的生命值提升至200%",
      "levelId": "activities/act13side/level_act13side_ex07.json"
    },
    {
      "operation": "NL-EX-8突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，凝血之刃的攻击力和生命值额外提升至130%",
      "levelId": "activities/act13side/level_act13side_ex08.json"
    },
    {
      "operation": "NL-S-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值额外提升至110%，额外出现无胄盟第三小队组长×1（左上，8th）、无胄盟清扫小队组长×1（左下，29th）",
      "levelId": "activities/act13side/level_act13side_sub-1-1.json"
    },
    {
      "operation": "NL-S-2突袭",
      "challenge": "所有敌方单位的攻击力、防御力、生命值都提升至120%，骑士之徽的数量减少1个（没了）",
      "levelId": "activities/act13side/level_act13side_sub-1-2.json"
    },
    {
      "operation": "NL-S-3突袭",
      "challenge": "敌方单位的攻击力提升、防御力、生命值都提升至110%，散华骑士团成员的生命值额外提升至200%，技能冷却时间降低至75%。散华骑士团成员包括：散华骑士团学徒、散华骑士团精锐、烛骑士薇薇安娜",
      "levelId": "activities/act13side/level_act13side_sub-1-3.json"
    },
    {
      "operation": "NL-S-5突袭",
      "challenge": "敌方单位的生命值提升至105%，莫妮克、罗伊、无胄盟第三小队组长、无胄盟清扫小队组长的攻击速度提升至130%",
      "levelId": "activities/act13side/level_act13side_sub-1-5.json"
    },
    {
      "operation": "DC-1突袭",
      "challenge": "敌人单位的生命值大幅度提升",
      "levelId": "activities/act14mini/level_act14mini_01.json"
    },
    {
      "operation": "DC-2突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act14mini/level_act14mini_02.json"
    },
    {
      "operation": "DC-3突袭",
      "challenge": "<深水区>中的敌人不再流失生命",
      "levelId": "activities/act14mini/level_act14mini_03.json"
    },
    {
      "operation": "DC-4突袭",
      "challenge": "<射手>获得隐匿效果",
      "levelId": "activities/act14mini/level_act14mini_04.json"
    },
    {
      "operation": "DC-5突袭",
      "challenge": "<萨卡兹宿主百夫长>的攻击力提升",
      "levelId": "activities/act14mini/level_act14mini_05.json"
    },
    {
      "operation": "DC-6突袭",
      "challenge": "<萨卡兹子裔补给车>对重生造物的攻击力加成效果提升",
      "levelId": "activities/act14mini/level_act14mini_06.json"
    },
    {
      "operation": "DC-7突袭",
      "challenge": "<帝国前锋精锐>的攻击力和生命值提升",
      "levelId": "activities/act14mini/level_act14mini_07.json"
    },
    {
      "operation": "DC-8突袭",
      "challenge": "<“皇帝的利刃”>释放【国度】所需损失生命值降低",
      "levelId": "activities/act14mini/level_act14mini_08.json"
    },
    {
      "operation": "DC-S-2",
      "levelId": "activities/act14mini/level_act14mini_sub-2-1.json"
    },
    {
      "operation": "BI-EX-1突袭",
      "challenge": "冰原猎人队长的攻击力提升至130%，攻击速度降低至85%",
      "levelId": "activities/act14side/level_act14side_ex01.json"
    },
    {
      "operation": "BI-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，冰原御法者死亡时的范围爆炸伤害提升至250%",
      "levelId": "activities/act14side/level_act14side_ex02.json"
    },
    {
      "operation": "BI-EX-3突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至105%，攻击速度提升至150%",
      "levelId": "activities/act14side/level_act14side_ex03.json"
    },
    {
      "operation": "BI-EX-4突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，冰原术师队长的生命值提升至180%，重量提升2个等级，获得冻结免疫",
      "levelId": "activities/act14side/level_act14side_ex04.json"
    },
    {
      "operation": "BI-EX-5突袭",
      "challenge": "敌方单位的防御力和生命值提升至110%，额外出现11个冰原御法者，冰原御法者的生命值额外提升至150%（与前乘算）",
      "levelId": "activities/act14side/level_act14side_ex05.json"
    },
    {
      "operation": "BI-EX-6突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，部署费用的自然回复速度降低50%",
      "levelId": "activities/act14side/level_act14side_ex06.json"
    },
    {
      "operation": "BI-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%。战场中(4,5)(4,6)(4,7)(4,8)(3,5)(3,6)(3,7)(3,8)8个位置无法部署我方单位{蓝门为(6,5)，蓝门下两格为(4,5)}",
      "levelId": "activities/act14side/level_act14side_ex07.json"
    },
    {
      "operation": "BI-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至110%。锏的技能【速杀】的移动距离和造成的伤害都提升至150%，冷却时间缩短至50%",
      "levelId": "activities/act14side/level_act14side_ex08.json"
    },
    {
      "operation": "MB-EX-1突袭",
      "challenge": "禁锢装置方向改变  敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act15d0/level_act15d0_ex01.json"
    },
    {
      "operation": "MB-EX-2突袭",
      "challenge": "神射手囚犯获得<隐匿>效果  敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act15d0/level_act15d0_ex02.json"
    },
    {
      "operation": "MB-EX-3突袭",
      "challenge": "场上的禁锢装置数量减少  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d0/level_act15d0_ex03.json"
    },
    {
      "operation": "MB-EX-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  巨汉囚犯的攻击速度提升至150%",
      "levelId": "activities/act15d0/level_act15d0_ex04.json"
    },
    {
      "operation": "MB-EX-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  战场中的4个位置无法部署我方单位，分别是左上方两个地面及一个高台还有传送门出口",
      "levelId": "activities/act15d0/level_act15d0_ex05.json"
    },
    {
      "operation": "MB-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  我方单位的最大生命值降低至30%",
      "levelId": "activities/act15d0/level_act15d0_ex06.json"
    },
    {
      "operation": "MB-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  我方单位的防御力降低至60%",
      "levelId": "activities/act15d0/level_act15d0_ex07.json"
    },
    {
      "operation": "MB-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  额外出现1个传奇重犯，2个术师囚犯被替换为危险术师囚犯",
      "levelId": "activities/act15d0/level_act15d0_ex08.json"
    },
    {
      "operation": "BH-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  酸液源石虫的射程提升至150%",
      "levelId": "activities/act15d5/level_act15d5_01.json"
    },
    {
      "operation": "BH-2突袭",
      "challenge": "场上正中间3个地面无法部署我方单位  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d5/level_act15d5_02.json"
    },
    {
      "operation": "BH-3突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  敌方单位的移动速度提升至140%",
      "levelId": "activities/act15d5/level_act15d5_03.json"
    },
    {
      "operation": "BH-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  弑君者的重量提升4个等级  碎骨的生命值额外提升至200%",
      "levelId": "activities/act15d5/level_act15d5_04.json"
    },
    {
      "operation": "BH-5突袭",
      "challenge": "特战术师获得隐匿效果  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d5/level_act15d5_05.json"
    },
    {
      "operation": "BH-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  法术抗性增加40",
      "levelId": "activities/act15d5/level_act15d5_06.json"
    },
    {
      "operation": "BH-7突袭",
      "challenge": "冬灵血巫和冬灵血巫大师的移动速度提升  敌方单位的攻击力提升至110%，生命值提升至110%  冬灵血巫和冬灵血巫大师的移动速度提升至140%",
      "levelId": "activities/act15d5/level_act15d5_07.json"
    },
    {
      "operation": "BH-8突袭",
      "challenge": "可部署单位上限减少2(8-2=6)  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d5/level_act15d5_08.json"
    },
    {
      "operation": "FD-1突袭",
      "challenge": "部署费用回复速度降低",
      "levelId": "activities/act15mini/level_act15mini_01.json"
    },
    {
      "operation": "FD-2突袭",
      "challenge": "<帝国炮火先兆者>的最大生命值提升",
      "levelId": "activities/act15mini/level_act15mini_02.json"
    },
    {
      "operation": "FD-3突袭",
      "challenge": "敌人攻击速度提升",
      "levelId": "activities/act15mini/level_act15mini_03.json"
    },
    {
      "operation": "FD-4突袭",
      "challenge": "可部署单位上限减少2",
      "levelId": "activities/act15mini/level_act15mini_04.json"
    },
    {
      "operation": "FD-5突袭",
      "challenge": "<冰原狂战士>的攻击力与防御力提升",
      "levelId": "activities/act15mini/level_act15mini_05.json"
    },
    {
      "operation": "FD-6突袭",
      "challenge": "我方单位再部署时间增加",
      "levelId": "activities/act15mini/level_act15mini_06.json"
    },
    {
      "operation": "FD-7突袭",
      "challenge": "<城市霓虹>的数量与位置改变",
      "levelId": "activities/act15mini/level_act15mini_07.json"
    },
    {
      "operation": "FD-8突袭",
      "challenge": "<殉道者安多恩>【光赐于苦】的闪避效果提升",
      "levelId": "activities/act15mini/level_act15mini_08.json"
    },
    {
      "operation": "FD-S-2",
      "levelId": "activities/act15mini/level_act15mini_sub-2-1.json"
    },
    {
      "operation": "IW-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至110%，<磨砻>死亡后生成的木制瑞印额外增加2个",
      "levelId": "activities/act15side/level_act15side_ex01.json"
    },
    {
      "operation": "IW-EX-2突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，生命值提升至150%（不包括器伥的本体）",
      "levelId": "activities/act15side/level_act15side_ex02.json"
    },
    {
      "operation": "IW-EX-3突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110% 所有器伥本体的生命值提升至200%（即击倒它们需要2倍的相应攻击次数）",
      "levelId": "activities/act15side/level_act15side_ex03.json"
    },
    {
      "operation": "IW-EX-4突袭",
      "challenge": "所有我方单位的最大生命值降低至70%",
      "levelId": "activities/act15side/level_act15side_ex04.json"
    },
    {
      "operation": "IW-EX-5突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至120%，战场中(1,9)、(2,9)、(3,9)、(1,10)、(2,10)、(3,10)、(4,10)、(5,10)的8个位置无法部署我方单位{最右下两列}",
      "levelId": "activities/act15side/level_act15side_ex05.json"
    },
    {
      "operation": "IW-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至105%，防御力提升至105%，近卫与术士的部署费用提升至3倍",
      "levelId": "activities/act15side/level_act15side_ex06.json"
    },
    {
      "operation": "IW-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，额外出现<堂皇>*2",
      "levelId": "activities/act15side/level_act15side_ex07.json"
    },
    {
      "operation": "IW-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至120%，磷火的生命值提升至150%（即击倒磷火需要15次伤害）",
      "levelId": "activities/act15side/level_act15side_ex08.json"
    },
    {
      "operation": "WR-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，我方远程干员的生命值降低至60%",
      "levelId": "activities/act16d5/level_act16d5_ex01.json"
    },
    {
      "operation": "WR-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，复杂的“妒”的技能冷却时间缩短至25%",
      "levelId": "activities/act16d5/level_act16d5_ex02.json"
    },
    {
      "operation": "WR-EX-3突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，恍惚的“得意”的移动速度提升至200%",
      "levelId": "activities/act16d5/level_act16d5_ex03.json"
    },
    {
      "operation": "WR-EX-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，恍惚的“得意”的生命值额外提升至200%",
      "levelId": "activities/act16d5/level_act16d5_ex04.json"
    },
    {
      "operation": "WR-EX-5突袭",
      "challenge": "敌方单位的攻击力、生命值提升至105%，我方干员阻挡数-2",
      "levelId": "activities/act16d5/level_act16d5_ex05.json"
    },
    {
      "operation": "WR-EX-6突袭",
      "challenge": "敌方单位的生命值提升至110%，我方近战单位的攻击速度降低至50%，防御力提升至150%，在(3,7)(5,5)(3,3)放置障碍物",
      "levelId": "activities/act16d5/level_act16d5_ex06.json"
    },
    {
      "operation": "WR-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，战场中的9个位置无法部署我方单位{(3,4)、(5,3)、(5,4)、(5,7)、(5,8)、(3,7)、(2,7)、(2,10)、(4,10)}",
      "levelId": "activities/act16d5/level_act16d5_ex07.json"
    },
    {
      "operation": "WR-EX-8突袭",
      "challenge": "敌方单位的防御力提升至110%，生命值提升至110%，我方单位的攻击力在攻击同属性单位时降低至30%",
      "levelId": "activities/act16d5/level_act16d5_ex08.json"
    },
    {
      "operation": "TG-1突袭",
      "challenge": "禁止部署术师干员",
      "levelId": "activities/act16mini/level_act16mini_01.json"
    },
    {
      "operation": "TG-2突袭",
      "challenge": "战场中的7个位置无法部署我方单位",
      "levelId": "activities/act16mini/level_act16mini_02.json"
    },
    {
      "operation": "TG-3突袭",
      "challenge": "训练用钳兽与训练用残暴钳兽攻击力大幅提升",
      "levelId": "activities/act16mini/level_act16mini_03.json"
    },
    {
      "operation": "TG-4突袭",
      "challenge": "我方所有单位的防御力减半",
      "levelId": "activities/act16mini/level_act16mini_04.json"
    },
    {
      "operation": "TG-5突袭",
      "challenge": "我方所有单位的攻击力降低",
      "levelId": "activities/act16mini/level_act16mini_05.json"
    },
    {
      "operation": "TG-6突袭",
      "challenge": "“得意”死亡后爆炸伤害大幅提升",
      "levelId": "activities/act16mini/level_act16mini_06.json"
    },
    {
      "operation": "TG-7突袭",
      "challenge": "凶豕兽变得更加狂暴",
      "levelId": "activities/act16mini/level_act16mini_07.json"
    },
    {
      "operation": "TG-8突袭",
      "challenge": "“越长尘”出现得更多，并获得隐匿",
      "levelId": "activities/act16mini/level_act16mini_08.json"
    },
    {
      "operation": "GA-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，寻路者精锐狙击手拥有弹药时造成的伤害额外提升至150%",
      "levelId": "activities/act16side/level_act16side_ex01.json"
    },
    {
      "operation": "GA-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，场上 (2,9)、(3,9)、(4,9)3个位置禁止部署干员{最右边三个高台}",
      "levelId": "activities/act16side/level_act16side_ex02.json"
    },
    {
      "operation": "GA-EX-3突袭",
      "challenge": "场上所有<“冰淇淋机”> 初始被敌方占领，敌方单位的生命值提升至110%",
      "levelId": "activities/act16side/level_act16side_ex03.json"
    },
    {
      "operation": "GA-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至115%，<“冰淇淋机”>的生命值提升至400%",
      "levelId": "activities/act16side/level_act16side_ex04.json"
    },
    {
      "operation": "GA-EX-5突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，精致糖果车爆炸后造成的法术溅射伤害额外增加350",
      "levelId": "activities/act16side/level_act16side_ex05.json"
    },
    {
      "operation": "GA-EX-6突袭",
      "challenge": "队伍里只能编入最多8个干员，敌方单位的攻击力和生命值都提升至110%",
      "levelId": "activities/act16side/level_act16side_ex06.json"
    },
    {
      "operation": "GA-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至115%，额外出现：寻路者阵地撕裂者×1{43th}，寻路者突击手×11[2,3,4变4,4,6,6}",
      "levelId": "activities/act16side/level_act16side_ex07.json"
    },
    {
      "operation": "GA-EX-8突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，敌方单位处于地面效果“光赐予苦”范围内时，受到的物理和法术伤害变为减少至35%",
      "levelId": "activities/act16side/level_act16side_ex08.json"
    },
    {
      "operation": "OD-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，<畸变体傀儡>被击败时分裂的<畸变赘生物>数量增加1个",
      "levelId": "activities/act17d0/level_act17d0_ex01.json"
    },
    {
      "operation": "OD-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，<土石结构>的生命值降低至80%",
      "levelId": "activities/act17d0/level_act17d0_ex02.json"
    },
    {
      "operation": "OD-EX-3突袭",
      "challenge": "<“红标”精英渗透者>的移动速度提升至150%",
      "levelId": "activities/act17d0/level_act17d0_ex03.json"
    },
    {
      "operation": "OD-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至110%，我方单位的攻击力降低至60%",
      "levelId": "activities/act17d0/level_act17d0_ex04.json"
    },
    {
      "operation": "OD-EX-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，开场销毁位于(3,6)和(5,5)的<土石结构>",
      "levelId": "activities/act17d0/level_act17d0_ex05.json"
    },
    {
      "operation": "OD-EX-6突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，<源石畸变体α>获得隐匿效果",
      "levelId": "activities/act17d0/level_act17d0_ex06.json"
    },
    {
      "operation": "OD-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，<全息幻影MK2>的攻击力额外提升至150%，生命值额外提升至200%",
      "levelId": "activities/act17d0/level_act17d0_ex07.json"
    },
    {
      "operation": "OD-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，场上有5个位置无法部署{(4,8)(5,8)(4,11)(5,11)(1,8)}",
      "levelId": "activities/act17d0/level_act17d0_ex08.json"
    },
    {
      "operation": "KR-1突袭",
      "challenge": "破阵者替换为破阵者组长",
      "levelId": "activities/act17mini/level_act17mini_01.json"
    },
    {
      "operation": "KR-2突袭",
      "challenge": "部分暴徒变为幽灵",
      "levelId": "activities/act17mini/level_act17mini_02.json"
    },
    {
      "operation": "KR-3突袭",
      "challenge": "家族士兵和叙拉古平民死亡时积累更多的血债账款",
      "levelId": "activities/act17mini/level_act17mini_03.json"
    },
    {
      "operation": "KR-4突袭",
      "challenge": "码头水手长在“水蚀”下不再额外流失生命",
      "levelId": "activities/act17mini/level_act17mini_04.json"
    },
    {
      "operation": "KR-5突袭",
      "challenge": "2个城防自走炮初始位置发生改变",
      "levelId": "activities/act17mini/level_act17mini_05.json"
    },
    {
      "operation": "KR-6突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act17mini/level_act17mini_06.json"
    },
    {
      "operation": "KR-7突袭",
      "challenge": "萨卡兹子裔改装补给车天赋效果变为2倍",
      "levelId": "activities/act17mini/level_act17mini_07.json"
    },
    {
      "operation": "KR-8突袭",
      "challenge": "“风筝”的生命值和攻击力大幅增加",
      "levelId": "activities/act17mini/level_act17mini_08.json"
    },
    {
      "operation": "SN-EX-1突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，生命值提升至120%，移动速度提升至150%",
      "levelId": "activities/act17side/level_act17side_ex01.json"
    },
    {
      "operation": "SN-EX-2突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，每3秒回复1点部署费用",
      "levelId": "activities/act17side/level_act17side_ex02.json"
    },
    {
      "operation": "SN-EX-3突袭",
      "challenge": "敌方单位的生命值提升至130%，障碍物的再部署时间额外增加100秒",
      "levelId": "activities/act17side/level_act17side_ex03.json"
    },
    {
      "operation": "SN-EX-4突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，额外出现的敌人如下： 富营养的喷溅者*4{开局左下红门刷出并前往左边四个溟痕罚站120秒，与普通难度右侧四个喷溅者完全对称}",
      "levelId": "activities/act17side/level_act17side_ex04.json"
    },
    {
      "operation": "SN-EX-5突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，生命值提升至150%",
      "levelId": "activities/act17side/level_act17side_ex05.json"
    },
    {
      "operation": "SN-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至120%，生命值提升至110%，战场中(6,9)，(5,10)，(6,10)，(4,3)，(5,6)，(4,6)，(4,7)7个位置不可部署{最右上角三格地面和中间高台的正左一格地面和中间高台右上角三格地面}",
      "levelId": "activities/act17side/level_act17side_ex06.json"
    },
    {
      "operation": "SN-EX-7突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，富营养的喷溅者获得隐匿",
      "levelId": "activities/act17side/level_act17side_ex07.json"
    },
    {
      "operation": "SN-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至120%，“屠谕者,大群意志”的攻击力、防御力、生命值额外再提升至120%",
      "levelId": "activities/act17side/level_act17side_ex08.json"
    },
    {
      "operation": "WD-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110% 移除位于(4,8)的可移动战术机库，启用位于(3,1){蓝门那行最左边那格}的可移动战术机库",
      "levelId": "activities/act18d0/level_act18d0_ex01.json"
    },
    {
      "operation": "WD-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，铁砧B型的生命值额外提升至200%",
      "levelId": "activities/act18d0/level_act18d0_ex02.json"
    },
    {
      "operation": "WD-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至105%，生命值提升至110%，额外出现以下敌人：战术猎犬×4、战术猎犬pro×8、反装甲步兵×8，所有追加的敌人的属性和本关卡中出现过的同类型敌人相同",
      "levelId": "activities/act18d0/level_act18d0_ex03.json"
    },
    {
      "operation": "WD-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至120%，生命值提升至115%，破片、破片U型、铁砧、铁砧B型的自动撤退时间增加至300%。",
      "levelId": "activities/act18d0/level_act18d0_ex04.json"
    },
    {
      "operation": "WD-EX-5突袭",
      "challenge": "敌方单位的攻击力和生命值提升至110%，防御力提升至105%，可部署单位上限减少1。",
      "levelId": "activities/act18d0/level_act18d0_ex05.json"
    },
    {
      "operation": "WD-EX-6突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，移除位于(2,4)的可移动战术机库，启用位于(3,10){中间蓝门右边那格}的可移动战术机库",
      "levelId": "activities/act18d0/level_act18d0_ex06.json"
    },
    {
      "operation": "WD-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，破片U型的攻击力额外提升至150%，攻击范围提升至150%",
      "levelId": "activities/act18d0/level_act18d0_ex07.json"
    },
    {
      "operation": "WD-EX-8突袭",
      "challenge": "敌方单位的生命值提升至110%， (2,3)、(2,4)、(2,5)、(2,6)、(2,7)、(2,8)、(2,9)7个位置无法部署{蓝门上那行中间七格}",
      "levelId": "activities/act18d0/level_act18d0_ex08.json"
    },
    {
      "operation": "SV-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至130%，生命值提升至130%。",
      "levelId": "activities/act18d3/level_act18d3_ex01.json"
    },
    {
      "operation": "SV-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，部署费用的自然回复速度降低至50%。",
      "levelId": "activities/act18d3/level_act18d3_ex02.json"
    },
    {
      "operation": "SV-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，我方单位的最大生命值降低至70%。",
      "levelId": "activities/act18d3/level_act18d3_ex03.json"
    },
    {
      "operation": "SV-EX-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%。战场上坐标为： (5,4)、(4,4)、(6,3)、(4,3)、(3,8)、(1,8)、(3,7)、(2,7)的8个位置{左装置上、下、右、右下四格和右装置上、下、左、左上四格}无法部署我方单位",
      "levelId": "activities/act18d3/level_act18d3_ex04.json"
    },
    {
      "operation": "SV-EX-5突袭",
      "challenge": "敌方单位的生命值提升至110%，富营养的收割者的攻击力提升至150%，造成的范围神经损伤效果提升至2倍。",
      "levelId": "activities/act18d3/level_act18d3_ex05.json"
    },
    {
      "operation": "SV-EX-6突袭",
      "challenge": "敌方单位的防御力提升至110%，生命值提升至120%，富营养的收割者的防御力额外提升至180%，生命值额外提升至200%。",
      "levelId": "activities/act18d3/level_act18d3_ex06.json"
    },
    {
      "operation": "SV-EX-7突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，首言者的生命值额外提升至150%，攻击范围提升至150%",
      "levelId": "activities/act18d3/level_act18d3_ex07.json"
    },
    {
      "operation": "SV-EX-8突袭",
      "challenge": "敌方单位的防御力提升至115%，生命值提升至125%，移除位于(4,2)和(4,10)的应急救治设施{左右两个}",
      "levelId": "activities/act18d3/level_act18d3_ex08.json"
    },
    {
      "operation": "SE-1突袭",
      "challenge": "<源石污染区>所在地块改变",
      "levelId": "activities/act18mini/level_act18mini_01.json"
    },
    {
      "operation": "SE-2突袭",
      "challenge": "出现额外的深池逐火战士",
      "levelId": "activities/act18mini/level_act18mini_02.json"
    },
    {
      "operation": "SE-3突袭",
      "challenge": "场上3处芦苇丛初始被点燃",
      "levelId": "activities/act18mini/level_act18mini_03.json"
    },
    {
      "operation": "SE-4突袭",
      "challenge": "孽罪奇美拉替换为渎罪奇美拉",
      "levelId": "activities/act18mini/level_act18mini_04.json"
    },
    {
      "operation": "SE-5突袭",
      "challenge": "战场中出现<活性源石风暴>",
      "levelId": "activities/act18mini/level_act18mini_05.json"
    },
    {
      "operation": "SE-6突袭",
      "challenge": "可使用障碍物数量减少2",
      "levelId": "activities/act18mini/level_act18mini_06.json"
    },
    {
      "operation": "SE-7突袭",
      "challenge": "所有萨卡兹骸骨卫士获得隐匿效果",
      "levelId": "activities/act18mini/level_act18mini_07.json"
    },
    {
      "operation": "SE-8突袭",
      "challenge": "所有萨卡兹骸骨卫士被击倒时，额外留下2个血珀",
      "levelId": "activities/act18mini/level_act18mini_08.json"
    },
    {
      "operation": "SE-S-1",
      "levelId": "activities/act18mini/level_act18mini_sub-1-1.json"
    },
    {
      "operation": "LE-EX-1突袭",
      "challenge": "禁止使用近卫和重装干员",
      "levelId": "activities/act18side/level_act18side_ex01.json"
    },
    {
      "operation": "LE-EX-2突袭",
      "challenge": "我方单位的攻击力降低",
      "levelId": "activities/act18side/level_act18side_ex02.json"
    },
    {
      "operation": "LE-EX-3突袭",
      "challenge": "黑水源石虫和黑水源石虫·α变为高能源石虫",
      "levelId": "activities/act18side/level_act18side_ex03.json"
    },
    {
      "operation": "LE-EX-4突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act18side/level_act18side_ex04.json"
    },
    {
      "operation": "LE-EX-5突袭",
      "challenge": "敌方单位的攻击速度提升",
      "levelId": "activities/act18side/level_act18side_ex05.json"
    },
    {
      "operation": "LE-EX-6突袭",
      "challenge": "队伍里只能编入最多7名干员",
      "levelId": "activities/act18side/level_act18side_ex06.json"
    },
    {
      "operation": "LE-EX-7突袭",
      "challenge": "敌方单位的生命值提升",
      "levelId": "activities/act18side/level_act18side_ex07.json"
    },
    {
      "operation": "LE-EX-8突袭",
      "challenge": "战场中的8个位置无法部署我方单位",
      "levelId": "activities/act18side/level_act18side_ex08.json"
    },
    {
      "operation": "DV-EX-1突袭",
      "challenge": "我方单位的生命值上限减少",
      "levelId": "activities/act19side/level_act19side_ex01.json"
    },
    {
      "operation": "DV-EX-2突袭",
      "challenge": "出现额外<R系列动力装甲>",
      "levelId": "activities/act19side/level_act19side_ex02.json"
    },
    {
      "operation": "DV-EX-3突袭",
      "challenge": "<R系列动力装甲>位置变化",
      "levelId": "activities/act19side/level_act19side_ex03.json"
    },
    {
      "operation": "DV-EX-4突袭",
      "challenge": "近卫和重装干员的部署费用提升至2倍",
      "levelId": "activities/act19side/level_act19side_ex04.json"
    },
    {
      "operation": "DV-EX-5突袭",
      "challenge": "敌方单位生命值大幅提升",
      "levelId": "activities/act19side/level_act19side_ex05.json"
    },
    {
      "operation": "DV-EX-6突袭",
      "challenge": "我方单位的防御力大幅下降",
      "levelId": "activities/act19side/level_act19side_ex06.json"
    },
    {
      "operation": "DV-EX-7突袭",
      "challenge": "多萝西获得隐匿",
      "levelId": "activities/act19side/level_act19side_ex07.json"
    },
    {
      "operation": "DV-EX-8突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act19side/level_act19side_ex08.json"
    },
    {
      "operation": "IC-EX-1突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_ex01.json"
    },
    {
      "operation": "IC-EX-2突袭",
      "challenge": "敌方单位的生命值大幅提升",
      "levelId": "activities/act20side/level_act20side_ex02.json"
    },
    {
      "operation": "IC-EX-3突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_ex03.json"
    },
    {
      "operation": "IC-EX-4突袭",
      "challenge": "场上有4个位置无法部署",
      "levelId": "activities/act20side/level_act20side_ex04.json"
    },
    {
      "operation": "IC-EX-5突袭",
      "challenge": "工蚁组长的生命值大幅提升",
      "levelId": "activities/act20side/level_act20side_ex05.json"
    },
    {
      "operation": "IC-EX-6突袭",
      "challenge": "敌方单位的移动速度大幅提升",
      "levelId": "activities/act20side/level_act20side_ex06.json"
    },
    {
      "operation": "IC-EX-7突袭",
      "challenge": "烈酒级醒酒助手的能力持续时间大幅提升",
      "levelId": "activities/act20side/level_act20side_ex07.json"
    },
    {
      "operation": "IC-EX-8突袭",
      "challenge": "场上有9个位置无法部署",
      "levelId": "activities/act20side/level_act20side_ex08.json"
    },
    {
      "operation": "IC-S-1突袭",
      "challenge": "酒类协会会员的能力持续时间大幅提升，且出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_sub-1-1.json"
    },
    {
      "operation": "IC-S-2突袭",
      "challenge": "场上有4个位置无法部署",
      "levelId": "activities/act20side/level_act20side_sub-1-2.json"
    },
    {
      "operation": "IC-S-3突袭",
      "challenge": "竞赛级沙滩车和烈酒级醒酒助手获得隐匿效果",
      "levelId": "activities/act20side/level_act20side_sub-1-3.json"
    },
    {
      "operation": "IC-S-4突袭",
      "challenge": "“物欲拮抗者”进入第二形态时受到的晕眩时间大幅降低",
      "levelId": "activities/act20side/level_act20side_sub-1-4.json"
    },
    {
      "operation": "IS-EX-1突袭",
      "challenge": "叙拉古平民数量减少",
      "levelId": "activities/act21side/level_act21side_ex01.json"
    },
    {
      "operation": "IS-EX-2突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act21side/level_act21side_ex02.json"
    },
    {
      "operation": "IS-EX-3突袭",
      "challenge": "近卫，重装，特种干员阻挡数-1",
      "levelId": "activities/act21side/level_act21side_ex03.json"
    },
    {
      "operation": "IS-EX-4突袭",
      "challenge": "家族豪华轿车的攻击力大幅提升",
      "levelId": "activities/act21side/level_act21side_ex04.json"
    },
    {
      "operation": "IS-EX-5突袭",
      "challenge": "家族精英弩手，家族精英术师攻击范围大幅提升",
      "levelId": "activities/act21side/level_act21side_ex05.json"
    },
    {
      "operation": "IS-EX-6突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act21side/level_act21side_ex06.json"
    },
    {
      "operation": "IS-EX-7突袭",
      "challenge": "我方干员与召唤物再部署时间延长100%",
      "levelId": "activities/act21side/level_act21side_ex07.json"
    },
    {
      "operation": "IS-EX-8突袭",
      "challenge": "叙拉古平民数量减少",
      "levelId": "activities/act21side/level_act21side_ex08.json"
    },
    {
      "operation": "IS-S-1突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act21side/level_act21side_sub-1-1.json"
    },
    {
      "operation": "IS-S-2突袭",
      "challenge": "家族铁腕角头光环内被击倒的敌人使“血债帐款”额外增加",
      "levelId": "activities/act21side/level_act21side_sub-1-2.json"
    },
    {
      "operation": "IS-S-3突袭",
      "challenge": "家族暗影灭迹者攻击范围大幅增加",
      "levelId": "activities/act21side/level_act21side_sub-1-3.json"
    },
    {
      "operation": "IS-S-4突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act21side/level_act21side_sub-1-4.json"
    },
    {
      "operation": "IS-S-5突袭",
      "challenge": "“狼之主”进入第二形态后，攻击力大幅提升",
      "levelId": "activities/act21side/level_act21side_sub-1-5.json"
    },
    {
      "operation": "FC-EX-1突袭",
      "challenge": "敌方单位生命值大幅提升",
      "levelId": "activities/act22side/level_act22side_ex01.json"
    },
    {
      "operation": "FC-EX-2突袭",
      "challenge": "深池弩炮队长攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex02.json"
    },
    {
      "operation": "FC-EX-3突袭",
      "challenge": "深池逐火精锐战士攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex03.json"
    },
    {
      "operation": "FC-EX-4突袭",
      "challenge": "场上额外1处芦苇丛初始被点燃",
      "levelId": "activities/act22side/level_act22side_ex04.json"
    },
    {
      "operation": "FC-EX-5突袭",
      "challenge": "燃烧的芦苇丛造成的法术伤害与灼燃损伤提升",
      "levelId": "activities/act22side/level_act22side_ex05.json"
    },
    {
      "operation": "FC-EX-6突袭",
      "challenge": "深池逐火精锐护卫攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex06.json"
    },
    {
      "operation": "FC-EX-7突袭",
      "challenge": "深池逐火精锐护卫和“校官”获得隐匿",
      "levelId": "activities/act22side/level_act22side_ex07.json"
    },
    {
      "operation": "FC-EX-8突袭",
      "challenge": "场上6处芦苇丛初始被点燃",
      "levelId": "activities/act22side/level_act22side_ex08.json"
    },
    {
      "operation": "WB-EX-1突袭",
      "challenge": "山海众头目和山海众秘使攻击力提升",
      "levelId": "activities/act23side/level_act23side_ex01.json"
    },
    {
      "operation": "WB-EX-2突袭",
      "challenge": "出现额外<城防路障>",
      "levelId": "activities/act23side/level_act23side_ex02.json"
    },
    {
      "operation": "WB-EX-3突袭",
      "challenge": "场上四个位置不可部署",
      "levelId": "activities/act23side/level_act23side_ex03.json"
    },
    {
      "operation": "WB-EX-4突袭",
      "challenge": "场上六个位置不可部署",
      "levelId": "activities/act23side/level_act23side_ex04.json"
    },
    {
      "operation": "WB-EX-5突袭",
      "challenge": "敌方单位攻击速度提升",
      "levelId": "activities/act23side/level_act23side_ex05.json"
    },
    {
      "operation": "WB-EX-6突袭",
      "challenge": "“碎壁”和山海众连阵者防御力大幅提升",
      "levelId": "activities/act23side/level_act23side_ex06.json"
    },
    {
      "operation": "WB-EX-7突袭",
      "challenge": "“越长尘”生命值提升",
      "levelId": "activities/act23side/level_act23side_ex07.json"
    },
    {
      "operation": "WB-EX-8突袭",
      "challenge": "我方单位阻挡数-1，妄境生命值提升",
      "levelId": "activities/act23side/level_act23side_ex08.json"
    },
    {
      "operation": "CF-EX-1突袭",
      "challenge": "威胁村庄的可能，情况危急。\n附加条件：\n出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex01.json"
    },
    {
      "operation": "CF-EX-2突袭",
      "challenge": "突然涌出大量暴躁的野兽，亟待处置。\n附加条件：\n炽焰源石虫的生命值大幅提升，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex02.json"
    },
    {
      "operation": "CF-EX-3突袭",
      "challenge": "冠兽与刚甲爪兽的异常活动。\n附加条件：\n刚甲爪兽和坚岩冠兽受到来自非弱点部位的伤害进一步降低",
      "levelId": "activities/act24side/level_act24side_ex03.json"
    },
    {
      "operation": "CF-EX-4突袭",
      "challenge": "羽兽出没，眩光手雷适合应对此类状况。\n附加条件：\n敌人攻击速度降低，但生命值与攻击力大幅提升\n<热泵通道>每隔一段时间便会对其上的我军和敌军造成大量伤害",
      "levelId": "activities/act24side/level_act24side_ex04.json"
    },
    {
      "operation": "CF-EX-5突袭",
      "challenge": "的肆虐已构成极大威胁，必须及时处理。\n附加条件：\n我方单位阻挡数-1，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex05.json"
    },
    {
      "operation": "CF-EX-6突袭",
      "challenge": "点的强者才能通过此考验。\n附加条件：\n迅猛锋羽兽生命值与攻击力提升，战场中的15个位置无法部署我方单位",
      "levelId": "activities/act24side/level_act24side_ex06.json"
    },
    {
      "operation": "CF-EX-7突袭",
      "challenge": "点，照耀前路的英雄才能通过此考验。\n附加条件：战场中的8个位置无法部署我方单位，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex07.json"
    },
    {
      "operation": "CF-EX-8突袭",
      "challenge": "大地的火光会令天空恐惧。\n附加条件：火龙的生命值与攻击力提升，作战道具的再部署时间大幅增加",
      "levelId": "activities/act24side/level_act24side_ex08.json"
    },
    {
      "operation": "CW-EX-1突袭",
      "challenge": "敌方生命值大幅提升",
      "levelId": "activities/act25side/level_act25side_ex01.json"
    },
    {
      "operation": "CW-EX-2突袭",
      "challenge": "场上3个位置不可部署",
      "levelId": "activities/act25side/level_act25side_ex02.json"
    },
    {
      "operation": "CW-EX-3突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act25side/level_act25side_ex03.json"
    },
    {
      "operation": "CW-EX-4突袭",
      "challenge": "可放置人数-2",
      "levelId": "activities/act25side/level_act25side_ex04.json"
    },
    {
      "operation": "CW-EX-5突袭",
      "challenge": "我方单位阻挡数-1",
      "levelId": "activities/act25side/level_act25side_ex05.json"
    },
    {
      "operation": "CW-EX-6突袭",
      "challenge": "“十字路口\"试作型攻击力大幅提升",
      "levelId": "activities/act25side/level_act25side_ex06.json"
    },
    {
      "operation": "CW-EX-7突袭",
      "challenge": "我方单位的攻击力与最大生命值大幅减少",
      "levelId": "activities/act25side/level_act25side_ex07.json"
    },
    {
      "operation": "CW-EX-8突袭",
      "challenge": "重装与近卫干员部署费用提升至3倍",
      "levelId": "activities/act25side/level_act25side_ex08.json"
    },
    {
      "operation": "CW-S-4突袭",
      "challenge": "星环周围8格我方单位攻速大幅减少，每个星环给克丽斯腾提供的减伤增加",
      "levelId": "activities/act25side/level_act25side_sub-1-4.json"
    },
    {
      "operation": "HE-EX-1突袭",
      "challenge": "敌人生命值大幅提升",
      "levelId": "activities/act26side/level_act26side_ex01.json"
    },
    {
      "operation": "HE-EX-2突袭",
      "challenge": "禁止部署重装和辅助干员",
      "levelId": "activities/act26side/level_act26side_ex02.json"
    },
    {
      "operation": "HE-EX-3突袭",
      "challenge": "场上八个位置不可部署",
      "levelId": "activities/act26side/level_act26side_ex03.json"
    },
    {
      "operation": "HE-EX-4突袭",
      "challenge": "额外出现两个<塌落的墙垣>",
      "levelId": "activities/act26side/level_act26side_ex04.json"
    },
    {
      "operation": "HE-EX-5突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act26side/level_act26side_ex05.json"
    },
    {
      "operation": "HE-EX-6突袭",
      "challenge": "荒原窃盗者精英获得<隐匿>",
      "levelId": "activities/act26side/level_act26side_ex06.json"
    },
    {
      "operation": "HE-EX-7突袭",
      "challenge": "额外出现一个<塌落的墙垣>",
      "levelId": "activities/act26side/level_act26side_ex07.json"
    },
    {
      "operation": "HE-EX-8突袭",
      "challenge": "落石对我方单位伤害大幅提升",
      "levelId": "activities/act26side/level_act26side_ex08.json"
    },
    {
      "operation": "SL-EX-1突袭",
      "challenge": "敌人生命值提升",
      "levelId": "activities/act27side/level_act27side_ex01.json"
    },
    {
      "operation": "SL-EX-2突袭",
      "challenge": "场上四个位置不可部署",
      "levelId": "activities/act27side/level_act27side_ex02.json"
    },
    {
      "operation": "SL-EX-3突袭",
      "challenge": "<水汽汽水瓶>的部署费用大幅增加",
      "levelId": "activities/act27side/level_act27side_ex03.json"
    },
    {
      "operation": "SL-EX-4突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act27side/level_act27side_ex04.json"
    },
    {
      "operation": "SL-EX-5突袭",
      "challenge": "风情街“满天飞空员”移动速度大幅提升",
      "levelId": "activities/act27side/level_act27side_ex05.json"
    },
    {
      "operation": "SL-EX-6突袭",
      "challenge": "城市“龙卷风行者”造成的伤害大幅提升",
      "levelId": "activities/act27side/level_act27side_ex06.json"
    },
    {
      "operation": "SL-EX-7突袭",
      "challenge": "风情街“超新星术师”的攻击速度大幅提升",
      "levelId": "activities/act27side/level_act27side_ex07.json"
    },
    {
      "operation": "SL-EX-8突袭",
      "challenge": "多利，“羊之主”在漂浮阶段时技能释放频率增加",
      "levelId": "activities/act27side/level_act27side_ex08.json"
    },
    {
      "operation": "SL-S-1突袭",
      "challenge": "城市“龙卷风行者”造成的伤害大幅提升",
      "levelId": "activities/act27side/level_act27side_sub-1-1.json"
    },
    {
      "operation": "SL-S-2突袭",
      "challenge": "<水汽汽水瓶>的生命值大幅提升",
      "levelId": "activities/act27side/level_act27side_sub-1-2.json"
    },
    {
      "operation": "SL-S-3突袭",
      "challenge": "敌人移动速度提升",
      "levelId": "activities/act27side/level_act27side_sub-1-3.json"
    },
    {
      "operation": "SL-S-4突袭",
      "challenge": "替换部分敌人",
      "levelId": "activities/act27side/level_act27side_sub-1-4.json"
    },
    {
      "operation": "SL-S-5突袭",
      "challenge": "多利，“羊之主”在漂浮阶段时的绒毛护盾值提升",
      "levelId": "activities/act27side/level_act27side_sub-1-5.json"
    },
    {
      "operation": "CV-EX-1突袭",
      "challenge": "<废热喷口>受击回复技力效率降低",
      "levelId": "activities/act28side/level_act28side_ex01.json"
    },
    {
      "operation": "CV-EX-2突袭",
      "challenge": "<废热喷口>释放间隔大幅增加",
      "levelId": "activities/act28side/level_act28side_ex02.json"
    },
    {
      "operation": "CV-EX-3突袭",
      "challenge": "出现额外<废热喷口>",
      "levelId": "activities/act28side/level_act28side_ex03.json"
    },
    {
      "operation": "CV-EX-4突袭",
      "challenge": "<废热喷口>受击回复技力效率降低且初始技力减少",
      "levelId": "activities/act28side/level_act28side_ex04.json"
    },
    {
      "operation": "CV-EX-5突袭",
      "challenge": "出现额外<废热喷口>",
      "levelId": "activities/act28side/level_act28side_ex05.json"
    },
    {
      "operation": "CV-EX-6突袭",
      "challenge": "辐能源石虫·α死亡后使场上敌人获得更多能量",
      "levelId": "activities/act28side/level_act28side_ex06.json"
    },
    {
      "operation": "CV-EX-7突袭",
      "challenge": "出现额外<废热喷口>",
      "levelId": "activities/act28side/level_act28side_ex07.json"
    },
    {
      "operation": "CV-EX-8突袭",
      "challenge": "“桥夹”克里夫技能释放频率增加",
      "levelId": "activities/act28side/level_act28side_ex08.json"
    },
    {
      "operation": "ZT-EX-1突袭",
      "challenge": "场上一个位置不可部署",
      "levelId": "activities/act29side/level_act29side_ex01.json"
    },
    {
      "operation": "ZT-EX-2突袭",
      "challenge": "<湮灭之相>再部署时间延长",
      "levelId": "activities/act29side/level_act29side_ex02.json"
    },
    {
      "operation": "ZT-EX-3突袭",
      "challenge": "<调谐节点>获得单向防御护盾",
      "levelId": "activities/act29side/level_act29side_ex03.json"
    },
    {
      "operation": "ZT-EX-4突袭",
      "challenge": "所有敌人攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex04.json"
    },
    {
      "operation": "ZT-EX-5突袭",
      "challenge": "<调谐节点>获得单向防御护盾",
      "levelId": "activities/act29side/level_act29side_ex05.json"
    },
    {
      "operation": "ZT-EX-6突袭",
      "challenge": "巫王乐团小号手生命值和攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex06.json"
    },
    {
      "operation": "ZT-EX-7突袭",
      "challenge": "巫王乐团指挥家攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex07.json"
    },
    {
      "operation": "ZT-EX-8突袭",
      "challenge": "赫尔昏佐伦，“巫王”释放【慵钝惩戒】技能的频率增加，击破“慵钝之印”所需伤害次数增加",
      "levelId": "activities/act29side/level_act29side_ex08.json"
    },
    {
      "operation": "ZT-S-1突袭",
      "challenge": "禁止部署特种干员",
      "levelId": "activities/act29side/level_act29side_sub-1-1.json"
    },
    {
      "operation": "ZT-S-2突袭",
      "challenge": "激昂变奏下，巫王乐团管乐家移动速度获得额外提升",
      "levelId": "activities/act29side/level_act29side_sub-1-2.json"
    },
    {
      "operation": "ZT-S-3突袭",
      "challenge": "巫王乐团大提琴家生命值大幅提升，且在沉郁变奏下，护盾反弹的伤害大幅度提升",
      "levelId": "activities/act29side/level_act29side_sub-1-3.json"
    },
    {
      "operation": "ZT-S-4突袭",
      "challenge": "<调谐节点>技力消耗增加",
      "levelId": "activities/act29side/level_act29side_sub-1-4.json"
    },
    {
      "operation": "ZT-S-5突袭",
      "challenge": "赫尔昏佐伦，“巫王”第一形态下瞬移间隔大幅度缩短",
      "levelId": "activities/act29side/level_act29side_sub-1-5.json"
    },
    {
      "operation": "RS-EX-1突袭",
      "challenge": "敌人移动速度大幅提升",
      "levelId": "activities/act30side/level_act30side_ex01.json"
    },
    {
      "operation": "RS-EX-2突袭",
      "challenge": "近卫、重装、特种干员阻挡数-1",
      "levelId": "activities/act30side/level_act30side_ex02.json"
    },
    {
      "operation": "RS-EX-3突袭",
      "challenge": "“访问团持盾长”最大特性层数提升",
      "levelId": "activities/act30side/level_act30side_ex03.json"
    },
    {
      "operation": "RS-EX-4突袭",
      "challenge": "先锋、近卫、重装部署费用提升至2倍",
      "levelId": "activities/act30side/level_act30side_ex04.json"
    },
    {
      "operation": "RS-EX-5突袭",
      "challenge": "场上初始出现额外敌人",
      "levelId": "activities/act30side/level_act30side_ex05.json"
    },
    {
      "operation": "RS-EX-6突袭",
      "challenge": "“沉眠高山驮兽”初始位置改变",
      "levelId": "activities/act30side/level_act30side_ex06.json"
    },
    {
      "operation": "RS-EX-7突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act30side/level_act30side_ex07.json"
    },
    {
      "operation": "RS-EX-8突袭",
      "challenge": "<点火石>费用增加至20",
      "levelId": "activities/act30side/level_act30side_ex08.json"
    },
    {
      "operation": "HS-EX-1突袭",
      "challenge": "场上的<泵站>朝向改变",
      "levelId": "activities/act31side/level_act31side_ex01.json"
    },
    {
      "operation": "HS-EX-2突袭",
      "challenge": "硬毫田鼷生命值大幅提升",
      "levelId": "activities/act31side/level_act31side_ex02.json"
    },
    {
      "operation": "HS-EX-3突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_ex03.json"
    },
    {
      "operation": "HS-EX-4突袭",
      "challenge": "勿玷位于受病害污染的田地上时，造成的法术伤害提升",
      "levelId": "activities/act31side/level_act31side_ex04.json"
    },
    {
      "operation": "HS-EX-5突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act31side/level_act31side_ex05.json"
    },
    {
      "operation": "HS-EX-6突袭",
      "challenge": "不再持有<泵站>",
      "levelId": "activities/act31side/level_act31side_ex06.json"
    },
    {
      "operation": "HS-EX-7突袭",
      "challenge": "除秽与厌肮被击倒时造成的病害污染大幅提升",
      "levelId": "activities/act31side/level_act31side_ex07.json"
    },
    {
      "operation": "HS-EX-8突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_ex08.json"
    },
    {
      "operation": "HS-S-1突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_sub-1-1.json"
    },
    {
      "operation": "HS-S-2突袭",
      "challenge": "持有的<阻流阀>数量减少",
      "levelId": "activities/act31side/level_act31side_sub-1-2.json"
    },
    {
      "operation": "HS-S-3突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act31side/level_act31side_sub-1-3.json"
    },
    {
      "operation": "HS-S-4突袭",
      "challenge": "“祟”释放如梭所需的病害程度阈值大幅降低",
      "levelId": "activities/act31side/level_act31side_sub-1-4.json"
    },
    {
      "operation": "CR-EX-1突袭",
      "challenge": "场上5个位置不可部署",
      "levelId": "activities/act32side/level_act32side_ex01.json"
    },
    {
      "operation": "CR-EX-2突袭",
      "challenge": "出现额外的源石爆炸物，上方封阻物不再加固",
      "levelId": "activities/act32side/level_act32side_ex02.json"
    },
    {
      "operation": "CR-EX-3突袭",
      "challenge": "出现额外的无畏掷弹兵",
      "levelId": "activities/act32side/level_act32side_ex03.json"
    },
    {
      "operation": "CR-EX-4突袭",
      "challenge": "初始部署费用增加但不再回复费用",
      "levelId": "activities/act32side/level_act32side_ex04.json"
    },
    {
      "operation": "CR-EX-5突袭",
      "challenge": "出现额外的无畏掷弹兵",
      "levelId": "activities/act32side/level_act32side_ex05.json"
    },
    {
      "operation": "CR-EX-6突袭",
      "challenge": "近卫和特种的部署费用翻倍",
      "levelId": "activities/act32side/level_act32side_ex06.json"
    },
    {
      "operation": "CR-EX-7突袭",
      "challenge": "\"马特奥的近卫\"未被阻挡时，受到的物理和法术伤害额外降低",
      "levelId": "activities/act32side/level_act32side_ex07.json"
    },
    {
      "operation": "CR-EX-8突袭",
      "challenge": "出现额外的精英敌人",
      "levelId": "activities/act32side/level_act32side_ex08.json"
    },
    {
      "operation": "BB-EX-1突袭",
      "challenge": "出现额外的萨卡兹刀术师",
      "levelId": "activities/act33side/level_act33side_ex01.json"
    },
    {
      "operation": "BB-EX-2突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "activities/act33side/level_act33side_ex02.json"
    },
    {
      "operation": "BB-EX-3突袭",
      "challenge": "出现额外的流浪佣兵“编织者”",
      "levelId": "activities/act33side/level_act33side_ex03.json"
    },
    {
      "operation": "BB-EX-4突袭",
      "challenge": "赏金猎人“大骑士”的攻击力，生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_ex04.json"
    },
    {
      "operation": "BB-EX-5突袭",
      "challenge": "可同时部署人数降至6",
      "levelId": "activities/act33side/level_act33side_ex05.json"
    },
    {
      "operation": "BB-EX-6突袭",
      "challenge": "场上有8个位置无法部署",
      "levelId": "activities/act33side/level_act33side_ex06.json"
    },
    {
      "operation": "BB-EX-7突袭",
      "challenge": "自由佣兵“主音吉他”的攻击力，生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_ex07.json"
    },
    {
      "operation": "BB-EX-8突袭",
      "challenge": "障碍物部署消耗的费用大幅提升",
      "levelId": "activities/act33side/level_act33side_ex08.json"
    },
    {
      "operation": "BB-S-1突袭",
      "challenge": "出现额外的流浪佣兵“编织者”，流浪佣兵“编织者”的生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_sub-1-1.json"
    },
    {
      "operation": "BB-S-2突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-2.json"
    },
    {
      "operation": "BB-S-3突袭",
      "challenge": "巫术弩炮的等级提升",
      "levelId": "activities/act33side/level_act33side_sub-1-3.json"
    },
    {
      "operation": "BB-S-4突袭",
      "challenge": "场上有5个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-4.json"
    },
    {
      "operation": "BP-EX-1突袭",
      "challenge": "出现额外的敌人",
      "levelId": "activities/act34side/level_act34side_ex01.json"
    },
    {
      "operation": "BP-EX-2突袭",
      "challenge": "异光体饲育者的攻击速度、移动速度、生命值提升",
      "levelId": "activities/act34side/level_act34side_ex02.json"
    },
    {
      "operation": "BP-EX-3突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "activities/act34side/level_act34side_ex03.json"
    },
    {
      "operation": "BP-EX-4突袭",
      "challenge": "初始出现额外的敌人",
      "levelId": "activities/act34side/level_act34side_ex04.json"
    },
    {
      "operation": "BP-EX-5突袭",
      "challenge": "初始存在的赘生甲壳数量减少",
      "levelId": "activities/act34side/level_act34side_ex05.json"
    },
    {
      "operation": "BP-EX-6突袭",
      "challenge": "“受诅者”的攻击力、生命值提升",
      "levelId": "activities/act34side/level_act34side_ex06.json"
    },
    {
      "operation": "BP-EX-7突袭",
      "challenge": "场上有1个位置无法部署",
      "levelId": "activities/act34side/level_act34side_ex07.json"
    },
    {
      "operation": "BP-EX-8突袭",
      "challenge": "玛利图斯，“海嗣”释放【引导演化】提供的神经损伤能力大幅提升、释放【人性之囚】的频率增加",
      "levelId": "activities/act34side/level_act34side_ex08.json"
    },
    {
      "operation": "AS-EX-1突袭",
      "challenge": "持有的障碍物数量大幅减少",
      "levelId": "activities/act35side/level_act35side_ex01.json"
    },
    {
      "operation": "AS-EX-2突袭",
      "challenge": "净化结晶的效率大幅降低",
      "levelId": "activities/act35side/level_act35side_ex02.json"
    },
    {
      "operation": "AS-EX-3突袭",
      "challenge": "“弹跳独轮车”的攻击速度大幅增加",
      "levelId": "activities/act35side/level_act35side_ex03.json"
    },
    {
      "operation": "AS-EX-4突袭",
      "challenge": "初始出现额外的“弹跳独轮车”",
      "levelId": "activities/act35side/level_act35side_ex04.json"
    },
    {
      "operation": "AS-EX-5突袭",
      "challenge": "出现额外的工蚁组长",
      "levelId": "activities/act35side/level_act35side_ex05.json"
    },
    {
      "operation": "AS-EX-6突袭",
      "challenge": "风情区大型车辇获得<隐匿>",
      "levelId": "activities/act35side/level_act35side_ex06.json"
    },
    {
      "operation": "AS-EX-7突袭",
      "challenge": "净化结晶的效率大幅降低",
      "levelId": "activities/act35side/level_act35side_ex07.json"
    },
    {
      "operation": "AS-EX-8突袭",
      "challenge": "禁止部署特种干员",
      "levelId": "activities/act35side/level_act35side_ex08.json"
    },
    {
      "operation": "AS-S-1突袭",
      "challenge": "结晶为米奥，热烈的考验者提供的增益效果大幅增强，大型破碎器皿损失的生命值减少",
      "levelId": "activities/act35side/level_act35side_sub-1-1.json"
    },
    {
      "operation": "AS-S-2突袭",
      "challenge": "初始大型破碎器皿的行动路线有所不同，场上有2个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-2.json"
    },
    {
      "operation": "AS-S-3突袭",
      "challenge": "“弹跳独轮车”获得<隐匿>，场上有1个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-3.json"
    },
    {
      "operation": "AS-S-4突袭",
      "challenge": "部署在结晶上的单位攻击速度进一步降低",
      "levelId": "activities/act35side/level_act35side_sub-1-4.json"
    },
    {
      "operation": "DT-EX-1突袭",
      "challenge": "饿肚子流失更多生命，且敌人生命值大幅提升",
      "levelId": "activities/act36side/level_act36side_ex01.json"
    },
    {
      "operation": "DT-EX-2突袭",
      "challenge": "出现额外的<暴走食人花>",
      "levelId": "activities/act36side/level_act36side_ex02.json"
    },
    {
      "operation": "DT-EX-3突袭",
      "challenge": "<简饲源石虫>与<精饲源石虫>隐匿",
      "levelId": "activities/act36side/level_act36side_ex03.json"
    },
    {
      "operation": "DT-EX-4突袭",
      "challenge": "饿肚子流失更多生命",
      "levelId": "activities/act36side/level_act36side_ex04.json"
    },
    {
      "operation": "DT-EX-5突袭",
      "challenge": "初始场上的<硕果虫>不再出现",
      "levelId": "activities/act36side/level_act36side_ex05.json"
    },
    {
      "operation": "DT-EX-6突袭",
      "challenge": "敌人的生命值和攻击力大幅提升，开饭需要的食材大幅提升",
      "levelId": "activities/act36side/level_act36side_ex06.json"
    },
    {
      "operation": "DT-EX-7突袭",
      "challenge": "出现道路障碍物",
      "levelId": "activities/act36side/level_act36side_ex07.json"
    },
    {
      "operation": "DT-EX-8突袭",
      "challenge": "<“三头犬”>狂暴状态下攻击力、移动速度大幅提升",
      "levelId": "activities/act36side/level_act36side_ex08.json"
    },
    {
      "operation": "GO-EX-1突袭",
      "challenge": "所有敌人出场时携带未装配刀片",
      "levelId": "activities/act37side/level_act37side_ex01.json"
    },
    {
      "operation": "GO-EX-2突袭",
      "challenge": "“街区自治队”队长攻击力提升，且获得<隐匿>",
      "levelId": "activities/act37side/level_act37side_ex02.json"
    },
    {
      "operation": "GO-EX-3突袭",
      "challenge": "“街区自治队”队长攻击力提升",
      "levelId": "activities/act37side/level_act37side_ex03.json"
    },
    {
      "operation": "GO-EX-4突袭",
      "challenge": "“铣痕”团伙精锐佣兵和大容量物资运输艇最大生命值提升",
      "levelId": "activities/act37side/level_act37side_ex04.json"
    },
    {
      "operation": "GO-EX-5突袭",
      "challenge": "场上部分军工厂指令平台消失",
      "levelId": "activities/act37side/level_act37side_ex05.json"
    },
    {
      "operation": "GO-EX-6突袭",
      "challenge": "“护目镜”帮派打手出场时携带冲击式施术单元",
      "levelId": "activities/act37side/level_act37side_ex06.json"
    },
    {
      "operation": "GO-EX-7突袭",
      "challenge": "场上出现额外的大容量物资运输艇，部分大容量物资运输艇初始位置改变",
      "levelId": "activities/act37side/level_act37side_ex07.json"
    },
    {
      "operation": "GO-EX-8突袭",
      "challenge": "阿利斯泰尔，帝国余晖的攻击范围扩大至全场",
      "levelId": "activities/act37side/level_act37side_ex08.json"
    },
    {
      "operation": "PV-EX-1突袭",
      "challenge": "<烟花发射器>生命值大幅度降低",
      "levelId": "activities/act38side/level_act38side_ex01.json"
    },
    {
      "operation": "PV-EX-2突袭",
      "challenge": "场上有3个位置无法部署",
      "levelId": "activities/act38side/level_act38side_ex02.json"
    },
    {
      "operation": "PV-EX-3突袭",
      "challenge": "<巡游零食车>攻击力大幅度提升",
      "levelId": "activities/act38side/level_act38side_ex03.json"
    },
    {
      "operation": "PV-EX-4突袭",
      "challenge": "我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_ex04.json"
    },
    {
      "operation": "PV-EX-5突袭",
      "challenge": "初始场上出现<“美食速递”>",
      "levelId": "activities/act38side/level_act38side_ex05.json"
    },
    {
      "operation": "PV-EX-6突袭",
      "challenge": "<烟花发射器>引线火苗变弱",
      "levelId": "activities/act38side/level_act38side_ex06.json"
    },
    {
      "operation": "PV-EX-7突袭",
      "challenge": "初始场上的<专业竞演者>路线改变",
      "levelId": "activities/act38side/level_act38side_ex07.json"
    },
    {
      "operation": "PV-EX-8突袭",
      "challenge": "我方单位再部署时间延长",
      "levelId": "activities/act38side/level_act38side_ex08.json"
    },
    {
      "operation": "PV-S-1突袭",
      "challenge": "所有<“美食速递”>替换为<“醉后狂欢”>，且我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_sub-1-1.json"
    },
    {
      "operation": "PV-S-2突袭",
      "challenge": "所有<巡游爵士乐手>替换为<“美食速递”>",
      "levelId": "activities/act38side/level_act38side_sub-1-2.json"
    },
    {
      "operation": "PV-S-3突袭",
      "challenge": "<烟花发射器>引线燃烧速度降低",
      "levelId": "activities/act38side/level_act38side_sub-1-3.json"
    },
    {
      "operation": "PV-S-4突袭",
      "challenge": "场上出现额外的<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-4.json"
    },
    {
      "operation": "PV-S-5突袭",
      "challenge": "场上出现额外的<热烈舞团领舞者>，且所有<专业竞演者>替换为<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-5.json"
    },
    {
      "operation": "EP-EX-1突袭",
      "challenge": "历险水手获得隐匿",
      "levelId": "activities/act39side/level_act39side_ex01.json"
    },
    {
      "operation": "EP-EX-2突袭",
      "challenge": "盐坨子炮攻击力大幅提升",
      "levelId": "activities/act39side/level_act39side_ex02.json"
    },
    {
      "operation": "EP-EX-3突袭",
      "challenge": "所有敌人生命值大幅提升",
      "levelId": "activities/act39side/level_act39side_ex03.json"
    },
    {
      "operation": "EP-EX-4突袭",
      "challenge": "场上额外出现2个恐怖厨子",
      "levelId": "activities/act39side/level_act39side_ex04.json"
    },
    {
      "operation": "EP-EX-5突袭",
      "challenge": "恐怖厨子减少物理与法术伤害的比例提升",
      "levelId": "activities/act39side/level_act39side_ex05.json"
    },
    {
      "operation": "EP-EX-6突袭",
      "challenge": "禁止部署重装和特种干员",
      "levelId": "activities/act39side/level_act39side_ex06.json"
    },
    {
      "operation": "EP-EX-7突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act39side/level_act39side_ex07.json"
    },
    {
      "operation": "EP-EX-8突袭",
      "challenge": "美声水手长召唤历险水手的间隔缩短",
      "levelId": "activities/act39side/level_act39side_ex08.json"
    },
    {
      "operation": "OR-EX-1突袭",
      "challenge": "场上出现额外的“饱食”",
      "levelId": "activities/act40side/level_act40side_ex01.json"
    },
    {
      "operation": "OR-EX-2突袭",
      "challenge": "场上出现额外的飘香",
      "levelId": "activities/act40side/level_act40side_ex02.json"
    },
    {
      "operation": "OR-EX-3突袭",
      "challenge": "可部署的箱子数量大幅减少",
      "levelId": "activities/act40side/level_act40side_ex03.json"
    },
    {
      "operation": "OR-EX-4突袭",
      "challenge": "战场有3个位置无法部署",
      "levelId": "activities/act40side/level_act40side_ex04.json"
    },
    {
      "operation": "OR-EX-5突袭",
      "challenge": "出现额外的“里子”",
      "levelId": "activities/act40side/level_act40side_ex05.json"
    },
    {
      "operation": "OR-EX-6突袭",
      "challenge": "出现额外的招财",
      "levelId": "activities/act40side/level_act40side_ex06.json"
    },
    {
      "operation": "OR-EX-7突袭",
      "challenge": "<火灶>和<废弃火灶>位置改变，部分敌人类型改变",
      "levelId": "activities/act40side/level_act40side_ex07.json"
    },
    {
      "operation": "OR-EX-8突袭",
      "challenge": "<火灶>所需技力增加",
      "levelId": "activities/act40side/level_act40side_ex08.json"
    },
    {
      "operation": "OR-S-1突袭",
      "challenge": "“废食”召唤技能冷却时间减少",
      "levelId": "activities/act40side/level_act40side_sub-1-1.json"
    },
    {
      "operation": "OR-S-2突袭",
      "challenge": "辅助、特种干员部署费用提升至3倍",
      "levelId": "activities/act40side/level_act40side_sub-1-2.json"
    },
    {
      "operation": "OR-S-3突袭",
      "challenge": "“饮露餐风”造成的伤害提升",
      "levelId": "activities/act40side/level_act40side_sub-1-3.json"
    },
    {
      "operation": "OR-S-4突袭",
      "challenge": "无谓生命值提升",
      "levelId": "activities/act40side/level_act40side_sub-1-4.json"
    },
    {
      "operation": "EA-EX-1突袭",
      "challenge": "初始场上的<空壳>不再出现",
      "levelId": "activities/act41side/level_act41side_ex01.json"
    },
    {
      "operation": "EA-EX-2突袭",
      "challenge": "场上有3个位置无法部署",
      "levelId": "activities/act41side/level_act41side_ex02.json"
    },
    {
      "operation": "EA-EX-3突袭",
      "challenge": "指路草获得<隐匿>",
      "levelId": "activities/act41side/level_act41side_ex03.json"
    },
    {
      "operation": "EA-EX-4突袭",
      "challenge": "地形和敌人等有所不同",
      "levelId": "activities/act41side/level_act41side_ex04.json"
    },
    {
      "operation": "EA-EX-5突袭",
      "challenge": "战场上额外出现4个<盾与墙>",
      "levelId": "activities/act41side/level_act41side_ex05.json"
    },
    {
      "operation": "EA-EX-6突袭",
      "challenge": "<盾与墙>初始位置改变",
      "levelId": "activities/act41side/level_act41side_ex06.json"
    },
    {
      "operation": "EA-EX-7突袭",
      "challenge": "场上有5个位置无法部署",
      "levelId": "activities/act41side/level_act41side_ex07.json"
    },
    {
      "operation": "EA-EX-8突袭",
      "challenge": "战场上额外出现2个<盾与墙>",
      "levelId": "activities/act41side/level_act41side_ex08.json"
    },
    {
      "operation": "MT-EX-1突袭",
      "challenge": "法术抗性提升",
      "levelId": "activities/act42side/level_act42side_ex01.json"
    },
    {
      "operation": "MT-EX-2突袭",
      "challenge": "<“萨科塔昂首”>生命值提升",
      "levelId": "activities/act42side/level_act42side_ex02.json"
    },
    {
      "operation": "MT-EX-3突袭",
      "challenge": "<圣堂射手扮演者>不再出现",
      "levelId": "activities/act42side/level_act42side_ex03.json"
    },
    {
      "operation": "MT-EX-4突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act42side/level_act42side_ex04.json"
    },
    {
      "operation": "MT-EX-5突袭",
      "challenge": "<圣徒祈祷像>和<“牧首”>提供屏障的速率提升",
      "levelId": "activities/act42side/level_act42side_ex05.json"
    },
    {
      "operation": "MT-EX-6突袭",
      "challenge": "<资深圣堂布道员>技能持续时间提升",
      "levelId": "activities/act42side/level_act42side_ex06.json"
    },
    {
      "operation": "MT-EX-7突袭",
      "challenge": "可同时部署干员单位数-2",
      "levelId": "activities/act42side/level_act42side_ex07.json"
    },
    {
      "operation": "MT-EX-8突袭",
      "challenge": "术师、医疗干员部署费用变为2倍",
      "levelId": "activities/act42side/level_act42side_ex08.json"
    },
    {
      "operation": "MT-S-1突袭",
      "challenge": "出现额外敌人且部分<冰淇淋机>初始阵营改变",
      "levelId": "activities/act42side/level_act42side_sub-1-1.json"
    },
    {
      "operation": "MT-S-2突袭",
      "challenge": "出现额外敌人且<荒原窃盗者精英>获得隐匿",
      "levelId": "activities/act42side/level_act42side_sub-1-2.json"
    },
    {
      "operation": "MT-S-3突袭",
      "challenge": "出现额外敌人且<资深圣堂保育员>生命值提升",
      "levelId": "activities/act42side/level_act42side_sub-1-3.json"
    },
    {
      "operation": "MT-S-4突袭",
      "challenge": "<腐败萃聚使徒>位置和路线变化",
      "levelId": "activities/act42side/level_act42side_sub-1-4.json"
    },
    {
      "operation": "MT-S-5突袭",
      "challenge": "<“圣徒”>额外进行一次<寻根圣事>",
      "levelId": "activities/act42side/level_act42side_sub-1-5.json"
    },
    {
      "operation": "AD-EX-1突袭",
      "challenge": "部署费用的回复速度降低",
      "levelId": "activities/act43side/level_act43side_ex01.json"
    },
    {
      "operation": "AD-EX-2突袭",
      "challenge": "特种干员的部署费用提升至1.5倍",
      "levelId": "activities/act43side/level_act43side_ex02.json"
    },
    {
      "operation": "AD-EX-3突袭",
      "challenge": "出现额外的顺从内心的设计师",
      "levelId": "activities/act43side/level_act43side_ex03.json"
    },
    {
      "operation": "AD-EX-4突袭",
      "challenge": "出现额外的沉浸艺术的群演，且沉浸艺术的群演获得隐匿",
      "levelId": "activities/act43side/level_act43side_ex04.json"
    },
    {
      "operation": "AD-EX-5突袭",
      "challenge": "战场上额外出现<打光道具>",
      "levelId": "activities/act43side/level_act43side_ex05.json"
    },
    {
      "operation": "AD-EX-6突袭",
      "challenge": "<打光道具>的生命值提升",
      "levelId": "activities/act43side/level_act43side_ex06.json"
    },
    {
      "operation": "AD-EX-7突袭",
      "challenge": "场上有1个位置无法部署，且意识自由的假人移动速度提升",
      "levelId": "activities/act43side/level_act43side_ex07.json"
    },
    {
      "operation": "AD-EX-8突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "activities/act43side/level_act43side_ex08.json"
    },
    {
      "operation": "AF-1突袭",
      "challenge": "我方所有远程干员的部署费用增至3倍，敌方单位的生命值、防御力都提升至110%，攻击力提升至120%",
      "levelId": "activities/act6d5/level_act6d5_01.json"
    },
    {
      "operation": "AF-2突袭",
      "challenge": "敌方单位的生命值提升至120%，攻击力提升至160%，防御力提升至110%",
      "levelId": "activities/act6d5/level_act6d5_02.json"
    },
    {
      "operation": "AF-3突袭",
      "challenge": "敌方单位的生命值、攻击力都提升至110%，酸液源石虫的攻击降低50%,但攻击速度提升至200%",
      "levelId": "activities/act6d5/level_act6d5_03.json"
    },
    {
      "operation": "AF-4突袭",
      "challenge": "敌方单位的生命值、防御力都提升至110%，大鲍勃的生命值提升至200% (同时享受敌方单位BUFF，乘算)",
      "levelId": "activities/act6d5/level_act6d5_04.json"
    },
    {
      "operation": "AF-5突袭",
      "challenge": "敌方单位的生命值、攻击力都提升至120%，防御力提升至110%，场上(3,4)无法部署单位{唯一的地面}",
      "levelId": "activities/act6d5/level_act6d5_05.json"
    },
    {
      "operation": "AF-6突袭",
      "challenge": "敌方单位的生命值提升至110%，阻挡数减少的持续时间提升至2倍",
      "levelId": "activities/act6d5/level_act6d5_06.json"
    },
    {
      "operation": "AF-7突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110%，粉碎攻坚组长的生命值提升至137% (同时享受敌方单位BUFF，乘算)",
      "levelId": "activities/act6d5/level_act6d5_07.json"
    },
    {
      "operation": "AF-8突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至105%，场上(5,8)，(4,8)，(3,8)，(5,7)，(4,7)，(3,7)，(5,9)，(4,9)，(3,9)9个地块无法部署单位{最右边九个格子}",
      "levelId": "activities/act6d5/level_act6d5_08.json"
    },
    {
      "operation": "SA-2突袭",
      "challenge": "所有敌人生命值、防御力都提升至110%，所有远程敌人的攻击范围扩大至150%",
      "levelId": "activities/act7d5/level_act7d5_02.json"
    },
    {
      "operation": "SA-3突袭",
      "challenge": "所有敌人生命值提升至120%、攻击力提升至115%、防御力提升至110%，战场中(4,2)，(4,3)，(4,4)，(5,4)4个位置无法部署单位{左上三格地火和源石地板}",
      "levelId": "activities/act7d5/level_act7d5_03.json"
    },
    {
      "operation": "SA-5突袭",
      "challenge": "所有敌人生命值提升至110%、防御力提升至120%，狂暴宿主士兵与狂暴宿主组长的移动速度提升至110%、攻击力提升至115%",
      "levelId": "activities/act7d5/level_act7d5_05.json"
    },
    {
      "operation": "SA-6突袭",
      "challenge": "最多可编入10名干员进行作战，所有敌人生命值、攻击力都提升至110%",
      "levelId": "activities/act7d5/level_act7d5_06.json"
    },
    {
      "operation": "PL-1突袭",
      "challenge": "敌方单位的生命值，攻击力和防御力都提升至110%。隐形弩手的攻击力额外提升至140%，攻击范围提升至120%。",
      "levelId": "activities/act7mini/level_act7mini_01.json"
    },
    {
      "operation": "PL-2突袭",
      "challenge": "禁止部署重装和狙击干员。敌方单位的生命值，攻击力和防御力都提升至110%。",
      "levelId": "activities/act7mini/level_act7mini_02.json"
    },
    {
      "operation": "PL-3突袭",
      "challenge": "敌方单位的生命值提升至110%。乌萨斯突袭弩手的攻击力提升至170%；空降组长的生命值额外提升至200%，防御力提升至250%。",
      "levelId": "activities/act7mini/level_act7mini_03.json"
    },
    {
      "operation": "PL-4突袭",
      "challenge": "我方单位阻挡数-2。敌方单位的生命值，攻击力和防御力都提升至110%。",
      "levelId": "activities/act7mini/level_act7mini_04.json"
    },
    {
      "operation": "PL-5突袭",
      "challenge": "移除战场中的4个<土石结构>{左边一个和右边三个}和2个<盾卫>{左和右}",
      "levelId": "activities/act7mini/level_act7mini_05.json"
    },
    {
      "operation": "VI-1突袭",
      "challenge": "游击队盾卫数量减少，额外出现一名提亚卡乌冠军；敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act8mini/level_act8mini_01.json"
    },
    {
      "operation": "VI-2突袭",
      "challenge": "额外出现一名战争幽灵；敌方单位的攻击力提升至105%，生命值提升至110%",
      "levelId": "activities/act8mini/level_act8mini_02.json"
    },
    {
      "operation": "VI-3突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110% 畸变体傀儡、变异岩蛛、变异岩蛛α的攻击力额外提升至150%，生命值额外提升至200%",
      "levelId": "activities/act8mini/level_act8mini_03.json"
    },
    {
      "operation": "VI-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110% 我方干员技力自然回复速度降低至25%",
      "levelId": "activities/act8mini/level_act8mini_04.json"
    },
    {
      "operation": "VI-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至105%，生命值提升至110% 浮士德的特殊狙击伤害提升至120%，冷却时间（含初始冷却）降低至75%",
      "levelId": "activities/act8mini/level_act8mini_05.json"
    },
    {
      "operation": "VI-6突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110%，所有近卫干员和术师干员的攻击力降低至60%",
      "levelId": "activities/act8mini/level_act8mini_06.json"
    },
    {
      "operation": "VI-7突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110%，所有我方单位的再部署时间提升至175%",
      "levelId": "activities/act8mini/level_act8mini_07.json"
    },
    {
      "operation": "DM-EX-1突袭",
      "challenge": "敌方单位生命值和攻击力都提升至115%、防御力提升至105% 敌方远程单位射程提升至150%",
      "levelId": "activities/act9d0/level_act9d0_ex01.json"
    },
    {
      "operation": "DM-EX-2突袭",
      "challenge": "萨卡兹百夫长与爆破攻坚手获得隐匿效果、敌方单位生命值和攻击力都提升至115%",
      "levelId": "activities/act9d0/level_act9d0_ex02.json"
    },
    {
      "operation": "DM-EX-3突袭",
      "challenge": "敌方单位生命值和攻击力都提升至110%、萨卡兹穿刺手的冲锋伤害提升至120%",
      "levelId": "activities/act9d0/level_act9d0_ex03.json"
    },
    {
      "operation": "DM-EX-4突袭",
      "challenge": "敌方单位生命值和防御力都提升至110%、攻击力提升至120%、我方生命值上限降低50%",
      "levelId": "activities/act9d0/level_act9d0_ex04.json"
    },
    {
      "operation": "DM-EX-5突袭",
      "challenge": "禁止部署特种与狙击干员、敌方单位生命值和攻击力都提升至110%",
      "levelId": "activities/act9d0/level_act9d0_ex05.json"
    },
    {
      "operation": "DM-EX-6突袭",
      "challenge": "敌方单位攻击力提升至105%、防御力提升至110%、萨卡兹哨兵组长的移动速度提升至120%",
      "levelId": "activities/act9d0/level_act9d0_ex06.json"
    },
    {
      "operation": "PS-1突袭",
      "challenge": "敌方单位的生命值提升至180%",
      "levelId": "activities/act9mini/level_act9mini_01.json"
    },
    {
      "operation": "PS-2突袭",
      "challenge": "禁止部署近卫干员，敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "activities/act9mini/level_act9mini_02.json"
    },
    {
      "operation": "PS-3突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%，额外出现以下敌人：高阶术师×4（左下，7th、14th、24th、29th），宿主拾荒者×1（左上，10th），宿主流浪者×1（左上，31st）",
      "levelId": "activities/act9mini/level_act9mini_03.json"
    },
    {
      "operation": "PS-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，我方单位的生命值降低至70%",
      "levelId": "activities/act9mini/level_act9mini_04.json"
    },
    {
      "operation": "PS-5突袭",
      "challenge": "{中间两个红门上下和地图最左上角左下角}开局额外出现4名<反装甲步兵组长>，敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "activities/act9mini/level_act9mini_05.json"
    },
    {
      "operation": "PS-6突袭",
      "challenge": "<游击队迫击炮兵组长>和<“锈铜”奥尔默·英格拉>获得隐匿效果，敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "activities/act9mini/level_act9mini_06.json"
    },
    {
      "operation": "6-1突袭",
      "challenge": "可部署单位上限减少2  敌方单位生命值、攻击力都提升至120%，防御力提升至105%",
      "levelId": "obt/main/level_main_06-01.json"
    },
    {
      "operation": "6-2突袭",
      "challenge": "敌方单位生命值、攻击力都提升至110%  防御力提升至105%，攻击速度提升至170%",
      "levelId": "obt/main/level_main_06-02.json"
    },
    {
      "operation": "6-3突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方狂暴宿主士兵攻击力提升至181%",
      "levelId": "obt/main/level_main_06-03.json"
    },
    {
      "operation": "6-4突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方狂暴宿主投掷手的生命值提升至181%",
      "levelId": "obt/main/level_main_06-04.json"
    },
    {
      "operation": "6-8突袭",
      "challenge": "敌方单位生命值提升至120%  移动速度提升至150%",
      "levelId": "obt/main/level_main_06-07.json"
    },
    {
      "operation": "6-9突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方雪怪小队和霜牙对被【冻结】单位的攻击力再提升至166.7%",
      "levelId": "obt/main/level_main_06-08.json"
    },
    {
      "operation": "6-10突袭",
      "challenge": "敌方单位生命值提升至110%  敌方雪怪小队凿冰人的生命值提升至150%，攻击速度提升至300%",
      "levelId": "obt/main/level_main_06-09.json"
    },
    {
      "operation": "6-12突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方源石冰晶的技能冷却减少50%",
      "levelId": "obt/main/level_main_06-11.json"
    },
    {
      "operation": "6-14突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方虚幻无人机的移动速度提升至150%",
      "levelId": "obt/main/level_main_06-12.json"
    },
    {
      "operation": "6-15突袭",
      "challenge": "敌方单位的攻击力提升至110%  敌方虚幻无人机的射程减少至90%,但生命值、防御力都提升至200%",
      "levelId": "obt/main/level_main_06-13.json"
    },
    {
      "operation": "7-2突袭",
      "challenge": "敌方单位攻击力提升至115%  宿主流浪者与宿主士兵组长生命值都提升至200%",
      "levelId": "obt/main/level_main_07-01.json"
    },
    {
      "operation": "7-3突袭",
      "challenge": "敌方单位生命值提升至110%，防御力提升至120%  我方单位防御力减半",
      "levelId": "obt/main/level_main_07-02.json"
    },
    {
      "operation": "7-4突袭",
      "challenge": "敌方单位生命值和攻击力都提升至110%  所有敌人移动速度提升至150%",
      "levelId": "obt/main/level_main_07-03.json"
    },
    {
      "operation": "7-5突袭",
      "challenge": "远程单位部署费用提升至2倍  敌方单位生命值提升至105%、攻击力提升至115%",
      "levelId": "obt/main/level_main_07-04.json"
    },
    {
      "operation": "7-6突袭",
      "challenge": "敌方单位生命值提升至170%、防御力提升至110%",
      "levelId": "obt/main/level_main_07-05.json"
    },
    {
      "operation": "7-8突袭",
      "challenge": "我方单位阻挡数-1 敌方单位数值不变",
      "levelId": "obt/main/level_main_07-06.json"
    },
    {
      "operation": "7-9突袭",
      "challenge": "敌方单位生命值和攻击力都提升至110%  游击队传令兵生命值提升至150%",
      "levelId": "obt/main/level_main_07-07.json"
    },
    {
      "operation": "7-10突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  雇佣军萨卡兹战士攻击速度提升至200%",
      "levelId": "obt/main/level_main_07-08.json"
    },
    {
      "operation": "7-11突袭",
      "challenge": "敌人移动速度-60%  敌方单位生命值和攻击力都提升至180%",
      "levelId": "obt/main/level_main_07-09.json"
    },
    {
      "operation": "7-12突袭",
      "challenge": "敌方单位生命值提升至120%  攻击力提升至110%、防御力提升至150% ",
      "levelId": "obt/main/level_main_07-10.json"
    },
    {
      "operation": "7-13突袭",
      "challenge": "禁止部署狙击与近卫干员  敌方单位生命值和攻击力都提升至110%",
      "levelId": "obt/main/level_main_07-11.json"
    },
    {
      "operation": "7-14突袭",
      "challenge": "敌方单位攻击力提升至150%",
      "levelId": "obt/main/level_main_07-12.json"
    },
    {
      "operation": "7-15突袭",
      "challenge": "敌方单位攻击力提升至120%  游击队盾卫生命值减少至33%，但防御力提升至1950，法术抗性提升至90",
      "levelId": "obt/main/level_main_07-13.json"
    },
    {
      "operation": "7-16突袭",
      "challenge": "最多可携带干员数降至7  敌方单位生命值提升至120%、攻击力提升至110%",
      "levelId": "obt/main/level_main_07-14.json"
    },
    {
      "operation": "7-17突袭",
      "challenge": "禁止部署近卫与术师干员  敌方单位生命值提升至105%、攻击力提升至110%",
      "levelId": "obt/main/level_main_07-15.json"
    },
    {
      "operation": "7-18突袭",
      "challenge": "战场中的6个位置无法部署我方单位(三列高台上下六格)  敌方单位生命值提升至120%、攻击力提升至110%",
      "levelId": "obt/main/level_main_07-16.json"
    },
    {
      "operation": "R8-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%、战场中(2,6)、(2,9)、(5,9)3个位置{右下角三个高台}无法部署我方单位",
      "levelId": "obt/main/level_main_08-01.json"
    },
    {
      "operation": "R8-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  敌方单位的攻击速度提升至200%",
      "levelId": "obt/main/level_main_08-04.json"
    },
    {
      "operation": "R8-5突袭",
      "challenge": "敌方单位的生命值提升至110%  乌萨斯突击者的攻击力、防御力提升至150%  其他敌方单位的攻击力、防御力提升至110%",
      "levelId": "obt/main/level_main_08-05.json"
    },
    {
      "operation": "R8-6突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  乌萨斯着铠术师的攻击范围提升至150%",
      "levelId": "obt/main/level_main_08-06.json"
    },
    {
      "operation": "R8-8突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  我方单位的攻击力降低至65%",
      "levelId": "obt/main/level_main_08-08.json"
    },
    {
      "operation": "M8-6突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  狂暴宿主士兵、狂暴宿主组长、狂暴宿主掷骨手的攻击速度提升至130%",
      "levelId": "obt/main/level_main_08-09.json"
    },
    {
      "operation": "R8-9突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  路障的生命值提升至200%",
      "levelId": "obt/main/level_main_08-10.json"
    },
    {
      "operation": "M8-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  萨卡兹宿主百夫长的吸血效果提升至200%",
      "levelId": "obt/main/level_main_08-12.json"
    },
    {
      "operation": "R8-11突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  帝国前锋精锐、帝国前锋百战精锐的攻击力、生命值额外提升至140%",
      "levelId": "obt/main/level_main_08-13.json"
    },
    {
      "operation": "M8-8突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  梅菲斯特，“歌者”的毒性粉尘伤害提升至200%",
      "levelId": "obt/main/level_main_08-14.json"
    },
    {
      "operation": "JT8-2突袭",
      "challenge": "塔露拉立即进入狂暴状态  敌方单位的攻击力、生命值提升至110%",
      "levelId": "obt/main/level_main_08-16.json"
    },
    {
      "operation": "JT8-3突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  能量聚合体造成的法术伤害提升400",
      "levelId": "obt/main/level_main_08-17.json"
    },
    {
      "operation": "15-3突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-02.json"
    },
    {
      "operation": "15-4突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-03.json"
    },
    {
      "operation": "15-5突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-04.json"
    },
    {
      "operation": "15-6突袭",
      "challenge": "内测版自助出餐终端召唤技能冷却时间减少",
      "levelId": "obt/main/level_main_15-05.json"
    },
    {
      "operation": "15-7突袭",
      "challenge": "内测版自助出餐终端召唤技能冷却时间减少",
      "levelId": "obt/main/level_main_15-06.json"
    },
    {
      "operation": "15-8突袭",
      "challenge": "稳定态萨卡兹术师结晶的防御力大幅提升",
      "levelId": "obt/main/level_main_15-07.json"
    },
    {
      "operation": "15-9突袭",
      "challenge": "战场中有4个位置无法部署我方单位",
      "levelId": "obt/main/level_main_15-08.json"
    },
    {
      "operation": "15-10突袭",
      "challenge": "敌人的防御力大幅提升",
      "levelId": "obt/main/level_main_15-09.json"
    },
    {
      "operation": "15-11突袭",
      "challenge": "部署费用的回复速度降低",
      "levelId": "obt/main/level_main_15-10.json"
    },
    {
      "operation": "15-12突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-11.json"
    },
    {
      "operation": "15-13突袭",
      "challenge": "我方单位的攻击力降低",
      "levelId": "obt/main/level_main_15-12.json"
    },
    {
      "operation": "15-14突袭",
      "challenge": "部分地块会长出源石晶簇造成范围伤害",
      "levelId": "obt/main/level_main_15-13.json"
    },
    {
      "operation": "15-15突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-14.json"
    },
    {
      "operation": "15-17突袭",
      "challenge": "敌人的攻击力大幅提升",
      "levelId": "obt/main/level_main_15-15.json"
    },
    {
      "operation": "15-18突袭",
      "challenge": "我方单位的防御力降低",
      "levelId": "obt/main/level_main_15-16.json"
    },
    {
      "operation": "15-20突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-18.json"
    }
  ],
  //敌人重量提升
  "enemy_weight_add": [
    {
      "operation": "BW-1突袭",
      "challenge": "敌人重量大幅度提升",
      "levelId": "activities/act13mini/level_act13mini_01.json"
    },
    {
      "operation": "BI-EX-4突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，冰原术师队长的生命值提升至180%，重量提升2个等级，获得冻结免疫",
      "levelId": "activities/act14side/level_act14side_ex04.json"
    },
    {
      "operation": "BH-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  弑君者的重量提升4个等级  碎骨的生命值额外提升至200%",
      "levelId": "activities/act15d5/level_act15d5_04.json"
    },
    {
      "operation": "CW-10",
      "levelId": "activities/act25side/level_act25side_10.json"
    },
    {
      "operation": "CW-EX-8突袭",
      "challenge": "重装与近卫干员部署费用提升至3倍",
      "levelId": "activities/act25side/level_act25side_ex08.json"
    },
    {
      "operation": "CW-S-4突袭",
      "challenge": "星环周围8格我方单位攻速大幅减少，每个星环给克丽斯腾提供的减伤增加",
      "levelId": "activities/act25side/level_act25side_sub-1-4.json"
    },
    {
      "operation": "PV-S-1突袭",
      "challenge": "所有<“美食速递”>替换为<“醉后狂欢”>，且我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_sub-1-1.json"
    }
  ],
  //修改sp上限
  "char_skill_cd_mul": [
    {
      "operation": "TB-9",
      "levelId": "activities/act10mini/level_act10mini_09.json"
    },
    {
      "operation": "AW-6突袭",
      "challenge": "激活动力装甲所需的实验产物减少",
      "levelId": "activities/act12mini/level_act12mini_06.json"
    },
    {
      "operation": "DH-EX-3突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，“风筝”的技力消耗降低至75%，场上坐标为(1,6)(3,9)(4,9)的3个位置{正下方河道入口和最右侧俩个高台}无法部署",
      "levelId": "activities/act12side/level_act12side_ex03.json"
    },
    {
      "operation": "MN-EX-2突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110% 敌方源石冰晶的技能冷却减少50%",
      "levelId": "activities/act13d5/level_act13d5_ex02.json"
    },
    {
      "operation": "CV-EX-2突袭",
      "challenge": "<废热喷口>释放间隔大幅增加",
      "levelId": "activities/act28side/level_act28side_ex02.json"
    },
    {
      "operation": "BP-TR-1",
      "levelId": "activities/act34side/level_act34side_tr01.json"
    },
    {
      "operation": "DT-1",
      "levelId": "activities/act36side/level_act36side_01.json"
    },
    {
      "operation": "DT-2",
      "levelId": "activities/act36side/level_act36side_02.json"
    },
    {
      "operation": "DT-3",
      "levelId": "activities/act36side/level_act36side_03.json"
    },
    {
      "operation": "DT-4",
      "levelId": "activities/act36side/level_act36side_04.json"
    },
    {
      "operation": "DT-5",
      "levelId": "activities/act36side/level_act36side_05.json"
    },
    {
      "operation": "DT-6",
      "levelId": "activities/act36side/level_act36side_06.json"
    },
    {
      "operation": "DT-7",
      "levelId": "activities/act36side/level_act36side_07.json"
    },
    {
      "operation": "DT-8",
      "levelId": "activities/act36side/level_act36side_08.json"
    },
    {
      "operation": "DT-EX-1突袭",
      "challenge": "饿肚子流失更多生命，且敌人生命值大幅提升",
      "levelId": "activities/act36side/level_act36side_ex01.json"
    },
    {
      "operation": "DT-EX-2突袭",
      "challenge": "出现额外的<暴走食人花>",
      "levelId": "activities/act36side/level_act36side_ex02.json"
    },
    {
      "operation": "DT-EX-3突袭",
      "challenge": "<简饲源石虫>与<精饲源石虫>隐匿",
      "levelId": "activities/act36side/level_act36side_ex03.json"
    },
    {
      "operation": "DT-EX-4突袭",
      "challenge": "饿肚子流失更多生命",
      "levelId": "activities/act36side/level_act36side_ex04.json"
    },
    {
      "operation": "DT-EX-5突袭",
      "challenge": "初始场上的<硕果虫>不再出现",
      "levelId": "activities/act36side/level_act36side_ex05.json"
    },
    {
      "operation": "DT-EX-6突袭",
      "challenge": "敌人的生命值和攻击力大幅提升，开饭需要的食材大幅提升",
      "levelId": "activities/act36side/level_act36side_ex06.json"
    },
    {
      "operation": "DT-EX-6突袭",
      "challenge": "敌人的生命值和攻击力大幅提升，开饭需要的食材大幅提升",
      "levelId": "activities/act36side/level_act36side_ex06.json"
    },
    {
      "operation": "DT-EX-7突袭",
      "challenge": "出现道路障碍物",
      "levelId": "activities/act36side/level_act36side_ex07.json"
    },
    {
      "operation": "DT-EX-8突袭",
      "challenge": "<“三头犬”>狂暴状态下攻击力、移动速度大幅提升",
      "levelId": "activities/act36side/level_act36side_ex08.json"
    },
    {
      "operation": "DT-TR-1",
      "levelId": "activities/act36side/level_act36side_tr01.json"
    },
    {
      "operation": "OR-EX-8突袭",
      "challenge": "<火灶>所需技力增加",
      "levelId": "activities/act40side/level_act40side_ex08.json"
    },
    {
      "operation": "CB-EX8突袭",
      "challenge": "指挥终端的SP消耗量提高至180  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "activities/act5d0/level_act5d0_ex08.json"
    },
    {
      "operation": "H14-3",
      "levelId": "obt/hard/level_hard_14-03.json"
    },
    {
      "operation": "6-12突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方源石冰晶的技能冷却减少50%",
      "levelId": "obt/main/level_main_06-11.json"
    },
    {
      "operation": "14-22",
      "levelId": "obt/main/level_main_14-20.json"
    }
  ],
  //敌人天赋修改
  "enemy_talent_blackb_mul": [
    {
      "operation": "DH-EX-5突袭",
      "challenge": "敌方单位的攻击力提升至120%，防御力提升至120%，生命值提升至120%，无人爆破重艇的爆炸伤害提升至200%",
      "levelId": "activities/act12side/level_act12side_ex05.json"
    },
    {
      "operation": "DH-S-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至130%。无人爆破重艇的生命流失速度数值降低2%，爆炸伤害提升至150%（跟普通模式的属性提升不累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-2.json"
    },
    {
      "operation": "DH-S-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至130%。无人爆破重艇的生命流失速度数值降低2%，爆炸伤害提升至150%（跟普通模式的属性提升不累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-2.json"
    },
    {
      "operation": "DH-S-3突袭",
      "challenge": "不可使用特制水上平台。敌方单位的攻击力、防御力和生命值都提升至110%。",
      "levelId": "activities/act12side/level_act12side_sub-1-3.json"
    },
    {
      "operation": "DH-S-4突袭",
      "challenge": "敌方单位的攻击力和生命值额外提升至110%。水手长的生命值额外再提升至130%，水蚀状态下每秒额外受到的真实伤害降至0。（跟普通模式的属性提升累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-4.json"
    },
    {
      "operation": "DH-S-4突袭",
      "challenge": "敌方单位的攻击力和生命值额外提升至110%。水手长的生命值额外再提升至130%，水蚀状态下每秒额外受到的真实伤害降至0。（跟普通模式的属性提升累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-4.json"
    },
    {
      "operation": "DH-S-4突袭",
      "challenge": "敌方单位的攻击力和生命值额外提升至110%。水手长的生命值额外再提升至130%，水蚀状态下每秒额外受到的真实伤害降至0。（跟普通模式的属性提升累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-4.json"
    },
    {
      "operation": "NL-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、提升至110%，无胄盟刺客组长攻击力累积速度增加至200%",
      "levelId": "activities/act13side/level_act13side_ex02.json"
    },
    {
      "operation": "NL-S-5突袭",
      "challenge": "敌方单位的生命值提升至105%，莫妮克、罗伊、无胄盟第三小队组长、无胄盟清扫小队组长的攻击速度提升至130%",
      "levelId": "activities/act13side/level_act13side_sub-1-5.json"
    },
    {
      "operation": "DC-6突袭",
      "challenge": "<萨卡兹子裔补给车>对重生造物的攻击力加成效果提升",
      "levelId": "activities/act14mini/level_act14mini_06.json"
    },
    {
      "operation": "DC-8突袭",
      "challenge": "<“皇帝的利刃”>释放【国度】所需损失生命值降低",
      "levelId": "activities/act14mini/level_act14mini_08.json"
    },
    {
      "operation": "BI-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，冰原御法者死亡时的范围爆炸伤害提升至250%",
      "levelId": "activities/act14side/level_act14side_ex02.json"
    },
    {
      "operation": "TG-6突袭",
      "challenge": "“得意”死亡后爆炸伤害大幅提升",
      "levelId": "activities/act16mini/level_act16mini_06.json"
    },
    {
      "operation": "TG-6突袭",
      "challenge": "“得意”死亡后爆炸伤害大幅提升",
      "levelId": "activities/act16mini/level_act16mini_06.json"
    },
    {
      "operation": "GA-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，寻路者精锐狙击手拥有弹药时造成的伤害额外提升至150%",
      "levelId": "activities/act16side/level_act16side_ex01.json"
    },
    {
      "operation": "KR-3突袭",
      "challenge": "家族士兵和叙拉古平民死亡时积累更多的血债账款",
      "levelId": "activities/act17mini/level_act17mini_03.json"
    },
    {
      "operation": "KR-4突袭",
      "challenge": "码头水手长在“水蚀”下不再额外流失生命",
      "levelId": "activities/act17mini/level_act17mini_04.json"
    },
    {
      "operation": "KR-7突袭",
      "challenge": "萨卡兹子裔改装补给车天赋效果变为2倍",
      "levelId": "activities/act17mini/level_act17mini_07.json"
    },
    {
      "operation": "SN-S-1-B",
      "levelId": "activities/act17side/level_act17side_sub-1-1-b.json"
    },
    {
      "operation": "WD-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至120%，生命值提升至115%，破片、破片U型、铁砧、铁砧B型的自动撤退时间增加至300%。",
      "levelId": "activities/act18d0/level_act18d0_ex04.json"
    },
    {
      "operation": "IC-EX-7突袭",
      "challenge": "烈酒级醒酒助手的能力持续时间大幅提升",
      "levelId": "activities/act20side/level_act20side_ex07.json"
    },
    {
      "operation": "IC-S-1突袭",
      "challenge": "酒类协会会员的能力持续时间大幅提升，且出现额外的敌人",
      "levelId": "activities/act20side/level_act20side_sub-1-1.json"
    },
    {
      "operation": "IC-S-4突袭",
      "challenge": "“物欲拮抗者”进入第二形态时受到的晕眩时间大幅降低",
      "levelId": "activities/act20side/level_act20side_sub-1-4.json"
    },
    {
      "operation": "IC-S-4突袭",
      "challenge": "“物欲拮抗者”进入第二形态时受到的晕眩时间大幅降低",
      "levelId": "activities/act20side/level_act20side_sub-1-4.json"
    },
    {
      "operation": "IS-S-2突袭",
      "challenge": "家族铁腕角头光环内被击倒的敌人使“血债帐款”额外增加",
      "levelId": "activities/act21side/level_act21side_sub-1-2.json"
    },
    {
      "operation": "IS-S-2突袭",
      "challenge": "家族铁腕角头光环内被击倒的敌人使“血债帐款”额外增加",
      "levelId": "activities/act21side/level_act21side_sub-1-2.json"
    },
    {
      "operation": "IS-S-5突袭",
      "challenge": "“狼之主”进入第二形态后，攻击力大幅提升",
      "levelId": "activities/act21side/level_act21side_sub-1-5.json"
    },
    {
      "operation": "CF-EX-8突袭",
      "challenge": "大地的火光会令天空恐惧。\n附加条件：火龙的生命值与攻击力提升，作战道具的再部署时间大幅增加",
      "levelId": "activities/act24side/level_act24side_ex08.json"
    },
    {
      "operation": "ZT-S-3突袭",
      "challenge": "巫王乐团大提琴家生命值大幅提升，且在沉郁变奏下，护盾反弹的伤害大幅度提升",
      "levelId": "activities/act29side/level_act29side_sub-1-3.json"
    },
    {
      "operation": "HS-EX-7突袭",
      "challenge": "除秽与厌肮被击倒时造成的病害污染大幅提升",
      "levelId": "activities/act31side/level_act31side_ex07.json"
    },
    {
      "operation": "HS-S-4突袭",
      "challenge": "“祟”释放如梭所需的病害程度阈值大幅降低",
      "levelId": "activities/act31side/level_act31side_sub-1-4.json"
    },
    {
      "operation": "DT-EX-8突袭",
      "challenge": "<“三头犬”>狂暴状态下攻击力、移动速度大幅提升",
      "levelId": "activities/act36side/level_act36side_ex08.json"
    },
    {
      "operation": "AF-6突袭",
      "challenge": "敌方单位的生命值提升至110%，阻挡数减少的持续时间提升至2倍",
      "levelId": "activities/act6d5/level_act6d5_06.json"
    },
    {
      "operation": "DM-EX-3突袭",
      "challenge": "敌方单位生命值和攻击力都提升至110%、萨卡兹穿刺手的冲锋伤害提升至120%",
      "levelId": "activities/act9d0/level_act9d0_ex03.json"
    },
    {
      "operation": "H11-1",
      "levelId": "obt/hard/level_hard_11-01.json"
    },
    {
      "operation": "H11-2",
      "levelId": "obt/hard/level_hard_11-02.json"
    },
    {
      "operation": "H11-3",
      "levelId": "obt/hard/level_hard_11-03.json"
    },
    {
      "operation": "H11-4",
      "levelId": "obt/hard/level_hard_11-04.json"
    },
    {
      "operation": "H11-4",
      "levelId": "obt/hard/level_hard_11-04.json"
    },
    {
      "operation": "6-5突袭",
      "challenge": "敌方狂暴单位不再自然损失生命 敌方单位数值不变",
      "levelId": "obt/main/level_main_06-05.json"
    },
    {
      "operation": "M8-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  萨卡兹宿主百夫长的吸血效果提升至200%",
      "levelId": "obt/main/level_main_08-12.json"
    },
    {
      "operation": "JT8-2突袭",
      "challenge": "塔露拉立即进入狂暴状态  敌方单位的攻击力、生命值提升至110%",
      "levelId": "obt/main/level_main_08-16.json"
    }
  ],
  //敌人攻击范围修改
  "enemy_attackradius_mul": [
    {
      "operation": "TW-EX-5突袭",
      "challenge": "敌方单位的防御力提升至120%，生命值提升至120%，莱塔尼亚吟唱者的攻击范围提升至120%，争夺“留声机”效果提升至200%",
      "levelId": "activities/act11d0/level_act11d0_ex05.json"
    },
    {
      "operation": "DH-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，控潮术师和领潮员攻击范围扩大至130%。",
      "levelId": "activities/act12side/level_act12side_ex01.json"
    },
    {
      "operation": "MN-EX-7突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110% 威龙的攻击范围提升至150%",
      "levelId": "activities/act13d5/level_act13d5_ex07.json"
    },
    {
      "operation": "BH-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  酸液源石虫的射程提升至150%",
      "levelId": "activities/act15d5/level_act15d5_01.json"
    },
    {
      "operation": "SN-S-3-A",
      "levelId": "activities/act17side/level_act17side_sub-1-3-a.json"
    },
    {
      "operation": "WD-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，破片U型的攻击力额外提升至150%，攻击范围提升至150%",
      "levelId": "activities/act18d0/level_act18d0_ex07.json"
    },
    {
      "operation": "SV-EX-7突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，首言者的生命值额外提升至150%，攻击范围提升至150%",
      "levelId": "activities/act18d3/level_act18d3_ex07.json"
    },
    {
      "operation": "IS-EX-5突袭",
      "challenge": "家族精英弩手，家族精英术师攻击范围大幅提升",
      "levelId": "activities/act21side/level_act21side_ex05.json"
    },
    {
      "operation": "IS-EX-5突袭",
      "challenge": "家族精英弩手，家族精英术师攻击范围大幅提升",
      "levelId": "activities/act21side/level_act21side_ex05.json"
    },
    {
      "operation": "IS-S-3突袭",
      "challenge": "家族暗影灭迹者攻击范围大幅增加",
      "levelId": "activities/act21side/level_act21side_sub-1-3.json"
    },
    {
      "operation": "GO-EX-8突袭",
      "challenge": "阿利斯泰尔，帝国余晖的攻击范围扩大至全场",
      "levelId": "activities/act37side/level_act37side_ex08.json"
    },
    {
      "operation": "CB-EX4突袭",
      "challenge": "敌方单位生命值提升至120%，攻击力和防御力都提升至110%  神射手生命值提升至166.7%，攻击范围提升至110%  (注:神射手同时享受敌方单位BUFF，关系为乘算)",
      "levelId": "activities/act5d0/level_act5d0_ex04.json"
    },
    {
      "operation": "SA-2突袭",
      "challenge": "所有敌人生命值、防御力都提升至110%，所有远程敌人的攻击范围扩大至150%",
      "levelId": "activities/act7d5/level_act7d5_02.json"
    },
    {
      "operation": "PL-1突袭",
      "challenge": "敌方单位的生命值，攻击力和防御力都提升至110%。隐形弩手的攻击力额外提升至140%，攻击范围提升至120%。",
      "levelId": "activities/act7mini/level_act7mini_01.json"
    },
    {
      "operation": "DM-EX-1突袭",
      "challenge": "敌方单位生命值和攻击力都提升至115%、防御力提升至105% 敌方远程单位射程提升至150%",
      "levelId": "activities/act9d0/level_act9d0_ex01.json"
    },
    {
      "operation": "R8-6突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  乌萨斯着铠术师的攻击范围提升至150%",
      "levelId": "obt/main/level_main_08-06.json"
    }
  ],
  //我方单位攻防血修改
  "char_attribute_mul": [
    {
      "operation": "TB-1突袭",
      "challenge": "额外出现4个泥岩巨像",
      "levelId": "activities/act10mini/level_act10mini_01.json"
    },
    {
      "operation": "TB-3突袭",
      "challenge": "所有我方单位的攻击力降低至60%",
      "levelId": "activities/act10mini/level_act10mini_03.json"
    },
    {
      "operation": "TW-EX-4突袭",
      "challenge": "我方单位攻击力降低至60%",
      "levelId": "activities/act11d0/level_act11d0_ex04.json"
    },
    {
      "operation": "TW-EX-7突袭",
      "challenge": "敌方单位的攻击力提升至120%，生命值提升至120%，我方干员防御力降低至30%",
      "levelId": "activities/act11d0/level_act11d0_ex07.json"
    },
    {
      "operation": "TC-6突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，我方单位的最大生命值降低至65%",
      "levelId": "activities/act11mini/level_act11mini_06.json"
    },
    {
      "operation": "RI-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至105% 我方最大生命值下降至50%",
      "levelId": "activities/act12d0/level_act12d0_ex03.json"
    },
    {
      "operation": "AW-7突袭",
      "challenge": "我方单位的生命值降低",
      "levelId": "activities/act12mini/level_act12mini_07.json"
    },
    {
      "operation": "DH-EX-8突袭",
      "challenge": "我方单位的生命值上限减半，敌方单位的防御力提升至110%，生命值提升至115%",
      "levelId": "activities/act12side/level_act12side_ex08.json"
    },
    {
      "operation": "NL-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，我方单位的生命值降低至70%",
      "levelId": "activities/act13side/level_act13side_ex01.json"
    },
    {
      "operation": "MB-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%  我方单位的最大生命值降低至30%",
      "levelId": "activities/act15d0/level_act15d0_ex06.json"
    },
    {
      "operation": "MB-EX-7突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  我方单位的防御力降低至60%",
      "levelId": "activities/act15d0/level_act15d0_ex07.json"
    },
    {
      "operation": "IW-EX-4突袭",
      "challenge": "所有我方单位的最大生命值降低至70%",
      "levelId": "activities/act15side/level_act15side_ex04.json"
    },
    {
      "operation": "WR-EX-1突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，我方远程干员的生命值降低至60%",
      "levelId": "activities/act16d5/level_act16d5_ex01.json"
    },
    {
      "operation": "WR-EX-6突袭",
      "challenge": "敌方单位的生命值提升至110%，我方近战单位的攻击速度降低至50%，防御力提升至150%，在(3,7)(5,5)(3,3)放置障碍物",
      "levelId": "activities/act16d5/level_act16d5_ex06.json"
    },
    {
      "operation": "TG-4突袭",
      "challenge": "我方所有单位的防御力减半",
      "levelId": "activities/act16mini/level_act16mini_04.json"
    },
    {
      "operation": "TG-5突袭",
      "challenge": "我方所有单位的攻击力降低",
      "levelId": "activities/act16mini/level_act16mini_05.json"
    },
    {
      "operation": "GA-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至115%，<“冰淇淋机”>的生命值提升至400%",
      "levelId": "activities/act16side/level_act16side_ex04.json"
    },
    {
      "operation": "OD-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，<土石结构>的生命值降低至80%",
      "levelId": "activities/act17d0/level_act17d0_ex02.json"
    },
    {
      "operation": "OD-EX-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至110%，我方单位的攻击力降低至60%",
      "levelId": "activities/act17d0/level_act17d0_ex04.json"
    },
    {
      "operation": "KR-1突袭",
      "challenge": "破阵者替换为破阵者组长",
      "levelId": "activities/act17mini/level_act17mini_01.json"
    },
    {
      "operation": "KR-8突袭",
      "challenge": "“风筝”的生命值和攻击力大幅增加",
      "levelId": "activities/act17mini/level_act17mini_08.json"
    },
    {
      "operation": "SV-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，我方单位的最大生命值降低至70%。",
      "levelId": "activities/act18d3/level_act18d3_ex03.json"
    },
    {
      "operation": "LE-EX-2突袭",
      "challenge": "我方单位的攻击力降低",
      "levelId": "activities/act18side/level_act18side_ex02.json"
    },
    {
      "operation": "DV-EX-1突袭",
      "challenge": "我方单位的生命值上限减少",
      "levelId": "activities/act19side/level_act19side_ex01.json"
    },
    {
      "operation": "DV-EX-2突袭",
      "challenge": "出现额外<R系列动力装甲>",
      "levelId": "activities/act19side/level_act19side_ex02.json"
    },
    {
      "operation": "DV-EX-3突袭",
      "challenge": "<R系列动力装甲>位置变化",
      "levelId": "activities/act19side/level_act19side_ex03.json"
    },
    {
      "operation": "DV-EX-5突袭",
      "challenge": "敌方单位生命值大幅提升",
      "levelId": "activities/act19side/level_act19side_ex05.json"
    },
    {
      "operation": "DV-EX-6突袭",
      "challenge": "我方单位的防御力大幅下降",
      "levelId": "activities/act19side/level_act19side_ex06.json"
    },
    {
      "operation": "DV-EX-6突袭",
      "challenge": "我方单位的防御力大幅下降",
      "levelId": "activities/act19side/level_act19side_ex06.json"
    },
    {
      "operation": "DV-EX-7突袭",
      "challenge": "多萝西获得隐匿",
      "levelId": "activities/act19side/level_act19side_ex07.json"
    },
    {
      "operation": "DV-EX-8突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act19side/level_act19side_ex08.json"
    },
    {
      "operation": "DV-S-1",
      "levelId": "activities/act19side/level_act19side_sub-1-1.json"
    },
    {
      "operation": "DV-S-2",
      "levelId": "activities/act19side/level_act19side_sub-1-2.json"
    },
    {
      "operation": "VEC-07",
      "levelId": "activities/act1break/level_act1break_07.json"
    },
    {
      "operation": "CF-TR-1",
      "levelId": "activities/act24side/level_act24side_tr01.json"
    },
    {
      "operation": "CF-TR-1",
      "levelId": "activities/act24side/level_act24side_tr01.json"
    },
    {
      "operation": "CW-EX-7突袭",
      "challenge": "我方单位的攻击力与最大生命值大幅减少",
      "levelId": "activities/act25side/level_act25side_ex07.json"
    },
    {
      "operation": "SL-S-2突袭",
      "challenge": "<水汽汽水瓶>的生命值大幅提升",
      "levelId": "activities/act27side/level_act27side_sub-1-2.json"
    },
    {
      "operation": "DT-EX-7突袭",
      "challenge": "出现道路障碍物",
      "levelId": "activities/act36side/level_act36side_ex07.json"
    },
    {
      "operation": "DT-EX-7突袭",
      "challenge": "出现道路障碍物",
      "levelId": "activities/act36side/level_act36side_ex07.json"
    },
    {
      "operation": "PV-EX-1突袭",
      "challenge": "<烟花发射器>生命值大幅度降低",
      "levelId": "activities/act38side/level_act38side_ex01.json"
    },
    {
      "operation": "PV-SP-1",
      "levelId": "activities/act38side/level_act38side_sp01.json"
    },
    {
      "operation": "PV-SP-2",
      "levelId": "activities/act38side/level_act38side_sp02.json"
    },
    {
      "operation": "PV-SP-3",
      "levelId": "activities/act38side/level_act38side_sp03.json"
    },
    {
      "operation": "EP-EX-2突袭",
      "challenge": "盐坨子炮攻击力大幅提升",
      "levelId": "activities/act39side/level_act39side_ex02.json"
    },
    {
      "operation": "VI-6突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110%，所有近卫干员和术师干员的攻击力降低至60%",
      "levelId": "activities/act8mini/level_act8mini_06.json"
    },
    {
      "operation": "DM-EX-4突袭",
      "challenge": "敌方单位生命值和防御力都提升至110%、攻击力提升至120%、我方生命值上限降低50%",
      "levelId": "activities/act9d0/level_act9d0_ex04.json"
    },
    {
      "operation": "PS-4突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，我方单位的生命值降低至70%",
      "levelId": "activities/act9mini/level_act9mini_04.json"
    },
    {
      "operation": "H15-1",
      "levelId": "obt/hard/level_hard_15-01.json"
    },
    {
      "operation": "H15-2",
      "levelId": "obt/hard/level_hard_15-02.json"
    },
    {
      "operation": "H15-4",
      "levelId": "obt/hard/level_hard_15-04.json"
    },
    {
      "operation": "7-3突袭",
      "challenge": "敌方单位生命值提升至110%，防御力提升至120%  我方单位防御力减半",
      "levelId": "obt/main/level_main_07-02.json"
    },
    {
      "operation": "R8-8突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  我方单位的攻击力降低至65%",
      "levelId": "obt/main/level_main_08-08.json"
    },
    {
      "operation": "R8-9突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  路障的生命值提升至200%",
      "levelId": "obt/main/level_main_08-10.json"
    },
    {
      "operation": "12-16",
      "levelId": "obt/main/level_main_12-14.json"
    },
    {
      "operation": "15-3突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-02.json"
    },
    {
      "operation": "15-5突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-04.json"
    },
    {
      "operation": "15-6突袭",
      "challenge": "内测版自助出餐终端召唤技能冷却时间减少",
      "levelId": "obt/main/level_main_15-05.json"
    },
    {
      "operation": "15-7突袭",
      "challenge": "内测版自助出餐终端召唤技能冷却时间减少",
      "levelId": "obt/main/level_main_15-06.json"
    },
    {
      "operation": "15-8突袭",
      "challenge": "稳定态萨卡兹术师结晶的防御力大幅提升",
      "levelId": "obt/main/level_main_15-07.json"
    },
    {
      "operation": "15-8突袭",
      "challenge": "稳定态萨卡兹术师结晶的防御力大幅提升",
      "levelId": "obt/main/level_main_15-07.json"
    },
    {
      "operation": "15-11突袭",
      "challenge": "部署费用的回复速度降低",
      "levelId": "obt/main/level_main_15-10.json"
    },
    {
      "operation": "15-12突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-11.json"
    },
    {
      "operation": "15-13突袭",
      "challenge": "我方单位的攻击力降低",
      "levelId": "obt/main/level_main_15-12.json"
    },
    {
      "operation": "15-13突袭",
      "challenge": "我方单位的攻击力降低",
      "levelId": "obt/main/level_main_15-12.json"
    },
    {
      "operation": "15-14突袭",
      "challenge": "部分地块会长出源石晶簇造成范围伤害",
      "levelId": "obt/main/level_main_15-13.json"
    },
    {
      "operation": "15-18突袭",
      "challenge": "我方单位的防御力降低",
      "levelId": "obt/main/level_main_15-16.json"
    },
    {
      "operation": "15-20突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-18.json"
    },
    {
      "operation": "S9-2",
      "levelId": "obt/main/level_sub_09-1-2.json"
    },
    {
      "operation": "S9-3",
      "levelId": "obt/main/level_sub_09-1-3.json"
    },
    {
      "operation": "S9-4",
      "levelId": "obt/main/level_sub_09-1-4.json"
    }
  ],
  //敌人额外能力
  "enemy_dynamic_ability_new": [
    {
      "operation": "TB-5突袭",
      "challenge": "萨卡兹魔剑士获得隐匿，敌方单位的攻击力、防御力和生命值都提升至110%",
      "levelId": "activities/act10mini/level_act10mini_05.json"
    },
    {
      "operation": "RI-EX-1突袭",
      "challenge": "提亚卡乌好战者获得<隐匿>效果  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex01.json"
    },
    {
      "operation": "RI-EX-6突袭",
      "challenge": "可部署的<罗德岛临时雇员>人数减少6,，且敌人的特殊能力不会失效  敌方单位的生命值提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex06.json"
    },
    {
      "operation": "RI-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110% 无法部署的7个位置(Y,X)如下 (2,3)、(3,3)、(4,4)、(4,7)、(5,7)、(6,7)、(6,6)",
      "levelId": "activities/act12d0/level_act12d0_ex08.json"
    },
    {
      "operation": "FA-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，术师组长获得隐匿效果",
      "levelId": "activities/act13d0/level_act13d0_02.json"
    },
    {
      "operation": "BW-4突袭",
      "challenge": "欺凌者获得隐匿",
      "levelId": "activities/act13mini/level_act13mini_04.json"
    },
    {
      "operation": "BW-7突袭",
      "challenge": "冰爆源石虫的特殊能力不会失效",
      "levelId": "activities/act13mini/level_act13mini_07.json"
    },
    {
      "operation": "DC-4突袭",
      "challenge": "<射手>获得隐匿效果",
      "levelId": "activities/act14mini/level_act14mini_04.json"
    },
    {
      "operation": "BI-EX-4突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，冰原术师队长的生命值提升至180%，重量提升2个等级，获得冻结免疫",
      "levelId": "activities/act14side/level_act14side_ex04.json"
    },
    {
      "operation": "MB-EX-2突袭",
      "challenge": "神射手囚犯获得<隐匿>效果  敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act15d0/level_act15d0_ex02.json"
    },
    {
      "operation": "BH-5突袭",
      "challenge": "特战术师获得隐匿效果  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d5/level_act15d5_05.json"
    },
    {
      "operation": "TG-8突袭",
      "challenge": "“越长尘”出现得更多，并获得隐匿",
      "levelId": "activities/act16mini/level_act16mini_08.json"
    },
    {
      "operation": "OD-EX-6突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，<源石畸变体α>获得隐匿效果",
      "levelId": "activities/act17d0/level_act17d0_ex06.json"
    },
    {
      "operation": "SN-EX-7突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，富营养的喷溅者获得隐匿",
      "levelId": "activities/act17side/level_act17side_ex07.json"
    },
    {
      "operation": "SN-S-1-A",
      "levelId": "activities/act17side/level_act17side_sub-1-1-a.json"
    },
    {
      "operation": "SE-7突袭",
      "challenge": "所有萨卡兹骸骨卫士获得隐匿效果",
      "levelId": "activities/act18mini/level_act18mini_07.json"
    },
    {
      "operation": "DV-EX-7突袭",
      "challenge": "多萝西获得隐匿",
      "levelId": "activities/act19side/level_act19side_ex07.json"
    },
    {
      "operation": "IC-S-3突袭",
      "challenge": "竞赛级沙滩车和烈酒级醒酒助手获得隐匿效果",
      "levelId": "activities/act20side/level_act20side_sub-1-3.json"
    },
    {
      "operation": "IC-S-3突袭",
      "challenge": "竞赛级沙滩车和烈酒级醒酒助手获得隐匿效果",
      "levelId": "activities/act20side/level_act20side_sub-1-3.json"
    },
    {
      "operation": "FC-EX-7突袭",
      "challenge": "深池逐火精锐护卫和“校官”获得隐匿",
      "levelId": "activities/act22side/level_act22side_ex07.json"
    },
    {
      "operation": "HE-EX-6突袭",
      "challenge": "荒原窃盗者精英获得<隐匿>",
      "levelId": "activities/act26side/level_act26side_ex06.json"
    },
    {
      "operation": "AS-EX-6突袭",
      "challenge": "风情区大型车辇获得<隐匿>",
      "levelId": "activities/act35side/level_act35side_ex06.json"
    },
    {
      "operation": "AS-S-3突袭",
      "challenge": "“弹跳独轮车”获得<隐匿>，场上有1个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-3.json"
    },
    {
      "operation": "DT-EX-3突袭",
      "challenge": "<简饲源石虫>与<精饲源石虫>隐匿",
      "levelId": "activities/act36side/level_act36side_ex03.json"
    },
    {
      "operation": "GO-EX-2突袭",
      "challenge": "“街区自治队”队长攻击力提升，且获得<隐匿>",
      "levelId": "activities/act37side/level_act37side_ex02.json"
    },
    {
      "operation": "EP-EX-1突袭",
      "challenge": "历险水手获得隐匿",
      "levelId": "activities/act39side/level_act39side_ex01.json"
    },
    {
      "operation": "EA-EX-3突袭",
      "challenge": "指路草获得<隐匿>",
      "levelId": "activities/act41side/level_act41side_ex03.json"
    },
    {
      "operation": "MT-S-2突袭",
      "challenge": "出现额外敌人且<荒原窃盗者精英>获得隐匿",
      "levelId": "activities/act42side/level_act42side_sub-1-2.json"
    },
    {
      "operation": "AD-EX-4突袭",
      "challenge": "出现额外的沉浸艺术的群演，且沉浸艺术的群演获得隐匿",
      "levelId": "activities/act43side/level_act43side_ex04.json"
    },
    {
      "operation": "SA-4突袭",
      "challenge": "<特战术师>获得隐匿效果，所有敌人生命值、攻击力、防御力都提升至105%",
      "levelId": "activities/act7d5/level_act7d5_04.json"
    },
    {
      "operation": "DM-EX-2突袭",
      "challenge": "萨卡兹百夫长与爆破攻坚手获得隐匿效果、敌方单位生命值和攻击力都提升至115%",
      "levelId": "activities/act9d0/level_act9d0_ex02.json"
    },
    {
      "operation": "PS-6突袭",
      "challenge": "<游击队迫击炮兵组长>和<“锈铜”奥尔默·英格拉>获得隐匿效果，敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "activities/act9mini/level_act9mini_06.json"
    }
  ],
  //技能能力修改
  "enemy_skill_blackb_mul": [
    {
      "operation": "TB-8突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至105%，莱塔尼亚轻语者的技能释放期间，每1秒扣除<“留声机”>3点技力（原1点）",
      "levelId": "activities/act10mini/level_act10mini_08.json"
    },
    {
      "operation": "TW-EX-5突袭",
      "challenge": "敌方单位的防御力提升至120%，生命值提升至120%，莱塔尼亚吟唱者的攻击范围提升至120%，争夺“留声机”效果提升至200%",
      "levelId": "activities/act11d0/level_act11d0_ex05.json"
    },
    {
      "operation": "NL-S-5突袭",
      "challenge": "敌方单位的生命值提升至105%，莫妮克、罗伊、无胄盟第三小队组长、无胄盟清扫小队组长的攻击速度提升至130%",
      "levelId": "activities/act13side/level_act13side_sub-1-5.json"
    },
    {
      "operation": "BI-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至110%。锏的技能【速杀】的移动距离和造成的伤害都提升至150%，冷却时间缩短至50%",
      "levelId": "activities/act14side/level_act14side_ex08.json"
    },
    {
      "operation": "IC-S-4突袭",
      "challenge": "“物欲拮抗者”进入第二形态时受到的晕眩时间大幅降低",
      "levelId": "activities/act20side/level_act20side_sub-1-4.json"
    },
    {
      "operation": "CF-EX-8突袭",
      "challenge": "大地的火光会令天空恐惧。\n附加条件：火龙的生命值与攻击力提升，作战道具的再部署时间大幅增加",
      "levelId": "activities/act24side/level_act24side_ex08.json"
    },
    {
      "operation": "ZT-S-5突袭",
      "challenge": "赫尔昏佐伦，“巫王”第一形态下瞬移间隔大幅度缩短",
      "levelId": "activities/act29side/level_act29side_sub-1-5.json"
    },
    {
      "operation": "HS-EX-4突袭",
      "challenge": "勿玷位于受病害污染的田地上时，造成的法术伤害提升",
      "levelId": "activities/act31side/level_act31side_ex04.json"
    },
    {
      "operation": "BP-EX-8突袭",
      "challenge": "玛利图斯，“海嗣”释放【引导演化】提供的神经损伤能力大幅提升、释放【人性之囚】的频率增加",
      "levelId": "activities/act34side/level_act34side_ex08.json"
    },
    {
      "operation": "MT-EX-6突袭",
      "challenge": "<资深圣堂布道员>技能持续时间提升",
      "levelId": "activities/act42side/level_act42side_ex06.json"
    },
    {
      "operation": "VI-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至105%，生命值提升至110% 浮士德的特殊狙击伤害提升至120%，冷却时间（含初始冷却）降低至75%",
      "levelId": "activities/act8mini/level_act8mini_05.json"
    },
    {
      "operation": "H11-1",
      "levelId": "obt/hard/level_hard_11-01.json"
    },
    {
      "operation": "H11-3",
      "levelId": "obt/hard/level_hard_11-03.json"
    },
    {
      "operation": "H11-4",
      "levelId": "obt/hard/level_hard_11-04.json"
    },
    {
      "operation": "M8-8突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%  梅菲斯特，“歌者”的毒性粉尘伤害提升至200%",
      "levelId": "obt/main/level_main_08-14.json"
    }
  ],
  //禁止部署某类干员
  "char_exclude": [
    {
      "operation": "TW-4",
      "levelId": "activities/act11d0/level_act11d0_04.json"
    },
    {
      "operation": "RI-EX-7突袭",
      "challenge": "禁止部署重装干员  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex07.json"
    },
    {
      "operation": "NL-6",
      "levelId": "activities/act13side/level_act13side_06.json"
    },
    {
      "operation": "MB-3",
      "levelId": "activities/act15d0/level_act15d0_03.json"
    },
    {
      "operation": "TG-1突袭",
      "challenge": "禁止部署术师干员",
      "levelId": "activities/act16mini/level_act16mini_01.json"
    },
    {
      "operation": "OD-3",
      "levelId": "activities/act17d0/level_act17d0_03.json"
    },
    {
      "operation": "LE-EX-1突袭",
      "challenge": "禁止使用近卫和重装干员",
      "levelId": "activities/act18side/level_act18side_ex01.json"
    },
    {
      "operation": "DV-S-1",
      "levelId": "activities/act19side/level_act19side_sub-1-1.json"
    },
    {
      "operation": "DV-S-2",
      "levelId": "activities/act19side/level_act19side_sub-1-2.json"
    },
    {
      "operation": "HE-EX-2突袭",
      "challenge": "禁止部署重装和辅助干员",
      "levelId": "activities/act26side/level_act26side_ex02.json"
    },
    {
      "operation": "ZT-S-1突袭",
      "challenge": "禁止部署特种干员",
      "levelId": "activities/act29side/level_act29side_sub-1-1.json"
    },
    {
      "operation": "AS-EX-8突袭",
      "challenge": "禁止部署特种干员",
      "levelId": "activities/act35side/level_act35side_ex08.json"
    },
    {
      "operation": "EP-EX-6突袭",
      "challenge": "禁止部署重装和特种干员",
      "levelId": "activities/act39side/level_act39side_ex06.json"
    },
    {
      "operation": "PL-2突袭",
      "challenge": "禁止部署重装和狙击干员。敌方单位的生命值，攻击力和防御力都提升至110%。",
      "levelId": "activities/act7mini/level_act7mini_02.json"
    },
    {
      "operation": "DM-EX-5突袭",
      "challenge": "禁止部署特种与狙击干员、敌方单位生命值和攻击力都提升至110%",
      "levelId": "activities/act9d0/level_act9d0_ex05.json"
    },
    {
      "operation": "PS-2突袭",
      "challenge": "禁止部署近卫干员，敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "activities/act9mini/level_act9mini_02.json"
    },
    {
      "operation": "6-16突袭",
      "challenge": "禁止使用医疗干员  敌方单位的生命值提升至115%",
      "levelId": "obt/main/level_main_06-14.json"
    },
    {
      "operation": "7-13突袭",
      "challenge": "禁止部署狙击与近卫干员  敌方单位生命值和攻击力都提升至110%",
      "levelId": "obt/main/level_main_07-11.json"
    },
    {
      "operation": "7-17突袭",
      "challenge": "禁止部署近卫与术师干员  敌方单位生命值提升至105%、攻击力提升至110%",
      "levelId": "obt/main/level_main_07-15.json"
    },
    {
      "operation": "M8-6突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  狂暴宿主士兵、狂暴宿主组长、狂暴宿主掷骨手的攻击速度提升至130%",
      "levelId": "obt/main/level_main_08-09.json"
    }
  ],
  //阻挡数修改
  "char_blockcnt_add": [
    {
      "operation": "TW-EX-3突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至110%，所有我方单位的阻挡数上限减少1",
      "levelId": "activities/act11d0/level_act11d0_ex03.json"
    },
    {
      "operation": "TC-2突袭",
      "challenge": "我方单位的阻挡数减1，敌方单位的生命值和攻击力提升至110%",
      "levelId": "activities/act11mini/level_act11mini_02.json"
    },
    {
      "operation": "AW-5突袭",
      "challenge": "我方单位的阻挡数减少",
      "levelId": "activities/act12mini/level_act12mini_05.json"
    },
    {
      "operation": "DH-S-1突袭",
      "challenge": "我方单位的阻挡数-1。敌方单位的攻击力提升、防御力和生命值都提升至135%（跟普通模式的属性提升不累积）。",
      "levelId": "activities/act12side/level_act12side_sub-1-1.json"
    },
    {
      "operation": "WR-EX-5突袭",
      "challenge": "敌方单位的攻击力、生命值提升至105%，我方干员阻挡数-2",
      "levelId": "activities/act16d5/level_act16d5_ex05.json"
    },
    {
      "operation": "IS-EX-3突袭",
      "challenge": "近卫，重装，特种干员阻挡数-1",
      "levelId": "activities/act21side/level_act21side_ex03.json"
    },
    {
      "operation": "WB-EX-8突袭",
      "challenge": "我方单位阻挡数-1，妄境生命值提升",
      "levelId": "activities/act23side/level_act23side_ex08.json"
    },
    {
      "operation": "CF-EX-5突袭",
      "challenge": "的肆虐已构成极大威胁，必须及时处理。\n附加条件：\n我方单位阻挡数-1，且出现额外敌人",
      "levelId": "activities/act24side/level_act24side_ex05.json"
    },
    {
      "operation": "CW-EX-5突袭",
      "challenge": "我方单位阻挡数-1",
      "levelId": "activities/act25side/level_act25side_ex05.json"
    },
    {
      "operation": "RS-EX-2突袭",
      "challenge": "近卫、重装、特种干员阻挡数-1",
      "levelId": "activities/act30side/level_act30side_ex02.json"
    },
    {
      "operation": "PV-EX-4突袭",
      "challenge": "我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_ex04.json"
    },
    {
      "operation": "PV-S-1突袭",
      "challenge": "所有<“美食速递”>替换为<“醉后狂欢”>，且我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_sub-1-1.json"
    },
    {
      "operation": "CB-EX6突袭",
      "challenge": "近卫与先锋干员阻挡数-1  敌方单位的生命值和攻击力都提升至105%",
      "levelId": "activities/act5d0/level_act5d0_ex06.json"
    },
    {
      "operation": "PL-4突袭",
      "challenge": "我方单位阻挡数-2。敌方单位的生命值，攻击力和防御力都提升至110%。",
      "levelId": "activities/act7mini/level_act7mini_04.json"
    },
    {
      "operation": "7-8突袭",
      "challenge": "我方单位阻挡数-1 敌方单位数值不变",
      "levelId": "obt/main/level_main_07-06.json"
    },
    {
      "operation": "R8-2突袭",
      "challenge": "我方单位阻挡数-1、敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "obt/main/level_main_08-02.json"
    }
  ],
  //携带数限制
  "global_squad_num_limit": [
    {
      "operation": "TW-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，可携带干员数量不超过10",
      "levelId": "activities/act11d0/level_act11d0_ex08.json"
    },
    {
      "operation": "GA-EX-6突袭",
      "challenge": "队伍里只能编入最多8个干员，敌方单位的攻击力和生命值都提升至110%",
      "levelId": "activities/act16side/level_act16side_ex06.json"
    },
    {
      "operation": "LE-EX-6突袭",
      "challenge": "队伍里只能编入最多7名干员",
      "levelId": "activities/act18side/level_act18side_ex06.json"
    },
    {
      "operation": "CB-EX3突袭",
      "challenge": "允许编入干员下降至5名  敌方单位的生命值提升至115%，攻击力和防御力都提升至105%",
      "levelId": "activities/act5d0/level_act5d0_ex03.json"
    },
    {
      "operation": "SA-6突袭",
      "challenge": "最多可编入10名干员进行作战，所有敌人生命值、攻击力都提升至110%",
      "levelId": "activities/act7d5/level_act7d5_06.json"
    },
    {
      "operation": "7-16突袭",
      "challenge": "最多可携带干员数降至7  敌方单位生命值提升至120%、攻击力提升至110%",
      "levelId": "obt/main/level_main_07-14.json"
    }
  ],
  //初始部署费用修改
  "global_initial_cost_add": [
    {
      "operation": "TW-S-1突袭",
      "challenge": "使用固定干员进行作战，初始COST-10，可部署上限-2",
      "levelId": "activities/act11d0/level_act11d0_sub-1-1.json"
    },
    {
      "operation": "CR-EX-4突袭",
      "challenge": "初始部署费用增加但不再回复费用",
      "levelId": "activities/act32side/level_act32side_ex04.json"
    },
    {
      "operation": "S9-2",
      "levelId": "obt/main/level_sub_09-1-2.json"
    },
    {
      "operation": "S9-3",
      "levelId": "obt/main/level_sub_09-1-3.json"
    },
    {
      "operation": "S9-4",
      "levelId": "obt/main/level_sub_09-1-4.json"
    }
  ],
  //可部署干员数量修改
  "global_placable_char_num_add": [
    {
      "operation": "TW-S-1突袭",
      "challenge": "使用固定干员进行作战，初始COST-10，可部署上限-2",
      "levelId": "activities/act11d0/level_act11d0_sub-1-1.json"
    },
    {
      "operation": "RI-EX-5突袭",
      "challenge": "可部署干员数量减少2  敌方单位的攻击力、生命值都提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex05.json"
    },
    {
      "operation": "FA-3突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，可部署干员数量减少1",
      "levelId": "activities/act13d0/level_act13d0_03.json"
    },
    {
      "operation": "BH-8突袭",
      "challenge": "可部署单位上限减少2(8-2=6)  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "activities/act15d5/level_act15d5_08.json"
    },
    {
      "operation": "FD-4突袭",
      "challenge": "可部署单位上限减少2",
      "levelId": "activities/act15mini/level_act15mini_04.json"
    },
    {
      "operation": "CW-EX-4突袭",
      "challenge": "可放置人数-2",
      "levelId": "activities/act25side/level_act25side_ex04.json"
    },
    {
      "operation": "BB-EX-5突袭",
      "challenge": "可同时部署人数降至6",
      "levelId": "activities/act33side/level_act33side_ex05.json"
    },
    {
      "operation": "MT-EX-7突袭",
      "challenge": "可同时部署干员单位数-2",
      "levelId": "activities/act42side/level_act42side_ex07.json"
    },
    {
      "operation": "6-1突袭",
      "challenge": "可部署单位上限减少2  敌方单位生命值、攻击力都提升至120%，防御力提升至105%",
      "levelId": "obt/main/level_main_06-01.json"
    }
  ],
  //可部署装置数量修改
  "global_token_cnt_add": [
    {
      "operation": "RI-EX-6突袭",
      "challenge": "可部署的<罗德岛临时雇员>人数减少6,，且敌人的特殊能力不会失效  敌方单位的生命值提升至110%",
      "levelId": "activities/act12d0/level_act12d0_ex06.json"
    },
    {
      "operation": "DH-S-3突袭",
      "challenge": "不可使用特制水上平台。敌方单位的攻击力、防御力和生命值都提升至110%。",
      "levelId": "activities/act12side/level_act12side_sub-1-3.json"
    },
    {
      "operation": "FA-5突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值提升至110%，不再有罗德岛临时雇员可用",
      "levelId": "activities/act13d0/level_act13d0_05.json"
    },
    {
      "operation": "NL-EX-5突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%，骑士之徽的数量减少2个（剩1个），部署费用自然回复所需时间提升至154%（1秒回0.66费）",
      "levelId": "activities/act13side/level_act13side_ex05.json"
    },
    {
      "operation": "NL-S-2突袭",
      "challenge": "所有敌方单位的攻击力、防御力、生命值都提升至120%，骑士之徽的数量减少1个（没了）",
      "levelId": "activities/act13side/level_act13side_sub-1-2.json"
    },
    {
      "operation": "HS-EX-6突袭",
      "challenge": "不再持有<泵站>",
      "levelId": "activities/act31side/level_act31side_ex06.json"
    },
    {
      "operation": "HS-S-2突袭",
      "challenge": "持有的<阻流阀>数量减少",
      "levelId": "activities/act31side/level_act31side_sub-1-2.json"
    },
    {
      "operation": "AS-EX-1突袭",
      "challenge": "持有的障碍物数量大幅减少",
      "levelId": "activities/act35side/level_act35side_ex01.json"
    },
    {
      "operation": "OR-EX-3突袭",
      "challenge": "可部署的箱子数量大幅减少",
      "levelId": "activities/act40side/level_act40side_ex03.json"
    }
  ],
  //某种buff
  "env_gbuff_new": [
    {
      "operation": "FA-1突袭",
      "challenge": "敌方单位的攻击力和生命值提升至115%，防御力提升至110%，毒性雾霾伤害提升至每0.5秒15点",
      "levelId": "activities/act13d0/level_act13d0_01.json"
    },
    {
      "operation": "SN-TR-1",
      "levelId": "activities/act17side/level_act17side_tr01.json"
    },
    {
      "operation": "MT-1",
      "levelId": "activities/act42side/level_act42side_01.json"
    },
    {
      "operation": "MT-2",
      "levelId": "activities/act42side/level_act42side_02.json"
    },
    {
      "operation": "MT-3",
      "levelId": "activities/act42side/level_act42side_03.json"
    },
    {
      "operation": "MT-4",
      "levelId": "activities/act42side/level_act42side_04.json"
    },
    {
      "operation": "MT-5",
      "levelId": "activities/act42side/level_act42side_05.json"
    },
    {
      "operation": "MT-6",
      "levelId": "activities/act42side/level_act42side_06.json"
    },
    {
      "operation": "MT-7",
      "levelId": "activities/act42side/level_act42side_07.json"
    },
    {
      "operation": "MT-8",
      "levelId": "activities/act42side/level_act42side_08.json"
    },
    {
      "operation": "MT-9",
      "levelId": "activities/act42side/level_act42side_09.json"
    },
    {
      "operation": "MT-10",
      "levelId": "activities/act42side/level_act42side_10.json"
    },
    {
      "operation": "MT-EX-1突袭",
      "challenge": "法术抗性提升",
      "levelId": "activities/act42side/level_act42side_ex01.json"
    },
    {
      "operation": "MT-EX-2突袭",
      "challenge": "<“萨科塔昂首”>生命值提升",
      "levelId": "activities/act42side/level_act42side_ex02.json"
    },
    {
      "operation": "MT-EX-3突袭",
      "challenge": "<圣堂射手扮演者>不再出现",
      "levelId": "activities/act42side/level_act42side_ex03.json"
    },
    {
      "operation": "MT-EX-4突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act42side/level_act42side_ex04.json"
    },
    {
      "operation": "MT-EX-5突袭",
      "challenge": "<圣徒祈祷像>和<“牧首”>提供屏障的速率提升",
      "levelId": "activities/act42side/level_act42side_ex05.json"
    },
    {
      "operation": "MT-EX-6突袭",
      "challenge": "<资深圣堂布道员>技能持续时间提升",
      "levelId": "activities/act42side/level_act42side_ex06.json"
    },
    {
      "operation": "MT-EX-7突袭",
      "challenge": "可同时部署干员单位数-2",
      "levelId": "activities/act42side/level_act42side_ex07.json"
    },
    {
      "operation": "MT-EX-8突袭",
      "challenge": "术师、医疗干员部署费用变为2倍",
      "levelId": "activities/act42side/level_act42side_ex08.json"
    },
    {
      "operation": "MT-S-1突袭",
      "challenge": "出现额外敌人且部分<冰淇淋机>初始阵营改变",
      "levelId": "activities/act42side/level_act42side_sub-1-1.json"
    },
    {
      "operation": "MT-S-2突袭",
      "challenge": "出现额外敌人且<荒原窃盗者精英>获得隐匿",
      "levelId": "activities/act42side/level_act42side_sub-1-2.json"
    },
    {
      "operation": "MT-S-3突袭",
      "challenge": "出现额外敌人且<资深圣堂保育员>生命值提升",
      "levelId": "activities/act42side/level_act42side_sub-1-3.json"
    },
    {
      "operation": "MT-S-4突袭",
      "challenge": "<腐败萃聚使徒>位置和路线变化",
      "levelId": "activities/act42side/level_act42side_sub-1-4.json"
    },
    {
      "operation": "MT-S-5突袭",
      "challenge": "<“圣徒”>额外进行一次<寻根圣事>",
      "levelId": "activities/act42side/level_act42side_sub-1-5.json"
    },
    {
      "operation": "MT-TR-1",
      "levelId": "activities/act42side/level_act42side_tr01.json"
    },
    {
      "operation": "VI-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110% 我方干员技力自然回复速度降低至25%",
      "levelId": "activities/act8mini/level_act8mini_04.json"
    },
    {
      "operation": "15-19",
      "levelId": "obt/main/level_main_15-17.json"
    }
  ],
  //单位再部署时间修改
  "char_respawntime_mul": [
    {
      "operation": "FD-6突袭",
      "challenge": "我方单位再部署时间增加",
      "levelId": "activities/act15mini/level_act15mini_06.json"
    },
    {
      "operation": "IS-EX-7突袭",
      "challenge": "我方干员与召唤物再部署时间延长100%",
      "levelId": "activities/act21side/level_act21side_ex07.json"
    },
    {
      "operation": "CF-EX-8突袭",
      "challenge": "大地的火光会令天空恐惧。\n附加条件：火龙的生命值与攻击力提升，作战道具的再部署时间大幅增加",
      "levelId": "activities/act24side/level_act24side_ex08.json"
    },
    {
      "operation": "PV-EX-8突袭",
      "challenge": "我方单位再部署时间延长",
      "levelId": "activities/act38side/level_act38side_ex08.json"
    },
    {
      "operation": "VI-7突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110%，所有我方单位的再部署时间提升至175%",
      "levelId": "activities/act8mini/level_act8mini_07.json"
    },
    {
      "operation": "12-16",
      "levelId": "obt/main/level_main_12-14.json"
    },
    {
      "operation": "S9-2",
      "levelId": "obt/main/level_sub_09-1-2.json"
    },
    {
      "operation": "S9-3",
      "levelId": "obt/main/level_sub_09-1-3.json"
    },
    {
      "operation": "S9-4",
      "levelId": "obt/main/level_sub_09-1-4.json"
    }
  ],
  //单位费用修改
  "char_cost_mul": [
    {
      "operation": "DH-EX-4突袭",
      "challenge": "重装干员部署费用提升至4倍，敌方单位的攻击力提升至110%，生命值提升至110%",
      "levelId": "activities/act12side/level_act12side_ex04.json"
    },
    {
      "operation": "BW-2突袭",
      "challenge": "重装和特种干员部署费用变为2倍",
      "levelId": "activities/act13mini/level_act13mini_02.json"
    },
    {
      "operation": "NL-EX-4突袭",
      "challenge": "近卫和重装干员部署费用增加至3倍",
      "levelId": "activities/act13side/level_act13side_ex04.json"
    },
    {
      "operation": "IW-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至105%，防御力提升至105%，近卫与术士的部署费用提升至3倍",
      "levelId": "activities/act15side/level_act15side_ex06.json"
    },
    {
      "operation": "DV-EX-4突袭",
      "challenge": "近卫和重装干员的部署费用提升至2倍",
      "levelId": "activities/act19side/level_act19side_ex04.json"
    },
    {
      "operation": "CW-EX-8突袭",
      "challenge": "重装与近卫干员部署费用提升至3倍",
      "levelId": "activities/act25side/level_act25side_ex08.json"
    },
    {
      "operation": "SL-EX-3突袭",
      "challenge": "<水汽汽水瓶>的部署费用大幅增加",
      "levelId": "activities/act27side/level_act27side_ex03.json"
    },
    {
      "operation": "RS-EX-4突袭",
      "challenge": "先锋、近卫、重装部署费用提升至2倍",
      "levelId": "activities/act30side/level_act30side_ex04.json"
    },
    {
      "operation": "CR-EX-6突袭",
      "challenge": "近卫和特种的部署费用翻倍",
      "levelId": "activities/act32side/level_act32side_ex06.json"
    },
    {
      "operation": "BB-EX-8突袭",
      "challenge": "障碍物部署消耗的费用大幅提升",
      "levelId": "activities/act33side/level_act33side_ex08.json"
    },
    {
      "operation": "OR-S-2突袭",
      "challenge": "辅助、特种干员部署费用提升至3倍",
      "levelId": "activities/act40side/level_act40side_sub-1-2.json"
    },
    {
      "operation": "MT-EX-8突袭",
      "challenge": "术师、医疗干员部署费用变为2倍",
      "levelId": "activities/act42side/level_act42side_ex08.json"
    },
    {
      "operation": "AD-EX-2突袭",
      "challenge": "特种干员的部署费用提升至1.5倍",
      "levelId": "activities/act43side/level_act43side_ex02.json"
    },
    {
      "operation": "CB-EX5突袭",
      "challenge": "术师干员部署费用增加至3倍  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "activities/act5d0/level_act5d0_ex05.json"
    },
    {
      "operation": "AF-1突袭",
      "challenge": "我方所有远程干员的部署费用增至3倍，敌方单位的生命值、防御力都提升至110%，攻击力提升至120%",
      "levelId": "activities/act6d5/level_act6d5_01.json"
    },
    {
      "operation": "7-5突袭",
      "challenge": "远程单位部署费用提升至2倍  敌方单位生命值提升至105%、攻击力提升至115%",
      "levelId": "obt/main/level_main_07-04.json"
    },
    {
      "operation": "R8-3突袭",
      "challenge": "远程单位部署费用提升至2倍  敌方单位的攻击力、防御力、生命值都提升至110%",
      "levelId": "obt/main/level_main_08-03.json"
    }
  ],
  "char_skill_blackb_add": [
    {
      "operation": "DH-EX-6突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至110%，生命值提升至110%，涨潮时，我方每秒受到的侵蚀损伤提升40点",
      "levelId": "activities/act12side/level_act12side_ex06.json"
    },
    {
      "operation": "DT-6",
      "levelId": "activities/act36side/level_act36side_06.json"
    },
    {
      "operation": "JT8-3突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%  能量聚合体造成的法术伤害提升400",
      "levelId": "obt/main/level_main_08-17.json"
    }
  ],
  //敌人天赋修改
  "enemy_talent_blackb_add": [
    {
      "operation": "DH-S-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至130%。无人爆破重艇的生命流失速度数值降低2%，爆炸伤害提升至150%（跟普通模式的属性提升不累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-2.json"
    },
    {
      "operation": "DH-S-2突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至130%。无人爆破重艇的生命流失速度数值降低2%，爆炸伤害提升至150%（跟普通模式的属性提升不累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-2.json"
    },
    {
      "operation": "DH-S-4突袭",
      "challenge": "敌方单位的攻击力和生命值额外提升至110%。水手长的生命值额外再提升至130%，水蚀状态下每秒额外受到的真实伤害降至0。（跟普通模式的属性提升累积）",
      "levelId": "activities/act12side/level_act12side_sub-1-4.json"
    },
    {
      "operation": "FD-8突袭",
      "challenge": "<殉道者安多恩>【光赐于苦】的闪避效果提升",
      "levelId": "activities/act15mini/level_act15mini_08.json"
    },
    {
      "operation": "GA-EX-5突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，精致糖果车爆炸后造成的法术溅射伤害额外增加350",
      "levelId": "activities/act16side/level_act16side_ex05.json"
    },
    {
      "operation": "GA-EX-8突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%，敌方单位处于地面效果“光赐予苦”范围内时，受到的物理和法术伤害变为减少至35%",
      "levelId": "activities/act16side/level_act16side_ex08.json"
    },
    {
      "operation": "OD-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110%，<畸变体傀儡>被击败时分裂的<畸变赘生物>数量增加1个",
      "levelId": "activities/act17d0/level_act17d0_ex01.json"
    },
    {
      "operation": "SE-8突袭",
      "challenge": "所有萨卡兹骸骨卫士被击倒时，额外留下2个血珀",
      "levelId": "activities/act18mini/level_act18mini_08.json"
    },
    {
      "operation": "CF-EX-3突袭",
      "challenge": "冠兽与刚甲爪兽的异常活动。\n附加条件：\n刚甲爪兽和坚岩冠兽受到来自非弱点部位的伤害进一步降低",
      "levelId": "activities/act24side/level_act24side_ex03.json"
    },
    {
      "operation": "CW-S-4突袭",
      "challenge": "星环周围8格我方单位攻速大幅减少，每个星环给克丽斯腾提供的减伤增加",
      "levelId": "activities/act25side/level_act25side_sub-1-4.json"
    },
    {
      "operation": "CW-S-4突袭",
      "challenge": "星环周围8格我方单位攻速大幅减少，每个星环给克丽斯腾提供的减伤增加",
      "levelId": "activities/act25side/level_act25side_sub-1-4.json"
    },
    {
      "operation": "HE-EX-8突袭",
      "challenge": "落石对我方单位伤害大幅提升",
      "levelId": "activities/act26side/level_act26side_ex08.json"
    },
    {
      "operation": "SL-S-5突袭",
      "challenge": "多利，“羊之主”在漂浮阶段时的绒毛护盾值提升",
      "levelId": "activities/act27side/level_act27side_sub-1-5.json"
    },
    {
      "operation": "CV-EX-6突袭",
      "challenge": "辐能源石虫·α死亡后使场上敌人获得更多能量",
      "levelId": "activities/act28side/level_act28side_ex06.json"
    },
    {
      "operation": "ZT-S-2突袭",
      "challenge": "激昂变奏下，巫王乐团管乐家移动速度获得额外提升",
      "levelId": "activities/act29side/level_act29side_sub-1-2.json"
    },
    {
      "operation": "ZT-S-5突袭",
      "challenge": "赫尔昏佐伦，“巫王”第一形态下瞬移间隔大幅度缩短",
      "levelId": "activities/act29side/level_act29side_sub-1-5.json"
    },
    {
      "operation": "RS-EX-3突袭",
      "challenge": "“访问团持盾长”最大特性层数提升",
      "levelId": "activities/act30side/level_act30side_ex03.json"
    },
    {
      "operation": "CR-EX-7突袭",
      "challenge": "\"马特奥的近卫\"未被阻挡时，受到的物理和法术伤害额外降低",
      "levelId": "activities/act32side/level_act32side_ex07.json"
    },
    {
      "operation": "BB-S-3突袭",
      "challenge": "巫术弩炮的等级提升",
      "levelId": "activities/act33side/level_act33side_sub-1-3.json"
    },
    {
      "operation": "AS-S-1突袭",
      "challenge": "结晶为米奥，热烈的考验者提供的增益效果大幅增强，大型破碎器皿损失的生命值减少",
      "levelId": "activities/act35side/level_act35side_sub-1-1.json"
    },
    {
      "operation": "AS-S-1突袭",
      "challenge": "结晶为米奥，热烈的考验者提供的增益效果大幅增强，大型破碎器皿损失的生命值减少",
      "levelId": "activities/act35side/level_act35side_sub-1-1.json"
    },
    {
      "operation": "EP-EX-5突袭",
      "challenge": "恐怖厨子减少物理与法术伤害的比例提升",
      "levelId": "activities/act39side/level_act39side_ex05.json"
    },
    {
      "operation": "MT-EX-5突袭",
      "challenge": "<圣徒祈祷像>和<“牧首”>提供屏障的速率提升",
      "levelId": "activities/act42side/level_act42side_ex05.json"
    },
    {
      "operation": "MT-EX-5突袭",
      "challenge": "<圣徒祈祷像>和<“牧首”>提供屏障的速率提升",
      "levelId": "activities/act42side/level_act42side_ex05.json"
    },
    {
      "operation": "MT-S-5突袭",
      "challenge": "<“圣徒”>额外进行一次<寻根圣事>",
      "levelId": "activities/act42side/level_act42side_sub-1-5.json"
    }
  ],
  //单位属性修改
  "char_attribute_add": [
    {
      "operation": "BW-8突袭",
      "challenge": "<弩炮台>造成的伤害提高",
      "levelId": "activities/act13mini/level_act13mini_08.json"
    },
    {
      "operation": "VI-4突袭",
      "challenge": "敌方单位的攻击力提升至110%，生命值提升至110% 我方干员技力自然回复速度降低至25%",
      "levelId": "activities/act8mini/level_act8mini_04.json"
    },
    {
      "operation": "VI-7突袭",
      "challenge": "敌方单位的攻击力和生命值都提升至110%，所有我方单位的再部署时间提升至175%",
      "levelId": "activities/act8mini/level_act8mini_07.json"
    }
  ],
  //自然回费速度修改
  "global_cost_recovery_mul": [
    {
      "operation": "NL-EX-5突袭",
      "challenge": "敌方单位的攻击力、生命值提升至110%，骑士之徽的数量减少2个（剩1个），部署费用自然回复所需时间提升至154%（1秒回0.66费）",
      "levelId": "activities/act13side/level_act13side_ex05.json"
    },
    {
      "operation": "BI-EX-6突袭",
      "challenge": "敌方单位的攻击力和防御力都提升至110%，部署费用的自然回复速度降低50%",
      "levelId": "activities/act14side/level_act14side_ex06.json"
    },
    {
      "operation": "FD-1突袭",
      "challenge": "部署费用回复速度降低",
      "levelId": "activities/act15mini/level_act15mini_01.json"
    },
    {
      "operation": "SN-EX-2突袭",
      "challenge": "敌方单位的生命值、攻击力和防御力都提升至110%，每3秒回复1点部署费用",
      "levelId": "activities/act17side/level_act17side_ex02.json"
    },
    {
      "operation": "SV-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，部署费用的自然回复速度降低至50%。",
      "levelId": "activities/act18d3/level_act18d3_ex02.json"
    },
    {
      "operation": "CR-EX-4突袭",
      "challenge": "初始部署费用增加但不再回复费用",
      "levelId": "activities/act32side/level_act32side_ex04.json"
    },
    {
      "operation": "AD-EX-1突袭",
      "challenge": "部署费用的回复速度降低",
      "levelId": "activities/act43side/level_act43side_ex01.json"
    },
    {
      "operation": "15-11突袭",
      "challenge": "部署费用的回复速度降低",
      "levelId": "obt/main/level_main_15-10.json"
    }
  ],
  //敌人技能射程修改
  "enemy_skill_radius_mul": [
    {
      "operation": "NL-S-3突袭",
      "challenge": "敌方单位的攻击力提升、防御力、生命值都提升至110%，散华骑士团成员的生命值额外提升至200%，技能冷却时间降低至75%。散华骑士团成员包括：散华骑士团学徒、散华骑士团精锐、烛骑士薇薇安娜",
      "levelId": "activities/act13side/level_act13side_sub-1-3.json"
    },
    {
      "operation": "6-15突袭",
      "challenge": "敌方单位的攻击力提升至110%  敌方虚幻无人机的射程减少至90%,但生命值、防御力都提升至200%",
      "levelId": "obt/main/level_main_06-13.json"
    }
  ],
  //敌人技能初始冷却修改
  "enemy_skill_init_cd_mul": [
    {
      "operation": "NL-S-3突袭",
      "challenge": "敌方单位的攻击力提升、防御力、生命值都提升至110%，散华骑士团成员的生命值额外提升至200%，技能冷却时间降低至75%。散华骑士团成员包括：散华骑士团学徒、散华骑士团精锐、烛骑士薇薇安娜",
      "levelId": "activities/act13side/level_act13side_sub-1-3.json"
    },
    {
      "operation": "CV-EX-8突袭",
      "challenge": "“桥夹”克里夫技能释放频率增加",
      "levelId": "activities/act28side/level_act28side_ex08.json"
    },
    {
      "operation": "CV-EX-8突袭",
      "challenge": "“桥夹”克里夫技能释放频率增加",
      "levelId": "activities/act28side/level_act28side_ex08.json"
    },
    {
      "operation": "VI-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至105%，生命值提升至110% 浮士德的特殊狙击伤害提升至120%，冷却时间（含初始冷却）降低至75%",
      "levelId": "activities/act8mini/level_act8mini_05.json"
    }
  ],
  //敌人技能冷却修改
  "enemy_skill_cd_mul": [
    {
      "operation": "NL-S-3突袭",
      "challenge": "敌方单位的攻击力提升、防御力、生命值都提升至110%，散华骑士团成员的生命值额外提升至200%，技能冷却时间降低至75%。散华骑士团成员包括：散华骑士团学徒、散华骑士团精锐、烛骑士薇薇安娜",
      "levelId": "activities/act13side/level_act13side_sub-1-3.json"
    },
    {
      "operation": "BI-EX-8突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至110%。锏的技能【速杀】的移动距离和造成的伤害都提升至150%，冷却时间缩短至50%",
      "levelId": "activities/act14side/level_act14side_ex08.json"
    },
    {
      "operation": "WR-EX-2突袭",
      "challenge": "敌方单位的攻击力、防御力、生命值都提升至110%，复杂的“妒”的技能冷却时间缩短至25%",
      "levelId": "activities/act16d5/level_act16d5_ex02.json"
    },
    {
      "operation": "SL-EX-8突袭",
      "challenge": "多利，“羊之主”在漂浮阶段时技能释放频率增加",
      "levelId": "activities/act27side/level_act27side_ex08.json"
    },
    {
      "operation": "CV-EX-8突袭",
      "challenge": "“桥夹”克里夫技能释放频率增加",
      "levelId": "activities/act28side/level_act28side_ex08.json"
    },
    {
      "operation": "CV-EX-8突袭",
      "challenge": "“桥夹”克里夫技能释放频率增加",
      "levelId": "activities/act28side/level_act28side_ex08.json"
    },
    {
      "operation": "ZT-EX-8突袭",
      "challenge": "赫尔昏佐伦，“巫王”释放【慵钝惩戒】技能的频率增加，击破“慵钝之印”所需伤害次数增加",
      "levelId": "activities/act29side/level_act29side_ex08.json"
    },
    {
      "operation": "ZT-EX-8突袭",
      "challenge": "赫尔昏佐伦，“巫王”释放【慵钝惩戒】技能的频率增加，击破“慵钝之印”所需伤害次数增加",
      "levelId": "activities/act29side/level_act29side_ex08.json"
    },
    {
      "operation": "ZT-S-5突袭",
      "challenge": "赫尔昏佐伦，“巫王”第一形态下瞬移间隔大幅度缩短",
      "levelId": "activities/act29side/level_act29side_sub-1-5.json"
    },
    {
      "operation": "BP-EX-8突袭",
      "challenge": "玛利图斯，“海嗣”释放【引导演化】提供的神经损伤能力大幅提升、释放【人性之囚】的频率增加",
      "levelId": "activities/act34side/level_act34side_ex08.json"
    },
    {
      "operation": "EP-EX-8突袭",
      "challenge": "美声水手长召唤历险水手的间隔缩短",
      "levelId": "activities/act39side/level_act39side_ex08.json"
    },
    {
      "operation": "VI-5突袭",
      "challenge": "敌方单位的攻击力提升至110%，防御力提升至105%，生命值提升至110% 浮士德的特殊狙击伤害提升至120%，冷却时间（含初始冷却）降低至75%",
      "levelId": "activities/act8mini/level_act8mini_05.json"
    },
    {
      "operation": "15-6突袭",
      "challenge": "内测版自助出餐终端召唤技能冷却时间减少",
      "levelId": "obt/main/level_main_15-05.json"
    },
    {
      "operation": "15-7突袭",
      "challenge": "内测版自助出餐终端召唤技能冷却时间减少",
      "levelId": "obt/main/level_main_15-06.json"
    }
  ],
  "char_skill_blackb_mul": [
    {
      "operation": "DC-3突袭",
      "challenge": "<深水区>中的敌人不再流失生命",
      "levelId": "activities/act14mini/level_act14mini_03.json"
    }
  ],
  "ebuff_talent_blackb_mul": [
    {
      "operation": "IW-EX-1突袭",
      "challenge": "敌方单位的攻击力提升至105%，生命值提升至110%，<磨砻>死亡后生成的木制瑞印额外增加2个",
      "levelId": "activities/act15side/level_act15side_ex01.json"
    },
    {
      "operation": "4-7突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都升至110%  源石生物的死亡爆炸伤害额外提升80%",
      "levelId": "obt/main/level_main_04-07.json"
    },
    {
      "operation": "6-9突袭",
      "challenge": "敌方单位生命值、攻击力、防御力都提升至110%  敌方雪怪小队和霜牙对被【冻结】单位的攻击力再提升至166.7%",
      "levelId": "obt/main/level_main_06-08.json"
    }
  ],
  "map_tile_blackb_mul": [
    {
      "operation": "WR-EX-8突袭",
      "challenge": "敌方单位的防御力提升至110%，生命值提升至110%，我方单位的攻击力在攻击同属性单位时降低至30%",
      "levelId": "activities/act16d5/level_act16d5_ex08.json"
    },
    {
      "operation": "WR-EX-8突袭",
      "challenge": "敌方单位的防御力提升至110%，生命值提升至110%，我方单位的攻击力在攻击同属性单位时降低至30%",
      "levelId": "activities/act16d5/level_act16d5_ex08.json"
    }
  ],
  "env_system_new": [
    {
      "operation": "KR-6突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act17mini/level_act17mini_06.json"
    },
    {
      "operation": "VEC-01",
      "levelId": "activities/act1break/level_act1break_01.json"
    },
    {
      "operation": "VEC-04",
      "levelId": "activities/act1break/level_act1break_04.json"
    },
    {
      "operation": "VEC-06",
      "levelId": "activities/act1break/level_act1break_06.json"
    },
    {
      "operation": "VEC-08",
      "levelId": "activities/act1break/level_act1break_08.json"
    },
    {
      "operation": "VEC-12",
      "levelId": "activities/act1break/level_act1break_12.json"
    },
    {
      "operation": "VEC-D",
      "levelId": "activities/act1break/level_act1break_16.json"
    },
    {
      "operation": "CW-P-1",
      "levelId": "activities/act25side/level_act25side_sp01.json"
    },
    {
      "operation": "CW-P-2",
      "levelId": "activities/act25side/level_act25side_sp02.json"
    },
    {
      "operation": "SL-1",
      "levelId": "activities/act27side/level_act27side_01.json"
    },
    {
      "operation": "SL-2",
      "levelId": "activities/act27side/level_act27side_02.json"
    },
    {
      "operation": "SL-3",
      "levelId": "activities/act27side/level_act27side_03.json"
    },
    {
      "operation": "SL-4",
      "levelId": "activities/act27side/level_act27side_04.json"
    },
    {
      "operation": "SL-5",
      "levelId": "activities/act27side/level_act27side_05.json"
    },
    {
      "operation": "SL-6",
      "levelId": "activities/act27side/level_act27side_06.json"
    },
    {
      "operation": "SL-7",
      "levelId": "activities/act27side/level_act27side_07.json"
    },
    {
      "operation": "SL-8",
      "levelId": "activities/act27side/level_act27side_08.json"
    },
    {
      "operation": "SL-EX-1突袭",
      "challenge": "敌人生命值提升",
      "levelId": "activities/act27side/level_act27side_ex01.json"
    },
    {
      "operation": "SL-EX-2突袭",
      "challenge": "场上四个位置不可部署",
      "levelId": "activities/act27side/level_act27side_ex02.json"
    },
    {
      "operation": "SL-EX-3突袭",
      "challenge": "<水汽汽水瓶>的部署费用大幅增加",
      "levelId": "activities/act27side/level_act27side_ex03.json"
    },
    {
      "operation": "SL-EX-4突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act27side/level_act27side_ex04.json"
    },
    {
      "operation": "SL-EX-5突袭",
      "challenge": "风情街“满天飞空员”移动速度大幅提升",
      "levelId": "activities/act27side/level_act27side_ex05.json"
    },
    {
      "operation": "SL-EX-6突袭",
      "challenge": "城市“龙卷风行者”造成的伤害大幅提升",
      "levelId": "activities/act27side/level_act27side_ex06.json"
    },
    {
      "operation": "SL-EX-7突袭",
      "challenge": "风情街“超新星术师”的攻击速度大幅提升",
      "levelId": "activities/act27side/level_act27side_ex07.json"
    },
    {
      "operation": "SL-EX-8突袭",
      "challenge": "多利，“羊之主”在漂浮阶段时技能释放频率增加",
      "levelId": "activities/act27side/level_act27side_ex08.json"
    },
    {
      "operation": "SL-MO-1",
      "levelId": "activities/act27side/level_act27side_mo01.json"
    },
    {
      "operation": "SL-P-1",
      "levelId": "activities/act27side/level_act27side_sp01.json"
    },
    {
      "operation": "SL-P-2",
      "levelId": "activities/act27side/level_act27side_sp02.json"
    },
    {
      "operation": "SL-P-3",
      "levelId": "activities/act27side/level_act27side_sp03.json"
    },
    {
      "operation": "SL-S-1突袭",
      "challenge": "城市“龙卷风行者”造成的伤害大幅提升",
      "levelId": "activities/act27side/level_act27side_sub-1-1.json"
    },
    {
      "operation": "SL-S-2突袭",
      "challenge": "<水汽汽水瓶>的生命值大幅提升",
      "levelId": "activities/act27side/level_act27side_sub-1-2.json"
    },
    {
      "operation": "SL-S-3突袭",
      "challenge": "敌人移动速度提升",
      "levelId": "activities/act27side/level_act27side_sub-1-3.json"
    },
    {
      "operation": "SL-S-4突袭",
      "challenge": "替换部分敌人",
      "levelId": "activities/act27side/level_act27side_sub-1-4.json"
    },
    {
      "operation": "SL-S-5突袭",
      "challenge": "多利，“羊之主”在漂浮阶段时的绒毛护盾值提升",
      "levelId": "activities/act27side/level_act27side_sub-1-5.json"
    },
    {
      "operation": "SL-TR-1",
      "levelId": "activities/act27side/level_act27side_tr01.json"
    },
    {
      "operation": "SL-TR-2",
      "levelId": "activities/act27side/level_act27side_tr02.json"
    },
    {
      "operation": "ZT-2",
      "levelId": "activities/act29side/level_act29side_02.json"
    },
    {
      "operation": "ZT-3",
      "levelId": "activities/act29side/level_act29side_03.json"
    },
    {
      "operation": "ZT-4",
      "levelId": "activities/act29side/level_act29side_04.json"
    },
    {
      "operation": "ZT-5",
      "levelId": "activities/act29side/level_act29side_05.json"
    },
    {
      "operation": "ZT-6",
      "levelId": "activities/act29side/level_act29side_06.json"
    },
    {
      "operation": "ZT-7",
      "levelId": "activities/act29side/level_act29side_07.json"
    },
    {
      "operation": "ZT-8",
      "levelId": "activities/act29side/level_act29side_08.json"
    },
    {
      "operation": "ZT-9",
      "levelId": "activities/act29side/level_act29side_09.json"
    },
    {
      "operation": "ZT-10",
      "levelId": "activities/act29side/level_act29side_10.json"
    },
    {
      "operation": "ZT-EX-1突袭",
      "challenge": "场上一个位置不可部署",
      "levelId": "activities/act29side/level_act29side_ex01.json"
    },
    {
      "operation": "ZT-EX-2突袭",
      "challenge": "<湮灭之相>再部署时间延长",
      "levelId": "activities/act29side/level_act29side_ex02.json"
    },
    {
      "operation": "ZT-EX-3突袭",
      "challenge": "<调谐节点>获得单向防御护盾",
      "levelId": "activities/act29side/level_act29side_ex03.json"
    },
    {
      "operation": "ZT-EX-4突袭",
      "challenge": "所有敌人攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex04.json"
    },
    {
      "operation": "ZT-EX-5突袭",
      "challenge": "<调谐节点>获得单向防御护盾",
      "levelId": "activities/act29side/level_act29side_ex05.json"
    },
    {
      "operation": "ZT-EX-6突袭",
      "challenge": "巫王乐团小号手生命值和攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex06.json"
    },
    {
      "operation": "ZT-EX-7突袭",
      "challenge": "巫王乐团指挥家攻击力大幅提升",
      "levelId": "activities/act29side/level_act29side_ex07.json"
    },
    {
      "operation": "ZT-EX-8突袭",
      "challenge": "赫尔昏佐伦，“巫王”释放【慵钝惩戒】技能的频率增加，击破“慵钝之印”所需伤害次数增加",
      "levelId": "activities/act29side/level_act29side_ex08.json"
    },
    {
      "operation": "ZT-S-1突袭",
      "challenge": "禁止部署特种干员",
      "levelId": "activities/act29side/level_act29side_sub-1-1.json"
    },
    {
      "operation": "ZT-S-2突袭",
      "challenge": "激昂变奏下，巫王乐团管乐家移动速度获得额外提升",
      "levelId": "activities/act29side/level_act29side_sub-1-2.json"
    },
    {
      "operation": "ZT-S-3突袭",
      "challenge": "巫王乐团大提琴家生命值大幅提升，且在沉郁变奏下，护盾反弹的伤害大幅度提升",
      "levelId": "activities/act29side/level_act29side_sub-1-3.json"
    },
    {
      "operation": "ZT-S-4突袭",
      "challenge": "<调谐节点>技力消耗增加",
      "levelId": "activities/act29side/level_act29side_sub-1-4.json"
    },
    {
      "operation": "ZT-S-5突袭",
      "challenge": "赫尔昏佐伦，“巫王”第一形态下瞬移间隔大幅度缩短",
      "levelId": "activities/act29side/level_act29side_sub-1-5.json"
    },
    {
      "operation": "ZT-TR-1",
      "levelId": "activities/act29side/level_act29side_tr01.json"
    },
    {
      "operation": "ZT-TR-2",
      "levelId": "activities/act29side/level_act29side_tr02.json"
    },
    {
      "operation": "HS-1",
      "levelId": "activities/act31side/level_act31side_01.json"
    },
    {
      "operation": "HS-2",
      "levelId": "activities/act31side/level_act31side_02.json"
    },
    {
      "operation": "HS-3",
      "levelId": "activities/act31side/level_act31side_03.json"
    },
    {
      "operation": "HS-4",
      "levelId": "activities/act31side/level_act31side_04.json"
    },
    {
      "operation": "HS-5",
      "levelId": "activities/act31side/level_act31side_05.json"
    },
    {
      "operation": "HS-6",
      "levelId": "activities/act31side/level_act31side_06.json"
    },
    {
      "operation": "HS-7",
      "levelId": "activities/act31side/level_act31side_07.json"
    },
    {
      "operation": "HS-8",
      "levelId": "activities/act31side/level_act31side_08.json"
    },
    {
      "operation": "HS-9",
      "levelId": "activities/act31side/level_act31side_09.json"
    },
    {
      "operation": "HS-EX-1突袭",
      "challenge": "场上的<泵站>朝向改变",
      "levelId": "activities/act31side/level_act31side_ex01.json"
    },
    {
      "operation": "HS-EX-2突袭",
      "challenge": "硬毫田鼷生命值大幅提升",
      "levelId": "activities/act31side/level_act31side_ex02.json"
    },
    {
      "operation": "HS-EX-3突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_ex03.json"
    },
    {
      "operation": "HS-EX-3突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_ex03.json"
    },
    {
      "operation": "HS-EX-4突袭",
      "challenge": "勿玷位于受病害污染的田地上时，造成的法术伤害提升",
      "levelId": "activities/act31side/level_act31side_ex04.json"
    },
    {
      "operation": "HS-EX-5突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act31side/level_act31side_ex05.json"
    },
    {
      "operation": "HS-EX-6突袭",
      "challenge": "不再持有<泵站>",
      "levelId": "activities/act31side/level_act31side_ex06.json"
    },
    {
      "operation": "HS-EX-7突袭",
      "challenge": "除秽与厌肮被击倒时造成的病害污染大幅提升",
      "levelId": "activities/act31side/level_act31side_ex07.json"
    },
    {
      "operation": "HS-EX-8突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_ex08.json"
    },
    {
      "operation": "HS-EX-8突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_ex08.json"
    },
    {
      "operation": "HS-MO-1",
      "levelId": "activities/act31side/level_act31side_mo01.json"
    },
    {
      "operation": "HS-S-1突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_sub-1-1.json"
    },
    {
      "operation": "HS-S-1突袭",
      "challenge": "部分田地初始受到病害污染",
      "levelId": "activities/act31side/level_act31side_sub-1-1.json"
    },
    {
      "operation": "HS-S-2突袭",
      "challenge": "持有的<阻流阀>数量减少",
      "levelId": "activities/act31side/level_act31side_sub-1-2.json"
    },
    {
      "operation": "HS-S-3突袭",
      "challenge": "出现额外敌人",
      "levelId": "activities/act31side/level_act31side_sub-1-3.json"
    },
    {
      "operation": "HS-S-4突袭",
      "challenge": "“祟”释放如梭所需的病害程度阈值大幅降低",
      "levelId": "activities/act31side/level_act31side_sub-1-4.json"
    },
    {
      "operation": "HS-TR-1",
      "levelId": "activities/act31side/level_act31side_tr01.json"
    },
    {
      "operation": "HS-TR-2",
      "levelId": "activities/act31side/level_act31side_tr02.json"
    },
    {
      "operation": "BB-2",
      "levelId": "activities/act33side/level_act33side_02.json"
    },
    {
      "operation": "BB-3",
      "levelId": "activities/act33side/level_act33side_03.json"
    },
    {
      "operation": "BB-4",
      "levelId": "activities/act33side/level_act33side_04.json"
    },
    {
      "operation": "BB-5",
      "levelId": "activities/act33side/level_act33side_05.json"
    },
    {
      "operation": "BB-6",
      "levelId": "activities/act33side/level_act33side_06.json"
    },
    {
      "operation": "BB-7",
      "levelId": "activities/act33side/level_act33side_07.json"
    },
    {
      "operation": "BB-8",
      "levelId": "activities/act33side/level_act33side_08.json"
    },
    {
      "operation": "BB-EX-1突袭",
      "challenge": "出现额外的萨卡兹刀术师",
      "levelId": "activities/act33side/level_act33side_ex01.json"
    },
    {
      "operation": "BB-EX-2突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "activities/act33side/level_act33side_ex02.json"
    },
    {
      "operation": "BB-EX-3突袭",
      "challenge": "出现额外的流浪佣兵“编织者”",
      "levelId": "activities/act33side/level_act33side_ex03.json"
    },
    {
      "operation": "BB-EX-4突袭",
      "challenge": "赏金猎人“大骑士”的攻击力，生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_ex04.json"
    },
    {
      "operation": "BB-EX-5突袭",
      "challenge": "可同时部署人数降至6",
      "levelId": "activities/act33side/level_act33side_ex05.json"
    },
    {
      "operation": "BB-EX-6突袭",
      "challenge": "场上有8个位置无法部署",
      "levelId": "activities/act33side/level_act33side_ex06.json"
    },
    {
      "operation": "BB-EX-7突袭",
      "challenge": "自由佣兵“主音吉他”的攻击力，生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_ex07.json"
    },
    {
      "operation": "BB-EX-8突袭",
      "challenge": "障碍物部署消耗的费用大幅提升",
      "levelId": "activities/act33side/level_act33side_ex08.json"
    },
    {
      "operation": "BB-MO-1",
      "levelId": "activities/act33side/level_act33side_mo01.json"
    },
    {
      "operation": "BB-S-1突袭",
      "challenge": "出现额外的流浪佣兵“编织者”，流浪佣兵“编织者”的生命值大幅提升",
      "levelId": "activities/act33side/level_act33side_sub-1-1.json"
    },
    {
      "operation": "BB-S-2突袭",
      "challenge": "场上有6个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-2.json"
    },
    {
      "operation": "BB-S-3突袭",
      "challenge": "巫术弩炮的等级提升",
      "levelId": "activities/act33side/level_act33side_sub-1-3.json"
    },
    {
      "operation": "BB-S-4突袭",
      "challenge": "场上有5个位置无法部署",
      "levelId": "activities/act33side/level_act33side_sub-1-4.json"
    },
    {
      "operation": "BB-TR-1",
      "levelId": "activities/act33side/level_act33side_tr01.json"
    },
    {
      "operation": "AS-1",
      "levelId": "activities/act35side/level_act35side_01.json"
    },
    {
      "operation": "AS-2",
      "levelId": "activities/act35side/level_act35side_02.json"
    },
    {
      "operation": "AS-3",
      "levelId": "activities/act35side/level_act35side_03.json"
    },
    {
      "operation": "AS-4",
      "levelId": "activities/act35side/level_act35side_04.json"
    },
    {
      "operation": "AS-5",
      "levelId": "activities/act35side/level_act35side_05.json"
    },
    {
      "operation": "AS-6",
      "levelId": "activities/act35side/level_act35side_06.json"
    },
    {
      "operation": "AS-7",
      "levelId": "activities/act35side/level_act35side_07.json"
    },
    {
      "operation": "AS-8",
      "levelId": "activities/act35side/level_act35side_08.json"
    },
    {
      "operation": "AS-9",
      "levelId": "activities/act35side/level_act35side_09.json"
    },
    {
      "operation": "AS-EX-1突袭",
      "challenge": "持有的障碍物数量大幅减少",
      "levelId": "activities/act35side/level_act35side_ex01.json"
    },
    {
      "operation": "AS-EX-2突袭",
      "challenge": "净化结晶的效率大幅降低",
      "levelId": "activities/act35side/level_act35side_ex02.json"
    },
    {
      "operation": "AS-EX-3突袭",
      "challenge": "“弹跳独轮车”的攻击速度大幅增加",
      "levelId": "activities/act35side/level_act35side_ex03.json"
    },
    {
      "operation": "AS-EX-4突袭",
      "challenge": "初始出现额外的“弹跳独轮车”",
      "levelId": "activities/act35side/level_act35side_ex04.json"
    },
    {
      "operation": "AS-EX-5突袭",
      "challenge": "出现额外的工蚁组长",
      "levelId": "activities/act35side/level_act35side_ex05.json"
    },
    {
      "operation": "AS-EX-6突袭",
      "challenge": "风情区大型车辇获得<隐匿>",
      "levelId": "activities/act35side/level_act35side_ex06.json"
    },
    {
      "operation": "AS-EX-7突袭",
      "challenge": "净化结晶的效率大幅降低",
      "levelId": "activities/act35side/level_act35side_ex07.json"
    },
    {
      "operation": "AS-EX-8突袭",
      "challenge": "禁止部署特种干员",
      "levelId": "activities/act35side/level_act35side_ex08.json"
    },
    {
      "operation": "AS-MO-1",
      "levelId": "activities/act35side/level_act35side_mo01.json"
    },
    {
      "operation": "AS-S-1突袭",
      "challenge": "结晶为米奥，热烈的考验者提供的增益效果大幅增强，大型破碎器皿损失的生命值减少",
      "levelId": "activities/act35side/level_act35side_sub-1-1.json"
    },
    {
      "operation": "AS-S-2突袭",
      "challenge": "初始大型破碎器皿的行动路线有所不同，场上有2个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-2.json"
    },
    {
      "operation": "AS-S-3突袭",
      "challenge": "“弹跳独轮车”获得<隐匿>，场上有1个位置无法部署",
      "levelId": "activities/act35side/level_act35side_sub-1-3.json"
    },
    {
      "operation": "AS-S-4突袭",
      "challenge": "部署在结晶上的单位攻击速度进一步降低",
      "levelId": "activities/act35side/level_act35side_sub-1-4.json"
    },
    {
      "operation": "AS-S-4突袭",
      "challenge": "部署在结晶上的单位攻击速度进一步降低",
      "levelId": "activities/act35side/level_act35side_sub-1-4.json"
    },
    {
      "operation": "AS-TR-1",
      "levelId": "activities/act35side/level_act35side_tr01.json"
    },
    {
      "operation": "PV-1",
      "levelId": "activities/act38side/level_act38side_01.json"
    },
    {
      "operation": "PV-2",
      "levelId": "activities/act38side/level_act38side_02.json"
    },
    {
      "operation": "PV-3",
      "levelId": "activities/act38side/level_act38side_03.json"
    },
    {
      "operation": "PV-4",
      "levelId": "activities/act38side/level_act38side_04.json"
    },
    {
      "operation": "PV-5",
      "levelId": "activities/act38side/level_act38side_05.json"
    },
    {
      "operation": "PV-6",
      "levelId": "activities/act38side/level_act38side_06.json"
    },
    {
      "operation": "PV-7",
      "levelId": "activities/act38side/level_act38side_07.json"
    },
    {
      "operation": "PV-8",
      "levelId": "activities/act38side/level_act38side_08.json"
    },
    {
      "operation": "PV-9",
      "levelId": "activities/act38side/level_act38side_09.json"
    },
    {
      "operation": "PV-10",
      "levelId": "activities/act38side/level_act38side_10.json"
    },
    {
      "operation": "PV-EX-1突袭",
      "challenge": "<烟花发射器>生命值大幅度降低",
      "levelId": "activities/act38side/level_act38side_ex01.json"
    },
    {
      "operation": "PV-EX-2突袭",
      "challenge": "场上有3个位置无法部署",
      "levelId": "activities/act38side/level_act38side_ex02.json"
    },
    {
      "operation": "PV-EX-3突袭",
      "challenge": "<巡游零食车>攻击力大幅度提升",
      "levelId": "activities/act38side/level_act38side_ex03.json"
    },
    {
      "operation": "PV-EX-4突袭",
      "challenge": "我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_ex04.json"
    },
    {
      "operation": "PV-EX-5突袭",
      "challenge": "初始场上出现<“美食速递”>",
      "levelId": "activities/act38side/level_act38side_ex05.json"
    },
    {
      "operation": "PV-EX-6突袭",
      "challenge": "<烟花发射器>引线火苗变弱",
      "levelId": "activities/act38side/level_act38side_ex06.json"
    },
    {
      "operation": "PV-EX-7突袭",
      "challenge": "初始场上的<专业竞演者>路线改变",
      "levelId": "activities/act38side/level_act38side_ex07.json"
    },
    {
      "operation": "PV-EX-8突袭",
      "challenge": "我方单位再部署时间延长",
      "levelId": "activities/act38side/level_act38side_ex08.json"
    },
    {
      "operation": "PV-SP-1",
      "levelId": "activities/act38side/level_act38side_sp01.json"
    },
    {
      "operation": "PV-SP-2",
      "levelId": "activities/act38side/level_act38side_sp02.json"
    },
    {
      "operation": "PV-SP-3",
      "levelId": "activities/act38side/level_act38side_sp03.json"
    },
    {
      "operation": "PV-S-1突袭",
      "challenge": "所有<“美食速递”>替换为<“醉后狂欢”>，且我方单位阻挡数-1",
      "levelId": "activities/act38side/level_act38side_sub-1-1.json"
    },
    {
      "operation": "PV-S-2突袭",
      "challenge": "所有<巡游爵士乐手>替换为<“美食速递”>",
      "levelId": "activities/act38side/level_act38side_sub-1-2.json"
    },
    {
      "operation": "PV-S-3突袭",
      "challenge": "<烟花发射器>引线燃烧速度降低",
      "levelId": "activities/act38side/level_act38side_sub-1-3.json"
    },
    {
      "operation": "PV-S-4突袭",
      "challenge": "场上出现额外的<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-4.json"
    },
    {
      "operation": "PV-S-5突袭",
      "challenge": "场上出现额外的<热烈舞团领舞者>，且所有<专业竞演者>替换为<巡游零食车>",
      "levelId": "activities/act38side/level_act38side_sub-1-5.json"
    },
    {
      "operation": "PV-TR-1",
      "levelId": "activities/act38side/level_act38side_tr01.json"
    },
    {
      "operation": "EA-1",
      "levelId": "activities/act41side/level_act41side_01.json"
    },
    {
      "operation": "EA-2",
      "levelId": "activities/act41side/level_act41side_02.json"
    },
    {
      "operation": "EA-3",
      "levelId": "activities/act41side/level_act41side_03.json"
    },
    {
      "operation": "EA-4",
      "levelId": "activities/act41side/level_act41side_04.json"
    },
    {
      "operation": "EA-5",
      "levelId": "activities/act41side/level_act41side_05.json"
    },
    {
      "operation": "EA-6",
      "levelId": "activities/act41side/level_act41side_06.json"
    },
    {
      "operation": "EA-7",
      "levelId": "activities/act41side/level_act41side_07.json"
    },
    {
      "operation": "EA-8",
      "levelId": "activities/act41side/level_act41side_08.json"
    },
    {
      "operation": "EA-8",
      "levelId": "activities/act41side/level_act41side_08.json"
    },
    {
      "operation": "EA-EX-1突袭",
      "challenge": "初始场上的<空壳>不再出现",
      "levelId": "activities/act41side/level_act41side_ex01.json"
    },
    {
      "operation": "EA-EX-2突袭",
      "challenge": "场上有3个位置无法部署",
      "levelId": "activities/act41side/level_act41side_ex02.json"
    },
    {
      "operation": "EA-EX-3突袭",
      "challenge": "指路草获得<隐匿>",
      "levelId": "activities/act41side/level_act41side_ex03.json"
    },
    {
      "operation": "EA-EX-4突袭",
      "challenge": "地形和敌人等有所不同",
      "levelId": "activities/act41side/level_act41side_ex04.json"
    },
    {
      "operation": "EA-EX-5突袭",
      "challenge": "战场上额外出现4个<盾与墙>",
      "levelId": "activities/act41side/level_act41side_ex05.json"
    },
    {
      "operation": "EA-EX-6突袭",
      "challenge": "<盾与墙>初始位置改变",
      "levelId": "activities/act41side/level_act41side_ex06.json"
    },
    {
      "operation": "EA-EX-7突袭",
      "challenge": "场上有5个位置无法部署",
      "levelId": "activities/act41side/level_act41side_ex07.json"
    },
    {
      "operation": "EA-EX-8突袭",
      "challenge": "战场上额外出现2个<盾与墙>",
      "levelId": "activities/act41side/level_act41side_ex08.json"
    },
    {
      "operation": "EA-EX-8突袭",
      "challenge": "战场上额外出现2个<盾与墙>",
      "levelId": "activities/act41side/level_act41side_ex08.json"
    },
    {
      "operation": "EA-TR-1",
      "levelId": "activities/act41side/level_act41side_tr01.json"
    },
    {
      "operation": "MT-1",
      "levelId": "activities/act42side/level_act42side_01.json"
    },
    {
      "operation": "MT-2",
      "levelId": "activities/act42side/level_act42side_02.json"
    },
    {
      "operation": "MT-3",
      "levelId": "activities/act42side/level_act42side_03.json"
    },
    {
      "operation": "MT-4",
      "levelId": "activities/act42side/level_act42side_04.json"
    },
    {
      "operation": "MT-5",
      "levelId": "activities/act42side/level_act42side_05.json"
    },
    {
      "operation": "MT-6",
      "levelId": "activities/act42side/level_act42side_06.json"
    },
    {
      "operation": "MT-7",
      "levelId": "activities/act42side/level_act42side_07.json"
    },
    {
      "operation": "MT-8",
      "levelId": "activities/act42side/level_act42side_08.json"
    },
    {
      "operation": "MT-9",
      "levelId": "activities/act42side/level_act42side_09.json"
    },
    {
      "operation": "MT-10",
      "levelId": "activities/act42side/level_act42side_10.json"
    },
    {
      "operation": "MT-EX-1突袭",
      "challenge": "法术抗性提升",
      "levelId": "activities/act42side/level_act42side_ex01.json"
    },
    {
      "operation": "MT-EX-2突袭",
      "challenge": "<“萨科塔昂首”>生命值提升",
      "levelId": "activities/act42side/level_act42side_ex02.json"
    },
    {
      "operation": "MT-EX-3突袭",
      "challenge": "<圣堂射手扮演者>不再出现",
      "levelId": "activities/act42side/level_act42side_ex03.json"
    },
    {
      "operation": "MT-EX-4突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act42side/level_act42side_ex04.json"
    },
    {
      "operation": "MT-EX-5突袭",
      "challenge": "<圣徒祈祷像>和<“牧首”>提供屏障的速率提升",
      "levelId": "activities/act42side/level_act42side_ex05.json"
    },
    {
      "operation": "MT-EX-6突袭",
      "challenge": "<资深圣堂布道员>技能持续时间提升",
      "levelId": "activities/act42side/level_act42side_ex06.json"
    },
    {
      "operation": "MT-EX-7突袭",
      "challenge": "可同时部署干员单位数-2",
      "levelId": "activities/act42side/level_act42side_ex07.json"
    },
    {
      "operation": "MT-EX-8突袭",
      "challenge": "术师、医疗干员部署费用变为2倍",
      "levelId": "activities/act42side/level_act42side_ex08.json"
    },
    {
      "operation": "MT-S-1突袭",
      "challenge": "出现额外敌人且部分<冰淇淋机>初始阵营改变",
      "levelId": "activities/act42side/level_act42side_sub-1-1.json"
    },
    {
      "operation": "MT-S-2突袭",
      "challenge": "出现额外敌人且<荒原窃盗者精英>获得隐匿",
      "levelId": "activities/act42side/level_act42side_sub-1-2.json"
    },
    {
      "operation": "MT-S-3突袭",
      "challenge": "出现额外敌人且<资深圣堂保育员>生命值提升",
      "levelId": "activities/act42side/level_act42side_sub-1-3.json"
    },
    {
      "operation": "MT-S-4突袭",
      "challenge": "<腐败萃聚使徒>位置和路线变化",
      "levelId": "activities/act42side/level_act42side_sub-1-4.json"
    },
    {
      "operation": "MT-S-5突袭",
      "challenge": "<“圣徒”>额外进行一次<寻根圣事>",
      "levelId": "activities/act42side/level_act42side_sub-1-5.json"
    },
    {
      "operation": "MT-TR-1",
      "levelId": "activities/act42side/level_act42side_tr01.json"
    },
    {
      "operation": "AD-1",
      "levelId": "activities/act43side/level_act43side_01.json"
    },
    {
      "operation": "AD-2",
      "levelId": "activities/act43side/level_act43side_02.json"
    },
    {
      "operation": "AD-3",
      "levelId": "activities/act43side/level_act43side_03.json"
    },
    {
      "operation": "AD-4",
      "levelId": "activities/act43side/level_act43side_04.json"
    },
    {
      "operation": "AD-5",
      "levelId": "activities/act43side/level_act43side_05.json"
    },
    {
      "operation": "AD-6",
      "levelId": "activities/act43side/level_act43side_06.json"
    },
    {
      "operation": "AD-7",
      "levelId": "activities/act43side/level_act43side_07.json"
    },
    {
      "operation": "AD-8",
      "levelId": "activities/act43side/level_act43side_08.json"
    },
    {
      "operation": "AD-EX-1突袭",
      "challenge": "部署费用的回复速度降低",
      "levelId": "activities/act43side/level_act43side_ex01.json"
    },
    {
      "operation": "AD-EX-2突袭",
      "challenge": "特种干员的部署费用提升至1.5倍",
      "levelId": "activities/act43side/level_act43side_ex02.json"
    },
    {
      "operation": "AD-EX-3突袭",
      "challenge": "出现额外的顺从内心的设计师",
      "levelId": "activities/act43side/level_act43side_ex03.json"
    },
    {
      "operation": "AD-EX-4突袭",
      "challenge": "出现额外的沉浸艺术的群演，且沉浸艺术的群演获得隐匿",
      "levelId": "activities/act43side/level_act43side_ex04.json"
    },
    {
      "operation": "AD-EX-5突袭",
      "challenge": "战场上额外出现<打光道具>",
      "levelId": "activities/act43side/level_act43side_ex05.json"
    },
    {
      "operation": "AD-EX-6突袭",
      "challenge": "<打光道具>的生命值提升",
      "levelId": "activities/act43side/level_act43side_ex06.json"
    },
    {
      "operation": "AD-EX-7突袭",
      "challenge": "场上有1个位置无法部署，且意识自由的假人移动速度提升",
      "levelId": "activities/act43side/level_act43side_ex07.json"
    },
    {
      "operation": "AD-EX-8突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "activities/act43side/level_act43side_ex08.json"
    },
    {
      "operation": "AD-TR-1",
      "levelId": "activities/act43side/level_act43side_tr01.json"
    },
    {
      "operation": "TN-2突袭",
      "challenge": "敌方单位的攻击力提升至115%，生命值提升至120%\n碎骨的攻击力额外提升至120%，防御力和生命值额外提升至150%\n浮士德的攻击力额外提升至130%，生命值额外提升至150%，特殊狙击的伤害提升至150%\n霜星，“冬痕”的攻击力额外提升至120%，生命值额外提升至150%，冰环的冷却时间缩短至75%",
      "levelId": "activities/act4bossrush/level_bossrush4_02.json"
    },
    {
      "operation": "H12-1",
      "levelId": "obt/hard/level_hard_12-01.json"
    },
    {
      "operation": "H12-2",
      "levelId": "obt/hard/level_hard_12-02.json"
    },
    {
      "operation": "H12-3",
      "levelId": "obt/hard/level_hard_12-03.json"
    },
    {
      "operation": "H12-4",
      "levelId": "obt/hard/level_hard_12-04.json"
    },
    {
      "operation": "H14-3",
      "levelId": "obt/hard/level_hard_14-03.json"
    },
    {
      "operation": "H15-1",
      "levelId": "obt/hard/level_hard_15-01.json"
    },
    {
      "operation": "H15-2",
      "levelId": "obt/hard/level_hard_15-02.json"
    },
    {
      "operation": "H15-3",
      "levelId": "obt/hard/level_hard_15-03.json"
    },
    {
      "operation": "H15-4",
      "levelId": "obt/hard/level_hard_15-04.json"
    },
    {
      "operation": "12-16",
      "levelId": "obt/main/level_main_12-14.json"
    },
    {
      "operation": "15-4突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-03.json"
    },
    {
      "operation": "15-5突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-04.json"
    },
    {
      "operation": "15-6突袭",
      "challenge": "内测版自助出餐终端召唤技能冷却时间减少",
      "levelId": "obt/main/level_main_15-05.json"
    },
    {
      "operation": "15-7突袭",
      "challenge": "内测版自助出餐终端召唤技能冷却时间减少",
      "levelId": "obt/main/level_main_15-06.json"
    },
    {
      "operation": "15-8突袭",
      "challenge": "稳定态萨卡兹术师结晶的防御力大幅提升",
      "levelId": "obt/main/level_main_15-07.json"
    },
    {
      "operation": "15-9突袭",
      "challenge": "战场中有4个位置无法部署我方单位",
      "levelId": "obt/main/level_main_15-08.json"
    },
    {
      "operation": "15-10突袭",
      "challenge": "敌人的防御力大幅提升",
      "levelId": "obt/main/level_main_15-09.json"
    },
    {
      "operation": "15-11突袭",
      "challenge": "部署费用的回复速度降低",
      "levelId": "obt/main/level_main_15-10.json"
    },
    {
      "operation": "15-12突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-11.json"
    },
    {
      "operation": "15-13突袭",
      "challenge": "我方单位的攻击力降低",
      "levelId": "obt/main/level_main_15-12.json"
    },
    {
      "operation": "15-14突袭",
      "challenge": "部分地块会长出源石晶簇造成范围伤害",
      "levelId": "obt/main/level_main_15-13.json"
    },
    {
      "operation": "15-14突袭",
      "challenge": "部分地块会长出源石晶簇造成范围伤害",
      "levelId": "obt/main/level_main_15-13.json"
    },
    {
      "operation": "15-15突袭",
      "challenge": "部分敌人有所不同",
      "levelId": "obt/main/level_main_15-14.json"
    },
    {
      "operation": "15-17突袭",
      "challenge": "敌人的攻击力大幅提升",
      "levelId": "obt/main/level_main_15-15.json"
    },
    {
      "operation": "15-18突袭",
      "challenge": "我方单位的防御力降低",
      "levelId": "obt/main/level_main_15-16.json"
    },
    {
      "operation": "15-19",
      "levelId": "obt/main/level_main_15-17.json"
    },
    {
      "operation": "15-20突袭",
      "challenge": "敌人的移动速度提升",
      "levelId": "obt/main/level_main_15-18.json"
    },
    {
      "operation": "TR-22",
      "levelId": "obt/training/level_training_22.json"
    },
    {
      "operation": "TR-23",
      "levelId": "obt/training/level_training_23.json"
    },
    {
      "operation": "TR-26",
      "levelId": "obt/training/level_training_26.json"
    }
  ],
  //修改单位再部署时间
  "char_respawntime_add": [
    {
      "operation": "SN-EX-3突袭",
      "challenge": "敌方单位的生命值提升至130%，障碍物的再部署时间额外增加100秒",
      "levelId": "activities/act17side/level_act17side_ex03.json"
    },
    {
      "operation": "SL-P-1",
      "levelId": "activities/act27side/level_act27side_sp01.json"
    },
    {
      "operation": "SL-P-3",
      "levelId": "activities/act27side/level_act27side_sp03.json"
    },
    {
      "operation": "ZT-EX-2突袭",
      "challenge": "<湮灭之相>再部署时间延长",
      "levelId": "activities/act29side/level_act29side_ex02.json"
    }
  ],
  //可部署干员数量修改
  "gbuff_placable_char_num": [
    {
      "operation": "WD-EX-5突袭",
      "challenge": "敌方单位的攻击力和生命值提升至110%，防御力提升至105%，可部署单位上限减少1。",
      "levelId": "activities/act18d0/level_act18d0_ex05.json"
    },
    {
      "operation": "1-1突袭",
      "challenge": "同时可布置干员数降至4  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-01.json"
    },
    {
      "operation": "1-2",
      "levelId": "obt/main/level_main_01-02.json"
    },
    {
      "operation": "4-6突袭",
      "challenge": "可部署单位上限减少3  敌方单位的生命值提升至125%，攻击力和防御力都提升至110%",
      "levelId": "obt/main/level_main_04-06.json"
    },
    {
      "operation": "R8-10突袭",
      "challenge": "可部署单位上限减少3  敌方单位的攻击力、防御力、生命值提升至110%",
      "levelId": "obt/main/level_main_08-11.json"
    }
  ],
  //地图tile的能力（例如FC的燃烧芦苇丛）
  "map_tile_blackb_assign": [
    {
      "operation": "SE-1突袭",
      "challenge": "<源石污染区>所在地块改变",
      "levelId": "activities/act18mini/level_act18mini_01.json"
    },
    {
      "operation": "SE-2突袭",
      "challenge": "出现额外的深池逐火战士",
      "levelId": "activities/act18mini/level_act18mini_02.json"
    },
    {
      "operation": "SE-3突袭",
      "challenge": "场上3处芦苇丛初始被点燃",
      "levelId": "activities/act18mini/level_act18mini_03.json"
    },
    {
      "operation": "FC-1",
      "levelId": "activities/act22side/level_act22side_01.json"
    },
    {
      "operation": "FC-2",
      "levelId": "activities/act22side/level_act22side_02.json"
    },
    {
      "operation": "FC-3",
      "levelId": "activities/act22side/level_act22side_03.json"
    },
    {
      "operation": "FC-4",
      "levelId": "activities/act22side/level_act22side_04.json"
    },
    {
      "operation": "FC-5",
      "levelId": "activities/act22side/level_act22side_05.json"
    },
    {
      "operation": "FC-6",
      "levelId": "activities/act22side/level_act22side_06.json"
    },
    {
      "operation": "FC-7",
      "levelId": "activities/act22side/level_act22side_07.json"
    },
    {
      "operation": "FC-8",
      "levelId": "activities/act22side/level_act22side_08.json"
    },
    {
      "operation": "FC-EX-2突袭",
      "challenge": "深池弩炮队长攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex02.json"
    },
    {
      "operation": "FC-EX-3突袭",
      "challenge": "深池逐火精锐战士攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex03.json"
    },
    {
      "operation": "FC-EX-4突袭",
      "challenge": "场上额外1处芦苇丛初始被点燃",
      "levelId": "activities/act22side/level_act22side_ex04.json"
    },
    {
      "operation": "FC-EX-5突袭",
      "challenge": "燃烧的芦苇丛造成的法术伤害与灼燃损伤提升",
      "levelId": "activities/act22side/level_act22side_ex05.json"
    },
    {
      "operation": "FC-EX-5突袭",
      "challenge": "燃烧的芦苇丛造成的法术伤害与灼燃损伤提升",
      "levelId": "activities/act22side/level_act22side_ex05.json"
    },
    {
      "operation": "FC-EX-6突袭",
      "challenge": "深池逐火精锐护卫攻击力大幅提升",
      "levelId": "activities/act22side/level_act22side_ex06.json"
    },
    {
      "operation": "FC-EX-7突袭",
      "challenge": "深池逐火精锐护卫和“校官”获得隐匿",
      "levelId": "activities/act22side/level_act22side_ex07.json"
    },
    {
      "operation": "FC-EX-8突袭",
      "challenge": "场上6处芦苇丛初始被点燃",
      "levelId": "activities/act22side/level_act22side_ex08.json"
    },
    {
      "operation": "FC-TR-1",
      "levelId": "activities/act22side/level_act22side_tr01.json"
    },
    {
      "operation": "FC-TR-2",
      "levelId": "activities/act22side/level_act22side_tr02.json"
    },
    {
      "operation": "TN-3突袭",
      "challenge": "敌方单位的攻击力、防御力和生命值都提升至110%\n“鼠王”的攻击力和防御力额外提升至110%，生命值提升至130%，护盾吸收的伤害量提升至300%\n“巨大的丑东西”的攻击力和防御力额外提升至110%，生命值额外提升至120%，近战攻击力提升50%\n腐败骑士和凋零骑士的攻击力和防御力额外提升至110%，生命值额外提升至130%，一方死亡/进入终点时，另一方攻击力额外提升50%，攻击速度额外增加50，移动速度额外提升30%",
      "levelId": "activities/act4bossrush/level_bossrush4_03.json"
    }
  ],
  //障碍物数量修改
  "cbuff_token_initial_cnt": [
    {
      "operation": "SE-6突袭",
      "challenge": "可使用障碍物数量减少2",
      "levelId": "activities/act18mini/level_act18mini_06.json"
    },
    {
      "operation": "OF-EX6突袭",
      "challenge": "障碍物的可部署数量减少至6个  敌方单位生命值提升至120%，攻击力和防御力都提升至110%",
      "levelId": "activities/act3d0/level_act3d0_ex06.json"
    },
    {
      "operation": "1-6突袭",
      "challenge": "可使用的障碍物数量降至1  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-06.json"
    },
    {
      "operation": "3-7突袭",
      "challenge": "可使用障碍物数量减少2  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_03-07.json"
    }
  ],
  "env_gbuff_new_with_verify": [
    {
      "operation": "DT-1",
      "levelId": "activities/act36side/level_act36side_01.json"
    },
    {
      "operation": "DT-2",
      "levelId": "activities/act36side/level_act36side_02.json"
    },
    {
      "operation": "DT-3",
      "levelId": "activities/act36side/level_act36side_03.json"
    },
    {
      "operation": "DT-4",
      "levelId": "activities/act36side/level_act36side_04.json"
    },
    {
      "operation": "DT-5",
      "levelId": "activities/act36side/level_act36side_05.json"
    },
    {
      "operation": "DT-6",
      "levelId": "activities/act36side/level_act36side_06.json"
    },
    {
      "operation": "DT-7",
      "levelId": "activities/act36side/level_act36side_07.json"
    },
    {
      "operation": "DT-8",
      "levelId": "activities/act36side/level_act36side_08.json"
    },
    {
      "operation": "DT-EX-1突袭",
      "challenge": "饿肚子流失更多生命，且敌人生命值大幅提升",
      "levelId": "activities/act36side/level_act36side_ex01.json"
    },
    {
      "operation": "DT-EX-2突袭",
      "challenge": "出现额外的<暴走食人花>",
      "levelId": "activities/act36side/level_act36side_ex02.json"
    },
    {
      "operation": "DT-EX-3突袭",
      "challenge": "<简饲源石虫>与<精饲源石虫>隐匿",
      "levelId": "activities/act36side/level_act36side_ex03.json"
    },
    {
      "operation": "DT-EX-4突袭",
      "challenge": "饿肚子流失更多生命",
      "levelId": "activities/act36side/level_act36side_ex04.json"
    },
    {
      "operation": "DT-EX-5突袭",
      "challenge": "初始场上的<硕果虫>不再出现",
      "levelId": "activities/act36side/level_act36side_ex05.json"
    },
    {
      "operation": "DT-EX-6突袭",
      "challenge": "敌人的生命值和攻击力大幅提升，开饭需要的食材大幅提升",
      "levelId": "activities/act36side/level_act36side_ex06.json"
    },
    {
      "operation": "DT-EX-7突袭",
      "challenge": "出现道路障碍物",
      "levelId": "activities/act36side/level_act36side_ex07.json"
    },
    {
      "operation": "DT-EX-8突袭",
      "challenge": "<“三头犬”>狂暴状态下攻击力、移动速度大幅提升",
      "levelId": "activities/act36side/level_act36side_ex08.json"
    },
    {
      "operation": "DT-TR-1",
      "levelId": "activities/act36side/level_act36side_tr01.json"
    },
    {
      "operation": "DT-TR-1",
      "levelId": "activities/act36side/level_act36side_tr01.json"
    },
    {
      "operation": "DT-TR-1",
      "levelId": "activities/act36side/level_act36side_tr01.json"
    },
    {
      "operation": "AD-EX-6突袭",
      "challenge": "<打光道具>的生命值提升",
      "levelId": "activities/act43side/level_act43side_ex06.json"
    },
    {
      "operation": "H12-1",
      "levelId": "obt/hard/level_hard_12-01.json"
    },
    {
      "operation": "H12-3",
      "levelId": "obt/hard/level_hard_12-03.json"
    },
    {
      "operation": "H12-4",
      "levelId": "obt/hard/level_hard_12-04.json"
    },
    {
      "operation": "H12-4",
      "levelId": "obt/hard/level_hard_12-04.json"
    }
  ],
  "ebuff_talent_blackb_add": [],
  //我方单位属性修改
  "cbuff_attribute": [
    {
      "operation": "LK-DP-B",
      "levelId": "activities/act1lock/level_act1lock_b-02.json"
    },
    {
      "operation": "0-2突袭",
      "challenge": "我方所有单位攻击力减半",
      "levelId": "obt/main/level_main_00-02.json"
    },
    {
      "operation": "0-8突袭",
      "challenge": "我方所有单位的最大生命值减半  敌方单位的生命值、攻击力、防御力都提升至120% ",
      "levelId": "obt/main/level_main_00-08.json"
    },
    {
      "operation": "0-10突袭",
      "challenge": "我方所有单位的防御力减半  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-10.json"
    },
    {
      "operation": "3-5突袭",
      "challenge": "医疗及重装职业干员的攻击力减半  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_03-05.json"
    },
    {
      "operation": "4-2突袭",
      "challenge": "我方所有单位的防御力减半  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_04-02.json"
    },
    {
      "operation": "4-5突袭",
      "challenge": "我方所有近战单位的生命值减半  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_04-05.json"
    },
    {
      "operation": "5-1突袭",
      "challenge": "我方所有近战单位的攻击力减半  敌方单位的生命值和攻击力都提升至105%",
      "levelId": "obt/main/level_main_05-01.json"
    }
  ],
  //最大cost修改
  "cbuff_max_cost": [
    {
      "operation": "H12-1",
      "levelId": "obt/hard/level_hard_12-01.json"
    },
    {
      "operation": "H12-2",
      "levelId": "obt/hard/level_hard_12-02.json"
    },
    {
      "operation": "H12-3",
      "levelId": "obt/hard/level_hard_12-03.json"
    },
    {
      "operation": "H12-4",
      "levelId": "obt/hard/level_hard_12-04.json"
    },
    {
      "operation": "12-16",
      "levelId": "obt/main/level_main_12-14.json"
    },
    {
      "operation": "TR-22",
      "levelId": "obt/training/level_training_22.json"
    },
    {
      "operation": "TR-23",
      "levelId": "obt/training/level_training_23.json"
    }
  ],
  "cooperate_enemy_side_shared": [],
  "global_cost_recovery": [],
  //费用增加
  "char_cost_add": [
    {
      "operation": "RS-EX-8突袭",
      "challenge": "<点火石>费用增加至20",
      "levelId": "activities/act30side/level_act30side_ex08.json"
    }
  ],
  "char_skill_cd_add": [],
  "enemy_skill_blackb_add": [
    {
      "operation": "HE-EX-8突袭",
      "challenge": "落石对我方单位伤害大幅提升",
      "levelId": "activities/act26side/level_act26side_ex08.json"
    }
  ],
  "char_talent_blackb_assign": [
    {
      "operation": "DT-EX-1突袭",
      "challenge": "饿肚子流失更多生命，且敌人生命值大幅提升",
      "levelId": "activities/act36side/level_act36side_ex01.json"
    },
    {
      "operation": "DT-EX-1突袭",
      "challenge": "饿肚子流失更多生命，且敌人生命值大幅提升",
      "levelId": "activities/act36side/level_act36side_ex01.json"
    },
    {
      "operation": "DT-EX-2突袭",
      "challenge": "出现额外的<暴走食人花>",
      "levelId": "activities/act36side/level_act36side_ex02.json"
    },
    {
      "operation": "DT-EX-3突袭",
      "challenge": "<简饲源石虫>与<精饲源石虫>隐匿",
      "levelId": "activities/act36side/level_act36side_ex03.json"
    },
    {
      "operation": "DT-EX-4突袭",
      "challenge": "饿肚子流失更多生命",
      "levelId": "activities/act36side/level_act36side_ex04.json"
    },
    {
      "operation": "DT-EX-4突袭",
      "challenge": "饿肚子流失更多生命",
      "levelId": "activities/act36side/level_act36side_ex04.json"
    },
    {
      "operation": "DT-EX-5突袭",
      "challenge": "初始场上的<硕果虫>不再出现",
      "levelId": "activities/act36side/level_act36side_ex05.json"
    },
    {
      "operation": "DT-EX-6突袭",
      "challenge": "敌人的生命值和攻击力大幅提升，开饭需要的食材大幅提升",
      "levelId": "activities/act36side/level_act36side_ex06.json"
    },
    {
      "operation": "DT-EX-7突袭",
      "challenge": "出现道路障碍物",
      "levelId": "activities/act36side/level_act36side_ex07.json"
    },
    {
      "operation": "DT-EX-8突袭",
      "challenge": "<“三头犬”>狂暴状态下攻击力、移动速度大幅提升",
      "levelId": "activities/act36side/level_act36side_ex08.json"
    },
    {
      "operation": "15-2",
      "levelId": "obt/main/level_main_15-01.json"
    }
  ],
  "global_enemy_taunt_level_pow": [
    {
      "operation": "EP-6",
      "levelId": "activities/act39side/level_act39side_06.json"
    },
    {
      "operation": "EP-7",
      "levelId": "activities/act39side/level_act39side_07.json"
    },
    {
      "operation": "EP-8",
      "levelId": "activities/act39side/level_act39side_08.json"
    },
    {
      "operation": "EP-EX-4突袭",
      "challenge": "场上额外出现2个恐怖厨子",
      "levelId": "activities/act39side/level_act39side_ex04.json"
    },
    {
      "operation": "EP-EX-5突袭",
      "challenge": "恐怖厨子减少物理与法术伤害的比例提升",
      "levelId": "activities/act39side/level_act39side_ex05.json"
    },
    {
      "operation": "EP-EX-6突袭",
      "challenge": "禁止部署重装和特种干员",
      "levelId": "activities/act39side/level_act39side_ex06.json"
    },
    {
      "operation": "EP-EX-7突袭",
      "challenge": "场上三个位置不可部署",
      "levelId": "activities/act39side/level_act39side_ex07.json"
    },
    {
      "operation": "EP-EX-8突袭",
      "challenge": "美声水手长召唤历险水手的间隔缩短",
      "levelId": "activities/act39side/level_act39side_ex08.json"
    },
    {
      "operation": "EP-TR-1",
      "levelId": "activities/act39side/level_act39side_tr01.json"
    }
  ],
  //敌人攻击范围修改
  "ebuff_attack_radius": [
    {
      "operation": "OF-EX1突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110%  敌方远程单位攻击范围提升至200%",
      "levelId": "activities/act3d0/level_act3d0_ex01.json"
    },
    {
      "operation": "1-10突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至120%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_01-10.json"
    },
    {
      "operation": "2-7突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至120%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_02-07.json"
    },
    {
      "operation": "4-1突袭",
      "challenge": "敌方单位的生命值、攻击力、防御力都提升至110%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_04-01.json"
    },
    {
      "operation": "4-10突袭",
      "challenge": "敌方单位的生命值提升至125%，攻击力提升至115%，防御力提升至110%",
      "levelId": "obt/main/level_main_04-10.json"
    },
    {
      "operation": "5-3突袭",
      "challenge": "敌方单位的生命值提升至120%、攻击力提升至110%  敌方远程单位攻击范围提升至200%",
      "levelId": "obt/main/level_main_05-03.json"
    }
  ],
  //自然回费速率降低XX倍
  "cbuff_cost_recovery": [
    {
      "operation": "OF-EX5突袭",
      "challenge": "部署费用的自然回复速度降低三分之二  敌方单位生命值提升至110%",
      "levelId": "activities/act3d0/level_act3d0_ex05.json"
    },
    {
      "operation": "0-1突袭",
      "challenge": "部署费用不自然回复",
      "levelId": "obt/main/level_main_00-01.json"
    },
    {
      "operation": "0-6突袭",
      "challenge": "部署费用的自然回复速度降至一半  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-06.json"
    },
    {
      "operation": "1-7突袭",
      "challenge": "部署费用的自然回复速度减半  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_01-07.json"
    },
    {
      "operation": "3-2突袭",
      "challenge": "部署费用的自然回复速度降低三分之一  敌方单位的生命值和防御力都提升至120%，攻击力提升至110%",
      "levelId": "obt/main/level_main_03-02.json"
    },
    {
      "operation": "3-4突袭",
      "challenge": "部署费用的自然回复速度降低三分之一  敌方单位的生命值、攻击力、防御力都提升至110%",
      "levelId": "obt/main/level_main_03-04.json"
    }
  ],
  "char_dynamic_ability_new": [],
  "char_attribute_mulkkk": [
    {
      "operation": "H15-3",
      "levelId": "obt/hard/level_hard_15-03.json"
    }
  ],
  "cbuff_initial_cost": [
    {
      "operation": "0-6突袭",
      "challenge": "部署费用的自然回复速度降至一半  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_00-06.json"
    }
  ],
  "ebuff_skill_cd": [
    {
      "operation": "1-8突袭",
      "challenge": "敌方单位的生命值提升至150%，攻击力和防御力都提升至120%  敌方头目的能力冷却降低至35%",
      "levelId": "obt/main/level_main_01-08.json"
    },
    {
      "operation": "1-11",
      "levelId": "obt/main/level_main_01-11.json"
    }
  ],
  //敌人重量修改
  "ebuff_weight": [
    {
      "operation": "2-8突袭",
      "challenge": "敌方单位的生命值和防御力都提升至120%，攻击力提升至110%  重量增加二个等级",
      "levelId": "obt/main/level_main_02-08.json"
    },
    {
      "operation": "3-3突袭",
      "challenge": "敌方单位的重量增加一个等级  敌方单位的生命值提升至120%，攻击力和防御力都提升至110%",
      "levelId": "obt/main/level_main_03-03.json"
    }
  ],
  //我方单位再部署时间修改
  "cbuff_respawn_time": [
    {
      "operation": "4-8突袭",
      "challenge": "我方所有单位的再部署时间加倍  敌方单位的生命值、攻击力、防御力都提升至120%",
      "levelId": "obt/main/level_main_04-08.json"
    },
    {
      "operation": "5-5突袭",
      "challenge": "我方所有单位的再部署时间加倍  敌方单位的生命值提升至125%",
      "levelId": "obt/main/level_main_05-05.json"
    }
  ],
  "ebuff_skill_radius": [
    {
      "operation": "4-10突袭",
      "challenge": "敌方单位的生命值提升至125%，攻击力提升至115%，防御力提升至110%",
      "levelId": "obt/main/level_main_04-10.json"
    }
  ],
  "level_deck_cards_enable": [
    {
      "operation": "14-10",
      "levelId": "obt/main/level_main_14-09.json"
    }
  ],
  "level_input_card_delete": [
    {
      "operation": "15-19",
      "levelId": "obt/main/level_main_15-17.json"
    }
  ],
  "HP_RECOVERY_PER_SEC_BY_MAX_HP_RATIO": []
}