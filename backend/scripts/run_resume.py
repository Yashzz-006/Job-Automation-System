import sys
import json
import logging
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Suppress verbose logging
logging.getLogger("agent.resume_classifier").setLevel(logging.WARNING)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

from agents.agent_3_resume import ResumeClassifierAgent

STUDENTS_PATH = Path(__file__).resolve().parent.parent / "output" / "student_profiles.json"


def _load_students():
    if not STUDENTS_PATH.exists():
        return []
    try:
        with open(STUDENTS_PATH, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                return []
            return json.loads(content)
    except json.JSONDecodeError:
        return []


def _save_students(students):
    STUDENTS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(STUDENTS_PATH, "w", encoding="utf-8") as f:
        json.dump(students, f, indent=2, ensure_ascii=False)


def main():
    if len(sys.argv) < 5:
        print("Usage: python scripts/run_resume.py <student_id> <name> <email> <pdf_path>")
        print("Example: python scripts/run_resume.py STU001 'John Doe' 'john@email.com' /path/to/resume.pdf")
        sys.exit(1)

    student_id, name, email, pdf_path = sys.argv[1:5]

    if not Path(pdf_path).exists():
        print(f"Error: PDF not found at {pdf_path}")
        sys.exit(1)

    agent = ResumeClassifierAgent()
    profile = agent.run(student_id, name, email, pdf_path)

    # Save to output/student_profiles.json
    students = _load_students()
    students = [s for s in students if s["student_id"] != student_id]
    students.append(profile)
    _save_students(students)

    # Clean output
    skills_display = ", ".join(profile["required_skills"][:10])
    if len(profile["required_skills"]) > 10:
        skills_display += f" ... (+{len(profile['required_skills']) - 10} more)"

    print(f"\n[OK] Resume Classified")
    print(f"  ID:       {profile['student_id']}")
    print(f"  Name:     {profile['name']}")
    print(f"  Email:    {profile['email']}")
    print(f"  Domain:   {profile['domain']}")
    print(f"  Skills:   {skills_display}")
    print(f"  Exp:      {profile.get('experience_min', 0)} years")
    print(f"  Saved:    output/student_profiles.json")


if __name__ == "__main__":
    main()