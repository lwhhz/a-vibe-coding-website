<template>
  <div class="products">
    <div class="container">
      <h1 class="section-title">产品中心</h1>
      <p class="text-center mb-30">专业电瓶观光车制造商，为不同场景提供定制化解决方案</p>
      
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
        <div class="product-filters">
          <button class="filter-btn" :class="{ active: selectedFilter === 'all' }" @click="selectedFilter = 'all'">全部车型</button>
          <button 
            v-for="seat in uniqueSeats" 
            :key="seat"
            class="filter-btn" 
            :class="{ active: selectedFilter === seat.toString() }" 
            @click="selectedFilter = seat.toString()"
          >{{ seat }}座</button>
        </div>
        
        <div class="grid">
          <div class="product-card" v-for="product in filteredProducts" :key="product.id">
            <img :src="product.image" alt="product.name" />
            <div class="product-card-content">
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="product-specs">
                <span class="spec-item">{{ product.seats }}座</span>
                <span class="spec-item">{{ product.battery }}电池</span>
                <span class="spec-item">{{ product.range }}km续航</span>
              </div>
              <div class="local-tags">
                <span class="local-advantage">本地制造</span>
                <span class="local-advantage">同城配送</span>
              </div>
              <router-link :to="`/product/${product.id}`" class="cta-button" style="margin-top: 15px; border: 2px solid var(--primary-color);">查看详情</router-link>
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
  name: 'Products',
  data() {
    return {
      selectedFilter: 'all',
      products: [],
      loading: true,
      error: null,
      errorDetail: null
    }
  },
  computed: {
    uniqueSeats() {
      const seats = [...new Set(this.products.map(product => product.seats))]
      return seats.sort((a, b) => a - b)
    },
    filteredProducts() {
      if (this.selectedFilter === 'all') {
        return this.products
      }
      return this.products.filter(product => product.seats.toString() === this.selectedFilter)
    }
  },
  watch: {
    uniqueSeats(newSeats) {
      if (this.selectedFilter !== 'all') {
        const currentSeat = parseInt(this.selectedFilter)
        if (!newSeats.includes(currentSeat)) {
          this.selectedFilter = 'all'
        }
      }
    }
  },
  async mounted() {
    await this.loadProducts()
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const response = await axios.get('/products')
        this.products = response.data
      } catch (error) {
        console.error('加载产品失败:', error)
        this.error = '加载产品失败，请稍后重试'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      this.error = null
      this.errorDetail = null
      await this.loadProducts()
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
.products {
  padding: 60px 0;
  background: transparent;
}

.product-filters {
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
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  color: var(--white);
  border-color: transparent;
}

.filter-btn.active::before {
  opacity: 1;
  box-shadow: var(--glow-primary);
}

.product-specs {
  display: flex;
  gap: 15px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.spec-item {
  background: rgba(0, 168, 120, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 14px;
  color: var(--primary-color);
  border: 1px solid rgba(0, 168, 120, 0.2);
}

@media (max-width: 768px) {
  .product-filters {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .product-specs {
    justify-content: center;
  }
}
</style>