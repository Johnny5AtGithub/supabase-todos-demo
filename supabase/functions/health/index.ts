import { jsonStringify } from './../getSharedTasks/serializer.ts';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import process from "node:process";
import packageJson from "./../../../package.json" with { type: "json" }; // remove this line to get rid of the error
import { Logger } from "./../_infrastructure/logging/Logger.ts";
import { databaseHealthCheck } from "./checks/database.ts";

/**
 * Common headers used when returning health check information
 */
const healthCheckHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-cache, no-store, must-revalidate",
};

Deno.serve(async () => {
  try {
    // Get the start time to calculate response time
    const startTime = performance.now();

    // Add initialization logic here
    const databaseResponse = await databaseHealthCheck();

    // end of initialization logic
    // Calculate response time
    const healthChecksResponseTime = (performance.now() - startTime).toFixed(2);

    // Create healthData
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: packageJson.version,
      environment: Deno.env.get("ENV") || "development",
      uptime: process.uptime().toFixed(2),
      healthChecksResponseTime: `${healthChecksResponseTime}ms`,
      services: {
        database: databaseResponse,
      },
    };

    return new Response(jsonStringify(healthData), {
      status: 200,
      headers: healthCheckHeaders,
    });
  } catch (error) {
    Logger.error("Health check failed:", { error });

    return new Response(
      jsonStringify({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "An unknown error occurred during health check",
      }),
      {
        status: 502,
        headers: healthCheckHeaders,
      },
    );
  }
});
