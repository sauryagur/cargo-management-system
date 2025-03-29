// backend/routes/search.js
const express = require('express');
const router = express.Router();
const RetrievalOptimizer = require('../services/retrievalService');

let retrievalSystem;

router.get('/', async (req, res) => {
  try {
    const { itemId, itemName, userId } = req.query;
    
    const result = retrievalSystem.findOptimalItem({ itemId, itemName });
    if (!result) return res.json({ success: true, found: false });

    const plan = retrievalSystem.generateRetrievalPlan(result.item, result.blockers);
    
    // Log retrieval request
    logger.logSearch(req.query, result.item, plan.length);
    
    res.json({
      success: true,
      found: true,
      item: this.formatItem(result.item),
      retrievalSteps: plan
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/retrieve', async (req, res) => {
  try {
    const { itemId, userId } = req.body;
    const item = inventorySystem.markItemUsed(itemId);
    
    logger.logRetrieval(itemId, userId);
    
    if(item.usageLimit <= 0) {
      wasteSystem.markAsWaste(itemId, "Out of Uses");
    }
    
    res.json({ success: true });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
