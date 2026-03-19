# COVID-19 ICU 信息平台（Remake）

将原有多仓库架构（backend Go + frontend Vue 2 + certificate-verify + robot-wechaty）统一为一个 **Next.js 14 + Cloudflare** 应用。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| UI | MUI 5 + Emotion |
| 部署 | Cloudflare Pages（通过 @opennextjs/cloudflare） |
| 数据库 | Cloudflare D1 |
| 文件存储 | Cloudflare R2 |
| 国际化 | next-intl (zh / en) |
| 证书验证 | openpgp v5 |
| 通知 | Telegram Bot API |

## 目录结构

```
remake/
├── db/
│   └── schema.sql            # D1 数据库 schema（12 张表）
├── public/                   # 静态资源
├── src/
│   ├── app/
│   │   ├── layout.tsx        # 根布局（Providers + AppShell）
│   │   ├── page.tsx          # 首页
│   │   ├── people/           # 市民端
│   │   │   ├── page.tsx              # 入口
│   │   │   ├── supplies/             # 社区物资
│   │   │   │   ├── page.tsx
│   │   │   │   └── submit/page.tsx   # 提交表单
│   │   │   ├── platforms/
│   │   │   │   ├── medical/page.tsx  # 医疗平台
│   │   │   │   └── psychological/page.tsx  # 心理援助
│   │   │   └── accommodations/page.tsx     # 市民住宿
│   │   ├── staff/            # 医护端
│   │   │   ├── page.tsx
│   │   │   ├── accommodations/page.tsx     # 医护住宿
│   │   │   ├── platforms/psychological/    # 心理援助（复用市民页）
│   │   │   └── supplies/                   # 医院物资
│   │   │       ├── page.tsx
│   │   │       └── submit/page.tsx
│   │   ├── volunteer/        # 志愿者端
│   │   │   ├── page.tsx
│   │   │   └── supplies/     # 复用医护端物资页
│   │   ├── verify/           # PGP 证书验证
│   │   │   └── page.tsx
│   │   └── api/              # API Routes（替代原 Go 后端）
│   │       ├── accommodations/       # 医护住宿 CRUD
│   │       ├── people/accommodations/# 市民住宿 CRUD
│   │       ├── hospital/supplies/    # 医院物资 GET + POST
│   │       ├── community/supplies/   # 社区物资 GET + POST
│   │       ├── platforms/medical/    # 医疗平台 GET
│   │       ├── platforms/psychological/ # 心理平台 GET
│   │       ├── epidemic/query/       # 疫情数据查询
│   │       ├── epidemic/subscribe/   # 疫情订阅
│   │       ├── certificate/verify/   # PGP 签名验证
│   │       ├── files/[...path]/      # R2 文件代理
│   │       ├── report/               # 举报
│   │       ├── wiki/stream/          # 资讯流
│   │       ├── locale/               # 切换语言
│   │       └── cron/epidemic/        # 定时抓取疫情数据
│   ├── components/           # 共享组件（13 个）
│   │   ├── AppShell.tsx      # 导航抽屉 + AppBar
│   │   ├── DataTable.tsx     # 带分页/地区筛选的数据列表
│   │   ├── PlaceSelector.tsx # 省市区三级联动
│   │   ├── FormItem.tsx      # 通用表单项
│   │   ├── ReportDialog.tsx  # 举报对话框
│   │   ├── ContactDialog.tsx # 联系方式对话框
│   │   ├── SupplyDetailDialog.tsx # 物资详情弹窗
│   │   ├── RoleIndex.tsx     # 角色首页卡片列表
│   │   ├── HomeDescription.tsx
│   │   ├── Footer.tsx
│   │   ├── LocaleSwitcher.tsx
│   │   ├── Paginator.tsx
│   │   └── Providers.tsx     # MUI Theme + Intl + Context
│   ├── i18n/                 # 国际化
│   │   ├── request.ts
│   │   └── messages/
│   │       ├── zh.json
│   │       └── en.json
│   ├── lib/                  # 工具库
│   │   ├── api.ts            # 前端 fetch 封装
│   │   ├── bindings.ts       # D1 / R2 / ENV 绑定
│   │   ├── geo.ts            # 地理定位 + Haversine
│   │   ├── notify.ts         # Telegram 通知
│   │   ├── strings.ts        # 联系方式解析 / truthiness
│   │   ├── templates.ts      # 消息模板格式化
│   │   ├── theme.ts          # MUI 主题（#a20002）
│   │   └── time.ts           # OADate 转换
│   └── types/
│       └── index.ts          # 所有 TypeScript 类型定义
├── wrangler.toml             # Cloudflare 配置
├── next.config.mjs
├── tsconfig.json
├── env.d.ts                  # Cloudflare Env 类型声明
└── package.json
```

