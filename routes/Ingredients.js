const express = require('express');
const Ingredient = require('../models/Ingredients.js');
const auth = require('../middleware/auth.js');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// GET all ingredients for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const ingredients = await Ingredient.find({ userId: req.user.id });
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ 
            message: 'Server error while fetching ingredients',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST add new ingredient
router.post('/', 
    auth,
    [
        body('name').trim().notEmpty().withMessage('Ingredient name is required'),
        body('quantity').optional().isFloat({ min: 0.1 }).withMessage('Quantity must be a positive number'),
        body('unit').optional().isIn(['pieces', 'kg', 'g', 'ml', 'L', 'cups', 'tbsp', 'tsp'])
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, quantity = 1, unit = 'pieces' } = req.body;

            const newIngredient = new Ingredient({
                userId: req.user.id,
                name,
                quantity,
                unit
            });

            await newIngredient.save();
            res.status(201).json(newIngredient);
        } catch (error) {
            console.error('Error adding ingredient:', error);
            res.status(500).json({ 
                message: 'Server error while adding ingredient',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// DELETE ingredient by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedIngredient = await Ingredient.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!deletedIngredient) {
            return res.status(404).json({ message: 'Ingredient not found or unauthorized' });
        }

        res.json({ 
            message: 'Ingredient deleted successfully',
            deletedIngredient
        });
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        res.status(500).json({ 
            message: 'Server error while deleting ingredient',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;