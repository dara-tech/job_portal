import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const generateProfessionalSummary = async (resumeData, creativity) => {
  if (!API_KEY) throw new Error("API key is not set");

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Generate a professional summary for the following person:
    Name: ${resumeData.personalInfo?.name || 'Not specified'}
    Title: ${resumeData.title || 'Not specified'}
    Current Summary: ${resumeData.summary || 'Not specified'}
    Skills: ${resumeData.skills ? resumeData.skills.join(', ') : 'Not specified'}

    Please provide a professional summary (100-150 words) that highlights the person's key strengths, experience, and career objectives.
    Creativity level: ${creativity} (0 being very conservative, 1 being very creative)
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export default generateProfessionalSummary;