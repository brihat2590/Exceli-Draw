export function InitDraw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Shape = 
        | { type: "rect"; x: number; y: number; width: number; height: number }
        | { type: "circle"; centerX: number; centerY: number; radius: number };

    let existingShapes: Shape[] = [];
    let isDrawing = false;
    let startX = 0, startY = 0;

    // Set canvas background
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Event Listeners
    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseup", (e) => {
        if (!isDrawing) return;
        isDrawing = false;

        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        const width = endX - startX;
        const height = endY - startY;

        existingShapes.push({ type: "rect", x: startX, y: startY, width, height });
        clearCanvas(existingShapes, canvas, ctx);
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        const width = endX - startX;
        const height = endY - startY;

        clearCanvas(existingShapes, canvas, ctx);

        ctx.strokeStyle = "rgba(255,255,255)";
        ctx.strokeRect(startX, startY, width, height);
    });

    function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                ctx.strokeStyle = "rgba(255, 255, 255)";
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
        });
    }
}
