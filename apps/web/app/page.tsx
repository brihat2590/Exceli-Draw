"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const[roomId,setRoomId]=useState("")
  const router=useRouter();
  return (
    <div style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center"
    }} >
      <div>
        <input value={roomId} type="text" placeholder="text-message" onChange={(e)=>{
          setRoomId(e.target.value)
        }}></input>
        <button onClick={()=>{
          router.push(`/room/${roomId}`)
        }}>Join-room</button>
      </div>
      
      
    </div>
  );
}
