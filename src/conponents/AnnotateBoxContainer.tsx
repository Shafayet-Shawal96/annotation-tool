import { useCallback, useRef, useState } from "react";

interface Box {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

function AnnotateBoxContainer({
  scale,
  activity,
  setActivity,
}: {
  scale: number;
  isCtrlPressed: boolean;
  activity: "" | "isDrawing" | "isDragging" | "isResizing";
  setActivity: React.Dispatch<
    React.SetStateAction<"" | "isDrawing" | "isDragging" | "isResizing">
  >;
}) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseDown = (e: React.MouseEvent) => {
    // e.stopPropagation();

    if (activity == "" && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      console.log(
        scale,
        e.clientX,
        containerRect.left,
        e.clientX - containerRect.left
      );
      setCurrentBox({
        id: boxes.length + 1,
        x: e.clientX - containerRect.left,
        y: e.clientX - containerRect.top,
        width: 0,
        height: 0,
      });

      setActivity("isDrawing");
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (activity !== "" && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const currentX = Math.max(
          Math.min(e.clientX - containerRect.left, containerRect.width),
          0
        );
        const currentY = Math.max(
          Math.min(e.clientY - containerRect.top, containerRect.height),
          0
        );

        if (activity === "isDrawing" && currentBox) {
          setCurrentBox({
            ...currentBox,
            width: currentX - currentBox.x,
            height: currentY - currentBox.y,
            x: currentX - currentBox.x < 0 ? currentX : currentBox.x,
            y: currentY - currentBox.y < 0 ? currentY : currentBox.y,
          });
        }
      }
    },
    [activity, currentBox, setCurrentBox]
  );

  const handleMouseUp = () => {
    if (activity === "isDrawing" && currentBox) {
      console.log(currentBox);
      setBoxes((prev) => [...prev, currentBox]);
      setCurrentBox(null);
      setActivity("");
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="w-full h-full relative"
    >
      {boxes.map((box) => (
        <div
          key={box.id}
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: Math.abs(box.width),
            height: Math.abs(box.height),
            backgroundColor: "rgba(0, 150, 255, 0.3)",
            border: "1px solid #0096ff",
          }}
        />
      ))}
      {currentBox && (
        <div
          style={{
            position: "absolute",
            left: currentBox.x,
            top: currentBox.y,
            width: Math.abs(currentBox.width),
            height: Math.abs(currentBox.height),
            backgroundColor: "rgba(0, 150, 255, 0.3)",
            border: "1px dashed #0096ff",
          }}
        />
      )}
    </div>
  );
}

export default AnnotateBoxContainer;
