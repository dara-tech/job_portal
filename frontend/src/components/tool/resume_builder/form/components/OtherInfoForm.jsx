import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2 } from 'lucide-react'

export default function OtherInfoForm({ certifications, languages, onCertificationsChange, onLanguagesChange }) {
  const handleCertificationChange = (e, index, subfield) => {
    const { value } = e.target;
    const updatedCertifications = [...certifications];
    updatedCertifications[index][subfield] = value;
    onCertificationsChange(updatedCertifications);
  };

  const handleLanguageChange = (e, index, subfield) => {
    const { value } = e.target;
    const updatedLanguages = [...languages];
    updatedLanguages[index][subfield] = value;
    onLanguagesChange(updatedLanguages);
  };

  const addCertification = () => {
    onCertificationsChange([...certifications, { name: '', issuer: '', date: '' }]);
  };

  const addLanguage = () => {
    onLanguagesChange([...languages, { language: '', proficiency: '' }]);
  };

  const removeCertification = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    onCertificationsChange(updatedCertifications);
  };

  const removeLanguage = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    onLanguagesChange(updatedLanguages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications and Languages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="certifications">
            <AccordionTrigger>Certifications</AccordionTrigger>
            <AccordionContent>
              {certifications.map((cert, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <Input
                    placeholder="Certification Name"
                    value={cert.name}
                    onChange={(e) => handleCertificationChange(e, index, 'name')}
                  />
                  <Input
                    placeholder="Issuer"
                    value={cert.issuer}
                    onChange={(e) => handleCertificationChange(e, index, 'issuer')}
                  />
                  <Input
                    placeholder="Date"
                    type="date"
                    value={cert.date ? new Date(cert.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleCertificationChange(e, index, 'date')}
                  />
                  <Button type="button" variant="destructive" onClick={() => removeCertification(index)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addCertification}>
                <Plus className="mr-2 h-4 w-4" />
                Add Certification
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="languages">
            <AccordionTrigger>Languages</AccordionTrigger>
            <AccordionContent>
              {languages.map((lang, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <Input
                    placeholder="Language"
                    value={lang.language}
                    onChange={(e) => handleLanguageChange(e, index, 'language')}
                  />
                  <Input
                    placeholder="Proficiency"
                    value={lang.proficiency}
                    onChange={(e) => handleLanguageChange(e, index, 'proficiency')}
                  />
                  <Button type="button" variant="destructive" onClick={() => removeLanguage(index)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addLanguage}>
                <Plus className="mr-2 h-4 w-4" />
                Add Language
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}