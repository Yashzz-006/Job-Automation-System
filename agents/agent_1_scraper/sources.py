import os
from abc import ABC, abstractmethod
from typing import List, Optional
from urllib.parse import urljoin

import requests
import httpx

from .models import RawJob


class BaseSource(ABC):
    @abstractmethod
    def fetch(self, **kwargs) -> List[RawJob]:
        raise NotImplementedError

    @property
    @abstractmethod
    def source_name(self) -> str:
        raise NotImplementedError


class AdzunaSource(BaseSource):
    BASE_URL = "https://api.adzuna.com/v1/api/jobs/in/search/1"

    def __init__(self, app_id: str = "", api_key: str = ""):
        self.app_id = app_id or os.getenv("ADZUNA_APP_ID", "")
        self.api_key = api_key or os.getenv("ADZUNA_API_KEY", "")
        self._validate_creds()

    def _validate_creds(self):
        if not self.app_id or not self.api_key:
            raise ValueError("ADZUNA_APP_ID and ADZUNA_API_KEY required")

    @property
    def source_name(self) -> str:
        return "adzuna"

    def fetch(self, query: str = "", max_results: int = 20) -> List[RawJob]:
        params = {
            "app_id": self.app_id,
            "app_key": self.api_key,
            "results_per_page": min(max_results, 50),
            "content-type": "application/json",
        }
        if query:
            params["what"] = query

        resp = requests.get(self.BASE_URL, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        jobs = []
        for item in data.get("results", []):
            jobs.append(RawJob(
                source=self.source_name,
                source_id=str(item.get("id", "")),
                title=item.get("title", ""),
                company=item.get("company", {}).get("display_name", "Unknown"),
                description=item.get("description", ""),
                url=item.get("redirect_url", ""),
                location=item.get("location", {}).get("display_name", ""),
                salary_min=item.get("salary_min"),
                salary_max=item.get("salary_max"),
                salary_currency=item.get("salary_is_estimated", "INR"),
                raw_data=item,
            ))
        return jobs


class ArbeitnowSource(BaseSource):
    BASE_URL = "https://www.arbeitnow.com/api/job-board-api"

    @property
    def source_name(self) -> str:
        return "arbeitnow"

    def fetch(self, max_results: int = 20) -> List[RawJob]:
        resp = requests.get(
            self.BASE_URL,
            params={"per_page": min(max_results, 100)},
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()

        jobs = []
        for item in data.get("data", [])[:max_results]:
            jobs.append(RawJob(
                source=self.source_name,
                source_id=item.get("slug", ""),
                title=item.get("title", ""),
                company=item.get("company_name", "Unknown"),
                description=item.get("description", ""),
                url=item.get("url", ""),
                location=item.get("location", "Remote"),
                salary_min=None,
                salary_max=None,
                salary_currency="",
                raw_data=item,
            ))
        return jobs


class RemoteOKSource(BaseSource):
    BASE_URL = "https://remoteok.com/api"

    @property
    def source_name(self) -> str:
        return "remoteok"

    def fetch(self, max_results: int = 20) -> List[RawJob]:
        resp = requests.get(self.BASE_URL, timeout=30)
        resp.raise_for_status()
        items = resp.json()

        jobs = []
        for item in items[1: 1 + max_results]:
            jobs.append(RawJob(
                source=self.source_name,
                source_id=str(item.get("id", "")),
                title=item.get("position", ""),
                company=item.get("company", ""),
                description=item.get("description", ""),
                url=item.get("url", ""),
                location=item.get("location", "Remote"),
                salary_min=None,
                salary_max=None,
                salary_currency="USD",
                raw_data=item,
            ))
        return jobs


class RemotiveSource(BaseSource):
    BASE_URL = "https://remotive.com/api/remote-jobs"

    @property
    def source_name(self) -> str:
        return "remotive"

    def fetch(self, max_results: int = 20, category: str = "") -> List[RawJob]:
        params = {}
        if category:
            params["category"] = category

        resp = requests.get(self.BASE_URL, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        jobs = []
        for item in data.get("jobs", [])[:max_results]:
            jobs.append(RawJob(
                source=self.source_name,
                source_id=str(item.get("id", "")),
                title=item.get("title", ""),
                company=item.get("company_name", ""),
                description=item.get("description", ""),
                url=item.get("url", ""),
                location=item.get("candidate_required_location", "Remote"),
                salary_min=item.get("salary"),
                salary_max=None,
                salary_currency="USD",
                raw_data=item,
            ))
        return jobs


class GreenhouseSource(BaseSource):
    BASE_URL = "https://boards-api.greenhouse.io/v1/boards/{company}/jobs"

    def __init__(self, companies: Optional[List[str]] = None):
        self.companies = companies or [
            "airbnb", "stripe", "lyft", "plaid", "instacart",
            "pinterest", "dropbox", "reddit",
        ]

    @property
    def source_name(self) -> str:
        return "greenhouse"

    def fetch(self, max_results: int = 20) -> List[RawJob]:
        jobs = []
        for company in self.companies:
            if len(jobs) >= max_results:
                break
            try:
                url = self.BASE_URL.format(company=company)
                resp = requests.get(url, params={"content": "true"}, timeout=30)
                resp.raise_for_status()
                data = resp.json()
                for item in data.get("jobs", []):
                    if len(jobs) >= max_results:
                        break
                    jobs.append(RawJob(
                        source=self.source_name,
                        source_id=f"{company}-{item.get('id', '')}",
                        title=item.get("title", ""),
                        company=company.capitalize(),
                        description=item.get("content", ""),
                        url=item.get("absolute_url", ""),
                        location=(
                            item.get("location", {}).get("name", "")
                            if isinstance(item.get("location"), dict)
                            else str(item.get("location", ""))
                        ),
                        salary_min=None,
                        salary_max=None,
                        salary_currency="",
                        raw_data=item,
                    ))
            except Exception as e:
                continue
        return jobs


class TheMuseSource(BaseSource):
    BASE_URL = "https://www.themuse.com/api/public/jobs"

    @property
    def source_name(self) -> str:
        return "themuse"

    def fetch(self, max_results: int = 20) -> List[RawJob]:
        all_jobs = []
        page = 1
        while len(all_jobs) < max_results:
            resp = requests.get(
                self.BASE_URL,
                params={"page": page, "descending": "true"},
                timeout=30,
            )
            resp.raise_for_status()
            data = resp.json()
            results = data.get("results", [])
            if not results:
                break
            for item in results:
                if len(all_jobs) >= max_results:
                    break
                company_name = item.get("company", {}).get("name", "Unknown") if isinstance(item.get("company"), dict) else "Unknown"
                locations = item.get("locations", [])
                location_str = ", ".join(l.get("name", "") for l in locations if isinstance(l, dict)) if locations else ""
                categories = item.get("categories", [])
                category_names = [c.get("name", "") for c in categories if isinstance(c, dict)]
                levels = item.get("levels", [])
                level_names = [l.get("name", "") for l in levels if isinstance(l, dict)]
                description = item.get("contents", "") or ""
                all_jobs.append(RawJob(
                    source=self.source_name,
                    source_id=str(item.get("id", "")),
                    title=item.get("name", ""),
                    company=company_name,
                    description=description,
                    url=f"https://www.themuse.com/jobs/{item.get('id', '')}",
                    location=location_str,
                    salary_min=None,
                    salary_max=None,
                    salary_currency="",
                    raw_data=item,
                ))
            page += 1
        return all_jobs


class AshbySource(BaseSource):
    BASE_URL = "https://api.ashbyhq.com/posting-api/job-board/{company}"

    def __init__(self, companies: Optional[List[str]] = None):
        self.companies = companies or [
            "coinbase", "notion", "vercel", "linear", "ramp",
        ]

    @property
    def source_name(self) -> str:
        return "ashby"

    def fetch(self, max_results: int = 20) -> List[RawJob]:
        jobs = []
        for company in self.companies:
            if len(jobs) >= max_results:
                break
            try:
                url = self.BASE_URL.format(company=company)
                resp = requests.get(url, timeout=30)
                if resp.status_code != 200:
                    continue
                data = resp.json()
                for item in data.get("jobs", [])[:max_results]:
                    if len(jobs) >= max_results:
                        break
                    description = item.get("descriptionPlain", "") or item.get("descriptionHtml", "") or ""
                    jobs.append(RawJob(
                        source=self.source_name,
                        source_id=f"{company}-{item.get('id', '')}",
                        title=item.get("title", ""),
                        company=company.capitalize(),
                        description=description,
                        url=item.get("jobUrl", ""),
                        location=(
                            item.get("location", "")
                            if isinstance(item.get("location"), str)
                            else str(item.get("location", {}).get("name", ""))
                        ),
                        salary_min=None,
                        salary_max=None,
                        salary_currency="",
                        raw_data=item,
                    ))
            except Exception as e:
                continue
        return jobs


class SmartRecruitersSource(BaseSource):
    BASE_URL = "https://api.smartrecruiters.com/v1/companies/{company}/postings"

    def __init__(self, companies: Optional[List[str]] = None):
        self.companies = companies or [
            "Visa", "Uber", "Spotify", "Booking",
        ]

    @property
    def source_name(self) -> str:
        return "smartrecruiters"

    def fetch(self, max_results: int = 20) -> List[RawJob]:
        jobs = []
        for company in self.companies:
            if len(jobs) >= max_results:
                break
            try:
                url = self.BASE_URL.format(company=company)
                resp = requests.get(url, timeout=30)
                resp.raise_for_status()
                data = resp.json()
                for item in data.get("content", [])[:max_results]:
                    if len(jobs) >= max_results:
                        break
                    loc = item.get("location", {}) or {}
                    location_parts = [
                        loc.get("city", ""),
                        loc.get("region", ""),
                        loc.get("country", ""),
                    ]
                    location_str = ", ".join(p for p in location_parts if p)
                    jobs.append(RawJob(
                        source=self.source_name,
                        source_id=str(item.get("id", "")),
                        title=item.get("name", ""),
                        company=company,
                        description=item.get("jobAd", {}).get("sections", {}).get("jobDescription", {}).get("text", "") if isinstance(item.get("jobAd"), dict) else "",
                        url=f"https://www.smartrecruiters.com/{company}/{item.get('id', '')}",
                        location=location_str,
                        salary_min=None,
                        salary_max=None,
                        salary_currency="",
                        raw_data=item,
                    ))
            except Exception as e:
                continue
        return jobs
