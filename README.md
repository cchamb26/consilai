## 🎓 ConsilAI – Smart Teacher Assistant

> AI-powered student support and classroom management platform with interactive seating simulation and auto-generated learning plans.

---

### 🧠 What this project does

- **Profiles students** by issues, strengths, and goals.
- **Scrapes real research** from the web using Playwright and turns it into structured snippets.
- **Generates short, actionable learning plans** with Azure OpenAI (Phi) based on each student’s profile + research.
- **Simulates classroom seating** with a drag-and-drop grid to reason about classroom layout.

This repo is structured as a small monorepo so frontend + AI + scraper can evolve together during the hackathon.

---

### 🏗️ Monorepo layout

```text
consilai/
├── apps/
│   ├── frontend/          # Next.js UI (READY TO RUN ✅)
│   └── backend/           # Placeholder for future API server
├── packages/
│   ├── ai/                # AI models, prompts, and Azure Phi client
│   ├── scraper/           # Python Playwright + BeautifulSoup web scraper
│   └── db/                # (stub) future database layer
└── README.md              # You are here
```

---

### 🚀 Quickstart – Frontend (what judges can see)

#### Prerequisites
- Node.js 18+

#### Run the UI

```bash
cd apps/frontend
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

You’ll get:
- **Home** – overview and entry point.
- **Students** – list, filter, and view student profiles.
- **New Student** – create a profile (issues, strengths, goals, context).
- **Student Detail** – full profile view.
- **Classroom** – drag-and-drop seating chart.
- **Plans** – AI plan generator UI (currently wired to mock data, ready to connect to backend).

---

### 🔌 Quickstart – AI + Scraper demo (CLI)

This shows the **full chain** working: student profile → keyword expansion → Python scraper → Azure Phi → JSON plan.

#### 1) Prerequisites

- **Node.js 18+**
- **Python 3.11+** with:
  - `playwright`, `requests`, `beautifulsoup4`
  - Playwright Chromium installed

If you haven’t already installed them:

```bash
cd packages/scraper
python -m pip install playwright requests beautifulsoup4
python -m playwright install chromium
```

#### 2) Azure Phi environment variables

In the **same shell** where you’ll run the test, set (example using PowerShell on Windows):

```powershell
cd C:\Users\xncha\consilai\packages\ai

$env:AZURE_PHI_ENDPOINT = "https://<your-resource-name>.openai.azure.com/openai/v1/"
$env:AZURE_PHI_DEPLOYMENT = "<your-deployment-name>"      # e.g. Phi-4-mini-instruct
$env:AZURE_PHI_API_KEY = "<your-azure-openai-key>"

node -e "console.log(process.env.AZURE_PHI_ENDPOINT, process.env.AZURE_PHI_DEPLOYMENT, !!process.env.AZURE_PHI_API_KEY)"
```

You should see your endpoint, deployment name, and `true` for the key flag.

#### 3) Run the end‑to‑end demo

```bash
cd packages/ai
npm install
npm run build
node dist/manualTest.js
```

Expected output: a JSON `ShortTermPlan` object, for example:

```json
{
  "studentId": "s1",
  "durationWeeks": 3,
  "overallGoal": "Improve Jane Doe's sustained attention during independent work",
  "segments": [ /* week-by-week actions */ ],
  "notesForTeacher": "Monitor progress and adjust strategies as needed."
}
```

If this works, your **AI + scraper pipeline is fully operational**.

---

### 🧰 Tech stack

- **Frontend**
  - Next.js 14 (App Router)
  - React 18
  - Tailwind CSS
- **AI package (`packages/ai`)**
  - TypeScript
  - Azure OpenAI Phi via REST API
  - Deterministic keyword extraction + prompt builder
- **Scraper package (`packages/scraper`)**
  - Python 3
  - Playwright (Chromium)
  - BeautifulSoup4 + `requests`

---

### 🧩 How the AI pipeline works

1. **Student profile** (id, name, grade, issues, strengths, goals, context notes).
2. **Keyword extraction** via `extractStudentKeywords` (deterministic phrase/issue expansions).
3. **Search query** built from expanded keywords.
4. **Python scraper**:
   - Bing search for top results.
   - Playwright loads pages and strips boilerplate.
   - Text is cleaned and converted into research snippets.
5. **Prompt builder** assembles:
   - Student profile
   - Research snippets
   - Duration (2–3 weeks)
   into a single structured prompt string.
6. **Azure Phi** generates a JSON plan, which we parse into a strongly-typed `ShortTermPlan` object.

The core helpers live in `packages/ai`:
- `generateShortTermPlanWithScraper` – full chain: student → scraper → plan.
- `generateShortTermPlan` – expects precomputed research snippets.

---

### 🧪 Local development tips

- Frontend is **mock-data powered** and can be demoed without any backend setup.
- AI pipeline is tested via the CLI script only (no HTTP server yet), which keeps the hackathon scope manageable but still demonstrates real AI + scraping.
- To debug Azure responses, you can log `raw` in `planGenerator.ts` before JSON parsing.

---

### 🗺️ Roadmap / nice‑to‑have next steps

- **Backend API**:
  - HTTP endpoint wrapping `generateShortTermPlanWithScraper`.
  - Request: `StudentProfile` + duration; Response: `ShortTermPlan`.
- **Frontend integration**:
  - Wire `/plans` page to call the backend instead of using mock data.
  - Persist generated plans per student.
- **Database**:
  - Store students, research snippets, and plans for reuse.
- **Auth & multi‑teacher support**:
  - Basic login + class ownership.

---

### ⚠️ Security / secrets

- Keep Azure API keys in environment variables, **never** commit them.
- If a key was ever shared or logged, rotate it in the Azure Portal.

---

### 🙌 Credits & license

- Built for a hackathon using:
  - Next.js, React, Tailwind CSS
  - TypeScript, Node.js
  - Python, Playwright, BeautifulSoup
  - Azure OpenAI (Phi)
- License: Hackathon/demo use; adapt as needed for your own projects.

**Happy hacking! 🚀**

