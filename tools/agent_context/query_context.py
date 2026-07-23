#!/usr/bin/env python3
"""
Agent context query tool.

Usage:
  python3 query_context.py list                              # List all projects
  python3 query_context.py summary <project>                 # Get project summary
  python3 query_context.py search <query>                    # Search repo-map.json
  python3 query_context.py keyfiles <project>                # Get key files for project

Depends on docs/agent-context/repo-map.json and summaries/<project>.md
"""

import json
import os
import sys
from pathlib import Path

DOCS_DIR = Path.home() / "docs" / "agent-context"
REPO_MAP = DOCS_DIR / "repo-map.json"
SUMMARIES_DIR = DOCS_DIR / "summaries"


def _load_repo_map():
    if not REPO_MAP.exists():
        print(f"repo-map.json not found at {REPO_MAP}", file=sys.stderr)
        return {}
    return json.loads(REPO_MAP.read_text())


def list_projects():
    data = _load_repo_map()
    if not data:
        print("No projects found in repo-map.json")
        return
    print(f"{'Project':<25} {'Type':<25} {'Framework':<25}")
    print("-" * 75)
    for name, info in sorted(data.items()):
        proj = Path(name).name if "/" in name else name
        print(f"{proj:<25} {info.get('type', '?'):<25} {info.get('framework', '?'):<25}")


def get_summary(project: str):
    summary_file = SUMMARIES_DIR / f"{project}.md"
    if not summary_file.exists():
        print(f"Summary not found for '{project}'", file=sys.stderr)
        print(f"Available: {[p.stem for p in SUMMARIES_DIR.glob('*.md')]}")
        return
    print(summary_file.read_text())


def search_repo_map(query: str):
    data = _load_repo_map()
    if not data:
        return
    query_lower = query.lower()
    results = []
    for path, info in data.items():
        proj = Path(path).name if "/" in path else path
        text = json.dumps(info).lower()
        if query_lower in text:
            results.append((proj, info))
    if not results:
        print(f"No results for '{query}'")
        return
    for proj, info in results:
        print(f"\n{'='*50}")
        print(f"  {proj}")
        print(f"{'='*50}")
        print(f"  Summary: {info.get('summary', '')}")
        print(f"  Type: {info.get('type', '?')}")
        print(f"  Framework: {info.get('framework', '?')}")


def get_keyfiles(project: str):
    data = _load_repo_map()
    if not data:
        return
    for path, info in data.items():
        proj = Path(path).name if "/" in path else path
        if proj == project:
            files = info.get("keyFiles", [])
            if not files:
                print(f"No key files listed for '{project}'")
                return
            print(f"Key files for {project}:")
            print("-" * 40)
            for f in files:
                if isinstance(f, dict):
                    print(f"  {f.get('path', '?'):<30} — {f.get('desc', '')}")
                else:
                    print(f"  {f}")
            return
    print(f"Project '{project}' not found in repo-map.json")


def query_context():
    """Main entry point - prints full context summary."""
    data = _load_repo_map()
    if not data:
        return
    print("=" * 60)
    print("  AGENT CONTEXT — Project Overview")
    print("=" * 60)
    for path, info in sorted(data.items()):
        proj = Path(path).name if "/" in path else path
        print(f"\n  [{proj}]")
        print(f"  Type:     {info.get('type', '?')}")
        print(f"  Stack:    {info.get('framework', '?')}")
        print(f"  Summary:  {info.get('summary', '?')}")
        print(f"  Entry:    {info.get('entry', '?')}")
        src = info.get("srcDir", {})
        if src:
            print(f"  Dirs:     {', '.join(sorted(set(k.split('/')[0] for k in src.keys())))}")
    print()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    command = sys.argv[1]

    if command == "list":
        list_projects()
    elif command == "summary":
        if len(sys.argv) < 3:
            print("Usage: query_context.py summary <project>")
            sys.exit(1)
        get_summary(sys.argv[2])
    elif command == "search":
        if len(sys.argv) < 3:
            print("Usage: query_context.py search <query>")
            sys.exit(1)
        search_repo_map(sys.argv[2])
    elif command == "keyfiles":
        if len(sys.argv) < 3:
            print("Usage: query_context.py keyfiles <project>")
            sys.exit(1)
        get_keyfiles(sys.argv[2])
    elif command == "all":
        query_context()
    else:
        print(f"Unknown command: {command}")
        print(__doc__)
        sys.exit(1)
