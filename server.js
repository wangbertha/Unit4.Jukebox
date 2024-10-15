// Express app setup
const express = require("express");
const app = express();
const PORT = 3000;

// Request logger
app.use(require("morgan")("dev"));

app.use(express.json());

// Routes
app.use("/users", require("./api/users"));
app.use("/playlists", require("./api/playlists"));
app.use("/tracks", require("./api/tracks"));

// Error-handling middleware
app.use((req, res, next) => {
    next({ status: 404, message: "Endpoint not found." });
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status ?? 500);
    res.json(err.message ?? "Something went wrong.");
});

// Listener for the express app
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});