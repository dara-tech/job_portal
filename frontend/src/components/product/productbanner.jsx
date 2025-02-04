import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';
import { PRODUCT_API_ENDPOINT } from '@/utils/constant';
import { Link } from 'react-router-dom';

const ProductBanner = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const { data } = await axios.get(`${PRODUCT_API_ENDPOINT}?sort=-createdAt&limit=5`, { withCredentials: true });
        if (data.success && data.data.length > 0) {
          setLatestProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch latest products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % latestProducts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [latestProducts.length]);

  const nextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % latestProducts.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + latestProducts.length) % latestProducts.length);
  };

  if (loading) {
    return <ProductBannerSkeleton />;
  }

  if (latestProducts.length === 0) return null;

  const currentProduct = latestProducts[currentIndex];

  return (
    <div className="relative overflow-hidden mb-6 rounded-xl bg-gray-900">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <Badge className="bg-purple-500/10 text-purple-300">
                New Arrival
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {currentProduct.name}
              </h1>
            </div>

            <div className="text-lg text-gray-300/90">
              <div dangerouslySetInnerHTML={{ __html: currentProduct.description.substring(0, 100) }} />
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Link to={`/products/${currentProduct._id}`}>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <span className="text-2xl font-bold text-white">
                ${currentProduct.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="md:w-1/2">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="rounded-lg w-full h-auto object-cover shadow-lg"
            />
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          {latestProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-purple-500'
                  : 'bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={prevProduct}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextProduct}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

const ProductBannerSkeleton = () => {
  return (
    <div className="bg-gray-900 py-16 relative overflow-hidden mb-6 rounded-xl">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 space-y-6">
            <div className="space-y-2">
              <div className="h-6 w-24 bg-gray-800 rounded-full" />
              <div className="h-12 bg-gray-800 rounded-lg w-3/4" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-800 rounded w-5/6" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 bg-gray-800 rounded-lg" />
              <div className="h-8 w-24 bg-gray-800 rounded-lg" />
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="w-full aspect-video bg-gray-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;