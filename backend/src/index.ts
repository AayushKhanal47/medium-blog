import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use("*", async (c, next) => {
  const origin = c.req.header("Origin") || "*";
  await next();
  c.header("Access-Control-Allow-Origin", origin);
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  c.header("Access-Control-Allow-Credentials", "true");
});

app.options("*", (c) => {
  return c.text("", 204);
});

app.route("api/v1/user", userRouter);
app.route("api/v1/blog", blogRouter);

export default app;
