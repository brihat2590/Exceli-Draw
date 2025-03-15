import { useEffect, useRef,useState } from "react"
import { initDraw } from "@/draw";
import {IconButton} from "./Icon";
import { Circle, Icon, Pencil, RectangleHorizontal,Palette } from "lucide-react";

export function Canvas({roomId,socket}:{
    roomId:string,
    socket:WebSocket
}){
    const CanvasRef=useRef<HTMLCanvasElement>(null);
    type shape="rect"|"circle"|"pencil";
    const[selectedtool,setSelectedtool]=useState<shape>("circle");

    const [selectedColor,setSelectedColor]=useState<string>("rgb(255, 255, 255)");
    useEffect(()=>{
            if(CanvasRef.current){
             initDraw(CanvasRef.current,roomId,socket)
     
            }
             
            
            
         },[CanvasRef])
         useEffect(()=>{
            //@ts-ignore
            window.selectedTool=selectedtool;
            //@ts-ignore
            window.selectedColor=selectedColor;
         },[selectedtool,selectedColor])
         
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
        function ColorPicker({ selectedColor, setSelectedColor }: { 
            selectedColor: string, 
            setSelectedColor: (s: string) => void 
        }) {
            return(
                <div className="fixed top-10 right-10 antialiased">
                    <div className=" right-10 top-5   text-white p-2 rounded-md shadow-lg  gap-2 flex items-center">

                        <div className=" rounded-md shadow-lg flex flex-col items-center gap-4">


                            <button className="p-4 rounded-2xl bg-white" onClick={()=>setSelectedColor("rgba(255,255,255,0.5)")} value={selectedColor}></button>
                            <button className="p-4 rounded-2xl bg-green-500" onClick={()=>setSelectedColor("rgba(0,255,0,0.5)")} value={selectedColor}></button>
                            <button className="p-4 rounded-2xl bg-red-500" onClick={()=>setSelectedColor("rgba(255,0,0,0.5)")} value={selectedColor}></button>
                            
                        </div>







                    </div>


                </div>
            )
        }
        
         

    
    return(
        <div >
            <canvas ref={CanvasRef} height={window.innerHeight} width={window.innerWidth}></canvas>
            <Topbar setSelectedtool={setSelectedtool} selectedtool={selectedtool}/>
            <ColorPicker setSelectedColor={setSelectedColor} selectedColor={selectedColor}/>
            

        </div>

    )
}
