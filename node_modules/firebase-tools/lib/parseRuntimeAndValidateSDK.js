"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const path = require("path");
const clc = require("cli-color");
const semver = require("semver");
const checkFirebaseSDKVersion_1 = require("./checkFirebaseSDKVersion");
const error_1 = require("./error");
const utils = require("./utils");
const logger = require("./logger");
const track = require("./track");
const cjson = require("cjson");
const MESSAGE_FRIENDLY_RUNTIMES = {
    nodejs6: "Node.js 6 (Deprecated)",
    nodejs8: "Node.js 8",
    nodejs10: "Node.js 10",
};
const ENGINE_RUNTIMES = {
    6: "nodejs6",
    8: "nodejs8",
    10: "nodejs10",
};
exports.UNSUPPORTED_NODE_VERSION_MSG = clc.bold(`package.json in functions directory has an engines field which is unsupported. ` +
    `The only valid choices are: ${clc.bold('{"node": "8"}')} and ${clc.bold('{"node": "10"}')}.`);
exports.DEPRECATION_WARNING_MSG = clc.bold.yellow("functions: ") +
    "Deploying functions to Node 6 runtime, which is deprecated. Node 8 is available " +
    "and is the recommended runtime.";
exports.FUNCTIONS_SDK_VERSION_TOO_OLD_WARNING = clc.bold.yellow("functions: ") +
    "You must have a " +
    clc.bold("firebase-functions") +
    " version that is at least 2.0.0. Please run " +
    clc.bold("npm i --save firebase-functions@latest") +
    " in the functions folder.";
function functionsSDKTooOld(sourceDir, minRange) {
    const userVersion = checkFirebaseSDKVersion_1.getFunctionsSDKVersion(sourceDir);
    if (!userVersion) {
        logger.debug("getFunctionsSDKVersion was unable to retrieve 'firebase-functions' version");
        return false;
    }
    try {
        if (!semver.intersects(userVersion, minRange)) {
            return true;
        }
    }
    catch (e) {
    }
    return false;
}
function getHumanFriendlyRuntimeName(runtime) {
    return _.get(MESSAGE_FRIENDLY_RUNTIMES, runtime, runtime);
}
exports.getHumanFriendlyRuntimeName = getHumanFriendlyRuntimeName;
function getRuntimeChoice(sourceDir) {
    const packageJsonPath = path.join(sourceDir, "package.json");
    const loaded = cjson.load(packageJsonPath);
    const engines = loaded.engines;
    if (!engines || !engines.node) {
        throw new error_1.FirebaseError(`Engines field is required but was not found in package.json.\n` +
            `To fix this, add the following lines to your package.json: \n
      "engines": {
        "node": "10"
      }\n`);
    }
    const runtime = ENGINE_RUNTIMES[engines.node];
    if (!runtime) {
        track("functions_runtime_notices", "package_missing_runtime");
        throw new error_1.FirebaseError(exports.UNSUPPORTED_NODE_VERSION_MSG, { exit: 1 });
    }
    if (runtime === "nodejs6") {
        track("functions_runtime_notices", "nodejs6_deploy_prohibited");
        throw new error_1.FirebaseError(exports.UNSUPPORTED_NODE_VERSION_MSG, { exit: 1 });
    }
    else {
        if (functionsSDKTooOld(sourceDir, ">=2")) {
            track("functions_runtime_notices", "functions_sdk_too_old");
            utils.logWarning(exports.FUNCTIONS_SDK_VERSION_TOO_OLD_WARNING);
        }
    }
    return runtime;
}
exports.getRuntimeChoice = getRuntimeChoice;
