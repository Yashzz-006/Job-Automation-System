import time
import traceback
from typing import Optional

from agents.base import BaseAgent
from . import groq_service, embedding_service
from .db_utils import get_unclassified_jobs, insert_parsed_job
from .models import ParsedJob


class JobClassifierAgent(BaseAgent):
    def __init__(self, config: Optional[dict] = None):
        super().__init__(name="job_classifier", config=config or {})
        self.batch_size = self.config.get("batch_size", 50)

    def run(self):
        self.logger.info("[AI] ==========================================")
        self.logger.info("[AI] Agent 2 — Job Classifier")
        self.logger.info("[AI] Reading from: output/scraped_jobs.json")

        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY is required. Set it in .env")

        jobs = get_unclassified_jobs()
        if not jobs:
            self.logger.info("[AI] No unclassified jobs found")
            return []

        self.logger.info(f"[AI] Found {len(jobs)} unclassified job(s)")
        batch = jobs[:self.batch_size]
        classified = []

        for i, job in enumerate(batch, 1):
            try:
                self.logger.info(f"[{i}/{len(batch)}] {job.get('title', '?')} @ {job.get('company', '?')}")

                result = groq_service.classify(job, api_key=self.groq_api_key)

                embedding = embedding_service.generate(
                    job.get("title", ""),
                    result["required_skills"],
                    job.get("description", ""),
                )

                parsed = ParsedJob(
                    source=job.get("source", ""),
                    source_id=job.get("source_id", ""),
                    title=job.get("title", ""),
                    company=job.get("company", ""),
                    domain=result["domain"],
                    required_skills=result["required_skills"],
                    experience_level=result["experience_level"],
                    experience_min=result.get("experience_min"),
                    experience_max=result.get("experience_max"),
                    degree_required=result.get("degree_required", False),
                    employment_type=result["employment_type"],
                    embedding=embedding,
                )
                insert_parsed_job(parsed)
                classified.append(parsed)

                skills = result["required_skills"][:5]
                self.logger.info(f"  -> {result['domain']} | skills: {', '.join(skills)}")

            except Exception as e:
                self.logger.error(f"  -> FAILED: {e}")
                traceback.print_exc()

        self.logger.info(f"[AI] Done — {len(classified)} jobs classified")
        self.logger.info(f"[AI] Saved to: output/classified_jobs.json")
        self.logger.info("[AI] ==========================================")
        return classified
