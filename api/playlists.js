const express = require("express");
const prisma = require("../prisma");
const router = express.Router();
module.exports = router;

// GET all playlists
router.get("/", async (req, res, next) => {
    try {
        const playlists = await prisma.playlist.findMany();
        res.json(playlists);
    } catch (e) {
        next(e);
    }
});

// POST new playlist
router.post("/", async (req, res, next) => {
    try {
        // Check for invalid inputs (Ex. Body shape, invalid user, invalid track)
        const { name, description, ownerId, trackIds } = req.body;
        if (!name || !description || !ownerId || !trackIds) {
            return next({ status: 400, message: "New playlist requires: name, description, ownerId, and trackIds"});
        }
        const owner = await prisma.user.findUniqueOrThrow({
            where: { id: +ownerId },
        })
        for (const id of trackIds) {
            await prisma.track.findUniqueOrThrow({
                where: { id: id },
            })
        }
        // Create new playlist with inputs and return new playlist with tracks
        const playlist = await prisma.playlist.create({
            data: {
                name: name,
                description: description,
                ownerId: owner.id,
                tracks: {
                    connect: trackIds.map((id) => ({ id })),
                },
            },
            include: {
                tracks: true,
            },
        })
        res.json(playlist)
    } catch (e) {
        next(e);
    }
})

// GET playlist with given id
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const playlist = await prisma.playlist.findUniqueOrThrow({
            where: { id: +id },
            include: { tracks: true },
        });
        res.json(playlist);
    } catch (e) {
        next(e);
    }
});