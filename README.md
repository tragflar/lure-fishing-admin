# React Admin System

一个基于 React + TypeScript + Ant Design + Vite 构建的现代化 B 端管理系统。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design 5.x
- **路由管理**: React Router DOM 6.x
- **状态管理**: Zustand
- **样式方案**: Tailwind CSS + CSS Modules
- **代码规范**: ESLint + Prettier
- **包管理器**: npm

## 功能特性

### 🎨 界面设计
- 现代化的 UI 设计，支持亮色/暗色主题切换
- 响应式布局，适配桌面端和移动端
- 丰富的交互动画和过渡效果
- 基于 Ant Design 的组件体系

### 🔐 权限管理
- 完整的用户管理系统
- 灵活的角色权限配置
- 细粒度的权限控制
- 安全的登录认证机制

### 📊 系统管理
- 用户管理：用户的增删改查、状态管理
- 角色管理：角色配置、权限分配
- 权限管理：菜单权限、按钮权限、API权限
- 系统概览：数据统计、快捷操作

### 🚀 开发体验
- TypeScript 类型安全
- 热模块替换 (HMR)
- 代码分割和懒加载
- 完善的错误处理
- 统一的代码规范

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── Breadcrumb.tsx  # 面包屑导航
│   └── Empty.tsx       # 空状态组件
├── hooks/              # 自定义 Hooks
│   └── useTheme.ts     # 主题管理
├── lib/                # 工具库
│   └── utils.ts        # 通用工具函数
├── pages/              # 页面组件
│   ├── system/         # 系统管理页面
│   │   ├── UserManagement.tsx
│   │   ├── RoleManagement.tsx
│   │   └── PermissionManagement.tsx
│   ├── Home.tsx        # 首页
│   ├── Login.tsx       # 登录页
│   └── SystemManagement.tsx # 系统管理概览
├── App.tsx             # 应用主组件
├── main.tsx           # 应用入口
└── index.css          # 全局样式
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 使用说明

### 登录系统

1. 访问登录页面
2. 输入任意用户名和密码（演示系统）
3. 点击登录按钮进入系统

### 系统管理

- **用户管理**: 管理系统用户，支持添加、编辑、删除、查看详情等操作
- **角色管理**: 配置用户角色，设置角色权限
- **权限管理**: 管理系统权限，支持表格和树形两种视图

### 主题切换

点击右上角用户头像，选择主题切换选项即可在亮色和暗色主题间切换。

## 开发指南

### 添加新页面

1. 在 `src/pages` 目录下创建新的页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 在菜单配置中添加对应的菜单项

### 添加新组件

1. 在 `src/components` 目录下创建组件文件
2. 遵循 TypeScript 类型定义规范
3. 使用 Ant Design 组件保持设计一致性

### 样式开发

- 优先使用 Tailwind CSS 工具类
- 复杂样式使用 CSS Modules
- 遵循响应式设计原则

## 部署说明

### 静态部署

构建完成后，将 `dist` 目录部署到静态文件服务器即可。

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-api-server;
    }
}
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT License