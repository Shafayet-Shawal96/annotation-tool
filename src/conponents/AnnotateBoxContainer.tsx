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
  const selectedBoxRef = useRef<Box | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.ctrlKey) return;
    e.stopPropagation();

    if (activity == "" && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setCurrentBox({
        id: boxes.length + 1,
        x: (e.clientX - containerRect.left) / scale,
        y: (e.clientX - containerRect.top) / scale,
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
          Math.min(
            (e.clientX - containerRect.left) / scale,
            containerRect.width
          ),
          0
        );
        const currentY = Math.max(
          Math.min(
            (e.clientY - containerRect.top) / scale,
            containerRect.height
          ),
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

        if (activity === "isDragging" && selectedBoxRef.current) {
          const deltaX = e.movementX / scale;
          const deltaY = e.movementY / scale;

          setBoxes((prevBoxes) =>
            prevBoxes.map((box) => {
              if (box.id === selectedBoxRef.current?.id) {
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
      }
    },
    [activity, currentBox, scale, setCurrentBox]
  );

  const handleMouseUp = () => {
    if (activity === "isDrawing" && currentBox) {
      setBoxes((prev) => [...prev, currentBox]);
      setCurrentBox(null);
      setActivity("");
    }
    if (activity === "isDragging") {
      setActivity("");
      selectedBoxRef.current = null;
    }
  };

  const handleBoxMouseDown = (box: Box, e: React.MouseEvent) => {
    if (!e.ctrlKey) return;
    e.stopPropagation();
    setActivity("isDragging");
    selectedBoxRef.current = box;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="w-full h-full relative parent"
    >
      {boxes.map((box) => (
        <div
          key={box.id}
          onMouseDown={(e) => handleBoxMouseDown(box, e)}
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: Math.abs(box.width),
            height: Math.abs(box.height),
            backgroundColor: "rgba(0, 150, 255, 0.3)",
            border: "1px solid #0096ff",
            zIndex: 10,
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
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}

export default AnnotateBoxContainer;
