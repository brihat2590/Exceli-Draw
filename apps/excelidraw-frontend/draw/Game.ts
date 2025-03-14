import { initDraw } from ".";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} |{
    type:"pencil",
    startX:number,
    startY:number,
    endX:number,
    endY:number
}

export class Game{
    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    private existingShapes:Shape[];
    private roomId:string
    private socket:WebSocket;
    
    constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d")!;
        this.roomId=roomId;
        this.initDraw();
        this.socket=socket
        
        this.existingShapes=[];

        
    }
    async initDraw(){
        this.existingShapes=await getExistingShapes(this.roomId);

            
    }
}