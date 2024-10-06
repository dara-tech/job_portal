import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResumeForm from '../form/Form';
import PreviewForm from '../theme/PreviewForm';
import { RESUME_API_ENDPOINT } from "@/utils/constant";
import axios from 'axios';

export default function Layout() {
  const { id } = useParams();
  const [resume, setResume] = useState({
    title: '',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: []
  });
  const [selectedTheme, setSelectedTheme] = useState('modern');

  useEffect(() => {
    if (id) {
      fetchResume();
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await axios.get(`${RESUME_API_ENDPOINT}/${id}`, {
        withCredentials: true
      });
      if (response.data && response.data.resume) {
        setResume(response.data.resume);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const handleResumeChange = (updatedResume) => {
    setResume(updatedResume);
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        <ResumeForm resumeId={id} resume={resume} onResumeChange={handleResumeChange} />
      </div>
      <div className="w-full md:w-1/2 p-4">
        <PreviewForm resume={resume} theme={selectedTheme} onThemeChange={handleThemeChange} />
      </div>
    </div>
  );
}