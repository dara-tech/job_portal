import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { layouts } from './theme';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { RESUME_API_ENDPOINT } from '@/utils/constant';

export default function PreviewForm({ resume, onThemeChange }) {
  const [selectedTheme, setSelectedTheme] = useState('Classic');
  const { id } = useParams();

  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(selectedTheme);
    }
  }, [selectedTheme, onThemeChange]);

  const handleThemeChange = (value) => {
    setSelectedTheme(value);
  };

  const SelectedLayout = layouts.find(layout => layout.name === selectedTheme)?.component;

  // Check if resume and its properties are defined
  const isResumeValid = resume && resume.personalInfo;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resume Preview</h2>
        <Select onValueChange={handleThemeChange} defaultValue={selectedTheme}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            {layouts.map((layout) => (
              <SelectItem key={layout.name} value={layout.name}>
                {layout.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card className="overflow-hidden border-none">
        <CardContent className="p-0">
          {SelectedLayout && isResumeValid ? (
            <SelectedLayout resume={resume} />
          ) : (
            <div className="p-4">
              <p>{isResumeValid ? "Selected theme not found." : "Resume data is incomplete or invalid."}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}