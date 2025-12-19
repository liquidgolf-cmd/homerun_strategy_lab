import { Router } from 'express';
import { chatWithCoach, generateAuditReview } from '../services/anthropicService';
import {
  module0AuditPrompt,
  module1AuditPrompt,
  module2AuditPrompt,
  module3AuditPrompt,
  module4AuditPrompt,
} from '../prompts';

const router = Router();

const auditPrompts = [
  module0AuditPrompt,
  module1AuditPrompt,
  module2AuditPrompt,
  module3AuditPrompt,
  module4AuditPrompt,
];

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { messages, moduleNumber, moduleContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await chatWithCoach(messages, moduleContext);
    res.json({ message: response });
  } catch (error: any) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message || 'Error generating chat response' });
  }
});

// Generate audit review
router.post('/audit-review', async (req, res) => {
  try {
    const { moduleNumber, aiTranscript, formData } = req.body;

    if (moduleNumber === undefined || moduleNumber < 0 || moduleNumber > 4) {
      return res.status(400).json({ error: 'Valid module number (0-4) is required' });
    }

    if (!aiTranscript && !formData) {
      return res.status(400).json({ error: 'Either aiTranscript or formData is required' });
    }

    const auditPrompt = auditPrompts[moduleNumber];
    if (!auditPrompt) {
      return res.status(400).json({ error: 'Invalid module number' });
    }

    const review = await generateAuditReview(moduleNumber, auditPrompt, {
      aiTranscript,
      formData,
    });

    res.json({ auditReview: review });
  } catch (error: any) {
    console.error('Error generating audit review:', error);
    res.status(500).json({ error: error.message || 'Error generating audit review' });
  }
});

export default router;

