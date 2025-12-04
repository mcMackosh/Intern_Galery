"use client";

import { useState, ReactNode } from "react";
import { BaseModal } from "./BaseModal";

interface ModalWithTriggerProps {
    buttonText: string;
    buttonIcon?: ReactNode;
    children: ReactNode;
    buttonClassName?: string;
    modalClassName?: string;
}

export const ModalWithTrigger = ({
    buttonText,
    buttonIcon,
    children,
    buttonClassName = "",
    modalClassName = "",
}: ModalWithTriggerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`
                    flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-900 
                  text-white px-5 py-3 rounded-xl shadow-lg 
                    hover:scale-105 transition-all duration-200
                    ${buttonClassName}
                `}
            >
                {buttonIcon}
                {buttonText}
            </button>
            <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)} className={modalClassName}>
                {children}
            </BaseModal>
        </>
    );
};
