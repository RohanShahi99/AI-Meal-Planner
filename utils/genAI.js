// utils/genAI.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates text using the Gemini API
 * @param {Object} options
 * @param {string} options.model - Model name (e.g., 'gemini-1.5-flash')
 * @param {string} options.prompt - Prompt text for AI
 * @returns {Promise<Object>} - Raw API response
 */
async function generateText({ model, prompt }) {
  try {
    const modelInstance = genAI.getGenerativeModel({ model });
    const result = await modelInstance.generateContent(prompt);
    return result; // You can access result.response.text()
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

module.exports = {
  generateText,
};
