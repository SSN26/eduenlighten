# EduEnlighten Digital School Platform

> **Tagline:** Empowering Minds. Unlocking Potential.  
> **Mission:** To make quality education and practical digital skills accessible to learners everywhere through modern technology, qualified educators, and flexible online learning.

---

## 1. Architectural Overview

EduEnlighten is an enterprise-grade digital school platform designed as a scalable online educational business. The platform supports:
- **High School Academy:**
  - **Cambridge International Pathway:** Cambridge Lower Secondary, IGCSE, AS Level, and A Level.
  - **ZIMSEC Pathway:** Zimbabwe national curriculum for Ordinary Level (O-Level) and Advanced Level (A-Level) candidates with past-paper revision emphasis.
- **Digital Skills Academy:**
  - Project-based, employable digital training (Frontend Web Development with React/Next.js, Backend REST APIs with Node.js/MongoDB, Product Management, and Digital Marketing).
- **Teacher Recruitment & Vetting Portal:**
  - Full recruitment pipeline (`submitted` → `under_review` → `interview_scheduled` → `approved`/`rejected`), credential verification, and child safeguarding checks.
- **Learning Delivery Engine:**
  - HD recorded video lessons, scheduled live video classrooms (Jitsi/custom provider abstraction), downloadable syllabus resources, and module progress tracking.
- **Assessments & Cryptographic Certificates:**
  - Timed quizzes with automated grading, practical capstone submissions with teacher feedback rubrics, and tamper-proof SHA-256 verifiable certificates (`EDU-YYYY-XXXX`).
- **Flexible Commercial Engine:**
  - Free courses, one-off purchases, and scholarships/sponsored access with payment provider abstractions for Zimbabwean payment methods (Paynow, EcoCash, OneMoney) and international credit/debit cards.

---

## 2. Technology Stack

### Frontend (`/client`)
- **Framework:** Next.js 16 (App Router) with React 19 & TypeScript
- **Styling:** Vanilla Tailwind CSS with custom design system (Deep Navy `#060D17`, `#0B192C`, Vibrant Teal `#008080`, `#0E7490`, Cyan `#06B6D4`, Amber `#F59E0B`)
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form & Zod
- **Networking:** Type-safe API client with HTTP-only cookie support and reverse proxy rewrite (`/api/*` → `http://localhost:5000/api/*`)

### Backend (`/server`)
- **Runtime:** Node.js (v24+) & TypeScript
- **Web Framework:** Express.js 4/5 REST API
- **Database:** MongoDB with Mongoose ODM (includes fallback connection resilience)
- **Security & Auth:** Argon2id / Bcrypt password hashing, JWT in secure HTTP-only cookies, Helmet, CORS, and role-based access control (RBAC) middleware
- **Architecture:** Modular separation: `config/`, `models/`, `modules/`, `middleware/`, `integrations/`, `scripts/`

---

## 3. Directory Structure

```text
eduenlighten/
├── client/                     # Next.js App Router Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/       # Home, About, High School (Cambridge & ZIMSEC), Digital Skills
│   │   │   ├── courses/        # Searchable Catalogue & Course Detail
│   │   │   ├── teach/          # Educator Recruitment & Multi-Step Application Form
│   │   │   ├── auth/           # Login & Registration with Role Selection
│   │   │   ├── student/        # Student Learning Dashboard & Live Sessions
│   │   │   ├── teacher/        # Instructor Portal, Live Scheduler & Grading Studio
│   │   │   ├── admin/          # Super Admin Analytics & Teacher Review Pipeline
│   │   │   ├── verify/[certId] # Tamper-Proof Public Certificate Verification
│   │   │   ├── scholarships/   # Financial Aid & Sponsored Learning
│   │   │   ├── safeguarding/   # Child Safeguarding Code & Protection Policy
│   │   │   ├── contact/        # Support Ticket Submission
│   │   │   ├── faq/            # Interactive FAQ Accordion
│   │   │   ├── globals.css     # Design System Tokens & Glassmorphism
│   │   │   └── layout.tsx      # Root Layout with Header & Footer
│   │   ├── components/         # Header, Footer, Course Cards, Modals
│   │   └── lib/                # apiFetch client and utilities
│   ├── next.config.ts          # API reverse proxy configuration
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── src/
│   │   ├── config/             # Environment & MongoDB connection manager
│   │   ├── middleware/         # Auth (JWT/RBAC), Zod Validation, Error Handler
│   │   ├── models/             # Mongoose Schemas (User, Course, Application, etc.)
│   │   ├── modules/
│   │   │   ├── auth/           # Registration, Login, Logout, Profile
│   │   │   ├── teacher-apps/   # Recruitment, Review Workflow, Promotion
│   │   │   ├── programmes/     # Cambridge, ZIMSEC, Digital Skills pathways
│   │   │   ├── courses/        # Catalogue, Modules, Lessons, Approvals
│   │   │   ├── enrolments/     # Enrolment, Progress Tracking, Certificate Triggers
│   │   │   ├── live-classes/   # Scheduled Sessions, Jitsi Room Generation, Attendance
│   │   │   ├── assessments/    # Quizzes, Automated Marking, Assignments, Grading
│   │   │   ├── certificates/   # SHA-256 Hashing, Issuance, Public Verification
│   │   │   ├── payments/       # Paynow Zimbabwe / EcoCash / Scholarship engine
│   │   │   ├── analytics/      # Multi-Role Dashboard Metrics
│   │   │   └── support/        # Support Ticket Logging
│   │   ├── scripts/
│   │   │   ├── seed.ts         # Rich database seeder with demo accounts & courses
│   │   │   └── test-runner.ts  # Automated test suite
│   │   ├── app.ts              # Express App setup & middleware
│   │   └── server.ts           # Server bootstrap
│   ├── tsconfig.json
│   └── package.json
│
├── package.json                # Root monorepo workspace configuration
└── README.md
```

