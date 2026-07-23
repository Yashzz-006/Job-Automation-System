import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from agents.agent_1_scraper import JobScraperAgent, StudentProfile


def main():
    profile = StudentProfile(
        student_id="STU001",
        name="Shreyas S",
        primary_domain="ML / AI",
        secondary_domains=["Full Stack", "Backend"],
        skills=[
            "Python", "Java", "C", "SQL", "React", "Next.js", "Node.js",
            "Express", "FastAPI", "MySQL", "MongoDB", "Prompt Engineering",
            "Computer Vision", "AI Integration", "Docker", "OpenCV",
        ],
        experience_years=0,
        projects=[
            "AI Prompt Generator",
            "Similar Object Detection System",
            "Text to Sign Language Generator",
            "Domestic Violence Case Pattern Analyser",
        ],
    )

    print(f"\n  Running Agent 1 AI for: {profile.name}")
    print(f"  Domain: {profile.primary_domain}")
    print(f"  Skills: {', '.join(profile.skills)}\n")

    agent = JobScraperAgent(config={
        "greenhouse_companies": ["airbnb", "stripe", "lyft"],
        "ashby_companies": ["notion", "vercel", "coinbase"],
        "smartrecruiters_companies": ["Visa", "Uber"],
        "min_relevance": 3,
    })

    jobs = agent.run(profile=profile, max_per_source=5)

    print(f"\n  {'=' * 60}")
    print(f"  RESULTS — {len(jobs)} ranked jobs")
    print(f"  {'=' * 60}\n")

    if not jobs:
        print("  No matching jobs found.")
        return

    for i, job in enumerate(jobs, 1):
        score = job.raw_data.get("relevance_score", "?")
        reason = job.raw_data.get("relevance_reason", "")
        print(f"  [{i}] Score {score}/10 — {job.title}")
        print(f"      {job.company} | {job.location}")
        print(f"      Why: {reason}")
        print(f"      {job.url}")
        print()

    print(f"  Full output saved to: output/scraped_jobs.json")


if __name__ == "__main__":
    main()
