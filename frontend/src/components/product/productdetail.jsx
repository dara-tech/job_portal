import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Star, ShoppingCart, Heart, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addToCart } from '@/redux/cartSlice';
import { PRODUCT_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${PRODUCT_API_ENDPOINT}/${id}`, {
          withCredentials: true
        });
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          setError('Failed to fetch product details');
        }
      } catch (err) {
        setError('An error occurred while fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart`);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.countInStock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/2 h-96" />
          <div className="w-full md:w-1/2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500 flex items-center justify-center">
        <AlertCircle className="mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover " />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
          </div>
          <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }}></p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md">
              <button 
                className="px-3 py-1 border-r"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-1">{quantity}</span>
              <button 
                className="px-3 py-1 border-l"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.countInStock}
              >
                +
              </button>
            </div>
            <Button 
              onClick={handleAddToCart} 
              className="flex items-center space-x-2"
              disabled={product.countInStock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
  
            </Button>
          </div>
          {product.countInStock > 0 && (
            <p className="text-sm text-gray-500">
              {product.countInStock} items left in stock
            </p>
          )}
        </div>
      </div>
      <Tabs defaultValue="description" className="mt-8">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }}></p>
        </TabsContent>
        <TabsContent value="specifications" className="mt-4">
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Brand: {product.brand}</li>
            <li>Category: {product.category}</li>
            <li>In Stock: {product.countInStock > 0 ? 'Yes' : 'No'}</li>
            {/* Add more specifications as needed */}
          </ul>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-semibold">{review.name}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
