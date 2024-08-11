#!/bin/bash

cd client

echo "Building client..."
pnpm build

echo "Deploying client..."
gcloud app deploy
