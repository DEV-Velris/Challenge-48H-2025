'use client'

import React, { createContext, useContext, useState, ReactNode } from "react";

type Notification = {
    message: string;
    type?: "success" | "error" | "info";
};

type NotificationContextType = {
    push: (notification: Notification) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within NotificationProvider");
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notification, setNotification] = useState<Notification | null>(null);

    const push = (notif: Notification) => {
        setNotification(notif);

        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification(notif.message);
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification(notif.message);
                    }
                });
            }
        }

        setTimeout(() => setNotification(null), 5000);
    };

    return (
        <NotificationContext.Provider value={{ push }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const NotificationAuto = ({
    message,
    type = "success",
}: {
    message: string;
    type?: "success" | "error" | "info";
}) => {
    const { push } = useNotification();

    React.useEffect(() => {
        push({ message, type });
    }, []);

    return null;
};