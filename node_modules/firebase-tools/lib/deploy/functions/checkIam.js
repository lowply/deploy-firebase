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
const lodash_1 = require("lodash");
const cli_color_1 = require("cli-color");
const logger_1 = require("../../logger");
const track = require("../../track");
const functionsDeployHelper_1 = require("../../functionsDeployHelper");
const error_1 = require("../../error");
const iam_1 = require("../../gcp/iam");
const PERMISSION = "cloudfunctions.functions.setIamPolicy";
function checkServiceAccountIam(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const saEmail = `${projectId}@appspot.gserviceaccount.com`;
        let passed = false;
        try {
            const iamResult = yield iam_1.testResourceIamPermissions("https://iam.googleapis.com", "v1", `projects/${projectId}/serviceAccounts/${saEmail}`, ["iam.serviceAccounts.actAs"]);
            passed = iamResult.passed;
        }
        catch (err) {
            logger_1.debug("[functions] service account IAM check errored, deploy may fail:", err);
            return;
        }
        if (!passed) {
            throw new error_1.FirebaseError(`Missing permissions required for functions deploy. You must have permission ${cli_color_1.bold("iam.serviceAccounts.ActAs")} on service account ${cli_color_1.bold(saEmail)}.\n\n` +
                `To address this error, ask a project Owner to assign your account the "Service Account User" role from this URL:\n\n` +
                `https://console.cloud.google.com/iam-admin/iam?project=${projectId}`);
        }
    });
}
exports.checkServiceAccountIam = checkServiceAccountIam;
function checkHttpIam(context, options, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const triggers = payload.functions.triggers;
        const functionsInfo = functionsDeployHelper_1.getFunctionsInfo(triggers, context.projectId);
        const filterGroups = functionsDeployHelper_1.getFilterGroups(options);
        const httpFunctionNames = functionsInfo
            .filter((f) => lodash_1.has(f, "httpsTrigger"))
            .map((f) => f.name);
        const httpFunctionFullNames = functionsDeployHelper_1.getReleaseNames(httpFunctionNames, [], filterGroups);
        const existingFunctionFullNames = context.existingFunctions.map((f) => f.name);
        const newHttpFunctions = httpFunctionFullNames.filter((name) => !existingFunctionFullNames.includes(name));
        if (newHttpFunctions.length === 0) {
            return;
        }
        logger_1.debug("[functions] found", newHttpFunctions.length, "new HTTP functions, testing setIamPolicy permission...");
        let passed = true;
        try {
            const iamResult = yield iam_1.testIamPermissions(context.projectId, [PERMISSION]);
            passed = iamResult.passed;
        }
        catch (e) {
            logger_1.debug("[functions] failed http create setIamPolicy permission check. deploy may fail:", e);
            return;
        }
        if (!passed) {
            track("Error (User)", "deploy:functions:http_create_missing_iam");
            throw new error_1.FirebaseError(`Missing required permission on project ${cli_color_1.bold(context.projectId)} to deploy new HTTPS functions. The permission ${cli_color_1.bold(PERMISSION)} is required to deploy the following functions:\n\n- ` +
                newHttpFunctions.map((name) => lodash_1.last(name.split("/"))).join("\n- ") +
                `\n\nTo address this error, please ask a project Owner to assign your account the "Cloud Functions Admin" role at the following URL:\n\nhttps://console.cloud.google.com/iam-admin/iam?project=${context.projectId}`);
        }
        logger_1.debug("[functions] found setIamPolicy permission, proceeding with deploy");
    });
}
exports.checkHttpIam = checkHttpIam;
