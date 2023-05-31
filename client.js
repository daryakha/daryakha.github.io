// Verbindung zum Server herstellen, wenn die Verbindung noch nicht geöffnet ist
if (socket.readyState !== WebSocket.OPEN) {
  socket = io();
}

// Cursor-Objekt erstellen und aktualisieren
const cursor = new Cursor();
document.addEventListener("mousemove", function (event) {
  cursor.updatePosition(event.pageX, event.pageY);
  socket.emit("cursorMove", { x: event.pageX, y: event.pageY });
});

// Empfange Cursor-Bewegungen von anderen Clients
socket.on("remoteCursorMove", function (data) {
  cursor.updateRemotePosition(data.clientId, data.x, data.y);
});

// Cursor-Klasse
function Cursor() {
  this.cursors = {};
  this.colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"]; // Farben für die Cursors
  this.cursorsCount = 0;

  this.createCursor = function (clientId) {
    const cursorDiv = document.createElement("div");
    cursorDiv.classList.add("cursor");
    cursorDiv.style.backgroundColor =
      this.colors[this.cursorsCount % this.colors.length];
    document.getElementById("cursorContainer").appendChild(cursorDiv);
    this.cursors[clientId] = cursorDiv;
    this.cursorsCount++;
  };

  this.updatePosition = function (x, y) {
    this.updateRemotePosition(socket.id, x, y);
    socket.emit("cursorMove", { x, y });
  };

  this.updateRemotePosition = function (clientId, x, y) {
    if (!this.cursors[clientId]) {
      this.createCursor(clientId);
    }
    const cursorDiv = this.cursors[clientId];
    cursorDiv.style.left = x + "px";
    cursorDiv.style.top = y + "px";
  };
}
