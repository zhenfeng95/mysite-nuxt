export interface ToolEntry {
  slug: string
  /** Card / H1 short label */
  title: string
  /** Document title (without site brand suffix) */
  seoTitle: string
  description: string
  href: string
}

export interface ToolGroup {
  id: string
  title: string
  description?: string
  tools: ToolEntry[]
}

export const toolGroups: ToolGroup[] = [
  {
    id: 'network',
    title: '网络与域名',
    description: '查解析、看域名信息、测连通、看网站与证书是否正常，以及 IP 归属。',
    tools: [
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
        slug: 'status',
        title: '网站状态检测',
        seoTitle: '网站状态检测：在线看网站是否可访问、状态码与响应耗时',
        description:
          '输入网址或域名，从本站服务器检测目标是否可访问，查看 HTTP 状态码、重定向与响应耗时，快速判断站点是否正常。',
        href: '/tools/status',
      },
      {
        slug: 'ssl',
        title: 'SSL 证书查看',
        seoTitle: 'SSL 证书查看：在线查 HTTPS 证书到期时间与颁发者',
        description:
          '输入域名或网址，查看 HTTPS 证书的生效/到期时间、剩余天数、颁发者与备用名（SAN），方便核对自动续期是否正常。',
        href: '/tools/ssl',
      },
      {
        slug: 'ip',
        title: 'IP 归属地',
        seoTitle: 'IP 归属地查询：运营商、ASN 与当前访问 IP',
        description: '查询公网 IP 或域名的归属地、运营商和 ASN。支持粘贴网址，也可查看当前访问的公网 IP。',
        href: '/tools/ip',
      },
    ],
  },
  {
    id: 'utility',
    title: '效率与计算',
    description: '编解码、二维码、日历速算与房贷估算。',
    tools: [
      {
        slug: 'encode',
        title: '编解码与随机串',
        seoTitle: 'Base64 / URL 编解码与随机字符串生成',
        description: 'Base64、URL 编解码，以及可配置字符集的随机字符串生成，适合处理链接、Token 与配置片段。',
        href: '/tools/encode',
      },
      {
        slug: 'qrcode',
        title: '二维码生成',
        seoTitle: '二维码生成：把链接或文案生成可下载二维码',
        description: '输入网址或任意文案，生成二维码。可调尺寸与容错级别，支持下载与复制图片。',
        href: '/tools/qrcode',
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
    ],
  },
  {
    id: 'focus',
    title: '专注减压',
    description: '白噪音与番茄钟，帮你专注一会儿、休息一会儿。',
    tools: [
      {
        slug: 'noise',
        title: '白噪音',
        seoTitle: '白噪音：粉红噪声、雨声与环境音，本地播放助专注',
        description: '浏览器本地生成白噪声、粉红噪声、棕噪声与雨声，可调音量，不上传、不依赖外链音频。',
        href: '/tools/noise',
      },
      {
        slug: 'pomodoro',
        title: '番茄钟',
        seoTitle: '番茄钟：专注与休息倒计时',
        description: '经典番茄工作法倒计时：专注、短休、长休可自定义，结束时提示音与浏览器通知。',
        href: '/tools/pomodoro',
      },
    ],
  },
  {
    id: 'games',
    title: '小游戏',
    description: '适合手机点着玩：捏泡泡、木鱼、赛博抽签、云养、消消看与接水果。',
    tools: [
      {
        slug: 'bubbles',
        title: '捏泡泡',
        seoTitle: '捏泡泡：点破泡泡解压，带清脆声效',
        description: '满屏泡泡，点一下破一个，配上清脆「啪」声。不用通关，纯解压。',
        href: '/tools/bubbles',
      },
      {
        slug: 'muyu',
        title: '木鱼',
        seoTitle: '指尖木鱼：点击积功德，可挂机自动敲',
        description: '点一下敲一声木鱼，功德 +1。可开启自动敲，也可搭配白噪音一起用。',
        href: '/tools/muyu',
      },
      {
        slug: 'lot',
        title: '赛博抽签',
        seoTitle: '赛博抽签：摇一摇或点一下，抽取幽默治愈签文',
        description: '电子抽签：点按或摇一摇出签。文案幽默、治愈、带点网感，仅供娱乐。',
        href: '/tools/lot',
      },
      {
        slug: 'nurture',
        title: '云养',
        seoTitle: '云养猫 / 云种树：点击喂食浇水的极简养成',
        description: '养一只猫或种一棵树。点击喂食、浇水，看简单动画反馈。进度保存在本机。',
        href: '/tools/nurture',
      },
      {
        slug: 'match3',
        title: '消消看',
        seoTitle: '消消看：简化三消，点选相邻方块交换消除',
        description: '点选两个相邻方块交换，三个及以上相同即可消除。连锁得分，适合轻松解压。',
        href: '/tools/match3',
      },
      {
        slug: 'catch',
        title: '接水果',
        seoTitle: '接水果：左右移动接住掉落的水果',
        description: '左右移动篮子接住掉落的水果，接到得分，漏掉三次结束。支持键盘与触屏。',
        href: '/tools/catch',
      },
    ],
  },
]

/** Flat list for search, sitemap, and slug lookup */
export const tools: ToolEntry[] = toolGroups.flatMap(group => group.tools)

export function findTool(slug: string) {
  return tools.find(tool => tool.slug === slug)
}

export const TOOLS_HUB = {
  title: '实用工具',
  seoTitle: '实用工具：网络排查、效率计算、减压与小游戏',
  description: '实用工具：DNS、域名、Ping、网站状态、SSL 证书、IP、编解码、二维码、日历、房贷、白噪音、番茄钟，以及捏泡泡、木鱼、赛博抽签等。',
  path: '/tools',
} as const
