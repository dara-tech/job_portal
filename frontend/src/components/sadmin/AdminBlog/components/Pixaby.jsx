import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { searchPixabayImages } from '../hook/pixabay'

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

export default function PixabayModal({ isOpen, onClose, onSelectImage }) {
  const [pixabayQuery, setPixabayQuery] = useState('')
  const [pixabayImages, setPixabayImages] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  const { ref, inView } = useInView({
    threshold: 0,
  })

  const searchInputRef = useRef(null)

  const handlePixabaySearch = useCallback(async (resetImages = true) => {
    if (!pixabayQuery.trim()) return

    setIsSearching(true)
    if (resetImages) {
      setPage(1)
      setPixabayImages([])
    }

    try {
      const results = await searchPixabayImages(pixabayQuery, resetImages ? 1 : page)
      setPixabayImages(prevImages => resetImages ? results : [...prevImages, ...results])
      setHasMore(results.length === 30)
      if (!resetImages) setPage(prevPage => prevPage + 1)
    } catch (error) {
      console.error('Error searching Pixabay:', error)
    } finally {
      setIsSearching(false)
    }
  }, [pixabayQuery, page])

  const debouncedSearch = useCallback(debounce(() => handlePixabaySearch(true), 300), [handlePixabaySearch])

  const handleSelectPixabayImage = (image) => {
    setSelectedImage(image)
  }

  const confirmSelection = () => {
    if (selectedImage) {
      onSelectImage(selectedImage)
      onClose()
    }
  }

  useEffect(() => {
    if (inView && !isSearching && hasMore) {
      handlePixabaySearch(false)
    }
  }, [inView, isSearching, hasMore, handlePixabaySearch])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Search Pixabay Images</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for images..."
            value={pixabayQuery}
            onChange={(e) => {
              setPixabayQuery(e.target.value)
              debouncedSearch()
            }}
          />
          <Button onClick={() => handlePixabaySearch(true)} disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-3 gap-4">
            <AnimatePresence>
              {pixabayImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`relative cursor-pointer ${selectedImage?.id === image.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleSelectPixabayImage(image)}
                >
                  <img
                    src={image.webformatURL}
                    alt={image.tags}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent text-white text-xs">
                    <p className="truncate">
                      Photo by{' '}
                      <a
                        href={`https://pixabay.com/users/${image.user}-${image.user_id}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-300"
                      >
                        {image.user}
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