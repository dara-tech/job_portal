import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Eye, Layout, Type, Image, Grid, Columns, Box, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import GradientPicker from './GredientPicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Appearance = ({ page, setPage }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [sections, setSections] = useState(page.sections || []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPage(prevPage => ({ ...prevPage, [name]: value }));
  };

  const handleGradientChange = (gradientValue) => {
    setPage(prevPage => ({ ...prevPage, color: gradientValue }));
  };

  const handleFontSizeChange = (value) => {
    setPage(prevPage => ({ ...prevPage, fontSize: value[0] }));
  };

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  const updateSection = (index, field, value) => {
    const newSections = sections.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    );
    setSections(newSections);
    setPage(prevPage => ({ ...prevPage, sections: newSections }));
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    setPage(prevPage => ({ ...prevPage, sections: newSections }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
    setPage(prevPage => ({ ...prevPage, sections: items }));
  };

  useEffect(() => {
    setSections(page.sections || []);
  }, [page.sections]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Advanced Page Builder</span>
          <Button onClick={togglePreview} variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            {previewVisible ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="layout">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout"><Layout className="mr-2 h-4 w-4" /> Layout</TabsTrigger>
            <TabsTrigger value="typography"><Type className="mr-2 h-4 w-4" /> Typography</TabsTrigger>
            <TabsTrigger value="media"><Image className="mr-2 h-4 w-4" /> Media</TabsTrigger> 
          </TabsList>
          <TabsContent value="layout">
            <div className="space-y-4">
              <div>
                <Label htmlFor="layout-type">Layout Type</Label>
                <Select
                  onValueChange={(value) => setPage(prevPage => ({ ...prevPage, layoutType: value }))}
                  defaultValue={page.layoutType || 'full-width'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-width">Full Width</SelectItem>
                    <SelectItem value="boxed">Boxed</SelectItem>
                    <SelectItem value="with-sidebar">With Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {page.layoutType === 'with-sidebar' && (
                <>
                  <div>
                    <Label htmlFor="sidebar-position">Sidebar Position</Label>
                    <Select
                      onValueChange={(value) => setPage(prevPage => ({ ...prevPage, sidebarPosition: value }))}
                      defaultValue={page.sidebarPosition || 'right'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sidebar position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sidebar-content">Sidebar Content</Label>
                    <Input
                      id="sidebar-content"
                      name="sidebarContent"
                      value={page.sidebarContent || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="typography">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title-color">Title Color</Label>
                <GradientPicker value={page.color} onChange={handleGradientChange} />
              </div>
              <div>
                <Label htmlFor="font-size">Font Size</Label>
                <Slider
                  id="font-size"
                  min={12}
                  max={48}
                  step={1}
                  value={[page.fontSize || 16]}
                  onValueChange={handleFontSizeChange}
                />
                <span>{page.fontSize || 16}px</span>
              </div>
              <div>
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                  onValueChange={(value) => setPage(prevPage => ({ ...prevPage, fontFamily: value }))}
                  defaultValue={page.fontFamily || 'sans-serif'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans-serif">Sans-serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="media">
            <div className="space-y-4">
              <div>
                <Label htmlFor="featured-image">Featured Image URL</Label>
                <Input
                  id="featured-image"
                  name="featuredImage"
                  value={page.featuredImage || ''}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <Label htmlFor="background-image">Background Image URL</Label>
                <Input
                  id="background-image"
                  name="backgroundImage"
                  value={page.backgroundImage || ''}
                  onChange={handleInputChange}
                  placeholder="Enter background image URL"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="sections">
            <div className="space-y-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {sections.map((section, index) => (
                        <Draggable key={index} draggableId={`section-${index}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4 p-4 border rounded-md"
                            >
                              <Select
                                onValueChange={(value) => updateSection(index, 'type', value)}
                                defaultValue={section.type}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select section type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="image">Image</SelectItem>
                                  <SelectItem value="video">Video</SelectItem>
                                </SelectContent>
                              </Select>
                              {section.type === 'text' && (
                                <Input
                                  value={section.content}
                                  onChange={(e) => updateSection(index, 'content', e.target.value)}
                                  placeholder="Enter text content"
                                  className="mt-2"
                                />
                              )}
                              {section.type === 'image' && (
                                <Input
                                  value={section.content}
                                  onChange={(e) => updateSection(index, 'content', e.target.value)}
                                  placeholder="Enter image URL"
                                  className="mt-2"
                                />
                              )}
                              {section.type === 'video' && (
                                <Input
                                  value={section.content}
                                  onChange={(e) => updateSection(index, 'content', e.target.value)}
                                  placeholder="Enter video URL"
                                  className="mt-2"
                                />
                              )}
                              <div className="mt-2 flex justify-between items-center">
                                <Select
                                  onValueChange={(value) => updateSection(index, 'align', value)}
                                  defaultValue={section.align}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Alignment" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="left"><AlignLeft className="mr-2 h-4 w-4" /> Left</SelectItem>
                                    <SelectItem value="center"><AlignCenter className="mr-2 h-4 w-4" /> Center</SelectItem>
                                    <SelectItem value="right"><AlignRight className="mr-2 h-4 w-4" /> Right</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button onClick={() => removeSection(index)} variant="destructive" size="sm">
                                  Remove
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </TabsContent>
        </Tabs>
        
      </CardContent>
    </Card>
  );
};

export default Appearance;
