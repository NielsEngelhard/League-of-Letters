export interface HealthCheckData {
    name: string;
    description: string;
    endpoint: string;
    status: "healthy" | "checking" | "unhealthy";
    reason?: string;
    responseTime?: number;
    lastChecked?: Date;
}