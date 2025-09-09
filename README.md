![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-3.x-FF6384?logo=chart.js)
![License](https://img.shields.io/badge/License-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

> "Threat Intelligence Dashboard" to track, visualize, and manage "Indicators of Compromise (IOCs)"  
> Built with "Next.js + TypeScript + Zustand + Recharts + TailwindCSS" for performance & scalability.

---

 📑 Table of Contents
1. [🌍 Overview](  -overview)
2. [✨ Features](  -features)
3. [🛠 Tech Stack](  -tech-stack)
4. [📂 Folder Structure](  -folder-structure)
5. [📝 Detailed File Explanation](  -detailed-file-explanation)
6. [⚡ Setup & Installation](  -setup--installation)
7. [⚙️ Configuration](  %EF%B8%8F-configuration)
8. [🎨 Theming & Customization](  -theming--customization)
9. [📊 Showcase](  -showcase)
10. [🔄 Usage Examples](  -usage-examples)
11. [🐛 Troubleshooting](  -troubleshooting)
12. [🤝 Contribution Guide](  -contribution-guide)
13. [📜 License](  -license)
14. [📞 Contact](  -contact)
15. [❓ FAQs](  -faqs)
16. [🙏 Acknowledgements](  -acknowledgements)
17. [📌 Project Status](  -project-status)

---

 🌍 Overview
ThreatFeed UI is a "modern analytics dashboard" for security teams to "monitor and analyze threat feeds" in real time.  
It provides "charts, filters, and auto-refresh capabilities" with a "clean, responsive, and dark/light theming".

✅ Ideal for:
- SOC (Security Operations Centers)  
- Threat Analysts  
- Red/Blue Teams  
- Security Researchers  

---

 ✨ Features
- 🎨 "Modern Dashboard Layout"
- 🌙 "Theme Toggle (Dark / Light mode)"
- 🔄 "Manual & Auto Refresh"
- 🧩 "Modular Components" (Charts, Tables, Filters)
- 📊 "Rich Visualizations (Pie, Line, Bar, Waterfall)"
- 🪝 "Global State via Zustand"
- 📱 "Responsive UI (Desktop + Mobile)"
- 🚀 "Optimized with Next.js (App Router)"
- 🛡️ "Strict TypeScript typing"
- ⚙️ "Settings Panel" (toggle auto-refresh, filters, etc.)

---

 🛠 Tech Stack

| Technology        | Version | Purpose                         |
|-------------------|---------|---------------------------------|
| "Next.js"       | 15.5.2  | App Router, SSR/SSG             |
| "TypeScript"    | 5.x     | Type safety                     |
| "TailwindCSS"   | 4.x     | Styling & responsiveness        |
| "Zustand"       | 5.x     | Global state management         |
| "Recharts"      | 3.x     | Data visualization              |
| "Axios"         | 1.x     | API requests                    |
| "Framer Motion" | 12.x    | Animations                      |
| "Lucide React"  | 0.5x    | Icons                           |
| "Day.js"        | 1.x     | Date/time parsing               |

---

 📂 Folder Structure

```

threatfeed-ui/
├── public/                 Static assets (icons, demo JSON feeds)
├── src/
│   ├── app/                Next.js App Router (pages/layouts)
│   ├── components/         Reusable UI components
│   │   └── ui/charts/      Chart widgets
│   ├── hooks/              Custom React hooks
│   ├── lib/                API utils, dedupe logic
│   ├── store/              Zustand global stores
│   └── types/              TypeScript interfaces
├── package.json
├── tailwind.config.js
└── tsconfig.json

````

---

 📝 Detailed File Explanation

<details>
<summary>📂 <code>public/</code></summary>

- `favicon.ico` → App favicon  
- `globe.svg` → World icon  
- `iocs.json` → Sample IOC dataset  

</details>

<details>
<summary>📂 <code>src/app/</code></summary>

- `layout.tsx` → Root layout with theme provider  
- `page.tsx` → Dashboard entry page  
- `globals.css` → TailwindCSS + overrides  

</details>

<details>
<summary>📂 <code>src/components/</code></summary>

- `Card.tsx` → Reusable animated card  
- `ThreatTable.tsx` → IOC table with filters  
- `ui/charts/` → Chart components (Pie, Line, Bar, Waterfall)  

</details>

<details>
<summary>📂 <code>src/store/</code></summary>

- `iocStore.ts` → Global IOC + filter state  

</details>

---

 ⚡ Setup & Installation

   1️⃣ Clone repo
```bash
git clone https://github.com/your-org/threatfeed-ui.git
cd threatfeed-ui
````

   2️⃣ Install deps

```bash
npm install
```

   3️⃣ Run dev server

```bash
npm run dev
```

👉 Open: [http://localhost:3000](http://localhost:3000)

   4️⃣ Build for production

```bash
npm run build
npm start
```

---

 ⚙️ Configuration

Create `.env.local` file:

```ini
NEXT_PUBLIC_API_URL=https://api.your-threat-feed.com
NEXT_PUBLIC_REFRESH_INTERVAL=60000
```

---

 🎨 Theming & Customization

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: "  06b6d4",
      danger: "  ef4444",
      accent: "  a855f7",
    },
  },
}
```

---

 📊 Showcase

   🔹 IOC Distribution

Pie chart with % + values

   🔹 IOC Daily Totals

Stacked bar chart

   🔹 IOC Running Totals

Line chart

   🔹 IOC Daily Change

Waterfall visualization

---

 🔄 Usage Examples

   Fetch IOCs

```ts
import axios from "axios";

