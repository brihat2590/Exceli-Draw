import { useEffect, useRef,useState } from "react"
import { initDraw } from "@/draw";
import {IconButton} from "./Icon";
import { Circle, Icon, Pencil, RectangleHorizontal } from "lucide-react";

export function Canvas({roomId,socket}:{
    roomId:string,
    socket:WebSocket
}){
    const CanvasRef=useRef<HTMLCanvasElement>(null);
    type shape="rect"|"circle"|"pencil";
    const[selectedtool,setSelectedtool]=useState<shape>("circle");
    useEffect(()=>{
            if(CanvasRef.current){
             initDraw(CanvasRef.current,roomId,socket)
     
            }
             
            
            
         },[CanvasRef])
         useEffect(()=>{
            //@ts-ignore
            window.selectedTool=selectedtool;
         },[selectedtool])
         function Topbar({ selectedtool, setSelectedtool }: { 
            selectedtool: shape, 
            setSelectedtool: (s: shape) => void 
        }) {
            return ( // ✅ Added return here
                <div className="fixed top-10 left-10 antialiased ">
                    <div className=" left-10 top-5   text-white p-2 rounded-md shadow-lg  gap-2 flex items-center">
                    <IconButton onClick={() => setSelectedtool("pencil")} icon={<Pencil />} activated={selectedtool === "pencil"} />
                    <IconButton onClick={() => setSelectedtool("rect")} icon={<RectangleHorizontal />} activated={selectedtool === "rect"} />
                    <IconButton onClick={() => setSelectedtool("circle")} icon={<Circle />} activated={selectedtool === "circle"} />
                </div>


                </div>
            );
        }
        
         

    
    return(
        <div >
            <canvas ref={CanvasRef} height={window.innerHeight} width={window.innerWidth}></canvas>
            <Topbar setSelectedtool={setSelectedtool} selectedtool={selectedtool}/>
            

        </div>

    )
}
