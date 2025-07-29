import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { SignupInput, SigninInput } from "@aayushkhanal47/medium-blog";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post('/signup', async (c) => {
  const body = await c.req.json();


  const parsed = SignupInput.safeParse(body);
  if (!parsed.success) {
    c.status(411);
    return c.json({ message: "Input not correct" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.create({
      data: {
        email: body.username,
        password: body.password,
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt: token });
  } catch (err: any) {
    console.error("Signup error:", err);
    c.status(500);
    return c.json({ error: "Something went wrong", details: err?.message });
  }
});

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();

  const parsed = SigninInput.safeParse(body);
  if (!parsed.success) {
    c.status(411);
    return c.json({ message: "Input not correct" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.username,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({ error: "User not found" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt });
  } catch (err: any) {
    console.error("Signin error:", err);
    c.status(500);
    return c.json({ error: "Something went wrong", details: err?.message });
  }
});
