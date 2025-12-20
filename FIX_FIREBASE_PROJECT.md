# Fixing Firebase Project Error

The error happens because `.firebaserc` has a placeholder project ID. You have two options:

## Option 1: Create a New Firebase Project (Easiest)

During `firebase init`, when it asks:
```
? Please select an option:
> Use an existing project
  Create a new project
```

**Select "Create a new project"** instead!

Then:
- Enter a project name (e.g., "homeruns-strategy-lab")
- It will create the project and set everything up automatically

## Option 2: Use an Existing Project

If you already have a Firebase project:

1. **List your projects** to see what you have:
   ```bash
   firebase projects:list
   ```

2. **Update `.firebaserc`** with your actual project ID

3. **Then run `firebase init` again**

