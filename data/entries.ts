export interface InfraEntry {
  id: string
  name: string
  description: string
  url: string
  tags: string[]
  guideSlug?: string
  guideLabel?: string
}

export const infraEntries: InfraEntry[] = [
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description:
      '通过 Google Workspace 区域定价长期持有 .com 等顶级域名：开通购域、取消席位订阅、转到 Cloudflare 托管解析的完整步骤与注意点。',
    url: 'https://workspace.google.com',
    tags: ['Workspace', '邮箱', '域名'],
    guideSlug: 'google-workspace-domain-guide',
    guideLabel: '低价域名教程',
  },
  {
    id: 'spaceship',
    name: 'Spaceship',
    description:
      '用 Spaceship 注册低价 .xyz：约 $0.99/年（约四五元）主要面向 6–9 位纯数字档；说明为何必须纯数字、续费注意点，以及接到 Cloudflare 的建议。',
    url: 'https://www.spaceship.com',
    tags: ['.xyz', '纯数字', '低价'],
    guideSlug: 'spaceship-xyz-domain-guide',
    guideLabel: '.xyz 低价教程',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    description:
      '个人小站可以不买服务器：用免费套餐串起 DNS / CDN / SSL、Pages、Workers、D1、R2、Turnstile、Email Routing，附博客最小闭环、额度算账与可复制的 AI 提示词。',
    url: 'https://www.cloudflare.com',
    tags: ['免费建站', 'Pages', 'Workers'],
    guideSlug: 'cloudflare-free-stack-guide',
    guideLabel: '全家桶教程',
  },
  {
    id: 'dnshe',
    name: 'DNSHE',
    description:
      '免费二级域名注册与 DNS 解析，适合演示站、测试环境和开源项目。整理定位、开放后缀、控制台解析、按年续期与 API 注意点，以及接到 Cloudflare 的步骤。',
    url: 'https://www.dnshe.com',
    tags: ['域名', 'DNS', '免费域名'],
    guideSlug: 'dnshe-free-domain-guide',
    guideLabel: '使用介绍',
  },
  {
    id: 'oqumail',
    name: 'OquMail',
    description:
      '在已有域名上建邮箱。整理免费额度、DNS 绑定、创建邮箱与收发测试步骤，以及 Outlook 等第三方客户端实测登录方法；域名可继续留在原注册商，不必转到 OquMail。',
    url: 'https://oqumail.com',
    tags: ['邮箱', '域名', '免费'],
    guideSlug: 'oqumail-free-domain-email-guide',
    guideLabel: '使用教程',
  },
]
