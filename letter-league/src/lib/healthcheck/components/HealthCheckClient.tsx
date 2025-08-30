"use client"

import { useState, useEffect } from "react"
import HealthCheckCard from "./HealthCheckCard";
import { HealthCheckData } from "../healthcheck-models";

interface Props {
    data: HealthCheckData[]
}

export default function HealthCheckClient({data}: Props) {
    const [healthChecks, setHealthChecks] = useState<HealthCheckData[]>(
        data.map(check => ({ ...check, status: "checking" }))
    );

    useEffect(() => {
        const runHealthChecks = async () => {
            const updatedChecks = await Promise.all(
                data.map(async (check) => {
                    const startTime = Date.now();
                    
                    try {
                        const response = await fetch(check.endpoint, {
                            method: 'GET',
                            cache: 'no-cache'
                        });
                        
                        const responseTime = Date.now() - startTime;
                        
                        if (response.ok) {
                            return {
                                ...check,
                                status: "healthy" as const,
                                responseTime,
                                lastChecked: new Date(),
                                reason: undefined
                            };
                        } else {
                            return {
                                ...check,
                                status: "unhealthy" as const,
                                responseTime,
                                lastChecked: new Date(),
                                reason: `HTTP ${response.status}: ${response.statusText}`
                            };
                        }
                    } catch (error) {
                        return {
                            ...check,
                            status: "unhealthy" as const,
                            responseTime: Date.now() - startTime,
                            lastChecked: new Date(),
                            reason: error instanceof Error ? error.message : "Connection failed"
                        };
                    }
                })
            );
            
            setHealthChecks(updatedChecks);
        };

        runHealthChecks();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="grid gap-4">
            {healthChecks.map((healthCheck) => {
                return <HealthCheckCard healthcheck={healthCheck} key={healthCheck.name} />
            })}
        </div>
    )
}