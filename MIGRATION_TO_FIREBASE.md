# Migration Guide: SQLite to Firestore

## Overview

To deploy to Firebase, you need to convert from SQLite (relational) to Firestore (NoSQL). This is a significant change requiring code updates.

## Key Differences

| SQLite | Firestore |
|--------|-----------|
| Tables | Collections |
| Rows | Documents |
| SQL Queries | Firestore Queries |
| Synchronous | Asynchronous |
| `db.prepare().get()` | `collection.doc().get()` |
| `db.prepare().run()` | `collection.add()` or `collection.doc().set()` |

## Required Changes

### 1. Update Database Layer

**File**: `backend/src/db/schema.ts` → Replace with `backend/src/db/firestore.ts`

### 2. Update Route Handlers

All route handlers need to be `async` because Firestore operations are asynchronous.

**Example - Get User**:

**Before (SQLite)**:
```typescript
router.post('/session', (req, res) => {
  const { email, name } = req.body;
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  // ...
});
```

**After (Firestore)**:
```typescript
router.post('/session', async (req, res) => {
  try {
    const { email, name } = req.body;
    let user = await getUserByEmail(email);
    // ...
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Update All Routes

Files to update:
- `backend/src/routes/modules.ts`
- `backend/src/routes/ai.ts` (if it uses database)
- `backend/src/routes/documents.ts`

### 4. Update Dependencies

Remove from `backend/package.json`:
- `better-sqlite3`
- `@types/better-sqlite3`

Add to `backend/package.json`:
- `firebase-admin`
- `firebase-functions`

## Migration Checklist

- [ ] Install Firebase CLI and login
- [ ] Create Firebase project and enable Firestore
- [ ] Replace `backend/src/db/schema.ts` with Firestore implementation
- [ ] Update all route handlers to be `async`
- [ ] Convert all SQLite queries to Firestore operations
- [ ] Update `backend/package.json` dependencies
- [ ] Test database operations locally
- [ ] Deploy to Firebase

## Quick Start Alternative

If you want to avoid migration, consider:
- **Option 2 (Railway)**: Works with SQLite as-is ✅
- **Cloud SQL**: Use PostgreSQL/MySQL instead of Firestore (more complex setup)

## Next Steps

1. Review the Firestore helper functions in `backend/src/db/firestore.ts`
2. Update route handlers to use Firestore operations
3. Test locally with Firebase Emulators
4. Deploy when ready

