# Homeruns Strategy Lab

A standalone web application for delivering the Homeruns Strategy Lab online course with 5 modules, featuring AI-guided interviews and manual workbook options.

## Features

- 5 sequential modules (0-4) covering the HomeRun methodology
- Dual input methods: AI chat interface or manual forms
- Automatic audit review document generation for each module
- Final overview document and 90-day action plan generation
- Loam Strategy branding

## Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your ANTHROPIC_API_KEY
```

3. Run development servers:
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3000
- Frontend on http://localhost:3001

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: SQLite
- AI: Anthropic Claude API

