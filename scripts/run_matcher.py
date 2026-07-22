import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from agents.agent_4_matcher import MatchingAgent


def main():
    agent = MatchingAgent()
    agent.run()


if __name__ == "__main__":
    main()
