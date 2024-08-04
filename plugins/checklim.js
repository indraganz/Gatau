const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Dummy data to simulate usage limits
const apiUsage = {
    'furinafree': { currentUsage: 0, apiKeyLimit: 1000 },
    'indrafarida': { currentUsage: 0, apiKeyLimit: -1 } // Unlimited
};

// Endpoint to check API key limit
app.get('/api/checkLimit', (req, res) => {
    const apiKey = req.query.apiKey;
    const checkOnly = req.query.checkOnly === 'true';

    if (!apiKey || !apiUsage[apiKey]) {
        return res.status(400).json({ error: 'Invalid API key.' });
    }

    const usageData = apiUsage[apiKey];
    
    // Check limit and update usage if not just checking
    if (!checkOnly) {
        if (apiKey === 'furinafree') {
            if (usageData.currentUsage < usageData.apiKeyLimit) {
                usageData.currentUsage++;
            } else {
                return res.json({ limitReached: true });
            }
        }
    }

    res.json({
        limitReached: usageData.currentUsage >= usageData.apiKeyLimit,
        currentUsage: usageData.currentUsage,
        apiKeyLimit: usageData.apiKeyLimit
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
