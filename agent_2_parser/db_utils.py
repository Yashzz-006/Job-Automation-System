import json
import os
from datetime import datetime, timezone

RAW_JOBS_PATH = os.path.join(os.path.dirname(__file__), "mock_data", "raw_jobs.json")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "mock_data", "output_parsed.json")


def _load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_unclassified_jobs():
    all_jobs = _load_json(RAW_JOBS_PATH)
    try:
        parsed = _load_json(OUTPUT_PATH)
    except FileNotFoundError:
        return all_jobs
    parsed_ids = {p["raw_job_id"] for p in parsed}
    return [j for j in all_jobs if j["id"] not in parsed_ids]


def insert_parsed_job(raw_job_id, domain, required_skills, experience_level,
                      experience_min, experience_max, degree_required,
                      employment_type, embedding):
    try:
        parsed = _load_json(OUTPUT_PATH)
    except FileNotFoundError:
        parsed = []
    parsed.append({
        "raw_job_id": raw_job_id,
        "domain": domain,
        "required_skills": required_skills,
        "experience_level": experience_level,
        "experience_min": experience_min,
        "experience_max": experience_max,
        "degree_required": degree_required,
        "employment_type": employment_type,
        "embedding": embedding,
        "embedding_dim": len(embedding),
        "parsed_at": datetime.now(timezone.utc).isoformat()
    })
    _save_json(OUTPUT_PATH, parsed)


def mark_classified(raw_job_id):
    pass
