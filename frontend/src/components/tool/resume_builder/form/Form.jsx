import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye, ChevronDown } from 'lucide-react'
import { RESUME_API_ENDPOINT } from "@/utils/constant";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BasicInfoForm from './components/BasicInfoForm';
import EducationForm from './components/EducationForm';
import ExperienceForm from './components/ExperienceForm';
import SkillsForm from './components/SkillsForm';
import ProjectsForm from './components/ProjectsForm';
import OtherInfoForm from './components/OtherInfoForm';
import { toast } from 'sonner';

export default function ResumeForm({ resumeId, onResumeChange }) {
  const navigate = useNavigate();
  const [resume, setResume] = useState({
    title: '',
    personalInfo: { name: '', email: '', phone: '', address: '' },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const [activeTab, setActiveTab] = useState('basic');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabs = [
    { value: 'basic', label: 'Basic' },
    { value: 'education', label: 'Education' },
    { value: 'experience', label: 'Experience' },
    { value: 'skills', label: 'Skills' },
    { value: 'projects', label: 'Projects' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    } else {
      setIsLoading(false);
    }
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`${RESUME_API_ENDPOINT}/${resumeId}`, { withCredentials: true });
      if (data?.resume) {
        setResume(data.resume);
        onResumeChange(data.resume);
      } else {
        toast.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      toast.error(error.response?.status === 404 ? "Resume not found" : "Failed to fetch resume");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setResume(prev => {
      const updated = { ...prev, [field]: value };
      onResumeChange(updated);
      return updated;
    });
  };

  const saveResume = async () => {
    setIsLoading(true);
    try {
      const method = resumeId ? 'put' : 'post';
      const url = resumeId ? `${RESUME_API_ENDPOINT}/${resumeId}` : RESUME_API_ENDPOINT;
      const { data } = await axios[method](url, resume, { withCredentials: true });
      
      if (data?.resume) {
        toast.success('Resume saved successfully!');
        navigate(`/resume/${data.resume._id}/view`);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error('Failed to save resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isSmallScreen ? (
          <div className="relative">
            <Button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full justify-between"
            >
              {tabs.find(tab => tab.value === activeTab)?.label}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                {tabs.map((tab) => (
                  <Button
                    key={tab.value}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.value);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <TabsList className="grid w-full grid-cols-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        
        <TabsContent value="basic">
          <BasicInfoForm resume={resume} onChange={handleChange} />
        </TabsContent>
        <TabsContent value="education">
          <EducationForm education={resume.education} onChange={(value) => handleChange('education', value)} />
        </TabsContent>
        <TabsContent value="experience">
          <ExperienceForm experience={resume.experience} onChange={(value) => handleChange('experience', value)} />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsForm skills={resume.skills} onChange={(value) => handleChange('skills', value)} />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsForm projects={resume.projects} onChange={(value) => handleChange('projects', value)} />
        </TabsContent>
        <TabsContent value="other">
          <OtherInfoForm 
            certifications={resume.certifications} 
            languages={resume.languages} 
            onCertificationsChange={(value) => handleChange('certifications', value)}
            onLanguagesChange={(value) => handleChange('languages', value)}
          />
        </TabsContent>
      </Tabs>
      <div className="flex space-x-2">
        <Button type="button" onClick={saveResume} className="flex-1" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Resume'}
        </Button>
        <Button type="button" onClick={() => navigate(`/resume/${resumeId}/view`)} className="flex-1" disabled={!resumeId || isLoading}>
          <Eye className="mr-2 h-4 w-4" />
          View Resume
        </Button>
      </div>
    </form>
  );
}