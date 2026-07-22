import numpy as np

EMBEDDING_DIM = 384
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

try:
    from sentence_transformers import SentenceTransformer

    _model = None

    def _get_model():
        global _model
        if _model is None:
            _model = SentenceTransformer(EMBEDDING_MODEL)
        return _model

    def generate(job_title, required_skills, description):
        model = _get_model()
        text = f"{job_title}. Skills: {', '.join(required_skills[:15])}. {description[:1024]}"
        vector = model.encode(text, normalize_embeddings=True)
        return vector.tolist()

except ImportError:
    print("[embedding] sentence-transformers not installed; using mock embeddings")

    def generate(job_title, required_skills, description):
        rng = np.random.RandomState(hash(job_title + description) % (2**31))
        vec = rng.randn(EMBEDDING_DIM).astype(np.float32)
        vec = vec / np.linalg.norm(vec)
        return vec.tolist()
