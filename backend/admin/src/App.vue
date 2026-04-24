<template>
  <div class="admin-container">
    <div class="admin-sidebar">
      <h2 class="admin-logo" style="color: white;">后台管理</h2>
      <nav class="admin-nav">
        <router-link to="/" class="nav-item">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">仪表盘</span>
        </router-link>
        <router-link to="/products" class="nav-item">
          <span class="nav-icon">🚗</span>
          <span class="nav-text">产品管理</span>
        </router-link>
        <router-link to="/cases" class="nav-item">
          <span class="nav-icon">📋</span>
          <span class="nav-text">案例管理</span>
        </router-link>
        <router-link to="/location" class="nav-item">
          <span class="nav-icon">📍</span>
          <span class="nav-text">公司信息修改</span>
        </router-link>
        <router-link to="/other-info" class="nav-item">
          <span class="nav-icon">⚙️</span>
          <span class="nav-text">其他信息修改</span>
        </router-link>
        <router-link to="/banners" class="nav-item">
          <span class="nav-icon">🖼️</span>
          <span class="nav-text">轮播图管理</span>
        </router-link>
      </nav>
    </div>
    <div class="admin-content">
      <header class="admin-header">
        <h1>{{ currentPage }}</h1>
      </header>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentPage: '仪表盘'
    }
  },
  watch: {
    $route(to) {
      this.updateCurrentPage(to.path)
    }
  },
  methods: {
    updateCurrentPage(path) {
      switch (path) {
        case '/':
          this.currentPage = '仪表盘'
          break
        case '/products':
          this.currentPage = '产品管理'
          break
        case '/cases':
          this.currentPage = '案例管理'
          break
        case '/location':
          this.currentPage = '公司信息修改'
          break
        case '/other-info':
          this.currentPage = '其他信息修改'
          break
        case '/banners':
        case '/banners/create':
          this.currentPage = '轮播图管理'
          break
        default:
          if (path.startsWith('/banners/edit')) {
            this.currentPage = '轮播图管理'
          } else {
            this.currentPage = '仪表盘'
          }
      }
    }
  },
  mounted() {
    this.updateCurrentPage(this.$route.path)
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #00a878;
  --secondary-color: #008f68;
  --background-color: #f5f7fa;
  --white: #ffffff;
  --text-color: #333333;
  --light-text: #666666;
  --border-color: #e0e0e0;
  --accent-color: #4a90e2;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.admin-container {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 250px;
  background-color: var(--primary-color);
  color: white;
  padding: 20px 0;
}

.admin-logo {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.admin-nav {
  padding: 0 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  text-decoration: none;
  color: white;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.nav-icon {
  margin-right: 15px;
  font-size: 18px;
}

.admin-content {
  flex: 1;
  padding: 30px;
  background-color: var(--background-color);
}

.admin-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.admin-header h1 {
  color: var(--primary-color);
  font-size: 24px;
}

.content {
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    padding: 10px 0;
  }
  
  .admin-logo {
    margin-bottom: 20px;
  }
  
  .admin-nav {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding: 0 10px;
  }
  
  .nav-item {
    white-space: nowrap;
    margin-bottom: 0;
  }
  
  .admin-content {
    padding: 20px;
  }
}
</style>