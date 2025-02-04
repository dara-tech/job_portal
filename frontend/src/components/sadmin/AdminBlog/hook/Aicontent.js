import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("Google AI API key is not set. Please check your environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

const generationConfig = {
  temperature: 0.7,
  topP: 1,
  topK: 1,
  maxOutputTokens: 2048,
  response_mime_type: "application/json",
};

export const generateBlogPost = async (title, tags) => {
  const prompt = `Craft a comprehensive and engaging blog post titled "${title}" that delves into the topics of ${tags.join(", ")}. 
  The content should be well-researched, informative, and written in a style that resonates with a wide audience. 
  Ensure the output is in JSON format and includes a brief summary, main content, and a conclusion.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const rawText = await response.text();

    // Clean up the text to remove unnecessary characters and fix JSON formatting
    const cleanedText = cleanJSONText(rawText);
    
    return cleanedText;
  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate blog post content");
  }
};

// Helper function to clean JSON text
const cleanJSONText = (text) => {
  // Remove any invalid characters, unnecessary line breaks, and trim whitespace
  return text
    .replace(/\\n/g, ' ') // Replace newline characters with spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces into a single space
    .replace(/\\\"/g, '"') // Unescape double quotes
    .trim();               // Remove trailing and leading whitespace
};