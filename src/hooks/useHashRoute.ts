import { useEffect, useState } from 'react'

export default function useHashRoute() {
  const [route, setRoute] = useState(() => {
    const h = window.location.hash
    return h.startsWith('#') ? h.slice(1) : h
  })

  useEffect(() => {
    const handler = () => {
      const h = window.location.hash
      setRoute(h.startsWith('#') ? h.slice(1) : h)
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const navigate = (to: string) => {
    window.location.hash = to.startsWith('/') ? to : `/${to}`
  }

  return { route: route || '/', navigate }
}
