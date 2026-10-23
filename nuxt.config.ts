// Fully prerendered for Vercel edge cache (same idea as wise-invest.org on Next.js):
// build writes static HTML; Vercel serves HIT from nearby POPs (e.g. sin1), no origin compute.
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    experimental: {
        appManifest: false,
    },

    modules: ['@nuxtjs/tailwindcss'],

    tailwindcss: {
        cssPath: '~/assets/css/main.css',
    },

    app: {
        head: {
            htmlAttrs: { lang: 'zh-CN' },
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            link: [
                { rel: 'icon', type: 'image/png', href: '/logo.png' },
                { rel: 'shortcut icon', type: 'image/png', href: '/logo.png' },
                { rel: 'apple-touch-icon', href: '/logo.png' },
            ],
            meta: [
                { name: 'bytedance-verification-code', content: 'BImYavCy7xAQ0tBUtN8A' },
                { name: 'baidu-site-verification', content: 'codeva-9sBsSvrUOc' },
                { name: 'shenma-site-verification', content: '7e14af04cc4a33ca966dda5366241475_1790244345' },
            ],
        },
    },

    runtimeConfig: {
        public: {
            siteUrl: 'https://zhenvia.com',
            siteName: '真途',
        },
    },

    routeRules: {
        // Geo must stay a live function so Vercel can set x-vercel-ip-country per request.
        '/api/geo': { prerender: false },
        // DNS / domain lookup hit live resolvers; must stay dynamic.
        '/api/dns': { prerender: false },
        '/api/domain': { prerender: false },
        '/api/ping': { prerender: false },
        '/api/ip': { prerender: false },
        // All content routes are static HTML at build time → Vercel CDN HIT
        '/**': { prerender: true },

        '/project': { redirect: { to: '/', statusCode: 301 } },
        '/message': { redirect: { to: '/contact', statusCode: 301 } },
        '/guides': { redirect: { to: '/digital-infra', statusCode: 301 } },
        '/article': { redirect: { to: '/digital-infra', statusCode: 301 } },
        '/article/**': { redirect: { to: '/digital-infra', statusCode: 301 } },
        '/guides/dnshe-free-domain-guide': {
            redirect: { to: '/digital-infra/dnshe-free-domain-guide', statusCode: 301 },
        },
        '/guides/oqumail-free-domain-email-guide': {
            redirect: { to: '/digital-infra/oqumail-free-domain-email-guide', statusCode: 301 },
        },
        '/guides/google-workspace-domain-guide': {
            redirect: { to: '/digital-infra/google-workspace-domain-guide', statusCode: 301 },
        },
    },

    nitro: {
        prerender: {
            crawlLinks: true,
            routes: [
                '/',
                '/about',
                '/contact',
                '/tools',
                '/side-hustle',
                '/sitemap.xml',
                '/robots.txt',
            ],
            ignore: ['/api/geo', '/api/dns', '/api/domain', '/api/ping', '/api/ip'],
        },
    },

    typescript: {
        strict: true,
    },
});
