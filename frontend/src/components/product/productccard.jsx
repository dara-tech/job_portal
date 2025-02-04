import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, Star, Send, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addToCart } from '@/redux/cartSlice';

const ProductCard = ({ product }) => {
  const { _id, name, price, image, description, rating, stock = 10 } = product;
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ id: _id, name, price, image, quantity: 1 }));
    toast.success(`${name} added to your cart!`);
  };

  const toggleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="w-full mx-auto overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-none dark:bg-gray-900">
        <div className="relative w-full pb-[100%] overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover object-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
              >
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <Button
                    className="flex-1 bg-white text-gray-900 hover:bg-gray-100 transition-colors duration-300 rounded-full text-sm font-medium"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Link to={`/products/${_id}`} className="flex-1">
                    <Button
                      className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 rounded-full text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={toggleLike}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </motion.button>

          <Badge 
            className="absolute top-4 left-4 bg-blue-500/80 backdrop-blur-sm"
          >
            {stock < 5 ? 'Low Stock' : 'In Stock'}
          </Badge>
        </div>

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800 truncate flex-1 dark:text-white">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="fill-yellow-500 h-4 w-4" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>

          <p 
            className="text-sm text-muted-foreground mb-4 line-clamp-2" 
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${price.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                {stock} units left
              </p>
            </div>
            
            <a 
              href="https://t.me/soundtech_cambodia" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Order
              <Send className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;