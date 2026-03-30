# 宠物缘 App - 打包部署指南

## 📱 方案1: PWA（渐进式Web应用）- ✅ 已配置

### 什么是PWA？
PWA可以让用户直接从浏览器"添加到主屏幕"，像原生app一样使用，支持离线访问。

### 已完成的配置
✅ 安装了 `vite-plugin-pwa`
✅ 配置了 Service Worker
✅ 添加了应用清单（manifest）
✅ 配置了图片缓存

### 使用步骤

#### 1. 构建项目
```bash
npm run build
# 或
pnpm build
```

#### 2. 部署到服务器
将 `dist` 目录部署到以下任一平台：

**免费托管平台：**
- **Vercel** (推荐)
  ```bash
  npm i -g vercel
  vercel
  ```

- **Netlify**
  ```bash
  npm i -g netlify-cli
  netlify deploy --prod
  ```

- **GitHub Pages**
- **Cloudflare Pages**

#### 3. 用户如何安装
1. 用手机浏览器打开你的网站
2. iOS: 点击"分享" → "添加到主屏幕"
3. Android: 浏览器会自动提示"添加到主屏幕"

### 需要准备的图标
在 `/public` 目录添加：
- `icon-192.png` (192x192像素)
- `icon-512.png` (512x512像素)

---

## 📦 方案2: Capacitor（打包成真正的原生App）

### 安装步骤

#### 1. 安装 Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
```

#### 2. 初始化 Capacitor
```bash
npx cap init
# App name: 宠物缘
# App ID: com.yourcompany.petapp
```

#### 3. 构建Web应用
```bash
npm run build
```

#### 4. 添加平台
```bash
# Android
npx cap add android

# iOS (需要Mac)
npx cap add ios
```

#### 5. 同步代码
```bash
npx cap sync
```

#### 6. 打开原生IDE进行打包

**Android:**
```bash
npx cap open android
```
在 Android Studio 中：
- Build → Generate Signed Bundle / APK
- 选择 APK
- 创建或选择签名密钥
- Build

**iOS (需要Mac和Apple开发者账号):**
```bash
npx cap open ios
```
在 Xcode 中：
- 设置 Team 和 Bundle ID
- Product → Archive
- Distribute App

---

## 🚀 快速部署命令

### Vercel 部署（最简单）
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod
```

### Netlify 部署
```bash
# 1. 安装 Netlify CLI
npm i -g netlify-cli

# 2. 登录
netlify login

# 3. 部署
netlify deploy --prod --dir=dist
```

---

## 📋 Capacitor配置文件示例

创建 `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.petapp',
  appName: '宠物缘',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ec4899",
      showSpinner: false,
    }
  }
};

export default config;
```

---

## 🎯 推荐方案

### 如果你想要：
- ✅ **最快上线** → 使用PWA + Vercel部署
- ✅ **发布到应用商店** → 使用Capacitor
- ✅ **功能最全** → Capacitor + 原生插件

### PWA优势：
- 无需审核，立即发布
- 自动更新
- 跨平台（iOS/Android/Desktop）
- 开发简单

### Capacitor优势：
- 真正的原生App
- 可发布到App Store / Google Play
- 可使用原生功能（相机、通知、生物识别等）
- 更好的性能

---

## 📱 添加原生功能示例

如果使用Capacitor，可以添加：

```bash
# 相机功能
npm install @capacitor/camera

# 推送通知
npm install @capacitor/push-notifications

# 分享功能
npm install @capacitor/share
```

在代码中使用：
```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    resultType: CameraResultType.Uri
  });
  // 使用 image.webPath
};
```

---

## 🔧 常见问题

### Q: PWA和原生App有什么区别？
A: PWA是网页，但体验像App。原生App需要从应用商店下载。

### Q: 需要Mac才能打包iOS吗？
A: 是的，iOS必须在Mac上使用Xcode打包。

### Q: 打包后数据会丢失吗？
A: 不会，localStorage在PWA和原生App中都可用。

### Q: 如何更新App？
A: PWA自动更新。原生App需要用户手动更新或强制更新。

---

## 📞 需要帮助？

1. PWA测试: 部署后访问 https://your-url.com
2. Lighthouse检查: Chrome DevTools → Lighthouse → PWA
3. 检查Service Worker: Chrome DevTools → Application → Service Workers
