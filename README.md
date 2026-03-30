# Budget Travel Planner - macOS Setup Guide

## 1. Prerequisites (Clean Machine)

### Install Homebrew
Open Terminal and run:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install Node.js (LTS)
```bash
brew install node@20
brew link node@20
```

### Install PostgreSQL
```bash
brew install postgresql@16
brew services start postgresql@16
```

---

## 2. Database Setup

### Create Database
```bash
createdb budget_travel_planner
```

### Initialize Schema & Seed Data
```bash
psql -d budget_travel_planner -f database/schema.sql
psql -d budget_travel_planner -f database/seed.sql
```

---

## 3. Application Setup

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL=postgres://localhost:5432/budget_travel_planner
GEMINI_API_KEY=your_api_key_here
```

### Install Dependencies
```bash
npm install
```

### Run the Application (One Command)
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 4. Folder Structure
- `/src/components`: UI components (Planner, AI, Common)
- `/src/lib`: Utilities and Provider abstractions
- `/server.ts`: Express API and Vite middleware
- `/database`: SQL schema and seed scripts
- `/src/types.ts`: TypeScript interfaces for data models
