"use client";

import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");

  const joinRoom = () => {
    if (roomId.trim()) {
      window.location.href = `/${roomId}`;
    }
  };

  const createRandomRoom = () => {
    const id = Math.random().toString(36).substring(2, 8);
    window.location.href = `/${id}`;
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Code Share 🚀</h1>

      {/* Random Room */}
      <button
        onClick={createRandomRoom}
        className="bg-green-500 px-6 py-2 rounded mb-4"
      >
        Start Instant Session
      </button>

      {/* Join Room */}
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="px-4 py-2 text-black rounded mb-2"
      />

      <button
        onClick={joinRoom}
        className="bg-blue-500 px-6 py-2 rounded"
      >
        Join Room
      </button>
    </div>
  );
}