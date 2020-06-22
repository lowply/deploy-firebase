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
const tmp_1 = require("tmp");
const gcp = require("../../gcp");
const utils_1 = require("../../utils");
const prepareFunctionsUpload = require("../../prepareFunctionsUpload");
const checkIam_1 = require("./checkIam");
const GCP_REGION = gcp.cloudfunctions.DEFAULT_REGION;
tmp_1.setGracefulCleanup();
function uploadSource(context, source) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadUrl = yield gcp.cloudfunctions.generateUploadUrl(context.projectId, GCP_REGION);
        context.uploadUrl = uploadUrl;
        const apiUploadUrl = uploadUrl.replace("https://storage.googleapis.com", "");
        yield gcp.storage.upload(source, apiUploadUrl);
    });
}
function deploy(context, options, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options.config.get("functions")) {
            utils_1.logBullet(clc.cyan.bold("functions:") +
                " preparing " +
                clc.bold(options.config.get("functions.source")) +
                " directory for uploading...");
            const source = yield prepareFunctionsUpload(context, options);
            context.existingFunctions = yield gcp.cloudfunctions.listAll(context.projectId);
            payload.functions = {
                triggers: options.config.get("functions.triggers"),
            };
            yield checkIam_1.checkHttpIam(context, options, payload);
            if (!source) {
                return;
            }
            try {
                yield uploadSource(context, source);
                utils_1.logSuccess(clc.green.bold("functions:") +
                    " " +
                    clc.bold(options.config.get("functions.source")) +
                    " folder uploaded successfully");
            }
            catch (err) {
                utils_1.logWarning(clc.yellow("functions:") + " Upload Error: " + err.message);
                throw err;
            }
        }
    });
}
exports.deploy = deploy;
