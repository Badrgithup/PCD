# FinScore PME 🚀
*Redefining Credit & Solvency Assessments for Tunisian SMEs*

**FinScore PME** is a comprehensive Financial Technology (FinTech) Software-as-a-Service (SaaS) platform built to bridge the trust gap between emerging Tunisian Small & Medium Enterprises (SMEs) and institutional investors/banks. Through our proprietary **Dual-Model Stacked ML Pipeline**, we accurately generate a reliable FinScore without relying solely on traditional banking data.

---

## ⚙️ Architecture & Technical Stack

The system is deployed as a decoupled Monorepo featuring an API-first Backend and a heavily animated, state-managed Frontend application.

### 🎨 Frontend (Client-Side)
- **Framework:** Next.js 14 (App Router Architecture)
- **UI & Styling:** Tailwind CSS, Framer Motion (for declarative animations), Glassmorphism UI tokens.
- **Global State:** Zustand (for JWT-persisted Authentication Flows).
- **Data Visualization:** Recharts (used to dynamically render positive/negative SHAP ML weights).
- **Network Layer:** Axios with Interceptor middleware for automatic 401 un-auth redirects and global Token header attachment.

### 🧠 Backend & ML (Server-Side)
- **Web API Backbone:** FastAPI (Asynchronous Python API).
- **Database Wrapper:** SQLAlchemy (ORM) utilizing SQLite natively (easily migratable to PostgreSQL).
- **Authentication:** OAuth2 with Password Bearer, pyjwt (JSON Web Tokens), and raw `bcrypt` for bulletproof hashing.
- **Data Validation:** Pydantic Models for strict type coercion before ML inference.
- **Machine Learning Layer:** Scikit-Learn pipelines stored as `.joblib` binary weights implementing localized Dual-Model Gradient Boosting / Random Forests.

---

## 🧠 Core System Logic & AI Routing

The platform handles two primary user roles seamlessly, utilizing role-based access control (RBAC):

### 1. The SME Dashboard (PME Flow)
When an SME logs in, they access an interactive **Comprehensive AI Assessment** module. Recognizing that Tunisian SMEs often lack deep formalized banking history, the system gathers 15 unique footprint metrics categorized logically:
*   **Module 1 (Finance):** Sector, Turnover, Margin, Expenses, Owner count.
*   **Module 2 (Employment):** Total Workers, CNSS-Verified Staff (measures formal economy compliance ratio).
*   **Module 3 (Behavioral Track):** RNE/STEG metrics, coupled with Social Media engagement (FB/Insta/LinkedIn followings and posts).

**The Inference Logic:** The data securely flows to the FastAPI layer where it hits a **Stacked Inference Pipeline**:
*   *Model 1:* Evaluates structural financial bounds.
*   *Model 2:* Evaluates soft-signals (utility payment consistency, web prominence, social behavior).
*   *Meta-Model:* Combines probabilities to declare a strict Risk Tier (Low/Medium/High Risk) and a numeric FinScore globally capped at 1000.  The model additionally calculates localized SHAP (SHapley Additive exPlanations) values to tell the SME *exactly* which features increased or degraded their score.

### 2. The Investor Marketplace & Dashboard
Institutional Investors land on a secure marketplace pulling dynamic metadata directly from the backend.
*   **Marketplace logic:** Renders active profiles alongside their vetted FinScores, abstracting massive ML calculation bounds into simple "Green/Yellow/Red" badge alerts.
*   **Quick-Score Terminal:** Investors have access to a distinct manual terminal dashboard allowing them to simulate/input arbitrary data strings to cross-reference with our models internally—complete with mock localized auto-scrape integrations mimicking direct RNE registry scrapes.

---

## 🚀 Quick Start Guide (Local Setup)

Want to spin the platform up natively?

### 1. Clone & Prep
```bash
git clone https://github.com/Badrgithup/PCD.git
cd PCD
```

### 2. Bootstrapping the Backend (FastAPI)
*Requires Python 3.9+*
```bash
cd credit-risk-analysis/backend
python -m venv .venv

# Activate Virtual Environment
source .venv/bin/activate      # On Linux/Mac
.\.venv\Scripts\activate       # On Windows PowerShell

pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
> Your backend will be continuously serving traffic at `http://localhost:8000`. You can preview the interactive Swagger REST API documentation at `http://localhost:8000/docs`.

### 3. Bootstrapping the React Frontend
*Requires Node.js 18+*
```bash
cd v2-pme-frontend
npm install
npm run dev
```
> Navigate to `http://localhost:3000` to interact with the platform natively.

---

## 🔒 Security & Standards
*   **JWT Transports:** Auth flows omit sessions in favor of decentralized local storage token strategies validated strictly via Python-jose validation endpoints.
*   **Rate Limits / Fallbacks:** External API lookups fallback gracefully to hardcoded "Demo Maps" ensuring board-level presentations operate seamlessly even without internet access.
*   **Binary Ignoring:** All bloated Dataframes, `.joblib` ML bounds, and compiled `.next` payload caches have been rigorously detached via `.gitignore` to keep git CI/CD deployment channels lightweight.
