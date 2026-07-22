import sys
import time
import traceback

import db_utils
import groq_service
import embedding_service
from config import BATCH_SIZE


def process_jobs():
    jobs = db_utils.get_unclassified_jobs()
    if not jobs:
        print("No unclassified jobs found.")
        return

    print(f"\nFound {len(jobs)} unclassified job(s). Processing...\n")
    batch = jobs[:BATCH_SIZE]

    for i, job in enumerate(batch, 1):
        try:
            print(f"[{i}/{len(batch)}] {job['title']} @ {job['company']} ... ", end="", flush=True)

            result = groq_service.classify(job)
            embedding = embedding_service.generate(
                job["title"], result["required_skills"], job["description"]
            )
            db_utils.insert_parsed_job(
                raw_job_id=job["id"],
                domain=result["domain"],
                required_skills=result["required_skills"],
                experience_level=result["experience_level"],
                experience_min=result.get("experience_min"),
                experience_max=result.get("experience_max"),
                degree_required=result.get("degree_required", False),
                employment_type=result["employment_type"],
                embedding=embedding,
            )
            db_utils.mark_classified(job["id"])

            skills = result["required_skills"][:5]
            print(f"[OK] {result['domain']} | skills: {', '.join(skills)}")

        except Exception as e:
            print(f"[FAILED] {e}")
            traceback.print_exc()

    print(f"\nDone. Processed {len(batch)} job(s). Output written to mock_data/output_parsed.json")


def main():
    print("=" * 55)
    print("  JobSync AI — Agent 2: Job Parser & Classifier")
    print("=" * 55)
    print(f"  Groq API key: {groq_service.GROQ_API_KEY[:8]}...{groq_service.GROQ_API_KEY[-4:]}")
    print()

    start = time.time()
    process_jobs()
    elapsed = time.time() - start
    print(f"\nTotal time: {elapsed:.2f}s")


if __name__ == "__main__":
    main()
