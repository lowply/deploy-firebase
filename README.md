# Deploy to Firebase

A GitHub Action to deploy to Firebase Hosting

- This action only deploys the `master` branch
- Make sure you have the `.firebaserc` and `firebase.json` files in the repository
- Get the Firebase token by running `firebase login:ci` and [store it](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables) into the `FIREBASE_TOKEN` secret in the workflow

Example workflow

```
name: Deploy to Firebase
on: [push]
push:
  branches:
  - master
jobs:
  build:
    [ some build jobs ]
  deploy:
    name: deploy
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Firebase
      uses: lowply/deploy-firebase@v2
      env:
        FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```