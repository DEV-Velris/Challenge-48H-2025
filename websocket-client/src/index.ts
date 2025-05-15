import {io} from "socket.io-client";

const clientSocket = io("http://localhost:3000");

clientSocket.emit("joinChat", "district1");

clientSocket.on("message", (data) => {
    console.log("Message reçu :", data);
});

setTimeout(() => {
    clientSocket.emit("message", { districtId: "district1", message: "Hello depuis le client !" });
}, 1000);