import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PAGE_API_ENDPOINT } from '@/utils/constant';
import { Loader2, Save, ArrowLeft, FileText, Link as LinkIcon, Type } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import GradientPicker from './components/GredientPicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CreatePage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState({
    title: '',
    slug: '',
    content: '',
    isPublished: false,
    color: 'linear-gradient(0deg, #000000, #000000)',
    fontSize: 16,
    metaDescription: '',
    featuredImage: '',
    components: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPage(prevPage => ({ ...prevPage, [name]: value }));
  };

  const handleContentChange = (content) => {
    setPage(prevPage => ({ ...prevPage, content }));
  };

  const handleSwitchChange = () => {
    setPage(prevPage => ({ ...prevPage, isPublished: !prevPage.isPublished }));
  };

  const handleGradientChange = (gradientValue) => {
    setPage(prevPage => ({ ...prevPage, color: gradientValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${PAGE_API_ENDPOINT}/pages`, page, { withCredentials: true });
      toast.success('Page created successfully');
      navigate('/admin/page');
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('Failed to create page');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addComponent = () => {
    setPage(prevPage => ({
      ...prevPage,
      components: [...prevPage.components, { type: '', content: '' }]
    }));
  };

  const updateComponent = (index, field, value) => {
    setPage(prevPage => {
      const updatedComponents = [...prevPage.components];
      updatedComponents[index][field] = value;
      return { ...prevPage, components: updatedComponents };
    });
  };

  const removeComponent = (index) => {
    setPage(prevPage => ({
      ...prevPage,
      components: prevPage.components.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 max-w-4xl"
    >
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/page')}
        className="mb-8 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
      </Button>
      <Card className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Create New Page</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">Craft a new page for your website with ease and precision.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-lg font-medium flex items-center">
                    <Type className="mr-2 h-5 w-5 text-gray-500" />
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={page.title}
                    onChange={handleInputChange}
                    required
                    className="text-lg bg-transparent border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Enter page title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-lg font-medium flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-gray-500" />
                    Content
                  </Label>
                  <ReactQuill
                    theme="snow"
                    value={page.content}
                    onChange={handleContentChange}
                    className="mt-1"
                  />
                </div>
              </TabsContent>
              <TabsContent value="appearance" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-lg font-medium flex items-center">
                    Title Color Gradient
                  </Label>
                  <GradientPicker value={page.color} onChange={handleGradientChange} className="mt-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontSize" className="text-lg font-medium flex items-center">
                    Title Font Size
                  </Label>
                  <Input
                    id="fontSize"
                    name="fontSize"
                    type="number"
                    value={page.fontSize}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featuredImage" className="text-lg font-medium flex items-center">
                    Featured Image URL
                  </Label>
                  <Input
                    id="featuredImage"
                    name="featuredImage"
                    value={page.featuredImage}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Enter featured image URL"
                  />
                </div>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-lg font-medium flex items-center">
                    <LinkIcon className="mr-2 h-5 w-5 text-gray-500" />
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={page.slug}
                    onChange={handleInputChange}
                    required
                    className="text-lg bg-transparent border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Enter page slug"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription" className="text-lg font-medium flex items-center">
                    Meta Description
                  </Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={page.metaDescription}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Enter meta description"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="isPublished"
                    checked={page.isPublished}
                    onCheckedChange={handleSwitchChange}
                    className="data-[state=checked]:bg-purple-500"
                  />
                  <Label htmlFor="isPublished" className="text-lg font-medium cursor-pointer">Publish page</Label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <Label className="text-lg font-medium flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-gray-500" />
                Components
              </Label>
              {page.components.map((component, index) => (
                <div key={index} className="space-y-2 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <Select
                    value={component.type}
                    onValueChange={(value) => updateComponent(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select component type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={component.content}
                    onChange={(e) => updateComponent(index, 'content', e.target.value)}
                    placeholder="Component content"
                    className="mt-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeComponent(index)}
                    className="mt-2"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addComponent} className="w-full">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Component
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full text-lg h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Create Page
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreatePage;