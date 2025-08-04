import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, signupSchema } from "../schemas";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    console.log({ email, password });

    return c.json({
      email,
      password,
      // success: true,
    });
  })
  .post("/register", zValidator("json", signupSchema), async (c) => {
    const { email, name, password } = c.req.valid("json");

    return c.json({
      email,
      password,
      name,
      // success: true,
    });
  });

export default app;
