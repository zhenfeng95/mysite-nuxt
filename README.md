# 真途 / zhenvia.com

个人技术笔记，域名是 [zhenvia.com](https://zhenvia.com)。

站点用 Nuxt 3 做**全量预渲染**（`nuxt generate`），部署在 **Vercel**。构建产物是静态 HTML，由 Vercel 边缘节点直接命中缓存（`x-vercel-cache: HIT`），不回源计算——和 wise-invest.org 用 Next.js 预渲染挂 Vercel 是同一类做法。

内容包含网站部署步骤，以及建站攻略：DNSHE、OquMail、Google Workspace、Cloudflare 全家桶等完整图文教程。港美股、开户和加密货币不放在这个域名上。

## 本地运行

需要 Node 20 或更高：

```bash
nvm use
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`。

## 发布到 Vercel

### 1. 连接仓库

1. 把代码推到 GitHub / GitLab / Bitbucket  
2. 在 [Vercel](https://vercel.com) 导入该仓库  
3. Framework Preset 选 **Nuxt.js**（沿用 `vercel.json` 即可）  
4. Build Command / Output 不要手填——交给 Nuxt 默认的 `nuxt build` 与 Vercel Output，**不要**把 `.output` 提交进仓库  
5. Functions Region：`vercel.json` 已指定 `sin1`；Hobby 只能选一个区域  
6. 部署  

说明：全站预渲染页面会进 Vercel 边缘缓存；`regions` 主要约束 Functions。不要提交 `.output/`，否则可能部署到旧的静态 HTML。

本地也可：

```bash
nvm use
npm i -g vercel
vercel
```

### 2. 绑定域名（关键：不要走 Cloudflare 代理）

速度差往往出在**入口节点**，不是页面体积。Cloudflare 橙云代理常见会进洛杉矶（`104.21` / `172.67`）；Vercel 在亚太可进新加坡（`sin1`）。

在域名注册商（如 Spaceship）把 DNS **直接**指到 Vercel，不要套 Cloudflare 代理：

1. Vercel 项目 → Settings → Domains → 添加 `zhenvia.com` / `www.zhenvia.com`  
2. 按提示在 DNS 添加记录（常见是 A / CNAME 到 Vercel 给出的地址，例如 `216.150.x.x` 一类，以控制台当时显示为准）  
3. 确认解析结果**不是** Cloudflare 的 `104.21.*` / `172.67.*`  
4. SSL 由 Vercel 自动签发

验证是否进了 Vercel 边缘：

```bash
curl -sI https://zhenvia.com/ | egrep -i 'server|x-vercel|age|cache'
```

期望看到类似：`server: Vercel`、`x-vercel-cache: HIT`、`x-vercel-id: sin1::...`（或离你更近的 POP）。

### 3. 备案说明

`zhenvia.com` 若仍要走国内备案接入，DNS 必须指到已备案的国内主机，**不能**同时指到 Vercel。二选一：

- 要亚太边缘速度 → 域名解析到 Vercel（本仓库目标）  
- 要保留国内备案接入 → 继续用国内主机托管 `.output/public`，不要指 Vercel / Cloudflare 代理  

## 本地预览静态产物

```bash
nvm use
npm run generate
npx serve .output/public
```

## 页面

- `/` 首页，只说明笔记和建站攻略各放什么  
- `/guides` 笔记目录，部署步骤  
- `/digital-infra` 建站攻略，服务官网与图文教程  
- `/about` 关于我们  
- `/contact` 联系我们  
- `/guides/website-deploy-guide`  
- `/guides/github-webhook-deploy-guide`  
- `/guides/acme-sh-certificate-guide`  
- `/digital-infra/google-workspace-domain-guide`  
- `/digital-infra/spaceship-xyz-domain-guide`  
- `/digital-infra/cloudflare-free-stack-guide`  
- `/digital-infra/dnshe-free-domain-guide`  
- `/digital-infra/oqumail-free-domain-email-guide`  

建站攻略教程含 Google Workspace、Spaceship .xyz、Cloudflare 全家桶、DNSHE、OquMail。部署、GitHub 自动拉取和 acme.sh 证书这三篇在网站部署目录。
