export const freeStaticHostingGuide = {
    slug: 'free-static-hosting-guide',
    kind: 'steps' as const,
    title: '免费网站部署平台怎么选：GitHub Pages、Vercel、Cloudflare Pages',
    description:
        '网站做好后往哪放？对比 GitHub Pages、Vercel、Cloudflare Pages 的速度、国内访问（含晚高峰与区域选择）、免费额度与适用场景，附部署步骤与踩坑经验。',
    updatedAt: '2026-10-23',
    blocks: [
        {
            type: 'p' as const,
            parts: [
                '网站做好了，卡在最后一步——往哪放？买服务器一个月几十块起步；虚拟主机配环境又容易卡版本、耗一天。网上常提到 GitHub Pages、Vercel、Cloudflare Pages，名字都很洋气，介绍却越看越懵。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '它们各自适合什么场景？免费额度靠不靠谱？下面按实际部署体验来写：个人博客、文档站、落地页、前端 Demo，分别怎么选，以及各自有什么坑。额度与产品名会变，请以各平台控制台当时显示为准。',
            ],
        },
        {
            type: 'note' as const,
            text: '先说结论：没有「国内一定选 Cloudflare」这回事——大陆没有节点时，晚高峰走美西线路会很慢；Vercel 若把区域选在新加坡、香港一带，反而常更稳。框架与 SSR / 预览体验优先 Vercel；开源文档、海外读者、只想省心可用 GitHub Pages；要 Cloudflare 全家桶一体化再上 Pages。三者迁移成本很低，先上线再换也不迟。',
        },
        { type: 'h2' as const, text: '一、这些平台到底在干什么' },
        {
            type: 'p' as const,
            parts: [
                '三家做的事本质上一样：免费托管静态网站。静态网站由 HTML、CSS、JavaScript 组成，不依赖服务器端跑 PHP、Python、长期驻留的 Node 进程。个人博客、作品集、文档站、产品落地页，大多可以做成静态站扔上去。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '它们通常都提供：免费二级域名、免费 HTTPS、对接 Git 仓库自动部署、全球 CDN。代码推到 GitHub（或同类仓库），平台自动构建上线；改一行再推，几分钟内更新，不必手动 FTP。',
            ],
        },
        {
            type: 'p' as const,
            parts: ['真正拉开差距的，主要是四件事：访问速度、国内打开质量、附加能力（SSR、边缘函数等）、免费额度与限制。'],
        },
        {
            type: 'p' as const,
            parts: [
                '若你走的是「买 VPS + Nginx + 证书」那条路，可对照站内 ',
                { text: '网站运行机制与上线部署', href: '/guides/website-deploy-guide' },
                '；若已经决定用 Cloudflare 全家桶少买服务器，可再看 ',
                { text: 'Cloudflare 全家桶', href: '/digital-infra/cloudflare-free-stack-guide' },
                '。',
            ],
        },

        { type: 'h2' as const, text: '二、GitHub Pages：最省心，国内访问是硬伤' },
        {
            type: 'p' as const,
            parts: ['GitHub Pages 是 GitHub 自带的静态托管。代码本来就在 GitHub 上时，它几乎是零配置的默认选项。'],
        },
        { type: 'h3' as const, text: '优点' },
        {
            type: 'ul' as const,
            items: [
                '完全免费，没有「升级 Pro」的持续打扰；只要仓库和 Pages 服务还在，站点就能继续挂着。',
                '稳定、省心。有项目放三年没怎么管，照样能开；不用盯配额、不用惦记续费。',
                '和开源协作一体：文档站、项目主页跟仓库绑在一起，读者也方便 fork。',
            ],
        },
        { type: 'h3' as const, text: '缺点' },
        {
            type: 'ul' as const,
            items: [
                '国内访问不稳定。CDN 在国内节点弱，有时秒开、有时转好几秒；面向国内用户时体验差一截。',
                '功能偏「纯静态」。没有内置表单后端、也不以 SSR 见长；复杂动态能力要另想办法。',
            ],
        },
        {
            type: 'p' as const,
            parts: ['适合：开源项目文档、面向海外或技术圈的博客；不在意国内速度、只想少操心时，GitHub Pages 往往最省事。'],
        },

        { type: 'h2' as const, text: '三、Vercel：开发体验强，框架项目友好' },
        {
            type: 'p' as const,
            parts: [
                'Vercel 近年很常见，和 Next.js 渊源深。用 React / Next.js，或 Nuxt 等需要边缘 / Serverless 渲染的项目时，很多人默认就选它。本站静态预渲染上线，也是挂在 Vercel 一类路径上。',
            ],
        },
        { type: 'h3' as const, text: '优点' },
        {
            type: 'ul' as const,
            items: [
                '开发体验好：push 自动部署，分支 / PR 常有预览地址，联调、给别人看效果很顺。',
                '对 Next.js、Nuxt 等框架支持成熟，SSR / 预渲染等能力上手成本低。',
                '个人项目免费额度通常够用（带宽、构建时长以官网为准），小站很少一上来就撞墙。',
                '区域可选。把部署区域配到新加坡、香港等靠近大陆的位置时，国内访问往往并不慢，晚高峰丢包也少很多——后面「国内访问」一节会展开。',
            ],
        },
        { type: 'h3' as const, text: '缺点' },
        {
            type: 'ul' as const,
            items: [
                '默认区域若落在欧美，国内访问会差一截；「慢」常常是配置问题，不是平台注定慢。',
                'Serverless 函数可能有冷启动：闲置后再访问，第一次会慢一点。个人 Demo 影响不大，在意首屏时要心里有数。',
                '大陆同样没有本土 CDN 节点，靠的是邻近区域 + 线路质量，而不是「国内加速」。',
            ],
        },
        {
            type: 'p' as const,
            parts: ['适合：React / Next.js / Vue / Nuxt 项目、需要 SSR 或预览工作流、以及愿意花几分钟把区域配好、面向国内读者的静态站。'],
        },

        { type: 'h2' as const, text: '四、Cloudflare Pages：生态一体，带宽宽松' },
        {
            type: 'p' as const,
            parts: [
                'Cloudflare Pages 背靠 Cloudflare 的全球 CDN 与同一套后台。网上常说「国内访问最快」，实际体验要打折扣：大陆没有节点时，晚高峰完全可能打到美西，并不保证比 Vercel 快。',
            ],
        },
        { type: 'h3' as const, text: '优点' },
        {
            type: 'ul' as const,
            items: [
                '静态站请求与带宽策略对个人项目很友好（常见说法是静态流量不按传统主机那样掐死；具体以官方配额页为准）。流量突然上来时，比「每月固定 GB、超额就停」更安心。',
                '和 Cloudflare DNS、Workers、R2、Email Routing 等在同一账号里，域名本来就在 Cloudflare 时，绑 Pages 很顺手。',
                '海外访问与全球分发能力强；对「全家桶」运维路径来说，少在多个控制台之间跳。',
            ],
        },
        { type: 'h3' as const, text: '缺点' },
        {
            type: 'ul' as const,
            items: [
                '中国大陆没有 Cloudflare CDN 节点。国内用户访问时，流量常会落到较远节点（例如美国洛杉矶），跨太平洋一来一回，延迟和丢包都会上去——晚高峰尤其明显，有时半天加载不出来。',
                '免费构建次数有上限（常见约每月 500 次）。个人博客一般够用；若 CI 极频繁，要留意次数。',
                '控制台功能多，新手第一次会觉得选项密；熟悉之后反而顺。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '适合：已经或准备把域名 NS 交给 Cloudflare、看重无限带宽叙事与 Workers / R2 等配套、读者以海外为主或能接受国内时段波动的人。更完整的「少买服务器」路径见 ',
                { text: 'Cloudflare 全家桶', href: '/digital-infra/cloudflare-free-stack-guide' },
                '。',
            ],
        },

        { type: 'h2' as const, text: '五、国内访问：别迷信牌子，看节点和线路' },
        {
            type: 'p' as const,
            parts: ['三家里没有一家在中国大陆有「正经本土 CDN 节点」。所谓国内快慢，本质是：请求落到哪、晚高峰那条跨境线路堵不堵。'],
        },
        {
            type: 'p' as const,
            parts: [
                '实践里，Cloudflare Pages 上的静态站并不保证快。晚高峰时段，访问经常变慢甚至长时间转圈——常见原因是流量被调度到美国洛杉矶一带节点，等于多绕了半个地球，延迟上去、丢包也上去。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '反过来，Vercel 上的静态站也不注定慢。把区域选对——例如新加坡或香港——虽然大陆同样没有节点，但物理距离近，晚高峰丢包往往轻很多，打开速度可以明显好于「打到美西」的那条路径。配置不对（区域落在欧美）时，国内体验才会差。',
            ],
        },
        {
            type: 'note' as const,
            text: '选型建议：读者主要在国内、又在意晚高峰稳定性 → 优先试 Vercel，并把区域设到新加坡 / 香港一带，再自己测几晚；要 Cloudflare 生态一体、带宽宽松 → 上 Pages，但别按「国内一定最快」来预期。线路与调度会变，最终以你本机和目标用户网络实测为准。',
        },

        { type: 'h2' as const, text: '六、一张表怎么选' },
        {
            type: 'table' as const,
            headers: ['你的需求', '更倾向', '一句话理由'],
            rows: [
                ['国内读者为主，在意晚高峰速度', 'Vercel（区域选新加坡 / 香港）', '邻近区域，丢包通常轻于打到美西'],
                ['个人博客，海外用户为主', 'GitHub Pages 或 Cloudflare Pages', '稳定省心，或全球 CDN + 生态一体'],
                ['Next.js / Nuxt / 需要 SSR', 'Vercel', '框架友好，预览与部署流程成熟'],
                ['高流量，担心超额限流', 'Cloudflare Pages', '静态托管对流量更友好（以官方为准）'],
                ['开源文档，只想省心', 'GitHub Pages', '学习成本低，和 GitHub 工作流一体'],
                ['日常前端 Demo、PR 预览', 'Vercel', '分支预览方便协作'],
                ['域名已在 Cloudflare，要全家桶', 'Cloudflare Pages', 'DNS / Pages / Workers 同一后台'],
            ],
        },

        { type: 'h2' as const, text: '七、实际踩坑几则' },
        {
            type: 'ul' as const,
            items: [
                [
                    '以为迁到 Cloudflare Pages 就「国内秒开」：非高峰或许还行，晚高峰打到洛杉矶节点时，加载会突然变差。选型别只看白天一次测速。',
                ],
                ['Vercel 默认区域不合适时，国内确实慢；改成新加坡或香港后再测，丢包和首屏往往好一截。配置比换牌子更重要。'],
                ['日常小 Demo、需要预览链接给同事看的前端项目：放 Vercel 很省事——push、预览、合并上线，比 FTP 舒服很多。'],
                ['开源项目文档仍可放 GitHub Pages：读者多为开发者，对国内秒开不那么敏感，稳定性和「跟仓库在一起」反而更重要。'],
            ],
        },

        { type: 'h2' as const, text: '八、部署示例' },
        {
            type: 'p' as const,
            parts: [
                '流程大同小异：连 Git 仓库 → 选分支 → 配构建 → 部署。下面分别写 Vercel 与 Cloudflare Pages；GitHub Pages 在仓库 Settings → Pages 里选分支即可，步骤更短。',
            ],
        },
        { type: 'h3' as const, text: '1. Vercel' },
        {
            type: 'ol' as const,
            items: [
                '把代码推到 GitHub / GitLab / Bitbucket',
                ['打开 ', { text: 'Vercel', href: 'https://vercel.com' }, '，用同一账号登录后 Import 该仓库'],
                'Framework Preset：Next.js、Nuxt、Vite 等常见框架一般能自动识别；纯静态站可选手动填写构建命令与输出目录（如 npm run build → dist）',
                '面向国内读者时，在项目 Settings 里把 Functions / 部署区域选到新加坡（如 sin1）或香港一带（Hobby 通常只能选一个区域，以控制台当时选项为准）',
                '确认后 Deploy；成功后会得到 *.vercel.app 预览域名，再在 Domains 绑定自己的域名',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '绑定自定义域名时，DNS 按 Vercel 给出的 A / CNAME 配置即可。若域名 DNS 托管在 Cloudflare，自定义域名建议用「仅 DNS / 灰云」，不要开橙云代理——否则流量仍可能先进 Cloudflare 的远节点，把前面选好的邻近区域抵消掉。',
            ],
        },
        {
            type: 'p' as const,
            parts: ['之后每次 push 生产分支会自动部署；开 PR 时常会生成独立预览地址，方便给人看效果。'],
        },
        { type: 'h3' as const, text: '2. Cloudflare Pages' },
        {
            type: 'ol' as const,
            items: [
                '注册 Cloudflare 账号，进入 Workers & Pages（界面文案可能调整）',
                '创建 Pages 项目，关联 GitHub 或 GitLab 仓库',
                '选择部署分支（常见为 main）',
                '填写构建命令（如 Hugo 用 hugo，Hexo 用 hexo generate；纯静态 HTML 可留空）',
                '填写输出目录（常见 public 或 dist）',
                '保存并等待构建；默认域名多为 项目名.pages.dev，再在后台绑定自己的域名并开启 HTTPS',
            ],
        },
        {
            type: 'p' as const,
            parts: ['之后每次 push 对应分支，一般会自动重新构建。'],
        },

        { type: 'h2' as const, text: '九、写在最后' },
        {
            type: 'p' as const,
            parts: [
                '没有唯一正确答案，只有更贴合当前场景的选择：国内要晚高峰也稳 → 先试 Vercel 并选邻近区域；要 Cloudflare 生态与宽松流量 → Pages；开源文档与极致省心 → GitHub Pages。牌子不如节点和线路，测过再定比抄结论靠谱。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '更关键的一点：反正起步都是免费档，先选一个用起来。平台之间切换多半是改 DNS 和重新连一次仓库，一小时内往往能搬完。先上线，不满意再换，比纠结参数表更有用。',
            ],
        },
        { type: 'h2' as const, text: '十、相关入口' },
        {
            type: 'ul' as const,
            items: [
        [{ text: 'GitHub Pages 文档', href: 'https://docs.github.com/pages' }],
        [{ text: 'Vercel', href: 'https://vercel.com' }],
        [{ text: 'Cloudflare Pages', href: 'https://pages.cloudflare.com' }],
        ['站内：', { text: '2026 免费建站一条龙', href: '/guides/free-site-pipeline-guide' }],
        ['站内：', { text: 'Vercel 国内访问优化', href: '/guides/vercel-china-speed-guide' }],
        ['站内：', { text: '网站运行机制与上线部署', href: '/guides/website-deploy-guide' }],
        ['站内：', { text: 'Cloudflare 全家桶', href: '/digital-infra/cloudflare-free-stack-guide' }],
        ['站内：', { text: '建站攻略 · 网站部署', href: '/digital-infra' }],
      ],
    },
        {
            type: 'p' as const,
            parts: [
                '产品名称、免费额度与控制台文案可能随时调整。绑定域名、开通构建前，请以各平台官方文档与配额页为准。本页仅供信息对照，不构成选型或购买承诺。',
            ],
        },
    ],
};
