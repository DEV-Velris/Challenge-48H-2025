'use client';

import React, { useState, useEffect } from 'react';

interface NotificationProps {
    title: string;
    body: string;
    icon?: string;
    onClick?: () => void;
}

const NextNotification: React.FC = () => {
    const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

    useEffect(() => {
        // Vérifier si les notifications sont supportées
        if (!('Notification' in window)) {
            console.error('Ce navigateur ne supporte pas les notifications de bureau');
            return;
        }

        // Vérifier l'état de la permission
        if (Notification.permission === 'granted') {
            setPermissionGranted(true);
        }
    }, []);

    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setPermissionGranted(true);
            }
        } catch (error) {
            console.error('Erreur lors de la demande de permission:', error);
        }
    };

    const showNotification = ({ title, body, icon, onClick }: NotificationProps) => {
        if (!permissionGranted) {
            console.warn('Permission de notification non accordée');
            return;
        }

        try {
            const notification = new Notification(title, {
                body,
                icon: icon || '/favicon.ico',
            });

            if (onClick) {
                notification.onclick = onClick;
            }
        } catch (error) {
            console.error('Erreur lors de l\'affichage de la notification:', error);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-md">
            <h2 className="text-xl font-semibold text-gray-1">Notifications</h2>

            {!permissionGranted ? (
                <div>
                    <p className="text-gray-1 mb-2">Pour recevoir des notifications, veuillez autoriser les notifications.</p>
                    <button onClick={requestPermission}>
                        Activer les notifications
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-gray-1 mb-2">Les notifications sont activées!</p>
                    <button
                        onClick={() => showNotification({
                            title: 'Notification test',
                            body: 'Ceci est un test de notification',
                            onClick: () => console.log('Notification cliquée')
                        })}
                    >
                        Envoyer une notification test
                    </button>
                </div>
            )}
        </div>
    );
};

export const useNotification = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    // Initialisation des permissions
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);

            // Forcer un refresh après une demande utilisateur active
            const checkPermission = () => {
                setPermission(Notification.permission);
            };
            document.addEventListener('visibilitychange', checkPermission);

            return () => {
                document.removeEventListener('visibilitychange', checkPermission);
            };
        }
    }, []);

    const requestPermission = async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            console.warn('Notifications non supportées');
            return 'denied' as NotificationPermission;
        }

        try {
            console.log('Demande permission notifications...');
            const result = await Notification.requestPermission();
            console.log('Résultat permission:', result);
            setPermission(result);
            return result;
        } catch (error) {
            console.error('Erreur lors de la demande de permission:', error);
            return Notification.permission;
        }
    };

    const sendNotification = (title: string, options?: NotificationOptions) => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            console.warn('Notifications non supportées');
            return false;
        }

        if (Notification.permission !== 'granted') {
            console.warn('Permission non accordée pour les notifications:', Notification.permission);
            return false;
        }

        try {
            console.log('Création notification:', title);
            // Utilisez une fonction séparée pour éviter les blocages automatiques
            setTimeout(() => {
                try {
                    const notification = new Notification(title, {
                        ...options,
                        silent: false,
                        requireInteraction: true
                    });

                    notification.onclick = () => {
                        window.focus();
                        notification.close();
                    };

                    console.log('Notification créée avec succès');
                } catch (err) {
                    console.error('Erreur création notification:', err);
                }
            }, 100);

            return true;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification:', error);
            return false;
        }
    };

    return {
        permission,
        requestPermission,
        sendNotification,
        isSupported: typeof window !== 'undefined' && 'Notification' in window
    };
};

export default NextNotification;