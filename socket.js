const fetch = require("node-fetch");
const WebSocket = require("ws");

/**
 * 
 * @param {String} server Server's ID
 * @param {String} auth Pterodactyl API key
 * @param {String} api Api url
 * @param {Boolean} ssl boolean
 */
exports.run = (server, auth, api, ssl) => {
    var protocol;
    if (ssl) {
        protocol = "https";
    }
    else {
        protocol = "http";
    }

    var serverResponse; 
    fetch(`${protocol}://${api}/api/client/servers/${server}/websocket`, {
        "method": "GET",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth}`,
        }
    }).then(response => serverResponse = response.data)
    .catch(error => {
        console.error(error);
        serverResponse = "error";
    });
    if (serverResponse == "error") {
        return console.log("\n\nAPI request failed, aborting...".red);
    }

    var token = serverResponse.token;
    const wss = serverResponse.socket;

    const socket = new WebSocket(wss);

    const keepAliveInfo = {
        server: server,
        api: api,
        protocol: protocol,
        auth: auth
    }

    const handler = require("./handler");
    handler.run(socket, token, keepAliveInfo);
    return socket;
}