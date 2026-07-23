from dataclasses import dataclass, field
from typing import List


@dataclass
class MatchResult:
    student_id: str
    student_name: str
    matches: List[dict] = field(default_factory=list)
