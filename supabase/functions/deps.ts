// Exporting from kysely
export {
  CompiledQuery,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  sql,
} from "npm:kysely@0.27.6";

export type {
  DatabaseConnection,
  Driver,
  QueryResult,
  TransactionSettings,
} from "npm:kysely@0.27.6";

// Exporting from deno-postgres-driver
export { Pool, PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

// otel logs
export { trace, context } from "npm:@opentelemetry/api";

// Axios
export {
  default as Axios,
  AxiosError,
  AxiosHeaders,
  isAxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "npm:axios@1.9.0";
export { default as AxiosRetry } from "npm:axios-retry@4.5.0";
export { authenticator, createSession } from "npm:@villedemontreal/auth-oidc-plugin-axios@1.1.2";

// a composable JSON.stringify replacement
export {
  stringify,
  bigIntToString,
  dateToISOString,
  symbolToString,
  errorToObject,
  mapToObject,
  setToArray,
} from "npm:@mastermindzh/composable-json-stringify";
export type { JsValue } from "npm:@mastermindzh/composable-json-stringify";
