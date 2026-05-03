const axios = require('axios');
async function callGemini(prompt) {
  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    { contents: [{ parts: [{ text: prompt }] }] },
    { headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY } }
  );
  return response.data;
}
