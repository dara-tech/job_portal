import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const generateProjects = async (resumeData, creativity) => {
  if (!API_KEY) throw new Error("API key is not set");

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const projectPrompt = resumeData.projects
    ? resumeData.projects.map(project => project.name).join(', ')
    : 'Not specified';

  const prompt = `
    Generate project highlights for the following person:
    Name: ${resumeData.personalInfo?.name || 'Not specified'}
    Title: ${resumeData.title || 'Not specified'}
    Projects: ${projectPrompt}

    Please provide project highlights (100-150 words) that showcase the person's most significant projects, their role, technologies used, and outcomes achieved.
    Creativity level: ${creativity} (0 being very conservative, 1 being very creative)
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export default generateProjects;