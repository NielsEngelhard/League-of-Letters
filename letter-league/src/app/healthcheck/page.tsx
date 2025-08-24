"use client"

import { useState, useEffect } from "react";
import PageBase from "@/components/layout/PageBase";
import Card from "@/components/ui/card/Card";
import { CardContent } from "@/components/ui/card/card-children";

interface HealthCheckData {
    name: string;
    description: string;
    endpoint: string;
    status: "healthy" | "checking" | "unhealthy";
    reason?: string;
    responseTime?: number;
    lastChecked?: Date;
}

const StatusIndicator = ({ status }: { status: "healthy" | "checking" | "unhealthy" }) => {
    const getStatusConfig = () => {
        switch (status) {
            case "healthy":
                return {
                    color: "bg-emerald-500",
                    pulseColor: "bg-emerald-400",
                    textColor: "text-emerald-600",
                    bgColor: "bg-emerald-50",
                    label: "Operational",
                    animate: false
                };
            case "checking":
                return {
                    color: "bg-amber-500",
                    pulseColor: "bg-amber-400",
                    textColor: "text-amber-600",
                    bgColor: "bg-amber-50",
                    label: "Checking",
                    animate: true
                };
            case "unhealthy":
                return {
                    color: "bg-red-500",
                    pulseColor: "bg-red-400",
                    textColor: "text-red-600",
                    bgColor: "bg-red-50",
                    label: "Down",
                    animate: false
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
            <div className="relative">
                <div className={`w-2 h-2 rounded-full ${config.color}`} />
                {config.animate && (
                    <div className={`absolute inset-0 w-2 h-2 rounded-full ${config.pulseColor} animate-pulse`} />
                )}
            </div>
            <span className={`text-sm font-medium ${config.textColor}`}>
                {config.label}
            </span>
        </div>
    );
};

const ServiceIcon = ({ name }: { name: string }) => {
    const getIcon = () => {
        if (name.toLowerCase().includes("websocket") || name.toLowerCase().includes("realtime")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            );
        }
        if (name.toLowerCase().includes("nextjs") || name.toLowerCase().includes("client")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
            );
        }
        if (name.toLowerCase().includes("database")) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    };

    return (
        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
            {getIcon()}
        </div>
    );
};

export default function HealthCheckPage() {
    const [healthChecks, setHealthChecks] = useState<HealthCheckData[]>([
        {
            name: "Realtime server",
            description: "Server for websocket connections and timed jobs",
            status: "checking",
            endpoint: `${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_BASE_ADDRESS}/health`        
        },
        {
            name: "Core api",
            description: "Server actions",
            status: "checking",        
            endpoint: `${window.location.origin}/api/health/core-api`
        },
        {
            name: "Database",
            description: "Connection with the database",
            status: "checking",
            endpoint: `${window.location.origin}/api/health/database`
        }        
    ]);

    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const checkEndpoint = async (endpoint: string, timeout: number = 5000): Promise<{ 
        status: "healthy" | "unhealthy", 
        responseTime: number, 
        reason?: string 
    }> => {
        const startTime = performance.now();
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            if (response.ok) {
                return { status: "healthy", responseTime };
            } else {
                return { 
                    status: "unhealthy", 
                    responseTime,
                    reason: `HTTP ${response.status}: ${response.statusText}` 
                };
            }
        } catch (error) {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    return { 
                        status: "unhealthy", 
                        responseTime,
                        reason: `Timeout after ${timeout}ms` 
                    };
                }
                return { 
                    status: "unhealthy", 
                    responseTime,
                    reason: error.message 
                };
            }
            
            return { 
                status: "unhealthy", 
                responseTime,
                reason: "Unknown error occurred" 
            };
        }
    };

    const performHealthChecks = async () => {
        setHealthChecks(prev => prev.map(check => ({ 
            ...check, 
            status: "checking" as const 
        })));

        const updatedChecks = await Promise.all(
            healthChecks.map(async (check) => {
                const result = await checkEndpoint(check.endpoint);
                return {
                    ...check,
                    status: result.status,
                    reason: result.reason,
                    responseTime: result.responseTime,
                    lastChecked: new Date(),
                };
            })
        );

        setHealthChecks(updatedChecks);
        setLastUpdated(new Date());
    };

    // Perform healthchecks
    useEffect(() => {
        performHealthChecks();
    }, []);

    const getOverallStatus = () => {
        const hasUnhealthy = healthChecks.some(check => check.status === "unhealthy");
        const hasChecking = healthChecks.some(check => check.status === "checking");
        
        if (hasUnhealthy) return { status: "degraded", color: "text-red-600" };
        if (hasChecking) return { status: "monitoring", color: "text-amber-600" };
        return { status: "operational", color: "text-emerald-600" };
    };

    const overallStatus = getOverallStatus();

    return (
        <PageBase>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-light text-slate-900">System Status</h1>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-500">Environment:</span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-mono text-xs">
                                {process.env.NEXT_PUBLIC_ENVIRONMENT}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-slate-600">All systems</span>
                        <span className={`font-medium capitalize ${overallStatus.color}`}>
                            {overallStatus.status}
                        </span>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid gap-4">
                    {healthChecks.map((healthcheck) => (
                        <Card key={healthcheck.name} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <ServiceIcon name={healthcheck.name} />
                                        
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-slate-900">
                                                    {healthcheck.name}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    {healthcheck.responseTime && (
                                                        <span className="text-xs text-slate-500 font-mono">
                                                            {healthcheck.responseTime}ms
                                                        </span>
                                                    )}
                                                    <StatusIndicator status={healthcheck.status} />
                                                </div>
                                            </div>
                                            
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                {healthcheck.description}
                                            </p>
                                            
                                            {healthcheck.endpoint && (
                                                <div className="pt-2">
                                                    <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded border">
                                                        {healthcheck.endpoint}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {healthcheck.reason && (
                                                <div className="pt-2">
                                                    <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                                                        {healthcheck.reason}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>                        
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                    <button 
                        onClick={performHealthChecks}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh Checks
                    </button>
                </div>
            </div>
        </PageBase>
    )
}