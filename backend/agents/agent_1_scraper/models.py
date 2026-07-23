from dataclasses import dataclass, field
from typing import List, Optional, Dict


@dataclass
class RawJob:
    source: str
    source_id: str
    title: str
    company: str
    description: str
    url: str
    location: str = ""
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: str = "INR"
    scraped_at: str = ""
    raw_data: dict = field(default_factory=dict)


@dataclass
class StudentProfile:
    student_id: str = ""
    name: str = ""
    primary_domain: str = ""
    secondary_domains: List[str] = field(default_factory=list)
    skills: List[str] = field(default_factory=list)
    experience_years: float = 0.0
    projects: List[str] = field(default_factory=list)


@dataclass
class SearchPlan:
    sources: List[str] = field(default_factory=list)
    queries: Dict[str, str] = field(default_factory=dict)
    companies: Dict[str, List[str]] = field(default_factory=dict)
    reasoning: str = ""


@dataclass
class JobRanking:
    index: int
    relevance_score: int
    reason: str
