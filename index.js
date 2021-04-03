const {readFileSync} = require("fs");
const prompt = require("prompt");
const {load} = require("js-yaml");
const {servers, auth, api_url, ssl} = load(readFileSync("./config.yml", "utf8"));
const {createInterface} = require("readline");
require("colors");

prompt.start();
console.log("Server List:".green);

for (var index in servers) {
    console.log(`>  ${index}`.red+`: ${servers[index]}`.green);
}
console.log("\nWhich server you want to sync?".yellow);
console.log("Sensitive case".yellow);
console.log("Ctrl+C to abort at any time (ignore errors)".magenta);

prompt.get(['server'], (_err, response) => {
    var valid = 0; // valid > 0 means invalid server name
    
    for (var index in servers) {
        if (index != response.server) valid++;
        else {
            valid = 0;
            break;
        }
    }

    if (valid > 0) {
        return console.log("Server name is invalid.\nAborting...".red);
    }

    if (!auth) {
        return console.log("Auth not found, aborting...".red);
    }
    const skt = require("./socket");
    skt.run(servers[response.server], auth, api_url, ssl);
});
