const express = require('express');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all recipes for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ userId: req.user.id });
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST add new recipe for logged-in user
router.post('/', auth, async (req, res) => {
    try {
        const { title, ingredients, instructions } = req.body;
        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ message: 'Please provide title, ingredients, and instructions' });
        }

        const newRecipe = new Recipe({
            userId: req.user.id,
            title,
            ingredients,
            instructions
        });
        await newRecipe.save();

        res.status(201).json(newRecipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE recipe by ID (only if belongs to user)
router.delete('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.user.id });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        await recipe.remove();
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
