"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketClients = void 0;
function socketClients({ socket, }) {
    console.log("a socket client is connected");
    socket.on("disconnect", () => {
        console.log("a socket client is disconnected");
    });
}
exports.socketClients = socketClients;
