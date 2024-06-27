const prisma = require("../prisma/prisma-client");

const PostController = {
  createPost: async (req, res, next) => {
    const { title, content } = req.body;

    const authorId = req.user.userId;

    if (!title)
      return res.status(401).json({ error: "The title should not be empty!" });
    if (!content)
      return res
        .status(401)
        .json({ error: "The content should not be empty!" });
    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId,
        },
      });
      res.json(post);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Internal Server error" });
    }
  },
  getAllPosts: async (req, res, next) => {
    const authorId = req.user.userId;

    try {
      const posts = await prisma.post.findMany({
        where: {
          authorId,
        },
        include: {
          likes: true,
          author: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const postsWithLikeUser = posts.map((post) => {
        return {
          ...post,
          likedByUser: post.likes.some((like) => like.userId === authorId),
        };
      });
      res.json(postsWithLikeUser);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Internal Server error" });
    }
  },
  getPostById: async (req, res, next) => {
    const authorId = req.user.userId;
    const { id } = req.params;
    try {
      const post = await prisma.post.findUnique({
        where: {
          id
        },
        include: {
          comments: {
            include: {
              user: true,
            },
          },
          likes: true,
          author: true
        },
      });
      if (!post) return res.status(404).json({ error: "Post does not found" });

      const postWithLikeInfo = {
        ...post,
        likedByUser: post.likes.some(like => like.userId === authorId)
      }

      res.json(postWithLikeInfo);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Internal Server error" });
    }
  },
  updatePost: async (req, res, next) => {
    const { id } = req.params;
    const authorId = req.user.userId;
    const { title, content } = req.body;

    if (!id) return res.status(404).json({ error: "Post does not found" });
    try {
      const post = await prisma.post.findFirst({
        where: {
          AND: [{ id }, { authorId }],
        },
      });

      if (authorId !== post.authorId)
        return res.status(403).json({ error: "No access rights" });

      const newPost = await prisma.post.update({
        where: {
          id,
        },
        data: {
          title: title || undefined,
          content: content || undefined,
        },
      });

      res.json(newPost);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Internal Server error" });
    }
  },
  deletePost: async (req, res, next) => {
    const { id } = req.params;
    const authorId = req.user.userId;

    try {
      const post = await prisma.post.delete({
        where: {
          id,
        },
      });
      res.json(post);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Internal Server error" });
    }
  },
};

module.exports = PostController;
