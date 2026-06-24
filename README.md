# 小鹿成长记 (Baby Growth Tracker)

一款专为新手爸妈设计的新生儿成长记录 App，采用可爱的长颈鹿暖黄主题，帮助轻松记录宝宝的喂养、睡眠、尿布、体重和黄疸等关键健康数据。

## 功能特性

### 核心记录（5 种类型）

| 记录类型 | 功能说明 |
|---------|---------|
| **喂养记录** | 支持母乳/配方奶/混合喂养，记录时间、奶量(ml)、时长(分钟) |
| **睡眠记录** | 记录入睡和起床时间，自动计算睡眠时长，支持"进行中"状态 |
| **尿布记录** | 记录湿尿布/便便，便便支持质地和颜色标注 |
| **体重记录** | 记录体重(kg)和身高(cm)，支持成长曲线图表展示 |
| **黄疸记录** | 记录黄疸指数(mg/dL)，支持额头/胸前/腹部三个测量部位，**超标自动警告**（>12 mg/dL 红色边框+警告标识） |

### 高级功能

- **语音快速记录** — 基于 Web Speech API，不支持时优雅降级
- **备注图片上传** — 每条记录可附加最多 9 张图片，自动压缩至 200KB 以内
- **相册管理** — 按日期分组浏览所有记录图片，支持筛选和详情查看
- **宝宝头像自定义** — 支持拍照或从相册选择，自动压缩至 100KB，圆形裁剪
- **成长曲线** — 体重/身高趋势图，直观展示宝宝成长轨迹
- **今日概览** — 首页摘要卡片，一目了然查看今日喂养、睡眠、尿布统计
- **数据导出** — 支持将记录导出为 CSV 格式

### UI/UX 特性

- **长颈鹿暖黄主题** — primary #F4A940 / secondary #8B5E3C / 背景 #FFF8EE
- **移动端优先** — 最大宽度 430px 居中，完美适配手机屏幕
- **安全区域适配** — 使用 `env(safe-area-inset-top)` 适配刘海屏/灵动岛
- **Android 原生支持** — 通过 Capacitor 打包为原生 APK

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建工具 | Vite 5 |
| UI 组件库 | MUI v5 (Material Design) |
| CSS | Tailwind CSS 3 |
| 状态管理 | Zustand + persist (localStorage) |
| 图表 | Recharts |
| 路由 | React Router v6 |
| 日期处理 | dayjs |
| 移动端 | Capacitor 8 |
| 测试 | Vitest + React Testing Library |
| 字体 | Nunito (标题) + Quicksand (正文) |

## 项目结构

```
baby_growth_tracker/
├── public/
│   ├── icons/                    # 应用图标（8 种尺寸 + adaptive icons）
│   ├── manifest.json             # PWA manifest
│   └── index.html
├── src/
│   ├── components/
│   │   ├── album/                # 相册相关组件
│   │   │   └── AlbumDetailDialog.tsx
│   │   ├── common/               # 通用组件
│   │   │   ├── BabyAvatar.tsx    # 宝宝头像（拍照/相册/删除）
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── GiraffeIcon.tsx   # 长颈鹿 SVG 图标
│   │   │   ├── GiraffeSpots.tsx  # 长颈鹿斑点装饰
│   │   │   ├── ImagePreview.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── QuickRecordSheet.tsx  # 快速记录面板
│   │   │   └── VoiceInputButton.tsx  # 语音输入按钮
│   │   ├── growth/               # 成长图表组件
│   │   │   ├── GrowthChart.tsx
│   │   │   └── StatsChart.tsx
│   │   ├── home/                 # 首页组件
│   │   │   ├── QuickRecordButtons.tsx
│   │   │   ├── RecentRecords.tsx
│   │   │   └── SummaryCards.tsx
│   │   ├── layout/               # 布局组件
│   │   │   ├── AppLayout.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── TopBar.tsx
│   │   └── records/              # 记录表单组件
│   │       ├── DiaperForm.tsx
│   │       ├── FeedingForm.tsx
│   │       ├── GrowthForm.tsx
│   │       ├── JaundiceForm.tsx
│   │       └── SleepForm.tsx
│   ├── hooks/
│   │   └── useSpeechRecognition.ts
│   ├── lib/                      # 工具库
│   │   ├── constants.ts          # 常量定义
│   │   ├── date.ts               # 日期工具
│   │   ├── image.ts              # 图片压缩
│   │   ├── speech.ts             # 语音识别
│   │   ├── storage.ts            # 数据存储 & CSV 导出
│   │   └── theme.ts              # MUI 主题配置
│   ├── pages/                    # 页面组件
│   │   ├── AlbumPage.tsx
│   │   ├── GrowthPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── RecordsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── store/                    # Zustand 状态管理
│   │   ├── useBabyStore.ts
│   │   ├── useRecordStore.ts
│   │   ├── useSettingsStore.ts
│   │   └── useUIStore.ts
│   ├── types/
│   │   └── index.ts              # TypeScript 类型定义
│   ├── App.tsx
│   ├── main.tsx
│   └── styles/
│       └── global.css
├── android/                      # Capacitor Android 项目
├── scripts/
│   └── gen_icons.py              # 图标生成脚本
├── capacitor.config.ts
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:3000` 预览应用。

