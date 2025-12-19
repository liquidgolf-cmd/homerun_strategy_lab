import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/schema';
interface ModuleResponse {
  id: string;
  sessionId: string;
  moduleNumber: number;
  inputMethod: 'ai' | 'form';
  aiTranscript?: Array<{ role: string; content: string }>;
  formData?: Record<string, any>;
  auditReviewDocument?: string;
  completedAt?: string;
}

const router = Router();

// Get or create user session
router.post('/session', (req, res) => {
  try {
    console.log('Session creation request:', { body: req.body });
    const { email, name } = req.body;
    if (!email || !name) {
      console.log('Missing email or name');
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user) {
      // Create new user
      const userId = uuidv4();
      const now = new Date().toISOString();
      db.prepare(
        'INSERT INTO users (id, email, name, createdAt, lastAccessedAt) VALUES (?, ?, ?, ?, ?)'
      ).run(userId, email, name, now, now);
      user = { id: userId, email, name, createdAt: now, lastAccessedAt: now };
    } else {
      // Update last accessed
      const now = new Date().toISOString();
      db.prepare('UPDATE users SET lastAccessedAt = ? WHERE id = ?').run(now, user.id);
      user.lastAccessedAt = now;
    }

    // Check if active session exists
    let session = db
      .prepare('SELECT * FROM sessions WHERE userId = ? ORDER BY updatedAt DESC LIMIT 1')
      .get(user.id) as any;

    if (!session) {
      // Create new session
      const sessionId = uuidv4();
      const now = new Date().toISOString();
      db.prepare(
        'INSERT INTO sessions (id, userId, currentModule, completionStatus, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(sessionId, user.id, 0, 0, now, now);
      session = {
        id: sessionId,
        userId: user.id,
        currentModule: 0,
        completionStatus: 0,
        createdAt: now,
        updatedAt: now,
      };
    }

    console.log('Session created successfully:', { userId: user.id, sessionId: session.id });
    res.json({ user, session });
  } catch (error: any) {
    console.error('Error creating session:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get session
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as any;

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
router.get('/session/:sessionId/module/:moduleNumber', (req, res) => {
  try {
    const { sessionId, moduleNumber } = req.params;
    const moduleNum = parseInt(moduleNumber);

    const response = db
      .prepare(
        'SELECT * FROM module_responses WHERE sessionId = ? AND moduleNumber = ?'
      )
      .get(sessionId, moduleNum) as any;

    if (!response) {
      return res.status(404).json({ error: 'Module response not found' });
    }

    // Parse JSON fields
    const parsed: ModuleResponse = {
      ...response,
      aiTranscript: response.aiTranscript ? JSON.parse(response.aiTranscript) : undefined,
      formData: response.formData ? JSON.parse(response.formData) : undefined,
    };

    res.json(parsed);
  } catch (error: any) {
    console.error('Error getting module response:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save module response
router.post('/session/:sessionId/module/:moduleNumber', (req, res) => {
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

    // Check if response exists
    const existing = db
      .prepare(
        'SELECT id FROM module_responses WHERE sessionId = ? AND moduleNumber = ?'
      )
      .get(sessionId, moduleNum);

    if (existing) {
      // Update existing
      db.prepare(
        'UPDATE module_responses SET inputMethod = ?, aiTranscript = ?, formData = ? WHERE sessionId = ? AND moduleNumber = ?'
      ).run(
        inputMethod,
        aiTranscript ? JSON.stringify(aiTranscript) : null,
        formData ? JSON.stringify(formData) : null,
        sessionId,
        moduleNum
      );
      res.json({ success: true, id: (existing as any).id });
    } else {
      // Create new
      const id = uuidv4();
      db.prepare(
        'INSERT INTO module_responses (id, sessionId, moduleNumber, inputMethod, aiTranscript, formData) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(
        id,
        sessionId,
        moduleNum,
        inputMethod,
        aiTranscript ? JSON.stringify(aiTranscript) : null,
        formData ? JSON.stringify(formData) : null
      );
      res.json({ success: true, id });
    }
  } catch (error: any) {
    console.error('Error saving module response:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save audit review
router.post('/session/:sessionId/module/:moduleNumber/audit', (req, res) => {
  try {
    const { sessionId, moduleNumber } = req.params;
    const { auditReviewDocument } = req.body;
    const moduleNum = parseInt(moduleNumber);

    if (!auditReviewDocument) {
      return res.status(400).json({ error: 'Audit review document is required' });
    }

    const completedAt = new Date().toISOString();

    // Update or insert
    const existing = db
      .prepare(
        'SELECT id FROM module_responses WHERE sessionId = ? AND moduleNumber = ?'
      )
      .get(sessionId, moduleNum);

    if (existing) {
      db.prepare(
        'UPDATE module_responses SET auditReviewDocument = ?, completedAt = ? WHERE sessionId = ? AND moduleNumber = ?'
      ).run(auditReviewDocument, completedAt, sessionId, moduleNum);

      // Update session completion status
      const completedModules = db
        .prepare(
          'SELECT COUNT(*) as count FROM module_responses WHERE sessionId = ? AND completedAt IS NOT NULL'
        )
        .get(sessionId) as any;

      const currentModule = Math.max(moduleNum + 1, 4);
      db.prepare(
        'UPDATE sessions SET currentModule = ?, completionStatus = ?, updatedAt = ? WHERE id = ?'
      ).run(
        Math.min(currentModule, 4),
        completedModules.count,
        new Date().toISOString(),
        sessionId
      );

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

