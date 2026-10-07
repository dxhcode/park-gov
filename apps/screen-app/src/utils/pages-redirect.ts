/** GitHub Pages 深链 404 会带着 ?p=/子路径 回到应用入口，这里还原成 history 路由。 */
export function restorePagesDeepLink() {
  const deep = new URLSearchParams(window.location.search).get('p')
  if (!deep) return
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const path = deep.startsWith('/') ? deep : `/${deep}`
  window.history.replaceState(null, '', `${base}${path}${window.location.hash}`)
}
