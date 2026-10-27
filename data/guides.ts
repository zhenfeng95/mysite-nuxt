import { cloudflareFreeStackGuide } from '~/data/tutorials/cloudflare-free-stack-guide'
import { dnsheFreeDomainGuide } from '~/data/tutorials/dnshe-free-domain-guide'
import { freeSitePipelineGuide } from '~/data/tutorials/free-site-pipeline-guide'
import { freeStaticHostingGuide } from '~/data/tutorials/free-static-hosting-guide'
import { googleWorkspaceDomainGuide } from '~/data/tutorials/google-workspace-domain-guide'
import { oqumailFreeDomainEmailGuide } from '~/data/tutorials/oqumail-free-domain-email-guide'
import { rentuibangGuide } from '~/data/tutorials/rentuibang-guide'
import { spaceshipXyzDomainGuide } from '~/data/tutorials/spaceship-xyz-domain-guide'
import { sslExpiryCheckGuide } from '~/data/tutorials/ssl-expiry-check-guide'
import { vercelChinaSpeedGuide } from '~/data/tutorials/vercel-china-speed-guide'


export type TextPart = string | { text: string; href: string }

export type Block =
  | { type: 'p'; parts: TextPart[] }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'ul'; items: Array<string | TextPart[]> }
  | { type: 'ol'; items: Array<string | TextPart[]> }
  | { type: 'quote'; parts: TextPart[] }
  | { type: 'code'; lang?: string; text: string }
  | { type: 'img'; src: string; alt: string; fit?: 'intrinsic' }
  | { type: 'imgs'; items: Array<{ src: string; alt: string }> }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'note'; text: string }

export type GuideKind = 'steps' | 'excerpt' | 'side'

export interface Guide {
  slug: string
  title: string
  description: string
  updatedAt: string
  kind: GuideKind
  blocks: Block[]
}

