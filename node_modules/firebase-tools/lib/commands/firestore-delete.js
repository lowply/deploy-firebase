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
const types_1 = require("../emulator/types");
const commandUtils_1 = require("../emulator/commandUtils");
const FirestoreDelete = require("../firestore/delete");
const prompt_1 = require("../prompt");
const requirePermissions_1 = require("../requirePermissions");
const utils = require("../utils");
function getConfirmationMessage(deleteOp, options) {
    if (options.allCollections) {
        return ("You are about to delete " +
            clc.bold.yellow.underline("THE ENTIRE DATABASE") +
            " for " +
            clc.cyan(options.project) +
            ". Are you sure?");
    }
    if (deleteOp.isDocumentPath) {
        if (options.recursive) {
            return ("You are about to delete the document at " +
                clc.cyan(deleteOp.path) +
                " and all of its subcollections. Are you sure?");
        }
        return "You are about to delete the document at " + clc.cyan(deleteOp.path) + ". Are you sure?";
    }
    if (options.recursive) {
        return ("You are about to delete all documents in the collection at " +
            clc.cyan(deleteOp.path) +
            " and all of their subcollections. " +
            "Are you sure?");
    }
    return ("You are about to delete all documents in the collection at " +
        clc.cyan(deleteOp.path) +
        ". Are you sure?");
}
module.exports = new command_1.Command("firestore:delete [path]")
    .description("Delete data from Cloud Firestore.")
    .option("-r, --recursive", "Recursive. Delete all documents and subcollections. " +
    "Any action which would result in the deletion of child documents will fail if " +
    "this argument is not passed. May not be passed along with --shallow.")
    .option("--shallow", "Shallow. Delete only parent documents and ignore documents in " +
    "subcollections. Any action which would orphan documents will fail if this argument " +
    "is not passed. May not be passed along with -r.")
    .option("--all-collections", "Delete all. Deletes the entire Firestore database, " +
    "including all collections and documents. Any other flags or arguments will be ignored.")
    .option("-y, --yes", "No confirmation. Otherwise, a confirmation prompt will appear.")
    .before(commandUtils_1.printNoticeIfEmulated, types_1.Emulators.FIRESTORE)
    .before(requirePermissions_1.requirePermissions, ["datastore.entities.list", "datastore.entities.delete"])
    .action((path, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!path && !options.allCollections) {
        return utils.reject("Must specify a path.", { exit: 1 });
    }
    const deleteOp = new FirestoreDelete(options.project, path, {
        recursive: options.recursive,
        shallow: options.shallow,
        allCollections: options.allCollections,
    });
    if (!options.yes) {
        const res = yield prompt_1.prompt(options, [
            {
                type: "confirm",
                name: "confirm",
                default: false,
                message: getConfirmationMessage(deleteOp, options),
            },
        ]);
        if (!res.confirm) {
            return utils.reject("Command aborted.", { exit: 1 });
        }
    }
    if (options.allCollections) {
        return deleteOp.deleteDatabase();
    }
    return deleteOp.execute();
}));
