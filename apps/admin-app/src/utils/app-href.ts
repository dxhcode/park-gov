export function appHref(app: 'admin' | 'screen', path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const url = new URL(window.location.href)
  const localDev =
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
    (url.port === '5173' || url.port === '5174')
  if (localDev) url.port = app === 'admin' ? '5173' : '5174'
  url.pathname = `/park-gov/${app}${normalized}`
  url.search = ''
  url.hash = ''
  return url
}

export function openScreen(scene: string, from: string) {
  const url = appHref('screen', scene)
  url.searchParams.set('from', from)
  window.location.assign(url.toString())
}
