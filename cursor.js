// Verbindung zum Server herstellen
const socket = io();

// Cursor-Bewegungen empfangen
socket.on("cursorMove", function (data) {
  socket.broadcast.emit("remoteCursorMove", {
    clientId: socket.id,
    x: data.x,
    y: data.y,
  });
});
