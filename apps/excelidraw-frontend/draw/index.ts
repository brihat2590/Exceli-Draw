import { BACKEND_URL } from "@/config";
import axios from "axios";

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
} | {
    type: "pencil";
    points: { x: number; y: number }[];
};

type PencilStroke = {
    type: "pencil";
    points: { x: number; y: number }[];
};

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
                points: [{ x: e.offsetX, y: e.offsetY }]
            };
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255)";
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
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                width,
                height
            };
        } else if (selectedTool === "circle") {
            const radius = Math.sqrt(
                Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
            );
            shape = {
                type: "circle",
                centerX: startX,
                centerY: startY,
                radius
            };
        } else if (selectedTool === "pencil" && currentStroke) {
            shape = currentStroke;
        }

        if (shape) {
            existingShapes.push(shape);
            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({ shape }),
                roomId
            }));
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
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (selectedTool === "rect") {
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.lineWidth = 1;
            ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
        } else if (selectedTool === "circle") {
            clearCanvas(existingShapes, canvas, ctx);
            const radius = Math.sqrt(
                Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
            );
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
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
        ctx.strokeStyle = "rgba(255, 255, 255)";
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