const express = require('express');
const auth = require('../middleware/auth');
const genAI = require('../utils/genAI'); // Your Gemini API helper

const router = express.Router();

// Utility to extract valid JSON from Markdown-wrapped output
function extractJSON(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return match ? match[1] : text;
}

// POST /api/ai/recipe
router.post('/', auth, async (req, res) => {
  try {
    const { ingredients, dietaryPreferences = [], allergies = [] } = req.body;

    // Validate ingredients
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Ingredients must be a non-empty array' });
    }

    // Validate other inputs to avoid join() errors
    const prefList = Array.isArray(dietaryPreferences) ? dietaryPreferences : [];
    const allergyList = Array.isArray(allergies) ? allergies : [];

    // Construct AI prompt
    const prompt = `
Generate a detailed recipe using only these ingredients: ${ingredients.join(', ')}.
Dietary preferences: ${prefList.length ? prefList.join(', ') : 'None'}.
Allergies to avoid: ${allergyList.length ? allergyList.join(', ') : 'None'}.
Include recipe title, servings, prep time, cook time, ingredients list, and step-by-step instructions.
Format the response in JSON.
    `;

    const result = await genAI.generateText({ model: 'gemini-2.0-flash', prompt });

    const rawText = result.response.text();
    const jsonText = extractJSON(rawText);
    const recipe = JSON.parse(jsonText);

    res.json({ recipe });
  } catch (error) {
    console.error('AI recipe generation error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

// POST /api/ai/meal-plan
router.post('/meal-plan', auth, async (req, res) => {
  try {
    const { preferences = {}, dietaryPreferences = [], allergies = [] } = req.body;

    // Defensive input validation
    const prefList = Array.isArray(dietaryPreferences) ? dietaryPreferences : [];
    const allergyList = Array.isArray(allergies) ? allergies : [];

    const prefText = Object.entries(preferences).map(([k, v]) => `${k}: ${v}`).join(', ');

    const prompt = `
Create a ${preferences.days || 3}-day meal plan including breakfast, lunch, and dinner.
Dietary preferences: ${prefList.length ? prefList.join(', ') : 'None'}.
Allergies to avoid: ${allergyList.length ? allergyList.join(', ') : 'None'}.
Preferences: ${prefText || 'None'}.
Format the meal plan with day-wise meals and recipe summaries in JSON.
    `;

    const result = await genAI.generateText({ model: 'gemini-2.0-flash', prompt });

    const rawText = result.response.text();
    const jsonText = extractJSON(rawText);
    const mealPlan = JSON.parse(jsonText);

    res.json({ mealPlan });
  } catch (error) {
    console.error('AI meal plan generation error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

module.exports = router;

