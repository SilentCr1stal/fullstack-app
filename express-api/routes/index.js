const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserController = require("../controllers/user-controller");

const destination = "uploads";

const storage = multer.diskStorage({
  destination,
  filename: (req, file, next) => {
    next(null, file.originalname);
  },
});

const uploads = multer({ storage });

/* GET home page. */
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/users/:id", UserController.getUserById);
router.put("/users/:id", UserController.updateUser);
router.get("/current", UserController.currentUser);

module.exports = router;
