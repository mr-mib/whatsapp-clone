const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("🟢 Nouveau client connecté :", socket.id);

  socket.on("send_message", (msg) => {
    console.log("📩 Message reçu :", msg);
    socket.broadcast.emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client déconnecté :", socket.id);
  });
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`✅ Serveur Socket.IO lancé sur http://localhost:${PORT}`);
});
