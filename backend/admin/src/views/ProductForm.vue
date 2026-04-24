<template>
  <div class="product-form">
    <!-- 成功提示 -->
    <div v-if="successMessage" class="success-message alert-box">
      <strong>成功</strong>
      <p>{{ successMessage }}</p>
      <button @click="successMessage = null" class="alert-close">×</button>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="loadError" class="error-message alert-box">
      <strong>加载失败</strong>
      <p>{{ loadError }}</p>
      <pre v-if="loadErrorDetail">{{ loadErrorDetail }}</pre>
      <button @click="retryLoad" class="alert-close">×</button>
    </div>
    
    <!-- 保存错误提示 -->
    <div v-if="saveError" class="error-message alert-box">
      <strong>保存失败</strong>
      <p>{{ saveError }}</p>
      <pre v-if="saveErrorDetail">{{ saveErrorDetail }}</pre>
      <button @click="saveError = null" class="alert-close">×</button>
    </div>
    
    <div class="page-header">
      <h1 class="page-title">{{ isEdit ? '编辑产品' : '添加产品' }}</h1>
      <router-link to="/products" class="btn btn-outline">返回列表</router-link>
    </div>
    
    <!-- 加载中 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <template v-else>
      <div class="card">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">产品名称</label>
            <input type="text" id="name" v-model="formData.name" required />
          </div>
          
          <div class="form-group">
            <label for="description">产品描述</label>
            <textarea id="description" v-model="formData.description" required></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group" style="flex: 1; margin-right: 10px;">
              <label for="seats">座位数</label>
              <input type="number" id="seats" v-model="formData.seats" required />
            </div>
            
            <div class="form-group" style="flex: 1; margin-left: 10px;">
              <label for="price">价格</label>
              <input type="number" id="price" v-model="formData.price" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group" style="flex: 1; margin-right: 10px;">
              <label for="battery">电池类型</label>
              <input type="text" id="battery" v-model="formData.battery" required />
            </div>
            
            <div class="form-group" style="flex: 1; margin-left: 10px;">
              <label for="range">续航里程 (km)</label>
              <input type="number" id="range" v-model="formData.range" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group" style="flex: 1; margin-right: 10px;">
              <label for="maxSpeed">最高时速 (km/h)</label>
              <input type="number" id="maxSpeed" v-model="formData.maxSpeed" required />
            </div>
            
            <div class="form-group" style="flex: 1; margin-left: 10px;">
              <label for="chargingTime">充电时间</label>
              <input type="text" id="chargingTime" v-model="formData.chargingTime" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group" style="flex: 1; margin-right: 10px;">
              <label for="size">车身尺寸</label>
              <input type="text" id="size" v-model="formData.size" required />
            </div>
            
            <div class="form-group" style="flex: 1; margin-left: 10px;">
              <label for="loadCapacity">载重能力 (kg)</label>
              <input type="number" id="loadCapacity" v-model="formData.loadCapacity" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group" style="flex: 1; margin-right: 10px;">
              <label for="motorPower">电机功率 (W)</label>
              <input type="number" id="motorPower" v-model="formData.motorPower" required />
            </div>
            
            <div class="form-group" style="flex: 1; margin-left: 10px;">
              <label>产品图片 <span class="required">*</span></label>
              <div class="images-upload">
                <div v-for="(img, index) in formData.images" :key="index" class="image-input-item">
                  <input 
                    type="url" 
                    v-model="formData.images[index]" 
                    placeholder="请输入图片URL地址"
                    required
                  />
                  <button 
                    type="button" 
                    class="btn btn-danger btn-sm"
                    @click="removeImage(index)"
                    v-if="formData.images.length > 1"
                  >删除</button>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" @click="addImage">
                  + 添加图片
                </button>
              </div>
              <small style="color: #666; margin-top: 5px; display: block;">
                可添加多张产品图片，建议尺寸：800x600 像素
              </small>
              <div class="image-previews" v-if="formData.images.length > 0">
                <div v-for="(img, index) in formData.images" :key="'preview-'+index" class="preview-item">
                  <img :src="img" alt="预览" />
                  <span class="preview-index">{{ index + 1 }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>产品特点 <span style="font-weight: normal; color: #666;">(可选)</span></label>
            <div class="features-editor">
              <div v-for="(feature, index) in formData.features" :key="index" class="feature-item-edit">
                <div class="feature-row">
                  <input type="text" v-model="feature.icon" placeholder="图标 (如: 🔋)" class="icon-input" />
                  <input type="text" v-model="feature.title" placeholder="标题 (如: 高效电池)" class="title-input" />
                </div>
                <textarea v-model="feature.description" placeholder="描述文字" rows="2"></textarea>
                <button type="button" class="btn btn-danger btn-sm" @click="removeFeature(index)" v-if="formData.features.length > 1">删除</button>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" @click="addFeature">+ 添加特点</button>
            </div>
            <small style="color: #666; margin-top: 5px; display: block;">
              每个特点包含图标、标题和描述，将显示在产品详情页
            </small>
          </div>
          
          <div class="form-group">
            <label>适用场景 <span style="font-weight: normal; color: #666;">(可选)</span></label>
            <div class="applications-editor">
              <div v-for="(app, index) in formData.applications" :key="index" class="application-item-edit">
                <input type="text" v-model="app.icon" placeholder="图标 (如: 🏞️)" class="icon-input" />
                <input type="text" v-model="app.name" placeholder="场景名称 (如: 景区)" class="name-input" />
                <button type="button" class="btn btn-danger btn-sm" @click="removeApplication(index)" v-if="formData.applications.length > 1">删除</button>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" @click="addApplication">+ 添加场景</button>
            </div>
            <small style="color: #666; margin-top: 5px; display: block;">
              每个场景包含图标和名称，将显示在产品详情页
            </small>
          </div>
          
          <div class="form-group">
            <label>产品标签 <span style="font-weight: normal; color: #666;">(可选)</span></label>
            <div class="tags-editor">
              <div class="tags-list">
                <span v-for="(tag, index) in formData.tags" :key="index" class="tag-edit-item">
                  <input type="text" v-model="formData.tags[index]" placeholder="输入标签文字" />
                  <button type="button" class="btn btn-danger btn-sm" @click="removeTag(index)" v-if="formData.tags.length > 1">×</button>
                </span>
                <button type="button" class="btn btn-secondary btn-sm add-tag-btn" @click="addTag">+ 添加标签</button>
              </div>
            </div>
            <small style="color: #666; margin-top: 5px; display: block;">
              标签将显示为产品优势标识，如：本地制造、同城配送等
            </small>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">保存</button>
            <router-link to="/products" class="btn btn-outline">取消</router-link>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProductForm',
  data() {
    return {
      isEdit: false,
      formData: {
        name: '',
        description: '',
        seats: '',
        price: '',
        battery: '',
        range: '',
        maxSpeed: '',
        chargingTime: '',
        size: '',
        loadCapacity: '',
        motorPower: '',
        images: [''],
        features: [
          { icon: '🔋', title: '高效电池', description: '采用优质电池，续航里程长，使用寿命长' },
          { icon: '🛡️', title: '安全可靠', description: '多重安全保护系统，确保行驶安全' },
          { icon: '🚀', title: '动力强劲', description: '高性能电机，动力充足，爬坡能力强' },
          { icon: '🛠️', title: '易于维护', description: '结构简单，维护成本低，方便快捷' }
        ],
        applications: [
          { icon: '🏞️', name: '景区' },
          { icon: '🏢', name: '园区' },
          { icon: '🏨', name: '酒店' },
          { icon: '🛍️', name: '商场' },
          { icon: '🏥', name: '医院' },
          { icon: '🏫', name: '校园' }
        ],
        tags: ['本地制造', '同城配送', '上门售后']
      },
      loading: false,
      successMessage: null,
      loadError: null,
      loadErrorDetail: null,
      saveError: null,
      saveErrorDetail: null
    }
  },
  mounted() {
    const id = this.$route.params.id
    if (id) {
      this.isEdit = true
      this.loadProduct(id)
    }
  },
  methods: {
    async loadProduct(id) {
      this.loading = true
      try {
        this.loadError = null
        this.loadErrorDetail = null
        const response = await axios.get(`/api/products/${id}`)
        // 处理images字段
        if (response.data.images && Array.isArray(response.data.images) && response.data.images.length > 0) {
          response.data.images = [...response.data.images]
        } else {
          response.data.images = response.data.image ? [response.data.image] : ['']
        }
        // 处理features字段
        if (!response.data.features || !Array.isArray(response.data.features) || response.data.features.length === 0) {
          response.data.features = [
            { icon: '🔋', title: '高效电池', description: '采用优质电池，续航里程长，使用寿命长' },
            { icon: '🛡️', title: '安全可靠', description: '多重安全保护系统，确保行驶安全' },
            { icon: '🚀', title: '动力强劲', description: '高性能电机，动力充足，爬坡能力强' },
            { icon: '🛠️', title: '易于维护', description: '结构简单，维护成本低，方便快捷' }
          ]
        }
        // 处理applications字段
        if (!response.data.applications || !Array.isArray(response.data.applications) || response.data.applications.length === 0) {
          response.data.applications = [
            { icon: '🏞️', name: '景区' },
            { icon: '🏢', name: '园区' },
            { icon: '🏨', name: '酒店' },
            { icon: '🛍️', name: '商场' },
            { icon: '🏥', name: '医院' },
            { icon: '🏫', name: '校园' }
          ]
        }
        // 处理tags字段
        if (!response.data.tags || !Array.isArray(response.data.tags) || response.data.tags.length === 0) {
          response.data.tags = ['本地制造', '同城配送', '上门售后']
        }
        this.formData = response.data
      } catch (error) {
        this.loadError = '加载产品失败，请稍后重试'
        this.loadErrorDetail = this.getErrorDetails(error)
        console.error('加载产品失败:', error)
      } finally {
        this.loading = false
      }
    },
    async retryLoad() {
      const id = this.$route.params.id
      if (id) {
        await this.loadProduct(id)
      }
    },
    async submitForm() {
      this.loading = true
      this.saveError = null
      this.saveErrorDetail = null
      this.successMessage = null
      try {
        // 过滤掉空的图片URL
        const filteredImages = this.formData.images.filter(img => img && img.trim() !== '')
        const submitData = { ...this.formData, images: filteredImages }
        
        if (this.isEdit) {
          await axios.put(`/api/products/${this.$route.params.id}`, submitData)
          this.successMessage = '产品更新成功'
        } else {
          await axios.post('/api/products', submitData)
          this.successMessage = '产品添加成功'
        }
        window.scrollTo(0, 0)
        setTimeout(() => {
          this.$router.push('/products')
        }, 1500)
      } catch (error) {
        this.saveError = '保存产品失败，请稍后重试'
        this.saveErrorDetail = this.getErrorDetails(error)
        console.error('保存产品失败:', error)
      } finally {
        this.loading = false
      }
    },
    addImage() {
      this.formData.images.push('')
    },
    removeImage(index) {
      this.formData.images.splice(index, 1)
    },
    addFeature() {
      this.formData.features.push({ icon: '', title: '', description: '' })
    },
    removeFeature(index) {
      this.formData.features.splice(index, 1)
    },
    addApplication() {
      this.formData.applications.push({ icon: '', name: '' })
    },
    removeApplication(index) {
      this.formData.applications.splice(index, 1)
    },
    addTag() {
      this.formData.tags.push('')
    },
    removeTag(index) {
      this.formData.tags.splice(index, 1)
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
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.images-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.image-input-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.image-input-item input {
  flex: 1;
}

.btn-sm {
  padding: 5px 15px;
  font-size: 14px;
}

.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 75px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-index {
  position: absolute;
  top: 2px;
  left: 2px;
  background-color: rgba(0, 168, 120, 0.9);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
}

.features-editor,
.applications-editor {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.feature-item-edit,
.application-item-edit {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.feature-row {
  display: flex;
  gap: 10px;
}

.icon-input {
  width: 100px !important;
}

.title-input,
.name-input {
  flex: 1 !important;
}

.feature-item-edit textarea,
.application-item-edit input {
  width: 100%;
}

.tags-editor {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.tag-edit-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background-color: white;
  border-radius: 20px;
  border: 1px solid var(--primary-color);
}

.tag-edit-item input {
  border: none;
  background: transparent;
  min-width: 80px;
  font-size: 14px;
}

.tag-edit-item input:focus {
  outline: none;
}

.tag-edit-item .btn-danger {
  padding: 2px 6px;
  line-height: 1;
  font-size: 16px;
  background-color: transparent;
  color: #dc3545;
  border: none;
}

.tag-edit-item .btn-danger:hover {
  color: #a71d2a;
}

.add-tag-btn {
  border-radius: 20px;
}
</style>
