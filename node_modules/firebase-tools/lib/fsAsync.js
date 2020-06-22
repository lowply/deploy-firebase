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
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const _ = require("lodash");
const minimatch = require("minimatch");
function readdirRecursiveHelper(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirContents = fs_extra_1.readdirSync(options.path);
        const fullPaths = dirContents.map((n) => path_1.join(options.path, n));
        const filteredPaths = _.reject(fullPaths, options.filter);
        const filePromises = [];
        for (const p of filteredPaths) {
            const fstat = fs_extra_1.statSync(p);
            if (fstat.isFile()) {
                filePromises.push(Promise.resolve({ name: p, mode: fstat.mode }));
            }
            if (!fstat.isDirectory()) {
                continue;
            }
            filePromises.push(readdirRecursiveHelper({ path: p, filter: options.filter }));
        }
        const files = yield Promise.all(filePromises);
        let flatFiles = _.flattenDeep(files);
        flatFiles = _.reject(flatFiles, (f) => _.isNull(f));
        return flatFiles;
    });
}
function readdirRecursive(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const mmopts = { matchBase: true, dot: true };
        const rules = _.map(options.ignore || [], (glob) => {
            return (p) => minimatch(p, glob, mmopts);
        });
        const filter = (t) => {
            return rules.some((rule) => {
                return rule(t);
            });
        };
        return readdirRecursiveHelper({
            path: options.path,
            filter: filter,
        });
    });
}
exports.readdirRecursive = readdirRecursive;
