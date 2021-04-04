require("colors");
const {readFileSync, readFile} = require("fs");
const fetch = require("node-fetch");
const {load} = require("js-yaml");
const {servers, auth, api_url, ssl} = load(readFileSync("./config.yml", "utf-8"));
var rline;
var seeStats = 0

exports.run = (socket, token, keepAliveInfo) => {
    
    socket.on("open", () => {
        socket.send(`{"event": "auth","args": ["${token}"]}`);
    });

    socket.on("message", message => {
        message = JSON.parse(message);
        if (message.event == "token expiring" || message.event == "token expired" || message.event == "jwt error") {
            const response = keepAlive(keepAliveInfo, socket);
            if (response == "error") {
                console.log("Failed sending KeepAlive packet to the WebSocket".red);
                process.exit(2);
            }
            return;
        }

        switch (message.event) {
            case "auth success":
                console.log("Connection stablished with the WebSocket".green);
                break;
            case "console output":
                const msg = message.args[0];
                if (!msg.includes("[")) break;
                console.log(msg);
                break;
            case "status":
                console.log("State: "+message.args[0]);
                break;
            case "stats":
                if (seeStats < 1) return;
                seeStats--;
                const msg1 = JSON.parse(message.args[0]);
                const mb = (msg1.memory_bytes/1024/1024).toFixed(2);
                const mblimit = (msg1.memory_limit_bytes/1024/1024).toFixed(2);

                console.log("----- Status -----".yellow);
                console.log("RAM: ".green+`${mb}mb / ${mblimit}mb`.red);
                console.log("CPU: ".green+`${msg1.cpu_absolute}%`.red);
                console.log("DISK: ".green+`${(msg1.disk_bytes/1024/1024).toFixed(2)}mb\n`);
                console.log("STATE: ".green+`${msg1.state}`.red);

        }
    });
}
exports.reader = (socket) => {
    const {createInterface} = require("readline");
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("line", line => {
        this.line(line, socket);
    });
    rline = rl;
    
}
/**
 * 
 * @param {String} line input
 * @param {WebSocket} socket WebSocket
 */
exports.line = (line, socket) => {
    const args = line.trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.startsWith(";")) {
        switch(cmd.slice(1)) {
            case "stats":
                seeStats++;
                socket.send('{ "event": "send stats" }');
                break;
            case "power":
                if (!args[0]) return console.log("No power action specified".red);
                socket.send(`{ "event": "set state", "args": ["${args[0]}"] }`);
                break;
            case "logs":
                socket.send('{ "event": "send logs" }');
                break;
            case "server":
                if (!args[0]) return console.log("No server specified".red+"Usage: ;server <list/server>".yellow);
                if (args[0].toLowerCase() == "list") {
                    console.log("Server list: ".green);

                    for (var index in servers) {
                        console.log(`>  ${index}`.red+`: ${servers[index]}`.green);
                    }
                    return;
                }
                this.reconnect(socket, args[0]);
                break;
            default:
                console.log("Commands: stats, server <list/server>, power <kill/restart/stop/start>, logs");
        }
    } else {
        command(socket, line);
    }
}

/**
 * 
 * @param {WebSocket} socket 
 * @param {String} server String that matches with a server name in config.yml 
 * @returns 
 */
exports.reconnect = (socket, server) => {
    var i = 0;
    
    for (var index in servers) {
        if (index != server) i++;
        else {
            i = 0;
            break;
        }
    }
    if (i > 0) {
        return console.log("Specified server doesn't exist.\nFor a list of servers, run".red
        +" ;server list".yellow);
    }
    const skt = require("./socket");
    socket.close();
    rline.close();
    console.log("Socket has been closed!".green);
    skt.run(servers[server], auth, api_url, ssl);
    console.log("Connecting to the new server...".yellow);
}

function command(socket, line) {
    socket.send(`{ "event": "send command", "args": ["${line}"] }`);
}

async function keepAlive(keepAliveInfo, socket) {
    const {protocol, api, server, auth} = keepAliveInfo;

    var serverResponse;
    await fetch(`${protocol}://${api}/api/client/servers/${server}/websocket`, {
        "method": "GET",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth}`,
        }
    }).then(response => serverResponse = response.json())
    .then(body => serverResponse = body.data)
    .catch(error => {
        console.error(error);
        serverResponse = "error";
    });

    if (serverResponse == "error") {
        return "error";
    }

    socket.send(`{ "event": "auth", "args": ["${serverResponse.token}"] }`);
}
