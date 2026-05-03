const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateText({ prompt }) {
  try {
    const modelInstance = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await modelInstance.generateContent(prompt);
    return result;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

module.exports = router;