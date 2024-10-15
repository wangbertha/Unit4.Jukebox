const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

// GET all users
router.get("/", async (req, res, next) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (e) {
        next(e)
    }
});

// GET user with given id
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: +id },
            include: { playlists: true },
        });
        res.json(user);
    } catch (e) {
        next(e)
    }
});