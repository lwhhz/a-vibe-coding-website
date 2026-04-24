<template>
  <div class="location-manager">
    <div class="card">
      <div class="card-header">
        <h2>公司信息管理</h2>
        <p>设置公司的基本信息</p>
      </div>
      <div class="card-body">
        <div class="info-section">
          <h3>联系方式</h3>
          <div class="form-row">
            <div class="form-group">
              <label>公司名称</label>
              <input type="text" v-model="location.name" placeholder="输入公司名称" />
            </div>
            
            <div class="form-group">
              <label>公司地址</label>
              <input type="text" v-model="location.address" placeholder="输入公司地址" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>联系电话</label>
              <input type="text" v-model="location.phone" placeholder="输入联系电话" />
            </div>
            
            <div class="form-group">
              <label>联系邮箱</label>
              <input type="email" v-model="location.email" placeholder="输入联系邮箱" />
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <h3>公司简介</h3>
          <div class="form-group">
            <label>公司简介标题</label>
            <input type="text" v-model="companyInfo.introTitle" placeholder="输入公司简介标题" />
          </div>
          
          <div class="form-group">
            <label>网页底部简介小标题</label>
            <input type="text" v-model="companyInfo.footerSubtitle" placeholder="输入底部简介小标题" />
          </div>
          
          <div class="form-group">
            <label>公司简介内容</label>
            <textarea v-model="companyInfo.introContent" placeholder="输入公司简介内容，每行一段" rows="8"></textarea>
          </div>
          
          <div class="form-group">
            <label>公司简介图片URL</label>
            <input type="text" v-model="companyInfo.image" placeholder="输入图片URL地址（留空使用默认图片）" />
            <div class="image-preview" v-if="companyInfo.image">
              <img :src="companyInfo.image" alt="预览" />
              <p class="preview-hint">图片预览（将显示在官网关于我们页面）</p>
            </div>
            <small style="color: #666; margin-top: 5px; display: block;">
              建议尺寸：800x600 像素
            </small>
          </div>
        </div>
        
        <div v-if="successMessage" class="success-message alert-box">
          <strong>成功</strong>
          <p>{{ successMessage }}</p>
          <button @click="successMessage = null" class="alert-close">×</button>
        </div>

        <div class="form-actions">
          <button @click="saveAll" class="btn btn-primary" :disabled="loading">
            {{ loading ? '保存中...' : '保存所有信息' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LocationManager',
  data() {
    return {
      location: {
        name: '绿色动力新能源科技有限公司',
        address: '惠州市惠阳区工业园区',
        phone: '138-0013-8000',
        email: 'info@greenpower.com'
      },
      companyInfo: {
        introTitle: '公司简介',
        introContent: '',
        image: '',
        footerSubtitle: ''
      },
      loading: false,
      successMessage: null
    }
  },
  mounted() {
    this.loadLocation()
    this.loadCompanyInfo()
  },
  methods: {
    async loadLocation() {
      try {
        const response = await axios.get('/api/location')
        if (response.data) {
          this.location = response.data
        }
      } catch (error) {
        console.error('加载位置信息失败:', error)
      }
    },
    
    async loadCompanyInfo() {
      try {
        const response = await axios.get('/api/company-info')
        if (response.data) {
          this.companyInfo = response.data
        }
      } catch (error) {
        console.error('加载公司简介失败:', error)
      }
    },
    
    async saveAll() {
      this.loading = true
      try {
        await Promise.all([
          axios.post('/api/location', this.location),
          axios.post('/api/company-info', this.companyInfo)
        ])
        this.successMessage = '公司信息保存成功'
        window.scrollTo(0, 0)
        setTimeout(() => {
          this.successMessage = null
        }, 3000)
      } catch (error) {
        console.error('保存信息失败:', error)
        this.successMessage = null
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.location-manager {
  padding: 20px 0;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.card-header {
  margin-bottom: 30px;
}

.card-header h2 {
  color: #00a878;
  margin-bottom: 5px;
}

.card-header p {
  color: #666;
  font-size: 14px;
}

.info-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.info-section:last-of-type {
  border-bottom: none;
}

.info-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #00a878;
  box-shadow: 0 0 0 2px rgba(0, 168, 120, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #00a878;
  color: white;
}

.btn-primary:hover {
  background-color: #008f68;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
}

.image-preview {
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.image-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-hint {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}
</style>