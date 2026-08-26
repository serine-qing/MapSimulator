<template>
  <div class="sponsor-page">
    <div class="sponsor-container">
      <!-- 头部 -->
      <div class="header">
        <img src="/favicon.jpg" class="avatar" alt="avatar">
        <h1>明日方舟地图模拟器</h1>
        <p class="tagline">您的赞助能维持我的服务器费用，并让我更好的开发模拟器</p>
      </div>

      <!-- 赞助卡片 -->
      <div class="cards">
        <a href="https://afdian.com/a/lutonada" target="_blank" class="card-link">
          <img src="/afdian.jpg" alt="爱发电" class="sponsor-img">
        </a>
      </div>

      <!-- 赞助名单 -->
      <div class="donors-section" v-if="donors.length > 0">
        <h2>赞助名单</h2>
        <div class="donors-list">
          <div v-if="donors.length === 0" class="empty">暂无赞助记录</div>
          <div v-else class="donor-item" v-for="donor in donors" :key="donor.name">
            <span class="donor-name">{{ donor.name }}</span>
            <span class="donor-amount">{{ donor.amount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 赞助名单 - 在这里添加赞助者信息
const donors = ref([
  // { name: "赞助者1", amount: "¥50" },
  // { name: "赞助者2", amount: "¥100" },
]);
</script>

<style lang="scss" scoped>
.sponsor-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f0f23;
  padding: 20px;
}

.sponsor-container {
  width: 100%;
  max-width: 420px;
}

.header {
  text-align: center;
  margin-bottom: 32px;

  .avatar {
    width: 80px;
    height: 80px;
    margin: 0 auto 16px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }

  h1 {
    margin: 0 0 8px;
    color: #fff;
    font-size: 28px;
    font-weight: 700;
  }

  .tagline {
    margin: 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 15px;
  }
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-link {
  display: block;
  border-radius: 12px;
  overflow: hidden;

  .sponsor-img {
    width: 100%;
    display: block;
  }
}

.footer {
  text-align: center;
  margin-top: 24px;

  .back-btn {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;

    &:hover {
      color: #fff;
    }
  }
}

.donors-section {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;

  h2 {
    margin: 0 0 16px;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }
}

.donors-list {
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
}

.donor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  .donor-name {
    color: #fff;
    font-weight: 500;
  }

  .donor-amount {
    color: #f5576c;
    font-weight: 600;
  }
}

.empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  padding: 20px 0;
}
</style>
