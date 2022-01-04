#!/bin/bash
name=rowy-builder
project_id=rowy-run
npx tsc
npm run build
gcloud config set project $project_id
gcloud builds submit --tag gcr.io/$project_id/$name

# gcloud run deploy $name --image gcr.io/$project_id/$name --platform managed --memory 1Gi --allow-unauthenticated