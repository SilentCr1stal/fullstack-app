const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserController = require("../controllers/user-controller");
const PostController = require('../controllers/post-controller')
const authToken = require("../middleware/auth");

const destination = "uploads";

const storage = multer.diskStorage({
  destination,
  filename: (req, file, next) => {
    next(null, file.originalname);
  },
});

const uploads = multer({ storage });

// Users routers
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/users/:id", authToken, UserController.getUserById);
router.put("/users/:id", authToken, UserController.updateUser);
router.get("/current", authToken, UserController.currentUser);
router.get('/users', UserController.getUsers)
// router.get('users/:id', UserController.dropUser)

// Posts routers
router.post('/posts', authToken, PostController.createPost)
router.get('/posts', authToken, PostController.getAllPosts)
router.get('/posts/:id', authToken, PostController.getPostById)
router.put('/posts/:id', authToken, PostController.updatePost)
router.delete('/posts/:id', authToken, PostController.deletePost)

module.exports = router;
