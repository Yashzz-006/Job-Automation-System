from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class ParsedJob:
    source: str
    source_id: str
    title: str
    company: str
    domain: str
    required_skills: List[str]
    experience_level: str
    experience_min: Optional[float] = None
    experience_max: Optional[float] = None
    degree_required: bool = False
    employment_type: str = "Full Time"
    embedding: List[float] = field(default_factory=list)
    parsed_at: str = ""
