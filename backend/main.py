from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import json
import os
import tempfile
import shutil
from pathlib import Path

# Import agents
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))

from agents.agent_1_scraper.scraper import JobScraperAgent
from agents.agent_2_parser.classifier import JobClassifierAgent
from agents.agent_3_resume.classifier import ResumeClassifierAgent
from agents.agent_4_matcher.matcher import MatchingAgent
from agents.agent_1_scraper.models import StudentProfile

app = FastAPI(title="JobSync AI API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
ROOT = Path(__file__).resolve().parent
OUTPUT_DIR = ROOT / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

SCRAPED_PATH = OUTPUT_DIR / "scraped_jobs.json"
CLASSIFIED_PATH = OUTPUT_DIR / "classified_jobs.json"
STUDENTS_PATH = OUTPUT_DIR / "student_profiles.json"
MATCHES_PATH = OUTPUT_DIR / "matches.json"


# Pydantic models
class LoginRequest(BaseModel):
    email: EmailStr
    role: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    role: str

class JobPostRequest(BaseModel):
    title: str
    company: str
    location: str
    description: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"
    source: str = "manual"


# Helper functions
def load_json(path: Path, default=None):
    if not path.exists():
        return default if default is not None else []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return default if default is not None else []


def save_json(path: Path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# Response formatter: maps agent snake_case -> frontend camelCase
def _format_profile(p: dict) -> dict:
    skills = p.get("required_skills") or p.get("skills") or []
    score = min(100, len(skills) * 6 + (10 if p.get("experience_min") else 0) + (5 if p.get("experience_max") else 0))
    score = max(score, p.get("resume_score") or p.get("resumeScore") or score)
    return {
        "student_id": p.get("student_id", ""),
        "name": p.get("name", ""),
        "email": p.get("email", ""),
        "resumeScore": min(100, score),
        "primaryDomain": p.get("domain") or p.get("primary_domain") or p.get("primaryDomain") or "General",
        "secondaryDomains": p.get("secondary_domains") or p.get("secondaryDomains") or [],
        "skills": skills,
        "required_skills": skills,
        "projects": p.get("projects") or [],
        "certifications": p.get("certifications") or [],
        "experience_min": p.get("experience_min", 0),
        "experience_max": p.get("experience_max"),
        "degree_required": p.get("degree_required", False),
        "employment_type": p.get("employment_type", "Full Time"),
    }


def _format_job(j: dict) -> dict:
    return {
        "id": j.get("source_id") or j.get("id", ""),
        "source_id": j.get("source_id", ""),
        "title": j.get("title", ""),
        "company": j.get("company", ""),
        "domain": j.get("domain", ""),
        "location": j.get("location") or "Remote",
        "type": j.get("employment_type") or j.get("type") or "",
        "employment_type": j.get("employment_type", ""),
        "jobType": j.get("employment_type") or j.get("type") or "",
        "level": j.get("experience_level", ""),
        "workMode": "Remote",
        "stipendOrCtc": j.get("stipend_or_ctc") or j.get("stipendOrCtc") or j.get("ctc") or j.get("salary") or "",
        "description": j.get("description") or "",
        "required_skills": j.get("required_skills") or [],
        "experience_level": j.get("experience_level", ""),
        "experience_min": j.get("experience_min"),
        "experience_max": j.get("experience_max"),
        "degree_required": j.get("degree_required", False),
        "source": j.get("source", ""),
        "embedding_dim": j.get("embedding_dim"),
        "logo": None,
    }


# Auth (simple token for demo)
active_tokens = {}

def get_current_user(token: str = None):
    if token and token in active_tokens:
        return active_tokens[token]
    # For demo: return first student if no token
    students = load_json(STUDENTS_PATH, [])
    if students:
        return {"user_id": students[0].get("student_id"), "name": students[0].get("name"), "email": students[0].get("email"), "role": "student"}
    return {"user_id": "STU001", "name": "Demo User", "email": "demo@example.com", "role": "student"}


# ===== AUTH ENDPOINTS =====
@app.post("/auth/login/")
async def login(data: LoginRequest):
    token = f"token-{data.email}"
    active_tokens[token] = {
        "name": data.email.split("@")[0],
        "email": data.email,
        "role": data.role
    }
    return {"token": token, "user": active_tokens[token]}


@app.post("/auth/register/")
async def register(data: RegisterRequest):
    token = f"token-{data.email}"
    active_tokens[token] = {
        "name": data.name,
        "email": data.email,
        "role": data.role
    }
    return {"token": token, "user": active_tokens[token]}


# ===== STUDENT ENDPOINTS =====
@app.post("/resume/upload/")
async def upload_resume(
    student_id: str = Form(None),
    name: str = Form(None),
    email: str = Form(None),
    resume: UploadFile = File(...)
):
    import uuid
    sid = student_id or f"STU{uuid.uuid4().hex[:4].upper()}"
    nm = name or "Unknown"
    em = email or "unknown@email.com"
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(resume.file, tmp)
        tmp_path = tmp.name
    
    try:
        # Run Agent 3 - Resume Classifier
        agent = ResumeClassifierAgent()
        profile = agent.run(sid, nm, em, tmp_path)
        
        # Save to student_profiles.json
        students = load_json(STUDENTS_PATH, [])
        students = [s for s in students if s.get("student_id") != sid]
        students.append(profile)
        save_json(STUDENTS_PATH, students)

        # Run Agent 4 - Matching Agent to compute matches for the new profile
        agent4 = MatchingAgent()
        agent4.run()

        return _format_profile(profile)
    finally:
        # Clean up temp file
        try:
            os.unlink(tmp_path)
        except:
            pass


@app.get("/student/profile/")
async def get_student_profile(token: str = None):
    user = get_current_user(token)
    students = load_json(STUDENTS_PATH, [])
    profile = next((s for s in students if s.get("student_id") == user.get("user_id")), None)
    if not profile:
        return {"message": "No profile found"}
    return _format_profile(profile)


@app.get("/matches/")
async def get_matches(token: str = None):
    user = get_current_user(token)
    matches = load_json(MATCHES_PATH, [])
    jobs = load_json(CLASSIFIED_PATH, [])
    
    student_matches = next((m for m in matches if m.get("student_id") == user.get("user_id")), None)
    if not student_matches:
        return {"matches": []}
    
    # Enrich each match with full job details + compute matched/missing skills
    enriched = []
    for m in student_matches.get("matches", []):
        job_title = m.get("job_title", "")
        company = m.get("company", "")
        # Find the matching job in classified_jobs
        job = next(
            (j for j in jobs if j.get("title") == job_title and j.get("company") == company),
            None
        )
        base = _format_job(job) if job else {
            "id": "",
            "title": job_title,
            "company": company,
            "domain": m.get("domain", ""),
        }
        base["match_score"] = round(m.get("match_score", 0) * 100, 1)
        base["cosine_similarity"] = m.get("cosine_similarity", 0)
        base["jaccard_similarity"] = m.get("jaccard_similarity", 0)
        
        # Compute matched/missing skills
        student_skills = set()
        students_list = load_json(STUDENTS_PATH, [])
        sp = next((s for s in students_list if s.get("student_id") == student_matches.get("student_id")), None)
        if sp:
            student_skills = set(sp.get("required_skills") or sp.get("skills") or [])
        
        job_skills = set(base.get("required_skills") or [])
        matched = list(student_skills & job_skills)
        missing = list(job_skills - student_skills)
        base["matchedSkills"] = matched
        base["missingSkills"] = missing
        base["matchedSkillsCount"] = len(matched)
        base["totlJobSkills"] = len(job_skills)
        
        enriched.append(base)
    
    enriched.sort(key=lambda x: x.get("match_score", 0), reverse=True)
    return {"matches": enriched}


@app.get("/jobs/{job_id}/")
async def get_job_detail(job_id: str, token: str = None):
    jobs = load_json(CLASSIFIED_PATH, [])
    job = next((j for j in jobs if j.get("source_id") == job_id or j.get("id") == job_id), None)
    if not job:
        raise HTTPException(404, "Job not found")

    result = _format_job(job)

    # Enrich with match data for the current student
    user = get_current_user(token)
    matches = load_json(MATCHES_PATH, [])
    student_matches = next((m for m in matches if m.get("student_id") == user.get("user_id")), None)
    if student_matches:
        match_entry = next(
            (m for m in student_matches.get("matches", [])
             if m.get("job_title") == job.get("title") and m.get("company") == job.get("company")),
            None
        )
        if match_entry:
            result["match_score"] = round(match_entry.get("match_score", 0) * 100, 1)

            # Compute matched/missing skills
            student_skills = set()
            students = load_json(STUDENTS_PATH, [])
            sp = next((s for s in students if s.get("student_id") == student_matches.get("student_id")), None)
            if sp:
                student_skills = set(sp.get("required_skills") or sp.get("skills") or [])

            job_skills = set(result.get("required_skills") or [])
            result["matchedSkills"] = list(student_skills & job_skills)
            result["missingSkills"] = list(job_skills - student_skills)

    return result


# ===== RECRUITER ENDPOINTS =====
@app.get("/recruiter/jobs/")
async def get_recruiter_jobs(token: str = None):
    jobs = load_json(CLASSIFIED_PATH, [])
    return jobs


@app.get("/jobs/")
async def get_jobs():
    jobs = load_json(CLASSIFIED_PATH, [])
    return jobs


@app.post("/jobs/")
async def post_job(job_data: JobPostRequest, token: str = None):
    jobs = load_json(CLASSIFIED_PATH, [])
    new_job = job_data.dict()
    new_job["id"] = f"job-{len(jobs)+1}"
    new_job["source"] = "manual"
    new_job["source_id"] = new_job["id"]
    jobs.append(new_job)
    save_json(CLASSIFIED_PATH, jobs)
    return new_job


@app.get("/jobs/{job_id}/candidates/")
async def get_candidates_for_job(job_id: str, token: str = None):
    # Find the job by ID to get title+company for matching
    jobs = load_json(CLASSIFIED_PATH, [])
    job = next((j for j in jobs if j.get("source_id") == job_id or j.get("id") == job_id), None)
    if not job:
        return []

    job_title = job.get("title", "")
    company = job.get("company", "")

    # Find matches for this job title+company
    matches = load_json(MATCHES_PATH, [])
    students = load_json(STUDENTS_PATH, [])

    enriched = []
    for m in matches:
        for match in m.get("matches", []):
            if match.get("job_title") == job_title and match.get("company") == company:
                student = next((s for s in students if s.get("student_id") == m.get("student_id")), None)
                student_skills = student.get("required_skills") or [] if student else []
                job_skills = job.get("required_skills") or []
                matched_skills = list(set(student_skills) & set(job_skills))
                missing_skills = list(set(job_skills) - set(student_skills))

                entry = {
                    "id": m.get("student_id"),
                    "student_id": m.get("student_id"),
                    "student_name": m.get("student_name"),
                    "name": m.get("student_name"),
                    "match_score": round(match.get("match_score", 0) * 100, 1),
                    "domain": match.get("domain", "") or (student.get("domain") if student else ""),
                    "skills": student_skills,
                    "matchedSkills": matched_skills,
                    "missingSkills": missing_skills,
                    "education": "",
                    "experience": "",
                }
                enriched.append(entry)

    enriched.sort(key=lambda x: x.get("match_score", 0), reverse=True)
    return enriched


@app.get("/candidates/{candidate_id}/")
async def get_candidate_detail(candidate_id: str, token: str = None):
    students = load_json(STUDENTS_PATH, [])
    student = next((s for s in students if s.get("student_id") == candidate_id), None)
    if not student:
        raise HTTPException(404, "Candidate not found")

    result = _format_profile(student)

    # Derive education/experience from available fields
    edu_parts = []
    if student.get("degree_required"):
        edu_parts.append("Degree Required")
    if student.get("domain"):
        edu_parts.append(student["domain"])
    result["education"] = " · ".join(edu_parts) if edu_parts else ""

    exp_min = student.get("experience_min", 0)
    exp_max = student.get("experience_max")
    if exp_min or exp_max:
        result["experience"] = f"{exp_min}-{exp_max or '∞'} years"
    else:
        result["experience"] = ""

    # Add match data (best match score)
    matches = load_json(MATCHES_PATH, [])
    student_match = next((m for m in matches if m.get("student_id") == candidate_id), None)
    if student_match and student_match.get("matches"):
        best = max(student_match["matches"], key=lambda x: x.get("match_score", 0))
        result["matchScore"] = round(best.get("match_score", 0) * 100, 1)

    return result


# ===== ADMIN / PIPELINE ENDPOINTS =====
@app.post("/pipeline/scrape")
async def trigger_scrape(profile: Optional[StudentProfile] = None):
    agent = JobScraperAgent()
    jobs = agent.run(profile=profile)
    return {"jobs_found": len(jobs)}


@app.post("/pipeline/classify")
async def trigger_classify():
    agent = JobClassifierAgent()
    classified = agent.run()
    return {"classified": len(classified)}


@app.post("/pipeline/match")
async def trigger_match():
    agent = MatchingAgent()
    matches = agent.run()
    return {"matches_computed": len(matches)}


@app.post("/pipeline/full")
async def full_pipeline(student_id: str = Form(...), name: str = Form(...), email: str = Form(...), resume: UploadFile = File(...)):
    # Run resume classifier
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(resume.file, tmp)
        tmp_path = tmp.name
    
    try:
        agent3 = ResumeClassifierAgent()
        profile = agent3.run(student_id, name, email, tmp_path)
        
        # Run matcher
        agent4 = MatchingAgent()
        matches = agent4.run()
        
        return {"profile": profile, "matches_computed": len(matches)}
    finally:
        try:
            os.unlink(tmp_path)
        except:
            pass


# Health check
@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)