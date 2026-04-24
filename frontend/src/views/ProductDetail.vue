<template>
  <div class="product-detail">
    <div class="container">
      <router-link to="/products" class="back-link">← 返回产品列表</router-link>
      
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
        <div class="product-detail-content">
          <div class="product-images">
            <div class="main-image-container">
              <img 
                :src="currentImage" 
                alt="product.name" 
                class="main-image" 
                @click="nextImage"
              />
              <div class="image-nav" v-if="productImages.length > 1">
                <button class="image-nav-btn prev" @click="prevImage">‹</button>
                <button class="image-nav-btn next" @click="nextImage">›</button>
              </div>
            </div>
            <div class="image-gallery" v-if="productImages.length > 1">
              <img 
                v-for="(image, index) in productImages" 
                :key="index"
                :src="image" 
                alt="product.name" 
                class="gallery-image"
                :class="{ active: currentIndex === index }"
                @click="setCurrentImage(index)"
              />
            </div>
          </div>
        
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="product-description">{{ product.description }}</p>
          
          <div class="local-tags" v-if="defaultTags.length > 0">
            <span v-for="(tag, index) in defaultTags" :key="index" class="local-advantage">{{ tag }}</span>
          </div>
          
          <div class="product-price">
            <span class="price-label">参考价格:</span>
            <span class="price-value">¥{{ product.price }}</span>
          </div>
          
          <div class="product-actions">
            <router-link to="/contact" class="cta-button" style="border: 2px solid var(--primary-color);">立即咨询</router-link>
          </div>
        </div>
      </div>
      
      <div class="product-params">
        <h2 class="section-title">技术参数</h2>
        <table class="param-table">
          <tr>
            <th>参数</th>
            <th>数值</th>
          </tr>
          <tr>
            <td>座位数</td>
            <td>{{ product.seats }}座</td>
          </tr>
          <tr>
            <td>电池类型</td>
            <td>{{ product.battery }}</td>
          </tr>
          <tr>
            <td>续航里程</td>
            <td>{{ product.range }}km</td>
          </tr>
          <tr>
            <td>最高时速</td>
            <td>{{ product.maxSpeed }}km/h</td>
          </tr>
          <tr>
            <td>充电时间</td>
            <td>{{ product.chargingTime }}</td>
          </tr>
          <tr>
            <td>车身尺寸</td>
            <td>{{ product.size }}</td>
          </tr>
          <tr>
            <td>载重能力</td>
            <td>{{ product.loadCapacity }}kg</td>
          </tr>
          <tr>
            <td>电机功率</td>
            <td>{{ product.motorPower }}W</td>
          </tr>
        </table>
      </div>
      
      <div class="product-features" v-if="defaultFeatures.length > 0">
        <h2 class="section-title">产品特点</h2>
        <div class="features-grid">
          <div class="feature-item" v-for="(feature, index) in defaultFeatures" :key="index">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="product-applications" v-if="defaultApplications.length > 0">
        <h2 class="section-title">适用场景</h2>
        <div class="applications-grid">
          <div class="application-item" v-for="(app, index) in defaultApplications" :key="index">
            <div class="application-icon">{{ app.icon }}</div>
            <h3>{{ app.name }}</h3>
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
  name: 'ProductDetail',
  data() {
    return {
      product: {
        id: null,
        name: '',
        description: '',
        seats: null,
        battery: '',
        range: null,
        maxSpeed: null,
        chargingTime: '',
        size: '',
        loadCapacity: null,
        motorPower: null,
        price: null,
        image: '',
        images: []
      },
      currentIndex: 0,
      loading: true,
      error: null,
      errorDetail: null
    }
  },
  computed: {
    productImages() {
      if (this.product.images && Array.isArray(this.product.images) && this.product.images.length > 0) {
        return this.product.images
      }
      return this.product.image ? [this.product.image] : []
    },
    currentImage() {
      return this.productImages[this.currentIndex] || ''
    },
    defaultFeatures() {
      if (this.product.features && Array.isArray(this.product.features) && this.product.features.length > 0) {
        return this.product.features
      }
      return [
        { icon: '🔋', title: '高效电池', description: '采用优质电池，续航里程长，使用寿命长' },
        { icon: '🛡️', title: '安全可靠', description: '多重安全保护系统，确保行驶安全' },
        { icon: '🚀', title: '动力强劲', description: '高性能电机，动力充足，爬坡能力强' },
        { icon: '🛠️', title: '易于维护', description: '结构简单，维护成本低，方便快捷' }
      ]
    },
    defaultApplications() {
      if (this.product.applications && Array.isArray(this.product.applications) && this.product.applications.length > 0) {
        return this.product.applications
      }
      return [
        { icon: '🏞️', name: '景区' },
        { icon: '🏢', name: '园区' },
        { icon: '🏨', name: '酒店' },
        { icon: '🛍️', name: '商场' },
        { icon: '🏥', name: '医院' },
        { icon: '🏫', name: '校园' }
      ]
    },
    defaultTags() {
      if (this.product.tags && Array.isArray(this.product.tags) && this.product.tags.length > 0) {
        return this.product.tags
      }
      return ['本地制造', '同城配送', '上门售后']
    }
  },
  async mounted() {
    const productId = this.$route.params.id
    if (productId) {
      await this.loadProduct(productId)
    }
  },
  methods: {
    async loadProduct(productId) {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const response = await axios.get(`/products/${productId}`)
        this.product = response.data
        this.currentIndex = 0
      } catch (error) {
        console.error('加载产品详情失败:', error)
        this.error = '加载产品详情失败，请稍后重试'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      const productId = this.$route.params.id
      if (productId) {
        await this.loadProduct(productId)
      }
    },
    nextImage() {
      if (this.productImages.length > 1) {
        this.currentIndex = (this.currentIndex + 1) % this.productImages.length
      }
    },
    prevImage() {
      if (this.productImages.length > 1) {
        this.currentIndex = this.currentIndex === 0 ? this.productImages.length - 1 : this.currentIndex - 1
      }
    },
    setCurrentImage(index) {
      this.currentIndex = index
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
.product-detail {
  padding: 60px 0;
  background: transparent;
}

.back-link {
  display: inline-block;
  margin-bottom: 30px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
}

.back-link:hover {
  color: var(--secondary-color);
  box-shadow: var(--glow-primary);
}

.product-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 30px;
  border-radius: 25px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.product-images {
  display: flex;
  flex-direction: column;
}

.main-image-container {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

.image-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  pointer-events: none;
}

.image-nav-btn {
  background: rgba(0, 168, 120, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 24px;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 12px;
  pointer-events: auto;
  transition: all 0.3s ease;
}

.image-nav-btn:hover {
  background: var(--primary-color);
  box-shadow: var(--glow-primary);
}

.image-gallery {
  display: flex;
  gap: 10px;
}

.gallery-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.gallery-image:hover,
.gallery-image.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(0, 168, 120, 0.3);
}

.product-info h1 {
  font-size: 28px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-description {
  margin-bottom: 20px;
  line-height: 1.8;
  color: var(--light-text);
}

.product-price {
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 168, 120, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 15px;
  border: 1px solid rgba(0, 168, 120, 0.2);
}

.price-label {
  font-weight: 500;
  margin-right: 10px;
}

.price-value {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-actions {
  margin-top: 30px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.product-params {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 30px;
  border-radius: 25px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  margin-bottom: 60px;
}

.product-features {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 30px;
  border-radius: 25px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  margin-bottom: 60px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-item {
  text-align: center;
  padding: 30px;
  background: rgba(0, 168, 120, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(0, 168, 120, 0.1);
  transition: all 0.4s ease;
}

.feature-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--glass-shadow), 0 0 30px rgba(0, 168, 120, 0.15);
  border-color: rgba(0, 168, 120, 0.3);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature-item h3 {
  margin-bottom: 10px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-applications {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 30px;
  border-radius: 25px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.application-item {
  text-align: center;
  padding: 30px;
  background: rgba(0, 119, 182, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(0, 119, 182, 0.1);
  transition: all 0.4s ease;
}

.application-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--glass-shadow), 0 0 30px rgba(0, 119, 182, 0.15);
  border-color: rgba(0, 119, 182, 0.3);
}

.application-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .product-detail-content {
    grid-template-columns: 1fr;
  }
  
  .main-image {
    height: 300px;
  }
  
  .features-grid,
  .applications-grid {
    grid-template-columns: 1fr;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .product-actions .cta-button {
    margin-left: 0 !important;
    margin-top: 10px;
  }
}
</style>