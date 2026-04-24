<template>
  <div class="cases">
    <div class="container">
      <h1 class="section-title">案例展示</h1>
      <p class="text-center mb-30">惠州本地客户成功案例，为您提供参考</p>
      
      <!-- 错误提示 -->
      <div v-if="error" class="error-message alert-box">
        <strong>加载失败</strong>
        <p>{{ error }}</p>
        <pre v-if="errorDetail">{{ errorDetail }}</pre>
        <button @click="retryLoad" class="alert-close">×</button>
      </div>
      
      <!-- 加载中 -->
      <div v-if="loading" class="text-center mt-30">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <template v-else>
        <div class="case-filters">
          <button class="filter-btn" :class="{ active: selectedFilter === 'all' }" @click="selectedFilter = 'all'">全部案例</button>
          <button 
            v-for="category in uniqueCategories" 
            :key="category"
            class="filter-btn" 
            :class="{ active: selectedFilter === category }" 
            @click="selectedFilter = category"
          >{{ category }}</button>
        </div>
        
        <div class="grid">
          <div class="case-card" v-for="caseItem in filteredCases" :key="caseItem.id" @click="goToDetail(caseItem.id)">
            <img :src="caseItem.image" alt="caseItem.name" />
            <div class="case-card-content">
              <div class="case-header">
                <h3>{{ caseItem.name }}</h3>
                <span class="case-category">{{ caseItem.categoryText }}</span>
              </div>
              <p>{{ caseItem.description }}</p>
              <div class="case-info">
                <p class="case-location"><strong>地点:</strong> {{ caseItem.location }}</p>
                <p class="case-date"><strong>时间:</strong> {{ caseItem.date }}</p>
                <p class="case-products"><strong>产品:</strong> {{ caseItem.products }}</p>
              </div>
              <div class="case-card-footer">
                <span class="local-advantage">本地客户</span>
                <span class="read-more">查看详情 →</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Cases',
  data() {
    return {
      selectedFilter: 'all',
      cases: [],
      loading: true,
      error: null,
      errorDetail: null
    }
  },
  computed: {
    uniqueCategories() {
      const categories = [...new Set(this.cases.map(caseItem => caseItem.categoryText).filter(cat => cat))]
      return categories.sort()
    },
    filteredCases() {
      if (this.selectedFilter === 'all') {
        return this.cases
      }
      return this.cases.filter(caseItem => caseItem.categoryText === this.selectedFilter)
    }
  },
  watch: {
    uniqueCategories(newCategories) {
      if (this.selectedFilter !== 'all') {
        if (!newCategories.includes(this.selectedFilter)) {
          this.selectedFilter = 'all'
        }
      }
    }
  },
  async mounted() {
    await this.loadCases()
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`/case/${id}`)
    },
    async loadCases() {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const response = await axios.get('/cases')
        this.cases = response.data
      } catch (error) {
        console.error('加载案例失败:', error)
        this.error = '加载案例失败，请稍后重试'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      this.error = null
      this.errorDetail = null
      await this.loadCases()
    },
    getErrorDetails(error) {
      if (error.response) {
        return `状态码: ${error.response.status}\n响应: ${JSON.stringify(error.response.data)}`
      } else if (error.request) {
        return `请求失败: ${error.message}`
      } else {
        return `错误: ${error.message}`
      }
    }
  }
}
</script>

<style scoped>
.cases {
  padding: 60px 0;
  background: transparent;
}

.case-filters {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 12px 24px;
  border: 2px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.filter-btn:hover {
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

.filter-btn.active {
  color: var(--white);
  border-color: transparent;
}

.filter-btn.active::before {
  opacity: 1;
  box-shadow: var(--glow-secondary);
}

.case-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: all 0.4s ease;
  margin-bottom: 30px;
  cursor: pointer;
}

.case-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--glass-shadow), 0 15px 40px rgba(0, 119, 182, 0.15);
  border-color: rgba(0, 119, 182, 0.3);
}

.case-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.case-card-content {
  padding: 20px;
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.case-header h3 {
  margin: 0;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.case-category {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--white);
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.case-info {
  margin-top: 15px;
  font-size: 14px;
  color: var(--light-text);
}

.case-info p {
  margin-bottom: 8px;
}

.case-card-footer {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.read-more {
  color: var(--secondary-color);
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.case-card:hover .read-more {
  color: var(--accent-color);
}

@media (max-width: 768px) {
  .case-filters {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .case-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .case-card img {
    height: 200px;
  }
}
</style>