# Deploy to Firebase

A GitHub Action to deploy to Firebase Hosting

- This action only deploys the `master` branch
- Make sure you have the `.firebaserc` and `firebase.json` files in the repository
- Get the Firebase token by running `firebase login:ci` and [store it](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables) into the `FIREBASE_TOKEN` secret in the workflow

Example workflow

```
name: Build and Deploy
on:
  push:
    branches:
    - master
jobs:
  main:
    name: Build and Deploy
    runs-on: ubuntu-latest
    steps:
    - name: Check out code
      uses: actions/checkout@master
    - name: Build Hugo
      uses: lowply/build-hugo@v0.0.2
    - name: Deploy to Firebase
      uses: lowply/deploy-firebase@v0.0.2
      env:
        FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
        FIREBASE_PROJECT: name-of-the-project
```
