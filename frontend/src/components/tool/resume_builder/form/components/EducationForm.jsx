import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2 } from 'lucide-react'

export default function EducationForm({ education, onChange }) {
  const handleInputChange = (e, index, subfield) => {
    const { value } = e.target;
    const updatedEducation = [...education];
    updatedEducation[index][subfield] = value;
    onChange(updatedEducation);
  };

  const addEducation = () => {
    onChange([...education, { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }]);
  };

  const removeEducation = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    onChange(updatedEducation);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {education.map((edu, index) => (
            <AccordionItem value={`education-${index}`} key={index}>
              <AccordionTrigger>{edu.institution || `Education ${index + 1}`}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleInputChange(e, index, 'institution')}
                  />
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleInputChange(e, index, 'degree')}
                  />
                  <Input
                    placeholder="Field of Study"
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleInputChange(e, index, 'fieldOfStudy')}
                  />
                  <Input
                    placeholder="Start Date"
                    type="date"
                    value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange(e, index, 'startDate')}
                  />
                  <Input
                    placeholder="End Date"
                    type="date"
                    value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange(e, index, 'endDate')}
                  />
                  <Button type="button" variant="destructive" onClick={() => removeEducation(index)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button type="button" onClick={addEducation}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </CardContent>
    </Card>
  );
}