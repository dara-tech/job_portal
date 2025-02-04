import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, Share2, Package, Shield, Truck, RotateCcw, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { PRODUCT_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Mock additional images (in real app, these would come from API)
  const productImages = product ? [product.image, '/api/placeholder/400/400', '/api/placeholder/400/400'] : [];

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

  const ProductFeatures = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {[
        { icon: Truck, title: "Free Delivery", desc: "For orders over $100" },
        { icon: RotateCcw, title: "30 Days Return", desc: "If goods have problems" },
        { icon: Shield, title: "Secure Payment", desc: "100% secure payment" },
        { icon: Package, title: "24/7 Support", desc: "Dedicated support" }
      ].map((feature, idx) => (
        <Card key={idx} className="border-none shadow-none bg-gray-50 dark:bg-gray-900">
          <CardContent className="p-4 text-center">
            <feature.icon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <h3 className="font-medium">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-4">
            <Skeleton className="w-full aspect-square rounded-xl" />
            <div className="flex gap-2">
              {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/3 space-y-4">
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
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <CardContent className="p-4 flex items-center justify-center text-red-600">
            <AlertCircle className="mr-2" />
            <span>{error}</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-2/3 space-y-4">
          <div className="relative group">
            <img 
              src={productImages[selectedImage]} 
              alt={product.name} 
              className="w-full aspect-square object-cover rounded-xl" 
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity rounded-xl" />
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap ">
            <div className="flex gap-2 pb-4">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`p-2 relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                    selectedImage === idx ? 'ring-1 ring-primary m-2' : ''
                  }`}
                >
                  <img src={img} alt={`Product view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Info Section */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              {product.countInStock > 0 ? (
                <Badge variant="success" className="bg-green-500/10 text-green-500 text-xs">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.numReviews} reviews
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
            <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.description.substring(0, 200) + '...' }}></div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {product.countInStock} items available
              </span>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => window.open('https://t.me/soundtech_cambodia', '_blank')}
                className="flex-1"
                size="lg"
                disabled={product.countInStock === 0}
              >
                <Package className="mr-2 h-5 w-5" />
                Order
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Specs Preview */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-medium">Quick Specs</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" />
                Brand: {product.brand}
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" />
                Category: {product.category}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ProductFeatures />

      {/* Detailed Info Tabs */}
      <Tabs defaultValue="description" className="mt-8">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({product.reviews?.length || 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="specifications" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Brand", value: product.brand },
                  { label: "Category", value: product.category },
                  { label: "Stock Status", value: product.countInStock > 0 ? "In Stock" : "Out of Stock" },
                  { label: "Rating", value: `${product.rating}/5` }
                ].map((spec, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="pb-6 border-b last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{review.name}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No reviews yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;