export async function getIOCs() {
  const { data } = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/iocs");
  return data;
}
```

   Auto Refresh Hook

```ts
import { useEffect } from "react";
import { getIOCs } from "@/lib/api";
import { useIOCStore } from "@/store/iocStore";

export function useAutoRefresh() {
  useEffect(() => {
    const timer = setInterval(async () => {
      const iocs = await getIOCs();
      useIOCStore.setState({ iocs });
    }, 60000);
    return () => clearInterval(timer);
  }, []);
}
```

---

 🐛 Troubleshooting

| Issue                      | Cause                  | Fix                              |
| -------------------------- | ---------------------- | -------------------------------- |
| `Type error`               | Wrong TS definitions   | Update types in `/types`         |
| `Chart not rendering`      | Malformed IOC data     | Validate + dedupe before render  |
| `Fetch failed`             | Wrong API URL / CORS   | Update `.env.local`              |
| `Theme toggle not working` | Missing provider setup | Ensure `<ThemeProvider>` in root |

---

 🤝 Contribution Guide

1. "Fork" the repo
2. "Branch" → `git checkout -b feature/xyz`
3. "Commit" with clear message
4. "Push" → `git push origin feature/xyz`
5. "Open PR" 🎉

✅ Run lint: `npm run lint`
✅ Strict TypeScript enforced

---

 📞 Contact

* GitHub Issues → for bugs & requests
* Email → panwarshiv853@gmail.com

---

 ❓ FAQs

| Q                                 | A                                                |
| --------------------------------- | ------------------------------------------------ |
| "What is an IOC?"               | Indicator of Compromise (IP, URL, hash).         |          |
| "Why Zustand?"                  | Lightweight, no boilerplate vs Redux.            |
| "How to add new charts?"        | Create component in `src/components/ui/charts/`. |

---

 🙏 Acknowledgements

* [Next.js](https://nextjs.org/)
* [TailwindCSS](https://tailwindcss.com/)
* [Recharts](https://recharts.org/)
* Security community inspiration 

---

 📌 Project Status

| Status           | Details                      |
| ---------------- | ---------------------------- |
| ✅ Active Dev     | New features & fixes ongoing |
| 🌍 Production    | Deployable on Vercel/Netlify |
| 🔗 Contributions | Open for community PRs       |


👉 Chaahe mai isme "Screenshots / GIFs section" bhi dal du demo visuals ke liye?
```
