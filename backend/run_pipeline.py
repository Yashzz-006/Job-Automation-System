#!/usr/bin/env python3
"""Single-file pipeline runner for JobSync AI"""

import argparse
import sys
from pathlib import Path

# Add project root to path
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))


def run_scraper():
    from scripts.run_scraper import main
    main()


def run_classifier():
    from scripts.run_classifier import main
    main()


def run_resume(student_id, name, email, pdf_path):
    from scripts.run_resume import main as run_resume_main
    import sys
    original_argv = sys.argv
    sys.argv = ["run_resume.py", student_id, name, email, pdf_path]
    try:
        run_resume_main()
    finally:
        sys.argv = original_argv


def run_matcher():
    from scripts.run_matcher import main
    main()


def main():
    parser = argparse.ArgumentParser(description="JobSync AI - Full Pipeline")
    parser.add_argument("--student-id", required=True, help="Student ID (e.g., STU005)")
    parser.add_argument("--name", required=True, help="Student name")
    parser.add_argument("--email", required=True, help="Student email")
    parser.add_argument("--resume", required=True, help="Path to resume PDF")
    parser.add_argument("--skip-scraper", action="store_true", help="Skip Agent 1 (scraper)")
    parser.add_argument("--skip-classifier", action="store_true", help="Skip Agent 2 (classifier)")
    args = parser.parse_args()

    resume_path = Path(args.resume)
    if not resume_path.exists():
        print(f"Error: Resume not found at {args.resume}")
        sys.exit(1)

    print("=" * 50)
    print("JobSync AI - Full Pipeline")
    print("=" * 50)

    if not args.skip_scraper:
        print("\n[1/4] Running Agent 1: Scraper...")
        run_scraper()

    if not args.skip_classifier:
        print("\n[2/4] Running Agent 2: Job Classifier...")
        run_classifier()

    print(f"\n[3/4] Running Agent 3: Resume Classifier ({args.resume})...")
    run_resume(args.student_id, args.name, args.email, str(args.resume))

    print("\n[4/4] Running Agent 4: Matcher...")
    run_matcher()

    print("\n" + "=" * 50)
    print("[OK] Pipeline complete!")
    print("Check output/matches.json for results")
    print("=" * 50)


if __name__ == "__main__":
    main()