import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { PRODUCT_API_ENDPOINT } from '@/utils/constant'
import { Inventory2 } from '@mui/icons-material'

export default function ProductDisplay({ addToCart }) {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(8)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(PRODUCT_API_ENDPOINT, { withCredentials: true })
      const productsWithQuantity = response.data.data.map(product => ({
        ...product,
        quantity: product.quantity || 0
      }))
      setProducts(productsWithQuantity)
      
      const uniqueCategories = [...new Set(productsWithQuantity.map(product => product.category))]
      setCategories(['All', ...uniqueCategories])
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  )

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 shadow-xl rounded-3xl overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-[#4A3933] to-[#3A2923] text-white">
        <h1 className="text-4xl font-bold mb-6 flex items-center">
          <Inventory2 className="mr-3" /> POS System
        </h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search for coffee, pastries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-3 bg-white/10 dark:bg-white/5 text-white placeholder-gray-300 rounded-full border-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
          />
        </div>
      </div>
      <div className="p-8">
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full px-6 py-2 transition-all duration-300 ${
                selectedCategory === category 
                  ? 'bg-[#4A3933] text-white hover:bg-[#3A2923]' 
                  : 'bg-white text-[#4A3933] hover:bg-[#4A3933] hover:text-white'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-[#4A3933] dark:text-[#F9F5F1]" />
          </div>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <AnimatePresence>
                {currentProducts.map(product => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="transition-all duration-300"
                  >
                    <Card 
                      className="overflow-hidden h-full flex flex-col cursor-pointer dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300" 
                      onClick={() => addToCart(product)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end justify-start p-4">
                          <span className="bg-white text-[#4A3933] px-2 py-1 rounded-full text-sm font-semibold">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4 flex flex-col flex-grow bg-white dark:bg-gray-800">
                        <h3 className="font-semibold text-lg truncate mb-2 dark:text-white">{product.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-auto">Stock: {product.quantity}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <div className="mt-8 flex justify-center items-center space-x-4">
              <Button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-[#4A3933] text-white hover:bg-[#3A2923] transition-colors duration-300"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span className="text-lg font-semibold text-[#4A3933] dark:text-white">
                Page {currentPage} of {Math.ceil(filteredProducts.length / productsPerPage)}
              </span>
              <Button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastProduct >= filteredProducts.length}
                className="bg-[#4A3933] text-white hover:bg-[#3A2923] transition-colors duration-300"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}