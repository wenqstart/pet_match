# 宠物缘 - 宠物相亲记账App

## 项目介绍

一款为宠物主人打造的多功能App，集成了宠物管理、相亲配对、开支记账和纪念日提醒等功能。

## 核心功能

### 🏠 首页
- 宠物列表展示
- 快速访问各功能模块
- 数据统计概览

### 💝 宠物相亲
- 滑动浏览其他宠物资料
- 点赞匹配系统
- 详细的宠物信息展示

### 💰 宠物记账
- 多分类记账（食品、医疗、玩具、美容等）
- 月度/总开支统计
- 分类支出分析

### 📅 纪念日管理
- 生日、领养日等重要日期
- 倒计时提醒
- 自定义纪念日

### ➕ 宠物管理
- 支持多宠物管理
- 详细的宠物档案
- 个性化标签

## 技术栈

- ⚛️ React 18
- 🎨 Tailwind CSS v4
- 🚀 Vite
- 🧭 React Router v7
- 📱 PWA支持
- 💾 LocalStorage数据持久化

## 快速开始

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 部署

### PWA部署（推荐）

项目已配置PWA支持，用户可直接添加到手机主屏幕使用。

**快速部署到Vercel:**
```bash
npm i -g vercel
vercel
```

详细部署指南请查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 打包成原生App

如需打包成iOS/Android原生应用，可使用Capacitor：

```bash
# 安装Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# 初始化
npx cap init

# 构建并添加平台
npm run build
npx cap add android  # 或 ios

# 打开原生IDE
npx cap open android  # 或 ios
```

完整步骤参考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 项目结构

```
src/
├── app/
│   ├── components/     # 可复用组件
│   │   ├── ui/        # UI组件库
│   │   └── Layout.tsx # 布局组件
│   ├── pages/         # 页面组件
│   │   ├── Home.tsx
│   │   ├── Dating.tsx
│   │   ├── Expenses.tsx
│   │   ├── Memories.tsx
│   │   ├── AddPet.tsx
│   │   └── PetDetail.tsx
│   ├── data/          # 模拟数据
│   ├── types.ts       # 类型定义
│   ├── routes.tsx     # 路由配置
│   └── App.tsx        # 应用入口
└── styles/            # 全局样式
```

## 数据结构

### Pet（宠物）
```typescript
interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat" | "other";
  breed: string;
  gender: "male" | "female";
  age: number;
  birthday: string;
  avatar: string;
  personality: string[];
  owner: string;
  bio: string;
  lookingFor: string;
}
```

### Expense（开支）
```typescript
interface Expense {
  id: string;
  petId: string;
  category: "food" | "medical" | "toys" | "grooming" | "other";
  amount: number;
  description: string;
  date: string;
}
```

### Anniversary（纪念日）
```typescript
interface Anniversary {
  id: string;
  petId: string;
  title: string;
  date: string;
  type: "birthday" | "adoption" | "custom";
  notes?: string;
}
```

## 功能特点

✅ 响应式设计，支持移动端和桌面端
✅ PWA支持，可离线使用
✅ 本地数据持久化
✅ 优雅的动画和过渡效果
✅ 直观的用户界面
✅ 支持多宠物管理
✅ 完整的数据统计分析

## 后续优化建议

- 🔐 添加用户登录系统
- ☁️ 集成云端数据库（如Supabase）
- 📷 支持拍照上传头像
- 💬 添加宠物主人聊天功能
- 📊 更丰富的数据可视化
- 🔔 推送通知提醒
- 🌐 多语言支持

## License

MIT
