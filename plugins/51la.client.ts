declare global {
  interface Window {
    LA?: {
      init: (options: {
        id: string
        ck: string
        autoTrack?: boolean
        hashMode?: boolean
      }) => void
    }
  }
}

export default defineNuxtPlugin(() => {
  if (import.meta.dev) {
    return
  }

  const { public: pub } = useRuntimeConfig()
  const id = String(pub.la51Id || '')
  const ck = String(pub.la51Ck || '')
  if (!id || !ck) {
    return
  }

  const existing = document.getElementById('LA_COLLECT')
  if (existing) {
    return
  }

  const script = document.createElement('script')
  script.id = 'LA_COLLECT'
  script.charset = 'UTF-8'
  script.src = 'https://sdk.51.la/js-sdk-pro.min.js'
  script.onload = () => {
    window.LA?.init({
      id,
      ck,
      autoTrack: true,
      hashMode: true,
    })
  }
  document.body.appendChild(script)
})
