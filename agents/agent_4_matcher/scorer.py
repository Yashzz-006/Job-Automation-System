import numpy as np
from typing import List


def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    a = np.array(vec_a, dtype=np.float32)
    b = np.array(vec_b, dtype=np.float32)
    return float(np.dot(a, b))


def jaccard_similarity(list_a: List[str], list_b: List[str]) -> float:
    set_a = set(s.lower().strip() for s in list_a)
    set_b = set(s.lower().strip() for s in list_b)
    if not set_a or not set_b:
        return 0.0
    return len(set_a & set_b) / len(set_a | set_b)
