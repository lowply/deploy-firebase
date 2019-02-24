#!/bin/sh

if [ -z "$FIREBASE_TOKEN" ]; then
    echo "FIREBASE_TOKEN is missing"
    exit 1
fi

if [ ! -f ".firebaserc" ]; then
    echo ".firebaserc is missing"
    exit 1
fi

if [ "${GITHUB_REF}" != "refs/heads/master" ]; then
    echo "Branch: ${GITHUB_REF}"
    echo "Aborting non-master branch deployment"
    exit 78
fi

firebase deploy --only hosting
