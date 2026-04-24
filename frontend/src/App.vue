<template>
  <div id="app">
    <header class="header header-transparent" :class="{ 'header-light': isHeaderLight }">
      <div class="container">
        <div class="header-content">
          <h1 class="logo">Callduck Company</h1>
          <nav class="nav" v-if="!isMobile">
            <router-link to="/" class="nav-link">首页</router-link>
            <router-link to="/products" class="nav-link">产品中心</router-link>
            <router-link to="/cases" class="nav-link">案例展示</router-link>
            <router-link to="/about" class="nav-link">关于我们</router-link>
            <router-link to="/contact" class="nav-link">联系我们</router-link>
          </nav>
          <button class="mobile-menu-btn" v-else @click="toggleMobileMenu">
            ☰
          </button>
        </div>
        <div class="mobile-menu" v-if="isMobileMenuOpen">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
          <router-link to="/products" class="mobile-nav-link" @click="closeMobileMenu">产品中心</router-link>
          <router-link to="/cases" class="mobile-nav-link" @click="closeMobileMenu">案例展示</router-link>
          <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">关于我们</router-link>
          <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu">联系我们</router-link>
        </div>
      </div>
    </header>
    <main :class="{ 'main-no-padding': isHomePage }">
      <router-view v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>{{ companyLocation.name }}</h3>
            <p>{{ companyInfo.footerSubtitle || '专业电瓶观光车制造商' }}</p>
          </div>
          <div class="footer-section">
            <h4>快速链接</h4>
            <ul>
              <li><router-link to="/">首页</router-link></li>
              <li><router-link to="/products">产品中心</router-link></li>
              <li><router-link to="/cases">案例展示</router-link></li>
              <li><router-link to="/about">关于我们</router-link></li>
              <li><router-link to="/contact">联系我们</router-link></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <p>电话: {{ companyLocation.phone }}</p>
            <p>地址: {{ companyLocation.address }}</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 {{ companyLocation.name }}. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      isMobile: window.innerWidth < 768,
      isMobileMenuOpen: false,
      companyLocation: {
        name: '绿色动力新能源科技有限公司',
        address: '惠州市惠阳区工业园区',
        phone: '138-0013-8000',
        email: 'info@greenpower.com'
      },
      companyInfo: {
        footerSubtitle: ''
      },
      isHeaderLight: false
    }
  },
  computed: {
    isHomePage() {
      return this.$route.path === '/'
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },
    async loadCompanyLocation() {
      try {
        const response = await axios.get('/location')
        this.companyLocation = response.data
      } catch (error) {
        console.error('加载公司位置失败:', error)
      }
    },
    async loadCompanyInfo() {
      try {
        const response = await axios.get('/company-info')
        if (response.data) {
          this.companyInfo = response.data
        }
      } catch (error) {
        console.error('加载公司信息失败:', error)
      }
    },
    checkBackgroundBrightness() {
      // 获取页面背景颜色
      const body = document.body
      const computedStyle = window.getComputedStyle(body)
      const backgroundColor = computedStyle.backgroundColor
      
      // 解析颜色值
      let r, g, b
      if (backgroundColor.startsWith('rgb')) {
        const match = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (match) {
          r = parseInt(match[1])
          g = parseInt(match[2])
          b = parseInt(match[3])
        }
      } else if (backgroundColor.startsWith('#')) {
        const hex = backgroundColor.replace('#', '')
        if (hex.length === 6) {
          r = parseInt(hex.substring(0, 2), 16)
          g = parseInt(hex.substring(2, 4), 16)
          b = parseInt(hex.substring(4, 6), 16)
        } else if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16)
          g = parseInt(hex[1] + hex[1], 16)
          b = parseInt(hex[2] + hex[2], 16)
        }
      }
      
      if (r !== undefined && g !== undefined && b !== undefined) {
        // 计算亮度 (0-255)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        // 如果亮度大于128，认为是亮色背景
        this.isHeaderLight = brightness > 128
      }
    }
  },
  mounted() {
    this.loadCompanyLocation()
    this.loadCompanyInfo()
    this.checkBackgroundBrightness()
    
    // 监听路由变化，重新检查背景亮度
    this.$router.afterEach(() => {
      setTimeout(() => {
        this.checkBackgroundBrightness()
      }, 100)
    })
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768
      if (!this.isMobile) {
        this.isMobileMenuOpen = false
      }
    })
  }
}
</script>