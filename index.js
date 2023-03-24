const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
app.use(cors());
app.use(express.json());

app.post(`/post`, async (req, res) => {
  const { title, content } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
    },
  });
  res.json(result);
  console.log(result);
});
app.post(`/postuser`, async (req, res) => {
  const { author, authorId, categories, categoryIds } = req.body;
  const result = await prisma.user.create({
    data: {
      posts: {
        create: [author, authorId, categories, categoryIds],
      },
    },
  });
  res.json(result);
  console.log(result);
});

app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const updatedPost = await prisma.post.upsert({
    where: { id },
    update: { title, content },
    create: { id, title, content },
  });

  res.json(updatedPost);
});
app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: { id },
  });
  res.json(post);
});
app.get("/feed", async (req, res) => {
  const posts = await prisma.post.findMany({});
  res.json(posts);
});
app.post(`/user`, async (req, res) => {
  const { email, name } = req.body;
  const result = await prisma.user.create({
    data: {
      email,
      name,
    },
  });
  res.json(result);
  console.log(result);
});
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
