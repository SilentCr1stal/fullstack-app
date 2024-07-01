const prisma = require('../prisma/prisma-client')

const CommentController = {
  createComment: async (req, res, next) => {
    return res.json('Create comment')
  },
  getAllComments: async (req, res, next) => {
    return res.json('Get all comments')
  },
  getCommentById: async (req, res, next) => {
    return res.json('Get comment ', req.params.id)
  },
  updateComment: async (req, res, next) => {
    return res.json('Update comment ', req.params.id)
  },
  deleteComment: async (req, res, next) => {
    return res.json('Deleted comment ', req.params.id)
  }
}

module.exports = CommentController