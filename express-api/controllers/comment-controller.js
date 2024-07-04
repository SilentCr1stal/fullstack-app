const prisma = require("../prisma/prisma-client");

const CommentController = {
  createComment: async (req, res, next) => {
    try {
      const { postId, content } = req.body
      const userId = req.user.userId

      const comment = await prisma.comment.create({
        data: {
          userId,
          postId,
          content
        }
      })

      return res.json(comment)
    } catch (error) {
      console.log("Error creating comment", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  // getAllComments: async (req, res, next) => {
  //   try {
  //     const { postId } = req.params
  //     return res.json("Get all comments");
  //   } catch (error) {
  //     console.log("Error getting comments", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // },
  // getCommentById: async (req, res, next) => {
  //   return res.json("Get comment ", req.params.id);
  // },
  // updateComment: async (req, res, next) => {
  //   return res.json("Update comment ", req.params.id);
  // },
  deleteComment: async (req, res, next) => {
    try {
      const {  }
    } catch (error) {
      console.log("Error deleting comment", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = CommentController;
