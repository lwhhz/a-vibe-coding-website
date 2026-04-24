# 网页展示



| 首页                                                         | 次页                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://github.com/lwhhz/a-vibe-coding-website/blob/main/screenshot/PixPin_2026-04-24_15-36-56.png?raw=true) | ![](https://github.com/lwhhz/a-vibe-coding-website/blob/main/screenshot/PixPin_2026-04-24_15-37-09.png?raw=true) |
| 次页                                                         | 产品页                                                       |
| ![](https://github.com/lwhhz/a-vibe-coding-website/blob/main/screenshot/PixPin_2026-04-24_15-37-31.png?raw=true) | ![](https://github.com/lwhhz/a-vibe-coding-website/blob/main/screenshot/PixPin_2026-04-24_15-38-48.png?raw=true) |
| 后台页                                                       | 咨询表单页                                                   |
| ![](https://github.com/lwhhz/a-vibe-coding-website/blob/main/screenshot/PixPin_2026-04-24_15-48-28.png?raw=true) | ![](https://github.com/lwhhz/a-vibe-coding-website/blob/main/screenshot/PixPin_2026-04-24_15-48-48.png?raw=true) |

# 本地部署

## 1. 环境准备

### 1.1 安装 Node.js 和 npm

项目前后端都使用 Node.js 环境，需要安装 Node.js 14+ 版本。

### 1.2 安装 MySQL 数据库

项目使用 MySQL 数据库，需要安装 MySQL 服务并创建数据库。

## 2. 配置文件

### 2.1 创建 .env 文件

在 backend 目录下创建 .env 文件，配置以下环境变量：

```
PORT=5000 #后端服务器端口，默认5000
DB_HOST=localhost #数据库主机，默认localhost
DB_PORT=3306 #MySQL默认端口
DB_USER=root #MySQL默认用户名
DB_PASSWORD= #MySQL密码，自己设定
DB_NAME= #数据库名称，自己设定
SECRET_KEY=your-secret-key #密钥，可以不管
```

## 3. 依赖安装

### 3.1 安装后端依赖

```Shell
cd backend
npm install
```

### 3.2 安装前端依赖

```Shell
cd frontend
npm install
```

### 3.3 安装后台管理系统依赖

```Shell
cd backend/admin
npm install

cd backend/admin-contact
npm install
```

## 4. 数据库设置

### 4.1 启动 MySQL 服务/MySQL Workbench

确保 MySQL 服务正在运行。

### 4.2 创建数据库

登录 MySQL 并创建数据库：

```MySQL
CREATE DATABASE 自定的数据库名称 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

或者打开MySQL Workbench，在“MySQL Connections”处选择默认配置好的服务，在左侧选择“Schemas”并在上方空白处右键，点击“create schema...”设定好数据库名称即可。

## 5. 启动服务

### 5.1 启动后端服务器

```Shell
cd backend
npm start
# 或开发模式
npm run dev
```

### 5.2 启动前端开发服务器

```Shell
cd frontend
npm run dev
```

### 5.3 启动后台管理系统

```Shell
cd backend/admin
npm run dev

# 启动联系表单管理系统
cd backend/admin-contact
npm run dev
```

## 6. 访问地址

会在终端显示。

## 项目使用了以下技术栈：

- 后端：Express + MySQL + Sequelize
- 前端：Vue 3 + Vue Router + Axios
- 构建工具：Vite

