#!/usr/bin/env bash

# installs deps everytime in case
# runs both backend and frontend servers, closes them on ctrl+c

# should work on mac AND linux

set -e

# thought this would have an easier time with pwd but needs this entire string
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# install python (backend) deps
echo "Installing Python dependencies..."
cd "$ROOT/backend"
pip install -r requirements.txt

cd "$ROOT"

# install typescript (frontend) deps
echo "Installing TypeScript dependencies..."
cd "$ROOT/frontend"
npm install

cd "$ROOT"

# Start both servers concurrently
echo "Starting servers..."
# backend
cd "$ROOT/backend"
(uvicorn main:app --reload &)

cd "$ROOT"
cd "$ROOT/frontend"
(npm run dev &)

echo "Servers are now both running!"
echo "Press Ctrl+C to stop both"
