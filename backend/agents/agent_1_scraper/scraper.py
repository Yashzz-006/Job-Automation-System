from typing import List, Optional

from groq import Groq

from agents.base import BaseAgent
from .models import RawJob, StudentProfile
from .cleaner import clean_job_description
from .retry import retry
from .writer import BaseWriter, JsonWriter
from .planner import plan_search
from .filter import rank_jobs
from .sources import (
    AdzunaSource,
    ArbeitnowSource,
    RemoteOKSource,
    RemotiveSource,
    GreenhouseSource,
    TheMuseSource,
    AshbySource,
    SmartRecruitersSource,
    BaseSource,
)


class JobScraperAgent(BaseAgent):
    def __init__(self, config: Optional[dict] = None):
        super().__init__(name="job_scraper", config=config or {})
        self.sources: List[BaseSource] = []
        self.writer: BaseWriter = self._init_writer()
        self._init_sources()
        self._init_groq()

    def _init_writer(self) -> BaseWriter:
        return JsonWriter()

    def _init_groq(self):
        if not self.groq_api_key:
            raise ValueError(
                "GROQ_API_KEY is required. Agent 1 uses AI planning + filtering. "
                "Set GROQ_API_KEY in .env"
            )
        self.groq_client = Groq(api_key=self.groq_api_key)
        self.logger.info("[AI] Groq client initialized")

    def _init_sources(self):
        source_map = {
            "adzuna": AdzunaSource,
            "arbeitnow": ArbeitnowSource,
            "remoteok": RemoteOKSource,
            "remotive": RemotiveSource,
            "greenhouse": GreenhouseSource,
            "themuse": TheMuseSource,
            "ashby": AshbySource,
            "smartrecruiters": SmartRecruitersSource,
        }

        enabled = self.config.get("sources", list(source_map.keys()))

        for name in enabled:
            cls = source_map.get(name)
            if not cls:
                self.logger.warning(f"Unknown source '{name}', skipping")
                continue
            try:
                if name in ("greenhouse", "ashby", "smartrecruiters"):
                    companies = self.config.get(f"{name}_companies")
                    instance = cls(companies=companies) if companies else cls()
                else:
                    instance = cls()
                self.sources.append(instance)
                self.logger.info(f"{name} source initialized")
            except ValueError as e:
                self.logger.warning(f"Skipping {name}: {e}")

    def run(self, profile: StudentProfile, max_per_source: int = 10) -> List[RawJob]:
        self.logger.info("[AI] ==========================================")
        self.logger.info(f"[AI] Agent 1 — AI Job Scraper")
        self.logger.info(f"[AI] Profile: {profile.primary_domain} | {', '.join(profile.skills)}")
        self.logger.info("[AI] Phase 1: LLM planning search strategy...")

        plan = plan_search(self.groq_client, profile)
        self.logger.info(f"[AI] Plan decided: {plan.reasoning}")

        all_jobs: List[RawJob] = []
        for source in self.sources:
            name = source.source_name
            if name not in plan.sources:
                continue

            self.logger.info(f"[FETCH] {name}...")
            try:
                kwargs = {"max_results": max_per_source}
                query = plan.queries.get(name, "")
                if isinstance(source, AdzunaSource):
                    kwargs["query"] = query
                elif isinstance(source, RemotiveSource) and query:
                    kwargs["category"] = query

                fetch_with_retry = retry(max_attempts=2)(source.fetch)
                jobs = fetch_with_retry(**kwargs)

                for job in jobs:
                    job.description = clean_job_description(job.description)

                self.logger.info(f"[FETCH] Got {len(jobs)} jobs from {name}")
                all_jobs.extend(jobs)
            except Exception as e:
                self.logger.error(f"[FETCH] Failed {name}: {e}")

        if not all_jobs:
            self.logger.warning("[AI] No jobs found")
            return []

        self.logger.info(f"[AI] Phase 2: LLM ranking {len(all_jobs)} jobs by relevance...")
        rankings = rank_jobs(self.groq_client, profile, all_jobs)

        ranking_map = {r.index: r for r in rankings}
        scored = []
        for i, job in enumerate(all_jobs):
            rank = ranking_map.get(i)
            scored.append((rank.relevance_score if rank else 0, job, rank.reason if rank else ""))

        scored.sort(key=lambda x: x[0], reverse=True)

        ranked_jobs = []
        for score, job, reason in scored:
            job.raw_data["relevance_score"] = score
            job.raw_data["relevance_reason"] = reason
            if score >= self.config.get("min_relevance", 3):
                ranked_jobs.append(job)

        path = self.writer.write_raw(ranked_jobs)
        self.logger.info(f"[AI] Done — {len(ranked_jobs)} jobs saved to {path}")
        self.logger.info("[AI] ==========================================")

        return ranked_jobs
