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
            link: [{ rel: 'icon', type: 'image/png', href: '/logo.png' }],
            meta: [
                { name: 'bytedance-verification-code', content: 'BImYavCy7xAQ0tBUtN8A' },
                { name: 'baidu-site-verification', content: 'codeva-9sBsSvrUOc' },
            ],
        },
    },

    runtimeConfig: {
        public: {
            siteUrl: 'https://zzf.net.cn',
            siteName: 'ZZF',
            la51Id: '3RIe6jordcKGveLo',
            la51Ck: '3RIe6jordcKGveLo',
        },
    },

    routeRules: {
        '/about': { redirect: { to: '/', statusCode: 301 } },
        '/project': { redirect: { to: '/', statusCode: 301 } },
        '/message': { redirect: { to: '/', statusCode: 301 } },
        '/article': { redirect: { to: '/guides', statusCode: 301 } },
        '/article/**': { redirect: { to: '/guides', statusCode: 301 } },
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
            routes: ['/sitemap.xml', '/robots.txt'],
        },
    },

    typescript: {
        strict: true,
    },
});
