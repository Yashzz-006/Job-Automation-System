import json
from groq import Groq

from .models import StudentProfile, RawJob, JobRanking

FILTER_SYSTEM_PROMPT = """You are a job relevance evaluator. Given a student profile and a list of jobs, rank each job by relevance (1-10 scale).

Scoring guide:
- 9-10: Perfect match — domain aligns, required skills match student's skills
- 7-8: Strong match — domain aligns, most skills match
- 5-6: Partial match — domain somewhat aligns, some skills overlap
- 3-4: Weak match — little overlap
- 1-2: Not relevant — different domain entirely

Output ONLY valid JSON with this structure:
{
  "rankings": [
    {"index": 0, "relevance_score": 9, "reason": "Requires React and Node.js which student has"},
    {"index": 1, "relevance_score": 3, "reason": "Requires Java — student has no Java experience"}
  ]
}"""


def rank_jobs(groq_client: Groq, profile: StudentProfile, jobs: list[RawJob]) -> list[JobRanking]:
    if not jobs:
        return []

    jobs_preview = []
    for i, job in enumerate(jobs):
        jobs_preview.append({
            "index": i,
            "title": job.title,
            "company": job.company,
            "description": job.description[:500],
            "location": job.location,
        })

    user_prompt = f"""Student Profile:
- Primary Domain: {profile.primary_domain}
- Skills: {', '.join(profile.skills)}
- Experience: {profile.experience_years} years

Jobs to evaluate:
{json.dumps(jobs_preview, indent=2)}"""

    resp = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": FILTER_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )

    data = json.loads(resp.choices[0].message.content)
    return [
        JobRanking(index=r["index"], relevance_score=r["relevance_score"], reason=r["reason"])
        for r in data.get("rankings", [])
    ]
