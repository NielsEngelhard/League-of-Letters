"use client"

import { useState } from "react";

interface OptionItem {
    label: string;
    onClick: () => void;
    icon?: React.ReactElement;
    destructive?: boolean;
}

interface OptionsMenuProps {
    options: OptionItem[];
    className?: string;
}

export function OptionsMenu({ options, className = "" }: OptionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option: OptionItem) => {
        option.onClick();
        setIsOpen(false);
    };

    if (!options || options.length === 0) {
        return null;
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-background-secondary transition-colors duration-200 focus:outline-none"
                aria-label="Open options menu"
            >
                <svg 
                    className="w-5 h-5 text-foreground" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
                    />
                </svg>
            </button>
            
            {isOpen && (
                <>
                    {/* Backdrop to close menu when clicking outside */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Options dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background-secondary rounded-lg shadow-lg border-border border z-20 py-1">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors duration-150 hover:bg-primary/5 font-medium ${
                                    option.destructive 
                                        ? 'text-error'
                                        : 'text-foreground'
                                }`}
                            >
                                {option.icon && (
                                    <span className="flex-shrink-0">
                                        {option.icon}
                                    </span>
                                )}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export type { OptionItem };