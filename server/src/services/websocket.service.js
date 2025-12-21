const { WebSocketServer } = require("ws");

let wss;
const sectorClients = {}; // { sector: Set<ws> }

exports.initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", (message) => {
      const data = JSON.parse(message);

      // client subscribes to sector
      if (data.type === "SUBSCRIBE") {
        const { sector } = data;

        if (!sectorClients[sector]) {
          sectorClients[sector] = new Set();
        }

        sectorClients[sector].add(ws);
        ws.sector = sector;

        console.log(`Client subscribed to sector ${sector}`);
      }
    });

    ws.on("close", () => {
      if (ws.sector && sectorClients[ws.sector]) {
        sectorClients[ws.sector].delete(ws);
      }
    });
  });
};

exports.notifySector = (sector, payload) => {
  const clients = sectorClients[sector];
  if (!clients) return;

  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(payload));
    }
  });
};
