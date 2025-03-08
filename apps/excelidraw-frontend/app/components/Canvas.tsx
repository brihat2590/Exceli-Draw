import { useEffect, useRef } from "react"
import { initDraw } from "@/draw";

export function Canvas({roomId,socket}:{
    roomId:string,
    socket:WebSocket
}){
    const CanvasRef=useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
            if(CanvasRef.current){
             initDraw(CanvasRef.current,roomId,socket)
     
            }
             
            
            
         },[CanvasRef])
    return(
        <div>
            <canvas ref={CanvasRef} height={1080} width={2000}></canvas>

        </div>

    )
}