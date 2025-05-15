import {Server} from "socket.io";
import {MessagePayload} from "@/_types/MessagePayload";

const websocket = new Server({
    cors: {
        origin: "*",
    }
});

const rooms = ["district1", "district2", "district3", "district4", "district5", "district6", "district7", "district8", "district9"];

const messageHistory: Record<string, string[]> = {};

rooms.forEach(room => {
    messageHistory[room] = [];
});

const addMessageToHistory = (payload: MessagePayload) => {
    messageHistory[payload.districtId].push(payload.message);
    if (messageHistory[payload.districtId].length > 10) {
        messageHistory[payload.districtId].shift();
    }
}

websocket.on("connection", (socket) => {
    socket.on("joinChat", (districtId: string) => {
        if (rooms.includes(districtId)) {
            socket.join(districtId);
            socket.emit("messageHistory", messageHistory[districtId]);
        } else {
            socket.emit("error", {message: "Invalid district ID"});
        }
    });

    socket.on("message", (payload: MessagePayload) => {
        const {districtId, message} = payload;
        if (rooms.includes(districtId)) {
            addMessageToHistory(payload);
            websocket.in(districtId).emit("message", message);
        }
    });
});

websocket.listen(3000);