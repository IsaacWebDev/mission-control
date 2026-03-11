# 🎮 Mission Control - Quick Start

Your personal tool builder dashboard is ready. Here's everything you need to know.

## Start in 10 Seconds

### Windows:
```bash
cd mission-control
start.bat
```

### Mac/Linux:
```bash
cd mission-control
bash start.sh
```

### Browser:
Open **http://localhost:3000** (or 3001 if 3000 is in use)

## What You'll See

A clean, Linear-style dashboard with:
- 📊 Dashboard overview
- 🧰 Tools library
- 🔨 Tool builder
- ⚙️ Settings

## Build Your First Tool

1. Click **"Build New Tool"** on the dashboard
2. Fill in details:
   - **Name:** Email Monitor
   - **Type:** Scheduled Task
   - **Config:** JSON settings
3. Click **Save Tool**
4. View it in the **Tools** section

## Key Features

✅ **Dashboard** - Overview of your tools  
✅ **Tool Builder** - Create webhook, scheduled, API, or custom tools  
✅ **Tools Library** - Browse and manage all tools  
✅ **Settings** - API keys, data sources, webhooks  
✅ **API Routes** - Ready for custom integrations  

## File Locations

```
C:\Users\isaac\.openclaw\workspace\mission-control\
├── app/                 # Pages & backend
├── components/          # Sidebar, Header
├── public/              # Static files
├── README.md           # Full documentation
├── SETUP.md            # Detailed setup guide
└── start.bat           # Quick start (Windows)
```

## Customize It

### Change Colors
Edit `app/globals.css` or any `.tsx` file:
```tsx
className="bg-blue-600"  // Change to your color
```

### Add a Page
Create new file in `app/`:
```tsx
// app/mypage/page.tsx
export default function MyPage() {
  return <div>Your content</div>;
}
```

### Connect to Database
Edit API routes in `app/api/` and add environment variables.

## Stop the Server

**Windows:** Press `Ctrl+C` in the terminal  
**Mac/Linux:** Press `Ctrl+C`

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Install dependencies
npm install

# Add new package
npm install package-name
```

## Troubleshooting

**Port 3000 in use?**  
→ Use 3001 instead (auto-selected)

**Dependencies error?**  
→ Run: `npm install`

**Broken pages?**  
→ Refresh browser (Ctrl+R or Cmd+R)

## Next Steps

1. ✅ Run the server
2. ✅ Build a tool in `/build`
3. ✅ Add API keys in `/settings`
4. ✅ Connect data sources
5. ✅ Deploy when ready

## Resources

- **Full Docs:** README.md
- **Setup Guide:** SETUP.md
- **Code Help:** Check comments in files
- **Next.js:** https://nextjs.org

---

**Questions?** Check README.md or SETUP.md

**Ready to build?** Run `start.bat` and go to `/build`

**Enjoy! 🚀**
