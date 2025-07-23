import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

// Mount auth routes
auth.addHttpRoutes(http);

http.route({
  path: "/migrate/wp",
  method: "POST",
  // Accept a large JSON body and hand it off to the mutation.
  handler: httpAction(async (ctx, req) => {
    try {
      const payload = await req.json();
      // Basic validation
      if (!payload?.data) {
        return new Response(JSON.stringify({ error: "Missing `data` field" }), { status: 400 });
      }
      const result = await ctx.runMutation(internal.wpMigration.bulkImport, { data: payload.data });
      return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
      console.error("Migration error:", error);
      return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
    }
  }),
});

http.route({
  path: "/migrate/wp/xml",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const payload = await req.json(); // expects { xml: "<xml ...>" }
      if (!payload?.xml) {
        return new Response(JSON.stringify({ error: "Missing `xml` field" }), {
          status: 400,
        });
      }
      const result = await ctx.runAction(internal.wpMigrationXml.xmlImport, {
        xml: payload.xml,
      });
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("XML Migration error:", error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
      });
    }
  }),
});

export default http;