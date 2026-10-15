#!/usr/bin/env python3
"""Copy marked regions of companion repositories into posts as include files.

A source file marks a region with `#region <name>` and `#endregion` lines. Each region is
written, without the marker lines, to `<post>/_snippets/<name>.jl`, and the post pulls it
into a code cell with `{{< include _snippets/<name>.jl >}}`.

The snippets are committed, so a render without the companion repository (the publish
workflow) uses them as they are. Runs as Quarto's pre-render step:

    python3 scripts/snippets.py            # refresh every post's snippets
    python3 scripts/snippets.py --check    # exit 1 if a snippet is out of date

A source's `ref` reads the files at that commit instead of the working tree; set it to the
pushed commit before publishing, so the post matches code readers can find.
"""
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SOURCES = [
    {
        "post": "posts/2026-10-22-reactant-end-to-end",
        "repo": os.environ.get("PATHMNIST_REPO", "~/Git/PathMNISTReactant.jl"),
        "ref": "796717a",   # pushed to origin/main
        "files": ["src/*.jl", "client/client.jl"],
    },
]

REGION = re.compile(r"^\s*#region\s+(\S+)\s*$")
END = re.compile(r"^\s*#endregion\b")


def read(repo, ref, path):
    if ref is None:
        return (repo / path).read_text()
    return subprocess.run(["git", "-C", str(repo), "show", f"{ref}:{path}"],
                          check=True, capture_output=True, text=True).stdout


def list_files(repo, ref, pattern):
    if ref is None:
        return sorted(str(p.relative_to(repo)) for p in repo.glob(pattern))
    out = subprocess.run(["git", "-C", str(repo), "ls-tree", "-r", "--name-only", ref],
                         check=True, capture_output=True, text=True).stdout.split()
    return sorted(p for p in out if Path(p).match(pattern))


def regions(text, where):
    found, name, lines = {}, None, []
    for i, line in enumerate(text.splitlines(), 1):
        if m := REGION.match(line):
            if name is not None:
                sys.exit(f"{where}:{i}: region {m[1]} opens inside region {name}")
            name, lines = m[1], []
        elif END.match(line):
            if name is None:
                sys.exit(f"{where}:{i}: #endregion with no open region")
            found[name] = "\n".join(lines).strip("\n") + "\n"
            name = None
        elif name is not None:
            lines.append(line)
    if name is not None:
        sys.exit(f"{where}: region {name} is never closed")
    return found


def collect(src):
    repo, ref = Path(src["repo"]).expanduser(), src["ref"]
    snippets = {}
    for pattern in src["files"]:
        for path in list_files(repo, ref, pattern):
            for name, body in regions(read(repo, ref, path), f"{repo.name}/{path}").items():
                if name in snippets:
                    sys.exit(f"{repo.name}/{path}: region {name} is defined twice")
                snippets[name] = body
    return snippets


def main(check):
    stale = []
    for src in SOURCES:
        repo = Path(src["repo"]).expanduser()
        if not repo.is_dir():
            print(f"snippets: {repo} not found, keeping the committed snippets")
            continue
        out = ROOT / src["post"] / "_snippets"
        snippets = collect(src)
        current = {p.stem for p in out.glob("*.jl")} if out.is_dir() else set()
        for name, body in snippets.items():
            path = out / f"{name}.jl"
            if path.is_file() and path.read_text() == body:
                continue
            stale.append(path)
            if not check:
                out.mkdir(exist_ok=True)
                path.write_text(body)
        for name in current - snippets.keys():
            path = out / f"{name}.jl"
            stale.append(path)
            if not check:
                path.unlink()
    for path in stale:
        print(f"snippets: {'out of date' if check else 'updated'} {path.relative_to(ROOT)}")
    return 1 if check and stale else 0


if __name__ == "__main__":
    sys.exit(main("--check" in sys.argv[1:]))