const websiteDeployGuide: Guide = {
  slug: 'website-deploy-guide',
  kind: 'steps',
  title: '网站运行机制与上线部署',
  description:
    '说明域名、DNS 和服务器各自做什么，以及静态页、动态页、前后端分离的请求过程。后半部分是购买服务器、解析域名、安装环境并配置 Nginx 的上线步骤。',
  updatedAt: '2026-09-24',
  blocks: [
    { type: 'h2', text: '一、网站运行机制' },
    { type: 'h3', text: '1、名词解释' },
    { type: 'h4', text: '域名' },
    {
      type: 'ul',
      items: ['www.baidu.com', 'www.taobao.com', 'www.qq.com'],
    },
    {
      type: 'quote',
      parts: [
        '域名俗称网址，是由一串用点分隔的名字组成，用于标识互联网上的计算机。原本用于标识互联网上计算机的是 IP 地址，但是由于 IP 地址不便于记忆，所以人们设计出比较容易记忆的域名，然后通过 DNS 将域名和 IP 地址关联，这样就可以通过记忆域名直接访问到对应的计算机。',
      ],
    },
    { type: 'h4', text: 'DNS 服务器' },
    {
      type: 'quote',
      parts: [
        'DNS（Domain Name System）可以理解为互联网上的一项服务，它可以将域名转换成对应的 IP 地址。可以把它理解为字典，字典中存储的就是域名和 IP 地址一一对应的键值对。',
      ],
    },
    {
      type: 'p',
      parts: ['本机 hosts 文件也能做这种对应：'],
    },
    {
      type: 'ul',
      items: [
        'Windows：C:\\windows\\system32\\drivers\\etc\\hosts',
        'Mac：/etc/hosts',
      ],
    },
    { type: 'h4', text: '服务器' },
    {
      type: 'quote',
      parts: [
        '服务器其实就是一台计算机，但这台计算机和我们自己的 PC 不一样，不是日常使用的，而是用来提供某项互联网服务的。比如 Web 服务器提供网页服务，Email 服务器提供电子邮件服务，FTP 服务器提供文件存储服务。为计算机安装不同的服务应用程序，即可提供相应的服务。',
      ],
    },
    {
      type: 'p',
      parts: ['常见的 Web 服务应用程序：Apache、Nginx、IIS、Node.js。'],
    },
    { type: 'h3', text: '2、网站请求流程（简化版）' },
    { type: 'h4', text: '静态页面' },
    {
      type: 'p',
      parts: [
        '网页只请求和响应简单的 HTML、CSS、JavaScript 文件，没有和服务端进行任何数据通信。这样的页面叫做静态页面。',
      ],
    },
    { type: 'h4', text: '动态页面' },
    {
      type: 'p',
      parts: ['页面内有和服务器进行的数据通信，这样的页面叫做动态页面。'],
    },
    { type: 'h4', text: '前后端分离的页面' },
    {
      type: 'quote',
      parts: ['前后端分离的项目中，页面中的数据渲染是在浏览器中完成的。'],
    },
    {
      type: 'p',
      parts: ['前后端分离的页面请求分为两部分：静态页面请求 + Ajax 数据请求。'],
    },
    {
      type: 'img',
      src: 'https://static.zzf.net.cn/uploads/1748243726987.png',
      alt: '前后端分离：浏览器先请求静态页面，再发起 Ajax 数据请求',
    },
    {
      type: 'img',
      src: 'https://static.zzf.net.cn/uploads/1748243333844.png',
      alt: '前后端分离的页面请求分为静态资源请求和数据请求',
    },
    { type: 'h4', text: '前后端不分离的页面' },
    {
      type: 'quote',
      parts: ['前后端不分离的项目中，页面中的数据渲染操作是在服务器端完成的。'],
    },
    {
      type: 'p',
      parts: ['前后端不分离的页面一次请求就能完成。'],
    },
    {
      type: 'img',
      src: 'https://static.zzf.net.cn/uploads/1748241289183.png',
      alt: '前后端不分离：服务器渲染完成后一次返回完整页面',
    },
    { type: 'h2', text: '二、网站上线部署流程' },
    { type: 'h3', text: '1、服务器购买' },
    {
      type: 'p',
      parts: ['国内服务器：阿里云 ECS（Elastic Compute Service）、腾讯云 CVM（Cloud Virtual Machine）等。'],
    },
    {
      type: 'p',
      parts: [
        '国外服务器：日本 ',
        { text: 'Vultr', href: 'https://www.vultr.com/' },
        '、美国 Linode、谷歌云、微软 Azure、亚马逊 AWS 等。',
      ],
    },
    {
      type: 'p',
      parts: ['这一步需要创建好服务器实例，分配好外网 IP 地址。'],
    },
    { type: 'h3', text: '2、域名购买' },
    {
      type: 'ul',
      items: ['国内：万网（阿里）、腾讯等', '国外：GoDaddy'],
    },
    { type: 'h3', text: '3、域名解析（配置 DNS）' },
    {
      type: 'p',
      parts: [
        '注册好域名之后，需要将域名映射到自己服务器对应的 IP 地址，这样别人才能通过域名访问到我们的服务器。这个步骤叫做域名解析，通过域名服务商提供的后台就可以操作。一般域名解析都会有延迟，不是即时生效的。',
      ],
    },
    { type: 'h3', text: '4、服务器环境搭建' },
    {
      type: 'p',
      parts: [
        '配置服务器时，Mac 系统下直接用终端即可。Windows 下需要用到 Git Bash，或者其他工具（PuTTY）。',
      ],
    },
    {
      type: 'code',
      lang: 'shell',
      text: `# 远程连接
ssh root@域名

# 展示当前文件夹路径
pwd

# 切换文件夹目录
cd 目录路径

# 展示当前文件夹中的内容
ls

# 编辑文件
vim 文件路径

# 传输文件
scp 本地文件路径 root@域名:远程路径

# 解压文件
unzip`,
    },
    { type: 'h4', text: '4.1 安装 CentOS 开发人员相关包' },
    {
      type: 'code',
      lang: 'shell',
      text: `yum groupinstall 'Development tools'`,
    },
    { type: 'h4', text: '4.2 配置免密登录' },
    {
      type: 'p',
      parts: [
        '在自己电脑上生成本地密钥对。参考：',
        { text: 'git 生成密钥', href: 'https://zhenvia.com/article/5' },
        '。',
      ],
    },
    {
      type: 'code',
      lang: 'shell',
      text: `# 生成的位置
# mac 在 ~/.ssh
# windows 在 C:\\users\\你的用户名\\.ssh

# 在服务器创建 .ssh 文件夹
mkdir .ssh

# 切换到这个文件夹
cd .ssh

# 创建 authorized_keys
touch authorized_keys

# 把本机 id_rsa.pub 的内容放进去
echo "公钥内容" >> authorized_keys

# 退出服务器，下次即可免密登录
exit`,
    },
    { type: 'h4', text: '4.3 安装 Nginx' },
    {
      type: 'code',
      lang: 'shell',
      text: `# 添加 Nginx 源
sudo yum install epel-release

# 安装 Nginx
sudo yum install nginx

# 启动 Nginx
nginx

# 配置防火墙规则
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload`,
    },
    { type: 'h4', text: '4.4 安装 Node.js' },
    {
      type: 'code',
      lang: 'shell',
      text: `# yum 自带源中没有 Node.js，所以首先要获取 Node.js 资源
curl --silent --location https://rpm.nodesource.com/setup_14.x | bash -

# 安装 Node.js
yum install -y nodejs

# 安装完成之后测试是否成功
node -v

# 安装 pm2，用来管理 Node.js 程序
npm i pm2 -g

# 使用 pm2 启动 Node.js 项目
pm2 start 文件名

# 停止
pm2 stop 文件名或者id

# 从 pm2 的管理列表中删除
pm2 delete 文件名或者id`,
    },
    { type: 'h4', text: '4.5 安装 MySQL' },
    {
      type: 'code',
      lang: 'shell',
      text: `# 下载并安装 MySQL 源
wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
sudo yum localinstall mysql80-community-release-el7-3.noarch.rpm

# 安装 MySQL
sudo yum install mysql-community-server -y

# 如果上一步报认证密钥的错，把 /etc/yum.repos.d/mysql-community.repo 中的 gpgcheck 改为 0
# gpgcheck=0

# 如果上一步报错，先执行下面的语句，再重新执行安装
sudo yum module disable mysql

# 启动 MySQL
sudo systemctl start mysqld

# MySQL 安装完毕之后会自动设置一个默认密码
grep 'temporary password' /var/log/mysqld.log

# 连接到 MySQL 并修改密码
mysql -uroot -p
ALTER USER 'root'@'localhost' IDENTIFIED BY '要修改的密码';`,
    },
    {
      type: 'p',
      parts: [
        '远程连接到 MySQL 时，如果报错 1130 - Host ... is not allowed to connect to this MySQL server，先在服务器上连接到数据库，再执行下面的语句。',
      ],
    },
    {
      type: 'code',
      lang: 'mysql',
      text: `SHOW DATABASES;
USE mysql;
SHOW TABLES;
SELECT Host, User FROM user;
UPDATE user SET Host = '%' WHERE User = 'root';
FLUSH PRIVILEGES;`,
    },
    {
      type: 'p',
      parts: [
        '执行完后刷新权限，使更改立即生效，然后重新使用可视化工具测试连接。参考：',
        {
          text: 'MySQL 远程连接 1130',
          href: 'https://blog.csdn.net/qq_42943927/article/details/147632834',
        },
        '。',
      ],
    },
    { type: 'h3', text: '5、上传网站资源' },
    {
      type: 'p',
      parts: ['可以使用 scp 命令，也可以安装 FTP（vsftpd）工具。'],
    },
    {
      type: 'code',
      lang: 'shell',
      text: `scp 本地文件 root@域名:远程路径

# 在服务器创建文件夹
mkdir /home/nginx/

# 把网页文件移动到创建好的文件夹里
mv ./dist.zip /home/nginx/

# 解压压缩文件
cd /home/nginx
unzip ./dist.zip

# 修改文件夹名字
mv dist admin
# 结果就是 /home/nginx/admin 这个文件夹中放的是网页文件`,
    },
    { type: 'h3', text: '6、配置 Nginx' },
    {
      type: 'p',
      parts: ['创建一个 ilovefe.conf 文件。'],
    },
    {
      type: 'code',
      lang: 'shell',
      text: `cd /etc/nginx/conf.d

# 创建配置文件
touch ilovefe.conf
vim ilovefe.conf

# 按 i 进入插入模式，粘贴配置
# 按 esc 退出编辑模式，输入 :wq 保存退出`,
    },
    {
      type: 'p',
      parts: ['ilovefe.conf：'],
    },
    {
      type: 'code',
      lang: 'nginx',
      text: `server {
    listen       80;
    server_name  zhenvia.com;
    location / {
        root   /usr/local/src/dist;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}`,
    },
    { type: 'h3', text: '7、接口项目部署步骤' },
    {
      type: 'ol',
      items: [
        '修改配置文件中的 MySQL 数据库密码',
        '上传项目压缩文件到服务器',
        '在服务器上解压项目文件到 /home/nginx/ilovefeadmin',
        '为项目安装依赖项：npm i',
      ],
    },
    {
      type: 'p',
      parts: ['5. 修改 MySQL 数据库密码规则：'],
    },
    {
      type: 'code',
      lang: 'mysql',
      text: `USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码' PASSWORD EXPIRE NEVER;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';

-- 查看是否已经修改成功
SELECT user, host, plugin FROM user WHERE user = 'root';`,
    },
    {
      type: 'p',
      parts: ['6. 创建新的数据库：'],
    },
    {
      type: 'code',
      lang: 'mysql',
      text: `CREATE DATABASE mysite;`,
    },
    {
      type: 'p',
      parts: ['7. 在 Nginx 配置文件中添加反向代理：'],
    },
    {
      type: 'code',
      lang: 'nginx',
      text: `location ^~ /api/ {
    rewrite ^/api/(.*)$ /api/$1 break;
    proxy_pass http://127.0.0.1:3001;
}`,
    },
    {
      type: 'p',
      parts: ['8. 配置后台管理系统的目录：'],
    },
    {
      type: 'code',
      lang: 'nginx',
      text: `location /admin {
    alias /usr/local/src/admin;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}`,
    },
    {
      type: 'p',
      parts: ['9. 配置静态文件目录：'],
    },
    {
      type: 'code',
      lang: 'nginx',
      text: `location /static/ {
    alias /usr/local/src/server/public/static/;
}`,
    },
  ],
}

