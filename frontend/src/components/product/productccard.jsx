import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addToCart } from '@/redux/cartSlice';

const ProductCard = ({ product }) => {
  const { _id, name, price, image, description, rating } = product;
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ id: _id, name, price, image, quantity: 1 }));
    toast.success(`${name} added to your cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="w-full max-w-sm mx-auto overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-none dark:bg-gray-900">
        <div className="relative h-80 w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-2 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex space-x-2">
            <Button 
              className="flex-1 bg-white text-gray-900 hover:bg-gray-100 transition-colors duration-300 py-2 rounded-full text-sm font-medium flex items-center justify-center shadow-md"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Link to={`/products/${_id}`} className="flex-1">
              <Button 
                className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 py-2 rounded-full text-sm font-medium flex items-center justify-center shadow-md"
              >
                <Eye className=" h-4 w-4" />
      
              </Button>
            </Link>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800 truncate flex-1 dark:text-white">{name}</h3>
            <div className="flex items-center bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
              <Star className="h-3 w-3 mr-1 fill-current" />
              {rating.toFixed(1)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 " dangerouslySetInnerHTML={{ __html: description }}></p>
          <p className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
