#!/usr/bin/env bash
set -euo pipefail

echo "==> Typechecking backend..."
npm --prefix backend run typecheck

echo "==> Typechecking frontend..."
npm --prefix frontend run typecheck
