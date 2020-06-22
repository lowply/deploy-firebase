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
module.exports = new command_1.Command("apps:android:sha:delete <appId> <shaId>")
    .description("delete a SHA certificate hash for a given app id.")
    .before(requireAuth_1.requireAuth)
    .action((appId = "", shaId = "", options) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = getProjectId(options);
    yield utils_1.promiseWithSpinner(() => __awaiter(void 0, void 0, void 0, function* () { return yield apps_1.deleteAppAndroidSha(projectId, appId, shaId); }), `Deleting Android SHA certificate hash with SHA id ${clc.bold(shaId)} and Android app Id ${clc.bold(appId)}`);
}));
