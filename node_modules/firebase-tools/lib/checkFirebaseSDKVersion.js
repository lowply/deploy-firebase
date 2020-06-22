"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const clc = require("cli-color");
const path = require("path");
const semver = require("semver");
const spawn = require("cross-spawn");
const utils = require("./utils");
const logger = require("./logger");
function getFunctionsSDKVersion(sourceDir) {
    try {
        const child = spawn.sync("npm", ["list", "firebase-functions", "--json=true"], {
            cwd: sourceDir,
            encoding: "utf8",
        });
        if (child.error) {
            logger.debug("getFunctionsSDKVersion encountered error:", child.error.stack);
            return;
        }
        const output = JSON.parse(child.stdout);
        return _.get(output, ["dependencies", "firebase-functions", "version"]);
    }
    catch (e) {
        logger.debug("getFunctionsSDKVersion encountered error:", e);
        return;
    }
}
exports.getFunctionsSDKVersion = getFunctionsSDKVersion;
function checkFunctionsSDKVersion(options) {
    if (!options.config.has("functions")) {
        return;
    }
    const sourceDir = path.join(options.config.projectDir, options.config.get("functions.source"));
    const currentVersion = getFunctionsSDKVersion(sourceDir);
    if (!currentVersion) {
        logger.debug("getFunctionsSDKVersion was unable to retrieve 'firebase-functions' version");
        return;
    }
    try {
        const child = spawn.sync("npm", ["show", "firebase-functions", "--json=true"], {
            encoding: "utf8",
        });
        if (child.error) {
            logger.debug("checkFunctionsSDKVersion was unable to fetch information from NPM", child.error.stack);
            return;
        }
        const output = JSON.parse(child.stdout);
        if (_.isEmpty(output)) {
            return;
        }
        const latest = _.get(output, ["dist-tags", "latest"]);
        if (semver.lt(currentVersion, latest)) {
            utils.logWarning(clc.bold.yellow("functions: ") +
                "package.json indicates an outdated version of firebase-functions.\nPlease upgrade using " +
                clc.bold("npm install --save firebase-functions@latest") +
                " in your functions directory.");
            if (semver.satisfies(currentVersion, "0.x") && semver.satisfies(latest, "1.x")) {
                utils.logWarning(clc.bold.yellow("functions: ") +
                    "Please note that there will be breaking changes when you upgrade.\n Go to " +
                    clc.bold("https://firebase.google.com/docs/functions/beta-v1-diff") +
                    " to learn more.");
            }
        }
    }
    catch (e) {
        logger.debug("checkFunctionsSDKVersion encountered error:", e);
        return;
    }
}
exports.checkFunctionsSDKVersion = checkFunctionsSDKVersion;
