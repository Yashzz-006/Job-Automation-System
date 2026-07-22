import json
from pathlib import Path
from typing import List

from .models import RawJob


class BaseWriter:
    def write_raw(self, jobs: List[RawJob]):
        raise NotImplementedError


class JsonWriter(BaseWriter):
    def __init__(self, output_dir: str = "output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def write_raw(self, jobs: List[RawJob]) -> str:
        path = self.output_dir / "scraped_jobs.json"
        data = [
            {
                "source": j.source,
                "source_id": j.source_id,
                "title": j.title,
                "company": j.company,
                "location": j.location,
                "description": j.description,
                "url": j.url,
                "salary_min": j.salary_min,
                "salary_max": j.salary_max,
                "salary_currency": j.salary_currency,
            }
            for j in jobs
        ]
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return str(path)


class DbWriter(BaseWriter):
    def write_raw(self, jobs: List[RawJob]):
        raise NotImplementedError("DB not ready yet")
