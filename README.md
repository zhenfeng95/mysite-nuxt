# ZZF / zzf.net.cn

个人技术笔记，域名是 [zzf.net.cn](https://zzf.net.cn)。备案号：**京ICP备2024066915号-2**。

站点用 Nuxt 3 做静态生成，页面在 HTML 里就能读到正文，方便国内站长平台收录。内容只保留数字基建：DNSHE、OquMail，以及 Google Workspace 的说明。港美股、开户和加密货币不放在这个域名上。

Google Workspace 那篇只说明两条购域路径各自解决什么问题。地区切换、账单地址和支付步骤留在 [Zhen Invest 全文](https://zheninvest.com/tutorials/google-workspace-domain-guide)。

## 本地运行

需要 Node 20 或更高。当前机器默认可能是 Node 16，先切换：

```bash
nvm use
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`。

## 发布

```bash
nvm use
npm run generate
```

把 `.output/public` 上传到备案接入的国内主机网站根目录。不要把这个域名解析到 Cloudflare Workers，否则备案接入会对不上。

## 页面

- `/` 首页，只说明笔记和数字基建各放什么
- `/guides` 笔记目录，部署步骤
- `/digital-infra` 数字基建，基建服务的官网与说明
- `/guides/website-deploy-guide`
- `/guides/github-webhook-deploy-guide`
- `/guides/acme-sh-certificate-guide`
- `/digital-infra/dnshe-free-domain-guide`
- `/digital-infra/oqumail-free-domain-email-guide`
- `/digital-infra/google-workspace-domain-guide`

数字基建各服务可链到本站节选；文末「查看全文」指向 `zheninvest.com`。部署、GitHub 自动拉取和 acme.sh 证书这三篇的步骤在本站网站部署目录。
