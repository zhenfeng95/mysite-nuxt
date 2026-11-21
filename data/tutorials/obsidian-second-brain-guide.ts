export const obsidianSecondBrainGuide = {
    slug: 'obsidian-second-brain-guide',
    kind: 'ai' as const,
    title: '20分钟构建AI第二大脑知识库【Codex + Obsidian详细步骤】',
    description:
        '用 Obsidian 当知识库，用 Web Clipper 把网页剪成笔记，再用 Codex 读写这套库：安装、建库、剪藏、在 Obsidian 内直接调用 Codex，以及第一次写入并回链。',
    updatedAt: '2026-11-21',
    blocks: [
        {
            type: 'p' as const,
            parts: [
                '目标是二十分钟内搭好一个能被 Codex 读写的 Obsidian 知识库：笔记在本地、按约定放进目录，之后提问、整理和补写都对着同一套库，而不是散落在聊天记录里。',
            ],
        },
        {
            type: 'note' as const,
            text: '第二节是安装桌面版，第四节是 Web Clipper。建库和后面的 Codex 步骤还在按本机实际界面往下写。安装包、扩展商店和菜单会变，以官网当时页面为准。',
        },

        { type: 'h2' as const, text: '一、二十分钟要得到什么' },
        {
            type: 'ul' as const,
            items: [
                '一个本地 Obsidian 库，目录能让人和 Codex 都按同一套规则找到笔记。',
                '看到的网页能用 Web Clipper 剪成这个库里的一篇笔记。',
                'Codex 能读这个库，并能按约定新建或改写笔记。',
                '至少跑通一次：提出一个问题，笔记被写进库里，并能链回已有条目。',
            ],
        },

        { type: 'h2' as const, text: '二、下载并安装 Obsidian' },
        {
            type: 'p' as const,
            parts: [
                '这篇用的是电脑上的本地文件夹，后面才能让 Codex 打开它。到 ',
                { text: 'Obsidian 中文下载页', href: 'https://obsidian.md/zh/download' },
                ' 下载桌面版，装好后打开软件即可。手机版先不用。',
            ],
        },
        {
            type: 'ul' as const,
            items: [
                'Windows、Mac：下载页上选「通用版」。',
                'Linux：在同一页选择一种安装包，装上能打开就行。',
                '只从官网下载。安装和打开本地库不需要注册账号，同步和发布可以以后再看。',
                '打开后停在欢迎界面。新建库、选文件夹放在下一节。Web Clipper 是浏览器扩展，等库建好再装。',
            ],
        },

        { type: 'h2' as const, text: '三、建 Obsidian 库' },
        {
            type: 'p' as const,
            parts: ['建库前先定这套库只服务一件事：个人知识、项目资料，或两者分开。'],
        },
        {
            type: 'p' as const,
            parts: [
                '打开软件后是这个界面，左下角语言选「简体中文」。要在指定文件夹里新建一个库，点「新建仓库」右侧的「创建」，界面上写着：在指定文件夹下创建一个新的仓库。「打开」是把一个已经存在的本地文件夹当成仓库打开。「登录」会去连接 Obsidian 同步服务里的远程仓库。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-create-vault-v115.jpg',
            alt: 'Obsidian 欢迎界面：在「新建仓库」一栏点击「创建」',
        },
        {
            type: 'p' as const,
            parts: ['点「创建」后进入「创建本地仓库」。'],
        },
        {
            type: 'p' as const,
            parts: [
                '「仓库名称」填 knowledge-test。「仓库位置」点「浏览」，选好后界面会写出新仓库将存放于哪里。图里是 /Users/mac/Documents，你换成自己的文件夹。名称和位置都出来之后，点底部的「创建」。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '位置如果落在「文稿」或「桌面」，Obsidian 会提示：这些文件夹可能通过 iCloud 同步，并可能与 Obsidian 同步服务冲突。不想让库跟着 iCloud 走，就换一个不在这两处的文件夹。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-create-local-vault-path.jpg',
            alt: '创建本地仓库：名称 knowledge-test，新仓库将存放于 /Users/mac/Documents',
        },
        {
            type: 'p' as const,
            parts: [
                '点底部的「创建」后就进入仓库。中间这篇「欢迎」是 Obsidian 自动建的：这是你的新仓库。写点笔记、创建链接，或者试一试导入器。准备好之后，把这篇欢迎笔记删掉，仓库就留给你自己的内容。左下角能看到仓库名 knowledge-test。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-vault-welcome.jpg',
            alt: '新建仓库打开后的欢迎笔记，左下角仓库名为 knowledge-test',
        },

        { type: 'h2' as const, text: '四、用 Web Clipper 把网页剪进库' },
        {
            type: 'p' as const,
            parts: [
                'Obsidian Web Clipper 是官方免费浏览器扩展。打开一篇网页，它可以把正文或你划出的段落收成当前库里的一篇笔记。笔记写在本地库中。官方说明见 ',
                { text: 'Obsidian Web Clipper 简介', href: 'https://obsidian.md/zh/help/web-clipper' },
                '。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '它解决的是「材料从哪进库」。剪进来的是原材料，先放进一个固定文件夹；整理、补写和回链留给后面的 Codex。扩展要选定库和文件夹，所以放在建库之后。',
            ],
        },
        { type: 'h3' as const, text: '1. 安装扩展' },
        {
            type: 'p' as const,
            parts: [
                '到 ',
                { text: 'Obsidian Web Clipper 中文页', href: 'https://obsidian.md/zh/clipper' },
                '，按你的浏览器进入商店安装。Chrome、Brave、Arc 等 Chromium 浏览器走 Chrome 网上应用店，Edge、Firefox、Safari 各有官方入口。装好后，工具栏上会出现 Obsidian 图标。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-add-chrome.jpg',
            alt: 'Obsidian Web Clipper 中文页：点击「添加到 Chrome」',
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-chrome-store.jpg',
            alt: 'Chrome 网上应用店：点击「添加至 Chrome」安装 Obsidian Web Clipper',
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-add-extension.png',
            alt: 'Chrome 确认框：点击 Add extension 完成安装',
            fit: 'intrinsic',
        },
        {
            type: 'p' as const,
            parts: [
                '点 Add extension 之后，Chrome 会提示 Obsidian Web Clipper has been added to Chrome。工具栏右上角多出来的紫色图标就是这个扩展，后面剪网页就点它。弹层里的「从 Chrome 中移除」不要点。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-toolbar-icon.png',
            alt: '安装完成后，浏览器工具栏出现 Obsidian Web Clipper 图标',
            fit: 'intrinsic',
        },
        { type: 'h3' as const, text: '2. 剪一页进来' },
        {
            type: 'ol' as const,
            items: ['打开一篇你想留下的文章。', '点工具栏上的 Obsidian 图标，或用快捷键打开扩展。'],
        },
        {
            type: 'p' as const,
            parts: ['常用快捷键如下。除 Safari 外，可以在扩展设置的 General 里改键位。'],
        },
        {
            type: 'table' as const,
            headers: ['动作', 'macOS', 'Windows / Linux'],
            rows: [
                ['打开剪藏', 'Cmd+Shift+O', 'Ctrl+Shift+O'],
                ['开关高亮', 'Opt+Shift+H', 'Alt+Shift+H'],
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '往下剪之前，先做一次基本设置。打开扩展，点右上角的齿轮，鼠标停上去会显示「设置」。保管库没在这里加好，下面就选不中你刚建的库，笔记也就写不进去。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-settings-gear.png',
            alt: '打开 Web Clipper 后，点右上角齿轮进入设置',
            fit: 'intrinsic',
        },
        {
            type: 'p' as const,
            parts: [
                '进到「常规设置」，往下找到「保管库」。在「按回车键添加保管库」里填你刚建的仓库名，这篇前面建的是 knowledge-test，写完按回车。名称必须和 Obsidian 里的仓库名完全一致。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '下面的列表里出现这个名字，就表示添加成功。图里的 knowledge-test 是刚加上的一行。上面的 knowledge-base 是另一个早已加过的库，你没有就不会出现。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-add-vault.jpg',
            alt: '在保管库一栏输入仓库名并回车，列表里出现 knowledge-test 表示添加成功',
        },
        {
            type: 'p' as const,
            parts: [
                '库加上之后，把默认模板指到这个库。左侧模板列表里点「Default」。页面下方「保管库」选 knowledge-test，说明写着：选择此模板的默认保管库。下拉里没有你的库，就回到上一屏的常规设置里先添加。上面的「笔记位置」默认是 Clippings，通常不用动。它会在你的库里自动建一个 Clippings 目录，用来放剪下来的笔记。也可以改成其他目录名。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-default-template-vault.jpg',
            alt: '打开 Default 模板，把保管库选成 knowledge-test',
        },
        {
            type: 'p' as const,
            parts: [
                '同一页再往下是「内容」。属性默认这几行：title 是标题，source 是来源网址，author 是作者，published 是发布日期，created 是创建日期，description 是描述，tags 是标签。笔记内容是 {{content}}，也就是剪下来的正文。这块通常不用调整，保持默认即可。要按自己的习惯改，就添加或删掉其中某一行。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-default-template-content.jpg',
            alt: 'Default 模板的内容区保持默认属性，笔记内容为 {{content}}',
        },
        {
            type: 'ol' as const,
            start: 3,
            items: ['看一眼即将保存的正文。默认抽取文章主体。页面上已经选中一段文字时，保存的是选区；要整页就先全选。'],
        },
        {
            type: 'p' as const,
            parts: [
                '只想留下几段时，先打开高亮，在页面上划出要保存的句子。高亮默认不会拿掉全文。扩展设置的「高亮」里有三种写法：高亮页面内容仍保存整篇，只把划过的字标成 ==高亮==；替换页面内容才只留下划过的句子；不做任何操作则高亮不写入笔记。预览停在开头时，看起来就像划了也没生效。扩展里还有阅读视图，用来先看去掉杂乱区块后的正文。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-highlight-save-mode.jpg',
            alt: '在设置的「高亮」里，把保存方式设为「替换页面内容」，才只保存高亮内容',
        },
        {
            type: 'p' as const,
            parts: [
                '也可以不走高亮，直接在内容区删减。打开剪藏面板后，红框里就是即将保存的正文，标题和下面的段落都能改、能删。上面的属性一般不用在这里动。这是另一种只留下需要内容的办法。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-edit-content.jpg',
            alt: '在剪藏面板的内容区直接删改即将保存的正文，不必先用高亮选择',
            fit: 'intrinsic',
        },
        {
            type: 'ol' as const,
            start: 4,
            items: [
                '在底部选中你刚建的库，文件夹先指定一个固定位置，专门收剪藏。',
                '点保存到 Obsidian（英文界面是 Add to Obsidian）。回到 Obsidian，确认库里多了一篇笔记。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-add-to-obsidian-zheninvest.jpg',
            alt: '在网页上打开 Web Clipper，底部点击「添加到 Obsidian」',
            fit: 'intrinsic',
        },
        { type: 'h3' as const, text: '3. 油管视频也走这一下' },
        {
            type: 'p' as const,
            parts: [
                'Web Clipper 也能剪 YouTube。打开视频页，同样点工具栏上的图标。预览里会带上视频描述；这支视频有字幕时，整段字幕会和描述一起写进同一篇笔记。选好库和文件夹，点「添加到 Obsidian」。',
            ],
        },
        {
            type: 'p' as const,
            parts: ['文章用上面的步骤，视频用这一下，进的都是同一个剪藏文件夹。没有字幕的视频，笔记里就只有标题、描述和链接。'],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-youtube.jpg',
            alt: '在 YouTube 视频页打开 Web Clipper，点「添加到 Obsidian」把描述和字幕收进笔记',
        },
        { type: 'h3' as const, text: '4. 查看剪辑成果' },
        {
            type: 'p' as const,
            parts: [
                '以本网站页面为例。打开的就是这篇，剪完回到 Obsidian，左侧 Clippings 目录里多出同名笔记。点开能看到标题、来源网址、作者和正文，和页面上的内容对得上。左下角仓库名是 knowledge-test。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-clippings-note.jpg',
            alt: 'Obsidian 中打开 knowledge-test，Clippings 目录里出现刚剪藏的笔记',
        },
        { type: 'h2' as const, text: '五、把 Codex 接到这个库' },
        {
            type: 'p' as const,
            parts: [
                '这一步需要 Codex 能打开库所在的文件夹。还没装的话，到 ',
                { text: 'ChatGPT 桌面应用下载页', href: 'https://chatgpt.com/download' },
                ' 下载并登录。打开 Codex 后，选择本地项目文件夹并选中 knowledge-test；后续读写都会以这个项目文件夹为范围。下面写如何确认它只在库内读写，以及第一次打开时要确认的范围。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '在 Codex 中把 knowledge-test 文件夹作为本地项目打开，再复制下面这段提示词发送出去。Codex 会直接在这个文件夹里建立知识库的基础结构。',
            ],
        },
        {
            type: 'code' as const,
            lang: '提示词',
            text: `请你根据 Andrej Karpathy 的 LLM Wiki 帮我搭建「knowledge-test」架构，以中文输出你的结果。
这是 LLM Wiki 的 GitHub 页面链接：
https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
当前的第二大脑文件夹就是 Obsidian 连接的那个文件夹，文件夹现在是空的，所以我们要从零开始搭建。
你搭建好的架构规模不需要很大，只保留最核心的架构层级，包含 Raw sources、The wiki 和 The schema，比如 AGENTS.md、index.md 和 log.md 文件。`,
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-codex-knowledge-test-result.png',
            alt: 'Codex 完成 knowledge-test 知识库架构后的对话结果：AGENTS.md、raw/、wiki/、index.md 与 log.md',
        },
        {
            type: 'p' as const,
            parts: [
                '完成后，knowledge-test 会有 raw/、wiki/ 和 AGENTS.md 三个核心部分；wiki/ 下再按来源、主题和问题分层，并保留 index.md 与 log.md 作为目录和变更记录。项目目录应如下图所示。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-codex-knowledge-test-architecture.png',
            alt: 'Codex 按提示词搭好 knowledge-test：AGENTS.md、raw/、wiki/ 及 index.md、log.md',
        },


        { type: 'h2' as const, text: '六、约定目录，让笔记能被 AI 读' },
        {
            type: 'p' as const,
            parts: [
                '剪藏先全部进同一个文件夹，Codex 才知道新材料在哪。下面写文件夹划分、单篇笔记该有的标题和链接习惯，以及不让 Codex 改动的区域。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '打开 Web Clipper 后，在底部左侧下拉框选择 knowledge-test；右侧是本次剪藏的保存目录，默认可填 Raw，也可以手动改成库内的其他文件夹。选好后点击「添加到 Obsidian」。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-select-folder.png',
            alt: 'Obsidian Web Clipper 中选择 knowledge-test 保管库，并将剪藏笔记保存到 Raw 文件夹',
            fit: 'intrinsic',
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-open-obsidian.png',
            alt: '浏览器提示是否打开 Obsidian：勾选始终允许后点击打开 Obsidian',
        },
        {
            type: 'p' as const,
            parts: [
                '首次点击「添加到 Obsidian」后，浏览器会询问是否打开 Obsidian。勾选「始终允许」并点击「打开 Obsidian」，网页内容就会写入选定的文件夹；以后剪藏时无需重复确认。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-web-clipper-saved-note.png',
            alt: 'Obsidian 中的 raw 文件夹已出现剪藏笔记，右侧关系图谱显示该笔记已加入知识库',
        },
        {
            type: 'p' as const,
            parts: [
                '以后看到值得保存、但暂时没时间细读的文章、视频或资料，都可以先剪藏到 raw/ 文件夹。这里是知识库的「收件箱」：只负责快速收集原始材料，不必急着分类、总结或改标题。等有空时，再让 Codex 读取这些内容，提炼要点、补充来源链接，并整理到 wiki/ 中对应的主题或问题页面。这样既不会错过有价值的信息，也能把收集和整理分开，避免阅读流程被打断。',
            ],
        },

        { type: 'h2' as const, text: '七、用 Oh My Claudian 在 Obsidian 里调用 Codex' },
        {
            type: 'p' as const,
            parts: [
                '用 Oh My Claudian 可以把 Codex 接进 Obsidian，在笔记旁直接提问和整理内容。它支持多个 AI 代理，本节只配置 Codex，依次完成安装、连接和笔记测试。项目说明见 ',
                { text: 'Oh My Claudian GitHub 页面', href: 'https://github.com/lee259/oh-my-claudian' },
                '。',
            ],
        },
        { type: 'h3' as const, text: '1. 安装并启用 Oh My Claudian' },
        {
            type: 'ol' as const,
            items: [
                '在桌面版 Obsidian 打开 knowledge-test 仓库，进入「设置 → 第三方插件」。如果仍在受限模式，点击「退出受限模式」，然后即可浏览和安装社区插件。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-exit-restricted-mode.png',
            alt: '打开 Obsidian 设置中的第三方插件页面，点击「退出受限模式」',
        },
        {
            type: 'ol' as const,
            start: 2,
            items: ['点击「社区插件市场」右侧的「浏览」，搜索 Oh My Claudian。注意完整名称，选择项目仓库为 lee259/oh-my-claudian 的插件。'],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-community-plugins-browse.png',
            alt: '在第三方插件设置中，点击「社区插件市场」右侧的「浏览」',
        },
        {
            type: 'ol' as const,
            start: 3,
            items: ['进入插件详情，点击「安装」，完成后点击「启用」。'],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-oh-my-claudian-install.png',
            alt: '搜索 Oh My Claudian，选择插件后点击「安装」',
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-oh-my-claudian-enable.png',
            alt: 'Oh My Claudian 安装完成后，点击「启用」',
        },
        { type: 'h3' as const, text: '2. 在 Oh My Claudian 启用 Codex' },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-oh-my-claudian-options.png',
            alt: 'Oh My Claudian 启用后，点击「选项」进入插件设置',
        },
        {
            type: 'p' as const,
            parts: [
                '安装后，设置中会出现 Oh My Claudian。它是独立维护的 Claudian 分支。插件本身不附带模型订阅；使用 Codex 时，仍沿用 Codex 支持的账号或 API 配置及其额度。',
            ],
        },
        {
            type: 'p' as const,
            parts: ['打开 Oh My Claudian 设置后，先进入「提供商」页，在列表中选择 Codex。'],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-oh-my-claudian-providers.png',
            alt: 'Oh My Claudian 的提供商列表，选择 Codex',
        },
        {
            type: 'p' as const,
            parts: [
                '进入 Codex 详情后，打开右上角的开关。下方「就绪状态」中的提供商、CLI 和模型目录都显示已就绪后，才能开始聊天；如果「已选择聊天模型」仍显示需要处理，就继续在下方选择一个模型。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-oh-my-claudian-codex-readiness.png',
            alt: 'Oh My Claudian 的 Codex 设置：启用提供商，并查看就绪状态',
        },
        {
            type: 'p' as const,
            parts: [
                '滚到「模型」区域，在可见模型列表中至少勾选一个模型。勾选后，它才会出现在后续聊天窗口的模型选择器中；可用模型名称会随 Codex 账号和版本变化，以当前列表为准。',
            ],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-oh-my-claudian-select-model.png',
            alt: 'Oh My Claudian 的模型列表：至少勾选一个可见模型',
        },
        { type: 'h3' as const, text: '3. 打开聊天并测试连接' },
        {
            type: 'p' as const,
            parts: [
                '打开 Obsidian 命令面板，运行「Oh My Claudian: Open chat view」，也可以点击插件的侧边栏图标。在聊天窗口选中刚启用的 Codex 模型，先发送下面这句话。',
            ],
        },
         {
            type: 'code' as const,
            lang: '提示词',
            text: '你好，帮我找一下构建第二大脑知识库的文章并打开',
        },
        {
            type: 'p' as const,
            parts: ['图中左侧箭头指向 Oh My Claudian 的侧边栏入口；右侧聊天窗口底部可以选择刚才启用的 Codex 模型。'],
        },
        {
            type: 'img' as const,
            src: '/images/tutorials/obsidian-oh-my-claudian-open-chat.png',
            alt: 'Obsidian 中打开 Oh My Claudian 聊天窗口，并在底部选择 Codex 模型',
        },

        {
            type: 'p' as const,
            parts: [
                '能收到回复，说明这次模型请求已经跑通。没有模型可选时，回到 Providers → Codex 刷新模型目录并启用模型；一直没有回复时，先看 Readiness 中的 CLI 路径、认证和模型检查结果。',
            ],
        },
        { type: 'h3' as const, text: '4. 引用笔记，再试一次小范围修改' },
        {
            type: 'p' as const,
            parts: ['在输入框键入 @，选择 raw/ 中的一篇测试笔记。确认输入框里出现这篇笔记的附件标签，再发送下面的提示词。'],
        },
        {
            type: 'code' as const,
            lang: '提示词',
            text: `请只根据我附加的笔记，用中文整理 3 条要点，并附上指向来源笔记的 Obsidian 双链。
先把结果显示在聊天中，不要修改文件。资料中没有的内容请明确标注，不要补写成事实。`,
        },
        {
            type: 'p' as const,
            parts: [
                '确认引用和内容正确后，可以在一篇测试笔记中选中一段文字，从命令面板调用 Oh My Claudian 的行内编辑命令，要求精简措辞，再查看逐词差异并应用。普通聊天里的文件修改可能已经按当前权限模式执行，不能把事后显示的 diff 当成必经的写入前确认；行内编辑则有单独的预览与应用流程。',
            ],
        },
        {
            type: 'p' as const,
            parts: [
                '先用一篇测试笔记跑通提问和修改，核对来源链接与修改结果，再把这套流程用于日常知识库整理。',
            ],
        },

        { type: 'h2' as const, text: '八、跑通第一次写入' },
        {
            type: 'p' as const,
            parts: ['写一条可以照做的指令：读现有笔记、补一篇新笔记、加上回链，然后在 Obsidian 里核对结果。'],
        },

        { type: 'h2' as const, text: '九、做完之后怎么继续用' },
        {
            type: 'p' as const,
            parts: [
                '新的网页继续用第四节的 Web Clipper 剪进同一个文件夹。下面写怎么让后续对话接着用这套库，以及库变大之后先改哪一条约定。',
            ],
        },

        { type: 'h2' as const, text: '十、边界' },
        {
            type: 'ul' as const,
            items: [
                '库在本地，提交或同步前先看清里面有没有密钥、客户资料和不想被模型读到的内容。',
                'Web Clipper 会把页面内容写进这个库。登录后才能看的页面、含个人隐私的后台，先决定要不要剪进来。',
                'Codex 会按你给的目录改文件。约定没写清之前，不要让它整库重写。',
                '本页是个人实践步骤，不构成对 Codex 或 Obsidian 的购买建议。',
            ],
        },
    ],
};
