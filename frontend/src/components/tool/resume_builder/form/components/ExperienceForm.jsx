import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { generateExperience } from '../../hook/Exp';


export default function ExperienceForm({ experience, onChange }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(null);

  const handleInputChange = useCallback((e, index, field) => {
    const updatedExperience = [...experience];
    updatedExperience[index][field] = e.target.value;
    onChange(updatedExperience);
  }, [experience, onChange]);

  const addExperience = useCallback(() => {
    onChange([...experience, { 
      company: '', 
      position: '', 
      startDate: '', 
      endDate: '', 
      description: '' 
    }]);
  }, [experience, onChange]);

  const removeExperience = useCallback((index) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    onChange(updatedExperience);
  }, [experience, onChange]);

  const generateContent = useCallback(async (index) => {
    setIsGenerating(true);
    setError(null);
    setActiveExperienceIndex(index);
    try {
      const content = await generateWorkExperienceDescription(experience[index]);
      setGeneratedContent(content);
    } catch (err) {
      console.error("Error generating content:", err);
      setError("Failed to generate description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [experience]);

  const handleAIUpdate = useCallback((aiGeneratedContent, index) => {
    const updatedExperience = [...experience];
    updatedExperience[index].description = aiGeneratedContent;
    onChange(updatedExperience);
    setGeneratedContent(null);
  }, [experience, onChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {experience.map((exp, index) => (
            <AccordionItem value={`experience-${index}`} key={index}>
              <AccordionTrigger>{exp.company || `Experience ${index + 1}`}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleInputChange(e, index, 'company')}
                  />
                  <Input
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) => handleInputChange(e, index, 'position')}
                  />
                  <Input
                    placeholder="Start Date"
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleInputChange(e, index, 'startDate')}
                  />
                  <Input
                    placeholder="End Date"
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleInputChange(e, index, 'endDate')}
                  />
                  <Textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => handleInputChange(e, index, 'description')}
                  />
                  <Button type="button" onClick={() => generateContent(index)} disabled={isGenerating}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Description
                  </Button>
                  {isGenerating && index === activeExperienceIndex && (
                    <p className="text-blue-500 text-sm">Generating description...</p>
                  )}
                  {generatedContent && index === activeExperienceIndex && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                      <h4 className="text-sm font-semibold mb-2">AI-Generated Suggestion:</h4>
                      <p className="text-sm italic">{generatedContent}</p>
                      <div className="flex space-x-2 mt-3">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAIUpdate(generatedContent, index)}
                        >
                          Use This Description
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateContent(index)}
                          disabled={isGenerating}
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  )}
                  <Button type="button" variant="destructive" onClick={() => removeExperience(index)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button type="button" onClick={addExperience}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </CardContent>
    </Card>
  );
}
