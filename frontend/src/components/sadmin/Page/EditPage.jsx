import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PAGE_API_ENDPOINT } from '../../../utils/constant';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Edit, Image, Settings, Eye } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Sidebar from './components/Sidebar';
import Appearance from './components/Appearance';

const EditPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState({
    title: '',
    color: 'linear-gradient(0deg, #000000, #000000)',
    fontSize: 16,
    fontFamily: 'sans-serif',
    content: '',
    slug: '',
    isPublished: false,
    metaDescription: '',
    featuredImage: '',
    backgroundImage: '',
    layoutType: 'full-width',
    sidebarPosition: 'right',
    sidebarContent: '',
    sections: [],
  });
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`${PAGE_API_ENDPOINT}/pages/${slug}`, { withCredentials: true });
        const fetchedPage = response.data.page;
        setPage({
          ...fetchedPage,
          sections: fetchedPage.sections || [],
        });
      } catch (error) {
        console.error('Error fetching page:', error);
        toast.error('Failed to fetch page');
      }
    };

    fetchPage();
  }, [slug]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { lastModified, ...pageWithoutLastModified } = page;
      const response = await axios.put(`${PAGE_API_ENDPOINT}/pages/${slug}`, pageWithoutLastModified, { withCredentials: true });
      if (response.data.success) {
        toast.success('Page updated successfully');
        navigate('/admin/page');
      } else {
        throw new Error(response.data.message || 'Failed to update page');
      }
    } catch (error) {
      console.error('Error updating page:', error);
      toast.error(`Failed to update page: ${error.message}`);
    }
  };

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Edit Page</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content"><Edit className="w-4 h-4 mr-2" />Content</TabsTrigger>
                  <TabsTrigger value="appearance"><Image className="w-4 h-4 mr-2" />Appearance</TabsTrigger>
                  <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" />Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
                    <Input id="title" name="title" value={page.title} onChange={handleInputChange} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="content" className="text-lg font-semibold">Content</Label>
                    <ReactQuill
                      theme="snow"
                      value={page.content}
                      onChange={handleContentChange}
                      className="mt-1"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="appearance" className="space-y-4 mt-4">
                  <Appearance page={page} setPage={setPage} />
                </TabsContent>
                <TabsContent value="settings" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="slug" className="text-lg font-semibold">Slug</Label>
                    <Input id="slug" name="slug" value={page.slug} onChange={handleInputChange} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="metaDescription" className="text-lg font-semibold">Meta Description</Label>
                    <Textarea id="metaDescription" name="metaDescription" value={page.metaDescription} onChange={handleInputChange} className="mt-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isPublished" checked={page.isPublished} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="isPublished" className="text-lg font-semibold">Published</Label>
                  </div>
                </TabsContent>
              </Tabs>
              <Separator />
              <div className="flex justify-between">
                <Button type="button" onClick={togglePreview} className="px-6 py-2">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
                <Button type="submit" className="px-6 py-2">Update Page</Button>
              </div>
            </form>
            {previewVisible && (
              <div className="mt-4 p-4 border rounded-md" style={{ backgroundImage: `url(${page.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className={`${page.layoutType === 'boxed' ? 'max-w-4xl mx-auto' : ''}`}>
                  <h1 className="font-bold mb-4" style={{ background: page.color, fontSize: `${page.fontSize || 16}px`, fontFamily: page.fontFamily || 'sans-serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {page.title || 'Page Title'}
                  </h1>
                  <div className={`flex ${page.layoutType === 'with-sidebar' ? (page.sidebarPosition === 'left' ? 'flex-row-reverse' : 'flex-row') : ''}`}>
                    {page.layoutType === 'with-sidebar' && (
                      <div className={`w-1/4 ${page.sidebarPosition === 'left' ? 'pl-4' : 'pr-4'} border-${page.sidebarPosition === 'left' ? 'l' : 'r'}`}>
                        <div dangerouslySetInnerHTML={{ __html: page.sidebarContent || '' }} />
                      </div>
                    )}
                    <div className={page.layoutType === 'with-sidebar' ? "w-3/4" : "w-full"}>
                      {page.featuredImage && (
                        <img src={page.featuredImage} alt="Featured" className="w-full h-64 object-cover mb-4 rounded-lg" />
                      )}
                      <div dangerouslySetInnerHTML={{ __html: page.content }} />
                      {page.sections.map((section, index) => (
                        <div key={index} className={`mb-4 text-${section.align}`}>
                          {section.type === 'text' && <p>{section.content}</p>}
                          {section.type === 'image' && <img src={section.content} alt={`Section ${index + 1}`} className="max-w-full h-auto" />}
                          {section.type === 'video' && (
                            <video controls className="w-full">
                              <source src={section.content} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPage;