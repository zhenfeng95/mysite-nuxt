<script setup lang="ts">
import { getNextHolidayInfo, type NextHolidayInfo } from '~/data/cn-holidays';
import { guidePath, guides, type GuideKind } from '~/data/guides';
import { SITE_DESCRIPTION, SITE_NAME, SITE_SLOGAN } from '~/data/site';
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

const kindLabel: Record<GuideKind, string> = {
    steps: '建站攻略 · 网站部署',
    excerpt: '建站攻略',
    side: '副业变现',
};

const recentGuides = [...guides].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);

/** 客户端按访问日计算，避免静态预渲染写死构建日期 */
const nextHoliday = ref<NextHolidayInfo | null>(null);
const holidayReady = ref(false);
const holidayDaysShown = ref(0);

const holidayLine = computed(() => {
    const info = nextHoliday.value;
    if (!info) {
        return null;
    }
    if (info.status === 'ongoing') {
        return {
            status: info.status,
            name: info.name,
            targetDays: info.daysToEnd,
            detail: `${info.start} 至 ${info.end} · 含今天`,
        };
    }
    return {
        status: info.status,
        name: info.name,
        targetDays: info.daysToStart,
        detail: `${info.start} 至 ${info.end}`,
    };
});

function prefersReducedMotion() {
    return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function animateHolidayDays(target: number) {
    if (target <= 0 || prefersReducedMotion()) {
        holidayDaysShown.value = target;
        return;
    }
    const start = performance.now();
    const duration = Math.min(1200, 480 + target * 12);
    const from = 0;

    function tick(now: number) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - t) ** 3;
        holidayDaysShown.value = Math.round(from + (target - from) * eased);
        if (t < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

onMounted(() => {
    const info = getNextHolidayInfo(new Date());
    nextHoliday.value = info;
    if (!info) {
        return;
    }
    requestAnimationFrame(() => {
        holidayReady.value = true;
        animateHolidayDays(info.status === 'ongoing' ? info.daysToEnd : info.daysToStart);
    });
});
</script>

<template>
    <div class="flex min-h-0 w-full flex-1 flex-col">
        <section class="home-hero relative flex items-center justify-center px-5 py-20 sm:py-24">
            <div class="home-glow pointer-events-none absolute inset-0" />
            <div class="relative z-10 w-full max-w-3xl text-center">
                <h1 class="font-serif text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl">
                    <span class="home-hero-rise home-hero-rise--1 block text-ink">{{ SITE_NAME }}</span>
                    <span
                        class="home-hero-rise home-hero-rise--2 mt-3 block font-sans text-xl font-normal italic leading-snug tracking-normal text-gold sm:text-2xl md:text-3xl"
                    >
                        {{ SITE_SLOGAN }}
                    </span>
                </h1>
                <p class="home-hero-rise home-hero-rise--3 mx-auto mt-8 max-w-xl text-sm leading-7 text-stone-500 sm:text-base">
                    个人维护的建站笔记：
                    <NuxtLink
                        to="/digital-infra"
                        class="text-ink underline decoration-stone-300 underline-offset-4 transition hover:text-gold hover:decoration-gold/50"
                        >建站攻略</NuxtLink
                    >
                    整理域名、邮箱与 Cloudflare，并写清网站部署、自动更新与免费证书；核对解析时可用
                    <NuxtLink
                        to="/tools"
                        class="text-ink underline decoration-stone-300 underline-offset-4 transition hover:text-gold hover:decoration-gold/50"
                        >实用工具</NuxtLink
                    >。
                </p>
            </div>
        </section>

        <ClientOnly>
            <div
                v-if="holidayLine"
                class="home-holiday relative overflow-hidden border-b border-stone-300/60 bg-moss/[0.06]"
                :class="{ 'home-holiday--ready': holidayReady }"
            >
                <div class="home-holiday-sheen pointer-events-none absolute inset-0" aria-hidden="true" />
                <NuxtLink
                    to="/tools/calendar"
                    class="home-holiday-link relative mx-auto flex max-w-[72rem] flex-wrap items-baseline justify-center gap-x-3 gap-y-1 px-4 py-3.5 text-center sm:justify-between sm:px-6 sm:text-left lg:px-8"
                >
                    <p class="text-sm font-medium tracking-tight text-ink sm:text-base">
                        <span class="home-holiday-label text-moss">下次放假</span>
                        <span class="mx-2 text-stone-300">·</span>
                        <template v-if="holidayLine.status === 'ongoing'">
                            正在放{{ holidayLine.name }}，还剩
                            <span class="home-holiday-days tabular-nums text-moss">{{ holidayDaysShown }}</span>
                            天
                        </template>
                        <template v-else>
                            距{{ holidayLine.name }}还有
                            <span class="home-holiday-days tabular-nums text-moss">{{ holidayDaysShown }}</span>
                            天
                        </template>
                    </p>
                    <p class="text-xs text-stone-500 sm:text-sm">
                        {{ holidayLine.detail }}
                        <span class="home-holiday-cta ml-2 text-moss underline decoration-moss/40 underline-offset-4">
                            看日历 <span class="home-holiday-arrow inline-block">→</span>
                        </span>
                    </p>
                </NuxtLink>
            </div>
        </ClientOnly>

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
    </div>
</template>