### 运行测试

```bash
npm run test          # 运行所有测试（459 个）
npm run test:watch    # 监听模式
```

### 生产构建

```bash
npm run build         # TypeScript 编译 + Vite 构建
npm run preview       # 预览构建产物
```

## Android 构建

### 环境要求

- JDK 21 (Eclipse Temurin 推荐)
- Android SDK (platform-tools + android-36 + build-tools 36.0.0)
- Gradle 8.x

### 构建步骤

```bash
# 1. 同步 Web 资源到 Android 项目
npx cap sync android

# 2. 构建 Debug APK
cd android
export JAVA_HOME="path/to/jdk-21"
export ANDROID_SDK_ROOT="path/to/android-sdk"
gradle assembleDebug --no-daemon

# APK 输出路径：android/app/build/outputs/apk/debug/app-debug.apk
```

### 安装到手机

1. 将 `app-debug.apk` 传输到 Android 手机
2. 手机设置 → 允许安装未知来源应用
3. 点击 APK 文件安装

## 数据类型

应用使用 TypeScript 判别联合（Discriminated Union）管理 5 种记录类型：

```typescript
type RecordType = 'feeding' | 'sleep' | 'diaper' | 'growth' | 'jaundice';

type RecordItem = FeedingRecord | SleepRecord | DiaperRecord | GrowthRecord | JaundiceRecord;
```

所有数据通过 Zustand + persist 中间件存储在 localStorage：

| Store | localStorage Key | 用途 |
|-------|-----------------|------|
| useBabyStore | `bgt_babies` | 宝宝信息 |
| useRecordStore | `bgt_records` | 记录数据 |
| useSettingsStore | `bgt_settings` | 应用设置 |

## 设计系统

### 色彩

| 用途 | 颜色 | Hex |
|------|------|-----|
| Primary | 暖黄 | `#F4A940` |
| Secondary | 棕色 | `#8B5E3C` |
| Background | 奶油白 | `#FFF8EE` |
| Feeding | 珊瑚粉 | `#FF8A80` |
| Sleep | 薰衣草 | `#B39DDB` |
| Diaper | 天蓝 | `#81D4FA` |
| Growth | 翠绿 | `#81C784` |
| Jaundice | 橙粉 | `#FFAB91` |
| Warning | 红色 | `#E53935` |

### 字体

- **标题**：Nunito（圆润可爱）
- **正文**：Quicksand（清晰易读）

### 圆角系统

| 级别 | 值 |
|------|-----|
| xs | 6px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 20px |
| 2xl | 40px |

## 测试覆盖

项目包含 **459 个测试用例**，覆盖：

- 所有记录表单组件的渲染和提交逻辑
- 黄疸记录超标警告逻辑（边界值 12 mg/dL）
- 宝宝头像组件的交互（拍照/相册/删除）
- 快速记录面板的类型切换
- 记录卡片的渲染（包括超标警告）
- 成长图表数据展示
- CSV 数据导出
- 日期工具函数
- 常量定义验证

运行测试：

```bash
npm run test
```

## 开发历程

| 版本 | 内容 | 测试数 |
|------|------|--------|
| V1 | MVP — 喂养/睡眠/尿布/体重记录 + 成长曲线 + 统计图表 | 191 |
| V2 | 增量 — 语音记录 + 备注图片上传 + 相册功能 | 362 |
| V3 | UI 升级 — 长颈鹿暖黄主题 + Nunito/Quicksand 字体 | 387 |
| V4 | 优化 — Bug 修复 + 黄疸记录 + FAB 调整 | 427 |
| V5 | UI/UX — 安全区适配 + FAB 重定位 + 头像自定义 + 黄疸警告 + Logo 重设计 + APK 打包 | 459 |

## License

MIT
