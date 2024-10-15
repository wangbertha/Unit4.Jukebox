const express = require("express");
const prisma = require("../prisma");
const router = express.Router();
module.exports = router;

// GET all tracks
router.get("/", async (req, res, next) => {
    try {
        const tracks = await prisma.track.findMany();
        res.json(tracks);
    } catch (e) {
        next(e)
    }
});

// GET track with given id
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const track = await prisma.track.findUniqueOrThrow({
            where: { id: +id },
            include: { playlists: true },
        });
        res.json(track);
    } catch (e) {
        next(e)
    }
});