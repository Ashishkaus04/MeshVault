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
const os = require("os");

const SIGNALING_PORT = 55555;
const WS_PORT = Number(process.argv[2]) || 8080;
const WS_HOST = process.argv[3] || "0.0.0.0";

if (!WS_PORT) {
  console.log("Usage: node node-peer.js [ws-port] [ws-host]");
  console.log("Example: node node-peer.js 8080");
  process.exit(1);
}

// Get local network IPs
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  Object.keys(interfaces).forEach(name => {
    interfaces[name].forEach(iface => {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    });
  });
  
  return ips;
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

let connectedClients = 0;

wss.on("connection", (socket) => {
  connectedClients++;
  console.log(`🌐 Browser connected [${connectedClients} total]`);

  socket.on("message", (data) => {
    const payload = data.toString();

    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  });

  socket.on("close", () => {
    connectedClients--;
    console.log(`🔌 Browser disconnected [${connectedClients} total]`);
  });

  socket.on("error", (error) => {
    console.error(`❌ WebSocket error:`, error.message);
  });
});

// Display server info
console.log(`\n${'='.repeat(60)}`);
console.log(`🚀 MeshVault Signaling Server`);
console.log(`${'='.repeat(60)}`);
console.log(`📡 WebSocket server listening on port: ${WS_PORT}`);
console.log(`\n📍 Use any of these addresses from other devices:\n`);

const localIPs = getLocalIPs();
if (localIPs.length > 0) {
  localIPs.forEach(ip => {
    console.log(`   ws://${ip}:${WS_PORT}`);
  });
} else {
  console.log(`   ws://localhost:${WS_PORT} (same machine only)`);
}

console.log(`\n💡 On your other device, enter the address that matches your network`);
console.log(`   (usually the one starting with 192.168.x.x or 10.x.x.x)`);
console.log(`${'='.repeat(60)}\n`);