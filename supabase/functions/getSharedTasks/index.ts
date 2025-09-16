import { getAxiosInstance } from './../_shared/getAxiosInstance.ts';
import { getKyselyInstance } from "../_infrastructure/database/kysely/getKyselyInstance.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSharedTasks } from "../_shared/queries/getSharedTasks.ts";
import { jsonStringify } from "./serializer.ts";
import { DateTime } from "../deps.ts";

Deno.serve(async () => {
  const db = getKyselyInstance();
  const sharedTasks = await getSharedTasks(db);

  const httpClient = getAxiosInstance("", true)();
  const response = await httpClient.get(`https://postman-echo.com/delay/0`, {});
  const todayNumber = DateTime.now().toFormat("yyyyMMdd");
  sharedTasks.push({
    assigned_people: todayNumber,
    title: response.statusText,
  });

  return new Response(jsonStringify(sharedTasks), {
    headers: { "Content-Type": "application/json" },
  });
});
