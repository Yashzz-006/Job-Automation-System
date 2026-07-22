import json
import os
from typing import Optional

from groq import Groq

from agents.base import BaseAgent
from .extractor import extract_text_from_pdf
from .prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE


class ResumeClassifierAgent(BaseAgent):
    def __init__(self, config: Optional[dict] = None):
        super().__init__(name="resume_classifier", config=config or {})
        self._init_embedder()
        self._init_llm()

    def _init_embedder(self):
        try:
            from sentence_transformers import SentenceTransformer
            self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
            self.logger.info("Embedding model loaded: all-MiniLM-L6-v2")
        except Exception as e:
            self.logger.warning(f"Could not load embedder: {e}")
            self.embedder = None

    def _init_llm(self):
        if not self.groq_api_key:
            self.logger.warning("GROQ_API_KEY not set — LLM calls will fail")
        self.llm_client = Groq(api_key=self.groq_api_key) if self.groq_api_key else None

    def _call_llm(self, resume_text: str) -> dict:
        if not self.llm_client:
            raise ValueError("Groq client not initialized — check GROQ_API_KEY")

        resp = self.llm_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": USER_PROMPT_TEMPLATE.format(resume_text=resume_text)},
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        return json.loads(resp.choices[0].message.content)

    def _generate_embedding(self, text: str) -> list:
        if self.embedder:
            return self.embedder.encode(text).tolist()
        return []

    def run(self, student_id: str, name: str, email: str, pdf_path: str) -> dict:
        self.logger.info(f"[AI] Processing resume for {name} ({student_id})")

        resume_text = extract_text_from_pdf(pdf_path)
        if not resume_text:
            raise ValueError("Could not extract text from resume PDF")

        self.logger.info(f"[AI] Extracted {len(resume_text)} chars from PDF")

        self.logger.info("[AI] Phase 1: LLM classifying resume...")
        classification = self._call_llm(resume_text)
        self.logger.info(f"[AI] Classification: {classification.get('primary_domain')}")

        skills = classification.get("skills", [])
        text_for_embedding = f"{classification.get('primary_domain', '')} {' '.join(skills)}"
        embedding = self._generate_embedding(text_for_embedding)

        profile = {
            "student_id": student_id,
            "name": name,
            "email": email,
            "domain": classification.get("primary_domain", "Other"),
            "required_skills": skills,
            "experience_min": 0,
            "experience_max": None,
            "degree_required": False,
            "employment_type": "Full Time",
            "embedding": embedding,
            "embedding_dim": len(embedding) if embedding else 384,
            "parsed_at": self.timestamp(),
        }

        self.logger.info(f"[AI] Phase 2: Generated embedding ({len(embedding)} dims)")
        self.logger.info("[AI] Done — saving to output/student_profiles.json")

        return profile
