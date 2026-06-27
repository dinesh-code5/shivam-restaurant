import express from 'express';
import WhatsappTemplate from '../models/WhatsappTemplate.js';
import BirthdayCampaign from '../models/BirthdayCampaign.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/whatsapp/templates
router.get('/templates', protect, async (req, res, next) => {
  try {
    const templates = await WhatsappTemplate.find().sort({ key: 1 });
    res.json({ success: true, data: templates });
  } catch (err) { next(err); }
});

// PUT /api/whatsapp/templates/:id
router.put('/templates/:id', protect, async (req, res, next) => {
  try {
    const tpl = await WhatsappTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: tpl });
  } catch (err) { next(err); }
});

// GET /api/whatsapp/campaigns
router.get('/campaigns', protect, async (req, res, next) => {
  try {
    const campaign = await BirthdayCampaign.findOne() || await BirthdayCampaign.create({
      name: 'Default Birthday Campaign', discountPercent: 10,
    });
    res.json({ success: true, data: campaign });
  } catch (err) { next(err); }
});

// PUT /api/whatsapp/campaigns/:id
router.put('/campaigns/:id', protect, async (req, res, next) => {
  try {
    const c = await BirthdayCampaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: c });
  } catch (err) { next(err); }
});

export default router;
