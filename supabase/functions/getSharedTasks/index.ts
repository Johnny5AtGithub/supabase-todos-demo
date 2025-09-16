import { getKyselyInstance } from "../_infrastructure/database/kysely/getKyselyInstance.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSharedTasks } from "../_shared/queries/getSharedTasks.ts";
import { jsonStringify } from "./serializer.ts";

Deno.serve(async () => {
  const db = getKyselyInstance();
  const sharedTasks = await getSharedTasks(db);

  return new Response(jsonStringify(sharedTasks), {
    headers: { "Content-Type": "application/json" },
  });
});
