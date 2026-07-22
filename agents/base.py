import os
import json
import logging
from abc import ABC, abstractmethod
from typing import Any, Optional
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()


class BaseAgent(ABC):
    def __init__(self, name: str, config: Optional[dict] = None):
        self.name = name
        self.config = config or {}
        self.logger = logging.getLogger(f"agent.{name}")
        self._setup_logging()
        self._load_config()

    def _setup_logging(self):
        level = getattr(logging, os.getenv("LOG_LEVEL", "INFO").upper())
        handler = logging.StreamHandler()
        handler.setFormatter(
            logging.Formatter(
                "%(asctime)s | %(name)s | %(levelname)s | %(message)s",
                datefmt="%H:%M:%S",
            )
        )
        self.logger.addHandler(handler)
        self.logger.setLevel(level)
        self.logger.propagate = False

    def _load_config(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY", "")
        self.adzuna_app_id = os.getenv("ADZUNA_APP_ID", "")
        self.adzuna_api_key = os.getenv("ADZUNA_API_KEY", "")

    @abstractmethod
    def run(self, *args, **kwargs) -> Any:
        raise NotImplementedError

    def to_json(self, data: Any, indent: int = 2) -> str:
        return json.dumps(data, default=str, indent=indent)

    def timestamp(self) -> str:
        return datetime.utcnow().isoformat()
