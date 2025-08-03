interface Props {
    isOnline: boolean;
    isReconnecting?: boolean;
}

export default function StatusDot({ isOnline, isReconnecting = false }: Props) {
    return (
    <div className={`
        w-2 h-2 rounded-full
        ${isOnline && !isReconnecting ? "bg-success" : "bg-success"}
        ${isReconnecting ? "bg-warning" : "bg-success"}
        ${!isOnline && !isReconnecting ? "!bg-error" : "bg-success"}
    `} />        
    )
}