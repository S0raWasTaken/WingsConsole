const {createInterface} = require("readline");

exports.run = (socket) => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on(line => {
        if (n == 1) {
            n--;
            return;
        }
        const handler = require("./handler");
        handler.line(line, socket);
    });
}