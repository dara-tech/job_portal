import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("Google AI API key is not set. Please check your environment variables.");
}

// Initialize Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(apiKey);

// Define the model to use
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

// Set the configuration for text generation
const generationConfig = {
  temperature: 0.7, // Adjusts creativity level (0: more focused, 1: more random)
  topP: 1,          // Controls the diversity of the output (higher values mean more diversity)
  topK: 1,          // Top-K sampling (limits number of options considered for each token)
  maxOutputTokens: 256, // Maximum length of the generated text
};

// Function to generate a blog title based on the provided tags
export const generateBlogTitle = async (tags) => {
  const prompt = `Generate a catchy and informative blog title that covers the following tags: ${tags.join(", ")}. The title should be engaging and relevant to the topics represented by the tags.`;

  try {
    // Send the generation request to the model
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    // Extract the generated content from the response
    const response = result.response;
    const title = await response.text();

    return title.trim();
  } catch (error) {
    console.error("Error generating blog title:", error.message);
    throw new Error("Failed to generate blog title. Please try again later.");
  }
};
