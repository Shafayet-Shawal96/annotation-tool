import React, { useState, useRef, useCallback } from "react";

interface Box {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

type ResizeDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const DrawAndMoveBoxes: React.FC = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const selectedBoxRef = useRef<Box | null>(null);
  const resizeDirectionRef = useRef<ResizeDirection | null>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container
  const scale = 1.5; // Example scale factor, adjust as needed

  // Handle mouse down to start drawing a new box
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDragging && !isResizing) {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const startX = Math.max((e.clientX - containerRect.left) / scale, 0);
      const startY = Math.max((e.clientY - containerRect.top) / scale, 0);

      setCurrentBox({
        id: boxes.length + 1,
        x: startX,
        y: startY,
        width: 0,
        height: 0,
      });

      setIsDrawing(true);
    }
  };

  // Handle mouse move to resize the current box while drawing or resizing
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const currentX = Math.max(
        Math.min(
          (e.clientX - containerRect.left) / scale,
          containerRect.width / scale
        ),
        0
      );
      const currentY = Math.max(
        Math.min(
          (e.clientY - containerRect.top) / scale,
          containerRect.height / scale
        ),
        0
      );

      if (isDrawing && currentBox) {
        const newWidth = currentX - currentBox.x;
        const newHeight = currentY - currentBox.y;

        // Adjust position for negative width and height (left-to-right and bottom-to-top drawing)
        setCurrentBox({
          ...currentBox,
          width: newWidth,
          height: newHeight,
          x: newWidth < 0 ? currentX : currentBox.x,
          y: newHeight < 0 ? currentY : currentBox.y,
        });
      }

      if (isDragging && selectedBoxRef.current) {
        const deltaX = e.movementX / scale;
        const deltaY = e.movementY / scale;

        setBoxes((prevBoxes) =>
          prevBoxes.map((box) => {
            if (box.id === selectedBoxRef.current!.id) {
              const newX = Math.max(
                0,
                Math.min(
                  box.x + deltaX,
                  containerRect.width / scale - Math.abs(box.width)
                )
              );
              const newY = Math.max(
                0,
                Math.min(
                  box.y + deltaY,
                  containerRect.height / scale - Math.abs(box.height)
                )
              );
              return {
                ...box,
                x: newX,
                y: newY,
              };
            }
            return box;
          })
        );
      }

      if (isResizing && selectedBoxRef.current && resizeDirectionRef.current) {
        setBoxes((prevBoxes) =>
          prevBoxes.map((box) => {
            if (box.id === selectedBoxRef.current!.id) {
              const newBox = { ...box };

              switch (resizeDirectionRef.current) {
                case "top-left": {
                  const newX = Math.min(currentX, box.x + box.width);
                  const newY = Math.min(currentY, box.y + box.height);
                  newBox.width = box.x + box.width - newX;
                  newBox.height = box.y + box.height - newY;
                  newBox.x = newX;
                  newBox.y = newY;
                  break;
                }
                case "top-right": {
                  const newY = Math.min(currentY, box.y + box.height);
                  newBox.width = Math.max(currentX - box.x, 0);
                  newBox.height = box.y + box.height - newY;
                  newBox.y = newY;
                  break;
                }
                case "bottom-left": {
                  const newX = Math.min(currentX, box.x + box.width);
                  newBox.width = box.x + box.width - newX;
                  newBox.height = Math.max(currentY - box.y, 0);
                  newBox.x = newX;
                  break;
                }
                case "bottom-right": {
                  newBox.width = Math.max(currentX - box.x, 0);
                  newBox.height = Math.max(currentY - box.y, 0);
                  break;
                }
              }

              return newBox;
            }
            return box;
          })
        );
      }
    },
    [isDrawing, currentBox, isDragging, isResizing, scale]
  );

  // Handle mouse up to finish drawing, moving, or resizing
  const handleMouseUp = () => {
    if (isDrawing && currentBox) {
      const normalizedBox = {
        ...currentBox,
        width: Math.abs(currentBox.width),
        height: Math.abs(currentBox.height),
        x:
          currentBox.width < 0 ? currentBox.x + currentBox.width : currentBox.x,
        y:
          currentBox.height < 0
            ? currentBox.y + currentBox.height
            : currentBox.y,
      };

      setBoxes((prevBoxes) => [...prevBoxes, normalizedBox]);
      setIsDrawing(false);
      setCurrentBox(null);
    }

    if (isDragging) {
      setIsDragging(false);
      selectedBoxRef.current = null;
    }

    if (isResizing) {
      setIsResizing(false);
      resizeDirectionRef.current = null;
    }
  };

  // Handle mouse down on an existing box to start dragging it
  const handleBoxMouseDown = (box: Box, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    selectedBoxRef.current = box;
  };

  // Handle mouse down on a resize handle
  const handleResizeMouseDown = (
    box: Box,
    direction: ResizeDirection,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeDirectionRef.current = direction;
    selectedBoxRef.current = box;
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "80vw",
        height: "80vh",
        backgroundColor: "#f0f0f0",
        border: "2px solid #ccc",
        margin: "auto",
        transform: `scale(${scale})`, // Scale the container
        transformOrigin: "top left", // Set the transform origin to top-left for consistent scaling
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {boxes.map((box) => (
        <div
          key={box.id}
          style={{
            position: "absolute",
            left: box.x * scale,
            top: box.y * scale,
            width: Math.abs(box.width) * scale,
            height: Math.abs(box.height) * scale,
            backgroundColor: "rgba(0, 150, 255, 0.5)",
            border: "1px solid #0096ff",
          }}
        >
          <div
            onMouseDown={(e) => handleBoxMouseDown(box, e)}
            style={{ width: "100%", height: "100%", cursor: "move" }}
          />
          {/* Resize handles */}
          <div
            onMouseDown={(e) => handleResizeMouseDown(box, "top-left", e)}
            style={handleStyle("top-left")}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(box, "top-right", e)}
            style={handleStyle("top-right")}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(box, "bottom-left", e)}
            style={handleStyle("bottom-left")}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(box, "bottom-right", e)}
            style={handleStyle("bottom-right")}
          />
        </div>
      ))}

      {currentBox && (
        <div
          style={{
            position: "absolute",
            left: currentBox.x * scale,
            top: currentBox.y * scale,
            width: Math.abs(currentBox.width) * scale,
            height: Math.abs(currentBox.height) * scale,
            backgroundColor: "rgba(0, 150, 255, 0.5)",
            border: "1px solid #0096ff",
          }}
        />
      )}
    </div>
  );
};

const handleStyle = (position: ResizeDirection) => {
  const style: React.CSSProperties = {
    position: "absolute",
    width: "10px",
    height: "10px",
    backgroundColor: "#0096ff",
    cursor: `${position}-resize`,
  };

  switch (position) {
    case "top-left":
      style.top = "-5px";
      style.left = "-5px";
      break;
    case "top-right":
      style.top = "-5px";
      style.right = "-5px";
      break;
    case "bottom-left":
      style.bottom = "-5px";
      style.left = "-5px";
      break;
    case "bottom-right":
      style.bottom = "-5px";
      style.right = "-5px";
      break;
  }

  return style;
};

export default DrawAndMoveBoxes;
