"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const cli_color_1 = require("cli-color");
const track = require("./track");
const api = require("./api");
const utils = require("./utils");
const error_1 = require("./error");
exports.POLL_SETTINGS = {
    pollInterval: 10000,
    pollsBeforeRetry: 12,
};
function check(projectId, apiName, prefix, silent = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield api.request("GET", `/v1/projects/${projectId}/services/${apiName}`, {
            auth: true,
            origin: api.serviceUsageOrigin,
        });
        const isEnabled = _.get(response.body, "state") === "ENABLED";
        if (isEnabled && !silent) {
            utils.logLabeledSuccess(prefix, `required API ${cli_color_1.bold(apiName)} is enabled`);
        }
        return isEnabled;
    });
}
exports.check = check;
function enable(projectId, apiName) {
    return __awaiter(this, void 0, void 0, function* () {
        return api.request("POST", `/v1/projects/${projectId}/services/${apiName}:enable`, {
            auth: true,
            origin: api.serviceUsageOrigin,
        });
    });
}
exports.enable = enable;
function pollCheckEnabled(projectId, apiName, prefix, silent, enablementRetries, pollRetries = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        if (pollRetries > exports.POLL_SETTINGS.pollsBeforeRetry) {
            return enableApiWithRetries(projectId, apiName, prefix, silent, enablementRetries + 1);
        }
        yield new Promise((resolve) => {
            setTimeout(resolve, exports.POLL_SETTINGS.pollInterval);
        });
        const isEnabled = yield check(projectId, apiName, prefix, silent);
        if (isEnabled) {
            track("api_enabled", apiName);
            return;
        }
        if (!silent) {
            utils.logLabeledBullet(prefix, `waiting for API ${cli_color_1.bold(apiName)} to activate...`);
        }
        return pollCheckEnabled(projectId, apiName, prefix, silent, enablementRetries, pollRetries + 1);
    });
}
function enableApiWithRetries(projectId, apiName, prefix, silent, enablementRetries = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        if (enablementRetries > 1) {
            throw new error_1.FirebaseError(`Timed out waiting for API ${cli_color_1.bold(apiName)} to enable. Please try again in a few minutes.`);
        }
        yield enable(projectId, apiName);
        return pollCheckEnabled(projectId, apiName, prefix, silent, enablementRetries);
    });
}
function ensure(projectId, apiName, prefix, silent = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!silent) {
            utils.logLabeledBullet(prefix, `ensuring required API ${cli_color_1.bold(apiName)} is enabled...`);
        }
        const isEnabled = yield check(projectId, apiName, prefix, silent);
        if (isEnabled) {
            return;
        }
        if (!silent) {
            utils.logLabeledWarning(prefix, `missing required API ${cli_color_1.bold(apiName)}. Enabling now...`);
        }
        return enableApiWithRetries(projectId, apiName, prefix, silent);
    });
}
exports.ensure = ensure;
