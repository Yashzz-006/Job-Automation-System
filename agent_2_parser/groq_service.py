import json
import re

from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL

if not GROQ_API_KEY or GROQ_API_KEY == "your_groq_api_key_here":
    raise RuntimeError(
        "GROQ_API_KEY not set. Add it to .env file:\n"
        "GROQ_API_KEY=gsk_your_key_here"
    )

SYSTEM_PROMPT = """You are a job classifier. Given a raw job posting, extract structured information.
Return ONLY valid JSON with no markdown fences, no extra text:

{
  "domain": "Full Stack" | "Backend" | "Frontend" | "DevOps" | "ML/AI" | "Data Engineering" | "Cybersecurity" | "Testing/QA" | "Salesforce" | "Mobile" | "Other",
  "required_skills": ["skill1", "skill2", ...],
  "experience_level": "Internship" | "Entry Level" | "Mid Level" | "Senior" | "Lead",
  "experience_min": number or null,
  "experience_max": number or null,
  "degree_required": true or false,
  "employment_type": "Full Time" | "Part Time" | "Contract" | "Internship" | "Freelance"
}

Use the job title and description to infer these fields. If a value cannot be determined, use null or false."""


def _build_user_message(job):
    return (
        f"Title: {job['title']}\n"
        f"Company: {job['company']}\n"
        f"Location: {job['location']}\n"
        f"Salary: {job.get('salary_min', 'N/A')} - {job.get('salary_max', 'N/A')} {job.get('salary_currency', '')}\n"
        f"Description:\n{job['description']}"
    )


def _parse_json_response(text):
    cleaned = re.sub(r"^```(?:json)?\s*", "", text.strip())
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return json.loads(cleaned)


def classify(job):
    client = Groq(api_key=GROQ_API_KEY)
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_message(job)},
        ],
        temperature=0.1,
        max_tokens=500,
    )
    content = response.choices[0].message.content
    return _parse_json_response(content)
