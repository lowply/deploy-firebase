"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const clc = require("cli-color");
const request = require("request");
const semver = require("semver");
const configstore_1 = require("./configstore");
const api = require("./api");
const logger = require("./logger");
const utils = require("./utils");
const pkg = require("../package.json");
const ONE_DAY_MS = 1000 * 60 * 60 * 24;
function fetchMOTD() {
    let motd = configstore_1.configstore.get("motd");
    const motdFetched = configstore_1.configstore.get("motd.fetched") || 0;
    if (motd && motdFetched > Date.now() - ONE_DAY_MS) {
        if (motd.minVersion && semver.gt(motd.minVersion, pkg.version)) {
            logger.error(clc.red("Error:"), "CLI is out of date (on", clc.bold(pkg.version), ", need at least", clc.bold(motd.minVersion) + ")\n\nRun", clc.bold("npm install -g firebase-tools"), "to upgrade.");
            process.exit(1);
        }
        if (motd.message && process.stdout.isTTY) {
            const lastMessage = configstore_1.configstore.get("motd.lastMessage");
            if (lastMessage !== motd.message) {
                logger.info();
                logger.info(motd.message);
                logger.info();
                configstore_1.configstore.set("motd.lastMessage", motd.message);
            }
        }
    }
    else {
        request({
            url: utils.addSubdomain(api.realtimeOrigin, "firebase-public") + "/cli.json",
            json: true,
        }, (err, res, body) => {
            if (err) {
                return;
            }
            motd = _.assign({}, body);
            configstore_1.configstore.set("motd", motd);
            configstore_1.configstore.set("motd.fetched", Date.now());
        });
    }
}
exports.fetchMOTD = fetchMOTD;
