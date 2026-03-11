# 🎮 Mission Control

A clean, Linear-inspired dashboard for building and managing custom automation tools. Run locally on your machine.

## Features

✨ **Modern UI**
- Dark mode inspired by Linear
- Clean, minimal design
- Smooth animations and transitions
- Responsive layout

🛠️ **Tool Management**
- Build custom automation tools
- Organize tools in a library
- Track tool status (draft, active, etc.)
- Quick access dashboard

⚙️ **Settings & Configuration**
- API key management
- Data source connections
- Webhook configuration
- Theme preferences

🔌 **Extensible**
- Ready for API integrations
- Webhook handlers
- Custom script support
- Easy to add new tool types

## Quick Start

### Prerequisites
- Node.js 18+ (check: `node --version`)
- npm 9+ (check: `npm --version`)

### Installation

```bash
cd mission-control
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- 🎨 Clean dark interface
- 📊 Dashboard with stats
- 🧰 Tools library section
- ⚡ Quick action buttons

## Project Structure

```
mission-control/
├── app/
│   ├── layout.tsx          # Main layout with sidebar & header
│   ├── page.tsx            # Dashboard homepage
│   ├── globals.css         # Global styles
│   ├── tools/
│   │   └── page.tsx        # Tools library page
│   ├── build/
│   │   └── page.tsx        # Tool builder page
│   └── settings/
│       └── page.tsx        # Settings & configuration
├── components/
│   ├── sidebar.tsx         # Left navigation
│   └── header.tsx          # Top header with search & time
├── public/
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Main dashboard |
| `/tools` | View all tools |
| `/build` | Create new tool |
| `/settings` | Configuration |

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + TailwindCSS
- **Icons:** Lucide React
- **Language:** TypeScript
- **Styling:** Tailwind CSS

## Customization

### Adding a New Navigation Item

Edit `components/sidebar.tsx`:

```tsx
const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Your New Page', href: '/newpage', icon: Icon },
];
```

### Creating a New Page

Create a new file in `app/` directory:

```tsx
// app/newpage/page.tsx
export default function NewPage() {
  return <div>Your content here</div>;
}
```

### Changing Colors

Edit `tailwind.config.ts` or use Tailwind classes directly:

```tsx
className="bg-blue-600 hover:bg-blue-700"
```

## Building Custom Tools

The `/build` page provides a framework for creating tools. To extend it:

1. Create a tool type (webhook, scheduled, API, etc.)
2. Define configuration schema
3. Add validation logic
4. Deploy to your backend

Example tool configuration:

```json
{
  "name": "Email Monitor",
  "type": "scheduled",
  "interval": "5m",
  "config": {
    "inbox": "support@example.com",
    "filter": "is:important"
  }
}
```

## API Routes (Placeholder)

Create API endpoints in `app/api/`:

```bash
app/api/
├── tools/
│   ├── route.ts          # GET/POST tools
│   └── [id]/route.ts     # GET/PUT/DELETE specific tool
├── webhooks/
│   └── default/route.ts  # Webhook handler
└── settings/
    └── route.ts          # Save/load settings
```

## Development

### Run in Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

### Lint Code

```bash
npm run lint
```

## Deployment

### Local (Current Setup)
Already running on `localhost:3000` with hot reload.

### To Host Online
1. Deploy to Vercel (recommended):
   ```bash
   npm install -g vercel
   vercel
   ```

2. Or deploy to any Node.js hosting:
   ```bash
   npm run build
   npm start
   ```

## Features Coming Soon

- 🔐 Authentication & user accounts
- 📊 Tool execution history & logs
- 🚀 One-click tool deployment
- 📈 Tool performance metrics
- 🔔 Real-time notifications
- 🤖 AI-powered tool suggestions
- 💾 Tool templates & marketplace

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Dependencies Issue
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npm run build
```

## Support & Contributing

- 📝 Update MEMORY.md with improvements
- 🐛 Report issues in workspace
- 📦 Add new skills as needed
- 🎨 Customize UI to your preference

## License

Built with ❤️ by Jarvis for Isaac's Mission Control

---

**Ready to build?** Start with `/build` to create your first tool.
