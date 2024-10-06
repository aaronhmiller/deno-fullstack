// app.ts
import { Application, Router } from "./deps.ts";
import { oakCors } from "./deps.ts";
import { Client } from "./deps.ts";

const client = new Client({
  user: Deno.env.get("DB_USER"),
  database: Deno.env.get("DB_NAME"),
  hostname: Deno.env.get("DB_HOST"),
  port: Number(Deno.env.get("DB_PORT")),
  password: Deno.env.get("DB_PASSWORD"),
});

await client.connect();

const router = new Router();

router
  .get("/items", async (ctx) => {
    const result = await client.queryObject("SELECT * FROM items");
    ctx.response.body = result.rows;
  })
  .get("/items/:id", async (ctx) => {
    const id = ctx.params.id;
    const result = await client.queryObject("SELECT * FROM items WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Item not found" };
      return;
    }
    ctx.response.body = result.rows[0];
  })
  .post("/items", async (ctx) => {
    const { name } = await ctx.request.body().value;
    const result = await client.queryObject(
      "INSERT INTO items (name) VALUES ($1) RETURNING *",
      [name]
    );
    ctx.response.status = 201;
    ctx.response.body = result.rows[0];
  })
  .put("/items/:id", async (ctx) => {
    const id = ctx.params.id;
    const { name } = await ctx.request.body().value;
    const result = await client.queryObject(
      "UPDATE items SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Item not found" };
      return;
    }
    ctx.response.body = result.rows[0];
  })
  .delete("/items/:id", async (ctx) => {
    const id = ctx.params.id;
    const result = await client.queryObject("DELETE FROM items WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Item not found" };
      return;
    }
    ctx.response.status = 204;
  });

const app = new Application();

// Apply CORS middleware
app.use(oakCors({
  origin: ["http://localhost:3000", "http://frontend:3000", "http://localhost"],
  optionsSuccessStatus: 200,
  credentials: true,
}));

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });