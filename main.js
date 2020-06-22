const core = require('@actions/core');
const client = require("firebase-tools");

// can we add -m ? what about --only ?

if (!process.env.FIREBASE_TOKEN) {
    core.setFailed("FIREBASE_TOKEN is empty");
}

if (!process.env.FIREBASE_PROJECT) {
    core.setFailed("FIREBASE_PROJECT is empty");
}

let target = "";

if (!process.env.TARGET_BRANCH) {
    target = "master";
} else {
    target = process.env.TARGET_BRANCH;
}

let current = process.env.GITHUB_REF;

if (current != `refs/heads/${target}`){
    core.debug(`Current branch: ${current}`)
    core.setFailed("Aborting deployment");
}

client
    .deploy({
        project: process.env.FIREBASE_PROJECT,
        token: process.env.FIREBASE_TOKEN,
        force: true,
        cwd: "public",
    })
    .then(function() {
        core.debug("Deployment succeeded!");
    })
    .catch(function(err) {
        core.setFailed("Deployment failed: " + err);
    });
