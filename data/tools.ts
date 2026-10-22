export interface ToolEntry {
  slug: string
  title: string
  description: string
  href: string
}

export const tools: ToolEntry[] = [
  {
    slug: 'dns',
    title: 'DNS 查询',
    description: '查 A / MX / TXT 等解析是否已生效，改完 Nameserver 或邮箱记录后可核对。',
    href: '/tools/dns',
  },
  {
    slug: 'domain',
    title: '域名信息粗查',
    description: '一次查看注册信息（RDAP / WHOIS）与常用 DNS 解析，方便核对改 NS、加记录。',
    href: '/tools/domain',
  },
  {
    slug: 'ping',
    title: '在线 Ping',
    description: '从本站服务器探测域名或 IP 是否连通，并查看延迟和丢包。',
    href: '/tools/ping',
  },
  {
    slug: 'ip',
    title: 'IP 归属地',
    description: '查询公网 IP 或域名的归属地、运营商和 ASN，也可以看当前访问 IP。',
    href: '/tools/ip',
  },
  {
    slug: 'encode',
    title: '编解码与随机串',
    description: 'Base64、URL 编解码，以及可配置字符集的随机字符串生成。',
    href: '/tools/encode',
  },
  {
    slug: 'calendar',
    title: '日历',
    description: '月历农历节气、法定节假日、放假倒计时、工作日与到期速算。',
    href: '/tools/calendar',
  },
]
