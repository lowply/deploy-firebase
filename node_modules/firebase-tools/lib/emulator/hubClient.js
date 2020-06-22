"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api = require("../api");
const hub_1 = require("./hub");
const error_1 = require("../error");
class EmulatorHubClient {
    constructor(projectId) {
        this.projectId = projectId;
        this.locator = hub_1.EmulatorHub.readLocatorFile(projectId);
    }
    foundHub() {
        return this.locator !== undefined;
    }
    getStatus() {
        return api.request("GET", "/", {
            origin: this.origin,
        });
    }
    getEmulators() {
        return api
            .request("GET", hub_1.EmulatorHub.PATH_EMULATORS, {
            origin: this.origin,
            json: true,
        })
            .then((res) => {
            return res.body;
        });
    }
    postExport(path) {
        return api.request("POST", hub_1.EmulatorHub.PATH_EXPORT, {
            origin: this.origin,
            json: true,
            data: {
                path,
            },
        });
    }
    get origin() {
        const locator = this.assertLocator();
        return `http://${locator.host}:${locator.port}`;
    }
    assertLocator() {
        if (this.locator === undefined) {
            throw new error_1.FirebaseError(`Cannot contact the Emulator Hub for project ${this.projectId}`);
        }
        return this.locator;
    }
}
exports.EmulatorHubClient = EmulatorHubClient;
