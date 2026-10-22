<script setup lang="ts">
import { SITE_CONTACT_EMAIL, SITE_NAME } from '~/data/site'

usePageSeo({
  title: '联系我们',
  seoTitle: `联系${SITE_NAME}：反馈勘误、失效链接与站点问题`,
  description: `通过公开邮箱联系 ${SITE_NAME}：反馈链接失效、内容勘误、资源补充或站点相关问题。`,
  path: '/contact',
})
</script>

<template>
  <article>
    <p class="text-sm text-moss">联系</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight">联系我们</h1>
    <p class="mt-4 leading-8 text-stone-700">
      欢迎通过公开邮箱反馈勘误、失效链接或站点相关问题。本站由个人维护，会尽量在合理时间内查看并回复。
    </p>

    <section class="mt-10 space-y-4">
      <h2 class="text-xl font-semibold text-ink">公开邮箱</h2>
      <p class="leading-8 text-stone-700">
        <a
          :href="`mailto:${SITE_CONTACT_EMAIL}`"
          class="text-lg font-medium text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss"
        >{{ SITE_CONTACT_EMAIL }}</a>
      </p>
      <p class="leading-8 text-stone-700">
        请尽量在邮件主题里写明事由（例如「链接失效」「教程勘误」），并附上对应页面链接，方便核对。
      </p>
    </section>

    <section class="mt-10 space-y-4">
      <h2 class="text-xl font-semibold text-ink">适合联系的事项</h2>
      <ul class="list-disc space-y-2 pl-5 leading-7 text-stone-700">
        <li>教程中的事实错误、过时步骤与截图失效</li>
        <li>官方链接变更、页面打不开或跳转异常</li>
        <li>站点使用、隐私或内容边界相关的疑问</li>
        <li>善意的内容补充建议（可能采纳，但不承诺逐条回复实现进度）</li>
      </ul>
    </section>

    <section class="mt-10 space-y-4">
      <h2 class="text-xl font-semibold text-ink">我们无法提供的协助</h2>
      <ul class="list-disc space-y-2 pl-5 leading-7 text-stone-700">
        <li>代注册、代购域、代运维或一对一远程操作</li>
        <li>绕过平台风控、违规或灰色操作方案</li>
        <li>各服务商账户审核进度查询（请直接联系对应官方客服）</li>
        <li>与本站无关的私人事务或紧急求助</li>
      </ul>
      <p class="leading-8 text-stone-700">
        站点定位见
        <NuxtLink to="/about" class="text-moss underline decoration-moss/40 underline-offset-4 hover:decoration-moss">关于我们</NuxtLink>。
      </p>
    </section>

    <section class="mt-10 space-y-4">
      <h2 class="text-xl font-semibold text-ink">回复说明</h2>
      <p class="leading-8 text-stone-700">
        通常会在数个工作日内查看邮箱；高峰期或信息不全时可能更慢，或需要你补充细节后再回复。
        不保证对每封邮件都逐一回复，但会优先处理事实勘误与安全相关问题。
      </p>
    </section>
  </article>
</template>
