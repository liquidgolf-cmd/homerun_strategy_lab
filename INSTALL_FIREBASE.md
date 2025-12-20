# Installing Firebase CLI

You're seeing `-bash: firebase: command not found` because Firebase CLI isn't installed yet.

## Step 1: Install Firebase CLI

In your Terminal (the same window), type this command and press Enter:

```bash
npm install -g firebase-tools
```

**Wait for it to finish** - it will take a minute or two.

## If you get a permissions error:

If you see an error about permissions, try this instead:

```bash
sudo npm install -g firebase-tools
```

Then you'll be asked for your Mac password. Type it (you won't see it as you type - that's normal) and press Enter.

## Step 2: Verify it worked

After installation finishes, type this to check:

```bash
firebase --version
```

You should see something like: `13.0.0` (or another version number)

## Step 3: Login to Firebase

Now type:

```bash
firebase login
```

Your browser will open. Sign in with your Google account.

## Step 4: Then run init

After you're logged in, then you can run:

```bash
firebase init
```

And the prompts will appear!

