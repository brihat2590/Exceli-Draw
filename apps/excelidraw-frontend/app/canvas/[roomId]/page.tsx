"use client"
import { useEffect, useReducer,useRef } from "react"

export default function Canvas(){
    const CanvasRef=useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
        if(CanvasRef.current){
            const canvas=CanvasRef.current;
            const ctx=canvas.getContext("2d")
            if(!ctx){
                return
            }
            let clicked=false;
            let startX:any;
            let startY:any;

            ctx.strokeRect(25,25,100,100);
            canvas.addEventListener("mousedown",(e)=>{
                clicked=true;
                startX=e.clientX;
                startY=e.clientY;
            })
            canvas.addEventListener("mouseup",(e)=>{
                console.log(e.clientX)
                console.log(e.clientY)
                clicked=false
            })
            canvas.addEventListener("mousemove",(e)=>{
                if(clicked){
                    const width=e.clientX-startX;
                    const height=e.clientY-startY;
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    ctx.strokeRect(startX,startY,width,height)

                }
            })


        }

    },[])
    return(
        <div >
            <canvas ref={CanvasRef} height={500} width={500}></canvas>

        </div>
    )
}