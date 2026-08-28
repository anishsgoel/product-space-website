#!/usr/bin/env bash
# Build a clean, public-only deploy artifact in dist/.
# Deploy dist/ (never the repo root) so internal files (steering/, package.json,
# node_modules/, .git/) are never served on any host. See SECURITY.md.
set -euo pipefail
cd "$(dirname "$0")"

rm -rf dist
mkdir -p dist

# Public pages + code
cp index.html about.html clients.html careers.html students.html apply.html 404.html styles.css script.js dist/

# Public asset directories
cp -R team testimonials Logos icons fonts dist/

# Root-level public images
cp ProductSpaceLogoGU.png product_space_icon.png healy-hall-hero.jpg og-image.jpg dist/

# Host header configs that live in the web root (Cloudflare Pages/Netlify use _headers; Apache uses .htaccess)
if [ -f _headers ]; then cp _headers dist/; fi
if [ -f .htaccess ]; then cp .htaccess dist/; fi

echo "Built dist/ ($(find dist -type f | wc -l | tr -d ' ') files)"
