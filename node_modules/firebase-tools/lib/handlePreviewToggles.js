"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const cli_color_1 = require("cli-color");
const configstore_1 = require("./configstore");
const previews_1 = require("./previews");
function _errorOut(name) {
    console.log(cli_color_1.bold.red("Error:"), "Did not recognize preview feature", cli_color_1.bold(name));
    process.exit(1);
}
module.exports = function (args) {
    const isValidPreview = lodash_1.has(previews_1.previews, args[1]);
    if (args[0] === "--open-sesame") {
        if (isValidPreview) {
            console.log("Enabling preview feature", cli_color_1.bold(args[1]) + "...");
            previews_1.previews[args[1]] = true;
            configstore_1.configstore.set("previews", previews_1.previews);
            console.log("Preview feature enabled!");
            return process.exit(0);
        }
        _errorOut();
    }
    else if (args[0] === "--close-sesame") {
        if (isValidPreview) {
            console.log("Disabling preview feature", cli_color_1.bold(args[1]));
            lodash_1.unset(previews_1.previews, args[1]);
            configstore_1.configstore.set("previews", previews_1.previews);
            return process.exit(0);
        }
        _errorOut();
    }
    return undefined;
};
