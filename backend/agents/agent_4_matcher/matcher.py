import json
from pathlib import Path
from typing import Optional

from agents.base import BaseAgent
from ..agent_2_parser import embedding_service
from .scorer import cosine_similarity, jaccard_similarity

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
CLASSIFIED_PATH = ROOT_DIR / "output" / "classified_jobs.json"
STUDENTS_PATH = ROOT_DIR / "output" / "student_profiles.json"
OUTPUT_PATH = ROOT_DIR / "output" / "matches.json"


class MatchingAgent(BaseAgent):
    def __init__(self, config: Optional[dict] = None):
        super().__init__(name="matcher", config=config or {})

    def run(self):
        self.logger.info("[AI] ==========================================")
        self.logger.info("[AI] Agent 4 — Matching & Ranking Engine")
        self.logger.info(f"[AI] Jobs: {CLASSIFIED_PATH}")
        self.logger.info(f"[AI] Students: {STUDENTS_PATH}")

        classified = self._load_json(CLASSIFIED_PATH)
        students = self._load_json(STUDENTS_PATH)

        if not classified or not students:
            self.logger.warning("[AI] Missing data — need both classified jobs and student profiles")
            return []

        self.logger.info(f"[AI] {len(classified)} jobs x {len(students)} students")

        results = []
        for student in students:
            student_id = student["student_id"]
            student_name = student["name"]
            student_skills = student.get("skills", [])
            student_description = f"{student.get('primary_domain', '')} {' '.join(student.get('projects', []))}"

            student_embedding = embedding_service.generate(
                student_name, student_skills, student_description
            )

            matches = []
            for job in classified:
                job_embedding = job.get("embedding")
                job_skills = job.get("required_skills", [])

                if not job_embedding:
                    continue

                cos = cosine_similarity(job_embedding, student_embedding)
                jac = jaccard_similarity(job_skills, student_skills)
                score = 0.6 * cos + 0.4 * jac

                overlap = [s for s in student_skills if s.lower() in {js.lower() for js in job_skills}]

                matches.append({
                    "job_title": job["title"],
                    "company": job["company"],
                    "domain": job["domain"],
                    "match_score": round(score, 4),
                    "cosine_similarity": round(cos, 4),
                    "jaccard_similarity": round(jac, 4),
                    "match_reasons": overlap,
                    "matched_skills_count": len(overlap),
                    "total_job_skills": len(job_skills),
                })

            matches.sort(key=lambda m: m["match_score"], reverse=True)
            results.append({
                "student_id": student_id,
                "student_name": student_name,
                "matches": matches,
            })

        self._save_json(OUTPUT_PATH, results)
        self._log_summary(results)
        self.logger.info(f"[AI] Saved to: {OUTPUT_PATH}")
        self.logger.info("[AI] ==========================================")
        return results

    def _load_json(self, path):
        if not path.exists():
            return []
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _save_json(self, path, data):
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def _log_summary(self, results):
        for r in results:
            self.logger.info(f"[MATCH] {r['student_name']} ({r['student_id']})")
            for m in r["matches"][:3]:
                reasons = ", ".join(m["match_reasons"]) if m["match_reasons"] else "—"
                self.logger.info(
                    f"  {m['match_score']:.2f} | {m['domain']:15s} | {m['job_title'][:50]:50s} | "
                    f"skills: {reasons}"
                )
