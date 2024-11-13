import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { PRODUCT_API_ENDPOINT } from "../../../utils/constant";
import { motion } from "framer-motion";
import { FiPackage, FiX, FiDollarSign, FiImage, FiUploadCloud, FiLink } from "react-icons/fi";
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Separator } from "@/components/ui/separator";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    image: null,
    discount: "",
  });
  const [loading, setLoading] = useState(false);
  const [salePrice, setSalePrice] = useState(0);
  const [errors, setErrors] = useState({});
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${PRODUCT_API_ENDPOINT}/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const { data } = await response.json();
      setProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        quantity: data.quantity,
        image: data.image,
        discount: data.discount,
      });
      calculateSalePrice(data.price, data.discount);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));
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

  const removeBackground = async () => {
    if (!product.image) {
      toast.error("No image to remove background from");
      return;
    }

    setIsRemovingBg(true);
    const formData = new FormData();

    try {
      let imageBlob;
      if (product.image instanceof File) {
        imageBlob = product.image;
      } else {
        const response = await fetch(product.image);
        imageBlob = await response.blob();
      }

      formData.append('image_file', imageBlob, 'image.jpg');
      formData.append('size', 'auto');

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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    for (const key in product) {
      if (key === 'image' && product[key] instanceof File) {
        formData.append(key, product[key]);
      } else {
        formData.append(key, product[key]);
      }
    }

    try {
      const response = await fetch(`${PRODUCT_API_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      console.log('Updated product:', updatedProduct);

      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
const handleDescriptionChange = (content) => {
    setProduct(prev => ({ ...prev, description: content }));
    setErrors(prev => ({ ...prev, description: "" }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl font-bold flex items-center text-gray-800">
            <FiPackage className="mr-2" /> Update Product
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Main content (left and center columns) */}
              <div className="md:col-span-1 space-y-8">
                {/* Basic Information */}
                <Card className="shadow-sm">
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="text-xl font-semibold text-gray-700">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-lg">Product Name</Label>
                      <Input id="name" name="name" value={product.name} onChange={handleChange} required 
                             className="border-2 border-slate-200 focus:border-slate-500 transition-colors" />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={product.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger id="category">
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
                      <Label htmlFor="description" className="text-lg">Description</Label>
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
                        className="bg-white"
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing and Inventory */}
                <Card className="shadow-sm">
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="text-xl font-semibold text-gray-700">Pricing and Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-lg flex items-center">
                        <FiDollarSign className="mr-2" /> Price
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={handleChange}
                        required 
                        className="border-2 border-gray-200 focus:border-gray-400 transition-colors"
                      />
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input
                        id="discount"
                        name="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={product.discount}
                        onChange={handleChange}
                      />
                      {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
                    </div>
                    {salePrice > 0 && (
                      <div className="mt-4 p-3 bg-green-100 rounded-md">
                        <p className="text-green-800 font-semibold">
                          Sale Price: ${salePrice}
                        </p>
                        <p className="text-sm text-green-600">
                          You save: ${(product.price - salePrice).toFixed(2)} ({product.discount}% off)
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" name="quantity" type="number" value={product.quantity} onChange={handleChange} required />
                      {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Review and Submit (right column) */}
              <div className="space-y-6">
                {/* Image Upload */}
                <Card className="shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-md">
                    <CardTitle className="text-xl font-semibold text-white flex items-center">
                      <FiImage className="mr-2" /> Product Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
                      isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}>
                      <input {...getInputProps()} />
                      {product.image ? (
                        <div className="relative">
                          <img 
                            src={product.image instanceof File ? URL.createObjectURL(product.image) : product.image} 
                            alt="Product preview" 
                            className="mx-auto max-h-48 rounded-lg shadow-md"
                          />
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
                <Card className="shadow-sm sticky top-4">
                  <CardHeader>
                    <CardTitle>Review and Submit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
                      <h4 className="font-medium mb-2 text-lg text-gray-700">Product Summary</h4>
                      {product.image && (
                        <img 
                          src={product.image instanceof File ? URL.createObjectURL(product.image) : product.image} 
                          alt="Product preview" 
                          className="mx-auto max-h-48 rounded-lg mb-4"
                        />
                      )}
                      <p><strong>Name:</strong> {product.name}</p>
                      <p><strong>Category:</strong> {product.category}</p>
                      <p><strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}</p>
                      <p><strong>Discounted Price:</strong> ${(parseFloat(product.price) * (1 - parseFloat(product.discount) / 100)).toFixed(2)}</p>
                      <p><strong>Quantity:</strong> {product.quantity}</p>
                      <p><strong>Discount:</strong> {product.discount}%</p>
                      <p><strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: product.description }} /></p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Product'}
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

export default UpdateProduct;
