import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { searchUnsplashImages, getImageUrl, getImageAltDescription, getUnsplashLink } from '../hook/unsplash'

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default function UnsplashModal({ isOpen, onClose, onSelectImage }) {
  const [unsplashQuery, setUnsplashQuery] = useState('')
  const [unsplashImages, setUnsplashImages] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  const { ref, inView } = useInView({
    threshold: 0,
  })

  const searchInputRef = useRef(null)

  const handleUnsplashSearch = useCallback(async (resetImages = true) => {
    if (!unsplashQuery.trim()) return

    setIsSearching(true)
    if (resetImages) {
      setPage(1)
      setUnsplashImages([])
    }

    try {
      const results = await searchUnsplashImages(unsplashQuery, resetImages ? 1 : page)
      setUnsplashImages(prevImages => resetImages ? results : [...prevImages, ...results])
      setHasMore(results.length === 30)
      if (!resetImages) setPage(prevPage => prevPage + 1)
    } catch (error) {
      console.error('Error searching Unsplash:', error)
    } finally {
      setIsSearching(false)
    }
  }, [unsplashQuery, page])

  const debouncedSearch = useCallback(debounce(() => handleUnsplashSearch(true), 300), [handleUnsplashSearch])

  const handleSelectUnsplashImage = (image) => {
    setSelectedImage(image)
  }

  const confirmSelection = () => {
    if (selectedImage) {
      onSelectImage(selectedImage)
      onClose()
    }
  }

  useEffect(() => {
    if (inView && hasMore && !isSearching) {
      handleUnsplashSearch(false)
    }
  }, [inView, hasMore, isSearching, handleUnsplashSearch])

  useEffect(() => {
    if (unsplashQuery) {
      debouncedSearch()
    }
  }, [unsplashQuery, debouncedSearch])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUnsplashSearch(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Unsplash Images</DialogTitle>
        </DialogHeader>
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search for images..."
            value={unsplashQuery}
            onChange={(e) => setUnsplashQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10"
            ref={searchInputRef}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <ScrollArea className="flex-grow w-full rounded-md border">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            <AnimatePresence>
              {unsplashImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={`relative group ${selectedImage?.id === image.id ? 'ring-2 ring-primary' : ''}`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={getImageAltDescription(image)}
                    className="w-full h-40 object-cover rounded-lg cursor-pointer transition-transform duration-200 ease-in-out transform group-hover:scale-105"
                    loading="lazy"
                    onClick={() => handleSelectUnsplashImage(image)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleSelectUnsplashImage(image)}
                    >
                      Select
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent text-white text-xs">
                    <p className="truncate">
                      Photo by{' '}
                      <a
                        href={getUnsplashLink(image)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-300"
                      >
                        {image.user.name}
                      </a>
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {isSearching && (
            <div className="flex justify-center items-center mt-4">
              <Loader2 className="h-6 w-4 animate-spin" />
            </div>
          )}
          <div ref={ref} style={{ height: 20 }} />
        </ScrollArea>
        <DialogFooter className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Page {page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => prev + 1)}
              disabled={!hasMore}
              className="ml-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={confirmSelection} disabled={!selectedImage}>
              Confirm Selection
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}