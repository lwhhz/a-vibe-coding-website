<template>
  <div class="home">
    <!-- 轮播图横幅 -->
    <section class="hero-carousel">
      <div class="carousel-container">
        <div 
          class="carousel-slide" 
          v-for="(banner, index) in banners" 
          :key="banner.id"
          :class="{ active: currentSlide === index }"
          :style="{ backgroundImage: `url(${banner.image})` }"
        >
          <div class="carousel-overlay"></div>
          <div class="container carousel-content">
            <h1>{{ banner.title }}</h1>
            <p v-if="banner.subtitle">{{ banner.subtitle }}</p>
            <div class="cta-buttons">
              <router-link to="/products" class="cta-button">查看产品</router-link>
              <router-link to="/contact" class="cta-button cta-outline">联系我们</router-link>
            </div>
          </div>
        </div>
        
        <!-- 轮播控制按钮 -->
        <button class="carousel-btn prev" @click="prevSlide" v-if="banners.length > 1">‹</button>
        <button class="carousel-btn next" @click="nextSlide" v-if="banners.length > 1">›</button>
        
        <!-- 轮播指示器 -->
        <div class="carousel-indicators" v-if="banners.length > 1">
          <span 
            v-for="(banner, index) in banners" 
            :key="index"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>
      
      <!-- 默认横幅（当没有轮播图时显示） -->
      <div class="hero-default" v-if="banners.length === 0">
        <div class="container">
          <h1>澎湃动力 智能观光</h1>
          <p>专业电瓶观光车制造商，为景区、园区、酒店提供高品质的绿色出行解决方案</p>
          <div class="cta-buttons">
            <router-link to="/products" class="cta-button">查看产品</router-link>
            <router-link to="/contact" class="cta-button cta-outline">联系我们</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 本地优势 -->
    <section class="local-advantages">
      <div class="container">
        <h2 class="section-title">本地优势</h2>
        <div class="advantages-grid">
          <div class="advantage-item" v-for="(item, index) in homeAdvantages" :key="'home-adv-' + index">
            <div class="advantage-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 产品展示 -->
    <section class="featured-products">
      <div class="container">
        <h2 class="section-title">热销产品</h2>
        
        <!-- 错误提示 -->
        <div v-if="error" class="error-message alert-box">
          <strong>加载失败</strong>
          <p>{{ error }}</p>
          <pre v-if="errorDetail">{{ errorDetail }}</pre>
          <button @click="retryLoadProducts" class="alert-close">×</button>
        </div>
        
        <!-- 加载中 -->
        <div v-if="loading" class="text-center mt-30">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
        
        <!-- 产品列表 -->
        <div v-else class="grid">
          <div class="product-card" v-for="product in products" :key="product.id">
            <img :src="product.image" alt="product.name" />
            <div class="product-card-content">
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="local-tags">
                <span class="local-advantage">本地制造</span>
                <span class="local-advantage">同城配送</span>
              </div>
              <router-link :to="`/product/${product.id}`" class="cta-button" style="margin-top: 15px; border: 2px solid var(--primary-color);">查看详情</router-link>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-30">
          <router-link to="/products" class="cta-button">查看全部产品</router-link>
        </div>
      </div>
    </section>

    <!-- 案例展示 -->
    <section class="featured-cases">
      <div class="container">
        <h2 class="section-title">惠州本地案例</h2>
        
        <!-- 错误提示 -->
        <div v-if="caseError" class="error-message alert-box">
          <strong>加载失败</strong>
          <p>{{ caseError }}</p>
          <button @click="retryLoadCases" class="alert-close">×</button>
        </div>
        
        <div class="grid">
          <div class="case-card" v-for="caseItem in cases" :key="caseItem.id" @click="$router.push(`/case/${caseItem.id}`)">
            <img :src="caseItem.image" alt="caseItem.name" />
            <div class="case-card-content">
              <h3>{{ caseItem.name }}</h3>
              <p>{{ caseItem.description }}</p>
              <p class="case-location"><strong>地点:</strong> {{ caseItem.location }}</p>
              <span class="read-more-link">查看详情 →</span>
            </div>
          </div>
        </div>
        <div class="text-center mt-30">
          <router-link to="/cases" class="cta-button">查看全部案例</router-link>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section class="contact-section">
      <div class="container">
        <h2 class="section-title">联系我们</h2>
        <p class="text-center mb-30">专业团队为您提供一对一咨询服务</p>
        <div class="contact-info">
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <h3>电话咨询</h3>
            <p>{{ companyLocation.phone }}</p>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <h3>公司地址</h3>
            <p>{{ companyLocation.address }}</p>
          </div>
          <div class="contact-item">
            <div class="contact-icon">✉️</div>
            <h3>电子邮箱</h3>
            <p>{{ companyLocation.email }}</p>
          </div>
        </div>
        <div class="text-center mt-30">
          <router-link to="/contact" class="cta-button">联系我们获取更多信息</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      banners: [],
      currentSlide: 0,
      carouselInterval: null,
      products: [],
      cases: [],
      companyLocation: {
        name: '绿色动力新能源科技有限公司',
        address: '惠州市惠阳区工业园区',
        phone: '138-0013-8000',
        email: 'info@greenpower.com'
      },
      homeAdvantages: [],
      loading: true,
      error: null,
      errorDetail: null,
      caseError: null
    }
  },
  async mounted() {
    await Promise.all([
      this.loadBanners(),
      this.loadProducts(),
      this.loadCases(),
      this.loadCompanyLocation(),
      this.loadHomeAdvantages()
    ])
    this.startCarousel()
  },
  beforeUnmount() {
    this.stopCarousel()
  },
  methods: {
    async loadBanners() {
      try {
        const response = await axios.get('/banners/active')
        this.banners = response.data
      } catch (error) {
        console.error('加载轮播图失败:', error)
      }
    },
    startCarousel() {
      if (this.banners.length > 1) {
        this.carouselInterval = setInterval(() => {
          this.nextSlide()
        }, 5000)
      }
    },
    stopCarousel() {
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval)
      }
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.banners.length
    },
    prevSlide() {
      this.currentSlide = this.currentSlide === 0 ? this.banners.length - 1 : this.currentSlide - 1
    },
    goToSlide(index) {
      this.currentSlide = index
      this.stopCarousel()
      this.startCarousel()
    },
    async loadProducts() {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const response = await axios.get('/products')
        // 只显示前3个产品作为热销产品
        this.products = response.data.slice(0, 3)
      } catch (error) {
        console.error('加载产品失败:', error)
        this.error = '加载产品失败，请稍后重试'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async retryLoadProducts() {
      this.error = null
      this.errorDetail = null
      await this.loadProducts()
    },
    async loadCases() {
      try {
        this.caseError = null
        const response = await axios.get('/cases')
        // 只显示前3个案例
        this.cases = response.data.slice(0, 3)
      } catch (error) {
        console.error('加载案例失败:', error)
        this.caseError = '加载案例失败，请稍后重试'
      }
    },
    async retryLoadCases() {
      this.caseError = null
      await this.loadCases()
    },
    async loadCompanyLocation() {
      try {
        const response = await axios.get('/location')
        this.companyLocation = response.data
      } catch (error) {
        console.error('加载公司位置失败:', error)
      } finally {
        this.loading = false
      }
    },
    async loadHomeAdvantages() {
      try {
        const response = await axios.get('/other-info')
        if (response.data && response.data.homeAdvantages) {
          this.homeAdvantages = response.data.homeAdvantages
        }
      } catch (error) {
        console.error('加载本地优势失败:', error)
      }
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
.hero-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 0;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 600px;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide.active {
  opacity: 1;
  z-index: 1;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2));
}

