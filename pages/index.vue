<script setup lang="ts">
import { guidePath, guides, type GuideKind } from '~/data/guides';
import { SITE_DESCRIPTION, SITE_NAME, SITE_SLOGAN, SISTER_SITES } from '~/data/site';
import { websiteLd } from '~/utils/jsonLd';

definePageMeta({
    layout: 'home',
});

usePageSeo({
    title: `${SITE_NAME}｜${SITE_SLOGAN}`,
    description: SITE_DESCRIPTION,
    path: '/',
});

useHead({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(websiteLd(SITE_DESCRIPTION)),
        },
    ],
});

const InternalLink = resolveComponent('NuxtLink');

const kindLabel: Record<GuideKind, string> = {
    steps: '网站部署',
    excerpt: '建站攻略',
    side: '副业变现',
};

const recentGuides = [...guides].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);

function isExternal(href: string) {
    return href.startsWith('http');
}
</script>

<template>
    <div class="flex min-h-0 w-full flex-1 flex-col">
        <section class="home-hero relative flex items-center justify-center px-5 py-20 sm:py-24">
            <div class="home-glow pointer-events-none absolute inset-0" />
            <div class="relative z-10 w-full max-w-3xl text-center">
                <h1 class="font-serif text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl">
                    <span class="block text-ink">{{ SITE_NAME }}</span>
                    <span
                        class="mt-3 block font-sans text-xl font-normal italic leading-snug tracking-normal text-gold sm:text-2xl md:text-3xl"
                    >
                        {{ SITE_SLOGAN }}
                    </span>
                </h1>
                <p class="mx-auto mt-8 max-w-xl text-sm leading-7 text-stone-500 sm:text-base">
                    个人维护的建站笔记：
                    <NuxtLink
                        to="/digital-infra"
                        class="text-ink underline decoration-stone-300 underline-offset-4 transition hover:text-gold hover:decoration-gold/50"
                        >建站攻略</NuxtLink
                    >
                    整理域名、邮箱与 Cloudflare；
                    <NuxtLink
                        to="/guides"
                        class="text-ink underline decoration-stone-300 underline-offset-4 transition hover:text-gold hover:decoration-gold/50"
                        >网站部署</NuxtLink
                    >
                    写清上线、自动更新与免费证书；核对解析时可用
                    <NuxtLink
                        to="/tools"
                        class="text-ink underline decoration-stone-300 underline-offset-4 transition hover:text-gold hover:decoration-gold/50"
                        >实用工具</NuxtLink
                    >。
                </p>
            </div>
        </section>

        <!-- 与 SiteHeader / default layout 同宽：max-w-[72rem] + 相同 padding -->
        <section class="mx-auto w-full max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
            <h2 class="font-serif text-2xl tracking-tight text-ink sm:text-3xl">最近更新</h2>
            <p class="mt-3 text-sm leading-7 text-stone-500">
                域名注册、免费邮箱、Cloudflare、服务器上线与证书续期等实践笔记，按更新时间排列。
            </p>
            <ul class="mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
                <li v-for="guide in recentGuides" :key="guide.slug" class="h-full">
                    <NuxtLink
                        :to="guidePath(guide)"
                        class="group flex h-full flex-col rounded-2xl border border-stone-300/70 bg-white/60 px-5 py-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition hover:border-moss/40 hover:shadow-[0_10px_36px_rgb(0,0,0,0.09)]"
                    >
                        <p class="text-lg font-semibold tracking-tight text-ink transition group-hover:text-gold">
                            {{ guide.title }}
                        </p>
                        <p class="mt-2 flex-1 text-sm leading-6 text-stone-500 line-clamp-3">
                            {{ guide.description }}
                        </p>
                        <div class="mt-5 flex items-center justify-between gap-3 text-sm">
                            <span class="text-stone-400">{{ kindLabel[guide.kind] }} · {{ guide.updatedAt }}</span>
                            <span
                                class="text-ink underline decoration-stone-300 underline-offset-4 transition group-hover:text-gold group-hover:decoration-gold/50"
                            >
                                查看 →
                            </span>
                        </div>
                    </NuxtLink>
                </li>
            </ul>
        </section>

        <div class="mx-auto w-full max-w-[72rem] border-t border-dashed border-stone-300/80 px-4 pb-14 pt-10 text-center sm:px-6 lg:px-8">
            <p class="text-xs tracking-wide text-stone-400">更多入口</p>
            <div class="mt-3 flex flex-wrap items-stretch justify-center gap-x-6 gap-y-4 sm:gap-x-8">
                <component
                    :is="isExternal(site.href) ? 'a' : InternalLink"
                    v-for="site in SISTER_SITES"
                    :key="site.href"
                    v-bind="isExternal(site.href) ? { href: site.href, target: '_blank', rel: 'noopener noreferrer' } : { to: site.href }"
                    class="group inline-flex flex-col items-center gap-0.5 text-sm text-ink transition hover:text-gold"
                >
                    <span class="inline-flex items-center gap-1 font-medium">
                        {{ site.name }}
                        <svg
                            v-if="isExternal(site.href)"
                            class="h-3.5 w-3.5 text-stone-400 transition group-hover:text-gold"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            aria-hidden="true"
                        >
                            <path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                    <span class="text-xs text-stone-400 transition group-hover:text-stone-500">
                        {{ site.blurb }}
                    </span>
                </component>
            </div>
        </div>
    </div>
</template>
