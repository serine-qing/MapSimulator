<template>
  <div class="sponsor-page">
    <div class="sponsor-container">
      <!-- 头部 -->
      <div class="header">
        <img src="/favicon.jpg" class="avatar" alt="avatar">
        <h1>明日方舟地图模拟器</h1>
        <p class="tagline">您的赞助能维持我的服务器费用，并让我更好的开发模拟器</p>
      </div>

      <!-- 内容区域：卡片和名单左右布局 -->
      <div class="content-row">
        <!-- 赞助卡片 -->
        <div class="cards">
          <a href="https://afdian.com/a/lutonada" target="_blank" class="card-link">
            <img src="/afdian.jpg" alt="爱发电" class="sponsor-img">
          </a>
        </div>

        <!-- 赞助名单 -->
        <div class="donors-section">
          <h2>感谢名单</h2>
          <div class="donors-list">
            <div v-if="loading" class="empty">加载中...</div>
            <div v-else-if="donors.length === 0" class="empty">暂无赞助记录</div>
            <div v-else class="donor-item" v-for="donor in donors" :key="donor.name">
              <img v-if="donor.avatar" :src="donor.avatar" class="donor-avatar" alt="avatar">
              <span class="donor-name">{{ donor.name }}</span>
              <span class="donor-amount">{{ donor.amount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import request from '@/api/request';

interface Donor {
  name: string;
  amount: string;
  avatar?: string;
}

const donors = ref<Donor[]>([]);
const loading = ref(true);

const fetchSponsors = async () => {
  try {
    loading.value = true;
    const { data } = await request.get('/sponsors');
    // 按金额从高到低排序
    donors.value = data.sort((a: Donor, b: Donor) => {
      const amountA = parseFloat(a.amount.replace('¥', '')) || 0;
      const amountB = parseFloat(b.amount.replace('¥', '')) || 0;
      return amountB - amountA;
    });
  } catch (e) {
    console.error('获取赞助名单失败:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSponsors();
});
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
  max-width: 900px;
}

.content-row {
  display: flex;
  gap: 24px;
  align-items: stretch;
  height: 600px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
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
  flex: 1;
  min-width: 0;
  overflow: hidden;

  .sponsor-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.card-link {
  display: block;
  border-radius: 12px;
  overflow: hidden;
  flex: 1;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  h2 {
    margin: 0 0 16px;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }
}

.donors-list {
  flex: 1;
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
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  .donor-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .donor-name {
    color: #fff;
    font-weight: 500;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .donor-amount {
    color: #f5576c;
    font-weight: 600;
    flex-shrink: 0;
  }
}

.empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  padding: 20px 0;
}
</style>
