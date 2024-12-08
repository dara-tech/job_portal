import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const generateEducation = async (resumeData, creativity) => {
  if (!API_KEY) throw new Error("API key is not set");

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const educationDetails = resumeData.education?.map(edu => ({
    degree: edu.degree || 'Not specified',
    institution: edu.institution || 'Not specified',
    graduationYear: edu.graduationYear || 'Not specified',
    gpa: edu.gpa || 'Not specified',
    honors: edu.honors || [],
    relevantCourses: edu.relevantCourses || []
  })) || [];

  const prompt = `
    Generate a comprehensive education summary for the following person:
    Name: ${resumeData.personalInfo?.name || 'Not specified'}
    
    Education Details:
    ${educationDetails.map(edu => `
      Degree: ${edu.degree}
      Institution: ${edu.institution}
      Graduation Year: ${edu.graduationYear}
      GPA: ${edu.gpa}
      Honors: ${edu.honors.join(', ')}
      Relevant Courses: ${edu.relevantCourses.join(', ')}
    `).join('\n')}

    Guidelines:
    - Create a ${creativity > 0.7 ? 'dynamic and engaging' : 'professional and concise'} summary
    - Highlight academic achievements and honors
    - Emphasize relevant coursework and specializations
    - Include technical skills and certifications if applicable
    - Focus on accomplishments that demonstrate expertise
    - Word count: 75-100 words
    - Tone: ${creativity > 0.5 ? 'confident and innovative' : 'traditional and formal'}
    
    Format the response with proper academic terminology and maintain a clear structure.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: {
        temperature: creativity * 0.7 + 0.3,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 200,
      }
    });

    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error('Error generating education summary:', error);
    throw new Error('Failed to generate education summary');
  }
};

export default generateEducation;