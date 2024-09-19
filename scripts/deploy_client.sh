#!/bin/bash
gcloud config set project crested-wharf-435818-u1

cd client

echo "Building client..."
pnpm build

echo "Deploying client..."
gcloud app deploy ./.gcloud/app.yaml
