# 🚀 Solana Token Monitor

[![GitHub stars](https://img.shields.io/github/stars/786440445/solana-token-monitor)](https://github.com/786440445/solana-token-monitor/stargazers)
[![GitHub license](https://img.shields.io/github/license/786440445/solana-token-monitor)](https://github.com/786440445/solana-token-monitor)

实时监控 Solana 链上热门代币的 Web 应用。

## ✨ 功能特性

### 🔍 代币监控
- **实时数据** - 监控 Solana 链上最新的代币信息
- **多维度排序** - 按交易量、价格、涨幅、流动性、市值排序
- **搜索过滤** - 按名称、符号、地址搜索代币
- **新币发现** - 快速发现 24 小时内的新代币

### 💼 钱包功能
- **多钱包支持** - Phantom、Solflare、Ledger 等
- **代币余额** - 查看钱包中持有的代币
- **安全连接** - 使用官方 wallet-adapter

### 📊 数据可视化
- **价格图表** - 24 小时价格走势
- **交易量图表** - 交易量分布
- **实时更新** - 自动刷新数据

### ⭐ 用户功能
- **收藏代币** - 收藏关注的项目（本地存储）
- **响应式设计** - 支持手机和桌面设备
- **深色模式** - 护眼深色主题

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + Vite |
| 样式 | Tailwind CSS |
| 状态管理 | TanStack Query |
| 图表 | Recharts |
| 钱包适配器 | @solana/wallet-adapter-react |
| 图标 | Lucide React |
| 构建工具 | Vite |

## 📊 数据来源

- **DEX Screener API** - 代币价格、交易量、流动性
- **Helius RPC** - Solana 链上数据

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone https://github.com/786440445/solana-token-monitor.git
cd solana-token-monitor

# 安装依赖
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173)

### 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
solana-token-monitor/
├── src/
│   ├── components/           # React 组件
│   │   ├── Header/         # 导航栏组件
│   │   ├── TokenCard/      # 代币卡片
│   │   ├── TokenList/      # 代币列表
│   │   ├── TokenDetail/    # 代币详情
│   │   ├── FilterPanel/    # 过滤面板
│   │   ├── Stats/          # 统计卡片
│   │   └── common/         # 通用组件
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useSolanaTokens/ # 代币数据 Hook
│   │   └── useWallet/       # 钱包连接 Hook
│   ├── services/           # API 服务
│   │   ├── dexScreenerApi.js  # DEX Screener API
│   │   └── solanaApi.js       # Solana RPC API
│   ├── utils/              # 工具函数
│   │   └── formatters.js     # 格式化工具
│   ├── pages/              # 页面
│   │   └── Home.jsx          # 首页
│   ├── App.jsx             # 主应用
│   └── main.jsx            # 入口文件
├── public/                 # 静态资源
├── package.json
├── tailwind.config.js     # Tailwind 配置
└── vite.config.js         # Vite 配置
```

## 🔧 配置

### 环境变量

项目使用以下免费 API，无需配置即可使用：

- **DEX Screener API**: `https://api.dexscreener.com/latest/dex`
- **Helius RPC**: 使用公开节点

如需更多功能，可以配置：

```env
# Helius API Key (用于更快的 RPC 请求)
HELIUS_API_KEY=your-helius-api-key
```

### 钱包配置

支持以下钱包：
- Phantom（推荐）
- Solflare
- Ledger
- Slope
- Backpack

## 📈 支持的代币排序方式

- 📊 交易量 (Volume)
- 💰 价格 (Price)
- 📈 涨幅 (Price Change)
- 💧 流动性 (Liquidity)
- 🏆 市值 (Market Cap)

## 🌐 部署

### Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/786440445/solana-token-monitor)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/786440445/solana-token-monitor)

### Docker

```bash
# 构建镜像
docker build -t solana-token-monitor .

# 运行容器
docker run -p 3000:3000 solana-token-monitor
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

**786440445**

- GitHub: [@786440445](https://github.com/786440445)

---

⭐ 如果这个项目对你有帮助，欢迎点个 Star！
