import React, { useRef, useState, useEffect } from "react";

const CanvasZoom: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1); // State to manage the zoom level

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Apply the scale transformation for zoom effect
        context.save(); // Save the current state of the context
        context.scale(scale, scale);

        // Draw content (this example draws a simple rectangle)
        context.fillStyle = "blue";
        context.fillRect(50, 50, 200, 100); // Adjust position as needed

        context.restore(); // Restore the context to default state
      }
    }
  }, [scale]); // Re-run whenever scale changes

  const handleZoomIn = () => setScale((prev) => Math.min(prev * 1.2, 5)); // Maximum zoom
  const handleZoomOut = () => setScale((prev) => Math.max(prev / 1.2, 0.2)); // Minimum zoom

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: "1px solid black" }}
      />
      <div>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
    </div>
  );
};

export default CanvasZoom;
