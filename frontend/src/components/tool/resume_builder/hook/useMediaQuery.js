import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    const updateMatches = () => setMatches(media.matches)
    updateMatches()

    if (media.addListener) {
      media.addListener(updateMatches)
      return () => media.removeListener(updateMatches)
    } else {
      media.addEventListener('change', updateMatches)
      return () => media.removeEventListener('change', updateMatches)
    }
  }, [query])

  return matches
}