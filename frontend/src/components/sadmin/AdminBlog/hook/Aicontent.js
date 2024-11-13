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
  const prompt = `Write a blog post with the title "${title}" and covering the following tags: ${tags.join(", ")}. 
  The blog post should be informative and engaging. The content should be in JSON format.`;

  try {
    const result = await model.generate({
      prompt, // Simplified prompt format
      ...generationConfig,
    });

    // Extracting the text content from the result
    const rawText = result.content; // assuming `content` holds the response

    // Parse or clean the raw text as JSON
    const cleanedText = cleanJSONText(rawText);
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate blog post content");
  }
};

// Helper function to clean JSON text
const cleanJSONText = (text) => {
  try {
    // Parse the text directly as JSON if it's valid
    return JSON.stringify(JSON.parse(text));
  } catch (e) {
    // Fallback: If parsing fails, try to clean and reformat
    return text
      .replace(/\\n/g, ' ') // Replace newline characters with spaces
      .replace(/\s+/g, ' ') // Collapse multiple spaces into a single space
      .replace(/\\\"/g, '"') // Unescape double quotes
      .trim();               // Remove trailing and leading whitespace
  }
};
