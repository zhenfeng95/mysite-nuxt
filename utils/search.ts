import type { Block } from '~/data/guides';
import { guidePath, guides } from '~/data/guides';
import { infraGroups } from '~/data/entries';
import { TOOLS_HUB, tools } from '~/data/tools';

export type SearchResultGroup = 'page' | 'guide' | 'service' | 'side';

export interface SearchResult {
    id: string;
    group: SearchResultGroup;
    groupLabel: string;
    title: string;
    description: string;
    to?: string;
    href?: string;
    meta?: string;
}

interface IndexedItem extends SearchResult {
    haystack: string;
}

const GROUP_LABEL: Record<SearchResultGroup, string> = {
    page: '页面',
    guide: '网站部署',
    service: '建站攻略',
    side: '副业变现',
};

const GROUP_ORDER: SearchResultGroup[] = ['page', 'guide', 'service', 'side'];

const KIND_LABEL = {
    steps: '网站部署',
    excerpt: '建站攻略',
    side: '副业变现',
} as const;

function guideSearchGroup(kind: keyof typeof KIND_LABEL): SearchResultGroup {
    if (kind === 'excerpt') {
        return 'service';
    }
    if (kind === 'side') {
        return 'side';
    }
    return 'guide';
}

function normalize(value: string) {
    return value.trim().toLowerCase();
}

function buildHaystack(...parts: Array<string | string[] | undefined>) {
    return parts
        .flatMap(part => {
            if (!part) {
                return [];
            }
            return Array.isArray(part) ? part : [part];
        })
        .join(' ')
        .toLowerCase();
}

function blockText(block: Block) {
    switch (block.type) {
        case 'p':
        case 'quote':
            return block.parts.map(part => (typeof part === 'string' ? part : part.text)).join(' ');
        case 'h2':
        case 'h3':
        case 'h4':
        case 'note':
            return block.text;
        case 'ul':
        case 'ol':
            return block.items
                .map(item =>
                    typeof item === 'string'
                        ? item
                        : item.map(part => (typeof part === 'string' ? part : part.text)).join(''),
                )
                .join(' ');
        case 'code':
            return block.text;
        case 'img':
            return block.alt;
        case 'imgs':
            return block.items.map(item => item.alt).join(' ');
        case 'table':
            return [...block.headers, ...block.rows.flat()].join(' ');
    }
}

