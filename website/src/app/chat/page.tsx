"use client";

import {useEffect, useRef, useState} from 'react';
import {io, Socket} from "socket.io-client";
import {SocketMessagePayload, SocketRoom} from "@/types";
import {FiSend, FiMenu} from 'react-icons/fi';
import {useSession} from "next-auth/react";
import {usePathname, useRouter} from 'next/navigation';

const rooms: SocketRoom[] = [
    {name: "1er", id: "district1"},
    {name: "2ème", id: "district2"},
    {name: "3ème", id: "district3"},
    {name: "4ème", id: "district4"},
    {name: "5ème", id: "district5"},
    {name: "6ème", id: "district6"},
    {name: "7ème", id: "district7"},
    {name: "8ème", id: "district8"},
    {name: "9ème", id: "district9"}
];

export default function Page() {
    const {data: session} = useSession();
    const currentPath = usePathname();
    const router = useRouter();
    const socketRef = useRef<Socket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<SocketRoom>(rooms[0]);
    const [inputMessage, setInputMessage] = useState<string>("");
    const [showSidebar, setShowSidebar] = useState<boolean>(false);

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

        setShowSidebar(false);

        return () => {
            currentSocket.off("message", handleMessage);
            currentSocket.off("messageHistory", handleMessageHistory);
        };
    }, [selectedRoom]);

    useEffect(() => {
        if (messages.length > 0) {
            const messageContainer = document.querySelector('.messages-container');
            if (messageContainer) {
                setTimeout(() => {
                    messageContainer.scrollTop = messageContainer.scrollHeight;
                }, 100);
            }
        }
    }, [messages]);

    const sendMessage = () => {
        if (!session) {
            router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
        }
        if (inputMessage.trim() === '') return;

        const messagePayload: SocketMessagePayload = {
            districtId: selectedRoom.id,
            message: inputMessage
        };

        socketRef.current?.emit("message", messagePayload);
        setInputMessage('');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="md:hidden flex items-center justify-end bg-white p-4 shadow-sm">
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="bg-blue-500 text-white p-2 rounded-full"
                >
                    <FiMenu size={20}/>
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div
                    className={`${showSidebar ? 'absolute inset-0 z-10 bg-white' : 'hidden'} md:relative md:block w-full md:w-72 md:min-w-[18rem] bg-white shadow-md md:shadow-none overflow-y-auto p-4`}>
                    <h2 className="font-bold mb-4 text-gray-800 md:ml-16 mt-16">Arrondissements</h2>
                    <div className="flex flex-col space-y-2 md:ml-16">
                        {rooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                className={`px-4 py-3 rounded-lg text-left transition-colors ${
                                    selectedRoom.id === room.id
                                        ? 'bg-blue opacity-80 text-white font-bold'
                                        : 'hover:bg-blue opacity-80 hover:text-white font-bold'
                                }`}
                            >
                                {room.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full pt-10">
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 max-h-[60vh] md:max-h-[65vh] messages-container">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">
                                    Aucun message dans ce canal
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg, index) => (
                                    <div key={index} className="animate-fadeIn">
                                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%] inline-block">
                                            {msg}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-white border-t border-gray-300">
                        <div className="flex items-center rounded-full bg-gray-100 px-4 py-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Écrivez un message..."
                                className="flex-1 bg-transparent outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                className="ml-2 bg-blue-500 text-white p-2 rounded-full transition-colors hover:bg-blue-600"
                            >
                                <FiSend size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}