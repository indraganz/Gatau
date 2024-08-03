const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let globalUsageCount = 0; // Global counter for all API keys
const apiKeyLimit = 100; // Daily limit for all API keys

app.get('/api/checkLimit', (req, res) => {
    const apiKey = req.query.apiKey;

    if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
    }

    // Check if the global usage count has reached the limit
    const limitReached = globalUsageCount >= apiKeyLimit;

    if (!limitReached) {
        globalUsageCount++; // Increment the global usage count
    }

    res.json({
        limitReached,
        currentUsage: globalUsageCount,
        apiKeyLimit
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
