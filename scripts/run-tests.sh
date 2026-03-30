#!/usr/bin/env bash
set -euo pipefail

echo "==> Running tests for backend..."
npm --prefix backend run test

echo "==> Running tests for frontend..."
npm --prefix frontend run test
