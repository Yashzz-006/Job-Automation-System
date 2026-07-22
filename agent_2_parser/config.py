import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = "llama-3.3-70b-versatile"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 384
BATCH_SIZE = 10
DOMAINS = [
    "Full Stack", "Backend", "Frontend", "DevOps", "ML/AI",
    "Data Engineering", "Cybersecurity", "Testing/QA",
    "Salesforce", "Mobile", "Other"
]
EMPLOYMENT_TYPES = ["Full Time", "Part Time", "Contract", "Internship", "Freelance"]
EXPERIENCE_LEVELS = ["Internship", "Entry Level", "Mid Level", "Senior", "Lead"]
