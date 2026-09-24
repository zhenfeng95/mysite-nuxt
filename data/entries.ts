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
    id: 'oqumail',
    name: 'OquMail',
    description:
      '在已有域名上建邮箱。整理免费额度、DNS 绑定方式和创建邮箱的顺序；域名可继续留在原注册商，不必转到 OquMail，按引导添加 MX、SPF、DKIM、DMARC。完整图文步骤在 Zhen Invest。',
    url: 'https://oqumail.com',
    tags: ['邮箱', '域名', '免费'],
    guideSlug: 'oqumail-free-domain-email-guide',
    guideLabel: '阅读节选',
  },
  {
    id: 'dnshe',
    name: 'DNSHE',
    description:
      '免费二级域名注册与 DNS 解析，适合演示站、测试环境和开源项目。整理定位、常见后缀、注册与解析边界，以及 2026 年起按年免费续期的规则。完整图文步骤在 Zhen Invest。',
    url: 'https://www.dnshe.com',
    tags: ['域名', 'DNS', '免费域名'],
    guideSlug: 'dnshe-free-domain-guide',
    guideLabel: '阅读节选',
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description:
      '长期持有 .com 时，要看续费价，而不只看首年促销。比较 Google Workspace 购域和 Cloudflare Registrar 各自解决的问题；区域定价、账单与下单步骤不在本页展开，全文在 Zhen Invest。',
    url: 'https://workspace.google.com',
    tags: ['Workspace', '邮箱', '域名'],
    guideSlug: 'google-workspace-domain-guide',
    guideLabel: '阅读说明',
  },
]
