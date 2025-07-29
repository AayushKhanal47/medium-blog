import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { bodyLimit } from "hono/body-limit";
import { ErrorBoundary } from "hono/jsx";
import { createBlogInput, updateBlogInput } from "@aayushkhanal47/medium-blog";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();


blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const user = await verify(token, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({ message: "You are not logged in" });
    }
  } catch (e) {
    c.status(403);
    return c.json({ message: "Invalid token" });
  }
});

const getPrisma = (c: any) =>
  new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

blogRouter.post("/", async (c) => {
      const body = await c.req.json()
         const {success} = createBlogInput.safeParse(body)
         if(!success){
            c.status(411)
                return c.json({
                    message: "Input not correct"
                })
            
         }
  const authorId = c.get("userId");
  const prisma = getPrisma(c);
  

  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId,
      },
    });

    return c.json({ id: blog.id });
  } catch (e) {
    c.status(500);
    return c.json({ message: "Failed to create blog" });
  }
});


blogRouter.put("/", async (c) => {
      const body = await c.req.json()
         const {success} = updateBlogInput.safeParse(body)
         if(!success){
            c.status(411)
                return c.json({
                    message: "Input not correct"
                })
            
         }
  const prisma = getPrisma(c);
  

  try {
    const blog = await prisma.blog.update({
      where: { id: body.id },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({ id: blog.id });
  } catch (e) {
    c.status(500);
    return c.json({ message: "Failed to update blog" });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = getPrisma(c);

  try {
    const blogs = await prisma.blog.findMany();
    return c.json({ blogs });
  } catch (e) {
    c.status(500);
    return c.json({ message: "Failed to fetch blogs" });
  }
});

blogRouter.get("/:id", async (c) => {
    const id = c.req.param("id")
  const prisma = getPrisma(c);


  try {
    const blog = await prisma.blog.findFirst({
      where: { id: Number(id) },
    });

    if (!blog) {
      c.status(404);
      return c.json({ message: "Blog not found" });
    }

    return c.json({ blog });
  } catch (e) {
    c.status(500);
    return c.json({ message: "Error while fetching blog" });
  }
});


