const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateText({ prompt }) {
  try {
    const modelInstance = genAI.getGenerativeModel(
  { model: 'gemini-2.0-flash-exp' },
  { apiVersion: 'v1beta' }
);
    const result = await modelInstance.generateContent(prompt);
    return result;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

module.exports = { generateText };