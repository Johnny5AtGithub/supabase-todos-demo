import { getAxiosInstance } from './../_shared/getAxiosInstance.ts';
import { getKyselyInstance } from "../_infrastructure/database/kysely/getKyselyInstance.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSharedTasks } from "../_shared/queries/getSharedTasks.ts";
import { jsonStringify } from "./serializer.ts";
import { DateTime, DeleteResult, InsertResult } from "../deps.ts";

Deno.serve(async () => {
    const db = getKyselyInstance();
    const sharedTasks = await getSharedTasks(db);

    const httpClient = getAxiosInstance("", true)();
    const todayNumber = DateTime.now().toFormat("yyyyMMdd");

    let resultInsert: InsertResult[];
    resultInsert = await db
      .withSchema("todos")
      .insertInto("todos")
      .values({
        id: 555,
        title: "insertstatement",
        description: "test one",
        category_id: 1,
        created_at: DateTime.now().toISO(),
      })
      .execute();
    let resultDelete: DeleteResult[];
    resultDelete = await db
      .withSchema("todos")
      .deleteFrom("todos")
      .where("id", "=", 555)
      .execute();
    sharedTasks.push({
      assigned_people: `${resultInsert.length}`,
      title: `${resultDelete.length}`,
    });


    return new Response(jsonStringify(sharedTasks), {
      headers: { "Content-Type": "application/json" },
    });
});
