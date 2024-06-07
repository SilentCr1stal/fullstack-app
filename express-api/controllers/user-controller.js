const prisma = require("../prisma/prisma-client");

const UserController = {
  register: async (req, res, next) => {
    const { email, password, name } = req.body;
    if (!email)
      return res.status(400).json({ error: "Email does not be empty" });
    if (!password)
      return res.status(400).json({ error: "Password does not be empty" });
    if (!name) return res.status(400).json({ error: "Name does not be empty" });

    try {
      const existUser = await prisma.user.findUnique({ where: { email } });
      if (existUser) {
        return res.status(400).json({error: 'User with equal email already exist!'})
      }
    } catch (error) {}

    return res.send(`${email} ${password} ${name}`);
  },
  login: async (req, res, next) => {
    res.send("login");
  },
  getUserById: async (req, res, next) => {
    res.send("get by id");
  },
  updateUser: async (req, res, next) => {
    res.send("updated");
  },
  currentUser: async (req, res, next) => {
    res.send("current user");
  },
};

module.exports = UserController;
