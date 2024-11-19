# PiratePixels 🏴‍☠️
PiratePixels is a collaborative pixel-art game where users can log in using Slack, select colors, and place pixels on a shared 50x50 grid. Users can place one pixel every minute, encouraging teamwork and creativity.

## Features
- `Slack Authentication:` Users can log in with Slack to participate.
- `Collaborative Drawing:` A shared grid where users can place pixels.
- `Rate-Limiting:` Each user can place one pixel every minute.
- `Color Palette:` A fixed palette of 16 colors to choose from.
- `Real-Time Updates:` The grid is updated regularly with pixels placed by all users.

## Tech Stack
- `Frontend:` React with Next.js
- `UI Framework:` Chakra UI
- `Backend:` Supabase (Database and Authentication)
- `OAuth Provider:` Slack

## Setup Instructions
### Prerequisites
1. *Node.js:* Ensure you have `Node.js` installed.
2. *Supabase Account:* Set up a Supabase project and create the necessary table (pixels).
3. *Slack App:* Register a Slack app and configure OAuth for `slack_oidc`.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PiratePixels
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file and add the following variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Create the Database Table
Run the following SQL script in your Supabase project to create the `pixels` table:
```sql
CREATE TABLE pixels (
    id SERIAL PRIMARY KEY,
    xy TEXT NOT NULL,
    color TEXT NOT NULL,
    user TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
```

### 5. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

Enjoy building your pirate empire on the pixel grid! 🏴‍☠️