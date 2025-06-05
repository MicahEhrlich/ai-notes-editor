import { useUserStore } from "../../store/userStore";
import { Loading } from "./Loading";
import { useEffect, useState, type ReactNode } from "react";

const CLEAR_TIMEOUT = 5000;
const FADE_DURATION = 300;

export const Layout = ({ children }: { children: ReactNode }) => {
    const loading = useUserStore(state => state.loading);
    const error = useUserStore(state => state.error);
    const success = useUserStore(state => state.success);
    const setError = useUserStore(state => state.setError);
    const setSuccess = useUserStore(state => state.setSuccess);

    // Local state for fade effect
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    // Show and auto-hide success alert
    useEffect(() => {
        if (success) {
            setShowSuccess(true);
            const timeout = setTimeout(() => setShowSuccess(false), CLEAR_TIMEOUT);
            return () => clearTimeout(timeout);
        }
    }, [success]);

    // Show and auto-hide error alert
    useEffect(() => {
        if (error) {
            setShowError(true);
            const timeout = setTimeout(() => setShowError(false), CLEAR_TIMEOUT);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    // Remove success from store after fade out
    useEffect(() => {
        if (!showSuccess && success) {
            const timeout = setTimeout(() => setSuccess(''), FADE_DURATION);
            return () => clearTimeout(timeout);
        }
    }, [showSuccess, success, setSuccess]);

    // Remove error from store after fade out
    useEffect(() => {
        if (!showError && error) {
            const timeout = setTimeout(() => setError(''), FADE_DURATION);
            return () => clearTimeout(timeout);
        }
    }, [showError, error, setError]);

    return (
        <div className="flex flex-col h-screen">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
                    <Loading />
                </div>
            )}
            <div className="flex-1">
                {children}
            </div>
            {/* Fixed alerts at the bottom center */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
                {/* Success Alert */}
                <div
                    className={`transition-opacity duration-300 ${showSuccess && success ? "opacity-100" : "opacity-0"} pointer-events-auto`}
                >
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-2 shadow" role="alert">
                            <span className="block sm:inline">{success}</span>
                        </div>
                    )}
                </div>
                {/* Error Alert */}
                <div
                    className={`transition-opacity duration-300 ${showError && error ? "opacity-100" : "opacity-0"} pointer-events-auto`}
                >
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}