import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { generateProfessionalSummary } from '../../hook/ProfessionalSummary';

// Helper function to strip HTML tags
const stripHtmlTags = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default function BasicInfoForm({ resume, onChange }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleInputChange = useCallback((e, field, subfield) => {
    const { value } = e.target;
    if (subfield) {
      onChange('personalInfo', { ...resume.personalInfo, [subfield]: value });
    } else if (field === 'summary') {
      onChange(field, stripHtmlTags(value));
    } else {
      onChange(field, value);
    }
  }, [resume.personalInfo, onChange]);

  const handleAIUpdate = useCallback((aiGeneratedContent) => {
    onChange('summary', aiGeneratedContent);
  }, [onChange]);

  const generateContent = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const content = await generateProfessionalSummary(resume, 0.5);
      setGeneratedContent(content);
    } catch (err) {
      console.error("Error generating content:", err);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [resume]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Resume Title</Label>
          <Input
            id="title"
            name="title"
            value={resume.title}
            onChange={(e) => handleInputChange(e, 'title')}
            required
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={resume.personalInfo.name}
            onChange={(e) => handleInputChange(e, 'personalInfo', 'name')}
            required
            placeholder="John Doe"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={resume.personalInfo.email}
              onChange={(e) => handleInputChange(e, 'personalInfo', 'email')}
              required
              placeholder="johndoe@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={resume.personalInfo.phone}
              onChange={(e) => handleInputChange(e, 'personalInfo', 'phone')}
              required
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={resume.personalInfo.address}
            onChange={(e) => handleInputChange(e, 'personalInfo', 'address')}
            placeholder="123 Main St, City, State, ZIP"
          />
        </div>
        <div className="space-y-4">
          <Label htmlFor="summary" className="text-lg font-semibold">Professional Summary</Label>
          <div className="flex flex-col space-y-3">
            <div className="flex items-start space-x-2">
              <div className="flex-grow relative">
                <Textarea
                  id="summary"
                  name="summary"
                  value={stripHtmlTags(resume.summary)}
                  onChange={(e) => handleInputChange(e, 'summary')}
                  rows={6}
                  className="w-full pr-10 resize-y min-h-[150px]"
                  placeholder="Write a compelling summary of your professional experience, key skills, and career objectives (3-5 sentences)"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  title="Generate with AI"
                  onClick={generateContent}
                  disabled={isGenerating}
                  className="absolute right-2 top-2"
                  aria-label="Generate summary with AI"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
            {isGenerating && <p className="text-blue-500 text-sm">Generating summary...</p>}
            {generatedContent && (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <h4 className="text-sm font-semibold mb-2">AI-Generated Suggestion:</h4>
                <p className="text-sm italic">{stripHtmlTags(generatedContent)}</p>
                <div className="flex space-x-2 mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAIUpdate(generatedContent)}
                  >
                    Use This Summary
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateContent}
                    disabled={isGenerating}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{`Word count: ${stripHtmlTags(resume.summary).split(/\s+/).filter(Boolean).length}`}</span>
            <span>Recommended: 50-100 words</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}