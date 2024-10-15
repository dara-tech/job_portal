import React, { useState, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import { BLOG_API_ENDPOINT } from '../../../../utils/constant'
import { generateBlogPost } from '../hook/Aicontent'
import { Loader2, Image as ImageIcon, Tag, FileText, Send, X, PlusCircle, Search, ChevronDown } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import UnsplashModal from './UnsplashModal'
import PixabayModal from './Pixaby'
import AiTitleSuggestion from './AiTitleSuggestion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"

export default function BlogCreate() {
  const [activeTab, setActiveTab] = useState('upload')
  const [isUnsplashModalOpen, setIsUnsplashModalOpen] = useState(false)
  const [isPixabayModalOpen, setIsPixabayModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [picture, setPicture] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [crop, setCrop] = useState({ aspect: 16 / 9 })
  const [croppedImageUrl, setCroppedImageUrl] = useState(null)
  const [isAiEnabled, setIsAiEnabled] = useState(false)
  const imageRef = useRef(null)
  const navigate = useNavigate()

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should not exceed 5MB')
      return
    }
    setPicture(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('tags', tags.join(','))

      if (croppedImageUrl) {
        const response = await fetch(croppedImageUrl)
        const blob = await response.blob()
        formData.append('picture', blob, 'cropped-image.jpg')
      } else if (picture) {
        formData.append('picture', picture)
      }

      const response = await axios.post(BLOG_API_ENDPOINT, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        toast.success('Blog post created successfully')
        navigate('/admin/bloglist')
      } else {
        toast.error('Failed to create blog post')
      }
    } catch (error) {
      console.error('Error creating blog post:', error)
      toast.error(error.response?.data?.message || 'An error occurred while creating the blog post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerateContent = async () => {
    if (!title || tags.length === 0) {
      toast.error('Please enter a title and at least one tag before generating content')
      return
    }
    setIsGenerating(true)
    try {
      const generatedContent = await generateBlogPost(title, tags)
      setContent(generatedContent)
      toast.success('Content generated successfully')
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
        setTagInput('')
      } else {
        toast.error('This tag already exists')
      }
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSelectImage = async (image, source) => {
    try {
      let imageUrl;
      if (source === 'unsplash') {
        imageUrl = image.urls.full;
      } else if (source === 'pixabay') {
        imageUrl = image.largeImageURL;
      }
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], `${source}-image.jpg`, { type: 'image/jpeg' })
      setPicture(file)
      setCroppedImageUrl(null)
      toast.success(`${source.charAt(0).toUpperCase() + source.slice(1)} image selected successfully`)
    } catch (error) {
      console.error(`Error selecting ${source} image:`, error)
      toast.error(`Failed to select ${source} image`)
    }
  }

  const onImageLoaded = (image) => {
    imageRef.current = image
  }

  const onCropComplete = (crop) => {
    makeClientCrop(crop)
  }

  const makeClientCrop = async (crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        'cropped-image.jpeg'
      )
      setCroppedImageUrl(croppedImageUrl)
    }
  }

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty')
          return
        }
        blob.name = fileName
        const croppedImageUrl = window.URL.createObjectURL(blob)
        resolve(croppedImageUrl)
      }, 'image/jpeg')
    })
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 dark:bg-gray-950">
      <div className="flex-1 p-8 overflow-auto">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-700 text-white dark:bg-gradient-to-r dark:from-blue-900 dark:to-slate-950 rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Create New Blog Post</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="title-tags">
                  <AccordionTrigger className="text-xl font-semibold">Title and Tags</AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          placeholder="Enter blog title"
                          className="text-lg py-3 flex-grow"
                        />

                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags" className="text-lg font-semibold">Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag, index) => (
                          <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-primary hover:text-primary/80 focus:outline-none"
                              aria-label={`Remove tag ${tag}`}
                            >
                              <X size={16} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between ">
                        <div className="flex items-center space-x-2 w-full">
                          <Tag className="text-gray-500" />
                          <Input
                          id="tags"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder="Type a tag and press Enter"
                          className="flex-1 "
                        />
                      </div>
                      
                    </div>
                    <div >
                      <AiTitleSuggestion tags={tags} setTitle={setTitle} />
                    </div>
                    
                  </div>
                     
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cover-image">
                  <AccordionTrigger className="text-xl font-semibold">Cover Image</AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
                        <TabsTrigger value="pixabay">Pixabay</TabsTrigger>
                      </TabsList>
                      <TabsContent value="upload">
                        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                          <input {...getInputProps()} />
                          {isDragActive ? (
                            <p className="text-primary">Drop the image here ...</p>
                          ) : (
                            <p>Drag 'n' drop an image here, or click to select one</p>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="unsplash">
                        <Button type="button" onClick={() => setIsUnsplashModalOpen(true)} className="w-full">
                          <Search className="mr-2 h-4 w-4" />
                          Search Unsplash
                        </Button>
                      </TabsContent>
                      <TabsContent value="pixabay">
                        <Button type="button" onClick={() => setIsPixabayModalOpen(true)} className="w-full">
                          <Search className="mr-2 h-4 w-4" />
                          Search Pixabay
                        </Button>
                      </TabsContent>
                    </Tabs>
                    {picture && (
                      <ReactCrop
                        src={URL.createObjectURL(picture)}
                        onImageLoaded={onImageLoaded}
                        crop={crop}
                        onChange={(newCrop) => setCrop(newCrop)}
                        onComplete={onCropComplete}
                        className="max-w-full h-auto"
                      />
                    )}
                    {croppedImageUrl && (
                      <img src={croppedImageUrl} alt="Cropped" className="mt-4 max-w-full h-auto rounded-lg shadow-md" />
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="content">
                  <AccordionTrigger className="text-xl font-semibold">Content</AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <Label htmlFor="ai-toggle" className="text-lg font-semibold">AI Assistance</Label>
                      <Switch
                        id="ai-toggle"
                        checked={isAiEnabled}
                        onCheckedChange={setIsAiEnabled}
                      />
                    </div>
                    {isAiEnabled && (
                      <Button
                        type="button"
                        onClick={handleGenerateContent}
                        disabled={isGenerating}
                        className="w-full py-6 text-lg font-semibold mb-4"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Content
                          </>
                        )}
                      </Button>
                    )}
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      formats={formats}
                      placeholder="Write your blog content here"
                      className="rounded-md bg-white dark:bg-gray-950 dark:text-white "
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-lg font-semibold mt-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Create Blog Post
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1 p-8 overflow-auto">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">          <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-700 text-white dark:bg-gradient-to-r dark:from-blue-900 dark:to-slate-950 rounded-t-lg">            <CardTitle className="text-3xl font-bold">Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="desktop" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
              </TabsList>
              <TabsContent value="desktop">
                <ScrollArea className="h-[800px] w-full rounded-md border dark:border-gray-700 p-4 bg-white dark:bg-gray-950">
                  <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">{title || 'Your Blog Title'}</h1>
                    {croppedImageUrl ? (
                      <img
                        src={croppedImageUrl}
                        alt="Blog cover"
                        className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
                      />
                    ) : picture && (
                      <img
                        src={URL.createObjectURL(picture)}
                        alt="Blog cover"
                        className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
                      />
                    )}
                    <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
                    {tags.length > 0 && (
                      <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-2">Tags:</h2>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="mobile">
                <div className="w-[375px] h-[667px] mx-auto border dark:border-gray-700 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-950">
                  <ScrollArea className="h-full w-full p-4">
                    <div className="max-w-[343px] mx-auto">
                      <h1 className="text-2xl font-bold mb-4">{title || 'Your Blog Title'}</h1>
                      {croppedImageUrl ? (
                        <img
                          src={croppedImageUrl}
                          alt="Blog cover"
                          className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
                        />
                      ) : picture && (
                        <img
                          src={URL.createObjectURL(picture)}
                          alt="Blog cover"
                          className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
                        />
                      )}
                      <div className="prose max-w-none text-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
                      {tags.length > 0 && (
                        <div className="mt-6">
                          <h2 className="text-lg font-semibold mb-2">Tags:</h2>
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                              <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <UnsplashModal
        isOpen={isUnsplashModalOpen}
        onClose={() => setIsUnsplashModalOpen(false)}
        onSelectImage={(image) => handleSelectImage(image, 'unsplash')}
      />
      <PixabayModal
        isOpen={isPixabayModalOpen}
        onClose={() => setIsPixabayModalOpen(false)}
        onSelectImage={(image) => handleSelectImage(image, 'pixabay')}
      />
    </div>
  )
}