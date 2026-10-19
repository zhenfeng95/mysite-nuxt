import type { Block } from '~/data/guides';
import { guidePath, guides } from '~/data/guides';
import { infraEntries } from '~/data/entries';

export type SearchResultGroup = 'page' | 'guide' | 'service';

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
    service: '数字基建',
};

const GROUP_ORDER: SearchResultGroup[] = ['page', 'guide', 'service'];

const KIND_LABEL = {
    steps: '部署步骤',
    excerpt: '基建说明',
} as const;

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
            return block.items.join(' ');
        case 'code':
            return block.text;
        case 'img':
            return block.alt;
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
            description: '部署步骤',
            to: '/guides',
            haystack: buildHaystack('网站部署', '部署', '证书'),
        },
        {
            id: 'page-infra',
            group: 'page',
            groupLabel: GROUP_LABEL.page,
            title: '数字基建',
            description: '域名与邮箱相关的基建服务',
            to: '/digital-infra',
            haystack: buildHaystack('数字基建', '官网', '服务', '域名', '邮箱'),
        },
    ];

    const guideItems: IndexedItem[] = guides.map(guide => ({
        id: `guide-${guide.slug}`,
        group: guide.kind === 'excerpt' ? 'service' : 'guide',
        groupLabel: guide.kind === 'excerpt' ? GROUP_LABEL.service : GROUP_LABEL.guide,
        title: guide.title,
        description: guide.description,
        to: guidePath(guide),
        meta: KIND_LABEL[guide.kind],
        haystack: buildHaystack(guide.title, guide.description, guide.slug, KIND_LABEL[guide.kind], guide.blocks.map(blockText)),
    }));

    const services: IndexedItem[] = infraEntries.map(entry => ({
        id: `service-${entry.id}`,
        group: 'service',
        groupLabel: GROUP_LABEL.service,
        title: entry.name,
        description: entry.description,
        href: entry.url,
        meta: '官方网站',
        haystack: buildHaystack(entry.name, entry.description, entry.tags, entry.url),
    }));

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
