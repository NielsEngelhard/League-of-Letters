"use server"

import PageBase from "@/components/layout/PageBase";
import HealthCheckClient from "@/lib/healthcheck/components/HealthCheckClient";
import { HOME_ROUTE } from "../routes";
import { HealthCheckData } from "@/lib/healthcheck/healthcheck-models";
import Link from "next/link";

    const healthChecks: HealthCheckData[] = [
        {
            name: "Actions server public",
            description: "For websocket connections",
            status: "checking",
            endpoint: `${process.env.NEXT_PUBLIC_ACTIONS_SERVER_BASE_ADDRESS}/health`        
        },
        {
            name: "Core api",
            description: "Server actions",
            status: "checking",        
            endpoint: `${process.env.NEXT_PUBLIC_CORE_SERVER_BASE_ADDRESS}/api/health/core-api`
        },
        {
            name: "Database",
            description: "Connection with the database",
            status: "checking",
            endpoint: `${process.env.NEXT_PUBLIC_CORE_SERVER_BASE_ADDRESS}/api/health/database`
        }
    ];

export default async function HealthCheckPage() {
    return (
        <PageBase requiresAuh={false} lang="en" >
            <Link href="/HOME_ROUTE">
                {HOME_ROUTE}
            </Link>

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
            </div>

            <HealthCheckClient data={healthChecks} />
        </PageBase>
    )
}