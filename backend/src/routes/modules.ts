import { Router } from 'express';
import { verifyAuth } from '../middleware/auth';
import {
  getOrCreateUserProfile,
  getSessionById,
  getLatestSessionForUser,
  createSession,
  updateSession,
  getModuleResponse,
  saveModuleResponse,
  getCompletedModuleResponses,
} from '../db/supabase';
import type { ModuleResponse } from '../db/supabase';

const router = Router();

// Get or create user session (requires authentication)
// User is extracted from JWT token via auth middleware
router.get('/session', verifyAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.name;

    // Verify user exists in auth.users by checking if we can create/get their profile
    // This ensures the user exists before we try to create a session
    let userProfile;
    try {
      userProfile = await getOrCreateUserProfile(userId, userName);
    } catch (error: any) {
      // If user profile creation fails, the user might not exist in auth.users
      console.error('Error creating user profile:', error);
      // Check if it's a foreign key constraint error
      if (error.code === '23503' || error.message?.includes('foreign key constraint')) {
        return res.status(401).json({ error: 'User not found in authentication system. Please sign in again.' });
      }
      throw error; // Re-throw other errors
    }

    // Check if active session exists
    let session = await getLatestSessionForUser(userId);

    if (!session) {
      // Create new session
      const now = new Date().toISOString();
      session = await createSession({
        userId: userId,
        currentModule: 0,
        completionStatus: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log('Session retrieved/created successfully:', { userId: userProfile.id, sessionId: session.id });
    res.json({ 
      user: {
        id: userProfile.id,
        email: userEmail,
        name: userProfile.name,
      },
      session 
    });
  } catch (error: any) {
    console.error('Error getting/creating session:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Get session by ID (requires authentication)
router.get('/session/:sessionId', verifyAuth, async (req, res) => {
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

// Get module response (requires authentication)
router.get('/session/:sessionId/module/:moduleNumber', verifyAuth, async (req, res) => {
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

// Save module response (requires authentication)
router.post('/session/:sessionId/module/:moduleNumber', verifyAuth, async (req, res) => {
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

// Save audit review (requires authentication)
router.post('/session/:sessionId/module/:moduleNumber/audit', verifyAuth, async (req, res) => {
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
      // Update with audit review using saveModuleResponse
      await saveModuleResponse({
        ...existing,
        auditReviewDocument,
        completedAt,
      });

      // Count completed modules
      const completedResponses = await getCompletedModuleResponses(sessionId);
      const completedCount = completedResponses.length;
      const currentModule = Math.min(Math.max(moduleNum + 1, 0), 4);

      // Update session
      await updateSession(sessionId, {
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
