from dataclasses import dataclass
from typing import Optional, List


@dataclass
class ResumeProfile:
    student_id: str = ""
    name: str = ""
    email: str = ""
    primary_domain: str = "Other"
    secondary_domains: List[str] = None
    skills: List[str] = None
    experience_years: float = 0.0
    projects: List[str] = None
    certifications: List[str] = None
    education: str = ""

    def __post_init__(self):
        if self.secondary_domains is None:
            self.secondary_domains = []
        if self.skills is None:
            self.skills = []
        if self.projects is None:
            self.projects = []
        if self.certifications is None:
            self.certifications = []