---

## 4. User Roles & Permission Matrix

| User Role | Description | Core Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | Platform Owner | Platform analytics, revenue oversight, teacher approvals, account management, audit logs. |
| **Academic Admin** | Academic Dean / Staff | Curricula & subject configuration, examination schedules, course review & quality approval. |
| **Teacher / Instructor**| Approved Educator | Course creation studio, lesson management, scheduling live classes, assignment grading. |
| **Student / Learner** | Enrolled Student | Browsing catalogue, video lessons, live classes, quizzes, capstone projects, certificates. |
| **Parent / Guardian** | Guardian Account | Linked student progress tracking, attendance reports, grade view, safeguarding consent. |

---

## 5. Seeded Demo Test Credentials

To test user journeys immediately, run `npm run seed` in the server:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Administrator** | `admin@eduenlighten.ac` | `AdminPass123!` |
| **Academic Dean** | `academic@eduenlighten.ac` | `AcademicPass123!` |
| **Teacher (Cambridge / Tech)** | `dr.chiware@eduenlighten.ac` | `TeacherPass123!` |
| **Teacher (ZIMSEC Specialist)**| `mrs.moyo@eduenlighten.ac` | `TeacherPass123!` |
| **Student** | `tawanda@student.eduenlighten.ac` | `StudentPass123!` |
| **Parent** | `parent.moyo@eduenlighten.ac` | `ParentPass123!` |

*(These test accounts can also be populated automatically via the quick-fill buttons on the `/auth/login` page).*

---

## 6. Local Development Setup

### Prerequisites
- Node.js v20+ or v24+
- npm v10+
- MongoDB instance running locally (or a free MongoDB Atlas connection string)

### Step 1: Install Dependencies
From the repository root:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy the example environment file in `server/`:
```bash
cp server/.env.example server/.env
```
*(The defaults are preconfigured for local development with port 5000 and client port 3000).*

### Step 3: Seed Database (Optional but Recommended)
Populate sample courses, Cambridge and ZIMSEC subjects, and demo users:
```bash
npm run seed --workspace=server
```

### Step 4: Run Development Servers
Start both backend (port 5000) and frontend (port 3000):
```bash
# Start backend API:
npm run dev --workspace=server

# Start frontend Next.js App:
npm run dev --workspace=client
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Automated Testing & Verification

Run the comprehensive automated test suite verifying password encryption, JWT authorization, cryptographic certificate verification, and scoring engines:

```bash
npm run test --workspace=server
```

To build production bundles for both server and client:
```bash
npm run build --workspace=server
npm run build --workspace=client
```

---

## 8. Compliance & Disclaimers

> **Academic Notice:** EduEnlighten is an independent digital education platform offering syllabus-aligned preparation and structured instruction. We do not claim accreditation as an official Cambridge International or ZIMSEC examination centre. Students independently sit formal national or international examinations at accredited local centres. Platform-issued certificates verify course completion and practical project submission.
