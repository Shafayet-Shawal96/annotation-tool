import React, { useEffect, useState } from "react";
import ZoomableContainer from "./ZoomableContainer";

type Position = {
  x: number;
  y: number;
};

function App() {
  const [position, setPosition] = useState<Position>({
    x: window.innerWidth / 2 - 300,
    y: window.innerHeight / 2 - 450,
  });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!e.ctrlKey) return;
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!e.ctrlKey) return;
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey) {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="bg-[#374151] w-screen h-screen relative overflow-hidden"
    >
      <ZoomableContainer>
        <div
          onMouseDown={handleMouseDown}
          className="absolute w-[600px] h-[900px] cursor-grab"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
            backgroundImage: `url('/annotate.jpg')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            cursor: isCtrlPressed ? "grab" : "auto",
            opacity: isCtrlPressed ? "70%" : "100%",
          }}
        ></div>
      </ZoomableContainer>
    </div>
  );
}

export default App;
