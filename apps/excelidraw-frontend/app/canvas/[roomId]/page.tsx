"use client"
import { InitDraw } from "@/draw";
import { useEffect, useReducer,useRef } from "react"

export default function Canvas(){
    const CanvasRef=useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
       if(CanvasRef.current){
        InitDraw(CanvasRef.current)

       }
        
       
       
    },[CanvasRef])
    return(
        <div >
            <canvas ref={CanvasRef} height={1080} width={2000}></canvas>

        </div>
    )
}