export const vercelChinaSpeedGuide = {
  slug: 'vercel-china-speed-guide',
  kind: 'steps' as const,
  title: 'Vercel 部署后国内很慢？区域与 DNS 这样设',
  description:
    'Vercel 上线后国内打开慢，常见不是页面太大，而是入口节点跑远了。说明如何选新加坡/香港区域、DNS 为何不要开 Cloudflare 橙云，以及用响应头自查是否命中亚太边缘。',
  updatedAt: '2026-10-27',
  blocks: [
    {
      type: 'p' as const,
      parts: [
        '站点已经挂在 Vercel 上了，自己白天测还行，一到国内晚高峰就转圈——很多人第一反应是「Vercel 不适合国内」。其实更常见的原因有两个：',
      ],
    },
    {
      type: 'ul' as const,
      items: [
        '部署区域落在欧美，请求要多绕半圈；',
        '域名 DNS 套了 Cloudflare「橙云」代理，流量先被调度到较远节点（常见是美西），再回源到 Vercel，把邻近区域的优势抵消掉。',
      ],
    },
    {
      type: 'note' as const,
      text: '先说结论：面向国内读者时，把 Functions / 部署区域选到新加坡（如 sin1）或香港一带；自定义域名的 DNS 直接指到 Vercel，不要开 Cloudflare 代理（灰云仅 DNS 可以）。改完用响应头看 x-vercel-id / x-vercel-cache，比凭感觉猜靠谱。',
    },
    {
      type: 'p' as const,
      parts: [
        '平台怎么选、晚高峰实测对比，可先看 ',
        { text: '免费静态托管怎么选', href: '/guides/free-static-hosting-guide' },
        '。本文只把「已经选了 Vercel、但国内慢」这件事讲透。',
      ],
    },

    { type: 'h2' as const, text: '一、慢在哪：入口节点，不是一定是体积' },
    {
      type: 'p' as const,
      parts: [
        '静态站、预渲染站在 Vercel 上，多数页面会进边缘缓存。用户慢的时候，往往是：浏览器解析域名 → 打到某个入口 IP → 若这个入口在洛杉矶一带，跨境延迟和丢包都会上去。',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '所以优化顺序建议是：先确认「请求落在哪」，再谈压缩图片、减脚本。后者当然有用，但解决不了「线路本身绕远」的问题。',
      ],
    },

    { type: 'h2' as const, text: '二、区域：尽量选新加坡或香港' },
    {
      type: 'p' as const,
      parts: [
        'Hobby 等个人档通常只能选一个 Functions 区域（控制台文案可能调整）。面向中国大陆读者时，优先试：',
      ],
    },
    {
      type: 'ul' as const,
      items: [
        '新加坡：sin1（本站实践里常用）',
        '香港：若控制台有对应选项，也可对比测几天晚高峰',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '设置入口一般在项目 Settings → Functions（或部署相关区域选项）。也可以在仓库根目录用 vercel.json 固定，例如：',
      ],
    },
    {
      type: 'code' as const,
      lang: 'json',
      text: `{
  "regions": ["sin1"]
}`,
    },
    {
      type: 'note' as const,
      text: 'regions 主要约束 Serverless Functions 所在区域。全站预渲染的静态 HTML 仍可能由边缘缓存命中；但对「首包、动态接口、未命中缓存的请求」来说，邻近区域依然重要。具体行为以 Vercel 当时文档为准。',
    },
    {
      type: 'p' as const,
      parts: [
        '改完重新部署，再在国内不同运营商、尤其是晚上测几次。区域选错时，白天偶然秒开、晚高峰崩盘的情况很常见。',
      ],
    },

    { type: 'h2' as const, text: '三、DNS：直接指 Vercel，别开橙云代理' },
    {
      type: 'p' as const,
      parts: [
        '这是国内慢最容易被忽略的坑。域名如果在 Cloudflare 做 DNS，记录旁的小云朵有两种状态：',
      ],
    },
    {
      type: 'ul' as const,
      items: [
        '灰云（仅 DNS）：解析到你填的目标，流量不经 Cloudflare 代理；',
        '橙云（已代理）：访客先连 Cloudflare 边缘，再回源。大陆没有 CF 节点时，晚高峰常会打到美西，延迟和丢包都上去。',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '站点挂在 Vercel、又在意国内速度时：自定义域名建议 ',
        'DNS 直接指向 Vercel 给出的 A / CNAME',
        '。若域名 DNS 仍托管在 Cloudflare，对应记录用「仅 DNS / 灰云」，不要开代理。',
      ],
    },
    { type: 'h3' as const, text: '操作摘要' },
    {
      type: 'ol' as const,
      items: [
        'Vercel 项目 → Settings → Domains → 添加你的域名（含 www 与裸域按需）',
        '按提示到注册商或 Cloudflare DNS 添加 A / CNAME（地址以控制台当时显示为准）',
        '若在 Cloudflare：把该记录设为灰云；不要为了「免费 CDN」随手点成橙云',
        '用下面命令或在线工具确认解析结果不是 Cloudflare 常见段（如 104.21.* / 172.67.*）',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '解析核对可用站内 ',
        { text: 'DNS 查询', href: '/tools/dns' },
        '；站点能不能打开可用 ',
        { text: '网站状态检测', href: '/tools/status' },
        '。',
      ],
    },

    { type: 'h2' as const, text: '四、怎么确认已经走亚太边缘' },
    {
      type: 'p' as const,
      parts: [
        '在本机终端对首页发一次请求（把域名换成你的）：',
      ],
    },
    {
      type: 'code' as const,
      lang: 'bash',
      text: `curl -sI https://你的域名/ | egrep -i 'server|x-vercel|age|cache'`,
    },
    {
      type: 'p' as const,
      parts: ['比较理想的情况会类似：'],
    },
    {
      type: 'ul' as const,
      items: [
        'server: Vercel',
        'x-vercel-cache: HIT（或至少不是每次都像未命中后的远距离回源）',
        'x-vercel-id 里带有 sin1 等亚太标识（具体 POP 会随网络变化）',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '若解析仍落在 Cloudflare 代理 IP，或 x-vercel-id 长期落在遥远区域，先回头改 DNS 与区域，再谈别的优化。',
      ],
    },

    { type: 'h2' as const, text: '五、还慢时再查这几项' },
    {
      type: 'ul' as const,
      items: [
        '首屏是否塞了过大的图、未压缩字体；',
        '是否每次都打冷启动的 Serverless 接口（预渲染静态页更稳）；',
        '是否误把整站放在需要鉴权/关闭缓存的路径上；',
        '对比手机流量与宽带、不同省市——跨境线路质量本身会波动。',
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '若读者几乎全在国内、且必须备案接入国内主机，那是另一条路径：DNS 要指到已备案的国内服务器，不能同时指望 Vercel 亚太边缘。见站内 ',
        { text: '网站运行机制与上线部署', href: '/guides/website-deploy-guide' },
        '。',
      ],
    },

    { type: 'h2' as const, text: '六、相关入口' },
    {
      type: 'ul' as const,
      items: [
        [{ text: 'Vercel', href: 'https://vercel.com' }],
        ['站内：', { text: '免费静态托管怎么选', href: '/guides/free-static-hosting-guide' }],
        ['站内：', { text: '2026 免费建站一条龙', href: '/guides/free-site-pipeline-guide' }],
        ['站内：', { text: 'DNS 查询', href: '/tools/dns' }],
        ['站内：', { text: '网站状态检测', href: '/tools/status' }],
        ['站内：', { text: 'SSL 证书查看', href: '/tools/ssl' }],
      ],
    },
    {
      type: 'p' as const,
      parts: [
        '区域名称、Hobby 限制与 DNS 面板文案可能调整。改解析、开代理前请以 Vercel / Cloudflare 控制台当时显示为准。本页仅供实践对照，不构成网络或架构承诺。',
      ],
    },
  ],
}