function buildIndex(): IndexedItem[] {
    const pages: IndexedItem[] = [
        {
            id: 'page-home',
            group: 'page',
            groupLabel: GROUP_LABEL.page,
            title: '首页',
            description: '探索更好的路径，遇见更大的世界',
            to: '/',
            haystack: buildHaystack(
                '首页',
                '真途',
                '探索更好的路径',
                '遇见更大的世界',
                '笔记',
                '部署',
                '域名',
                '邮箱',
            ),
        },
        {
            id: 'page-guides',
            group: 'page',
            groupLabel: GROUP_LABEL.page,
            title: '网站部署',
            description: '上线、自动更新与免费证书等部署步骤',
            to: '/guides',
            haystack: buildHaystack('网站部署', '部署', '证书', '部署步骤'),
        },
        {
            id: 'page-infra',
            group: 'page',
            groupLabel: GROUP_LABEL.page,
            title: '建站攻略',
            description: '域名、邮箱与免费建站相关服务与教程',
            to: '/digital-infra',
            haystack: buildHaystack('建站攻略', '基建服务', '数字基建', '官网', '服务', '域名', '邮箱', 'Cloudflare'),
        },
        {
            id: 'page-side-hustle',
            group: 'page',
            groupLabel: GROUP_LABEL.page,
            title: '副业变现',
            description: '地推、网推等副业接单与变现路径笔记',
            to: '/side-hustle',
            haystack: buildHaystack('副业变现', '副业', '变现', '地推', '网推', '接单', '佣金'),
        },
        {
            id: 'page-about',
            group: 'page',
            groupLabel: GROUP_LABEL.page,
            title: '关于我们',
            description: '站点定位与内容边界',
            to: '/about',
            haystack: buildHaystack('关于我们', '关于', '真途', '站长'),
        },
        {
            id: 'page-contact',
            group: 'page',
            groupLabel: GROUP_LABEL.page,
            title: '联系我们',
            description: '反馈勘误与站点相关问题',
            to: '/contact',
            haystack: buildHaystack('联系我们', '联系', '邮箱', '反馈', '勘误'),
        },
        {
            id: 'page-tools',
            group: 'page',
            groupLabel: GROUP_LABEL.page,
            title: TOOLS_HUB.title,
            description: TOOLS_HUB.description,
            to: TOOLS_HUB.path,
            haystack: buildHaystack(
                '实用工具',
                '小工具',
                '工具',
                'DNS',
                'WHOIS',
                'Base64',
                '解析',
                'MX',
                'TXT',
                'Ping',
                '延迟',
                '丢包',
                'IP',
                '归属地',
                '日历',
            ),
        },
        ...tools.map(tool => ({
            id: `page-tools-${tool.slug}`,
            group: 'page' as const,
            groupLabel: GROUP_LABEL.page,
            title: tool.title,
            description: tool.description,
            to: tool.href,
            haystack: buildHaystack(tool.title, tool.description),
        })),
    ];

    const guideItems: IndexedItem[] = guides.map(guide => ({
        id: `guide-${guide.slug}`,
        group: guideSearchGroup(guide.kind),
        groupLabel: GROUP_LABEL[guideSearchGroup(guide.kind)],
        title: guide.title,
        description: guide.description,
        to: guidePath(guide),
        meta: KIND_LABEL[guide.kind],
        haystack: buildHaystack(guide.title, guide.description, guide.slug, KIND_LABEL[guide.kind], guide.blocks.map(blockText)),
    }));

    const services: IndexedItem[] = infraGroups.flatMap(section =>
        section.entries.map(entry => ({
            id: `service-${entry.id}`,
            group: 'service' as const,
            groupLabel: GROUP_LABEL.service,
            title: entry.name,
            description: entry.description,
            href: entry.url,
            meta: section.title,
            haystack: buildHaystack(section.title, entry.name, entry.description, entry.tags, entry.url),
        })),
    );

    return [...pages, ...guideItems, ...services];
}

let cachedIndex: IndexedItem[] | null = null;

function getIndex() {
    if (!cachedIndex) {
        cachedIndex = buildIndex();
    }
    return cachedIndex;
}

function scoreItem(item: IndexedItem, terms: string[]) {
    const title = item.title.toLowerCase();
    let score = 0;

    for (const term of terms) {
        if (title === term) {
            score += 100;
        } else if (title.startsWith(term)) {
            score += 60;
        } else if (title.includes(term)) {
            score += 40;
        } else if (item.haystack.includes(term)) {
            score += 15;
        } else {
            return 0;
        }
    }

    return score;
}

export function searchSite(query: string, limit = 24): SearchResult[] {
    const normalized = normalize(query);
    if (!normalized) {
        return [];
    }

    const terms = normalized.split(/\s+/).filter(Boolean);
    return getIndex()
        .map(item => ({ item, score: scoreItem(item, terms) }))
        .filter(entry => entry.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return GROUP_ORDER.indexOf(a.item.group) - GROUP_ORDER.indexOf(b.item.group);
        })
        .slice(0, limit)
        .map(({ item }) => {
            const { haystack: _haystack, ...result } = item;
            return result;
        });
}

export function groupSearchResults(results: SearchResult[]) {
    return GROUP_ORDER.map(group => ({
        group,
        label: GROUP_LABEL[group],
        items: results.filter(item => item.group === group),
    })).filter(section => section.items.length > 0);
}
