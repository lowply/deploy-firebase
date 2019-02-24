# A GitHub Action to deploy to Firebase Hosting

- This action only deploys the `master` branch
- Make sure you have the `.firebaserc` and `firebase.json` files in the repository
- Get the Firebase token by running `firebase login:ci` and [store it](https://developer.github.com/actions/creating-workflows/storing-secrets/) into the `FIREBASE_TOKEN` secret in the workflow

Example workflow

```
workflow "Deploy" {
  on = "push"
  resolves = ["Deploy to Firebase"]
}

action "Build Hugo" {
  uses = "lowply/build-hugo@master"
  runs = "hugo"
}

action "Deploy to Firebase" {
  uses = "lowply/deploy-firebase@master"
  needs = ["Build Hugo"]
  secrets = ["FIREBASE_TOKEN"]
}
```