"use client"
import { WS_URL } from "./config"
import { useEffect, useState } from "react"
import { Canvas } from "./Canvas"

export function RoomCanvas({ roomId }:{
    roomId:string
}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        

        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MGM0YjFkMC1hM2E0LTQ5ODItYWRjNC04M2I1OWYxNGE1YzUiLCJpYXQiOjE3MzkzNzU4MTV9.8cJOjgzEPbrh0cTpmD-Wz07eb9HYJWwGGuAF7Z-C5ck`);

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join-room",
                roomId: roomId
            });
            console.log("Sending:", data);
            ws.send(data);
        };

        ws.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket Disconnected");
            setSocket(null);
        };

        // Cleanup function to close the WebSocket when unmounting
        return () => {
            ws.close();
        };
    }, [roomId]); // Add `roomId` as a dependency

    if (!socket) {
        return (
            <div className="h-screen flex justify-center items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-center font-semibold shadow-md animate-pulse">
                Connecting to the server...
            </div>
        );
    }

    return (
        <div>
            <Canvas roomId={roomId} socket={socket} />
        </div>
    );
}
