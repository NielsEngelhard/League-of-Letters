import { CircleX } from "lucide-react";

interface Props {
    show: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ show, children, onClose }: Props) {
    
    if (show == false) {
        return;
    }

    return (
        <div className="fixed top-0 my-2 left-0 w-screen h-screen bg-background-secondary/80 flex items-center justify-center z-[60] p-2">
            <div className="w-full mx-2 max-w-[500px] shadow-2xl relative max-h-screen overflow-y-scroll">
                {children}

                <div className="absolute right-2 top-2">
                    <button onClick={onClose} className="hover:cursor-pointer">
                        <CircleX className="text-foreground-muted" />
                    </button>
                </div>              
            </div>              
        </div>
    )
}