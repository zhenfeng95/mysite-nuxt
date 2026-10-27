#!/usr/bin/env node
/**
 * 从 sitemap.xml 拉取全部 <loc>，批量提交到 IndexNow（Bing 等）。
 *
 * 用法：
 *   npm run indexnow
 *   npm run indexnow -- --dry-run
 *   SITEMAP_URL=https://zhenvia.com/sitemap.xml npm run indexnow
 */

const HOST = process.env.INDEXNOW_HOST || 'zhenvia.com'
const KEY = process.env.INDEXNOW_KEY || 'zhenvia-indexnow-f05aa8ec'
const KEY_LOCATION
  = process.env.INDEXNOW_KEY_LOCATION
    || `https://${HOST}/${KEY}.txt`
const SITEMAP_URL
  = process.env.SITEMAP_URL
    || `https://${HOST}/sitemap.xml`
const ENDPOINT
  = process.env.INDEXNOW_ENDPOINT
    || 'https://api.indexnow.org/indexnow'

const dryRun = process.argv.includes('--dry-run')

function extractLocs(xml) {
  const locs = []
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi
  let match = re.exec(xml)
  while (match) {
    locs.push(match[1].trim())
    match = re.exec(xml)
  }
  return [...new Set(locs)]
}

async function main() {
  console.log(`拉取 sitemap: ${SITEMAP_URL}`)
  const sitemapRes = await fetch(SITEMAP_URL)
  if (!sitemapRes.ok) {
    throw new Error(`sitemap 请求失败: HTTP ${sitemapRes.status}`)
  }
  const xml = await sitemapRes.text()
  const urlList = extractLocs(xml).filter((url) => {
    try {
      const u = new URL(url)
      return u.hostname === HOST || u.hostname === `www.${HOST}`
    }
    catch {
      return false
    }
  })

  if (!urlList.length) {
    throw new Error('sitemap 里没有解析到属于本站的 URL')
  }

  console.log(`共 ${urlList.length} 条 URL`)
  if (dryRun) {
    for (const url of urlList) {
      console.log(`  ${url}`)
    }
    console.log('（--dry-run，未提交）')
    return
  }

  const keyRes = await fetch(KEY_LOCATION)
  if (!keyRes.ok) {
    throw new Error(
      `密钥文件打不开: ${KEY_LOCATION} (HTTP ${keyRes.status})。请先部署 public/${KEY}.txt`,
    )
  }
  const keyBody = (await keyRes.text()).trim()
  if (keyBody !== KEY) {
    throw new Error(`密钥文件内容与 KEY 不一致：期望 ${KEY}`)
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }

  console.log(`提交到 ${ENDPOINT} …`)
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  console.log(`HTTP ${res.status}`)
  if (text) {
    console.log(text)
  }
  if (res.status !== 200 && res.status !== 202) {
    process.exitCode = 1
  }
  else {
    console.log('已提交。200/202 表示引擎收到，不等于立刻收录。')
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exitCode = 1
})
