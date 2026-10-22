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
    description: '查解析、看域名信息、测连通与 IP 归属。',
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
    description: '编解码、日历速算与房贷估算。',
    tools: [
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
    description: '浏览器里随手玩一会儿：2048、消消看、贪吃蛇与接水果。',
    tools: [
      {
        slug: '2048',
        title: '2048',
        seoTitle: '2048：经典数字合并小游戏',
        description: '滑动合并相同数字，目标凑出 2048。支持键盘与触屏，成绩保存在本机。',
        href: '/tools/2048',
      },
      {
        slug: 'match3',
        title: '消消看',
        seoTitle: '消消看：简化三消，点选相邻方块交换消除',
        description: '点选两个相邻方块交换，三个及以上相同即可消除。连锁得分，适合轻松解压。',
        href: '/tools/match3',
      },
      {
        slug: 'snake',
        title: '贪吃蛇',
        seoTitle: '贪吃蛇：吃食物变长，别撞墙和自己',
        description: '经典贪吃蛇。方向键或 WASD 控制，手机可滑动转向，最高分保存在本机。',
        href: '/tools/snake',
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
  seoTitle: '建站实用工具：网络排查、效率计算、减压与小游戏',
  description: '实用工具：DNS、域名、Ping、IP、编解码、日历、房贷、白噪音、番茄钟，以及 2048、消消看、贪吃蛇与接水果等。',
  path: '/tools',
} as const
