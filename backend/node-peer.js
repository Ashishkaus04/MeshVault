// const dgram = require("dgram");
// const WebSocket = require("ws");

// const SIGNALING_PORT = 55555;
// const WS_PORT = Number(process.argv[2]);

// if (!WS_PORT) {
//   console.log("Usage: node node-peer.js <ws-port>");
//   process.exit(1);
// }

// const udp = dgram.createSocket({ type: "udp4", reuseAddr: true });
// let ws = null;

// udp.on("message", (msg) => {
//   if (ws && ws.readyState === WebSocket.OPEN) {
//     ws.send(msg.toString());
//   }
// });

// udp.bind(SIGNALING_PORT, () => {
//   udp.setBroadcast(true);
//   console.log(`📡 UDP signaling on ${SIGNALING_PORT}`);
// });

// const wss = new WebSocket.Server({ port: WS_PORT });

// wss.on("connection", (socket) => {
//   ws = socket;
//   console.log(`🌐 Browser connected on WS ${WS_PORT}`);

//   socket.on("message", (msg) => {
//     try {
//       const data = JSON.parse(msg);
//       // Broadcast to all other clients
//       wss.clients.forEach((client) => {
//         if (client !== socket && client.readyState === WebSocket.OPEN) {
//           client.send(msg);
//         }
//       });
//     } catch (e) {
//       console.error("Message parse error:", e);
//     }
//   });

//   socket.on("close", () => {
//     console.log(`🔌 Browser disconnected from WS ${WS_PORT}`);
//   });

//   socket.on("error", (error) => {
//     console.error(`❌ WebSocket error on ${WS_PORT}:`, error.message);
//   });
// });

// console.log(`🚀 Signaling server running on WS ${WS_PORT}`);



const dgram = require("dgram");
const WebSocket = require("ws");

const SIGNALING_PORT = 55555;
const WS_PORT = Number(process.argv[2]);
const WS_HOST = process.argv[3] || "0.0.0.0";

if (!WS_PORT) {
  console.log("Usage: node node-peer.js <ws-port> [ws-host]");
  process.exit(1);
}

const udp = dgram.createSocket({ type: "udp4", reuseAddr: true });

udp.on("message", (msg) => {
  const payload = msg.toString();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
});

udp.bind(SIGNALING_PORT, "0.0.0.0", () => {
  udp.setBroadcast(true);
  console.log(`📡 UDP signaling on 0.0.0.0:${SIGNALING_PORT}`);
});

const wss = new WebSocket.Server({ host: WS_HOST, port: WS_PORT });

wss.on("connection", (socket) => {
  console.log(`🌐 Browser connected on WS ${WS_HOST}:${WS_PORT}`);

  socket.on("message", (data) => {
    udp.send(
      Buffer.from(data.toString()),
      SIGNALING_PORT,
      "255.255.255.255"
    );
  });

  socket.on("close", () => {
    console.log(`🔌 Browser disconnected from WS ${WS_HOST}:${WS_PORT}`);
  });

  socket.on("error", (error) => {
    console.error(`❌ WebSocket error on ${WS_HOST}:${WS_PORT}:`, error.message);
  });
});

console.log(`🚀 Signaling server listening on ws://${WS_HOST}:${WS_PORT}`);