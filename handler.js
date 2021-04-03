require("colors");
const fetch = require("node-fetch");

exports.run = (socket, token, keepAliveInfo) => {
    
    socket.on("open", () => {
        socket.send({
            "event": "auth",
            "args": `${token}`
        });
    });

    socket.on("message", message => {
        if (message.event == "token expiring" || message.event == "token expired") {
            const response = keepAlive(keepAliveInfo, socket);
            if (response = "error") {
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
                const type = msg.split("/")[1].split("]")[0];
                if (type == "INFO") {
                    console.log(`${msg}`);
                } else if (type == "WARN") {
                    console.log(`${msg}`.yellow);
                } else if (type == "ERROR" || type == "SEVERE") {
                    console.log(`${msg}`.red);
                }
                break;
            case "status":
                console.log("State: "+message.args[0]);
                break;
            case "stats":
                const msg = JSON.parse(message.args[0]);
                const mb = msg.memory_bytes/1024/1024;
                const mblimit = msg.memory_limit_bytes/1024/1024;

                console.log("----- Status -----".yellow);
                console.log("RAM: ".green+`${mb}mb / ${mblimit}mb`.red);
                console.log("CPU: ".green+`${msg.cpu_absolute}%`.red);
                console.log("RX: ".green+`${msg.rx_bytes} bytes`.red);
                console.log("TX: ".green+`${msg.tx_bytes} bytes`.red);
                console.log("DISK: ".green+`${msg.disk_bytes/1024/1024}mb\n`);
                console.log("STATE: ".green+`${msg.state}`.red);

        }
 
    });
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
                socket.send({ "event": "send stats" });
                break;
            case "power":
                if (!args[0]) return console.log("No power action specified".red);
                socket.send({ "event": "set state", "args": `${args[0]}` });
                break;
            case "logs":
                socket.send({ "event": "send logs" });
                break;
            default:
                console.log("Commands: stats, power <kill/restart/stop/start>, logs");
        }
    } else {
        command(socket, line);
    }
}

function command(socket, line) {
    socket.send({ "event": "send command", "args": `${line}` });
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
    }).then(response => serverResponse = response.data)
    .catch(error => {
        console.error(error);
        serverResponse = "error";
    });

    if (serverResponse == "error") {
        return "error";
    }

    socket.send({ "event": "auth", "args": `${serverResponse.token}` });
}
