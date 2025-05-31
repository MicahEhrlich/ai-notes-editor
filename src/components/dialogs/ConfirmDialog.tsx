import { useEffect } from "react";

type ConfirmDialogProps = {
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
};

export const ConfirmDialog = ({
    onClose,
    onConfirm,
    title,
    message,
}: ConfirmDialogProps) => {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-50">
            <div className="text-base text-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] shadow transition-all duration-200">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-4">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition">Yes</button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">No</button>
                </div>
            </div>
        </div>
    );
}