import time
import random
from functools import wraps
from typing import Callable, Type, Tuple


def retry(
    max_attempts: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 10.0,
    exceptions: Tuple[Type[Exception], ...] = (Exception,),
):
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exc = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exc = e
                    if attempt < max_attempts:
                        delay = min(base_delay * 2 ** (attempt - 1), max_delay)
                        jitter = random.uniform(0, delay * 0.1)
                        time.sleep(delay + jitter)
            raise last_exc
        return wrapper
    return decorator
