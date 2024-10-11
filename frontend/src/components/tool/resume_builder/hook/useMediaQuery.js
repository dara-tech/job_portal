import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    const updateMatches = () => setMatches(media.matches)
    updateMatches()

    media.addEventListener('change', updateMatches)
    return () => media.removeEventListener('change', updateMatches)
  }, [query])

  return matches
}