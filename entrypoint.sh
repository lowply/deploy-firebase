#!/bin/sh

if [ -z "${FIREBASE_TOKEN}" ]; then
    echo "FIREBASE_TOKEN is missing"
    exit 1
fi

if [ -z "${FIREBASE_PROJECT}" ]; then
    echo "FIREBASE_PROJECT is missing"
    exit 1
fi

if [ -z "${TARGET_BRANCH}" ]; then
    TARGET_BRANCH="master"
fi

if [ "${GITHUB_REF}" != "refs/heads/${TARGET_BRANCH}" ]; then
    echo "Current branch: ${GITHUB_REF}"
    echo "Aborting deployment"
    exit 1
fi

firebase deploy \
    -m "${GITHUB_SHA}" \
    --project ${FIREBASE_PROJECT} \
    --only hosting
