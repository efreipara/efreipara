#!/usr/bin/env bash
# Installe les skills Claude Code du projet dans .claude/skills/ (et leurs checklists dans .claude/references/),
# ignorés par git. Chaque fichier vient de son dépôt d'origine à un commit épinglé : changer un commit, c'est
# relire le diff du skill avant de commiter. Rien de ce qui est téléchargé n'est exécuté.
#
# Sources, toutes sous licence MIT : addyosmani/agent-skills (Addy Osmani), emilkowalski/skills (Emil Kowalski),
# cloudflare/security-audit-skill (Cloudflare, Inc.). Le tableau « demande → skill » est dans CLAUDE.md.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/.claude"

ADDY="addyosmani/agent-skills|db3031dd4a75b72028a95084aad58d3cd13d8e49"
EMIL="emilkowalski/skills|a81dbca07f2217b7103e510c0f13f8d5b017afc9"
CLOUDFLARE="cloudflare/security-audit-skill|c1c8a8c1471069fb0e188eeaff69b8e8db6564a8"

# dépôt | commit | chemin dans le dépôt (skills/<nom> ou references/<fichier>, copié sous .claude/)
SOURCES=(
  "$ADDY|skills/code-review-and-quality"
  "$ADDY|skills/code-simplification"
  "$ADDY|skills/debugging-and-error-recovery"
  "$ADDY|skills/frontend-ui-engineering"
  "$ADDY|skills/interview-me"
  "$ADDY|skills/performance-optimization"
  "$ADDY|skills/security-and-hardening"
  "$ADDY|references/accessibility-checklist.md"
  "$ADDY|references/performance-checklist.md"
  "$ADDY|references/security-checklist.md"
  "$EMIL|skills/apple-design"
  "$EMIL|skills/emil-design-eng"
  "$CLOUDFLARE|skills/security-audit"
)

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

fetch() {
  local repo="$1" sha="$2" dir="$WORK/${1//\//_}-$2"
  if [ ! -d "$dir" ]; then
    git init -q "$dir"
    # Un fetch par SHA complet : git vérifie le contenu reçu contre ce hash ; sans les blobs d'abord,
    # pour ne télécharger que skills/ et references/.
    git -C "$dir" -c core.hooksPath=/dev/null fetch -q --depth 1 --filter=blob:none "https://github.com/$repo.git" "$sha"
    git -C "$dir" sparse-checkout set --no-cone /skills/ /references/ >/dev/null
    git -C "$dir" -c core.hooksPath=/dev/null -c advice.detachedHead=false checkout -q FETCH_HEAD
  fi
  echo "$dir"
}

for entry in "${SOURCES[@]}"; do
  IFS='|' read -r repo sha path <<<"$entry"
  dir="$(fetch "$repo" "$sha")"
  target="$DEST/${path%%/*}/$(basename "$path")"
  if [ ! -f "$dir/$path/SKILL.md" ] && [ ! -f "$dir/$path" ]; then
    echo "Introuvable : $repo@$sha $path" >&2
    exit 1
  fi
  mkdir -p "$(dirname "$target")"
  rm -rf "${target:?}"
  cp -R "$dir/$path" "$target"
  echo "${target#"$ROOT"/}  <-  $repo@${sha:0:7} $path"
done
