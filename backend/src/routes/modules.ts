import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getUserByEmail,
  createUser,
  updateUser,
  getSessionById,
  getLatestSessionForUser,
  createSession,
  getModuleResponse,
  saveModuleResponse,
  sessionsCollection,
  moduleResponsesCollection,
} from '../db/firestore';
import type { ModuleResponse } from '../db/firestore';

const router = Router();

// Get or create user session
router.post('/session', async (req, res) => {
  try {
    console.log('Session creation request:', { body: req.body });
    const { email, name } = req.body;
    if (!email || !name) {
      console.log('Missing email or name');
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Check if user exists
    let user = await getUserByEmail(email);

    if (!user) {
      // Create new user
      const now = new Date().toISOString();
      user = await createUser({
        email,
        name,
        createdAt: now,
        lastAccessedAt: now,
      });
    } else {
      // Update last accessed
      const now = new Date().toISOString();
      await updateUser(user.id, { lastAccessedAt: now });
      user.lastAccessedAt = now;
    }

    // Check if active session exists
    let session = await getLatestSessionForUser(user.id);

    if (!session) {
      // Create new session
      const now = new Date().toISOString();
      session = await createSession({
        userId: user.id,
        currentModule: 0,
        completionStatus: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log('Session created successfully:', { userId: user.id, sessionId: session.id });
    res.json({ user, session });
  } catch (error: any) {
    console.error('Error creating session:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Get session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await getSessionById(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error: any) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get module response
router.get('/session/:sessionId/module/:moduleNumber', async (req, res) => {
  try {
    const { sessionId, moduleNumber } = req.params;
    const moduleNum = parseInt(moduleNumber);

    const response = await getModuleResponse(sessionId, moduleNum);

    if (!response) {
      return res.status(404).json({ error: 'Module response not found' });
    }

    res.json(response);
  } catch (error: any) {
    console.error('Error getting module response:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save module response
router.post('/session/:sessionId/module/:moduleNumber', async (req, res) => {
  try {
    const { sessionId, moduleNumber } = req.params;
    const { inputMethod, aiTranscript, formData } = req.body;
    const moduleNum = parseInt(moduleNumber);

    if (!inputMethod || (inputMethod !== 'ai' && inputMethod !== 'form')) {
      return res.status(400).json({ error: 'Invalid input method' });
    }

    if (inputMethod === 'ai' && !aiTranscript) {
      return res.status(400).json({ error: 'AI transcript is required for AI input method' });
    }

    if (inputMethod === 'form' && !formData) {
      return res.status(400).json({ error: 'Form data is required for form input method' });
    }

    const id = await saveModuleResponse({
      sessionId,
      moduleNumber: moduleNum,
      inputMethod,
      aiTranscript,
      formData,
    });

    res.json({ success: true, id });
  } catch (error: any) {
    console.error('Error saving module response:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save audit review
router.post('/session/:sessionId/module/:moduleNumber/audit', async (req, res) => {
  try {
    const { sessionId, moduleNumber } = req.params;
    const { auditReviewDocument } = req.body;
    const moduleNum = parseInt(moduleNumber);

    if (!auditReviewDocument) {
      return res.status(400).json({ error: 'Audit review document is required' });
    }

    const completedAt = new Date().toISOString();

    // Get existing response
    const existing = await getModuleResponse(sessionId, moduleNum);

    if (existing) {
      // Update with audit review
      await moduleResponsesCollection.doc(existing.id).update({
        auditReviewDocument,
        completedAt,
      });

      // Count completed modules
      const completedSnapshot = await moduleResponsesCollection
        .where('sessionId', '==', sessionId)
        .where('completedAt', '!=', null)
        .get();

      const completedCount = completedSnapshot.size;
      const currentModule = Math.min(Math.max(moduleNum + 1, 0), 4);

      // Update session
      await sessionsCollection.doc(sessionId).update({
        currentModule,
        completionStatus: completedCount,
        updatedAt: new Date().toISOString(),
      });

      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Module response not found. Save responses first.' });
    }
  } catch (error: any) {
    console.error('Error saving audit review:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
