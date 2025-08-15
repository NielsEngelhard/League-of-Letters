import z from "zod";

export interface AuthSessionModel {
    id: string;
    username: string;
    secretKey: string;
    createdAt: Date;
    isGuestSession: boolean;
}