## 快速开始

### 前置要求

- Node.js >= 18
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)（`npm i -g wrangler`）
- Cloudflare 账号

### 安装依赖

```bash
cd remake
npm install
```

### 创建 Cloudflare 资源

```bash
# 创建 D1 数据库
wrangler d1 create covid19-db
# 将返回的 database_id 填入 wrangler.toml

# 创建 R2 存储桶
wrangler r2 bucket create covid19-files
```

### 初始化数据库

```bash
# 本地开发
npm run db:migrate:local

# 远程（生产）
npm run db:migrate:remote
```

### 配置环境变量

编辑 `wrangler.toml` 中的 `[vars]`（非机密项）：

| 变量 | 说明 |
|------|------|
| `EPIDEMIC_API_URL` | 疫情数据 API 地址（默认腾讯） |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile 站点公钥（前端可见） |

以下机密项请通过 `wrangler secret put` 设置，**不要写入 `wrangler.toml`**：

| 变量 | 说明 |
|------|------|
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token（用于举报/提交通知） |
| `TELEGRAM_CHAT_ID` | Telegram 群组 Chat ID |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile 服务端密钥 |
| `ADMIN_TOKEN_SECRET` | 管理员 Cookie 签名密钥 |
| `CRON_SECRET` | 手动触发 `/api/cron/epidemic` 时的 Bearer Token（Cloudflare Cron Trigger 自动调用时不需要）|

### 本地开发

```bash
npm run dev
```

### 预览（Cloudflare 本地模拟）

```bash
npm run preview
```

### 部署

```bash
npm run deploy
```

## 定时任务

`wrangler.toml` 配置了每 30 分钟执行一次的 Cron Trigger，自动调用 `/api/cron/epidemic` 抓取最新疫情数据写入 D1。

也可手动触发：

```bash
curl https://your-domain.com/api/cron/epidemic
```

## 从原架构的迁移说明

| 原仓库 | 迁移至 |
|--------|--------|
| `backend/`（Go + Shimo API） | `src/app/api/` (API Routes + D1) |
| `frontend/`（Vue 2 + Vuetify） | `src/app/` 页面 + `src/components/` (MUI) |
| `certificate-verify/`（Vue + openpgp） | `src/app/verify/page.tsx` + `src/app/api/certificate/` |
| `robot-wechaty/`（定时抓取疫情） | `src/app/api/cron/epidemic/route.ts` + Cron Trigger |
| Shimo 表格数据源 | Cloudflare D1 数据库 |
| 静态文件托管 | Cloudflare R2 |

## 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Next.js 开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 构建并在 Cloudflare 本地预览 |
| `npm run deploy` | 构建并部署到 Cloudflare Pages |
| `npm run db:migrate:local` | 本地 D1 执行 schema 迁移 |
| `npm run db:migrate:remote` | 远程 D1 执行 schema 迁移 |
| `npm run db:seed:local` | 本地 D1 导入种子数据 |
| `npm run lint` | ESLint 检查 |

## License

MIT
