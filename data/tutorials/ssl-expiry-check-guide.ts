export const sslExpiryCheckGuide = {
  slug: 'ssl-expiry-check-guide',
  kind: 'steps' as const,
  title: 'HTTPS 证书还有多久到期？在线查询与续期注意点',
  description:
    '说明如何查看网站 HTTPS 证书的生效与到期时间、剩余天数，附站内 SSL 证书查看工具；并对照自动签发与 acme.sh 续期常见问题。',
  updatedAt: '2026-10-27',
  blocks: [
    {
      type: 'p' as const,
      parts: [
        '站点突然变成「不安全」，浏览器一堆红字——很多时候不是被黑了，而是证书过期了。Vercel、Cloudflare Pages 一类托管通常会自动续；自己买的 VPS、宝塔、纯 Nginx 则要靠 acme.sh 或面板任务。不管哪一种，先会看「还有多久到期」最省事。',
      ],
    },
    {
      type: 'note' as const,
      text: '想马上查：打开站内「SSL 证书查看」，输入域名即可看到颁发者、生效/到期时间与剩余天数。下文说明结果怎么读、多久算危险、和自动续期怎么配合。',
    },
    {
      type: 'p' as const,
      parts: [
        '在线工具：',
        { text: 'SSL 证书查看', href: '/tools/ssl' },
        '（从本站服务器发起 TLS 握手读取证书，不探测内网地址）。',
      ],
    },

    { type: 'h2' as const, text: '一、一分钟查到期' },
    {
      type: 'ol' as const,
      items: [
        ['打开 ', { text: 'SSL 证书查看', href: '/tools/ssl' }],
        '输入 example.com 或 https://example.com',
        '查看「剩余天数」「到期时间」「颁发者」与状态色块',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '状态大致是：',
      ],
    },
    {
      type: 'ul' as const,
      items: [
        '证书有效：剩余天数较充足，且校验通过；',
        '即将到期（≤30 天）：该准备确认自动续期是否在跑；',
        '已过期：访客会看到不安全提示，需立刻续期或排查签发失败；',
        '异常或不受信：可能是自签、链不完整、域名与证书不匹配等。',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '本机也可以用命令行粗查（把域名换掉）：',
      ],
    },
    {
      type: 'code' as const,
      lang: 'bash',
      text: `echo | openssl s_client -servername 你的域名 -connect 你的域名:443 2>/dev/null | openssl x509 -noout -dates -subject -issuer`,
    },

    { type: 'h2' as const, text: '二、多久算「该紧张」' },
    {
      type: 'table' as const,
      headers: ['剩余时间', '建议动作'],
      rows: [
        ['> 30 天', '常规巡检即可；可把工具页加入收藏'],
        ['7–30 天', '确认自动续期任务存在，看最近一次续期日志'],
        ['< 7 天或已过期', '优先手工触发续期 / 在托管面板重签，再查工具确认'],
      ],
    },
    {
      type: 'p' as const,
      parts: [
        'Let\'s Encrypt 一类证书常见周期约 90 天，自动续期一般会在到期前一段时间触发。若你「从没配过续期」却一直能打开 HTTPS，多半是托管商在替你续——换平台或改成自建机时，不要默认它会跟着走。',
      ],
    },

    { type: 'h2' as const, text: '三、不同托管，证书谁负责' },
    {
      type: 'ul' as const,
      items: [
        'Vercel / Cloudflare Pages 等：绑定自定义域名后通常自动签发与续期。仍建议偶尔用工具扫一眼，避免面板异常未续上。',
        'Cloudflare 代理（橙云）开启时：访客侧常看到 Cloudflare 边缘证书；源站证书是另一回事。改 DNS 架构时两边都要心里有数。',
        [
          '自建 VPS + Nginx：需要 acme.sh、certbot 或面板「SSL」任务。完整步骤见 ',
          { text: 'acme.sh 一键申请与自动续期', href: '/guides/acme-sh-certificate-guide' },
          '。',
        ],
      ],
    },

    { type: 'h2' as const, text: '四、常见踩坑' },
    {
      type: 'ul' as const,
      items: [
        '只给 www 签了证，裸域没签（或反过来），一种能开一种报不安全；',
        '续期成功了，但 Nginx 没 reload，仍在用旧证书文件；',
        'DNS 指错、80/443 被墙或安全组没放行，导致 HTTP-01 校验失败；',
        '多级反向代理终止了 TLS，内网源站证书过期但外网暂时看起来还好——架构一变就爆。',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '站点是否还能打开，可搭配 ',
        { text: '网站状态检测', href: '/tools/status' },
        '；解析是否指对可用 ',
        { text: 'DNS 查询', href: '/tools/dns' },
        '。',
      ],
    },

    { type: 'h2' as const, text: '五、和免费建站路径的关系' },
    {
      type: 'p' as const,
      parts: [
        '若你走的是「便宜域名 + Cloudflare + 静态托管」：证书多半不用自己 cron。把 ',
        { text: 'SSL 证书查看', href: '/tools/ssl' },
        ' 当作上线检查清单里的一项即可。总览见 ',
        { text: '2026 免费建站一条龙', href: '/guides/free-site-pipeline-guide' },
        '。',
      ],
    },

    { type: 'h2' as const, text: '六、相关入口' },
    {
      type: 'ul' as const,
      items: [
        ['工具：', { text: 'SSL 证书查看', href: '/tools/ssl' }],
        ['站内：', { text: 'acme.sh 证书教程', href: '/guides/acme-sh-certificate-guide' }],
        ['站内：', { text: '免费建站一条龙', href: '/guides/free-site-pipeline-guide' }],
        ['站内：', { text: 'Vercel 国内访问优化', href: '/guides/vercel-china-speed-guide' }],
        ['站内：', { text: '网站状态检测', href: '/tools/status' }],
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '证书策略、自动续期时机与面板文案可能变化。以各托管商与证书颁发机构文档为准。本页仅供排查对照。',
      ],
    },
  ],
}
