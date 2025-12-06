'use client';

import { ReactNode } from "react";
import { BaseModal } from "./BaseModal";

interface ModalWithTriggerProps {
    buttonText: string;
    buttonIcon?: ReactNode;
    children: ReactNode;
    buttonClassName?: string;
    modalClassName?: string;

    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const ModalWithTrigger = ({
    buttonText,
    buttonIcon,
    children,
    buttonClassName = "",
    modalClassName = "",
    isOpen,
    onOpen,
    onClose,
}: ModalWithTriggerProps) => {
    return (
        <>
            <button
                onClick={onOpen}
                className={`
                    flex items-center gap-2 bg-blue-600
                    text-white px-5 py-3 rounded-xl shadow-lg 
                    hover:scale-105 transition-all duration-200
                    ${buttonClassName}
                `}
            >
                {buttonIcon}
                {buttonText}
            </button>

            <BaseModal isOpen={isOpen} onClose={onClose} className={modalClassName}>
                {children}
            </BaseModal>
        </>
    );
};
