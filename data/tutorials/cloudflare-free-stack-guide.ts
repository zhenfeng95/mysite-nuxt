export const cloudflareFreeStackGuide = {
    slug: 'cloudflare-free-stack-guide',
    kind: 'excerpt' as const,
    title: 'Cloudflare 全家桶：个人小站可以不买服务器',
    description:
        '用 Cloudflare 免费套餐搭个人博客的最小闭环：DNS / CDN / SSL、Pages、Workers、D1、R2、Turnstile、Email Routing，附额度对照、算账思路、cf CLI 与可复制的 AI 提示词。',
    updatedAt: '2026-10-20',
    blocks: [
        {
            type: 'p' as const,
            parts: ['建网站第一步，很多人会卡在「买哪家服务器」。其实对个人小站来说，现在往往根本不用买服务器。'],
        },
        {
            type: 'p' as const,
            parts: [
                'DNS 解析、CDN、HTTPS、前后端、数据库、图床、验证码、域名邮箱——建站常用的这些能力，',
                { text: 'Cloudflare', href: 'https://www.cloudflare.com' },
                ' 免费套餐基本能一把梭，额度对小站也很实在。下面按「一个博客站」拆开讲：6 件套分别干什么、怎么串起来，并附上一段可直接复制的 AI 提示词。',
            ],
        },
        {
            type: 'note' as const,
            text: '先说结论：小站的瓶颈通常不在钱，而在额度管理——哪些请求走 Workers、哪些只走静态与 CDN，以及别把所有流量都打进计费路径。免费额度会调整，请以官方文档与控制台当时显示为准。',
        },
        { type: 'h2' as const, text: '一、全家桶清单：6 件套与免费额度' },
        {
            type: 'p' as const,
            parts: [
                '可以把它想成一套「免费基建」：域名接到 Cloudflare 之后，网站、接口、数据、图片、防刷和联系邮箱，都能在同一账号里配齐。',
            ],
        },
        { type: 'h3' as const, text: '1. DNS + CDN + SSL —— 地基' },
        {
            type: 'p' as const,
            parts: [
                '域名接入 Cloudflare 后，解析、全球 CDN、HTTPS 证书可以一次解决。免费版常见说法是带宽不计量、不收流量费，这是所有站点的第一步。把注册商处的 Nameserver 改成 Cloudflare 给出的两条 NS，核验通过后，后续能力才真正可用。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '域名在哪买都行，哪里便宜去哪买；买完把 NS 指到 Cloudflare，后面的套件大多可以做到「续费域名之外接近 0 元」。购域也可对照站内 ',
                { text: 'Spaceship 低价 .xyz', href: '/digital-infra/spaceship-xyz-domain-guide' },
                '、',
                { text: 'Google Workspace 低价 .com', href: '/digital-infra/google-workspace-domain-guide' },
                ' 或 ',
                { text: 'DNSHE 免费域名', href: '/digital-infra/dnshe-free-domain-guide' },
                '。',
            ],
        },
        { type: 'h3' as const, text: '2. Pages / Workers —— 前后端' },
        {
            type: 'ul' as const,
            items: [
                '纯前端、博客、文档站：用 Pages。常见免费额度约每月 500 次构建，静态请求不限量，可商用；代码 push 后即可部署上线。',
                '需要 API、后端逻辑：用 Workers。常见免费额度约每天 10 万次请求。',
            ],
        },
        {
            type: 'p' as const,
            parts: ['经验上：静态页面、图片、CSS/JS 尽量走 Pages / CDN，不要全部塞进 Workers，否则容易把免费请求额度「吃干」。'],
        },
        { type: 'h3' as const, text: '3. D1 —— 数据库' },
        {
            type: 'p' as const,
            parts: [
                '用户、文章、评论可以放进 D1（基于 SQLite）。公开介绍里常见的免费额度大约是：每天 500 万行读、10 万行写，总容量约 5 GB。对个人博客、作品集一类小站，通常足够。',
            ],
        },
        { type: 'h3' as const, text: '4. R2 —— 图床和文件' },
        {
            type: 'p' as const,
            parts: [
                '配图、附件、备份可以放进 R2。常见免费额度约 10 GB 存储；更关键的是出站流量（egress）通常不按传统图床那样单独收「流量费」。图床最怕的往往是流量账单，R2 在这一点上对小站很友好。公开访问一般需要绑定自定义域名，这一步要在控制台手工完成。',
            ],
        },
        { type: 'h3' as const, text: '5. Turnstile —— 防机器人' },
        {
            type: 'p' as const,
            parts: [
                '注册、登录、评论、表单可以直接接 Turnstile。常见定位是免费且不限量，替代传统「找图点字」验证码，用户体验更好。site key / secret 需要去控制台创建后填进前端与校验逻辑。',
            ],
        },
        { type: 'h3' as const, text: '6. Email Routing —— 域名邮箱' },
        {
            type: 'p' as const,
            parts: [
                '可以把 hello@yourdomain.com 一类地址转发到 Gmail、Outlook 等个人邮箱，适合页脚「联系我」。它是转发，不是完整企业邮箱套件；若需要独立收件箱与客户端，可另看站内 ',
                { text: 'OquMail 教程', href: '/digital-infra/oqumail-free-domain-email-guide' },
                ' 或 Google Workspace。配置时要在 DNS 里按提示加 MX 等记录。',
            ],
        },
        {
            type: 'table' as const,
            headers: ['件套', '典型用途', '免费额度（常见说法，以官网为准）'],
            rows: [
                ['DNS + CDN + SSL', '解析、加速、证书', '免费计划；带宽常见为不计量'],
                ['Pages', '前端 / 博客 / 文档站', '约 500 次构建 / 月；静态请求不限量'],
                ['Workers', 'API / 后端逻辑', '约 10 万请求 / 天'],
                ['D1', '文章、评论等结构化数据', '约 500 万行读、10 万行写 / 天；约 5 GB'],
                ['R2', '图床、附件、备份', '约 10 GB；出站流量策略以定价页为准'],
                ['Turnstile', '表单防刷', '常见为免费不限量'],
                ['Email Routing', '域名邮箱转发', '免费；需配 MX'],
            ],
        },
        { type: 'h2' as const, text: '二、实战：一个博客站的最小闭环' },
        {
            type: 'p' as const,
            parts: ['把「能看文章、能留评论、能放图、能联系你」当成最小闭环，可以这样对应到各产品：'],
        },
        {
            type: 'ul' as const,
            items: [
                '域名 DNS 进 Cloudflare → 解析 + CDN + SSL 全包',
                '前端页面 → Pages 部署，push 即上线',
                '文章列表、评论提交 → Workers 写几个 API',
                '文章、评论数据 → D1 两张表（例如 posts / comments）',
                '文章配图 → R2 存储桶，开启公开访问',
                '评论表单 → Turnstile 挡机器人',
                '页脚「联系我」→ Email Routing 转发到你的个人邮箱',
            ],
        },
        { type: 'h3' as const, text: '算笔账（量级感）' },
        {
            type: 'p' as const,
            parts: [
                '假设博客大约每天 1 万 PV：Workers 若只承担列表与评论等动态接口，常见可能落在每天约 1–2 万次请求，仍只是免费额度的一小截；D1 读写往往比免费上限低一到两个数量级；R2 存几千张配图，对小站通常也够用。',
            ],
        },
        {
            type: 'note' as const,
            text: '估算前提：静态资源（HTML/CSS/JS/图片）不走 Workers，而走 Pages / CDN / R2。小站一般不愁「钱」，更要盯「有没有把不该计费的路径打进 Workers」。',
        },
        { type: 'h2' as const, text: '三、提效：一条命令行管全家' },
        {
            type: 'p' as const,
            parts: ['Cloudflare 还在推进一套偏「agent-first」的 CLI，命令名是 cf，按产品域组织，例如：'],
        },
        {
            type: 'ul' as const,
            items: [
                'cf dns —— DNS 记录',
                'cf pages —— Pages 项目与部署',
                'cf workers —— Workers',
                'cf d1 —— D1 数据库',
                'cf r2 —— R2 存储桶',
                'cf kv —— KV',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '以前建站要在控制台六个产品页之间来回点；现在查 DNS、建 D1、建 R2、部署 Pages，可以尽量收拢到同一条终端工作流里。方向很清楚：Cloudflare 希望你用 CLI（甚至 Agent）搭站，而不是只靠网页点选。',
            ],
        },
        {
            type: 'note' as const,
            text: 'cf CLI 仍可能处于 Beta。关键操作（删库、改 NS、绑域名、开公开访问）建议先在网页控制台核对一遍，再交给脚本或 AI。具体安装与子命令以官方文档当时版本为准；你也仍可用更成熟的 Wrangler 管理 Workers / Pages / D1 等。',
        },
        { type: 'h2' as const, text: '四、直接复制：一段提示词让 AI 帮你搭' },
        {
            type: 'p' as const,
            parts: ['可以把下面整段贴给 Codex、Cursor 等 AI 编程工具，让它按免费套餐搭出博客骨架：'],
        },
        {
            type: 'code' as const,
            lang: 'text',
            text: `你是一名 Cloudflare 全栈工程师。用免费套餐帮我搭个人博客站：
1. 前端用 Pages：首页 + 文章列表 + 文章详情
2. D1 建两张表：posts / comments
3. Workers 提供 /api/posts、/api/comments 接口
4. 配图存 R2，开启公共访问
5. 评论表单接 Turnstile 验证
6. 联系邮箱用 Email Routing 转发

约束：严格控在免费额度内；用 cf CLI（或 Wrangler）管理资源；最后输出上线检查清单。`,
        },
        {
            type: 'p' as const,
            parts: [
                '实话实说：有几处手工步骤 AI 替不了——Turnstile 要去控制台拿 site key；Email Routing 要配 MX 记录；R2 公开访问通常要绑自定义域名。把这些留给自己点两下，其余骨架可以让 AI 一个下午搭出来。',
            ],
        },
        { type: 'h2' as const, text: '五、适合谁 / 不适合谁' },
        {
            type: 'ul' as const,
            items: [
                '更适合：个人博客、作品集、文档站、Demo；接受 Serverless 与额度思维；愿意把域名 NS 交给 Cloudflare。',
                '不太适合：强依赖传统 VPS / 宝塔面板的运维习惯；需要完整企业邮箱（收发、客户端、协作套件）；超大流量或复杂有状态后端，早已超出免费额度舒适区。',
                [
                    '和「网站部署」分组的关系：买服务器、装 Nginx、配证书那条路径仍在建站攻略的「网站部署」分组；本页讲的是另一条——尽量不买服务器的 Cloudflare 路径。若还在 GitHub Pages / Vercel / Cloudflare Pages 之间犹豫，可看 ',
                    { text: '免费静态托管怎么选', href: '/guides/free-static-hosting-guide' },
                    '。',
                ],
            ],
        },
        { type: 'h2' as const, text: '六、相关入口' },
        {
            type: 'ul' as const,
            items: [
                [{ text: 'Cloudflare 官网', href: 'https://www.cloudflare.com' }],
                [
                    { text: 'Workers / Pages / D1 / R2 / Turnstile / Email Routing', href: 'https://developers.cloudflare.com/' },
                    ' 产品文档（以官网导航为准）',
                ],
                ['站内：', { text: 'Google Workspace 低价 .com 教程', href: '/digital-infra/google-workspace-domain-guide' }],
                ['站内：', { text: 'DNSHE 免费域名', href: '/digital-infra/dnshe-free-domain-guide' }],
                ['站内：', { text: 'OquMail 域名邮箱', href: '/digital-infra/oqumail-free-domain-email-guide' }],
                ['站内：', { text: '建站攻略 · 网站部署', href: '/digital-infra' }],
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '产品名称、免费额度与控制台文案可能随时调整。下单、改 NS、开通公开访问前，请以官方文档与结账 / 配额页为准。本页仅供信息对照，不构成购买或架构承诺。',
            ],
        },
    ],
};
