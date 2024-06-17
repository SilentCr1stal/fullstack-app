const prisma = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

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
        return res
          .status(400)
          .json({ error: "User with equal email already exist!" });
      }
      const hashedPassword = await bcrypt.hash(password, 9);
      const png = jdenticon.toPng(name, 200);
      const avatarName = `${name}_${Date.now()}.png`;
      const avatarUrl = path.join(__dirname, "../uploads", avatarName);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          avatarUrl,
        },
      });
      fs.writeFileSync(avatarUrl, png);

      return res.json(user);
    } catch (error) {
      console.error(error);
      await prisma.$disconnect();
      return res.status(500).json({ error: "Internal server error" });
    }

    // return res.send(`${email} ${password} ${name}`);
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email)
      return res.status(400).json({ error: "Email is a require parameter!" });
    if (!password)
      return res.status(400).json({ error: "Password does not be an empty!" });
    try {
      const findExistUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!findExistUser)
        return res
          .status(404)
          .json({ error: "There is no user with such an email" });
      const validPassword = await bcrypt.compare(
        password,
        findExistUser.password
      );
      if (!validPassword)
        return res.status(404).json({ error: "Password is not valid" });

      const token = jwt.sign(
        { userId: findExistUser.id },
        process.env.SECRET_KEY
      );
      return res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server error" });
      await prisma.$disconnect();
    }
  },
  getUserById: async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          followers: true,
          following: true
        }
      });
      if (!user)
        return res.status(404).json({error: 'User does not found'})

      const isFollowing = await prisma.followers.findFirst({
        where: {
          AND: [
            { followerId: userId },
            { followingId: id }
          ]
        }
      })

      return res.json({...user, isFollowing: Boolean(isFollowing)})
    } catch (error) {
      console.error('Error - ', error);
      return res.status(500).json({error: 'Internal server error'})
    }
  },
  updateUser: async (req, res, next) => {
    const { id } = req.params
    const { name, dateOfBirth, bio, location } = req.body

    let filePath
    if (req.file && req.file.path)
      filePath = req.file.path

    if (id !== req.user.userId)
      return res.status(403).json({error: 'No access rights'})

    try {
      // if (email) {
      //   const existingUser = await prisma.user.findUnique({
      //     where: {
      //       email
      //     }
      //   })

      //   if (existingUser && existingUser.id !== id)
      //     res.status(400).json({error: 'Email is already using'})
      // }
      
      const user = await prisma.user.update({
        where: { id },
        data: {
          name: name || undefined,
          bio: bio || undefined,
          dateOfBirth: dateOfBirth || undefined,
          location: location || undefined,
          avatarUrl: filePath ? `/${filePath}` : undefined,
          updatedAt: new Date()
        }
      })

      return res.json(user)
    } catch (error) {
      console.error('Error', error);
      res.status(500).json({error: 'Internal server error'})
    }
  },
  currentUser: async (req, res, next) => {

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.userId
        },
        include: {
          followers: {
            include: {
              follower: true
            }
          },
          following: {
            include: {
              following: true
            }
          }
        }
      })

      return res.json(user)
    } catch (error) {
      console.error("error - ", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getUsers: async (req, res, next) => {
    const users = await prisma.user.findMany({});
    res.send(users);
  },
};

module.exports = UserController;
