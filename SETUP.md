# 🚀 Mission Control Setup Guide

## ✅ You're All Set!

Your Mission Control dashboard is ready to run. Here's how to get started.

## Quick Start (30 seconds)

### On Windows:
```bash
start.bat
```

### On Mac/Linux:
```bash
bash start.sh
```

### Manual:
```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

## What You Get

### 📱 Dashboard (`/`)
- Overview of your tools
- Quick action buttons
- Recent tools list
- Getting started guide

### 🧰 Tools Library (`/tools`)
- Browse all your tools
- Filter and search
- Tool status indicators
- Create new tools button

### 🔨 Tool Builder (`/build`)
- Create custom tools with different types:
  - **Webhook Handler** - Receive HTTP requests
  - **Scheduled Task** - Run on a schedule
  - **API Integration** - Connect to external APIs
  - **Custom Script** - Write custom logic
- Configure tool settings
- JSON configuration editor
- Live preview

### ⚙️ Settings (`/settings`)
- API key management
- Data source connections (PostgreSQL, MongoDB, etc.)
- Webhook configuration
- Theme preferences

## Building Your First Tool

### Step 1: Go to `/build`
- Click "Build New Tool" from the dashboard
- Or navigate to `/build` directly

### Step 2: Create Tool Details
```
Name: Email Monitor
Description: Monitor and process emails
Type: Scheduled Task
```

### Step 3: Configure
```json
{
  "inbox": "your-email@example.com",
  "interval": "5m",
  "filter": "is:important"
}
```

### Step 4: Save & Deploy
- Save the tool
- Test it on Settings page
- Deploy when ready

## Architecture

### Frontend
- **Next.js 15** - React framework
- **TailwindCSS** - Styling
- **Lucide Icons** - UI icons
- **TypeScript** - Type safety

### Backend
- **Next.js API Routes** - Serverless functions
- **Webhook Handlers** - `/api/webhooks/*`
- **Tool Management** - `/api/tools/*`

### File Structure
```
mission-control/
├── app/                    # Pages & routes
│   ├── page.tsx           # Dashboard
│   ├── tools/
│   ├── build/
│   ├── settings/
│   └── api/               # Backend routes
│       ├── tools/         # Tool CRUD
│       └── webhooks/      # Webhook handlers
├── components/            # Reusable components
│   ├── sidebar.tsx
│   └── header.tsx
└── README.md             # Main documentation
```

## Extending with Custom Tools

### 1. Create a New Tool Type

Edit `app/build/page.tsx` and add to `toolTypes`:

```tsx
const toolTypes = [
  { value: 'webhook', label: 'Webhook Handler' },
  { value: 'scheduled', label: 'Scheduled Task' },
  { value: 'custom-ai', label: 'AI Tool' },  // NEW
];
```

### 2. Create API Route

Create `app/api/tools/custom-ai/route.ts`:

```ts
export async function POST(request: Request) {
  const { prompt } = await request.json();
  // Your custom logic here
  return NextResponse.json({ result: 'AI response' });
}
```

### 3. Add UI Component

Create `components/tools/ai-tool.tsx` for custom UI.

## Integration Examples

### Connect to OpenAI
```tsx
// In your tool's API route
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ /* config */ }),
});
```

### Connect to Database
```tsx
// Install: npm install pg
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const result = await pool.query('SELECT * FROM tools');
```

### Setup Scheduled Tasks
```tsx
// Use a cron job library
// npm install node-cron
import cron from 'node-cron';

cron.schedule('*/5 * * * *', () => {
  // Runs every 5 minutes
  console.log('Running scheduled tool...');
});
```

## Environment Variables

Create `.env.local` in the project root:

```env
# Database
DATABASE_URL=postgresql://...

# API Keys
OPENAI_API_KEY=sk-...
STRIPE_API_KEY=sk_...

# Services
WEBHOOK_SECRET=your-secret-key
```

Access in your code:
```tsx
const apiKey = process.env.OPENAI_API_KEY;
```

## Deployment

### To Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### To Self-Hosted Server
```bash
npm run build
npm start
```

Server runs on port 3000 by default. Change with:
```bash
PORT=8080 npm start
```

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Build Errors
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Database Connection Error
- Check `DATABASE_URL` in `.env.local`
- Verify database is running
- Check firewall/network settings

## Next Steps

1. ✅ Start the server: `npm run dev`
2. ✅ Build your first tool in `/build`
3. ✅ Add API keys in `/settings`
4. ✅ Connect data sources
5. ✅ Deploy when ready

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **TailwindCSS:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev
- **TypeScript:** https://www.typescriptlang.org/docs

## Support

For issues or questions:
1. Check the README.md
2. Review the code comments
3. Check Next.js documentation
4. Update MEMORY.md with learnings

---

**Happy building! 🚀**

Questions? Check out the inline comments in the code or the main README.md.
