"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Editor from "@monaco-editor/react";

export default function RoomPage() {
  const { id } = useParams();
  const socketRef = useRef<WebSocket | null>(null);
  const [code, setCode] = useState("// Start coding...");

  useEffect(() => {
  // ✅ Fetch existing code FIRST
  fetch(`http://127.0.0.1:8000/room/${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.code) {
        setCode(data.code);
      }
    });

  const socket = new WebSocket(`ws://127.0.0.1:8000/ws/${id}`);
  socketRef.current = socket;

  socket.onmessage = (event) => {
    setCode(event.data);
  };

  return () => {
    socket.close();
  };
}, [id]);

  const handleChange = (value: string | undefined) => {
    setCode(value || "");

    if (socketRef.current) {
      socketRef.current.send(value || "");
    }
  };

  return (
    <div className="h-screen bg-black text-white">
      <div className="p-4 text-xl font-bold">Room: {id}</div>

      <Editor
        height="90vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleChange}
      />
    </div>
  );
}