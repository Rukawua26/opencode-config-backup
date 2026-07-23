#!/usr/bin/env python3
"""Build the global repo map from project-note frontmatter."""

import argparse
import json
from pathlib import Path


HOME = Path.home()
NOTES_DIR = HOME / "docs" / "projects"
OUTPUT = HOME / "docs" / "agent-context" / "repo-map.json"
REQUIRED = ("project_path", "project_type", "framework", "entry", "summary")


def parse_frontmatter(path: Path) -> dict[str, str]:
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        return {}
    result = {}
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if ":" not in line or line.startswith((" ", "\t")):
            continue
        key, value = line.split(":", 1)
        result[key.strip()] = value.strip().strip('"').strip("'")
    return result


def build_map() -> dict[str, dict]:
    previous = json.loads(OUTPUT.read_text(encoding="utf-8")) if OUTPUT.exists() else {}
    result = {}
    errors = []
    for note in sorted(NOTES_DIR.glob("*.md")):
        metadata = parse_frontmatter(note)
        if "project_path" not in metadata:
            continue
        missing = [key for key in REQUIRED if not metadata.get(key)]
        if missing:
            errors.append(f"{note.name}: missing {', '.join(missing)}")
            continue
        project_path = str(Path(metadata["project_path"]).expanduser())
        if not Path(project_path).is_dir():
            errors.append(f"{note.name}: project path does not exist: {project_path}")
            continue
        prior = previous.get(project_path, {})
        result[project_path] = {
            "type": metadata["project_type"],
            "framework": metadata["framework"],
            "summary": metadata["summary"],
            "entry": metadata["entry"],
            "keyFiles": prior.get("keyFiles", []),
            "srcDir": prior.get("srcDir", {}),
        }
    if errors:
        raise SystemExit("\n".join(errors))
    return result


def render(data: dict[str, dict]) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail when repo-map.json is stale")
    args = parser.parse_args()
    content = render(build_map())
    current = OUTPUT.read_text(encoding="utf-8") if OUTPUT.exists() else ""
    if args.check:
        if content != current:
            print("repo-map.json is stale; run build_repo_map.py")
            return 1
        print(f"repo-map.json is current ({len(json.loads(content))} projects)")
        return 0
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(content, encoding="utf-8")
    print(f"updated {OUTPUT} ({len(json.loads(content))} projects)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
