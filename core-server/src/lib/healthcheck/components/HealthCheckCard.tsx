"use client"

import Card from "@/components/ui/card/Card";
import { CardContent } from "@/components/ui/card/card-children";
import { HealthCheckData } from "../healthcheck-models";

interface Props {
    healthcheck: HealthCheckData;
}

const StatusIndicator = ({ status }: { status: "healthy" | "checking" | "unhealthy" }) => {
    if (status === "healthy") {
        return (
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">Healthy</span>
            </div>
        );
    }
    
    if (status === "checking") {
        return (
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-700">Checking...</span>
            </div>
        );
    }
    
    return (
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-red-700">Unhealthy</span>
        </div>
    );
};

export default function HealthCheckCard({healthcheck}: Props) {
    return (
        <Card key={healthcheck.name} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
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
                            
                            {healthcheck.lastChecked && (
                                <div className="pt-1">
                                    <span className="text-xs text-slate-400">
                                        Last checked: {healthcheck.lastChecked.toLocaleTimeString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}