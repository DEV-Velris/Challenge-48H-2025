import {SocketMessage} from "@/types/SocketMessage";

export type SocketMessagePayload = {
    districtId: string;
    message: SocketMessage;
}
