const REALTIME_EVENT_LOG_PREFIX = "REALTIME LOG: ";

export class RealtimeLogger {
    static Log(msg: string) {
        if (process.env.NEXT_PUBLIC_LOG_REALTIME_EVENTS?.toLowerCase() != "true") return;
        console.log(`${REALTIME_EVENT_LOG_PREFIX} ${msg}`);
    }
}