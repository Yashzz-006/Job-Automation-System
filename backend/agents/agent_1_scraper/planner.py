import json
from groq import Groq

from .models import StudentProfile, SearchPlan

PLANNER_SYSTEM_PROMPT = """You are a job search strategist. Given a student's profile, create a search plan to find the most relevant jobs.

Available sources and what they're best for:
- remoteok: Remote developer jobs worldwide
- remotive: Remote tech jobs across all domains
- arbeitnow: Developer & fresher jobs (mostly Germany/EU)
- greenhouse: Enterprise & startup career pages (Airbnb, Stripe, etc.)
- themuse: Company career profiles (Walmart, CVS, startups)
- ashby: AI & tech startup career pages (Notion, Vercel, etc.)
- smartrecruiters: Enterprise career pages (Visa, Uber, etc.)
- adzuna: General jobs (India-focused)

Output ONLY valid JSON with this structure:
{
  "sources": ["list of sources to search"],
  "queries": {"source_name": "search query or empty string"},
  "companies": {"greenhouse": ["company1", "company2"], "ashby": [...], "smartrecruiters": [...]},
  "reasoning": "why this strategy fits the student"
}"""


def plan_search(groq_client: Groq, profile: StudentProfile) -> SearchPlan:
    user_prompt = f"""Student Profile:
- Primary Domain: {profile.primary_domain}
- Secondary Domains: {', '.join(profile.secondary_domains)}
- Skills: {', '.join(profile.skills)}
- Experience: {profile.experience_years} years
- Projects: {', '.join(profile.projects)}

Create a search plan to find jobs matching this student."""

    resp = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": PLANNER_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    data = json.loads(resp.choices[0].message.content)
    return SearchPlan(
        sources=data.get("sources", []),
        queries=data.get("queries", {}),
        companies=data.get("companies", {}),
        reasoning=data.get("reasoning", ""),
    )
