const o={slug:"website-deploy-guide",kind:"steps",title:"网站运行机制与上线部署",description:"说明域名、DNS 和服务器各自做什么，以及静态页、动态页、前后端分离的请求过程。后半部分是购买服务器、解析域名、安装环境并配置 Nginx 的上线步骤。",updatedAt:"2026-09-24",blocks:[{type:"h2",text:"一、网站运行机制"},{type:"h3",text:"1、名词解释"},{type:"h4",text:"域名"},{type:"ul",items:["www.baidu.com","www.taobao.com","www.qq.com"]},{type:"quote",parts:["域名俗称网址，是由一串用点分隔的名字组成，用于标识互联网上的计算机。原本用于标识互联网上计算机的是 IP 地址，但是由于 IP 地址不便于记忆，所以人们设计出比较容易记忆的域名，然后通过 DNS 将域名和 IP 地址关联，这样就可以通过记忆域名直接访问到对应的计算机。"]},{type:"h4",text:"DNS 服务器"},{type:"quote",parts:["DNS（Domain Name System）可以理解为互联网上的一项服务，它可以将域名转换成对应的 IP 地址。可以把它理解为字典，字典中存储的就是域名和 IP 地址一一对应的键值对。"]},{type:"p",parts:["本机 hosts 文件也能做这种对应："]},{type:"ul",items:["Windows：C:\\windows\\system32\\drivers\\etc\\hosts","Mac：/etc/hosts"]},{type:"h4",text:"服务器"},{type:"quote",parts:["服务器其实就是一台计算机，但这台计算机和我们自己的 PC 不一样，不是日常使用的，而是用来提供某项互联网服务的。比如 Web 服务器提供网页服务，Email 服务器提供电子邮件服务，FTP 服务器提供文件存储服务。为计算机安装不同的服务应用程序，即可提供相应的服务。"]},{type:"p",parts:["常见的 Web 服务应用程序：Apache、Nginx、IIS、Node.js。"]},{type:"h3",text:"2、网站请求流程（简化版）"},{type:"h4",text:"静态页面"},{type:"p",parts:["网页只请求和响应简单的 HTML、CSS、JavaScript 文件，没有和服务端进行任何数据通信。这样的页面叫做静态页面。"]},{type:"h4",text:"动态页面"},{type:"p",parts:["页面内有和服务器进行的数据通信，这样的页面叫做动态页面。"]},{type:"h4",text:"前后端分离的页面"},{type:"quote",parts:["前后端分离的项目中，页面中的数据渲染是在浏览器中完成的。"]},{type:"p",parts:["前后端分离的页面请求分为两部分：静态页面请求 + Ajax 数据请求。"]},{type:"img",src:"https://static.zzf.net.cn/uploads/1748243726987.png",alt:"前后端分离：浏览器先请求静态页面，再发起 Ajax 数据请求"},{type:"img",src:"https://static.zzf.net.cn/uploads/1748243333844.png",alt:"前后端分离的页面请求分为静态资源请求和数据请求"},{type:"h4",text:"前后端不分离的页面"},{type:"quote",parts:["前后端不分离的项目中，页面中的数据渲染操作是在服务器端完成的。"]},{type:"p",parts:["前后端不分离的页面一次请求就能完成。"]},{type:"img",src:"https://static.zzf.net.cn/uploads/1748241289183.png",alt:"前后端不分离：服务器渲染完成后一次返回完整页面"},{type:"h2",text:"二、网站上线部署流程"},{type:"h3",text:"1、服务器购买"},{type:"p",parts:["国内服务器：阿里云 ECS（Elastic Compute Service）、腾讯云 CVM（Cloud Virtual Machine）等。"]},{type:"p",parts:["国外服务器：日本 ",{text:"Vultr",href:"https://www.vultr.com/"},"、美国 Linode、谷歌云、微软 Azure、亚马逊 AWS 等。"]},{type:"p",parts:["这一步需要创建好服务器实例，分配好外网 IP 地址。"]},{type:"h3",text:"2、域名购买"},{type:"ul",items:["国内：万网（阿里）、腾讯等","国外：GoDaddy"]},{type:"h3",text:"3、域名解析（配置 DNS）"},{type:"p",parts:["注册好域名之后，需要将域名映射到自己服务器对应的 IP 地址，这样别人才能通过域名访问到我们的服务器。这个步骤叫做域名解析，通过域名服务商提供的后台就可以操作。一般域名解析都会有延迟，不是即时生效的。"]},{type:"h3",text:"4、服务器环境搭建"},{type:"p",parts:["配置服务器时，Mac 系统下直接用终端即可。Windows 下需要用到 Git Bash，或者其他工具（PuTTY）。"]},{type:"code",lang:"shell",text:`# 远程连接
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
unzip`},{type:"h4",text:"4.1 安装 CentOS 开发人员相关包"},{type:"code",lang:"shell",text:"yum groupinstall 'Development tools'"},{type:"h4",text:"4.2 配置免密登录"},{type:"p",parts:["在自己电脑上生成本地密钥对。参考：",{text:"git 生成密钥",href:"https://www.zzf.net.cn/article/5"},"。"]},{type:"code",lang:"shell",text:`# 生成的位置
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
exit`},{type:"h4",text:"4.3 安装 Nginx"},{type:"code",lang:"shell",text:`# 添加 Nginx 源
sudo yum install epel-release

# 安装 Nginx
sudo yum install nginx

# 启动 Nginx
nginx

# 配置防火墙规则
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload`},{type:"h4",text:"4.4 安装 Node.js"},{type:"code",lang:"shell",text:`# yum 自带源中没有 Node.js，所以首先要获取 Node.js 资源
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
pm2 delete 文件名或者id`},{type:"h4",text:"4.5 安装 MySQL"},{type:"code",lang:"shell",text:`# 下载并安装 MySQL 源
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
ALTER USER 'root'@'localhost' IDENTIFIED BY '要修改的密码';`},{type:"p",parts:["远程连接到 MySQL 时，如果报错 1130 - Host ... is not allowed to connect to this MySQL server，先在服务器上连接到数据库，再执行下面的语句。"]},{type:"code",lang:"mysql",text:`SHOW DATABASES;
USE mysql;
SHOW TABLES;
SELECT Host, User FROM user;
UPDATE user SET Host = '%' WHERE User = 'root';
FLUSH PRIVILEGES;`},{type:"p",parts:["执行完后刷新权限，使更改立即生效，然后重新使用可视化工具测试连接。参考：",{text:"MySQL 远程连接 1130",href:"https://blog.csdn.net/qq_42943927/article/details/147632834"},"。"]},{type:"h3",text:"5、上传网站资源"},{type:"p",parts:["可以使用 scp 命令，也可以安装 FTP（vsftpd）工具。"]},{type:"code",lang:"shell",text:`scp 本地文件 root@域名:远程路径

# 在服务器创建文件夹
mkdir /home/nginx/

# 把网页文件移动到创建好的文件夹里
mv ./dist.zip /home/nginx/

# 解压压缩文件
cd /home/nginx
unzip ./dist.zip

# 修改文件夹名字
mv dist admin
# 结果就是 /home/nginx/admin 这个文件夹中放的是网页文件`},{type:"h3",text:"6、配置 Nginx"},{type:"p",parts:["创建一个 ilovefe.conf 文件。"]},{type:"code",lang:"shell",text:`cd /etc/nginx/conf.d

# 创建配置文件
touch ilovefe.conf
vim ilovefe.conf

# 按 i 进入插入模式，粘贴配置
# 按 esc 退出编辑模式，输入 :wq 保存退出`},{type:"p",parts:["ilovefe.conf："]},{type:"code",lang:"nginx",text:`server {
    listen       80;
    server_name  zzf.net.cn;
    location / {
        root   /usr/local/src/dist;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}`},{type:"h3",text:"7、接口项目部署步骤"},{type:"ol",items:["修改配置文件中的 MySQL 数据库密码","上传项目压缩文件到服务器","在服务器上解压项目文件到 /home/nginx/ilovefeadmin","为项目安装依赖项：npm i"]},{type:"p",parts:["5. 修改 MySQL 数据库密码规则："]},{type:"code",lang:"mysql",text:`USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码' PASSWORD EXPIRE NEVER;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';

-- 查看是否已经修改成功
SELECT user, host, plugin FROM user WHERE user = 'root';`},{type:"p",parts:["6. 创建新的数据库："]},{type:"code",lang:"mysql",text:"CREATE DATABASE mysite;"},{type:"p",parts:["7. 在 Nginx 配置文件中添加反向代理："]},{type:"code",lang:"nginx",text:`location ^~ /api/ {
    rewrite ^/api/(.*)$ /api/$1 break;
    proxy_pass http://127.0.0.1:3001;
}`},{type:"p",parts:["8. 配置后台管理系统的目录："]},{type:"code",lang:"nginx",text:`location /admin {
    alias /usr/local/src/admin;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}`},{type:"p",parts:["9. 配置静态文件目录："]},{type:"code",lang:"nginx",text:`location /static/ {
    alias /usr/local/src/server/public/static/;
}`}]},a={slug:"github-webhook-deploy-guide",kind:"steps",title:"如何从 GitHub 上自动拉取代码到服务器",description:"用 Webhook 和 Shell 脚本，在 GitHub 或 Gitee 有新提交时，把仓库里的指定文件同步到服务器，而不是每次手动上传整个项目。",updatedAt:"2026-09-24",blocks:[{type:"p",parts:["通过配置 Webhook 和 Shell 脚本，可以在 Git 有最新提交时，只把指定文件同步到服务器。"]},{type:"p",parts:["当远程 Git 仓库有新提交时，只更新特定文件（例如 dist/ 目录，或 public/index.html），不必每次手工把整个项目传上去。"]},{type:"h2",text:"一、准备条件"},{type:"ul",items:["已有 Git 仓库（GitHub、Gitee 等）","宝塔服务器已安装 Git、Node.js，PM2 可选","项目已用 git clone 初始化为 Git 仓库"]},{type:"h2",text:"二、创建自动拉取脚本（只同步指定文件）"},{type:"p",parts:["假设项目路径为 /www/wwwroot/zzf.net.cn，只想把仓库中的 dist/ 更新到这个目录。"]},{type:"h3",text:"1、拉完整仓库到缓存目录"},{type:"code",lang:"bash",text:`mkdir -p /www/git-temp
cd /www/git-temp
git clone https://github.com/zhenfeng95/mysite.git`},{type:"h3",text:"2、创建部署脚本 /www/deploy/deploy.sh"},{type:"code",lang:"bash",text:`#!/bin/bash

# 1. 进入临时目录
cd /www/git-temp/mysite || exit

# 2. 拉取最新代码
echo "Pulling latest code from GitHub..."
git reset --hard HEAD
git clean -df
git pull origin main

# 3. 拷贝指定文件（只同步 dist 目录）
cp -r dist/* /www/wwwroot/zzf.net.cn/dist/

echo "Deploy finished at $(date)"`},{type:"p",parts:["保存后赋权："]},{type:"code",lang:"bash",text:"chmod +x /www/deploy/deploy.sh"},{type:"p",parts:["如果只想更新特定文件（例如 config/ 目录或 index.html），可以在 deploy.sh 里改用下面的命令："]},{type:"code",lang:"bash",text:`git checkout origin/main -- config/
git checkout origin/main -- index.html`},{type:"h2",text:"三、创建 Webhook 接收服务（Node 示例）"},{type:"p",parts:["安装依赖："]},{type:"code",lang:"bash",text:`mkdir -p /www/webhook && cd /www/webhook
npm init -y
npm install express body-parser`},{type:"p",parts:["创建 index.js："]},{type:"code",lang:"js",text:`const express = require('express')
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
})`},{type:"note",text:"在阿里云后台安全组的入方向放开 4000 端口，否则 GitHub 或 Gitee 访问不到这个地址。"},{type:"p",parts:["启动服务（建议用 PM2 保活）："]},{type:"code",lang:"bash",text:`npm install -g pm2
pm2 start index.js --name webhook`},{type:"h2",text:"四、在 GitHub / Gitee 中配置 Webhook"},{type:"p",parts:["前往仓库设置："]},{type:"ol",items:["找到具体项目，进入 Settings > Webhooks > Add webhook","Payload URL：http://你的服务器公网 IP:4000/webhook（需要公网能访问）","Content type：application/json","Secret：可选，用于校验请求是否来自仓库","事件类型：只选 push","保存"]}]},i={slug:"acme-sh-certificate-guide",kind:"steps",title:"使用 acme.sh 一键申请并自动续期证书的完整步骤",description:"在服务器上安装 acme.sh，用阿里云 DNS API 为 zzf.net.cn 和泛域名申请 Let's Encrypt 证书，并在续期后自动同步到 Nginx 或宝塔的证书目录。",updatedAt:"2026-09-24",blocks:[{type:"h2",text:"安装 acme.sh"},{type:"code",lang:"bash",text:`curl https://get.acme.sh | sh -s email=my@example.com
# 或者更安全：
# curl -O https://get.acme.sh
# sh get.acme.sh`},{type:"p",parts:["安装成功后重新登录终端，或者执行："]},{type:"code",lang:"bash",text:"source ~/.bashrc"},{type:"p",parts:["确认是否安装成功："]},{type:"code",lang:"bash",text:"acme.sh --version"},{type:"h2",text:"使用 DNS API 的方式"},{type:"p",parts:["证书的 DNS 验证方式见 ",{text:"acme.sh DNS API 说明",href:"https://github.com/acmesh-official/acme.sh/wiki/dnsapi"},"。在这个页面中找到 Aliyun，再到阿里云 ",{text:"RAM 用户控制台",href:"https://ram.console.aliyun.com/users"}," 创建子用户，拿到 Ali_Key 和 Ali_Secret，然后在服务器终端执行下面的命令。"]},{type:"h3",text:"步骤一：进入阿里云 RAM 控制台"},{type:"p",parts:["登录阿里云后台 ",{text:"RAM 控制台",href:"https://ram.console.aliyun.com/users"},"。左侧点击「用户管理」，再点「创建用户」。"]},{type:"h3",text:"步骤二：创建子用户"},{type:"ul",items:["选择普通用户（RAM 用户）","填写用户名，例如 acme-cert-user","勾选编程访问（AccessKey 方式）","不要选控制台登录","点击确认"]},{type:"h3",text:"步骤三：给用户授权"},{type:"ul",items:["创建完成后，进入刚建好的用户详情页","找到权限管理，点击添加权限","搜索 AliyunDNSFullAccess","勾选该策略，点击确定"]},{type:"p",parts:["这样，这个用户就有了对阿里云 DNS 服务的完全操作权限。"]},{type:"h3",text:"步骤四：生成 AccessKey"},{type:"ul",items:["在用户详情页打开安全设置，进入 AccessKey 管理","点击创建 AccessKey","系统会生成 AccessKeyId 和 AccessKeySecret"]},{type:"note",text:"Secret 只会显示一次，创建后马上保存。"},{type:"h3",text:"步骤五：在服务器配置环境变量"},{type:"p",parts:["在阿里云服务器终端执行："]},{type:"code",lang:"bash",text:`export Ali_Key="<key>"
export Ali_Secret="<secret>"`},{type:"p",parts:["为了长期生效，可以写入 ~/.bashrc："]},{type:"code",lang:"bash",text:`echo 'export Ali_Key="你的AccessKeyId"' >> ~/.bashrc
echo 'export Ali_Secret="你的AccessKeySecret"' >> ~/.bashrc
source ~/.bashrc`},{type:"h3",text:"切换 CA：使用 Let's Encrypt 替代 ZeroSSL"},{type:"code",lang:"bash",text:"acme.sh --set-default-ca --server letsencrypt"},{type:"h3",text:"步骤六：测试"},{type:"p",parts:["执行下面的命令申请证书："]},{type:"code",lang:"bash",text:"acme.sh --issue --dns dns_ali -d zzf.net.cn -d *.zzf.net.cn"},{type:"p",parts:["如果执行命令报错，可能是还没注册账号，先执行："]},{type:"code",lang:"bash",text:"acme.sh --register-account -m your@email.com"},{type:"p",parts:["如果配置正确，acme.sh 会自动在阿里云 DNS 里添加 _acme-challenge.zzf.net.cn 这种 TXT 记录，并通过验证，最终生成证书。"]},{type:"p",parts:["到这一步，acme.sh 配合阿里云 DNS 自动申请 SSL 证书就可以跑通。"]},{type:"h2",text:"把证书安装到 Nginx"},{type:"p",parts:["如果生成的证书文件不在 Nginx 配置里的路径，需要执行下面的命令，续期后才会自动同步到对应目录。Nginx 配置的路径如果直接指向 acme.sh 的证书文件，就不用做这一步。"]},{type:"code",lang:"bash",text:`acme.sh --install-cert -d yourdomain.com \\
--key-file /etc/nginx/ssl/yourdomain.key \\
--fullchain-file /etc/nginx/ssl/yourdomain.cer \\
--reloadcmd "systemctl reload nginx"`},{type:"h2",text:"宝塔面板用户"},{type:"p",parts:["宝塔一般把证书放在："]},{type:"code",lang:"bash",text:"/www/server/panel/vhost/cert/yourdomain.com/"},{type:"p",parts:["可以这样安装："]},{type:"code",lang:"bash",text:`acme.sh --install-cert -d yourdomain.com \\
--key-file /www/server/panel/vhost/cert/yourdomain.com/privkey.pem \\
--fullchain-file /www/server/panel/vhost/cert/yourdomain.com/fullchain.pem \\
--reloadcmd "bt reload"`},{type:"p",parts:["zzf.net.cn 对应的命令："]},{type:"code",lang:"bash",text:`acme.sh --install-cert -d zzf.net.cn \\
--key-file /www/server/panel/vhost/cert/zzf.net.cn/privkey.pem \\
--fullchain-file /www/server/panel/vhost/cert/zzf.net.cn/fullchain.pem \\
--reloadcmd "bt reload"`},{type:"p",parts:["参考文档：",{text:"acme.sh 中文说明",href:"https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E"},"。"]}]},l=[o,a,i,{slug:"dnshe-free-domain-guide",kind:"excerpt",title:"DNSHE 免费域名：它解决什么，以及怎么用",description:"整理 DNSHE 免费二级域名的定位、常见后缀、注册与解析边界，以及 2026 年起按年免费续期的规则。完整图文步骤在 Zhen Invest。",updatedAt:"2026-09-09",fullUrl:"https://zheninvest.com/tutorials/dnshe-free-domain-guide",blocks:[{type:"p",parts:["DNSHE 面向开发者、学生、开源项目和早期作品，提供不需要信用卡的免费域名和托管 DNS。它解决的是「先有一个能解析的名字」，不是「买下一枚可以转到任意注册商的 .com」。开放后缀、配额和审核会变，以 ",{text:"DNSHE 官网",href:"https://www.dnshe.com"}," 和客户中心当时的页面为准。"]},{type:"h2",text:"你实际拿到的是什么"},{type:"ul",items:["平台运营后缀下的免费二级域名，例如 yourname.de5.net","控制台里的 DNS 记录管理","面向脚本和测试环境的 API","基础 DNS 防护；部分场景支持 DNSSEC"]},{type:"p",parts:["「永久免费」指不收年费，不等于注册后可以不管。自 2026 年 1 月 1 日起，新注册的免费域名默认有效期 1 年，到期前 180 天内可以免费续期，续期本身不收费。2026 年 1 月 1 日前已经注册的域名，平台公告称不改为按年注册。"]},{type:"h2",text:"常见后缀"},{type:"table",headers:["后缀","更贴近的用途"],rows:[[".de5.net","技术博客、作品集、演示站、开源项目"],[".us.ci","CI/CD、API 端点、测试环境"],[".cc.cd","个人品牌、设计作品、公开展示"],[".bot.cd","Bot、Webhook、自动化回调"]]},{type:"p",parts:["完整主机名是「前缀.后缀」，前缀大约 2–36 位，只用字母、数字和连字符。控制台里可能还有更多后缀，以当时列表为准。这类名字不能按 .com 的方式转到任意注册商。"]},{type:"h2",text:"适合谁"},{type:"ul",items:["个人博客、作品集、Demo、Webhook、测试环境，需要立刻有一个可解析的名字","暂时不想为 .com 付年费，也不想绑定信用卡","需要 API 或 DDNS，把解析接到部署流水线"]},{type:"note",text:"要做长期品牌、对外商务邮箱，或站点主要面向中国大陆并且需要备案时，免费二级域名通常帮不上忙。重要生产流量和资金相关回调，也不适合只押在免费服务上。"},{type:"h2",text:"注册与解析，先知道这几步"},{type:"ul",items:["在官网或客户中心注册。邮箱密码、GitHub 或 Google 登录都可以，联系邮箱要能收信，续期和审核通知会发到那里。","进入免费域名管理，看注册额度，选择根域名并填写前缀。显示可注册后再确认。不要用脚本批量抢注。","注册成功后可以在 DNSHE 自己的 DNS 面板里加记录，也可以把名称服务器改到 Cloudflare，之后解析以 Cloudflare 为准。","若已经把 NS 委派到 Cloudflare，续期仍在 DNSHE 完成；动态 IP 不要再指望 DNSHE 自带的 DDNS。"]},{type:"p",parts:["部分根域名不支持托管到 Cloudflare。如果下一步就是接 Cloudflare，注册前先看控制台提示。接到 Cloudflare 时选择「连接域名」和免费计划，把页面给出的两个 Nameserver 填回 DNSHE 的 DNS 服务器设置，再回到 Cloudflare 确认已更新。"]},{type:"h2",text:"常见记录"},{type:"table",headers:["类型","典型用途"],rows:[["A","把主机名指到 IPv4"],["AAAA","把主机名指到 IPv6"],["CNAME","把 www 指到另一个主机名"],["MX","收信"],["TXT","所有权验证、SPF、证书申请"]]},{type:"p",parts:["刚接上站点、源站证书还没配对时，可以先用 Cloudflare 的灰色云（仅 DNS）确认解析通了，再决定是否打开橙色云代理。"]}]},{slug:"oqumail-free-domain-email-guide",kind:"excerpt",title:"OquMail：在已有域名上建邮箱",description:"整理 OquMail 的免费额度、DNS 绑定方式和创建邮箱的顺序。域名不必转到 OquMail。完整图文步骤在 Zhen Invest。",updatedAt:"2026-09-17",fullUrl:"https://zheninvest.com/tutorials/oqumail-free-domain-email-guide",blocks:[{type:"p",parts:["OquMail 解决的是「已经有域名，想尽快拥有 you@yourdomain.com」。域名可以继续放在原来的注册商或 Cloudflare，按引导添加 MX、SPF、DKIM、DMARC。配额和客户端能力会变，以 ",{text:"OquMail 官网",href:"https://oqumail.com"}," 和控制台为准。"]},{type:"h2",text:"免费额度（以定价页为准）"},{type:"table",headers:["项目","常见说明"],rows:[["免费邮箱数","每个 workspace 大约 15 个"],["自定义域名","大约 3 个"],["单箱容量","大约 5 GB"],["每日外发","大约 250 封 / 邮箱，人工与 API 共用"],["超出部分","额外邮箱大约 1 美元 / 月"]]},{type:"h2",text:"适合谁"},{type:"ul",items:["已有域名，想用品牌后缀邮箱做对外联络","个人或小团队，邮箱数量在免费额度内","主要用网页端收发，或需要按邮箱维度的轻量发信 API"]},{type:"note",text:"需要文档、网盘、会议同一套件时，看 Google Workspace 或 Zoho。大规模营销群发应使用专门的邮件服务。关键生产和资金相关邮件，不要只押在免费额度上。"},{type:"h2",text:"绑定域名的顺序"},{type:"ul",items:["准备一个你能改 DNS 的域名，以及一个可收信的注册邮箱。DNS 生效可能要数分钟到数小时。","在官网注册并登录，进入 Domains，填入根域名（不要填邮箱地址），确认你能管理这块域名的 DNS。","域名若托管在 Cloudflare，可以用 Connect with Cloudflare 授权后由对方写入记录。域名在别处，就把弹窗里的 TXT、MX 等记录逐条加到现有 DNS 面板。","全部加完后做 Verify DNS。Ownership、MX、SPF、DKIM、DMARC 都显示 Found，再创建邮箱。","在 Users & Mailboxes 里添加用户，用邀请邮件设置密码，然后用新地址给自己发一封测试信。"]},{type:"p",parts:["不必把 Nameserver 改到 OquMail。域名上如果还留着旧邮箱的 MX，可能造成信件分路，切换前先确认旧服务可以下线。"]},{type:"h2",text:"第三方客户端"},{type:"p",parts:["官网文案仍可能写以 Webmail 为主、暂不支持桌面客户端。控制台里有 Connect to app (IMAP)，会列出收信服务器和端口。实测 Outlook 在 MX 已经指向 OquMail 时，往往只填邮箱和密码就能自动发现。其他客户端以你当时的实测为准。"]}]},{slug:"google-workspace-domain-guide",kind:"excerpt",title:"长期持有 .com：Workspace 与 Cloudflare Registrar",description:"比较 Google Workspace 购域和 Cloudflare Registrar 各自解决的问题。区域定价、账单与下单步骤不在本页展开，全文在 Zhen Invest。",updatedAt:"2026-09-08",fullUrl:"https://zheninvest.com/tutorials/google-workspace-domain-guide",blocks:[{type:"p",parts:["很多注册商用「首年特价、次年涨价」卖域名。要长期持有 .com，真正要看的是续费价，不是结账页上的首年数字。"]},{type:"h2",text:"两条都能拿到正规顶级域名"},{type:"table",headers:["路径","更适合的情况"],rows:[["Cloudflare Registrar","希望流程直接、续费按成本价风格公开，少处理账号和结算地区"],["Google Workspace 开通流程里的购域","开通时一并购买自定义域名；不需要协作套件时，可以取消 Workspace 订阅，只保留域名年费"]]},{type:"p",parts:["域名本身仍是正规顶级域名。Workspace 这条路径里，社区还讨论过用特定地区的结算货币拿到更低年费。那是社区实测，不是对所有人、所有时刻的保证，下单前要自己看结账页上的货币和金额。"]},{type:"note",text:"本页不写地区切换、账单地址和支付步骤。这些内容、界面变化和风险说明在 Zhen Invest 的全文里。结账页如果不是你预期的货币，就不要下单。"},{type:"h2",text:"和本站另外两篇怎么配合"},{type:"ul",items:["还没有可长期持有的域名、只想先有一个能解析的名字：先看 DNSHE 节选。","已经有域名、只想要 you@yourdomain.com：看 OquMail 节选。邮箱 DNS 可以加在 Cloudflare 上。","域名注册在 Workspace 流程里之后，后续 CDN 和解析仍然可以接到 Cloudflare，不必把网站主机放在 Google。"]}]}];function r(e,s){const t=l.find(p=>p.slug===e);if(t&&!(s&&t.kind!==s))return t}function n(e){return e.kind==="excerpt"?`/digital-infra/${e.slug}`:`/guides/${e.slug}`}export{n as a,r as f,l as g};
