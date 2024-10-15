const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");

const seed = async (numUsers, numPlaylists, numTracks) => {
  // Create Users
  const users = Array.from({ length: numUsers }, (_, i) => ({
    username: faker.internet.userName(),
  }));
  await prisma.user.createMany({ data: users });

  // Create Tracks
  const tracks = Array.from({ length: numTracks }, (_, i) => ({
    name: faker.music.songName(),
  }));
  await prisma.track.createMany({ data: tracks });

  // Create Playlists and connect to random Users and Tracks
  for (let i=0; i<numPlaylists; i++) {
    const ownerId = Math.floor(Math.random() * numUsers) + 1;
    const tracks = Array.from({ length: 8 }, () => ({
        id: Math.floor(Math.random() * numTracks) + 1,
    }))
    const genre = faker.music.genre();
    await prisma.playlist.create({
        data: {
            name: `${genre} ${i+1}`,
            description: `This playlist includes 8 songs across the ${genre} genre. Grab your favorite drink, company, and bask in all the feels.`,
            ownerId: ownerId,
            tracks: {
                connect: tracks,
            },
        },
    });
  }
};
seed(5, 10, 20)
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });