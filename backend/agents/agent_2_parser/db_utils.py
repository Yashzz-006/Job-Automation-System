import json
import os
from datetime import datetime, timezone
from pathlib import Path

from .models import ParsedJob

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
SCRAPED_PATH = ROOT_DIR / "output" / "scraped_jobs.json"
OUTPUT_PATH = ROOT_DIR / "output" / "classified_jobs.json"


def _load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_unclassified_jobs():
    if not SCRAPED_PATH.exists():
        return []
    all_jobs = _load_json(str(SCRAPED_PATH))
    try:
        classified = _load_json(str(OUTPUT_PATH))
    except (FileNotFoundError, json.JSONDecodeError):
        classified = []
    classified_keys = {(c["source"], c["source_id"]) for c in classified}
    return [j for j in all_jobs if (j.get("source"), j.get("source_id")) not in classified_keys]


def insert_parsed_job(job: ParsedJob):
    try:
        classified = _load_json(str(OUTPUT_PATH))
    except (FileNotFoundError, json.JSONDecodeError):
        classified = []
    classified.append({
        "source": job.source,
        "source_id": job.source_id,
        "title": job.title,
        "company": job.company,
        "domain": job.domain,
        "required_skills": job.required_skills,
        "experience_level": job.experience_level,
        "experience_min": job.experience_min,
        "experience_max": job.experience_max,
        "degree_required": job.degree_required,
        "employment_type": job.employment_type,
        "embedding": job.embedding,
        "embedding_dim": len(job.embedding),
        "parsed_at": datetime.now(timezone.utc).isoformat(),
    })
    _save_json(str(OUTPUT_PATH), classified)
