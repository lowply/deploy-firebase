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
const clc = require("cli-color");
const command_1 = require("../command");
const getProjectId = require("../getProjectId");
const apps_1 = require("../management/apps");
const requireAuth_1 = require("../requireAuth");
const utils_1 = require("../utils");
function getCertHashType(shaHash) {
    shaHash = shaHash.replace(/:/g, "");
    const shaHashCount = shaHash.length;
    if (shaHashCount == 40)
        return apps_1.ShaCertificateType.SHA_1.toString();
    if (shaHashCount == 64)
        return apps_1.ShaCertificateType.SHA_256.toString();
    return apps_1.ShaCertificateType.SHA_CERTIFICATE_TYPE_UNSPECIFIED.toString();
}
module.exports = new command_1.Command("apps:android:sha:create <appId> <shaHash>")
    .description("add a SHA certificate hash for a given app id.")
    .before(requireAuth_1.requireAuth)
    .action((appId = "", shaHash = "", options) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = getProjectId(options);
    const shaCertificate = yield utils_1.promiseWithSpinner(() => __awaiter(void 0, void 0, void 0, function* () {
        return yield apps_1.createAppAndroidSha(projectId, appId, {
            shaHash: shaHash,
            certType: getCertHashType(shaHash),
        });
    }), `Creating Android SHA certificate ${clc.bold(options.shaHash)}with Android app Id ${clc.bold(appId)}`);
    return shaCertificate;
}));
