import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { PRODUCT_API_ENDPOINT } from "../../../utils/constant";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { FiPackage, FiDollarSign, FiImage, FiUploadCloud, FiX, FiLink } from "react-icons/fi";
import { useDropzone } from 'react-dropzone';
import axios from 'axios'; // Make sure to install and import axios
import ReactQuill from 'react-quill'; // Add this import
import 'react-quill/dist/quill.snow.css'; // Add this import for styles
// import GoogleImageSearch from './components/Googlesearch';

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    discount: "",
    image: null
  });
  const [salePrice, setSalePrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));

    // Calculate sale price when price or discount changes
    if (name === 'price' || name === 'discount') {
      calculateSalePrice(name === 'price' ? value : product.price, name === 'discount' ? value : product.discount);
    }
  };

  const calculateSalePrice = (price, discount) => {
    const numPrice = parseFloat(price);
    const numDiscount = parseFloat(discount);
    if (!isNaN(numPrice) && !isNaN(numDiscount)) {
      const discountAmount = numPrice * (numDiscount / 100);
      const newSalePrice = numPrice - discountAmount;
      setSalePrice(newSalePrice.toFixed(2));
    } else {
      setSalePrice(0);
    }
  };

  const handleCategoryChange = (value) => {
    setProduct(prev => ({ ...prev, category: value }));
    setErrors(prev => ({ ...prev, category: "" }));
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setProduct(prev => ({ ...prev, image: file }));
    setErrors(prev => ({ ...prev, image: "" }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  const removeImage = () => {
    setProduct(prev => ({ ...prev, image: null }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!product.name.trim()) {
      newErrors.name = "Please enter product name";
      isValid = false;
    }

    if (!product.description.trim()) {
      newErrors.description = "Please enter product description";
      isValid = false;
    }

    if (!product.price || isNaN(product.price) || Number(product.price) < 0) {
      newErrors.price = "Please enter a valid price";
      isValid = false;
    }

    if (!product.category) {
      newErrors.category = "Please select correct category for product";
      isValid = false;
    }

    if (!product.quantity || isNaN(product.quantity) || Number(product.quantity) < 0) {
      newErrors.quantity = "Please enter a valid quantity";
      isValid = false;
    }

    if (product.discount && (isNaN(product.discount) || Number(product.discount) < 0 || Number(product.discount) > 100)) {
      newErrors.discount = "Please enter a valid discount (0-100)";
      isValid = false;
    }

    if (!product.image) {
      newErrors.image = "Please upload an image for this product";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    for (const key in product) {
      formData.append(key, product[key]);
    }

    try {
      const response = await fetch(PRODUCT_API_ENDPOINT, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        console.log(response);
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      toast.success('Product added successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeBackground = async () => {
    if (!product.image) return;

    setIsRemovingBg(true);
    const formData = new FormData();
    formData.append('image_file', product.image);
    formData.append('size', 'auto');

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          'X-Api-Key': 'YqztAGpNGqCEmZbg3BDboxmA',
        },
      });

      const blob = new Blob([response.data], { type: 'image/png' });
      const file = new File([blob], 'removed-bg.png', { type: 'image/png' });
      setProduct(prev => ({ ...prev, image: file }));
      toast.success('Background removed successfully');
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error('Failed to remove background');
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleImageSelect = (imageUrl) => {
    // Fetch the image and convert it to a File object
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "product_image.jpg", { type: "image/jpeg" });
        setProduct(prev => ({ ...prev, image: file }));
        setErrors(prev => ({ ...prev, image: "" }));
      })
      .catch(error => {
        console.error('Error fetching image:', error);
        toast.error('Failed to fetch the selected image');
      });
  };

  const handleDescriptionChange = (content) => {
    setProduct(prev => ({ ...prev, description: content }));
    setErrors(prev => ({ ...prev, description: "" }));
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleImageUrlSubmit = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "product_image.jpg", { type: blob.type });
      setProduct(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: "" }));
      setImageUrl("");
    } catch (error) {
      console.error('Error fetching image:', error);
      toast.error('Failed to fetch the image from the provided URL');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" mx-auto  sm:px-2 lg:px-2 py-2"
    >
      <Card className="w-full overflow-hidden border-none">
        <CardHeader className="text-muted-foreground">
          <CardTitle className="text-3xl font-bold flex items-center">
            <FiPackage className="mr-3 text-4xl text-muted-foreground" /> Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content (left and center columns) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <Card >
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-md ">
                    <CardTitle className="text-2xl font-semibold text-white">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-lg font-light text-muted-foreground">Product Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={product.name} 
                        placeholder="Enter product name"
                        onChange={handleChange} 
                        required 
                        className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-lg font-light text-muted-foreground">Category</Label>
                      <Select value={product.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger id="category" className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Cameras">Cameras</SelectItem>
                          <SelectItem value="Laptops">Laptops</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                          <SelectItem value="Headphones">Headphones</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                          <SelectItem value="Clothes/Shoes">Clothes/Shoes</SelectItem>
                          <SelectItem value="Beauty/Health">Beauty/Health</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Outdoor">Outdoor</SelectItem>
                          <SelectItem value="Home">Home</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-lg font-light text-muted-foreground">Description</Label>
                      <ReactQuill
                        theme="snow"
                        value={product.description}
                        onChange={handleDescriptionChange}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                            ['link', 'image'],
                            ['clean']
                          ],
                        }}
                        formats={[
                          'header',
                          'bold', 'italic', 'underline', 'strike', 'blockquote',
                          'list', 'bullet', 'indent',
                          'link', 'image'
                        ]}
                        
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing and Inventory */}
                <Card >
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-md">
                    <CardTitle className="text-2xl font-semibold text-white">Pricing and Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-lg font-light text-muted-foreground flex items-center">
                          <FiDollarSign className="mr-2 text-green-500" /> Price
                        </Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          placeholder="Enter product price"
                          value={product.price}
                          onChange={handleChange}
                          required 
                          className="border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount" className="text-lg font-light text-muted-foreground">Discount (%)</Label>
                        <Input
                          id="discount"
                          name="discount"
                          type="number"
                          placeholder="Enter discount percentage"
                          min="0"
                          max="100"
                          value={product.discount}
                          onChange={handleChange}
                          className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
                      </div>
                    </div>
                    {salePrice > 0 && (
                      <div className="mt-4 p-4 bg-green-100 rounded-md border border-green-300">
                        <p className="text-green-800 font-semibold text-lg">
                          Sale Price: ${salePrice}
                        </p>
                        <p className="text-sm text-green-600">
                          You save: ${(product.price - salePrice).toFixed(2)} ({product.discount}% off)
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-lg font-light text-muted-foreground">Quantity</Label>
                      <Input 
                        id="quantity" 
                        name="quantity" 
                        type="number" 
                        placeholder="Enter product quantity"
                        value={product.quantity} 
                        onChange={handleChange} 
                        required 
                        className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                      {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Review and Submit (right column) */}
              <div className="space-y-6">
                {/* Image Upload */}
                <Card >
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-md">
                    <CardTitle className="text-2xl font-semibold text-white flex items-center">
                      <FiImage className="mr-2 text-white" /> Product Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div 
                      {...getRootProps()} 
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
                        isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {product.image ? (
                        <div className="relative">
                          <img src={URL.createObjectURL(product.image)} alt="Product preview" className="mx-auto max-h-48 rounded-lg shadow-md" />
                          <button 
                            onClick={removeImage} 
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600 transition-colors duration-300"
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <FiUploadCloud className="mx-auto h-12 w-12 text-blue-400" />
                          <p className="mt-2 text-sm text-gray-600">Drag 'n' drop an image here, or click to select one</p>
                        </div>
                      )}
                    </div>
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <Label htmlFor="imageUrl" className="text-lg font-light text-muted-foreground flex items-center">
                        <FiLink className="mr-2 text-blue-500" /> Image URL
                      </Label>
                      <div className="flex">
                        <Input
                          id="imageUrl"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={handleImageUrlChange}
                          className="flex-grow mr-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        <Button 
                          onClick={handleImageUrlSubmit} 
                          type="button"
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                        >
                          Add Image
                        </Button>
                      </div>
                    </div>
                    
                    {product.image && (
                      <Button
                        onClick={removeBackground}
                        disabled={isRemovingBg}
                        className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                      >
                        {isRemovingBg ? 'Removing Background...' : 'Remove Background'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
                <Card className="transition-shadow duration-300 sticky top-4">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-md">
                    <CardTitle className="text-2xl font-semibold text-white">Review and Submit</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                      <h4 className="font-semibold mb-4 text-xl text-gray-800">Product Summary</h4>
                      {product.image && (
                        <img 
                          src={URL.createObjectURL(product.image)} 
                          alt="Product preview" 
                          className="mx-auto max-h-48 rounded-lg shadow-md mb-6"
                        />
                      )}
                      <div className="space-y-2 text-sm">
                        <p><strong className="text-gray-700">Name:</strong> {product.name}</p>
                        <p><strong className="text-gray-700">Category:</strong> {product.category}</p>
                        <p><strong className="text-gray-700">Price:</strong> ${parseFloat(product.price).toFixed(2)}</p>
                        <p><strong className="text-gray-700">Discounted Price:</strong> ${(parseFloat(product.price) * (1 - parseFloat(product.discount) / 100)).toFixed(2)}</p>
                        <p><strong className="text-gray-700">Quantity:</strong> {product.quantity}</p>
                        <p><strong className="text-gray-700">Discount:</strong> {product.discount}%</p>
                        <div>
                          <strong className="text-gray-700">Description:</strong>
                          <div className="mt-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.description }} />
                        </div>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105" 
                      disabled={loading}
                    >
                      {loading ? 'Adding Product...' : 'Add Product'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AddProduct;