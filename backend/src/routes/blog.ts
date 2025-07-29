import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
    Variables:{
        userId: string
    
  };
}>();

blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header("authorization") || ""
    const user = await verify(authHeader, c.env.JWT_SECRET)
  if(user){
    c.set("userId", user.id)
    next();
  }else{
    c.status(403)
    return c.json({
        message: "You are not logged in"
    })
  }
  
});

const getPrisma = (c: any) =>
  new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());


blogRouter.post('/', async (c) => {
  const prisma = getPrisma(c);
  const body = await c.req.json();

  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: "some-user-id", 
    },
  });

  return c.json({ id: blog.id });
});


blogRouter.put('/', async (c) => {
  const prisma = getPrisma(c);
  const body = await c.req.json();

  const blog = await prisma.blog.update({
    where: { id: body.id },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({ id: blog.id });
});


blogRouter.get('/', async (c) => {
  const prisma = getPrisma(c);
  const id = c.req.query('id');

  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      c.status(404);
      return c.json({ message: 'Blog not found' });
    }

    return c.json({ blog });
  } catch (e) {
    c.status(500);
    return c.json({ message: 'Error while fetching blog' });
  }
});


blogRouter.get('/bulk', async (c) => {
  const prisma = getPrisma(c);
  const blogs = await prisma.blog.findMany();
  return c.json({ blogs });
});
