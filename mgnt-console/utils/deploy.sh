#!/usr/bin/env bash
echo "Building frontend..."
cd src/frontend
gulp sass
npm run build
cd ..
mkdir -p templates
mkdir -p static
echo "Copying over the files..."
cp -r ./frontend/build/* static
cp ./static/index.html templates
echo "Deployment complete."
