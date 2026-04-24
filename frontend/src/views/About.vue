<template>
  <div class="about">
    <div class="container">
      <h1 class="section-title">关于我们</h1>
      
      <!-- 错误提示 -->
      <div v-if="error" class="error-message alert-box">
        <strong>加载失败</strong>
        <p>{{ error }}</p>
        <pre v-if="errorDetail">{{ errorDetail }}</pre>
        <button @click="retryLoad" class="alert-close">×</button>
      </div>
      
      <div class="about-content">
        <div class="about-intro">
          <h2>{{ companyInfo.introTitle }}</h2>
          <div class="intro-text" v-html="formattedIntro"></div>
        </div>
        
        <div class="about-image">
          <img :src="companyInfo.image || defaultImage" alt="公司工厂" />
        </div>
      </div>
      
      <div class="company-advantages">
        <h2 class="section-title">公司优势</h2>
        <div class="advantages-grid">
          <div class="advantage-item" v-for="(item, index) in otherInfo.advantages" :key="'adv-' + index">
            <div class="advantage-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="company-history">
        <h2 class="section-title">发展历程</h2>
        <div class="timeline">
          <div class="timeline-item" v-for="(item, index) in sortedHistory" :key="'hist-' + index">
            <div class="timeline-date">{{ item.date }}</div>
            <div class="timeline-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="company-certifications">
        <h2 class="section-title">资质认证</h2>
        <div class="certifications-grid">
          <div class="certification-item" v-for="(item, index) in otherInfo.certifications" :key="'cert-' + index">
            <div class="certification-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'About',
  data() {
    return {
      companyInfo: {
        introTitle: '公司简介',
        introContent: '',
        image: ''
      },
      otherInfo: {
        advantages: [],
        history: [],
        certifications: []
      },
      defaultImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text-to-image?prompt=modern%20electric%20vehicle%20manufacturing%20factory%20blue%20green%20color%20scheme&image-size=landscape-16-9',
      loading: false,
      error: null,
      errorDetail: null
    }
  },
  computed: {
    formattedIntro() {
      if (!this.companyInfo.introContent) return ''
      return this.companyInfo.introContent.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('')
    },
    sortedHistory() {
      if (!this.otherInfo.history || this.otherInfo.history.length === 0) return []
      return [...this.otherInfo.history].sort((a, b) => {
        const yearA = parseInt(a.date) || 0
        const yearB = parseInt(b.date) || 0
        return yearB - yearA
      })
    }
  },
  mounted() {
    this.loadCompanyInfo()
    this.loadOtherInfo()
  },
  methods: {
    async loadCompanyInfo() {
      try {
        this.loading = true
        this.error = null
        this.errorDetail = null
        const response = await axios.get('/company-info')
        if (response.data) {
          this.companyInfo = response.data
        }
      } catch (error) {
        console.error('加载公司简介失败:', error)
        this.error = '加载公司简介失败，请稍后重试'
        this.errorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
      }
    },
    async loadOtherInfo() {
      try {
        const response = await axios.get('/other-info')
        if (response.data) {
          this.otherInfo = {
            advantages: response.data.advantages || [],
            history: response.data.history || [],
            certifications: response.data.certifications || []
          }
        }
      } catch (error) {
        console.error('加载其他信息失败:', error)
      }
    },
    async retryLoad() {
      this.error = null
      this.errorDetail = null
      await this.loadCompanyInfo()
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
.about {
  padding: 60px 0;
  background: transparent;
}

.about-content {
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

.about-intro h2 {
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-intro p {
  margin-bottom: 15px;
  line-height: 1.8;
  color: var(--light-text);
}

.intro-text p {
  margin-bottom: 15px;
  line-height: 1.8;
  color: var(--light-text);
}

.about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.company-advantages {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 30px;
  border-radius: 25px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  margin-bottom: 60px;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.advantage-item {
  text-align: center;
  padding: 30px;
  background: rgba(0, 168, 120, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(0, 168, 120, 0.1);
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

.company-history {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 30px;
  border-radius: 25px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  margin-bottom: 60px;
}

.timeline {
  margin-top: 40px;
  position: relative;
}

.timeline-item {
  display: flex;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 0;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 100px;
  top: 0;
  height: calc(100% + 30px);
  width: 2px;
  background: linear-gradient(180deg, var(--primary-color), var(--secondary-color));
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-date {
  width: 100px;
  font-weight: bold;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

.timeline-content {
  margin-left: 30px;
  padding: 15px;
  background: rgba(0, 168, 120, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 15px;
  border: 1px solid rgba(0, 168, 120, 0.1);
  flex: 1;
}

.timeline-content h3 {
  margin-bottom: 10px;
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.company-certifications {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 30px;
  border-radius: 25px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.certification-item {
  text-align: center;
  padding: 30px;
  background: rgba(0, 119, 182, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(0, 119, 182, 0.1);
  transition: all 0.4s ease;
}

.certification-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--glass-shadow), 0 0 30px rgba(0, 119, 182, 0.15);
  border-color: rgba(0, 119, 182, 0.3);
}

.certification-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
  }
  
  .advantages-grid,
  .certifications-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline-item {
    flex-direction: column;
  }
  
  .timeline-date {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .timeline-content {
    margin-left: 0;
  }
  
  .timeline-item::before {
    left: 0;
    top: 30px;
    bottom: -20px;
  }
}
</style>