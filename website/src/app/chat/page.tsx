"use client";

import {useEffect, useRef, useState} from 'react';
import {io, Socket} from "socket.io-client";
import {SocketMessagePayload, SocketRoom} from "@/types";

const rooms: SocketRoom[] = [
    {
        name: "1er arrondissement",
        id: "district1"
    },
    {
        name: "2ème arrondissement",
        id: "district2"
    },
    {
        name: "3ème arrondissement",
        id: "district3"
    },
    {
        name: "4ème arrondissement",
        id: "district4"
    },
    {
        name: "5ème arrondissement",
        id: "district5"
    },
    {
        name: "6ème arrondissement",
        id: "district6"
    },
    {
        name: "7ème arrondissement",
        id: "district7"
    },
    {
        name: "8ème arrondissement",
        id: "district8"
    },
    {
        name: "9ème arrondissement",
        id: "district9"
    }
]

export default function Page() {
    const socketRef = useRef<Socket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<SocketRoom>(rooms[0]);

    useEffect(() => {
        socketRef.current = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL);

        socketRef.current.on("error", (data: { message: string }) => {
            console.error("Erreur socket: ", data.message);
        });

        return () => {
            socketRef.current?.disconnect();
        }
    }, []);

    useEffect(() => {
        if (!socketRef.current) return;

        const currentSocket = socketRef.current;

        setMessages([]);

        currentSocket.emit("joinChat", selectedRoom.id);

        const handleMessage = (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        const handleMessageHistory = (messageHistory: string[]) => {
            setMessages(messageHistory);
        };

        currentSocket.on("message", handleMessage);
        currentSocket.on("messageHistory", handleMessageHistory);

        return () => {
            currentSocket.off("message", handleMessage);
            currentSocket.off("messageHistory", handleMessageHistory);
        };
    }, [selectedRoom]);

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
            <div className="flex mb-4">
                {/* Section des arrondissements */}
                <div className="mr-4 w-64">
                    <h2 className="font-semibold mb-2">Arrondissements</h2>
                    <div className="flex flex-col space-y-1">
                        {rooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                className={`px-3 py-1 rounded text-left ${
                                    selectedRoom.id === room.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200'
                                }`}
                            >
                                {room.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section des messages */}
                <div className="flex-1 flex flex-col">
                    <div className="bg-gray-100 p-3 rounded-t">
                        <h2 className="font-semibold">Chat: {selectedRoom.name}</h2>
                    </div>

                    {/* Zone d'affichage des messages */}
                    <div className="flex-1 bg-white border border-gray-300 p-4 overflow-y-auto">
                        {messages.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Aucun message dans ce canal</p>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="mb-2">
                                    <div className="bg-gray-100 p-2 rounded-lg inline-block">
                                        {msg}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Zone de saisie du message */}
                    <div className="flex border border-gray-300 rounded-b">
                        <input
                            type="text"
                            placeholder="Écrivez un message..."
                            className="flex-1 p-2 outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                    const messagePayload: SocketMessagePayload = {
                                        districtId: selectedRoom.id,
                                        message: e.currentTarget.value
                                    };
                                    socketRef.current?.emit("message", messagePayload);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2"
                            onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                if (input && input.value.trim() !== '') {
                                    const messagePayload: SocketMessagePayload = {
                                        districtId: selectedRoom.id,
                                        message: input.value
                                    };
                                    socketRef.current?.emit("message", messagePayload);
                                    input.value = '';
                                }
                            }}
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}