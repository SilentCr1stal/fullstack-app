const express = require("express");
const router = express.Router();
const multer = require("multer");

const destination = "uploads";

const storage = multer.diskStorage({
  destination,
  filename: (req, file, next) => {
    next(null, file.originalname);
  },
});

const uploads = multer({ storage });

/* GET home page. */
router.get("/register", function (req, res, next) {
  res.send("Registered");
});

module.exports = router;