.carousel-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--white);
}

.carousel-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.carousel-content p {
  font-size: 18px;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--white);
  font-size: 48px;
  padding: 10px 20px;
  cursor: pointer;
  z-index: 3;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.carousel-btn.prev {
  left: 20px;
}

.carousel-btn.next {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
}

.carousel-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background-color: var(--white);
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.hero-default {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: var(--white);
  padding: 150px 0 100px;
  text-align: center;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.hero-default .container {
  width: 100%;
}

.cta-outline {
  margin-left: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
}

.cta-outline:hover {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.local-advantages {
  padding: 60px 0;
  background: transparent;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.advantage-item {
  text-align: center;
  padding: 30px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  transition: all 0.4s ease;
}

.advantage-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--glass-shadow), 0 0 30px rgba(0, 168, 120, 0.15);
  border-color: rgba(0, 168, 120, 0.3);
}

.advantage-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.advantage-item h3 {
  margin-bottom: 10px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.featured-products {
  padding: 60px 0;
  background: transparent;
}

.featured-cases {
  padding: 60px 0;
  background: transparent;
}

.contact-section {
  padding: 60px 0;
  background: transparent;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.contact-item {
  text-align: center;
  padding: 30px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  transition: all 0.4s ease;
}

.contact-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--glass-shadow), 0 0 30px rgba(0, 168, 120, 0.15);
}

.contact-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.contact-item h3 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.case-location {
  margin-top: 10px;
  color: var(--light-text);
  font-size: 14px;
}

.read-more-link {
  display: inline-block;
  margin-top: 10px;
  color: var(--primary-color);
  font-weight: 500;
  font-size: 14px;
}

.case-card {
  cursor: pointer;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .carousel-container {
    height: 500px;
  }
  
  .carousel-content h1 {
    font-size: 32px;
  }
  
  .carousel-content p {
    font-size: 16px;
  }
  
  .advantages-grid,
  .contact-info {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-buttons .cta-button {
    margin-left: 0 !important;
    margin-top: 10px;
  }
}
</style>