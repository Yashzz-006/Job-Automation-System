import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from agents.agent_3_resume import ResumeClassifierAgent


def main():
    # ─── EDIT THESE VALUES FOR YOUR RESUME ───
    pdf_path = r"C:\Users\shrey\Downloads\resume_shreyas (1).pdf"  # ← your resume path
    student_id = "STU001"
    name = "Shreyas S"
    email = "shreyassivakumarcse@gmail.com"
    # ───────────────────────────────────────────

    print(f"\n  Running Agent 3 — Resume Classifier")
    print(f"  Resume: {pdf_path}")
    print(f"  Student: {name} ({email})\n")

    agent = ResumeClassifierAgent()

    try:
        profile = agent.run(
            student_id=student_id,
            name=name,
            email=email,
            pdf_path=pdf_path,
        )
    except Exception as e:
        print(f"  ERROR: {e}")
        print("\n  Note: If your PDF is image-based (scanned), text extraction may fail.")
        print("  Agent 3 currently uses pdfplumber — OCR support can be added if needed.")
        return

    out_path = Path(__file__).resolve().parent.parent / "output" / "student_profiles.json"
    out_path.parent.mkdir(exist_ok=True)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)

    print(f"\n  {'=' * 60}")
    print(f"  STUDENT PROFILE")
    print(f"  {'=' * 60}\n")
    print(f"  Name: {profile['name']}")
    print(f"  Primary Domain: {profile['primary_domain']}")
    print(f"  Secondary Domains: {', '.join(profile['secondary_domains'])}")
    print(f"  Skills: {', '.join(profile['skills'])}")
    print(f"  Experience: {profile['experience_years']} years")
    print(f"  Embedding: {len(profile['embedding'])} dimensions")
    print(f"  Projects: {', '.join(profile['projects'])}")
    print(f"\n  Saved to: {out_path}")


if __name__ == "__main__":
    main()