const githubWebhookGuide: Guide = {
  slug: 'github-webhook-deploy-guide',
  kind: 'steps',
  title: '如何从 GitHub 上自动拉取代码到服务器',
  description:
    '用 Webhook 和 Shell 脚本，在 GitHub 或 Gitee 有新提交时，把仓库里的指定文件同步到服务器，而不是每次手动上传整个项目。',
  updatedAt: '2026-09-24',
  blocks: [
    {
      type: 'p',
      parts: [
        '通过配置 Webhook 和 Shell 脚本，可以在 Git 有最新提交时，只把指定文件同步到服务器。',
      ],
    },
    {
      type: 'p',
      parts: [
        '当远程 Git 仓库有新提交时，只更新特定文件（例如 dist/ 目录，或 public/index.html），不必每次手工把整个项目传上去。',
      ],
    },
    { type: 'h2', text: '一、准备条件' },
    {
      type: 'ul',
      items: [
        '已有 Git 仓库（GitHub、Gitee 等）',
        '宝塔服务器已安装 Git、Node.js，PM2 可选',
        '项目已用 git clone 初始化为 Git 仓库',
      ],
    },
    { type: 'h2', text: '二、创建自动拉取脚本（只同步指定文件）' },
    {
      type: 'p',
      parts: [
        '假设项目路径为 /www/wwwroot/zhenvia.com，只想把仓库中的 dist/ 更新到这个目录。',
      ],
    },
    { type: 'h3', text: '1、拉完整仓库到缓存目录' },
    {
      type: 'code',
      lang: 'bash',
      text: `mkdir -p /www/git-temp
cd /www/git-temp
git clone https://github.com/zhenfeng95/mysite.git`,
    },
    { type: 'h3', text: '2、创建部署脚本 /www/deploy/deploy.sh' },
    {
      type: 'code',
      lang: 'bash',
      text: `#!/bin/bash

# 1. 进入临时目录
cd /www/git-temp/mysite || exit

# 2. 拉取最新代码
echo "Pulling latest code from GitHub..."
git reset --hard HEAD
git clean -df
git pull origin main

# 3. 拷贝指定文件（只同步 dist 目录）
cp -r dist/* /www/wwwroot/zhenvia.com/dist/

echo "Deploy finished at $(date)"`,
    },
    {
      type: 'p',
      parts: ['保存后赋权：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `chmod +x /www/deploy/deploy.sh`,
    },
    {
      type: 'p',
      parts: [
        '如果只想更新特定文件（例如 config/ 目录或 index.html），可以在 deploy.sh 里改用下面的命令：',
      ],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `git checkout origin/main -- config/
git checkout origin/main -- index.html`,
    },
    { type: 'h2', text: '三、创建 Webhook 接收服务（Node 示例）' },
    {
      type: 'p',
      parts: ['安装依赖：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `mkdir -p /www/webhook && cd /www/webhook
npm init -y
npm install express body-parser`,
    },
    {
      type: 'p',
      parts: ['创建 index.js：'],
    },
    {
      type: 'code',
      lang: 'js',
      text: `const express = require('express')
const bodyParser = require('body-parser')
const { exec } = require('child_process')

const app = express()
app.use(bodyParser.json())

app.post('/webhook', (req, res) => {
  console.log('Git 推送事件已接收')
  exec('sh /www/deploy/deploy.sh', (err, stdout, stderr) => {
    if (err) {
      console.error('执行失败', stderr)
      return res.status(500).send('error')
    }
    console.log('部署成功', stdout)
    res.send('部署成功')
  })
})

app.listen(4000, '0.0.0.0', () => {
  console.log('Webhook 服务已运行，端口 4000')
})`,
    },
    {
      type: 'note',
      text: '在阿里云后台安全组的入方向放开 4000 端口，否则 GitHub 或 Gitee 访问不到这个地址。',
    },
    {
      type: 'p',
      parts: ['启动服务（建议用 PM2 保活）：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `npm install -g pm2
pm2 start index.js --name webhook`,
    },
    { type: 'h2', text: '四、在 GitHub / Gitee 中配置 Webhook' },
    {
      type: 'p',
      parts: ['前往仓库设置：'],
    },
    {
      type: 'ol',
      items: [
        '找到具体项目，进入 Settings > Webhooks > Add webhook',
        'Payload URL：http://你的服务器公网 IP:4000/webhook（需要公网能访问）',
        'Content type：application/json',
        'Secret：可选，用于校验请求是否来自仓库',
        '事件类型：只选 push',
        '保存',
      ],
    },
  ],
}

const acmeCertGuide: Guide = {
  slug: 'acme-sh-certificate-guide',
  kind: 'steps',
  title: '使用 acme.sh 一键申请并自动续期证书的完整步骤',
  description:
    '在服务器上安装 acme.sh，用阿里云 DNS API 为 zhenvia.com 和泛域名申请 Let\'s Encrypt 证书，并在续期后自动同步到 Nginx 或宝塔的证书目录。',
  updatedAt: '2026-09-24',
  blocks: [
    { type: 'h2', text: '安装 acme.sh' },
    {
      type: 'code',
      lang: 'bash',
      text: `curl https://get.acme.sh | sh -s email=my@example.com
# 或者更安全：
# curl -O https://get.acme.sh
# sh get.acme.sh`,
    },
    {
      type: 'p',
      parts: ['安装成功后重新登录终端，或者执行：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `source ~/.bashrc`,
    },
    {
      type: 'p',
      parts: ['确认是否安装成功：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `acme.sh --version`,
    },
    { type: 'h2', text: '使用 DNS API 的方式' },
    {
      type: 'p',
      parts: [
        '证书的 DNS 验证方式见 ',
        { text: 'acme.sh DNS API 说明', href: 'https://github.com/acmesh-official/acme.sh/wiki/dnsapi' },
        '。在这个页面中找到 Aliyun，再到阿里云 ',
        { text: 'RAM 用户控制台', href: 'https://ram.console.aliyun.com/users' },
        ' 创建子用户，拿到 Ali_Key 和 Ali_Secret，然后在服务器终端执行下面的命令。',
      ],
    },
    { type: 'h3', text: '步骤一：进入阿里云 RAM 控制台' },
    {
      type: 'p',
      parts: [
        '登录阿里云后台 ',
        { text: 'RAM 控制台', href: 'https://ram.console.aliyun.com/users' },
        '。左侧点击「用户管理」，再点「创建用户」。',
      ],
    },
    { type: 'h3', text: '步骤二：创建子用户' },
    {
      type: 'ul',
      items: [
        '选择普通用户（RAM 用户）',
        '填写用户名，例如 acme-cert-user',
        '勾选编程访问（AccessKey 方式）',
        '不要选控制台登录',
        '点击确认',
      ],
    },
    { type: 'h3', text: '步骤三：给用户授权' },
    {
      type: 'ul',
      items: [
        '创建完成后，进入刚建好的用户详情页',
        '找到权限管理，点击添加权限',
        '搜索 AliyunDNSFullAccess',
        '勾选该策略，点击确定',
      ],
    },
    {
      type: 'p',
      parts: ['这样，这个用户就有了对阿里云 DNS 服务的完全操作权限。'],
    },
    { type: 'h3', text: '步骤四：生成 AccessKey' },
    {
      type: 'ul',
      items: [
        '在用户详情页打开安全设置，进入 AccessKey 管理',
        '点击创建 AccessKey',
        '系统会生成 AccessKeyId 和 AccessKeySecret',
      ],
    },
    {
      type: 'note',
      text: 'Secret 只会显示一次，创建后马上保存。',
    },
    { type: 'h3', text: '步骤五：在服务器配置环境变量' },
    {
      type: 'p',
      parts: ['在阿里云服务器终端执行：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `export Ali_Key="<key>"
export Ali_Secret="<secret>"`,
    },
    {
      type: 'p',
      parts: ['为了长期生效，可以写入 ~/.bashrc：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `echo 'export Ali_Key="你的AccessKeyId"' >> ~/.bashrc
echo 'export Ali_Secret="你的AccessKeySecret"' >> ~/.bashrc
source ~/.bashrc`,
    },
    { type: 'h3', text: '切换 CA：使用 Let\'s Encrypt 替代 ZeroSSL' },
    {
      type: 'code',
      lang: 'bash',
      text: `acme.sh --set-default-ca --server letsencrypt`,
    },
    { type: 'h3', text: '步骤六：测试' },
    {
      type: 'p',
      parts: ['执行下面的命令申请证书：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `acme.sh --issue --dns dns_ali -d zhenvia.com -d *.zhenvia.com`,
    },
    {
      type: 'p',
      parts: ['如果执行命令报错，可能是还没注册账号，先执行：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `acme.sh --register-account -m your@email.com`,
    },
    {
      type: 'p',
      parts: [
        '如果配置正确，acme.sh 会自动在阿里云 DNS 里添加 _acme-challenge.zhenvia.com 这种 TXT 记录，并通过验证，最终生成证书。',
      ],
    },
    {
      type: 'p',
      parts: ['到这一步，acme.sh 配合阿里云 DNS 自动申请 SSL 证书就可以跑通。'],
    },
    { type: 'h2', text: '把证书安装到 Nginx' },
    {
      type: 'p',
      parts: [
        '如果生成的证书文件不在 Nginx 配置里的路径，需要执行下面的命令，续期后才会自动同步到对应目录。Nginx 配置的路径如果直接指向 acme.sh 的证书文件，就不用做这一步。',
      ],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `acme.sh --install-cert -d yourdomain.com \\
--key-file /etc/nginx/ssl/yourdomain.key \\
--fullchain-file /etc/nginx/ssl/yourdomain.cer \\
--reloadcmd "systemctl reload nginx"`,
    },
    { type: 'h2', text: '宝塔面板用户' },
    {
      type: 'p',
      parts: ['宝塔一般把证书放在：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `/www/server/panel/vhost/cert/yourdomain.com/`,
    },
    {
      type: 'p',
      parts: ['可以这样安装：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `acme.sh --install-cert -d yourdomain.com \\
--key-file /www/server/panel/vhost/cert/yourdomain.com/privkey.pem \\
--fullchain-file /www/server/panel/vhost/cert/yourdomain.com/fullchain.pem \\
--reloadcmd "bt reload"`,
    },
    {
      type: 'p',
      parts: ['zhenvia.com 对应的命令：'],
    },
    {
      type: 'code',
      lang: 'bash',
      text: `acme.sh --install-cert -d zhenvia.com \\
--key-file /www/server/panel/vhost/cert/zhenvia.com/privkey.pem \\
--fullchain-file /www/server/panel/vhost/cert/zhenvia.com/fullchain.pem \\
--reloadcmd "bt reload"`,
    },
    {
      type: 'p',
      parts: [
        '参考文档：',
        { text: 'acme.sh 中文说明', href: 'https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E' },
        '。',
      ],
    },
  ],
}

export const guides: Guide[] = [
  websiteDeployGuide,
  githubWebhookGuide,
  acmeCertGuide,
  freeStaticHostingGuide,
  vercelChinaSpeedGuide,
  freeSitePipelineGuide,
  sslExpiryCheckGuide,
  googleWorkspaceDomainGuide,
  spaceshipXyzDomainGuide,
  cloudflareFreeStackGuide,
  dnsheFreeDomainGuide,
  oqumailFreeDomainEmailGuide,
  rentuibangGuide,
]

export function findGuide(slug: string, kind?: GuideKind): Guide | undefined {
  const guide = guides.find(item => item.slug === slug)
  if (!guide) {
    return undefined
  }
  if (kind && guide.kind !== kind) {
    return undefined
  }
  return guide
}

export function guidePath(guide: Pick<Guide, 'slug' | 'kind'>) {
  if (guide.kind === 'excerpt') {
    return `/digital-infra/${guide.slug}`
  }
  if (guide.kind === 'side') {
    return `/side-hustle/${guide.slug}`
  }
  return `/guides/${guide.slug}`
}
