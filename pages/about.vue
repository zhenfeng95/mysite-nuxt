<script setup lang="ts">
import { FULL_SITE_NAME, FULL_SITE_URL, SITE_CONTACT_EMAIL, SITE_NAME, SITE_SLOGAN } from '~/data/site'

usePageSeo({
  title: '关于我们',
  seoTitle: `关于${SITE_NAME}：站点定位与建站笔记内容边界`,
  description: `${SITE_NAME} 是个人技术笔记站点，整理网站部署与建站攻略：域名、邮箱、证书、Cloudflare 等实践路径。`,
  path: '/about',
})
</script>

<template>
  <article>
    <p class="text-sm text-moss">关于</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">关于我们</h1>
    <p class="mt-4 leading-8 text-stone-700">
      {{ SITE_NAME }}（zhenvia.com）是个人维护的技术笔记站。口号是「{{ SITE_SLOGAN }}」——把踩过的路径写清楚，方便后来人少绕弯。
    </p>

    <section class="mt-10 space-y-4">
      <h2 class="text-xl font-semibold text-ink">这个站点写什么</h2>
      <p class="leading-8 text-stone-700">
        内容集中在两块：
      </p>
      <ul class="list-disc space-y-2 pl-5 leading-7 text-stone-700">
        <li>
          <NuxtLink to="/guides" class="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss">网站部署</NuxtLink>
          ：站点怎么跑起来、怎么用 GitHub 自动更新、怎么申请免费证书等步骤说明。
        </li>
        <li>
          <NuxtLink to="/digital-infra" class="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss">建站攻略</NuxtLink>
          ：域名、邮箱、Cloudflare 全家桶等服务入口与图文教程。
        </li>
      </ul>
      <p class="leading-8 text-stone-700">
        港美股、开户与跨境投资相关内容不放在本域名，而在
        <a
          :href="FULL_SITE_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss"
        >{{ FULL_SITE_NAME }}</a>
        。
      </p>
    </section>

    <section class="mt-10 space-y-4">
      <h2 class="text-xl font-semibold text-ink">内容边界</h2>
      <ul class="list-disc space-y-2 pl-5 leading-7 text-stone-700">
        <li>页面以公开信息与个人实践整理为主，界面与额度会变，请以各服务官网与控制台当时显示为准。</li>
        <li>不构成注册、购买、建站或合规建议；重要操作请自行核对官方文档。</li>
        <li>不提供代办、代运维或一对一技术外包。</li>
      </ul>
    </section>

    <section class="mt-10 space-y-4">
      <h2 class="text-xl font-semibold text-ink">联系</h2>
      <p class="leading-8 text-stone-700">
        发现链接失效、步骤过时或想补充善意建议，欢迎到
        <NuxtLink to="/contact" class="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss">联系我们</NuxtLink>
        ，或发邮件至
        <a
          :href="`mailto:${SITE_CONTACT_EMAIL}`"
          class="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss"
        >{{ SITE_CONTACT_EMAIL }}</a>
        。
      </p>
    </section>
  </article>
</template>
