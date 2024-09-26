import React, { useState, useRef } from "react";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const DrawingApp: React.FC = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;

      setCurrentBox({
        x: startX,
        y: startY,
        width: 0,
        height: 0,
      });

      isDrawing.current = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !currentBox) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      setCurrentBox({
        ...currentBox,
        width: endX - currentBox.x,
        height: endY - currentBox.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (currentBox) {
      setBoxes([...boxes, currentBox]);
      setCurrentBox(null);
      isDrawing.current = false;
    }
  };

  const drawBoxes = (ctx: CanvasRenderingContext2D) => {
    boxes.forEach((box) => {
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });

    if (currentBox) {
      ctx.strokeRect(
        currentBox.x,
        currentBox.y,
        currentBox.width,
        currentBox.height
      );
    }
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBoxes(context);
      }
    }
  });

  return (
    <div className="bg-blue-400">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default DrawingApp;
