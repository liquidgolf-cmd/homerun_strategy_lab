# Step 5: Simple Instructions

## What You Actually Need to Do

**These prompts don't exist anywhere yet** - they will appear in your Terminal AFTER you run the command.

### Step-by-Step:

1. **Open Terminal app on your Mac**
   - Press `Cmd + Space` (Command key + Space bar)
   - Type "Terminal"
   - Press Enter
   - A Terminal window will open (black/gray window with text)

2. **Copy and paste this into Terminal:**
   ```bash
   cd "/Users/michaelhill/Documents/GitHub/Homeruns Strategy Lab"
   ```

3. **Press Enter**

4. **Now check if Firebase is installed. Type this and press Enter:**
   ```bash
   firebase --version
   ```

   - If you see a version number (like `13.0.0`), you're good! Skip to step 6.
   - If you see "command not found", go to step 5.

5. **Install Firebase (if needed). Type this and press Enter:**
   ```bash
   npm install -g firebase-tools
   ```
   
   If you get a permissions error, try:
   ```bash
   sudo npm install -g firebase-tools
   ```
   (You'll be asked for your Mac password)

6. **Login to Firebase. Type this and press Enter:**
   ```bash
   firebase login
   ```
   
   - Your browser will open
   - Sign in with your Google account
   - Come back to Terminal when it says "Success!"

7. **Now run the init command. Type this and press Enter:**
   ```bash
   firebase init
   ```

8. **NOW you'll see the interactive prompts in your Terminal!**
   
   The prompts will appear one by one in that same Terminal window.
   Follow my previous guide to answer each question.

## Quick Reference - What to Select:

When you run `firebase init`, here's what to choose:

- **Which features?** → Select: Firestore, Functions, Hosting (use Space to check, Enter to confirm)
- **Which project?** → Select "Use an existing project" → then choose your project
- **Firestore rules file?** → Press Enter (default)
- **Firestore indexes file?** → Press Enter (default)
- **Functions language?** → Select TypeScript
- **Use ESLint?** → Type `y` and Enter
- **Install dependencies?** → Type `y` and Enter
- **Public directory?** → Type `frontend/dist` and Enter
- **Single-page app?** → Type `y` and Enter
- **GitHub auto-deploy?** → Type `n` and Enter

## Still Confused?

The prompts are **inside your Terminal window** - they appear as text/questions that you answer by typing and pressing Enter.

Think of it like a conversation with your computer:
- Computer asks a question (in Terminal)
- You type your answer
- Press Enter
- Computer asks next question
- Repeat until done




