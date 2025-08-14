export interface AuthSessionModel {
    id: string;
    username: string;
    secretKey: string;
    createdAt: Date;
    isGuestSession: boolean;//TODO: HIERVERDERZO
}