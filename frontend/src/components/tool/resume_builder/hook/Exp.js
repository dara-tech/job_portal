import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const generateExperience = async (resumeData, creativity) => {
  if (!API_KEY) throw new Error("API key is not set");

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const experiencePrompt = resumeData.experience
    ? resumeData.experience.map(exp => `${exp.position} at ${exp.company}`).join(', ')
    
    : 'Not specified';

  const prompt = `
    Generate work experience highlights for the following person:
    Name: ${resumeData.personalInfo?.name || 'Not specified'}
    Title: ${resumeData.title || 'Not specified'}
    Experience: ${experiencePrompt}

    Please provide work experience highlights (50-100 words) that showcase the person's professional achievements, responsibilities, and growth throughout their career.
    Creativity level: ${creativity} (0 being very conservative, 1 being very creative)
    Format the output as HTML compatible with ReactQuill. Use appropriate tags (e.g., <p>, <ul>, <li>, <h1>, <h2>) for structure.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export default generateExperience;