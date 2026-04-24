<template>
  <div class="contact">
    <div class="container">
      <h1 class="section-title">联系我们</h1>
      <p class="text-center mb-30">专业团队为您提供一对一咨询服务</p>
      
      <!-- 表单提交成功提示 -->
      <div v-if="successMessage" class="success-message alert-box">
        <strong>提交成功！</strong>
        <p>{{ successMessage }}</p>
        <button @click="successMessage = null" class="alert-close">×</button>
      </div>
      
      <!-- 加载公司信息错误提示 -->
      <div v-if="loadError" class="error-message alert-box">
        <strong>加载失败</strong>
        <p>{{ loadError }}</p>
        <pre v-if="loadErrorDetail">{{ loadErrorDetail }}</pre>
        <button @click="retryLoad" class="alert-close">×</button>
      </div>
      
      <!-- 表单提交错误提示 -->
      <div v-if="submitError" class="error-message alert-box">
        <strong>提交失败</strong>
        <p>{{ submitError }}</p>
        <pre v-if="submitErrorDetail">{{ submitErrorDetail }}</pre>
        <button @click="submitError = null" class="alert-close">×</button>
      </div>
      
      <div class="contact-content">
        <div class="contact-form-section">
          <h2>咨询表单</h2>
          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">姓名</label>
              <input type="text" id="name" v-model="formData.name" required />
            </div>
            <div class="form-group">
              <label for="phone">电话</label>
              <input type="tel" id="phone" v-model="formData.phone" required />
            </div>
            <div class="form-group">
              <label for="email">邮箱</label>
              <input type="email" id="email" v-model="formData.email" required />
            </div>
            <div class="form-group">
              <label for="subject">咨询主题</label>
              <input type="text" id="subject" v-model="formData.subject" required />
            </div>
            <div class="form-group">
              <label for="message">咨询内容</label>
              <textarea id="message" v-model="formData.message" required></textarea>
            </div>
            <button type="submit" class="cta-button" :disabled="loading">
              {{ loading ? '提交中...' : '提交咨询' }}
            </button>
          </form>
        </div>
        
        <div class="contact-info-section">
          <h2>联系信息</h2>
          <div class="contact-info-items">
            <div class="contact-info-item">
              <div class="contact-icon">📞</div>
              <div class="contact-details">
                <h3>电话</h3>
                <p>{{ companyLocation.phone }}</p>
              </div>
            </div>
            <div class="contact-info-item">
              <div class="contact-icon">📍</div>
              <div class="contact-details">
                <h3>地址</h3>
                <p>{{ companyLocation.address }}</p>
                <p>{{ companyLocation.name }}</p>
              </div>
            </div>
            <div class="contact-info-item">
              <div class="contact-icon">✉️</div>
              <div class="contact-details">
                <h3>邮箱</h3>
                <p>{{ companyLocation.email }}</p>
              </div>
            </div>
            <div class="contact-info-item">
              <div class="contact-icon">🕒</div>
              <div class="contact-details">
                <h3>工作时间</h3>
                <p>周一至周五: 9:00-18:00</p>
                <p>周六: 10:00-16:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="local-service">
        <h2 class="section-title">本地服务优势</h2>
        <div class="service-grid">
          <div class="service-item" v-for="(item, index) in otherInfo.services" :key="'svc-' + index">
            <div class="service-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Contact',
  data() {
    return {
      formData: {
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      },
      loading: false,
      successMessage: null,
      loadError: null,
      loadErrorDetail: null,
      submitError: null,
      submitErrorDetail: null,
      companyLocation: {
        name: '绿色动力新能源科技有限公司',
        address: '惠州市惠阳区工业园区',
        phone: '138-0013-8000',
        email: 'info@greenpower.com'
      },
      otherInfo: {
        services: []
      }
    }
  },
  mounted() {
    this.loadCompanyLocation()
    this.loadOtherInfo()
  },
  methods: {
    async loadCompanyLocation() {
      try {
        this.loadError = null
        this.loadErrorDetail = null
        const response = await axios.get('/location')
        this.companyLocation = response.data
      } catch (error) {
        console.error('加载公司位置失败:', error)
        this.loadError = '加载公司信息失败，请稍后重试'
        this.loadErrorDetail = this.getErrorDetails(error)
      }
    },
    async loadOtherInfo() {
      try {
        const response = await axios.get('/other-info')
        if (response.data) {
          this.otherInfo = {
            services: response.data.services || []
          }
        }
      } catch (error) {
        console.error('加载其他信息失败:', error)
      }
    },
    async retryLoad() {
      this.loadError = null
      this.loadErrorDetail = null
      await this.loadCompanyLocation()
    },
    async handleSubmit() {
      this.loading = true
      this.submitError = null
      this.submitErrorDetail = null
      this.successMessage = null
      try {
        await axios.post('/contact-forms', this.formData)
        this.successMessage = '咨询已提交，我们会尽快与您联系！'
        this.formData = {
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        }
      } catch (error) {
        console.error('提交失败:', error)
        this.submitError = '提交失败，请稍后重试'
        this.submitErrorDetail = this.getErrorDetails(error)
      } finally {
        this.loading = false
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
.contact {
  padding: 60px 0;
  background: transparent;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.contact-form-section,
.contact-info-section {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 30px;
  border-radius: 25px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.contact-form-section h2,
.contact-info-section h2 {
  margin-bottom: 30px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-info-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.contact-info-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(0, 168, 120, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 15px;
  border: 1px solid rgba(0, 168, 120, 0.1);
  transition: all 0.4s ease;
}

.contact-info-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--glass-shadow), 0 0 20px rgba(0, 168, 120, 0.1);
  border-color: rgba(0, 168, 120, 0.2);
}

.contact-icon {
  font-size: 32px;
  margin-bottom: 15px;
}

.contact-details h3 {
  margin-bottom: 5px;
  color: var(--text-color);
  font-size: 16px;
}

.contact-details p {
  margin-bottom: 5px;
  color: var(--light-text);
  font-size: 14px;
}

.local-service {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 30px;
  border-radius: 25px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.service-item {
  text-align: center;
  padding: 30px;
  background: rgba(0, 168, 120, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(0, 168, 120, 0.1);
  transition: all 0.4s ease;
}

.service-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--glass-shadow), 0 0 30px rgba(0, 168, 120, 0.15);
  border-color: rgba(0, 168, 120, 0.3);
}

.service-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.service-item h3 {
  margin-bottom: 10px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
  
  .service-grid {
    grid-template-columns: 1fr;
  }
}
</style>