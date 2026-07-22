# JobSync AI — Multi-Agent Career Matching Engine

### A 24-Hour Hackathon Project Description

---

## 1. Title

**JobSync AI: An Autonomous Multi-Agent System for Domain-Aware Job Discovery and Student-Job Matching**

---

## 2. Problem Statement

Final-year and pre-final-year students face two disconnected problems during placement season:

1. **Job discovery is fragmented and manual.** Fresher-level openings are scattered across LinkedIn, Naukri, Internshala, company career pages, and WhatsApp groups. Students spend hours searching instead of preparing.
2. **Relevance is not personalized.** Even when a student finds a job board, they see the same undifferentiated list as everyone else — a DevOps-focused student and a full-stack-focused student get identical results, with no ranking by fit.

At the same time, career cells and mentors classify students informally ("this student is more ML-leaning, that one is full-stack") but this classification never connects back to the live job market.

**There is no system that closes the loop: scrape the market → understand the market → understand the student → match the two.**

---

## 3. Proposed Solution

JobSync AI is a four-agent pipeline where each agent has exactly one responsibility, and the agents communicate through a shared database rather than tight coupling — making the system modular, demonstrable, and easy to extend after the hackathon.

| Agent | Responsibility | Input | Output |
|---|---|---|---|
| **Agent 1 — Job Scraper** | Continuously pulls fresh job postings from external sources | Job board APIs | Raw, unstructured job postings |
| **Agent 2 — Job Parser & Classifier** | Converts raw postings into structured, domain-tagged records | Raw postings | Structured jobs tagged by domain (Full Stack, DevOps, ML, Cybersecurity, Testing, Salesforce, etc.) with extracted skills |
| **Agent 3 — Resume Classifier** | Reads a student's resume and determines their domain(s) and skill profile | Uploaded PDF resume | Structured student profile: primary/secondary domain, skill list, embedding vector |
| **Agent 4 — Matching & Ranking Engine** | Computes a compatibility score between every student and every relevant job | Structured jobs + structured student profiles | Ranked job list per student, with match percentage and matched skills |

When a student logs in, they see a dashboard of jobs sorted highest-match-first — generated entirely by this pipeline, with no manual curation.

---

## 4. Objectives

- Automate end-to-end job discovery so students never manually search job boards.
- Classify both jobs and resumes into a shared domain taxonomy so they can be compared meaningfully.
- Produce an **explainable** match score (not a black-box percentage) — show *why* a job matched.
- Build a system that is realistically demoable and deployable within 24 hours, using tools the team already knows.
- Design the architecture so each agent could later be swapped, scaled, or run independently (microservice-ready).

---

## 5. System Architecture

**Pipeline flow:**

```
Job portals/APIs ──► Agent 1 (Scraper) ──► Agent 2 (Job Classifier) ──► Jobs DB ─┐
                                                                                    ├──► Agent 4 (Matching Engine) ──► Student Dashboard
Student resume upload ──► Agent 3 (Resume Classifier) ──► Student Profile DB ────┘
```

- **Two independent ingestion pipelines** (job-side and student-side) that never block each other.
- Both pipelines converge only at Agent 4, which is the sole point of integration — this keeps the system loosely coupled and easy to debug during the hackathon.
- Agent 4 precomputes and caches scores rather than computing live on every login, keeping the dashboard fast.

**Orchestration model:** Django + Celery + Redis. Each agent is a Celery task (or a manually-triggerable endpoint for live demo control), giving genuine "autonomous agents" framing rather than one monolithic script.

---

## 6. Detailed Agent Design

### Agent 1 — Job Scraper
- Sources: Adzuna API (free, structured, reliable — avoids scraping-block issues with LinkedIn/Naukri), RemoteOK API, Internshala RSS as backup.
- Stores raw postings in a `raw_jobs` table: title, description, company, source, link, scraped_at.
- Runs on a scheduled Celery beat task; also exposed as a manual "Run scrape now" endpoint for live demo control.

