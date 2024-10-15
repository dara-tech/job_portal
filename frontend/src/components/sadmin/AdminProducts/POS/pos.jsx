import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { PRODUCT_API_ENDPOINT } from '@/utils/constant'
import ProductDisplay from './productdisplay'
import CheckoutSection from './checkoutsection'

export default function POS() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(PRODUCT_API_ENDPOINT, { withCredentials: true })
      const productsWithQuantity = response.data.data.map(product => ({
        ...product,
        quantity: product.quantity || 0
      }))
      setProducts(productsWithQuantity)
    } catch (error) {
      toast.error('Failed to fetch products')
    }
  }

  const addToCart = (product) => {
    if (product.quantity <= 0) {
      toast.error(`${product.name} is out of stock`)
      return
    }
    const existingItem = cart.find(item => item._id === product._id)
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        toast.error(`Cannot add more ${product.name}. Stock limit reached.`)
        return
      }
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1, discount: 0, discountType: 'percentage' }])
    }
    setProducts(products.map(p =>
      p._id === product._id ? { ...p, quantity: p.quantity - 1 } : p
    ))
    toast.success(`${product.name} added to cart`)
  }

  const updateCart = (newCart) => {
    setCart(newCart)
    // Update product quantities based on cart changes
    const updatedProducts = products.map(product => {
      const cartItem = newCart.find(item => item._id === product._id)
      const quantityInCart = cartItem ? cartItem.quantity : 0
      return {
        ...product,
        quantity: product.quantity + (cart.find(item => item._id === product._id)?.quantity || 0) - quantityInCart
      }
    })
    setProducts(updatedProducts)
  }

  const clearCart = () => {
    // Restore product quantities
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item._id === product._id)
      return cartItem
        ? { ...product, quantity: product.quantity + cartItem.quantity }
        : product
    })
    setProducts(updatedProducts)
    setCart([])
    toast.info('Cart cleared')
  }

  const handleCheckout = async (paymentMethod, discountType, discountValue, isLoyaltyCustomer, total, amountPaid, changeAmount) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty. Add items before checking out.")
      return
    }

    try {
      const response = await axios.post(`${PRODUCT_API_ENDPOINT}/checkout`, {
        products: cart.map(item => ({ productId: item._id, quantity: item.quantity })),
        paymentMethod,
        discountType,
        discountValue,
        isLoyaltyCustomer,
        total,
        amountPaid,
        changeAmount
      }, { withCredentials: true })

      if (response.data.success) {
        toast.success('Order placed successfully!')
        setCart([])
        fetchProducts() // Refresh product list after successful checkout
      } else {
        toast.error('Failed to place order. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('An error occurred during checkout. Please try again.')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-[#F9F5F1] dark:bg-gray-950 min-h-screen">
      <ProductDisplay 
        products={products}
        addToCart={addToCart}
      />
      <CheckoutSection 
        cart={cart}
        updateCart={updateCart}
        clearCart={clearCart}
        handleCheckout={handleCheckout}
      />
    </div>
  )
}