<template>
  <div class="notice">
    <el-popover
      class="box-item"
      placement="bottom-start"
      :width="600"
    >
      <template #reference> 
        <el-link type="danger">{{$t('info.UpdateNotice')}}</el-link>
      </template>
      <p style="color: red;">11.1更新：雪山降临地图和敌人机制完成(差小雪伞待更新)</p>
      <p style="color: red;">10.26更新：完成引航者试炼波次转换机制</p>
      <p style="color: red;">10.14更新：修复主线Sub关卡不显示的bug</p>
      <p style="color: red;">10.3更新：添加0.2倍速、修复全息作战矩阵UI位置异常bug</p>
      <p style="color: red;">9.25更新：部分本地化文本、次生预案资源加载</p>
      <p style="color: red;">9.19更新：添加PRTS.WIKI和少人wiki外链，完成追迹日落以西机制</p>
      <p style="color: red;">9.16更新：15章机制完成</p>
      <p style="color: red;">9.4更新：无忧梦呓资源加载</p>
      <!-- <p style="color: red;">9.1更新：重写和拓展底层出怪机制，修复一些bug</p>
      <p style="color: red;">8.28更新：全息作战矩阵数据更新完成</p> -->
      <!-- <p style="color: red;">8.25更新：太阳甩在身后机制完成</p>
      <p style="color: red;">8.21更新：众生行记敌人机制完善</p> -->
      <!-- <p style="color: red;">8.16更新：添加碰撞检测，添加雷遁忍者技能。添加当期合约地图（暂无tag）</p> -->
      <!-- <p style="color: red;">8.14更新：“墟”S关地图更新</p>
      <p style="color: red;">8.12更新：孤星机制优化</p>
      <p style="color: red;">8.9更新：完成路线显示功能</p>
      <p style="color: red;">8.6更新：完成惯性和避障力</p>
      <p style="color: red;">8.5更新：新活动敌人、装置技能基本完成适配，雷遁忍者跳跃暂未实现。</p> -->
      <p></p>

      <template v-if="language === 'CN'">
        <p>
          目前项目还处于测试运行阶段，基础框架搭好了，但是方舟各个活动、主线机制复杂多样，
          每个活动都得独立做适配，我首先保证当期活动是没问题的。
        </p>
        <p>小服务器，承载能力可能不够，如果卡顿请见谅</p>
        <p>
          开发者：露托official : 
          <el-link href="https://space.bilibili.com/10356132" type="primary">B站主页</el-link>
          ，欢迎关注！
        </p>
      </template>

      <template v-else-if="language === 'JP'">
        <p>
          現在、プロジェクトはまだテスト運転段階にあります。基礎的なフレームワークはできていますが、
          アークナイツの各イベントやメインストーリーのメカニズムは複雑で多様なため、
          イベントごとに個別に适配を行う必要があります。
          まずは、当期イベントが問題なく動作することを優先的に確保しています。
        </p>
        <p>小規模サーバーのため、承载能力が十分ではない可能性があります。動作が重い場合はご容赦ください。</p>
        <p>
          開発者：露托official :
          <el-link href="https://space.bilibili.com/10356132" type="primary">Bilibili個人ページ</el-link>
          ，フォローをお願いします！
        </p>
      </template>

      <template v-else-if="language === 'EN'">
        <p>
          The project is currently still in the testing and operational phase. 
          The basic framework is in place, but due to the complex and diverse mechanics of each 
          Arknights event and main story, every event requires independent adaptation. 
          My primary goal is to ensure that the current event functions correctly.
        </p>
        <p>As it is a small server, its capacity may be limited. Please understand if you experience lag.</p>
        <p>
          Developer: 露托official :
          <el-link href="https://space.bilibili.com/10356132" type="primary">Bilibili Homepage</el-link>
          ,Follow us for updates!
        </p>
      </template>

      <template v-else-if="language === 'KR'">
        <p>
          현재 프로젝트는 아직 테스트 운영 단계에 있습니다. 
          기본 프레임워크는 구축되었지만, 명일방주 각 이벤트와 메인 스토리의 메커니즘이 
          복잡 다양해서每个 이벤트마다 독립적으로 适配를 해야 합니다. 우선은 당기 이벤트에 
          문제가 없도록 보장하는 것을首要로 합니다.
        </p>
        <p>소규모 서버라 수용 능력이 부족할 수 있습니다. 끊김이 발생하면 양해 부탁드립니다.</p>
        <p>
          개발자: 露托official :
          <el-link href="https://space.bilibili.com/10356132" type="primary">Bilibili 홈페이지</el-link>
          ,많은 관심 부탁드립니다!
        </p>
      </template>
    </el-popover>
    
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const language = localStorage.getItem("currentLang") || "CN";

</script>

<style lang="scss" scoped>
.notice{
  padding-left: 20px;
}

</style>