import { BACKEND_URL } from "@/config";
import axios from "axios";


type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
    color: string;
} | {
    type: "pencil";
    points: { x: number; y: number }[];
    color: string;
};

type PencilStroke = {
    type: "pencil";
    points: { x: number; y: number }[];
    color: string;
};

function getColor(){
    //@ts-ignore
    return window.selectedColor || "rgba(255,255,255,0.5)";
    
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");
    let existingShapes: Shape[] = await getExistingShapes(roomId);

    if (!ctx) return;

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape.shape);
            clearCanvas(existingShapes, canvas, ctx);
        }
    };

    let isDrawing = false;
    let currentStroke: PencilStroke | null = null;

    clearCanvas(existingShapes, canvas, ctx);
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
        // @ts-ignore
        if (window.selectedTool === "pencil") {
            currentStroke = {
                type: "pencil",
                points: [{ x: e.offsetX, y: e.offsetY }],
                color: getColor()
            };
            ctx.beginPath();
            ctx.strokeStyle = getColor();
            ctx.lineWidth = 2;
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    });

    canvas.addEventListener("mouseup", (e) => {
        if (!isDrawing) return;
        isDrawing = false;
        // @ts-ignore
        const selectedTool = window.selectedTool;
        let shape: Shape | null = null;

        if (selectedTool === "rect") {
            const width = e.offsetX - startX;
            const height = e.offsetY - startY;
            if (width !== 0 && height !== 0) {  // Only create shape if it has size
                shape = {
                    type: "rect",
                    x: startX,
                    y: startY,
                    width,
                    height,
                    color: getColor()
                };
            }
        } else if (selectedTool === "circle") {
            const radius = Math.sqrt(
                Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
            );
            if (radius > 0) {  // Only create shape if it has size
                shape = {
                    type: "circle",
                    centerX: startX,
                    centerY: startY,
                    radius,
                    color: getColor()
                };
            }
        } else if (selectedTool === "pencil" && currentStroke) {
            if (currentStroke.points.length > 1) {  // Only create shape if it has multiple points
                shape = currentStroke;
            }
        }

        if (shape) {
            existingShapes.push(shape);
            // Send the shape only once when it's finalized
            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({ shape }),
                roomId
            }));
            // Redraw canvas with the new shape
            clearCanvas(existingShapes, canvas, ctx);
        }
        currentStroke = null;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;
        // @ts-ignore
        const selectedTool = window.selectedTool;

        if (selectedTool === "pencil" && currentStroke) {
            currentStroke.points.push({ x: e.offsetX, y: e.offsetY });
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = currentStroke.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (selectedTool === "rect" || selectedTool === "circle") {
            // Clear only the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(0, 0, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Redraw existing shapes first
            existingShapes.forEach((shape) => {
                ctx.strokeStyle = shape.color;
                if (shape.type === "rect") {
                    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                } else if (shape.type === "circle") {
                    ctx.beginPath();
                    ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.closePath();
                } else if (shape.type === "pencil") {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    shape.points.forEach((point, index) => {
                        if (index === 0) ctx.moveTo(point.x, point.y);
                        else ctx.lineTo(point.x, point.y);
                    });
                    ctx.stroke();
                    ctx.closePath();
                }
            });

            // Draw the preview shape
            const currentColor = getColor();
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = 1;

            if (selectedTool === "rect") {
                ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
            } else {  // circle
                const radius = Math.sqrt(
                    Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
                );
                ctx.beginPath();
                ctx.arc(startX, startY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
            }
        }
    });

    canvas.addEventListener("mouseleave", () => {
        isDrawing = false;
    });
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach((shape) => {
        ctx.strokeStyle = shape.color;
        if (shape.type === "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        } else if (shape.type === "pencil") {
            ctx.beginPath();
            ctx.lineWidth = 2;
            shape.points.forEach((point, index) => {
                if (index === 0) ctx.moveTo(point.x, point.y);
                else ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
            ctx.closePath();
        }
    });
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return res.data.messages.map((msg: { message: string }) => 
        JSON.parse(msg.message).shape
    );
}