export interface ToolEntry {
  slug: string
  /** Card / H1 short label */
  title: string
  /** Document title (without site brand suffix) */
  seoTitle: string
  description: string
  href: string
}

export const tools: ToolEntry[] = [
  {
    slug: 'dns',
    title: 'DNS 查询',
    seoTitle: 'DNS 查询：在线查 A / MX / TXT 等解析是否生效',
    description:
      '查询域名 A / AAAA / CNAME / MX / TXT / NS / SOA 解析是否已生效，改完 Nameserver 或邮箱记录后可在此核对。',
    href: '/tools/dns',
  },
  {
    slug: 'domain',
    title: '域名信息粗查',
    seoTitle: '域名信息粗查：WHOIS / RDAP 注册信息与 DNS 解析',
    description:
      '一次查看域名的注册信息（RDAP / WHOIS）与 A / MX / NS / TXT 等常用 DNS 解析，方便核对改 NS、加记录后是否生效。',
    href: '/tools/domain',
  },
  {
    slug: 'ping',
    title: '在线 Ping',
    seoTitle: '在线 Ping：从本站测域名或 IP 的连通、延迟与丢包',
    description:
      '输入域名或 IP，从本站服务器探测连通性、延迟和丢包。无法发送 ICMP 时，改用 TCP 443 或 80 测量建连时间。',
    href: '/tools/ping',
  },
  {
    slug: 'ip',
    title: 'IP 归属地',
    seoTitle: 'IP 归属地查询：运营商、ASN 与当前访问 IP',
    description: '查询公网 IP 或域名的归属地、运营商和 ASN。支持粘贴网址，也可查看当前访问的公网 IP。',
    href: '/tools/ip',
  },
  {
    slug: 'encode',
    title: '编解码与随机串',
    seoTitle: 'Base64 / URL 编解码与随机字符串生成',
    description: 'Base64、URL 编解码，以及可配置字符集的随机字符串生成，适合处理链接、Token 与配置片段。',
    href: '/tools/encode',
  },
  {
    slug: 'calendar',
    title: '日历',
    seoTitle: '日历：农历节气、法定节假日、工作日与证书到期速算',
    description:
      '月历、农历节气、大陆法定节假日与调休、下次放假倒计时、工作日统计、证书到期速算与时间戳互转。',
    href: '/tools/calendar',
  },
  {
    slug: 'mortgage',
    title: '房贷计算器',
    seoTitle: '房贷计算器：等额本息 / 等额本金月供与利息明细',
    description:
      '按贷款金额、年限与年利率计算等额本息或等额本金的月供、总利息与还款明细，支持商业贷、公积金与组合贷。',
    href: '/tools/mortgage',
  },
]

export function findTool(slug: string) {
  return tools.find(tool => tool.slug === slug)
}

export const TOOLS_HUB = {
  title: '实用工具',
  seoTitle: '建站实用工具：DNS、域名、Ping、IP、编解码、日历与房贷',
  description: '实用工具：DNS 查询、域名粗查、在线 Ping、IP 归属地、编解码、日历与房贷计算等，配合站内教程使用。',
  path: '/tools',
} as const
