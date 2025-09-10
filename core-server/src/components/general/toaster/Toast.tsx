import { Toast, ToastType, useToaster } from "./ToasterContext";
import { Check, CircleX, Info, Loader2, X } from "lucide-react";

interface Props {
    toast: Toast;
}

const getToastConfig = (type?: ToastType) => {
    switch (type) {
        case "success":
            return {
                iconColor: 'text-success',
                iconBg: 'bg-success/20',
                Icon: Check
            }
        case "error":
            return {
                iconColor: 'text-error',
                iconBg: 'bg-error/20',
                Icon: CircleX
            }
        case "warning":
            return {
                iconColor: 'text-warning',
                iconBg: 'bg-warning/20',
                Icon: Info
            }
        case "loading":
            return {
                iconColor: 'text-primary',
                iconBg: 'bg-primary/20',
                Icon: Loader2
            }                                    
        default:
            return {
                iconColor: 'text-primary',
                iconBg: 'bg-primary/20',
                Icon: Info
            } 
    }
}; 

export default function ToastComponent({ toast }: Props) {
    const { removeToast } = useToaster();

    const config = getToastConfig(toast.content.type);
    const { Icon } = config;

    const handleClose = (toastId: string) => {
        removeToast(toastId);
    };    

    return (
        <div 
            className={`
                bg-background border-border border border-t-2
                pointer-events-auto
                transform transition-all duration-300 ease-out
                rounded-lg shadow-lg backdrop-blur-sm min-w-80 max-w-md`}
        >
            <div className="flex items-start gap-3 p-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                    <div className={`p-1.5 rounded-lg ${config.iconBg}`}>
                        <Icon 
                            size={20} 
                            className={`${config.iconColor} ${toast.content.type === 'loading' ? 'animate-spin' : ''}`} 
                        />                            
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {toast.content.title && (
                        <p className="font-medium text-sm text-foreground">
                            {toast.content.title}
                        </p>
                    )}
                    {toast.content.msg && (
                        <p className={`text-xs leading-5 text-foreground-muted`}>
                            {toast.content.msg}
                        </p>
                    )}
                </div>

                {/* Close Button */}
                {toast.content.type !== 'loading' && (
                    <button
                        onClick={() => handleClose(toast.id)}
                        className={`flex-shrink-0 p-1 rounded-md text-foreground-muted`}
                        aria-label="Close notification"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    )
}