import {Server} from "socket.io";
import {MessagePayload} from "@/_types/MessagePayload";

const websocket = new Server({
    cors: {
        origin: "*"
    }
});

const rooms = ["district1", "district2", "district3", "district4", "district5", "district6", "district7", "district8", "district9"];

websocket.on("connection", (socket) => {
    socket.on("joinChat", (districtId: string) => {
        if (rooms.includes(districtId)) {
            socket.join(districtId);
        } else {
            socket.emit("error", {message: "Invalid district ID"});
        }
    });

    socket.on("message", (payload: MessagePayload) => {
        const {districtId, message} = payload;
        if (rooms.includes(districtId)) {
            websocket.to(districtId).emit("message", message);
        }
    });
});

websocket.listen(3000);