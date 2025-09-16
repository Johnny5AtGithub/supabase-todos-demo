import { getKyselyInstance } from "../../_infrastructure/database/kysely/getKyselyInstance.ts";
import { Logger } from "../../_infrastructure/logging/Logger.ts";
import { QueryResult, sql } from "../../deps.ts";

/**
 * Performs a health check on the database connection
 *
 * This function tests the database connection by querying the PostgreSQL server
 * start time. It returns an object containing:
 * - status: "connected" or "disconnected" indicating database connectivity
 * - startTime: The timestamp when the PostgreSQL server was started
 *
 * If the database query fails, the function will log the error and return
 * a response with status "disconnected" and a default startTime.
 *
 * @returns {Promise<DatabaseHealthCheckResponse>} Database health status and start time
 */
export async function databaseHealthCheck() {
  const databaseResponse: DatabaseHealthCheckResponse = {
    status: "connected",
  };

  try {
    const dbInstance = getKyselyInstance();
    const result = (await sql`SELECT pg_postmaster_start_time() as starttime`.execute(dbInstance)) as QueryResult<{
      starttime: Date;
    }>;
    databaseResponse.startTime = result.rows[0]?.starttime;
  } catch (error) {
    Logger.error("database healthCheck failed", { error });
    throw error;
  }
  return databaseResponse;
}

/**
 * Response type for database health check operations
 *
 * This type represents the structure of the data returned from database
 * health check operations, providing information about the database's
 * connection status and when the PostgreSQL server was started.
 *
 * @property {string} status - Connection status of the database, either "connected" or "disconnected"
 * @property {Date} [startTime] - Optional timestamp when the PostgreSQL server was started.
 *                               Present only when status is "connected" and startTime could be retrieved.
 */
type DatabaseHealthCheckResponse = {
  status: "disconnected" | "connected";
  startTime?: Date;
};
