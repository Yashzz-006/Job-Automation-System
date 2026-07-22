import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from agents.agent_2_parser import JobClassifierAgent


def main():
    agent = JobClassifierAgent()
    agent.run()


if __name__ == "__main__":
    main()