### Agent 2 — Job Parser & Classifier
- For each raw posting, sends the description to Groq (Llama 3.3 70B) with a structured JSON-output prompt.
- Extracts: `domain`, `required_skills[]`, `experience_level`, `location`, `stipend_or_ctc`.
- Generates a sentence-transformer embedding of the skills + description for later vector similarity.
- Writes to `jobs` table with an embedding column (pgvector).

### Agent 3 — Resume Classifier
- Accepts PDF upload on student registration/login.
- Extracts text via `pdfplumber`.
- Sends extracted text to Groq with a classification prompt: primary domain, secondary domains, explicit skill list, inferred experience signals (projects, internships).
- Generates an embedding using the **same** sentence-transformer model as Agent 2, so job and student vectors are directly comparable.
- Writes to `student_profiles` table.

### Agent 4 — Matching & Ranking Engine
- Hybrid scoring formula:
  ```
  match_score = 0.6 × cosine_similarity(job_embedding, student_embedding)
              + 0.4 × jaccard_similarity(job_skills, student_skills)
  ```
- The Jaccard component is what makes the score **explainable**: the overlapping skill set is returned alongside the score, so the UI can say "matched because: React, Node.js, MongoDB" instead of a bare number.
- Scores are computed per student and cached; recomputed when either the student's profile or the job pool changes.
- Exposed via `GET /api/matches/` → returns jobs sorted descending by score, each with a `match_reasons` field.

---

## 7. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Backend framework | Django REST Framework | Proven in prior full-stack builds; fast to scaffold |
| Task orchestration | Celery + Redis | Standard pattern for independent agent execution |
| LLM inference | Groq API (Llama 3.3 70B) | Very low latency — critical for a live hackathon demo |
| Embeddings | sentence-transformers (`all-MiniLM-L6-v2`) | Free, local, no extra API dependency |
| Database | PostgreSQL + pgvector | Real vector similarity search, not a Python-loop approximation |
| Frontend | React | Fast to build a dashboard UI |
| Authentication | JWT, role-based (student) | Reusable pattern from prior projects |
| Job data source | Adzuna API | Free tier, structured JSON, no scraping risk |
| Resume parsing | pdfplumber | Reliable text extraction from PDF resumes |
| Deployment | Render/Railway (backend), Vercel (frontend) | Judges need a live URL, not localhost |

---

## 8. Key Differentiators (what to emphasize to judges)

1. **Genuine multi-agent architecture**, not a single script — each agent has one job, runs independently, and is individually demoable.
2. **Explainability by design** — every match comes with a "why," not just a percentage. This mirrors real explainable-AI practice, not just a marketing term.
3. **Real vector search** (pgvector) instead of a fake cosine-similarity-in-a-for-loop, which is easy to demonstrate live in a query console.
4. **Domain taxonomy shared across both pipelines** — the same categories classify jobs and students, which is what makes the matching mathematically meaningful.
5. **Deployed, working live demo** with real scraped data — not mocked JSON.

---

## 9. Expected Outcome / Demo Flow

1. Judges see a live dashboard: trigger Agent 1 → watch new jobs populate in the admin/DB view within seconds (Groq's speed sells this).
2. A test student account uploads a resume live → Agent 3 classifies it in real time.
3. Judges refresh the student dashboard → ranked job list appears, top-match job explained with matched skills.
4. Close with the architecture diagram, framing it explicitly as four autonomous agents integrated by a scoring layer.

---

## 10. Feasibility Within 24 Hours

The entire stack (Django, React, Groq, JWT auth) is already proven from prior projects, which removes tooling risk. The build is scoped to 2–3 job domains and a working end-to-end pipeline rather than broad domain coverage — depth of a working demo beats breadth of an unfinished one.

---

## 11. Future Scope (mention briefly in pitch, don't build)

- WhatsApp/email notifications when a high-match job appears.
- Resume improvement suggestions based on skill gaps against target-domain jobs.
- Recruiter-side dashboard to see ranked candidates per posting (reverse of the current flow).
