const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Directory containing model files
const modelsPath = __dirname;

// Object to hold all the models
const models = {};

// Read all files in the models directory
fs.readdirSync(modelsPath).forEach(file => {
    // Only consider JavaScript files
    if (file.endsWith('.js') && file !== 'index.js') {
        const modelName = file.split('.js')[0];
        const modelPath = path.join(modelsPath, file);
        models[modelName.charAt(0).toUpperCase() + modelName.slice(1)] = require(modelPath);
    }
});

module.exports = models;
