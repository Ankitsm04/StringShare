"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Editor from "@monaco-editor/react";

export default function RoomPage() {
  const params = useParams();
  const id = params?.id as string;
  const socketRef = useRef<WebSocket | null>(null);
  const [code, setCode] = useState("// Start coding...");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  // ✅ Fetch existing code FIRST
  fetch(`${backendUrl}/room/${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.code) {
        setCode(data.code);
      }
    });

  const wsUrl = backendUrl.replace(/^http/, "ws");
  const socket = new WebSocket(`${wsUrl}/ws/${id}`);
  socketRef.current = socket;

  socket.onmessage = (event) => {
    setCode(event.data);
  };

  return () => {
    socket.close();
  };
}, [id, backendUrl]);

  const handleChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.send(newCode);
      }
    }, 100); // send after 300ms pause
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