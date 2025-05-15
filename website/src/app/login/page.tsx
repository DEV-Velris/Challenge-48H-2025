"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn("google", { redirectTo: callbackUrl ?? "/" });
        } catch (error) {
            console.error("Erreur de connexion:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-16 bg-gray-50 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="flex flex-col items-center justify-center">
                    <h2 className="mt-6 text-2xl font-bold text-gray-1">Bienvenue</h2>
                </div>

                <div className="mt-8 space-y-6">
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 bg-blue opacity-80 rounded-md transition-colors hover:bg-white border-4 border-transparent hover:border-blue group"
                    >
                        <FcGoogle size={24} />
                        <span className="text-white font-medium group-hover:text-gray-1 transition-colors">
                            {isLoading ? "Connexion en cours..." : "Se connecter avec Google"}
                        </span>
                    </button>
                </div>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-500">
                        En vous connectant, vous acceptez nos conditions d&#39;utilisation et notre politique de confidentialité.
                    </p>
                </div>
            </div>
        </div>
    );
}