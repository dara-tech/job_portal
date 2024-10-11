import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const generateEducation = async (resumeData, creativity) => {
  if (!API_KEY) throw new Error("API key is not set");

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const educationPrompt = resumeData.education
    ? resumeData.education.map(edu => `${edu.degree} from ${edu.institution}`).join(', ')
    : 'Not specified';

  const prompt = `
    Generate an education summary for the following person:
    Name: ${resumeData.personalInfo?.name || 'Not specified'}
    Education: ${educationPrompt}

    Please provide an education summary (50-75 words) that highlights the person's academic achievements, degrees, and relevant coursework.
    Creativity level: ${creativity} (0 being very conservative, 1 being very creative)
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export default generateEducation;