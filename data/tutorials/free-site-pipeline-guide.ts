export const freeSitePipelineGuide = {
  slug: 'free-site-pipeline-guide',
  kind: 'steps' as const,
  title: '2026 免费建站一条龙：便宜域名 + Cloudflare + 静态托管',
  description:
    '个人博客、文档站、小工具站如何尽量少花钱上线：选便宜或免费域名、接到 Cloudflare DNS、用 Vercel 或 Cloudflare Pages 托管，并链到站内分步教程与排查工具。',
  updatedAt: '2026-10-27',
  blocks: [
    {
      type: 'p' as const,
      parts: [
        '想做一个个人站，最劝退的往往不是「不会写页面」，而是以为必须先买服务器、配面板、搞证书。2026 年对静态站、预渲染站来说，完全可以走另一条路：便宜域名 + 免费 DNS/CDN 能力 + 免费静态托管，一个下午就能上线。',
      ],
    },
    {
      type: 'note' as const,
      text: '本页是总览导航：帮你按顺序选路，细节步骤点进站内对应长文。额度、价格、控制台文案会变，下单与部署前以各平台当时页面为准。',
    },
    {
      type: 'p' as const,
      parts: [
        '适合：个人博客、作品集、文档站、前端 Demo、工具站。不太适合：强依赖传统 PHP 整站、必须国内备案接入的业务站（那条路见 ',
        { text: '网站运行机制与上线部署', href: '/guides/website-deploy-guide' },
        '）。',
      ],
    },

    { type: 'h2' as const, text: '一、先定路径：四步闭环' },
    {
      type: 'ol' as const,
      items: [
        '有一个能解析的域名（便宜顶级域或免费二级域）',
        'DNS 接到可管理的地方（常见是 Cloudflare）',
        '站点托管到 Vercel 或 Cloudflare Pages（或 GitHub Pages）',
        'HTTPS、改内容自动部署、出问题用工具自查',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '下面按这四步展开，每一步只写「怎么选」，操作细节链到现成教程。',
      ],
    },

    { type: 'h2' as const, text: '二、域名：先有「自己的地址」' },
    {
      type: 'p' as const,
      parts: [
        '域名分三类常见选择，按预算与用途挑：',
      ],
    },
    {
      type: 'table' as const,
      headers: ['你的情况', '可以看', '站内教程'],
      rows: [
        ['想花几块钱拿正规顶级域，能接受纯数字', 'Spaceship 低价 .xyz（6–9 位纯数字档）', 'Spaceship 教程'],
        ['更在意 .com 品牌，能接受 Workspace 路径', 'Google Workspace 区域购域', 'Workspace 低价 .com'],
        ['只做 Demo / 临时站，能接受二级域', 'DNSHE 等免费二级域', 'DNSHE 教程'],
      ],
    },
    {
      type: 'ul' as const,
      items: [
        [
          { text: 'Spaceship 低价 .xyz', href: '/digital-infra/spaceship-xyz-domain-guide' },
          '：约 $0.99/年档要盯「纯数字 + 位数」，续费别默认永远四五块。',
        ],
        [
          { text: 'Google Workspace 低价 .com', href: '/digital-infra/google-workspace-domain-guide' },
          '：品牌更稳，步骤比买 .xyz 绕一点。',
        ],
        [
          { text: 'DNSHE 免费域名', href: '/digital-infra/dnshe-free-domain-guide' },
          '：适合试验；长期对外形象仍建议自有顶级域。',
        ],
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '需要 you@你的域名.com 收信时，可在域名就绪后接 ',
        { text: 'OquMail 域名邮箱', href: '/digital-infra/oqumail-free-domain-email-guide' },
        '。',
      ],
    },

    { type: 'h2' as const, text: '三、DNS：多数情况接到 Cloudflare' },
    {
      type: 'p' as const,
      parts: [
        '把注册商处的 Nameserver 改成 Cloudflare 提供的两条 NS 之后，解析、基础 CDN/防护、免费证书相关能力可以收拢到一个后台。完整「少买服务器」清单见 ',
        { text: 'Cloudflare 全家桶', href: '/digital-infra/cloudflare-free-stack-guide' },
        '。',
      ],
    },
    {
      type: 'note' as const,
      text: '注意：若站点部署在 Vercel 且在意国内访问速度，自定义域名记录建议用「仅 DNS / 灰云」，不要开橙云代理——否则晚高峰可能被调度到美西。详见下方 Vercel 专文。',
    },

    { type: 'h2' as const, text: '四、托管：Vercel 还是 Cloudflare Pages' },
    {
      type: 'p' as const,
      parts: [
        '静态站 / 预渲染站，免费档里最常对比的是 GitHub Pages、Vercel、Cloudflare Pages。详细对比与踩坑见 ',
        { text: '免费静态托管怎么选', href: '/guides/free-static-hosting-guide' },
        '。这里只给选型口诀：',
      ],
    },
    {
      type: 'ul' as const,
      items: [
        '国内读者多、在意晚高峰：优先试 Vercel，区域选新加坡/香港，DNS 直指或灰云；',
        '要 Cloudflare 生态一体、静态流量策略宽松：用 Pages；',
        '开源文档、海外读者、只想跟仓库绑在一起：GitHub Pages。',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '已经上了 Vercel 但国内慢：按 ',
        { text: 'Vercel 国内访问：区域与 DNS', href: '/guides/vercel-china-speed-guide' },
        ' 排查。',
      ],
    },

    { type: 'h2' as const, text: '五、上线后：证书、更新与自查' },
    {
      type: 'ul' as const,
      items: [
        [
          'HTTPS：Vercel / Cloudflare Pages 绑定自定义域名后一般会自动签证书。自建机或要手工续期时看 ',
          { text: 'acme.sh 证书教程', href: '/guides/acme-sh-certificate-guide' },
          '；随时查剩余天数用 ',
          { text: 'SSL 证书查看', href: '/tools/ssl' },
          '。',
        ],
        [
          '内容更新：连 Git 仓库后，push 对应分支即可自动构建。自建机自动拉代码见 ',
          { text: 'GitHub Webhook 自动部署', href: '/guides/github-webhook-deploy-guide' },
          '。',
        ],
        [
          '出问题自查：',
          { text: 'DNS 查询', href: '/tools/dns' },
          '、',
          { text: '网站状态', href: '/tools/status' },
          '、',
          { text: '在线 Ping', href: '/tools/ping' },
          '、',
          { text: 'SSL 证书', href: '/tools/ssl' },
          '。',
        ],
      ],
    },

    { type: 'h2' as const, text: '六、一张表走完' },
    {
      type: 'table' as const,
      headers: ['步骤', '动作', '站内入口'],
      rows: [
        ['1 域名', '买便宜 .xyz / .com，或先用免费二级域', 'Spaceship / Workspace / DNSHE'],
        ['2 DNS', 'NS 指到 Cloudflare（Vercel 站注意灰云）', 'Cloudflare 全家桶'],
        ['3 托管', 'Vercel 或 Pages 连仓库部署', '免费托管怎么选'],
        ['4 优化', 'Vercel 选亚太区域，直指 DNS', 'Vercel 国内访问'],
        ['5 证书', '自动签发；到期用工具查', 'SSL 证书查看 / acme.sh'],
        ['6 邮箱（可选）', '域名邮箱收信', 'OquMail'],
      ],
    },

    { type: 'h2' as const, text: '七、写在最后' },
    {
      type: 'p' as const,
      parts: [
        '免费建站的关键不是找齐十个「白嫖」项目，而是把闭环跑通：有域名、能解析、能打开、能更新、证书没过期。先上线，再按读者网络与内容形态微调托管与 DNS。',
      ],
    },
    {
      type: 'ul' as const,
      items: [
        [{ text: '建站攻略首页', href: '/digital-infra' }],
        [{ text: '实用工具', href: '/tools' }],
        [{ text: 'HTTPS 证书还有多久到期', href: '/guides/ssl-expiry-check-guide' }],
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '产品名称、免费额度与售价可能随时调整。购域、改 NS、绑定自定义域名前，请以各平台结账页与文档为准。本页仅供路径对照，不构成购买建议。',
      ],
    },
  ],
}
