export interface ServerResponse<T> {
    ok: boolean;
    errorMsg?: string;
    data: T | null;
}

export class ServerResponseFactory {
    static success<T>(data: T): ServerResponse<T> {
        return {
            ok: true,
            errorMsg: undefined,
            data: data
        };
    }

    static error<T = never>(errorMsg?: string): ServerResponse<T> {
        if (!errorMsg) errorMsg = "Could not join game";
        
        return {
            ok: false,
            errorMsg: errorMsg,
            data: null
        };
    }
}