import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const generateExperience = async (experienceData) => {
  if (!API_KEY) throw new Error("API key is not set");

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const { company, position, startDate, endDate } = experienceData;

  // Calculate duration
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const durationMonths = Math.floor((end - start) / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(durationMonths / 12);
  const months = durationMonths % 12;
  const duration = `${years > 0 ? `${years} years ` : ''}${months > 0 ? `${months} months` : ''}`.trim();

  const prompt = `
    Generate 4-6 detailed bullet points describing work responsibilities and achievements for the following position:
    
    Position: ${position}
    Company: ${company}
    Duration: ${duration}

    Guidelines:
    - Start each bullet point with a strong action verb
    - Include specific metrics and achievements where possible (use realistic numbers)
    - Focus on impact and results, not just tasks
    - Highlight leadership, collaboration, and technical skills
    - Keep each bullet point to 1-2 lines
    - Use present tense for current positions, past tense for previous positions
    - Avoid buzzwords and clichés
    - Be specific about technologies, methodologies, and processes used

    Format: Return only the bullet points, one per line, without any prefixes or additional formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up and format the response
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
      
  } catch (error) {
    console.error('Error generating experience:', error);
    throw new Error('Failed to generate experience description');
  }
};

export default generateExperience;