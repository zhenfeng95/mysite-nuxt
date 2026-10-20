export const SITE_NAME = '真途';
export const SITE_URL = 'https://zhenvia.com';
export const FULL_SITE_NAME = 'Zhen Invest';
export const FULL_SITE_URL = 'https://zheninvest.com';
export const NAV_SITE_NAME = '真途导航';
export const NAV_SITE_URL = 'https://nav.zhenvia.com';
export const SITE_CONTACT_EMAIL = 'contact@zhenvia.com';

/** 首页姐妹站入口（外链） */
export const SISTER_SITES = [
  {
    name: NAV_SITE_NAME,
    href: NAV_SITE_URL,
    blurb: '网址导航与常用入口',
  },
  {
    name: '投资理财',
    href: FULL_SITE_URL,
    blurb: '港美股与跨境投资',
  },
] as const

/** 站点 slogan / 首页主句 */
export const SITE_SLOGAN = '探索更好的路径，遇见更大的世界';

export const SITE_DESCRIPTION =
    '探索更好的路径，遇见更大的世界。「建站攻略」整理域名、邮箱与 Cloudflare；「网站部署」写清上线、自动更新与免费证书。'

/** 页脚免责说明 */
export const SITE_DISCLAIMER =
    '免责声明：路径整理与实践对照，仅供信息参考，不构成注册、购买或建站建议。';
