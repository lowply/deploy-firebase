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
const Table = require("cli-table");
const command_1 = require("../command");
const getProjectId = require("../getProjectId");
const apps_1 = require("../management/apps");
const requireAuth_1 = require("../requireAuth");
const logger = require("../logger");
const utils_1 = require("../utils");
function logCertificatesList(certificates) {
    if (certificates.length === 0) {
        logger.info("No SHA certificate hashes found.");
        return;
    }
    const tableHead = ["App Id", "SHA Id", "SHA Hash", "SHA Hash Type"];
    const table = new Table({ head: tableHead, style: { head: ["green"] } });
    certificates.forEach(({ name, shaHash, certType }) => {
        const splitted = name.split("/");
        const appId = splitted[3];
        const shaId = splitted[5];
        table.push([appId, shaId, shaHash, certType]);
    });
    logger.info(table.toString());
}
function logCertificatesCount(count = 0) {
    if (count === 0) {
        return;
    }
    logger.info("");
    logger.info(`${count} SHA hash(es) total.`);
}
module.exports = new command_1.Command("apps:android:sha:list <appId>")
    .description("list the SHA certificate hashes for a given app id. ")
    .before(requireAuth_1.requireAuth)
    .action((appId = "", options) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = getProjectId(options);
    const shaCertificates = yield utils_1.promiseWithSpinner(() => __awaiter(void 0, void 0, void 0, function* () { return yield apps_1.listAppAndroidSha(projectId, appId); }), "Preparing the list of your Firebase Android app SHA certificate hashes");
    logCertificatesList(shaCertificates);
    logCertificatesCount(shaCertificates.length);
    return shaCertificates;
}));
