# MeshVault

## Peer-to-Peer Mesh Communication Platform

MeshVault is an experimental peer-to-peer (P2P) communication system built using WebRTC DataChannels. It explores decentralized messaging, offline chat delivery, and encrypted peer communication without relying on centralized message servers.

The project focuses on networking fundamentals and protocol design, with security and encryption being incrementally enhanced.

## Features

🔗 Peer-to-Peer Mesh Networking using WebRTC

🌐 Decentralized Peer Discovery via WebSocket signaling

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
   Signaling Node (WebSocket)

Signaling is used only for discovery and connection setup

All chat and file data flows peer-to-peer

## Tech Stack

JavaScript (Vanilla)

WebRTC

Web Crypto API

WebSocket

Node.js (signaling)

## Running the Project

Use one laptop as the signaling host, then connect the second laptop to that same IP over the hotspot.

On the signaling host laptop:

npm --prefix backend start

Start the frontend dev server on the same laptop:

npm --prefix frontend run dev

Find the signaling host laptop LAN IP on the hotspot network, for example 192.168.1.42.

Open the frontend from both laptops using the same frontend URL:

http://192.168.1.42:3000

When prompted on each laptop, enter the signaling endpoint hosted by the backend machine:

192.168.1.42:8080

Allow inbound firewall rules on the signaling host laptop:

TCP 8080 (or chosen WS port)

If you open the frontend from a different machine, do not leave the signaling host as localhost; it must be the LAN IP of the laptop running npm --prefix backend start.

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