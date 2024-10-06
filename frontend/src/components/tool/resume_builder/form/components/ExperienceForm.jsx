"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2, Wand2 } from 'lucide-react'
import useAIResumeAssistant from '../../hook/Aigen'
import { toast } from "sonner"

// Helper function to strip HTML tags
const stripHtmlTags = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default function ExperienceForm({ experience, onChange }) {
  const handleInputChange = (e, index, subfield) => {
    const { value } = e.target
    const updatedExperience = [...experience]
    if (subfield === 'responsibilities') {
      updatedExperience[index][subfield] = value.split('\n')
    } else {
      updatedExperience[index][subfield] = value
    }
    onChange(updatedExperience)
  }

  const addExperience = () => {
    onChange([...experience, { company: '', position: '', startDate: '', endDate: '', responsibilities: [] }])
  }

  const removeExperience = (index) => {
    const updatedExperience = experience.filter((_, i) => i !== index)
    onChange(updatedExperience)
  }

  const handleAIUpdate = (aiGeneratedContent) => {
    if (aiGeneratedContent && aiGeneratedContent.experience) {
      const responsibilities = stripHtmlTags(aiGeneratedContent.experience).split('\n').filter(item => item.trim() !== '');

      const updatedExperience = experience.map(exp => ({
        ...exp,
        responsibilities: responsibilities
      }))
      onChange(updatedExperience)
      toast.success("Experience content updated with AI suggestions")
    }
  }

  const {
    isGenerating,
    error,
    generatedContent,
    generateContent
  } = useAIResumeAssistant({ experience }, handleAIUpdate, { experience: '' })

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Work Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          {experience.map((exp, index) => (
            <AccordionItem value={`experience-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold">
                {exp.company || `Experience ${index + 1}`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleInputChange(e, index, 'company')}
                    className="w-full"
                  />
                  <Input
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) => handleInputChange(e, index, 'position')}
                    className="w-full"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Start Date"
                      type="date"
                      value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange(e, index, 'startDate')}
                      className="w-full"
                    />
                    <Input
                      placeholder="End Date"
                      type="date"
                      value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange(e, index, 'endDate')}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <Textarea
                        placeholder="Responsibilities (one per line)"
                        value={Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : ''}
                        onChange={(e) => handleInputChange(e, index, 'responsibilities')}
                        className="w-full pr-10 min-h-[150px]"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        title="Generate with AI"
                        onClick={() => generateContent()}
                        disabled={isGenerating}
                        className="absolute right-2 top-2"
                      >
                        <Wand2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {isGenerating && <p className="text-blue-500 text-sm">Generating responsibilities...</p>}
                    {generatedContent && generatedContent.experience && (
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                        <h4 className="text-sm font-semibold mb-2">AI-Generated Suggestion:</h4>
                        <p className="text-sm italic">{stripHtmlTags(generatedContent.experience)}</p>
                        <div className="flex space-x-2 mt-3">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleInputChange({ target: { value: stripHtmlTags(generatedContent.experience) } }, index, 'responsibilities')}
                          >
                            Use These Responsibilities
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => generateContent()}
                            disabled={isGenerating}
                          >
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button type="button" variant="destructive" onClick={() => removeExperience(index)} className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Experience
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button type="button" onClick={addExperience} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add New Experience
        </Button>
      </CardContent>
    </Card>
  )
}