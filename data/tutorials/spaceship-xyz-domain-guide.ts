export const spaceshipXyzDomainGuide = {
    slug: 'spaceship-xyz-domain-guide',
    kind: 'excerpt' as const,
    title: 'Spaceship 低价 .xyz：一年大约四五块钱的正规顶级域',
    description:
        '解释 .xyz「1.111B 纯数字档」为何能卖到约 $0.99/年（约四五元人民币），以及为何必须是 6–9 位纯数字；并介绍在 Spaceship 下单、支付宝付款与接到 Cloudflare 的步骤。',
    updatedAt: '2026-10-20',
    blocks: [
        {
            type: 'p' as const,
            parts: [
                '想在 ',
                { text: 'Spaceship', href: 'https://www.spaceship.com' },
                ' 上花大约四五块钱拿一枚正规顶级域？关键不在「随便搜个 .xyz」，而在你有没有选对那一类被专门定价的纯数字域名。',
            ],
        },
        {
            type: 'note' as const,
            text: '先说结论：大约 $0.99/年（约四五元人民币）这一档，针对的是 6–9 位纯数字 .xyz。带字母、带连字符，或位数不在这个区间的 .xyz，通常做不到这么便宜。下单前以结账页金额为准。',
        },
        { type: 'h2' as const, text: '一、为什么 .xyz 能这么便宜？必须纯数字' },
        {
            type: 'p' as const,
            parts: [
                '按 .xyz 注册局相关公开说明（常被称作 1.111B Class / 「11.11 亿档」），有一大类专门定价的廉价域名：全部由 6 位、7 位、8 位或 9 位纯数字组成，范围从 000000.xyz 到 999999999.xyz，组合数量大约 11.11 亿个。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '这类域名批发价约 $0.65/年，建议零售价约 $0.99/年——折合人民币大致就是四五块。设计意图不只是给网站当网址，也包括 IoT 设备标识、网络通信、个性化数字 ID、手机号类标识等「大量注册也扛得住成本」的场景。对比之下，普通 .com 年费公开口径常在约 $7.85 起（不含促销），批量或多年持有时压力更大。',
            ],
        },
        {
            type: 'ul' as const,
            items: [
                '能便宜到约 $0.99/年：6–9 位、全部是数字的 .xyz（例如 123456.xyz、20261020.xyz）。',
                '通常做不到这么便宜：含字母（如 blog.xyz、my-site.xyz）、含连字符、或不足 6 位 / 超过 9 位的纯数字，以及被溢价锁定的热门词。',
                '它仍是正规 gTLD 顶级域，不是某平台自营的免费二级后缀；可以按常规流程续费、转移注册商。',
            ],
        },
        {
            type: 'table' as const,
            headers: ['你搜的名字', '是否容易进「四五元」档', '说明'],
            rows: [
                ['123456.xyz（6 位纯数字）', '容易', '落在 1.111B 档常见规则内'],
                ['88888888.xyz（8 位纯数字）', '容易', '同上'],
                ['hello.xyz / myblog.xyz', '不容易', '含字母，走普通 .xyz 定价'],
                ['12345.xyz（5 位）', '不容易', '位数不在 6–9 位区间'],
                ['12-3456.xyz', '不容易', '含连字符，一般不算该档'],
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '所以在 Spaceship 里若想冲「一年大约四五块」：优先搜生日、手机尾号、QQ 号、项目编号等 6–9 位纯数字。购物车里若价格突然跳到十几美元，多半是名字不符合该档，或未吃到对应促销——不要假设「凡是 .xyz 都四五块」。',
            ],
        },
        {
            type: 'note' as const,
            text: '批发 / 建议零售价来自注册局对该数字档的公开表述；注册商实际售价、促销码与多年续费价会变。Spaceship 结账页上的数字才是你应付的钱。本页不构成购买建议。',
        },
        { type: 'h2' as const, text: '二、为什么选 Spaceship' },
        {
            type: 'ul' as const,
            items: [
                '对上述低价 .xyz 露出多，首年常见能摸到约 $0.95–$1 一带（用对促销时），和「约 $0.99 建议零售」同一量级。',
                '支持支付宝（Alipay），国内结账相对顺手。',
                'Alphabet（Google 母公司）官网是 abc.xyz，说明后缀本身并不「山寨」，只是大众品牌感不如 .com。',
            ],
        },
        { type: 'h2' as const, text: '三、先看清价格结构（很重要）' },
        {
            type: 'table' as const,
            headers: ['阶段', '常见体感', '你要盯什么'],
            rows: [
                ['符合 6–9 位纯数字', '约 $0.99/年，约 ¥4–7', '购物车是否真是这个价，而不是普通 .xyz'],
                ['首年额外促销', '偶可再低一点', '促销码、是否限购 1 个/账号'],
                ['次年续费（非数字档或普通价）', '常回到约 $10–14 / 年', '别默认「永远四五块」；数字档续费也以列表为准'],
                ['转入 Spaceship', '偶有转移促销', '转移通常含续一年，以订单为准'],
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '社区里常有「先注册一年，再在域名列表里一次性续到接近十年」的玩法。特价单有时只能先买 1 年；数字档若续费也能维持低价，多年总成本会很香，但务必自己看续费单价。拉满多年前先算总账。',
            ],
        },
        {
            type: 'note' as const,
            text: '和站内 Google Workspace 低价 .com 比：.com 品牌更稳；纯数字 .xyz 更「白菜」，适合实验站与标识用途。和 DNSHE 免费二级域比：.xyz 是你自己的顶级域资产，DNSHE 更适合临时 Demo。',
        },
        { type: 'h2' as const, text: '四、注册与下单大致流程' },
        {
            type: 'p' as const,
            parts: ['界面文案会改版，以下为常见步骤摘要。'],
        },
        { type: 'h3' as const, text: '1. 注册 Spaceship 账号' },
        {
            type: 'p' as const,
            parts: ['打开 ', { text: 'Spaceship 官网', href: 'https://www.spaceship.com' }, '。'],
        },
        {
            type: 'p' as const,
            parts: [
                '打开后若右上角弹出语言与货币提示，先点蓝色按钮 「Yes, change my preferences」，切换成中文（简体）并用人民币（CNY）显示价格。若没有自动弹出，可点页面右上角的地球图标手动改语言与货币。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/spaceship-switch-chinese.png',
            alt: 'Spaceship：弹出语言偏好时点击 Yes, change my preferences 切换简体中文',
        },
        {
            type: 'p' as const,
            parts: ['接着点右上角的小人图标，在弹出的登录框底部点 「还没有账户？注册」，进入注册流程。'],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/spaceship-register-entry.png',
            alt: 'Spaceship：点击右上角小人图标，在登录弹框中选择注册',
        },
        {
            type: 'p' as const,
            parts: [
                '在「创建账户」弹窗里按提示填写名字、姓氏、邮箱和用户名（用户名只能含字母 a–z 与数字 0–9），点 「下一步」继续设置密码，并完成邮箱验证。邮箱请用能收信的真实地址，否则后续验证与找回会卡住。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/spaceship-create-account.png',
            alt: 'Spaceship：创建账户弹窗，填写名字、姓氏、邮箱与用户名',
        },
        {
            type: 'p' as const,
            parts: ['登录后建议先在账户里打开两步验证，域名属于可转移资产，安全值得多点一下。'],
        },
        { type: 'h3' as const, text: '2. 搜索 6–9 位纯数字 .xyz' },
        {
            type: 'p' as const,
            parts: ['在搜索框输入 6–9 位纯数字（不要字母、不要连字符），后缀选 .xyz，然后点击搜索。'],
        },
        {
            type: 'p' as const,
            parts: ['可用生日、手机尾号、纪念日等好记组合；被占用就换一组数字再试。'],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/spaceship-search-numeric.png',
            alt: 'Spaceship：在搜索框输入纯数字并点击搜索',
        },
        {
            type: 'p' as const,
            parts: [
                '可用时，结果页常见标价约 US$0.67（示意，具体以当时搜索结果为准）。同一串数字往下看「建议」里的 .com、.org、.net 等，往往要贵上不少，价差一眼就能看出来。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/spaceship-search-result-xyz.png',
            alt: 'Spaceship：纯数字 .xyz 搜索结果约 US$0.67，下方建议后缀更贵',
        },
        {
            type: 'p' as const,
            parts: ['加入购物车后先看价格：若已是约 $1 上下，基本对上廉价档；若明显偏高，换名字或放弃「四五元」预期。'],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/spaceship-add-to-cart.png',
            alt: 'Spaceship：点击「加入购物车」',
        },
        {
            type: 'p' as const,
            parts: ['弹出的附加商品（邮箱、建站、托管等）不需要就跳过，只留域名；点 「继续」 即可，不必点「全部加入购物车」。'],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/spaceship-skip-addons.png',
            alt: 'Spaceship：完善订单弹窗，跳过附加推荐并点继续',
        },
        {
            type: 'p' as const,
            parts: [
                '在结账页打开订单详情，核对域名首年价、续费价、ICANN 费用与总计。示意里域名约 US$0.67，加上 ICANN 约 US$0.20，合计约 US$0.87——仍远低于常见 .com；具体以当时购物车为准。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/spaceship-cart-checkout.png',
            alt: 'Spaceship：购物车订单详情，核对价格后结账',
        },
        { type: 'h3' as const, text: '3. 填促销码并结账' },
        {
            type: 'p' as const,
            parts: [
                '付款前系统会要求填写域名联系人：点 「添加地址」，补全注册人信息；可勾选「为管理、技术、账单联系人使用相同地址」，填完后点 「应用」。.xyz 注册通常需要这些联系地址，缺了会卡住结账。信息可填真实个人信息——平台一般有 WHOIS 隐私保护，对外不会直接公开你的姓名与地址。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/spaceship-domain-contacts.png',
            alt: 'Spaceship：域名联系人，添加地址后应用',
        },
        {
            type: 'p' as const,
            parts: [
                '接着在「付款详情」点 「添加付款方式」。支持银行卡、PayPal、支付宝等；国内用户选 Alipay（支付宝），按提示扫码完成即可。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/spaceship-payment-method.png',
            alt: 'Spaceship：付款详情，添加付款方式',
        },
        { type: 'h2' as const, text: '五、买完建议接到 Cloudflare' },
        {
            type: 'p' as const,
            parts: ['解析、CDN、证书和后续全家桶，放在 Cloudflare 通常更省心。步骤与站内其他教程相同：'],
        },
        {
            type: 'ol' as const,
            items: [
                '在 Cloudflare 添加站点，选择免费计划，复制分配的两条 Nameserver。',
                '回到 Spaceship 域名管理，把 Nameserver 改成 Cloudflare 提供的地址并保存。',
                '回到 Cloudflare 点「我已更新名称服务器」，等待生效（快则数分钟，慢则数小时到 48 小时）。',
                '生效后再在 Cloudflare 配 A / CNAME、HTTPS，或接 Pages / Workers 等。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '更完整的「不买服务器」搭法见 ',
                { text: 'Cloudflare 全家桶教程', href: '/digital-infra/cloudflare-free-stack-guide' },
                '；若你更在意 .com 品牌与续费路径，见 ',
                { text: 'Google Workspace 低价 .com 教程', href: '/digital-infra/google-workspace-domain-guide' },
                '。',
            ],
        },
        { type: 'h2' as const, text: '六、适合谁 / 不适合谁' },
        {
            type: 'ul' as const,
            items: [
                '更适合：能接受纯数字域名的个人博客、实验站、NAS / DDNS、设备或项目编号入口；想先花几块钱拥有正规顶级域的人。',
                '不太适合：必须用英文品牌词 / 单词型域名；对外名片强依赖 .com；完全无法接受英文后台；只想「永远四五块」、却不愿核对接账与续费的人。',
                '大陆备案：在境外注册商持有 .xyz，并不自动解决国内网站备案；若站点主要服务大陆且需备案，另按当地要求处理。',
            ],
        },
        { type: 'h2' as const, text: '七、相关入口' },
        {
            type: 'ul' as const,
            items: [
                [{ text: 'Spaceship 官网', href: 'https://www.spaceship.com' }],
                ['站内：', { text: 'Cloudflare 全家桶', href: '/digital-infra/cloudflare-free-stack-guide' }],
                ['站内：', { text: 'Google Workspace 低价 .com', href: '/digital-infra/google-workspace-domain-guide' }],
                ['站内：', { text: 'DNSHE 免费域名', href: '/digital-infra/dnshe-free-domain-guide' }],
                ['站内：', { text: '建站攻略', href: '/digital-infra' }],
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '相关入口：',
                { text: 'Spaceship', href: 'https://www.spaceship.com' },
                ' · ',
                { text: '建站攻略', href: '/digital-infra' },
            ],
        },
        {
            type: 'p' as const,
            parts: ['促销与续费价可能随时调整。下单、改 NS、开自动续费前，请以 Spaceship 结账页与域名列表当时显示为准。'],
        },
    ],
};
