# MeshVault

## Peer-to-Peer Mesh Communication Platform

MeshVault is an experimental peer-to-peer (P2P) communication system built using WebRTC DataChannels. It explores decentralized messaging, offline chat delivery, and encrypted peer communication without relying on centralized message servers.

The project focuses on networking fundamentals and protocol design, with security and encryption being incrementally enhanced.

## Features

🔗 Peer-to-Peer Mesh Networking using WebRTC

🌐 Decentralized Peer Discovery via WebSocket + UDP broadcast

💬 Real-Time Chat Messaging

📦 Store-and-Forward Chat (offline message delivery)

📁 Encrypted File Transfer for online peers

🔐 Encryption via Web Crypto API (Partial E2EE)

🧠 Message Deduplication

## Encryption Status

Uses AES-GCM encryption through the Web Crypto API

Key exchange handshake is implemented

Full end-to-end encryption is a work in progress

Encryption is currently functional but not fully hardened.

The system is designed to support complete E2EE in future iterations.

 ## Architecture
Browser ↔ Browser  (WebRTC DataChannels)
        ↕
   Signaling Node (WebSocket + UDP)

Signaling is used only for discovery and connection setup

All chat and file data flows peer-to-peer

## Tech Stack

JavaScript (Vanilla)

WebRTC

Web Crypto API

WebSocket

Node.js (signaling)

## Running the Project

Start signaling on one machine: node node-peer.js <ws-port>

Find that machine's LAN IP (example: 192.168.1.42)

Open the frontend on all devices and enter the same signaling endpoint when prompted

Example endpoint: 192.168.1.42:8080

Allow inbound firewall rules for the WebSocket port and UDP 55555 on the signaling host

## Current Limitations

Full end-to-end encryption not finalized

Offline file delivery not supported

No TURN server for NAT traversal

No message acknowledgements yet

## Planned Enhancements

Complete E2EE implementation

ACK-based message delivery

Improved routing and persistence

UI/UX enhancements

## License

This project is licensed under the MIT License.
